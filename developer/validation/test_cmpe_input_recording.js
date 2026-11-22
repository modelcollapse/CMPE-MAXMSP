"use strict";
// Runs the actual legacy-JS stack with a simulated native audio/file boundary.
// It tests source ownership, real sample contents, cancellation, async readback,
// and generated graph contracts. It does not run Max or verify a microphone.
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const assert = require("node:assert/strict");
const root = path.resolve(process.argv.slice(2).find(x => x !== "--bundle") || path.join(__dirname, "../.."));
const bundle = process.argv.includes("--bundle");
const patch = JSON.parse(fs.readFileSync(path.join(root, "CMPE_Variety_Pack.maxpat"), "utf8")).patcher;
const moduleNames = ["apg_wave_plan", "apg_render", "cmpe_model", "apg_wave_controller", "cmpe_extension",
  "cmpe_audio_settings", "cmpe_ui_feedback", "cmpe_input_recording"];
const runtime = (bundle ? ["cmpe_variety.js"] : moduleNames.map(n => "developer/" + n + ".js"))
  .map(file => ({file, code: fs.readFileSync(path.join(root, file), "utf8")}));
let scenarios = 0, checks = 0;
const failures = [];
const plain = value => JSON.parse(JSON.stringify(value));
function check(value, label) { checks++; assert.ok(value, label); }
function equal(actual, expected, label) { checks++; assert.deepEqual(plain(actual), plain(expected), label); }
function test(name, fn) { scenarios++; try { fn(); } catch (e) { failures.push({name, message: e.message, stack: e.stack.split("\n").slice(0, 6).join("\n")}); } }

function wav(record, options = {}) {
  const length = record.frames * record.channels * 3, bytes = Buffer.alloc(44 + length);
  bytes.write("RIFF"); bytes.writeUInt32LE(bytes.length - 8, 4); bytes.write("WAVEfmt ", 8);
  bytes.writeUInt32LE(16, 16); bytes.writeUInt16LE(1, 20); bytes.writeUInt16LE(record.channels, 22);
  bytes.writeUInt32LE(record.sr, 24); bytes.writeUInt32LE(record.sr * record.channels * 3, 28);
  bytes.writeUInt16LE(record.channels * 3, 32); bytes.writeUInt16LE(options.bits || 24, 34);
  bytes.write("data", 36); bytes.writeUInt32LE(length, 40);
  for (let i = 0; i < record.frames; i++) for (let ch = 0; ch < record.channels; ch++) {
    const sample = Math.max(-8388608, Math.min(8388607, Math.round(record.data[ch][i] * 8388608)));
    bytes.writeIntLE(sample, 44 + (i * record.channels + ch) * 3, 3);
  }
  return bytes;
}

function host(options = {}) {
  const buffers = new Map(), objects = new Map(), renamed = new Map(), tasks = [], events = [], files = new Map();
  const names = new Set(patch.boxes.map(x => x.box.varname).filter(Boolean));
  for (let i = 0; i < 4; i++) names.add("input_bank" + i);
  for (const name of ["input_recorder", "input_progress", "input_position_peak", "input_progress_tag", "input_position_tag", "input_save_dialog"]) names.add(name);
  for (let i = 1; i <= 3; i++) for (const stem of ["source_record", "source_save", "source_wave", "input_state"]) names.add(stem + i);
  let clock = 0, cpu = 0, c, progressRunning = false, progressTask = null, progressTag = [], positionTag = [];
  const hardware = {on: options.on !== false, sr: options.sr || 2000, driver: 0, option1: 0, option2: 0};
  const recording = {name: "", active: false, start: 0, frames: 0, held: 0, total: 0, stoppedFrames: 0};
  const faults = {allocation: false, crop: false, peak: false, progress: false, write: false, writeCompletion: true,
    allocationDelay: 0, cropDelay: 0, shrinkDelay: 0, peakDelay: 0, peakZero: false, writeDelay: 20, ...options.faults};
  function fresh(name, frames = 1, sr = hardware.sr, channels = 2) {
    return {name, frames, sr, channels, data: Array.from({length: channels}, () => new Float32Array(frames))};
  }
  function after(ms, fn) { const t = new Task(fn, c); t.native = true; t.schedule(ms); return t; }
  function capture() {
    if (!recording.active || !hardware.on) return;
    const b = buffers.get(recording.name); if (!b) return;
    const frames = Math.min(b.frames, Math.max(0, Math.floor((clock + cpu - recording.start) * hardware.sr / 1000)));
    for (let i = recording.frames; i < frames; i++) for (let ch = 0; ch < 2; ch++)
      b.data[ch][i] = options.silent || (options.rightOnly && ch === 0) ? 0 : .3 * Math.sin(i * .11 + ch * .4);
    recording.frames = frames;
    if (frames) recording.held = Math.max(recording.held, (frames - 1) / recording.total);
    if (frames >= recording.total) recording.active = false;
  }
  function phase() { capture(); return recording.active && recording.frames ? (recording.frames - 1) / recording.total : 0; }
  function snapshotTick() {
    if (!progressRunning) return;
    const value = phase(), tag = progressTag.slice();
    if (!faults.progress) c.inputprogress(tag[1], value);
    progressTask = after(50, snapshotTick);
  }
  function menu(kind, full) {
    if (full) { c.audiomenu(kind, "clear"); c.audiomenu(kind, "append", kind === "driver" ? "Core Audio" : "Built-in"); c.audiomenu(kind, "append", "External"); }
    c.audiomenu(kind, "set", hardware[kind]); c.audiovalue(kind, hardware[kind]);
  }
  function message(name, selector, args) {
    events.push({name, selector, args: plain(args), time: clock + cpu});
    if (selector === "name" && /^(source[123]|output_buffer|input_bank[0-3])$/.test(name)) {
      const old = renamed.get(name), b = old && buffers.get(old) || fresh(args[0]);
      if (old) buffers.delete(old); b.name = args[0]; renamed.set(name, args[0]); buffers.set(args[0], b);
    }
    if (renamed.has(name)) {
      const b = () => buffers.get(renamed.get(name));
      if (selector === "sr") b().sr = Number(args[0]);
      if (selector === "sizeinsamps") {
        const apply = () => { const old = b(); buffers.set(old.name, fresh(old.name, Number(args[0]), old.sr, Number(args[1] || old.channels))); };
        if (!faults.allocation || !/^input_bank/.test(name) || Number(args[0]) === 1) {
          if (faults.shrinkDelay && /^input_bank/.test(name) && Number(args[0]) === 1) after(faults.shrinkDelay, apply);
          else if (faults.allocationDelay && /^input_bank/.test(name) && Number(args[0]) > 1) after(faults.allocationDelay, apply);
          else apply();
        }
      }
      if (selector === "clear") b().data.forEach(ch => ch.fill(0));
      if (selector === "crop" && !faults.crop) {
        const original = b(), targetFrames = Math.round((Number(args[1]) - Number(args[0])) * original.sr / 1000);
        const apply = () => {
          const next = fresh(original.name, targetFrames, original.sr, original.channels);
          next.data = original.data.map(ch => ch.slice(0, targetFrames)); buffers.set(original.name, next);
        };
        if (faults.cropDelay) after(faults.cropDelay, apply); else apply();
      }
      if (selector === "writewave") {
        const record = b(), index = Number(name.replace("input_bank", "")), file = args[0];
        after(faults.writeDelay, () => {
          if (!faults.write) files.set(file, wav(record, options.wav || {}));
          if (faults.writeCompletion) c.inputbankdone(index);
        });
      }
    }
    if (name === "input_progress_tag" && selector === "set") progressTag = args.slice();
    if (name === "input_position_tag" && selector === "set") positionTag = args.slice();
    if (name === "input_progress" && ["start", "stop"].includes(selector)) {
      progressRunning = selector === "start"; if (progressTask) progressTask.cancel();
      if (progressRunning) progressTask = after(50, snapshotTick);
    }
    if (name === "input_position_peak" && selector === "bang") {
      capture(); const value = faults.peakZero ? 0 : recording.held, tag = positionTag.slice(); recording.held = 0;
      if (!faults.peak) {
        const reply = () => c.inputposition(tag[1], tag[2], value);
        if (faults.peakDelay) after(faults.peakDelay, reply); else reply();
      }
    }
    if (name === "input_recorder") {
      if (selector === "set") recording.name = args[0];
      if (selector === "int" && Number(args[0]) === 1) {
        const b = buffers.get(recording.name); assert.ok(b && b.frames > 1, "native recorder has allocated buffer");
        recording.active = true; recording.start = clock + cpu; recording.frames = 0; recording.total = b.frames;
      }
      if (selector === "int" && Number(args[0]) === 0) { capture(); recording.active = false; recording.stoppedFrames = recording.frames; }
    }
    if (name === "dsp_info" && selector === "bang") { c.samplerate(hardware.sr); c.dspstate(hardware.on ? 1 : 0); }
    if (name === "audio_driver" && selector === "startwindow" && options.startAudio !== false)
      after(20, () => { hardware.on = true; c.samplerate(hardware.sr); c.dspstate(1); });
    const ad = /^audio_ad_(driver|option1|option2|switch)$/.exec(name);
    if (ad && ["loadbang", "bang", "int"].includes(selector)) {
      const kind = ad[1];
      if (selector === "int") { if (kind === "switch") hardware.on = Number(args[0]) !== 0; else hardware[kind] = Number(args[0]); }
      if (kind === "switch") c.audioswitch(hardware.on ? 1 : 0); else menu(kind, selector === "loadbang");
    }
    const label = /^audio_name_option([12])$/.exec(name);
    if (label && selector === "loadbang") { c.audioname(Number(label[1]), "clear"); c.audioname(Number(label[1]), "append", label[1] === "1" ? "Input Device" : "Output Device"); }
  }
  for (const name of names) objects.set(name, {hidden: 0, message(selector, ...args) { message(name, selector, args); }});
  function MaxBuffer(name) {
    const get = () => { const b = buffers.get(name); assert.ok(b, "buffer exists: " + name); return b; };
    this.framecount = () => get().frames; this.channelcount = () => get().channels; this.length = () => get().frames * 1000 / get().sr;
    this.peek = (channel, first, count = 1) => {
      const b = get(); assert.ok(channel >= 1 && channel <= b.channels && first >= 0 && first + count <= b.frames, "bounded sample read");
      const a = b.data[channel - 1].slice(first, first + count); return count === 1 ? a[0] : Array.from(a);
    };
    this.poke = (channel, first, data) => get().data[channel - 1].set(typeof data === "number" ? [data] : data, first);
  }
  function Task(fn, self) { this.fn = fn; this.self = self; this.active = false; this.due = Infinity;
    this.cancel = () => { this.active = false; }; this.schedule = ms => { this.active = true; this.due = clock + cpu + Number(ms); }; tasks.push(this); }
  function DateFake() { this.getTime = () => { if (c && c.state === "rendering") cpu++; return 1700000000000 + clock + cpu; }; }
  function File(file, access) {
    this.position = 0; this.isopen = access === "write" || files.has(file); if (access === "write") files.set(file, Buffer.alloc(0));
    Object.defineProperty(this, "eof", {get: () => (files.get(file) || Buffer.alloc(0)).length,
      set: n => files.set(file, (files.get(file) || Buffer.alloc(0)).subarray(0, n))});
    this.readbytes = n => { const b = files.get(file).subarray(this.position, this.position + n); this.position += b.length; return Array.from(b); };
    this.writestring = text => { files.set(file, Buffer.concat([files.get(file), Buffer.from(String(text))])); this.position = this.eof; };
    this.readline = max => {
      const b = files.get(file), found = b.indexOf(10, this.position), end = Math.min(found < 0 ? b.length : found, this.position + max);
      const value = b.subarray(this.position, end).toString(); this.position = end + (b[end] === 10 ? 1 : 0); return value;
    };
    this.close = () => { this.isopen = false; };
  }
  c = vm.createContext({patcher: {filepath: "/tmp/CMPE/CMPE_Variety_Pack.maxpat", getnamed: n => objects.get(n) || null},
    arrayfromargs: args => Array.from(args), jsarguments: ["cmpe_variety.js"], Task, Buffer: MaxBuffer, File, Date: DateFake, Math,
    outlet() {}, post() {}, error() {}});
  for (const source of runtime) vm.runInContext(source.code, c, {filename: source.file});
  const next = () => tasks.filter(t => t.active).sort((a, b) => a.due - b.due)[0];
  function advance(ms) {
    const end = clock + cpu + ms; let safety = 0;
    while (next() && next().due <= end) {
      assert.ok(safety++ < 100000, "finite scheduled work"); const t = next(); clock = Math.max(clock + cpu, t.due); cpu = 0;
      capture(); t.active = false; t.fn.call(t.self); clock += cpu; cpu = 0;
    }
    clock = Math.max(clock + cpu, end); cpu = 0; capture();
  }
  function source(slot) {
    const name = renamed.get("source" + (slot + 1)), b = fresh(name, 200 + slot * 37, hardware.sr, slot === 1 ? 2 : 1);
    b.data.forEach((ch, channel) => ch.forEach((_, i) => { ch[i] = .15 * Math.cos(i * .17 + channel); }));
    buffers.set(name, b); c.loaded(slot); return b;
  }
  function ready() { c.loadbang(); advance(50); for (let i = 0; i < 3; i++) source(i); advance(60); return h; }
  function begin(slot = 0) { c.inputrecord(slot); advance(80); check(c.CMPEInputState().phase === "recording", "capture reaches recording after explicit REC"); }
  function finish(ms = 400, slot = 0) { advance(ms); c.inputrecord(slot); advance(250 + faults.cropDelay + faults.peakDelay * 4); }
  function snapshot(slot) { const source = plain(c.sources[slot]); return {source, data: buffers.get(source.name).data.map(ch => Array.from(ch)), path: c.paths[slot]}; }
  const h = {c, faults, hardware, recording, buffers, objects, events, files, tasks, renamed, advance, ready, source, begin, finish, snapshot,
    messages: (name, selector) => events.filter(e => e.name === name && e.selector === selector),
    last: (name, selector) => events.filter(e => e.name === name && e.selector === selector).at(-1)};
  return h;
}

test("native recording graph uses stereo capture, held position, four banks, and the three-outlet save dialog", () => {
  const b = new Map(patch.boxes.map(({box}) => [box.varname || box.id, box]));
  const lines = patch.lines.map(x => x.patchline);
  const edge = (from, outlet, to, inlet = 0) => lines.some(l => l.source[0] === b.get(from)?.id && l.source[1] === outlet && l.destination[0] === b.get(to)?.id && l.destination[1] === inlet);
  check(b.get("input_adc")?.text === "adc~ 1 2", "logical input channels one and two feed capture");
  check(/^record~ .* 2/.test(b.get("input_recorder")?.text || "") && b.get("input_recorder").numinlets === 4, "stereo record~ has two signal and two boundary inlets");
  check(edge("input_adc", 0, "input_recorder", 0) && edge("input_adc", 1, "input_recorder", 1), "stereo ADC is wired to recorder");
  check(b.get("input_position_peak")?.text === "peakamp~ 0" && edge("input_recorder", 0, "input_position_peak"), "held native position survives record~ returning to zero");
  check(edge("input_recorder", 0, "input_progress") && edge("input_position_peak", 0, "input_position_tag"), "progress and tagged final-position paths exist");
  for (let i = 0; i < 4; i++) check(/^buffer~ /.test(b.get("input_bank" + i)?.text || ""), "independent capture bank " + i + " exists");
  check(b.get("input_save_dialog")?.numoutlets === 3, "savedialog has pathname, filetype, and cancel outlets");
  check(edge("input_save_dialog", 0, "input_save_dialog_path") && edge("input_save_dialog", 2, "input_save_cancel") &&
    !edge("input_save_dialog", 1, "input_save_cancel"), "only the rightmost savedialog outlet cancels the pending sample save");
});

test("load does not record or allocate the sixty-second capture buffers", () => {
  const h = host().ready();
  check(h.messages("input_recorder", "int").every(e => e.args[0] === 0), "startup can only stop recording");
  check(h.messages("audio_driver", "startwindow").length === 0, "startup does not enable the microphone DSP");
  for (let i = 0; i < 4; i++) check(!h.messages("input_bank" + i, "sizeinsamps").some(e => e.args[0] > 1), "bank allocation waits for user REC");
});

test("REC records real stereo contents into a temporary bank and commits only after stop and crop", () => {
  const h = host().ready(), before = h.snapshot(0); h.begin(); h.advance(600);
  equal(h.snapshot(0), before, "existing source stays byte-for-byte intact during capture");
  const takeName = h.recording.name; h.c.inputrecord(0); h.advance(20);
  equal(h.snapshot(0), before, "stopping does not publish an unverified take");
  h.advance(250);
  check(h.c.CMPEInputState().phase === "idle" && h.c.sources[0].name === takeName, "finished bank becomes the selected sample atomically");
  check(Math.abs(h.c.sources[0].frames - h.recording.stoppedFrames) <= 1, "trim follows native recorded samples, not JS wall-clock time");
  const b = h.buffers.get(takeName);
  check(b.channels === 2 && b.data[0].some(v => v !== 0) && b.data[1].some(v => v !== 0), "committed source contains captured stereo audio");
  check(h.c.paths[0] === "" && h.c.CMPEInputState().sources[0].unsaved, "temporary take has no misleading file reference");
  check(h.last("source_wave1", "set").args[0] === takeName, "source waveform binds the committed bank at default full-buffer range");
  check(h.messages("source_wave1", "list").length === 0, "link-input lists are not incorrectly sent into the left inlet");
  check(h.c.dirty && !h.recording.active, "new source invalidates generated output and recorder is stopped");
  check(!/Finishing|Recording|Preparing audio input/i.test(String(h.last("render_info", "set").args[0])),
    "visible recording hint is restored after the capture transaction ends");
});

test("explicit STOP finishes a take and all sample-based modes use the shared slots", () => {
  const h = host().ready(); h.c.mode(1); h.begin(2); h.advance(400); h.c.stop(); h.advance(250);
  check(h.c.CMPEInputState().sources[2].recorded, "STOP commits the ISJS third-slot take");
  const name = h.c.sources[2].name; h.c.mode(0); check(h.c.sources[2].name === name, "APG shares the same recorded source");
  for (const mode of [2, 4]) {
    h.c.mode(mode); const count = h.messages("input_recorder", "int").length; h.c.inputrecord(1); h.advance(100);
    check(h.messages("input_recorder", "int").length === count, "single-sample modes reject other slots");
    h.begin(0); h.finish(250, 0); check(h.c.CMPEInputState().sources[0].recorded, "sample one captures in mode " + mode);
  }
  h.c.mode(3); const n = h.messages("input_recorder", "int").length; h.c.inputrecord(0); h.advance(100);
  check(h.messages("input_recorder", "int").length === n, "RMHS offers no input sample capture");
});

test("capturing stops performance before record~ starts and blocks source reads and playback", () => {
  const h = host().ready(); h.c.mode(1); h.c.play(); h.advance(100); check(h.c.state === "live", "fixture starts actual live controller");
  h.begin(0);
  const start = h.messages("input_recorder", "int").find(e => e.args[0] === 1);
  const panic = h.messages("grain_engine", "panic").filter(e => e.time <= start.time).at(-1);
  check(panic && panic.time + 30 <= start.time, "voices stop and fade before capture begins");
  h.c.play(); h.c.loadfile(0, "/tmp/conflicting.wav"); h.c.demos(); h.advance(100);
  check(h.c.state !== "live" && !h.messages("source1", "read").some(e => e.args[0] === "/tmp/conflicting.wav"), "capture blocks reentrant performance and disk reads");
  check(h.last("load1", "ignoreclick").args[0] === 1, "native source control remains locked");
});

test("mode, preset, hardware, sample-rate, DSP-off, and shutdown cancel without replacing the source", () => {
  const actions = [h => h.c.mode(1), h => h.c.presetload(), h => h.c.audiosetup(),
    h => h.c.audiochoose("option1", 1), h => { h.hardware.sr = 44100; h.c.samplerate(44100); },
    h => { h.hardware.on = false; h.c.dspstate(0); }, h => { h.hardware.option1 = 1; h.c.audiovalue("option1", 1); }, h => h.c.shutdown()];
  for (const action of actions) {
    const h = host().ready(), before = h.snapshot(0); h.begin(); h.advance(350); action(h); h.advance(300);
    equal(h.snapshot(0), before, "cancel preserves source bytes and path");
    check(!h.recording.active && h.c.CMPEInputState().phase === "idle", "cancel stops native capture and finishes controller transaction");
  }
});

test("only explicit REC can enable audio and an unavailable DSP never records", () => {
  const h = host({on: false}).ready(); h.c.inputrecord(0); h.advance(150);
  check(h.messages("audio_driver", "startwindow").length === 1 && h.c.CMPEInputState().phase === "recording", "explicit recording starts and verifies audio");
  const failed = host({on: false, startAudio: false}).ready(), before = failed.snapshot(0);
  failed.c.inputrecord(0); failed.advance(5500);
  check(failed.c.CMPEInputState().phase === "idle" && !failed.messages("input_recorder", "int").some(e => e.args[0] === 1), "DSP timeout cannot arm a later recording");
  equal(failed.snapshot(0), before, "DSP timeout preserves original source");
});

test("native capacity and controller deadline stop capture at sixty seconds", () => {
  const h = host().ready(); h.begin(); h.advance(60500);
  check(h.c.CMPEInputState().phase === "idle" && !h.recording.active, "bounded take finishes automatically");
  check(h.c.sources[0].frames === h.hardware.sr * 60, "full native buffer is sixty seconds with no looping overwrite");
  check(h.last("input_recorder", "loop").args[0] === 0 && h.last("input_recorder", "append").args[0] === 0, "native wrap and append are explicitly disabled");
});

test("deferred reset/final position and crop acknowledgements preserve source until ready", () => {
  const h = host({faults: {peakDelay: 15, cropDelay: 120}}).ready(), before = h.snapshot(0);
  h.begin(); h.advance(350); h.c.stop(); h.advance(100);
  equal(h.snapshot(0), before, "deferred crop does not publish early");
  h.advance(400); check(h.c.CMPEInputState().sources[0].recorded, "deferred native replies eventually commit the take");
});

test("missing position, failed allocation, and failed crop do not destroy the previous sample", () => {
  for (const fault of ["peak", "allocation", "crop"]) {
    const h = host().ready(), before = h.snapshot(0); h.faults[fault] = true;
    h.c.inputrecord(0); h.advance(200);
    if (h.c.CMPEInputState().phase === "recording") { h.advance(350); h.c.stop(); }
    h.advance(2200);
    check(h.c.CMPEInputState().phase === "idle", "native " + fault + " failure resolves bounded wait");
    equal(h.snapshot(0), before, "native " + fault + " failure keeps old source");
  }
});

test("stale tagged readbacks and a cancelled pending crop cannot commit into a later take", () => {
  const h = host().ready(); h.begin(); const oldToken = h.c.CMPEInputState().generation;
  h.advance(300); h.faults.cropDelay = 300; h.c.stop(); h.advance(110); h.c.mode(1); h.advance(100);
  const before = h.snapshot(0); h.faults.cropDelay = 0; h.begin(1);
  h.c.inputposition(oldToken, 3, .8); h.c.inputprogress(oldToken, .9); h.advance(150);
  equal(h.snapshot(0), before, "old crop never adopts a cancelled source");
  check(h.c.CMPEInputState().phase === "recording" && h.c.CMPEInputState().elapsedMs < 1000, "stale callbacks cannot finish or age the new capture");
  h.finish(200, 1); check(h.c.CMPEInputState().sources[1].recorded, "unaffected bank completes normally");
});

test("display-only progress cannot authorize a take without authentic stopped peak evidence", () => {
  const h = host({faults: {peakZero: true, progress: true}}).ready(), before = h.snapshot(0);
  h.begin(); h.c.inputprogress(h.c.CMPEInputState().generation, .2); h.c.stop(); h.advance(300);
  equal(h.snapshot(0), before, "zero authoritative peak leaves existing source intact despite plausible display progress");
  check(h.c.CMPEInputState().phase === "idle" && !h.c.CMPEInputState().sources[0].recorded, "unconfirmed take is discarded");
});

test("slower native final readback remains valid without overlapping query IDs", () => {
  const h = host({faults: {peakDelay: 300}}).ready();
  h.c.inputrecord(0); h.advance(400); check(h.c.CMPEInputState().phase === "recording", "deferred peak reset starts the requested recording");
  h.advance(400); h.c.stop(); h.advance(1400);
  check(h.c.CMPEInputState().sources[0].recorded, "bounded wait accepts a slow final peak and subsequent stopped reports");
});

test("a deferred cleanup shrink is reserved and cannot truncate a later capture", () => {
  const h = host({faults: {shrinkDelay: 500}}).ready(); h.begin(); const old = h.recording.name;
  h.c.mode(1); h.advance(120); h.begin(0); const next = h.recording.name;
  check(next !== old, "pending cleanup bank is not selected for the next take");
  h.advance(600);
  check(h.buffers.get(next).frames === h.hardware.sr * 60, "late old shrink cannot change current recording capacity");
  h.finish(100); check(h.c.CMPEInputState().sources[0].recorded, "the next take still commits correctly");
});

test("input capture locks the actual steps and editing handlers, then restores them", () => {
  const h = host().ready(), repetitions = plain(h.c.repetitions), pitch = h.c.pitchRange;
  h.begin();
  for (const name of ["repeat_down1", "repeat_up3", "pitch_down", "pitch_up", "param0", "mode_menu", "xy_pad", "loop_toggle", "clear_button", "save_button"])
    check(h.last(name, "ignoreclick").args[0] === 1, "capture locks native " + name);
  h.c.repeatstep(0, 1); h.c.pitchstep(.1); h.c.repeats(1, 19); h.c.pitch(.95); h.c.newpiece();
  equal(h.c.repetitions, repetitions, "programmatic step and repeat messages cannot edit during capture");
  check(h.c.pitchRange === pitch && h.c.state !== "rendering", "pitch and generation hooks reject the same conflict");
  h.finish();
  for (const name of ["repeat_down1", "repeat_up3", "pitch_down", "pitch_up", "load1"])
    check(h.last(name, "ignoreclick").args[0] === 0, "completion restores native " + name);
  h.c.repeatstep(0, 1); check(h.c.repetitions[0] === repetitions[0] + 1, "normal editing resumes after the take");
});

test("source waveform uses the audible stereo channel and clears before a bank is reused", () => {
  const h = host({rightOnly: true}).ready(); h.begin(); h.finish();
  equal(h.last("source_wave1", "set").args, [h.c.sources[0].name, 2], "right-only input does not display a blank left channel");
  check(/channel 2 \(right\)/.test(h.last("source_wave1", "hint").args[0]), "source waveform identifies the channel being displayed");
  const priorBindings = h.messages("source_wave1", "set").length; h.c.inputrefresh(); h.c.inputrefresh();
  check(h.messages("source_wave1", "set").length === priorBindings, "ordinary UI refresh does not reset waveform binding or rescan PCM");
  const preset = plain(h.c.CMPEState().settings); preset.samples = ["", "", ""];
  h.c.CMPEHost.restore(preset); h.advance(120);
  equal(h.last("source_wave1", "set").args, [], "preset clearing a source clears its waveform before the bank can be reused");
  h.begin(1); h.advance(150); equal(h.last("source_wave1", "set").args, [], "empty source never follows another slot's staging capture");
});

test("REC and SAVE communicate disabled state with explicit readable colors", () => {
  const h = host().ready();
  equal(h.last("source_save1", "bgcolor").args, [217 / 255, 223 / 255, 231 / 255, 1], "unavailable save uses disabled fill");
  equal(h.last("source_save1", "textcolor").args, [82 / 255, 92 / 255, 105 / 255, 1], "unavailable save uses readable disabled text");
  h.begin(); equal(h.last("source_record2", "bgcolor").args, [217 / 255, 223 / 255, 231 / 255, 1], "other record slots visibly disable during a take");
  h.finish(); check(h.last("source_save1", "ignoreclick").args[0] === 0, "saved-source action becomes available after a take");
  equal(h.last("source_save1", "textoncolor").args, [23 / 255, 32 / 255, 43 / 255, 1], "enabled save retains readable pressed text");
});

test("three recorded slots leave a free bank and replacing one does not touch the others", () => {
  const h = host().ready(); for (let slot = 0; slot < 3; slot++) { h.begin(slot); h.finish(200, slot); }
  const b = h.snapshot(1), c = h.snapshot(2), old = h.c.sources[0].name;
  h.begin(0); h.finish(300, 0);
  check(h.c.sources[0].name !== old, "replacement uses the free fourth bank");
  equal(h.snapshot(1), b, "second slot survives another recording"); equal(h.snapshot(2), c, "third slot survives another recording");
  h.advance(200); check(h.buffers.get(old).frames === 1, "released old bank no longer retains capture memory");
});

test("source file loading after a take rebinds the canonical buffer and releases its recording bank", () => {
  const h = host().ready(); h.begin(); h.finish(); const bank = h.c.sources[0].name;
  h.c.loadfile(0, "/tmp/new.wav"); h.source(0); h.advance(200);
  check(h.c.sources[0].name === h.c.prefix + "_source0" && !h.c.CMPEInputState().sources[0].recorded, "native file completion restores canonical source ownership");
  check(h.buffers.get(bank).frames === 1, "unreferenced recorded bank is released");
});

test("SAVE writes a verified PCM24 stereo WAV and only then makes the sample persistent in sets", () => {
  const h = host().ready(); h.begin(); h.finish();
  h.c.presetsave(); check(h.messages("preset_save_dialog", "bang").length === 0, "Save Set cannot silently omit an unsaved recorded sample");
  h.c.presetwrite("/tmp/blocked.json"); check(!h.files.has("/tmp/blocked.json"), "direct preset write has the same guard");
  h.c.inputsave(0); h.c.inputsavepath("/tmp/take with spaces");
  check(h.c.paths[0] === "" && h.c.CMPEInputState().sources[0].saving, "file path is not trusted before write completion");
  h.advance(30);
  check(h.c.paths[0] === "/tmp/take with spaces.wav" && !h.c.CMPEInputState().sources[0].unsaved, "successful native write plus WAV header clears unsaved state");
  check(h.files.get("/tmp/take with spaces.wav").readUInt16LE(34) === 24, "persisted input is PCM24");
  h.c.presetwrite("/tmp/saved.json"); const set = JSON.parse(h.files.get("/tmp/saved.json").toString());
  check(set.samples[0] === "/tmp/take with spaces.wav", "set references the saved sample path");
});

test("save cancellation, stale dialog paths, and invalid native writes keep the take unsaved", () => {
  const h = host({wav: {bits: 16}}).ready(); h.begin(); h.finish();
  h.c.inputsave(0); h.c.inputsavecancel(); h.c.inputsavepath("/tmp/cancelled.wav");
  check(!h.files.has("/tmp/cancelled.wav"), "cancelled dialog cannot write later");
  h.c.inputsave(0); h.c.mode(1); h.c.inputsavepath("/tmp/stale.wav");
  check(!h.files.has("/tmp/stale.wav"), "mode change invalidates pending save dialog");
  h.c.inputsave(0); h.c.inputsavepath("/tmp/wrongformat.wav"); h.advance(30);
  check(h.c.paths[0] === "" && h.c.CMPEInputState().sources[0].unsaved, "wrong format cannot become a preset file reference");
});

test("write timeout leaves the sample bank reserved until the actual completion arrives", () => {
  const h = host({faults: {writeDelay: 31000}}).ready(); h.begin(); h.finish();
  const before = h.snapshot(0); h.c.inputsave(0); h.c.inputsavepath("/tmp/slow.wav"); h.advance(30100);
  check(h.c.CMPEInputState().sources[0].unsaved && h.c.CMPEInputState().sources[0].saving, "timeout does not claim success or free a writing bank");
  h.c.inputrecord(0); h.c.loadfile(0, "/tmp/replacement.wav"); equal(h.snapshot(0), before, "writing source cannot be resized or reused");
  h.advance(1000); check(h.c.paths[0] === "/tmp/slow.wav" && !h.c.CMPEInputState().sources[0].saving, "late actual completion can verify the intact take");
});

console.log(JSON.stringify({runtime: bundle ? "bundle" : "modules", scenarios, checks, failures}, null, 2));
if (failures.length) process.exitCode = 1;
