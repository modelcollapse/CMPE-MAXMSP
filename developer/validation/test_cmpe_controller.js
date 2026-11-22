"use strict";
// Real five-mode model/controller integration with simulated Max boundaries.
// These checks do not execute native MSP objects or prove audible Max behavior.
// Run with --bundle after build_cmpe_variety.py to validate the distributed JS.
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const assert = require("node:assert/strict");
const bundle = process.argv.includes("--bundle");
const root = path.resolve(process.argv.slice(2).find(arg => arg !== "--bundle") || path.join(__dirname, "../.."));
const patch = JSON.parse(fs.readFileSync(path.join(root, "CMPE_Variety_Pack.maxpat"), "utf8")).patcher;
const names = new Set(patch.boxes.map(x => x.box.varname).filter(Boolean));
const modules = ["apg_wave_plan.js", "apg_render.js", "cmpe_model.js", "apg_wave_controller.js", "cmpe_extension.js", "cmpe_audio_settings.js", "cmpe_ui_feedback.js", "cmpe_input_recording.js"];
const runtime = (bundle ? ["cmpe_variety.js"] : modules.map(file => "developer/" + file))
  .map(file => ({file, code: fs.readFileSync(path.join(root, file), "utf8")}));
let scenarios = 0, checks = 0, framesChecked = 0;
const failures = [];
function check(value, label) { checks++; assert.ok(value, label); }
function near(a, b, tolerance, label) { check(Number.isFinite(a) && Number.isFinite(b) && Math.abs(a - b) <= tolerance, label + ": " + a + " vs " + b); }
function plain(value) { return JSON.parse(JSON.stringify(value)); }
function equal(a, b, label) { checks++; assert.deepEqual(plain(a), plain(b), label); }
function test(name, fn) { scenarios++; try { fn(); } catch (e) { failures.push({name, message: e.message, stack: e.stack.split("\n").slice(0, 5).join("\n")}); } }
function seeded(seed) { let n = seed >>> 0; return () => { n ^= n << 13; n ^= n >>> 17; n ^= n << 5; return (n >>> 0) / 4294967296; }; }

function makeHost(seed = 91) {
  const events = [], values = new Map(), renamed = new Map(), buffers = new Map(), tasks = [];
  const writes = [], pokes = [], files = new Map(), fileHandles = [], targets = new Map(), voiceEvents = [];
  let messageHook = null;
  let now = 0, cpu = 0, context;
  const math = Object.create(Math); math.random = seeded(seed);
  const clock = () => now + cpu;
  const fresh = (name, frames = 1, sr = 2000, channels = 2) => ({name, frames, sr, channels,
    data: Array.from({length: channels}, () => new Float32Array(frames)), format: null, filetype: null});
  const objects = new Map([...names].map(name => [name, {
    message(selector, ...args) {
      assert.equal(typeof selector, "string", "Maxobj selector for " + name);
      events.push({type: "message", name, selector, args, now: clock()});
      if (["set", "int", "float", "text"].includes(selector)) values.set(name, args[0]);
      if (name.endsWith("_engine")) {
        if (selector === "target") targets.set(name, Number(args[0]));
        else voiceEvents.push({engine: name, voice: targets.get(name), selector, args, now: clock()});
      }
      if (selector === "name") {
        const old = renamed.get(name), record = old && buffers.get(old) || fresh(args[0]);
        if (old) buffers.delete(old);
        record.name = args[0]; buffers.set(args[0], record); renamed.set(name, args[0]);
      }
      if (selector === "clear" && renamed.has(name)) buffers.get(renamed.get(name)).data.forEach(ch => ch.fill(0));
      if (name === "output_buffer") {
        const b = buffers.get(renamed.get(name));
        if (selector === "sr") b.sr = Number(args[0]);
        if (selector === "sizeinsamps") {
          b.frames = Number(args[0]); b.channels = args.length > 1 ? Number(args[1]) : b.channels;
          b.data = Array.from({length: b.channels}, () => new Float32Array(b.frames));
        }
        if (selector === "normalize") {
          let peak = 0; for (const ch of b.data) for (const sample of ch) peak = Math.max(peak, Math.abs(sample));
          if (peak > 0) for (const ch of b.data) for (let i = 0; i < ch.length; i++) ch[i] *= Number(args[0]) / peak;
        }
        if (selector === "format") b.format = args[0];
        if (selector === "filetype") b.filetype = args[0];
        if (selector === "writewave") writes.push({path: args[0], frames: b.frames, sr: b.sr, channels: b.channels,
          format: b.format, filetype: b.filetype, data: b.data.map(ch => ch.slice())});
      }
      if (messageHook) messageHook(name, selector, args);
    }
  }]));
  function Buffer(name) {
    const get = () => { const b = buffers.get(name); assert.ok(b, "buffer exists: " + name); return b; };
    this.framecount = () => get().frames;
    this.length = () => get().frames * 1000 / get().sr;
    this.channelcount = () => get().channels;
    this.peek = (channel, first, count) => {
      const b = get();
      assert.ok(channel >= 1 && channel <= b.channels && Number.isInteger(first) && Number.isInteger(count) && first >= 0 && first + count <= b.frames, "bounded source read");
      const result = b.data[channel - 1].slice(first, first + count);
      return count === 1 ? result[0] : Array.from(result);
    };
    this.poke = (channel, first, data) => {
      const b = get(), values = typeof data === "number" ? [data] : data;
      assert.ok(channel >= 1 && channel <= b.channels && Number.isInteger(first) && first >= 0 && first + values.length <= b.frames, "bounded output write");
      b.data[channel - 1].set(values, first); pokes.push({channel, first, count: values.length});
    };
  }
  function Task(fn, self) {
    this.fn = fn; this.self = self; this.active = false; this.due = Infinity;
    this.createdState = context && context.state;
    this.cancel = () => { this.active = false; };
    this.schedule = ms => { this.active = true; this.due = clock() + Number(ms); };
    tasks.push(this);
  }
  function FakeDate() { this.getTime = () => { if (context && context.state === "rendering") cpu += 1; return 1700000000000 + clock(); }; }
  function File(filePath, mode) {
    this.path = filePath; this.mode = mode; this.position = 0;
    this.isopen = mode === "write" || files.has(filePath);
    if (mode === "write") files.set(filePath, "");
    Object.defineProperty(this, "eof", {get: () => (files.get(filePath) || "").length,
      set: n => { files.set(filePath, (files.get(filePath) || "").slice(0, n)); }});
    this.writestring = text => { assert.ok(this.isopen && mode === "write"); files.set(filePath, (files.get(filePath) || "") + String(text)); };
    this.readline = max => {
      assert.ok(this.isopen && mode === "read");
      const text = files.get(filePath), nl = text.indexOf("\n", this.position);
      const end = Math.min(nl < 0 ? text.length : nl, this.position + max);
      const result = text.slice(this.position, end); this.position = end + (text[end] === "\n" ? 1 : 0); return result;
    };
    this.close = () => { this.isopen = false; }; fileHandles.push(this);
  }
  context = vm.createContext({patcher: {filepath: "/tmp/CMPE Variety/CMPE_Variety_Pack.maxpat", getnamed: name => objects.get(name) || null},
    jsarguments: ["cmpe_variety.js"], arrayfromargs: args => Array.from(args), Task, Buffer, File, Math: math, Date: FakeDate,
    outlet(index, ...args) { if (args.length === 1 && Array.isArray(args[0])) args = Array.from(args[0]); events.push({type: "outlet", index, args, now: clock()}); },
    post() {}, error() {}});
  for (const source of runtime) vm.runInContext(source.code, context, {filename: source.file});
  const next = () => tasks.filter(t => t.active).sort((a, b) => a.due - b.due)[0];
  function step() {
    const task = next(); if (!task) return false;
    now = Math.max(clock(), task.due); cpu = 0; task.active = false; task.fn.call(task.self); now += cpu; cpu = 0; return true;
  }
  function advance(ms) {
    const end = clock() + ms; let safety = 0;
    while (next() && next().due <= end) { assert.ok(safety++ < 200000, "finite task queue"); step(); }
    now = Math.max(clock(), end); cpu = 0;
  }
  function until(predicate) {
    let safety = 0;
    while (!predicate()) { assert.ok(safety++ < 20000, "state eventually resolves"); assert.ok(step(), "pending task available"); }
  }
  function source(slot, opts = {}) {
    assert.ok(context.CMPEState().nativeBusy[slot], "source completion corresponds to an outstanding native read");
    const frames = opts.frames || [257, 319, 383][slot], sr = opts.sr || 2000, channels = opts.channels || [1, 2, 1][slot];
    const name = renamed.get("source" + (slot + 1)); assert.ok(name, "source renamed before loading");
    const b = fresh(name, frames, sr, channels);
    b.data = Array.from({length: channels}, (_, ch) => Float32Array.from({length: frames}, (_, i) => opts.sample ? opts.sample(ch, i) : .4 * Math.sin(i * .07 + ch * .2) + .1 * i / frames));
    buffers.set(name, b); context.loaded(slot); return b;
  }
  function ready(slots = [0, 1, 2], audio = true, sr = 2000) {
    context.loadbang(); advance(50); for (const slot of slots) source(slot);
    context.samplerate(sr); if (audio) context.dspstate(1);
  }
  function startLive(mode) { context.mode(mode); context.play(); until(() => context.state === "live"); }
  function renderOnly() { context.newpiece(); until(() => context.state === "ready" && context.outputReady); }
  function output() { return buffers.get(context.outputName); }
  function savePreset(filePath = "/tmp/fixture.json") { context.presetwrite(filePath); return JSON.parse(files.get(filePath)); }
  function restore(preset, filePath = "/tmp/restore.json") { files.set(filePath, JSON.stringify(preset)); context.presetread(filePath); }
  return {c: context, events, values, objects, renamed, buffers, tasks, writes, pokes, files, fileHandles, voiceEvents,
    step, advance, until, source, ready, startLive, renderOnly, output, savePreset, restore, time: clock,
    onMessage(fn) { messageHook = fn; }};
}
function messages(h, name, selector) { return h.events.filter(e => e.type === "message" && e.name === name && e.selector === selector); }
function lastMessage(h, name, selector) { return messages(h, name, selector).at(-1); }
function voices(h, engine, selector, voice) { return h.voiceEvents.filter(e => e.engine === engine && e.selector === selector && (voice === undefined || e.voice === voice)); }
function outs(h, index, selector) { return h.events.filter(e => e.type === "outlet" && e.index === index && e.args[0] === selector); }
function pendingLive(h) { return h.tasks.filter(t => t.active && t.createdState === "live"); }
function audioWrites(h) {
  return h.events.filter(e => e.type === "message" && /^audio_ad_/.test(e.name)
    && ["int", "float"].includes(e.selector));
}
// Native boundary fixture, never a claim about available or connected devices.
// Menu responses match adstatus's documented clear/append/set + value protocol.
function nativeAudio(h, options = {}) {
  const hardware = {driver: 0, option1: 0, option2: 0, on: options.on === false ? 0 : 1,
    applyWrites: true, reentrantCallbacks: 0, enumerate: true, dropReplies: false,
    nativeEmission: false, menuItems: {driver: [], option1: [], option2: []},
    replyDelays: Object.assign({}, options.replyDelays), omitDriverIndex: false, silentKinds: []};
  const drivers = ["Fixture driver A", "Fixture driver B"];
  const layouts = [
    {labels: ["Input device", "Output device"], option1: ["Fixture input A", "Fixture input B"], option2: ["Fixture output A", "Fixture output B"]},
    {labels: ["Audio device", "Driver option 2"], option1: ["Fixture duplex A", "Fixture duplex B"], option2: []}
  ];
  hardware.catalogs = layouts; hardware.drivers = drivers;
  const choices = kind => kind === "driver" ? drivers : layouts[hardware.driver][kind];
  function deliver(kind, fn) {
    if (hardware.dropReplies || hardware.silentKinds.includes(kind)) return;
    const ms = hardware.replyDelays[kind] === undefined ? options.deferMs || 0 : hardware.replyDelays[kind];
    if (ms) { const task = new h.c.Task(fn, h.c); task.nativeReply = true; task.schedule(ms); }
    else fn();
  }
  function nativeMenuMessage(kind, selector, ...args) {
    // Mirror the real native adstatus -> umenu branch before JS telemetry.
    // Native set messages never emit user choices. Only controller writes
    // exercise the optional adversarial reentrant fixture below.
    hardware.nativeEmission = true;
    h.objects.get("audio_" + kind + "_menu").message(selector, ...args);
    hardware.nativeEmission = false;
    h.c.audiomenu(kind, selector, ...args);
  }
  function menu(kind, full) {
    const items = choices(kind).slice(), index = kind === "driver" && hardware.omitDriverIndex ? -1 : (items.length ? hardware[kind] : -1);
    full = full && hardware.enumerate;
    deliver(kind, () => {
      if (full) {
        nativeMenuMessage(kind, "clear");
        for (const item of items) nativeMenuMessage(kind, "append", item);
      }
      nativeMenuMessage(kind, "set", index);
      if (kind !== "driver" || options.driverValue !== false) h.c.audiovalue(kind, index);
    });
  }
  hardware.notifyMenu = menu;
  hardware.emitMenu = nativeMenuMessage;
  h.onMessage((name, selector, args) => {
    const ui = /^audio_(driver|option1|option2)_menu$/.exec(name);
    if (ui && selector === "clear") hardware.menuItems[ui[1]].length = 0;
    if (ui && selector === "append") hardware.menuItems[ui[1]].push(args.join(" "));
    if (ui && selector === "set" && options.reentrant && !hardware.nativeEmission) {
      hardware.reentrantCallbacks++;
      h.c.audiochoose(ui[1], args[0]);
    }
    const setting = /^audio_ad_(driver|option1|option2|switch)$/.exec(name);
    if (setting) {
      const kind = setting[1];
      if (["int", "float"].includes(selector)) {
        const apply = () => {
          if (hardware.applyWrites) {
            if (kind === "switch") hardware.on = Number(args[0]);
            else {
              hardware[kind] = Number(args[0]);
              if (kind === "driver") hardware.option1 = hardware.option2 = 0;
            }
          }
          if (options.writeFeedback !== false) {
            if (kind === "switch") {
              const value = hardware.on; deliver(kind, () => h.c.audioswitch(value));
            } else menu(kind, false);
          }
          if (hardware.afterWrite) hardware.afterWrite(kind, Number(args[0]));
        };
        if (options.applyDelay) { const task = new h.c.Task(apply, h.c); task.nativeReply = true; task.schedule(options.applyDelay); }
        else apply();
      } else if (["loadbang", "bang"].includes(selector)) {
        if (kind === "switch") {
          const value = hardware.on; deliver(kind, () => h.c.audioswitch(value));
        } else menu(kind, selector === "loadbang");
      }
    }
    const label = /^audio_name_option([12])$/.exec(name);
    if (label && selector === "loadbang") {
      const number = Number(label[1]);
      const text = layouts[hardware.driver].labels[number - 1];
      deliver("labels", () => {
        h.c.audioname(number, "clear");
        h.c.audioname(number, "append", text);
        h.c.audioname(number, "set", 0);
      });
    }
  });
  return hardware;
}
function readyAudio(h, options = {}) {
  const hardware = nativeAudio(h, options); h.ready([0, 1, 2], options.on !== false, options.sr || 2000);
  h.advance(40);
  if (options.deferMs || options.replyDelays) h.until(() => !h.c.CMPEAudioState().refreshing);
  return hardware;
}

test("native audio options and their labels use zero-based driver option IDs", () => {
  const boxes = new Map(patch.boxes.map(({box}) => [box.id, box]));
  // Assert actual generated object text, independently of the simulated audio
  // host. Cycling '74's example uses option 0, matching adstatus.maxhelp:
  // https://cycling74.com/articles/max-8-guitar-processor-part-1
  for (const [uiNumber, nativeNumber] of [[1, 0], [2, 1]]) {
    check(boxes.get("audio_ad_option" + uiNumber).text === "adstatus option " + nativeNumber,
      "UI option " + uiNumber + " selects native driver option " + nativeNumber);
    check(boxes.get("audio_name_option" + uiNumber).text === "adstatus optionname " + nativeNumber,
      "UI option " + uiNumber + " reads the label for the same native driver option " + nativeNumber);
  }
});

test("native audio controls route feedback and requests through the guarded controller", () => {
  const boxes = new Map(patch.boxes.map(({box}) => [box.id, box]));
  const lines = patch.lines.map(({patchline}) => patchline);
  const edge = (from, outlet, to, inlet = 0) => lines.some(line =>
    line.source[0] === from && line.source[1] === outlet
    && line.destination[0] === to && line.destination[1] === inlet);
  check(boxes.get("audio_ad_driver").text === "adstatus driver", "driver menu uses the native driver setting");
  for (const kind of ["driver", "option1", "option2"]) {
    check(edge("audio_ad_" + kind, 0, "audio_menu_" + kind)
      && edge("audio_menu_" + kind, 0, "controller"), "menu clear/append/set feedback reaches the controller");
    check(edge("audio_ad_" + kind, 0, "audio_" + kind + "_menu"),
      "native adstatus setup reaches its visible menu without waiting for the JS controller");
    check(edge("audio_ad_" + kind, 1, "audio_value_" + kind)
      && edge("audio_value_" + kind, 0, "controller"), "current native index reaches the controller");
    check(boxes.get("audio_choose_" + kind).text === "prepend audiochoose " + kind
      && edge("audio_" + kind + "_menu", 0, "audio_choose_" + kind)
      && edge("audio_choose_" + kind, 0, "controller"), "user menu selection reaches the guarded change handler");
    check(!lines.some(line => line.destination[0] === "audio_ad_" + kind), "no unguarded native setting writes are connected by patch cords");
  }
  for (const number of [1, 2]) {
    check(edge("audio_name_option" + number, 0, "audio_name_msg" + number)
      && edge("audio_name_msg" + number, 0, "controller"), "driver-specific option names reach the controller");
  }
  check(edge("audio_ad_switch", 1, "audio_switch_msg") && edge("audio_switch_msg", 0, "controller"),
    "confirmed DSP switch state is read from the value outlet");
  check(boxes.get("audio_setup_native").text === "; dsp open", "Audio Setup uses the native DSP settings shortcut");
  const cancel = [...boxes.values()].find(box => box.varname === "audio_test_stop");
  const fade = [...boxes.values()].find(box => box.varname === "live_stop");
  check(cancel && cancel.text === "stop" && edge(cancel.id, 0, "test_delay"),
    "audio changes can cancel a native test-tone start still waiting in delay");
  check(fade && fade.text === "0. 10" && ["test_envelope", "run_gate", "live_gate"].every(id => edge(fade.id, 0, id)),
    "audio changes can fade test tone, finite playback, and live mix before touching hardware");
});

test("APG step controls use bounded edits without starting audio", () => {
  const h = makeHost(), c = h.c; h.ready(); h.renderOnly();
  const rendered = h.output().data.map(ch => ch.slice()), audioBefore = audioWrites(h).length;
  c.repeatstep(0, 1);
  check(c.repetitions[0] === 4 && c.dirty && c.outputReady && c.state === "ready",
    "repeat step changes the setting and preserves the cached take for review");
  c.repeats(0, 20); c.repeatstep(0, 1); check(c.repetitions[0] === 20, "repeat upper bound");
  c.repeats(0, 1); c.repeatstep(0, -1); check(c.repetitions[0] === 1, "repeat lower bound");
  c.pitch(0); for (let i = 0; i < 12; i++) c.pitchstep(.1);
  check(c.pitchRange === 1, "pitch reaches its exact upper bound");
  for (let i = 0; i < 12; i++) c.pitchstep(-.1);
  check(c.pitchRange === 0, "pitch reaches its exact lower bound");
  equal(h.output().data.map(ch => Array.from(ch)), rendered.map(ch => Array.from(ch)), "steps do not modify rendered PCM");
  check(audioWrites(h).length === audioBefore, "steps do not turn audio on or change hardware");
  c.newpiece(); h.until(() => c.state === "rendering");
  const before = c.CMPEState().settings.apg;
  c.repeatstep(0, 1); c.pitchstep(.1);
  equal(c.CMPEState().settings.apg, before, "generation locks step edits");
  c.stop(); c.mode(1); c.repeatstep(0, 1); c.pitchstep(.1);
  equal(c.CMPEState().settings.apg, before, "other instruments do not change hidden APG settings through steps");
});

test("initialization and all five mode views use the built patch names", () => {
  const h = makeHost(), c = h.c; h.ready();
  check(c.CMPEState().mode === 0 && !h.objects.get("wave_l").hidden, "APG opens with output waveform");
  equal(lastMessage(h, "recorder", "samptype").args, ["int24"], "live recorder uses 24-bit samples");
  for (let mode = 0; mode < 5; mode++) {
    c.mode(mode);
    check(c.CMPEState().mode === mode && c.state === "idle", "mode selected and transport reset");
    const rendered = mode === 0 || mode === 4;
    check(Boolean(h.objects.get("wave_l").hidden) === !rendered, "waveform only belongs to finite modes");
    check(Boolean(h.objects.get("record_button").hidden) === rendered, "record controls belong to live modes");
    check(Boolean(h.objects.get("xy_pad").hidden) === (mode !== 1), "XY pad only belongs to ISJS");
    check(Boolean(h.objects.get("no_samples").hidden) === (mode !== 3), "RMHS explains no samples are required");
    const sourceCount = mode === 3 ? 0 : mode === 2 || mode === 4 ? 1 : 3;
    for (let slot = 1; slot <= 3; slot++) for (const prefix of ["source_label", "load", "file"])
      check(Boolean(h.objects.get(prefix + slot).hidden) === (slot > sourceCount), "only relevant source controls are visible");
  }
});

test("sample requirements differ correctly between the instruments", () => {
  for (const mode of [0, 1]) {
    const h = makeHost(); h.ready([0, 1]); h.c.mode(mode); h.c.play();
    check(h.c.state === "idle", "three-source mode refuses a missing third source");
  }
  for (const mode of [2, 4]) {
    const h = makeHost(); h.ready([0]); h.c.mode(mode);
    if (mode === 4) { h.c.choice(0); h.c.param(0, 2); h.c.param(2, .1); }
    h.c.play(); h.until(() => h.c.state === (mode === 2 ? "live" : "playing"));
    check(h.c.sources[1] === null && h.c.sources[2] === null, "unused source slots remain absent");
    h.c.stop(); h.advance(20);
  }
  const h = makeHost(); h.ready([], true, 48000); h.startLive(3);
  check(h.c.sources.every(x => x === null), "RMHS begins without any source buffer loaded");
  check(voices(h, "drone_engine", "start").length > 0, "RMHS emits native oscillator starts"); h.c.stop();
});

test("audio wait has no premature live starts and STOP cancels the wait", () => {
  const h = makeHost(), c = h.c; h.ready([0, 1, 2], false); c.mode(1); c.play();
  check(c.state === "waiting", "live START waits for audio confirmation"); h.advance(300);
  check(voices(h, "grain_engine", "start").length === 0, "no grains start while audio is off");
  c.stop(); c.dspstate(1); h.advance(12000);
  check(c.state === "idle" && voices(h, "grain_engine", "start").length === 0, "cancelled wait cannot start later");
  c.play(); h.until(() => c.state === "live"); check(voices(h, "grain_engine", "start").length === 3, "explicit retry starts all three streams"); c.stop();
  const t = makeHost(); t.ready([0], false); t.c.mode(2); t.c.play(); t.advance(12000);
  check(t.c.state === "idle" && /Audio did not start/.test(t.values.get("status")), "audio startup timeout returns a useful failure");
});

test("mode changes fence pending live, render, and recording callbacks", () => {
  const h = makeHost(), c = h.c; h.ready(); h.startLive(1); c.recordpath("/tmp/live take.wav");
  const stale = pendingLive(h); check(stale.length > 0, "live callbacks exist before the switch"); c.mode(2);
  check(c.CMPEState().activeTasks === 0 && !c.CMPEState().recording, "switching cancels performance and recording");
  const count = h.voiceEvents.length; for (const task of stale) task.fn.call(task.self);
  check(h.voiceEvents.length === count, "old ISJS callbacks cannot emit after switching");
  c.play(); h.until(() => c.state === "live"); c.mode(4); c.choice(0); c.param(0, 2); c.param(2, .1); c.newpiece();
  h.advance(50); const oldRender = c.renderTask; c.mode(0); const pokes = h.pokes.length;
  if (oldRender) oldRender.fn.call(oldRender.self); h.advance(30);
  check(c.state === "idle" && !c.outputReady && h.pokes.length === pokes, "old SIOE callbacks cannot write APG output");
  h.renderOnly(); check(c.plan && c.plan.mode !== "sioe", "returning to APG generates an APG plan");
});

test("DSP off and sample-rate changes halt live voices and recording", () => {
  for (const change of ["off", "rate"]) {
    const h = makeHost(); h.ready(); h.startLive(1); h.c.recordpath("/tmp/dsp.wav");
    const stale = pendingLive(h); check(stale.length > 0, "live callbacks exist before audio changes");
    if (change === "off") h.c.dspstate(0); else h.c.samplerate(44100);
    check(h.c.state === "idle" && !h.c.CMPEState().recording && h.c.CMPEState().activeTasks === 0, "DSP change halts the full live session");
    const count = h.voiceEvents.length; for (const task of stale) task.fn.call(task.self);
    check(h.voiceEvents.length === count, "stale live jobs stay inert after audio changes");
    check(voices(h, "grain_engine", "panic", 0).length > 0, "native voices are stopped as well as JS scheduling");
  }
});

test("ISJS starts correct streams and updates live rates and levels", () => {
  const h = makeHost(), c = h.c; h.ready(); c.mode(1); c.xy(.25, 0); c.play(); h.until(() => c.state === "live");
  for (let slot = 0; slot < 3; slot++) {
    equal(voices(h, "grain_engine", "set", slot + 1).at(-1).args, [c.sources[slot].name], "stream points at its own source");
    near(voices(h, "grain_engine", "start", slot + 1).at(-1).args[0], .25 * c.sources[slot].durationMs, 1e-10, "source-relative start position");
    const env = voices(h, "grain_engine", "env", slot + 1).at(-1).args;
    check(env.length % 2 === 0 && env.length <= 256 && env[0] === 0 && env[1] === 0, "grain envelope supplies valid line~ pairs");
  }
  const starts = voices(h, "grain_engine", "start").length;
  c.param(0, 99); equal(voices(h, "grain_engine", "rate", 1).at(-1).args, [1.7], "rate is clamped and sent immediately");
  c.param(4, 0); equal(voices(h, "grain_engine", "amp", 2).at(-1).args, [0], "muting a source level updates its native voice");
  check(voices(h, "grain_engine", "start").length === starts, "parameter updates do not regenerate or restart all sources"); c.stop();
});

test("ISJS density reschedules long waits and position wraps at the file end", () => {
  const h = makeHost(), c = h.c; h.ready(); c.mode(1); c.xy(.4, 0); c.play(); h.until(() => c.state === "live");
  const starts = voices(h, "grain_engine", "start").length;
  c.xy(1, 1); h.advance(24); check(voices(h, "grain_engine", "start").length === starts, "faster grains respect the new minimum period");
  h.advance(6); check(voices(h, "grain_engine", "start").length >= starts + 3, "all streams accelerate without waiting for old slow periods");
  for (let voice = 1; voice <= 3; voice++) equal(voices(h, "grain_engine", "start", voice).at(-1).args, [0], "100 percent position wraps to the source beginning");
  c.stop(); const count = voices(h, "grain_engine", "start").length; h.advance(20000);
  check(voices(h, "grain_engine", "start").length === count && c.CMPEState().activeTasks === 0, "STOP cancels all grain streams and status pulses");
});

test("Many supplies seven stereo stages with stable coefficients and correct source sum gain", () => {
  for (const channels of [1, 2]) {
    const h = makeHost(); h.ready([0]); h.c.loadfile(0, "/tmp/source channels.wav"); h.source(0, {channels}); h.startLive(2);
    const stages = voices(h, "many_engine", "stage", 1);
    check(stages.length === 7, "every new layer configures all seven stages");
    stages.forEach((event, i) => {
      check(event.args[0] === i + 1 && event.args[1] > 0 && event.args[3] > 0, "stage indices and independent delay values are valid");
      check(event.args[2] > 0 && event.args[2] < 1 && event.args[4] > 0 && event.args[4] < 1, "allpass feedback remains below unity");
    });
    const feed = voices(h, "many_engine", "feed", 1)[0].args[0]; check(feed >= 1.02 && feed <= 1.1, "input feed remains distinct from feedback coefficients");
    near(voices(h, "many_engine", "sumgain", 1)[0].args[0], channels === 1 ? 1 : Math.SQRT1_2, 1e-12, "mono/stereo excitation normalization");
    const commands = h.voiceEvents.filter(e => e.engine === "many_engine" && e.voice === 1);
    check(commands.at(-1).selector === "start", "native playback starts after all parameters and envelopes are sent"); h.c.stop();
  }
});

test("Many reuse fades before reconfiguration and fences stale retirement jobs", () => {
  const h = makeHost(), c = h.c; h.ready([0]);
  const original = c.CMPEModel.manyEvent;
  c.CMPEModel.manyEvent = settings => { const event = original(settings); event.nextMs = 20; return event; };
  h.startLive(2); const firstRetire = pendingLive(h).find(t => Math.abs(t.due - h.time() - 120000) < 1);
  check(Boolean(firstRetire), "first layer receives its bounded tail retirement");
  h.advance(655);
  const firstStarts = voices(h, "many_engine", "start", 1), firstStops = voices(h, "many_engine", "stop", 1);
  check(firstStarts.length >= 2 && firstStops.length >= 1, "33rd layer reuses the first of 32 voices");
  near(firstStarts[1].now - firstStops[0].now, 15, 1e-9, "reuse leaves 15 ms for the old voice fade and mute");
  const stopCount = voices(h, "many_engine", "stop", 1).length; firstRetire.fn.call(firstRetire.self);
  check(voices(h, "many_engine", "stop", 1).length === stopCount, "retired generation cannot stop a newly reused voice");
  c.stop(); const commands = h.voiceEvents.length; h.advance(1000);
  check(h.voiceEvents.length === commands && c.CMPEState().activeTasks === 0, "STOP cancels pending reuse and future layers");
});

test("Many enforces its tail cap and does not resurrect a cancelled reuse", () => {
  const h = makeHost(), c = h.c; h.ready([0]); const original = c.CMPEModel.manyEvent;
  c.CMPEModel.manyEvent = settings => { const event = original(settings); event.nextMs = 1e9; return event; };
  h.startLive(2); h.advance(119999); check(voices(h, "many_engine", "stop", 1).length === 0, "tail is not cut before its cap");
  h.advance(1); check(voices(h, "many_engine", "stop", 1).length === 1, "tail is retired at 120 seconds"); c.stop();
  const r = makeHost(); r.ready([0]); const originalR = r.c.CMPEModel.manyEvent;
  r.c.CMPEModel.manyEvent = settings => { const event = originalR(settings); event.nextMs = 20; return event; };
  r.startLive(2); r.advance(640); const stale = pendingLive(r); check(stale.length > 0, "reuse callbacks exist before STOP"); r.c.stop();
  const count = r.voiceEvents.length; for (const task of stale) task.fn.call(task.self); r.advance(50);
  check(r.voiceEvents.length === count, "cancelled delayed reuse cannot start a voice");
});

test("RMHS forwards the complete voice plan, locks settings, and automatically stops", () => {
  const h = makeHost(), c = h.c; h.ready([], true, 48000); c.mode(3);
  c.param(0, .2); c.param(1, 30); c.param(2, 0); c.param(3, 1); c.param(4, 20);
  let plan; const original = c.CMPEModel.rmhsPlan;
  c.CMPEModel.rmhsPlan = (...args) => { plan = original(...args); return plan; };
  c.play(); h.until(() => c.state === "live");
  check(plan.voices.length === 55 && voices(h, "drone_engine", "start").length === 55, "all 55 partials receive a native start");
  plan.voices.forEach((v, i) => {
    near(voices(h, "drone_engine", "freq", i + 1)[0].args[0], v.frequencyHz, 1e-12, "planned partial frequency forwarded");
    near(voices(h, "drone_engine", "modphase", i + 1)[0].args[0], (v.modPhase / (2 * Math.PI) + .75) % 1, 1e-12, "SC sine modulation phase converts to native cosine phase");
    const env = voices(h, "drone_engine", "env", i + 1)[0].args;
    near(env.filter((_, j) => j % 2 === 1).reduce((a, b) => a + b, 0), v.durationMs, 1e-8, "all envelope segment times survive native transport");
  });
  c.param(1, 999); check(c.CMPEState().settings.rmhs.fundamentalHz === 30, "running drone settings stay locked");
  h.advance(plan.durationMs + 200);
  check(c.state === "idle" && c.CMPEState().activeTasks === 0 && h.values.get("progress") === 1, "planned completion stops voices and clears remaining drift jobs");
});

test("RMHS explains a plan with no audible partials", () => {
  const h = makeHost(), c = h.c; h.ready([], true, 2000); c.mode(3); c.param(1, 20000); c.play(); h.advance(50);
  check(c.state === "idle" && /No audible partials/.test(h.values.get("status")), "out-of-band plan returns a concrete message");
  check(voices(h, "drone_engine", "start").length === 0 && c.CMPEState().activeTasks === 0, "empty plan does not leave a live session");
});

function compareSioeOutput(h) {
  const c = h.c, p = c.plan, reference = c.CMPEModel.renderSioeChunk(p, c.sources, 0, p.totalFrames,
    (slot, channel, first, count) => h.buffers.get(c.sources[slot].name).data[channel - 1].slice(first, first + count));
  const expected = [Float32Array.from(reference.left), Float32Array.from(reference.right)];
  let peak = 0; for (const ch of expected) for (const value of ch) peak = Math.max(peak, Math.abs(value));
  if (reference.peak > .98) for (const ch of expected) for (let i = 0; i < ch.length; i++) ch[i] *= .98 / peak;
  const output = h.output(); check(output.frames === p.totalFrames && c.trimFrames === 0, "supercut keeps its complete finite timeline");
  for (let ch = 0; ch < 2; ch++) for (let i = 0; i < output.frames; i++) {
    near(output.data[ch][i], expected[ch][i], 1e-7, "stored SIOE sample equals sequential reference"); framesChecked++;
  }
  check(output.data.some(ch => ch.some((v, i) => Math.abs(v - ch[ch.length - 1 - i]) > 1e-5)), "supercut audio is not accidentally mirrored by APG code");
  return {reference, output};
}

test("SIOE writes a full non-palindromic result and normalizes strong output", () => {
  const h = makeHost(), c = h.c; h.ready([0]); c.loadfile(0, "/tmp/loud source.wav");
  h.source(0, {channels: 2, frames: 41, sample: (ch, i) => 2.5 + .8 * Math.sin(i * .21 + ch)});
  c.mode(4); c.choice(0); c.param(0, 3); c.param(2, .1); h.renderOnly();
  const result = compareSioeOutput(h);
  check(result.reference.peak > .98 && messages(h, "output_buffer", "normalize").length === 1, "strong mix requests one native normalization");
  const peak = Math.max(...result.output.data.flatMap(ch => Array.from(ch, Math.abs)));
  near(peak, .98, 1e-6, "stored normalized peak is bounded");
  c.savepath("/tmp/supercut"); check(h.writes[0].frames === c.outputFrames && h.writes[0].channels === 2, "SIOE export uses the complete stereo result"); c.saved();
  const oldPlan = c.plan, pokes = h.pokes.length; c.play(); h.until(() => c.state === "playing");
  check(c.plan === oldPlan && h.pokes.length === pokes, "SIOE replay uses its cached render"); c.stop(); h.advance(20);
});

test("SIOE long render covers every frame once, including its second half", () => {
  const h = makeHost(), c = h.c; h.ready([0]); c.mode(4); c.choice(1); c.param(0, 3); c.param(1, 1500); c.param(2, .1);
  const original = c.CMPEModel.sioePlan;
  c.CMPEModel.sioePlan = (...args) => { const p = original(...args); p.recommendedChunkFrames = 31; return p; };
  h.renderOnly(); compareSioeOutput(h);
  for (const channel of [1, 2]) {
    const spans = h.pokes.filter(p => p.channel === channel); let cursor = 0;
    for (const span of spans) { check(span.first === cursor, "SIOE writes consecutive non-overlapping chunks"); cursor += span.count; }
    check(cursor === c.outputFrames, "SIOE writes through the final frame rather than only its first half");
  }
});

test("SIOE cancellation stops writes and queued autoplay", () => {
  const h = makeHost(), c = h.c; h.ready([0]); c.mode(4); c.choice(1); c.param(0, 3); c.param(1, 1500); c.param(2, .1);
  const original = c.CMPEModel.sioePlan;
  c.CMPEModel.sioePlan = (...args) => { const p = original(...args); p.recommendedChunkFrames = 16; return p; };
  c.play(); h.advance(50); h.step(); h.step(); check(c.state === "rendering" && h.pokes.length > 0, "render is partially written");
  const stale = c.renderTask; c.stop(); const written = h.pokes.length; stale.fn.call(stale.self); h.advance(1000);
  check(c.state === "idle" && !c.outputReady && h.pokes.length === written, "cancelled render remains unavailable and cannot write");
  check(outs(h, 3, "bang").length === 0, "cancelled supercut never autoplays");
});

test("APG still renders exact palindrome samples after visiting every mode", () => {
  const h = makeHost(), c = h.c; h.ready(); for (const mode of [1, 2, 3, 4, 0]) c.mode(mode); h.renderOnly();
  const b = h.output();
  for (const ch of b.data) for (let i = 0; i < b.frames; i++) check(ch[i] === ch[b.frames - 1 - i], "stored APG sample pairs remain exactly equal");
  check(c.outputReady && !c.dirty, "APG output remains reusable");
});

test("live recording arms before START and closes with STOP", () => {
  const h = makeHost(), c = h.c; h.ready(); c.mode(1); c.recordpath("/tmp/my performance");
  check(c.CMPEState().recordArmed && !c.CMPEState().recording, "idle record opens and arms the destination");
  equal(lastMessage(h, "recorder", "open").args, ["/tmp/my performance.wav", "wave"], "record path preserves spaces and gains WAV extension");
  check(!messages(h, "recorder", "int").some(e => e.args[0] === 1), "arming does not record before performance starts");
  c.play(); h.until(() => c.state === "live");
  check(c.CMPEState().recording && !c.CMPEState().recordArmed, "START begins the armed recording");
  equal(lastMessage(h, "recorder", "int").args, [1], "native recorder receives start");
  c.recordelapsed(100); c.stop();
  check(!c.CMPEState().recording && !c.CMPEState().recordArmed, "STOP clears recording state");
  equal(lastMessage(h, "recorder", "int").args, [0], "native file is closed on STOP");
  c.recordpath("/tmp/armed.wav"); c.recordtoggle(); check(!c.CMPEState().recordArmed, "record toggle can cancel an armed destination");
});

test("recording can start live and a stalled clock stops only recording", () => {
  const h = makeHost(), c = h.c; h.ready([0]); h.startLive(2); c.recordpath("/tmp/live.wav");
  check(c.CMPEState().recording, "choosing a destination during performance starts recording immediately");
  for (let i = 1; i <= 5; i++) { h.advance(1000); c.recordelapsed(i * 1000); }
  check(c.CMPEState().recording, "advancing recorder timestamps keep the watchdog satisfied");
  const count = messages(h, "recorder", "int").length; c.recordelapsed(-1); c.recordelapsed(1); h.advance(5000);
  check(!c.CMPEState().recording && c.state === "live", "stalled or backwards recording clock closes the file without ending performance");
  check(messages(h, "recorder", "int").length > count, "watchdog issues native stop");
  check(messages(h, "status", "set").some(e => /Recording did not advance/.test(e.args[0])), "stalled capture reports its failure"); c.stop();
});

test("presets round-trip settings and reload source references", () => {
  const h = makeHost(), c = h.c; h.ready(); c.mode(1); c.xy(.2, .7); c.param(0, .6); c.mode(2); c.param(1, .4); c.choice(4); c.monitor(-18);
  const p = h.savePreset("/tmp/My saved set.json");
  check(p.mode === 2 && p.isjs.rates[0] === .6 && p.isjs.position === .2 && p.many.delayMaxMs === 400 && p.monitorDb === -18, "serialized preset contains cross-mode settings");
  c.mode(3); h.restore(p);
  const restored = c.CMPEState().settings;
  equal(restored.isjs.rates, p.isjs.rates, "ISJS values round-trip"); equal(restored.many.microtonalSet, p.many.microtonalSet, "microtonal pitches round-trip");
  check(restored.mode === 2 && c.loading.every(Boolean), "restoring a preset selects mode and starts source reloads");
  for (let i = 0; i < 3; i++) equal(lastMessage(h, "source" + (i + 1), "read").args[0], p.samples[i], "saved sample reference is reloaded");
  for (let i = 0; i < 3; i++) h.source(i); c.play(); h.until(() => c.state === "live"); c.stop();
  check(h.fileHandles.every(f => !f.isopen), "preset files are closed after both write and read");
});

test("invalid presets do not interrupt an active performance", () => {
  const h = makeHost(), c = h.c; h.ready(); h.startLive(1); const p = h.savePreset();
  for (const mutate of [x => { x.version = 2; }, x => { x.mode = 8; }, x => { x.sioe.form = "wrong"; }, x => { x.isjs.rates = [1, null, 1]; }, x => { x.samples[0] = 42; }]) {
    const bad = plain(p); mutate(bad); const token = c.CMPEState().liveToken; h.restore(bad);
    check(c.state === "live" && c.CMPEState().liveToken === token, "validation completes before any destructive session reset");
    check(/Settings not loaded/.test(h.values.get("status")), "invalid preset produces a clear error");
  }
  h.files.set("/tmp/oversized.json", "x".repeat(1048577)); c.presetread("/tmp/oversized.json");
  check(c.state === "live" && h.fileHandles.every(f => !f.isopen), "oversized preset is rejected and file handle is closed"); c.stop();
});

test("preset numeric values clamp after pending native source reads finish", () => {
  const h = makeHost(), c = h.c; h.ready(); const p = h.savePreset();
  p.apg.repetitions = [-9, 99, 2.3]; p.apg.pitchRange = 8; p.isjs.rates = [0, 9, 1]; p.isjs.levels = [-1, 2, .4];
  p.many.delayMaxMs = 999; p.rmhs.harmonics = 100; p.monitorDb = -90;
  p.samples = ["/tmp/new A.wav", "/tmp/new B.aiff", "/tmp/new C.wav"];
  c.loadfile(0, "/tmp/previous pending.wav"); check(c.loading[0], "old source load is pending");
  const reads = messages(h, "source1", "read").length; h.restore(p);
  check(c.state === "restoring" && c.CMPEState().restoring, "settings wait for outstanding native reads");
  check(messages(h, "source1", "read").length === reads, "preset does not overlap an existing buffer read");
  c.play(); check(c.state === "restoring" && !c.audioTask, "queued preset blocks transport startup");
  h.source(0, {frames: 421});
  const s = c.CMPEState().settings;
  equal(s.apg.repetitions, [1, 20, 2], "repeat counts clamp and round"); equal(s.isjs.rates, [.3, 1.7, 1], "ISJS rate bounds apply during restore");
  check(s.apg.pitchRange === 1 && s.many.delayMaxMs === 500 && s.rmhs.harmonics === 20 && s.monitorDb === -60, "preset numeric bounds are enforced");
  equal(lastMessage(h, "source1", "read").args[0], p.samples[0], "replacement begins only after the old read completes");
  check(messages(h, "source1", "read").length === reads + 1 && !c.sources[0], "old source metadata is cleared before reading the saved replacement");
  for (let i = 0; i < 3; i++) h.source(i, {frames: 167 + i});
  check(c.sources[0].frames === 167 && !c.CMPEState().nativeBusy.some(Boolean), "replacement completions publish their own metadata");
});

test("a native read completing after timeout still safely releases a queued preset", () => {
  const h = makeHost(), c = h.c; h.ready(); const p = h.savePreset();
  p.mode = 2; p.samples = ["/tmp/after timeout.wav", "", ""];
  c.loadfile(0, "/tmp/slow old source.wav"); const reads = messages(h, "source1", "read").length;
  h.advance(30001);
  check(!c.loading[0] && c.CMPEState().nativeBusy[0], "JavaScript timeout does not claim native I/O has completed");
  c.loadfile(0, "/tmp/overlapping request.wav");
  check(messages(h, "source1", "read").length === reads, "another manual read cannot overlap a timed-out native read");
  h.restore(p); h.advance(30001);
  check(c.state === "restoring" && c.CMPEState().restoring, "settings remain queued while native read is outstanding");
  check(messages(h, "source1", "read").length === reads, "preset timeout does not launch a conflicting replacement");
  h.source(0, {frames: 433});
  check(c.CMPEState().mode === 2 && !c.CMPEState().restoring && c.sources[0] === null, "late completion applies the waiting settings without publishing old audio");
  equal(lastMessage(h, "source1", "read").args[0], p.samples[0], "late completion launches the intended replacement");
  h.source(0, {frames: 99}); check(c.sources[0].frames === 99 && !c.CMPEState().nativeBusy[0], "replacement metadata remains distinct from the timed-out read");
  c.play(); h.until(() => c.state === "live"); c.stop();
});

test("a queued empty slot is cleared after old completion and ignores unsolicited bangs", () => {
  const h = makeHost(), c = h.c; h.ready(); const p = h.savePreset(); p.samples = ["", "", ""]; p.mode = 3;
  c.loadfile(0, "/tmp/old source to clear.wav"); const reads = messages(h, "source1", "read").length;
  h.restore(p); check(c.state === "restoring", "empty-slot preset also waits for in-flight native audio");
  h.source(0, {frames: 81, sample: () => .5});
  check(c.sources.every(x => x === null) && c.paths.every(x => x === "") && !c.CMPEState().nativeBusy.some(Boolean), "empty preset clears old paths and source metadata after completion");
  check(messages(h, "source1", "read").length === reads, "empty source reference does not request another file");
  for (let slot = 1; slot <= 3; slot++) check(h.buffers.get(h.renamed.get("source" + slot)).data.every(ch => ch.every(x => x === 0)), "clear reaches native source storage");
  c.loaded(0); check(c.sources.every(x => x === null), "an unsolicited duplicate completion cannot revive cleared audio");
  c.mode(2); c.play(); check(c.state === "idle", "sample mode cannot start from a cleared old buffer");
});

test("the latest valid preset wins after every outstanding read completes", () => {
  const h = makeHost(), c = h.c; h.ready(); const first = h.savePreset(), latest = plain(first);
  first.mode = 1; first.samples = ["/tmp/superseded preset.wav", "", ""]; first.isjs.rates[0] = .4;
  latest.mode = 4; latest.samples = ["/tmp/latest preset.wav", "", ""]; latest.sioe.count = 7;
  c.loadfile(0, "/tmp/old source one.wav"); c.loadfile(2, "/tmp/old source three.wav");
  const reads = messages(h, "source1", "read").length;
  h.restore(first); h.restore(latest);
  const invalid = plain(first); invalid.version = 200; h.restore(invalid);
  check(c.state === "restoring" && c.CMPEState().restoring, "invalid later file does not cancel the latest valid queued preset");
  h.source(0);
  check(c.state === "restoring" && messages(h, "source1", "read").length === reads, "no replacement starts while a different old source is still reading");
  h.source(2);
  check(c.CMPEState().mode === 4 && c.CMPEState().settings.sioe.count === 7, "latest valid mode and settings are restored");
  equal(lastMessage(h, "source1", "read").args[0], latest.samples[0], "only the newest saved source is requested");
  check(!messages(h, "source1", "read").some(e => e.args[0] === first.samples[0]), "superseded source request is never emitted");
  h.source(0); check(c.sources[1] === null && c.sources[2] === null, "latest empty slots remain empty after earlier reads complete");
});

test("STOP and mode changes cancel a queued preset without cancelling native completion", () => {
  for (const action of ["stop", "mode"]) {
    const h = makeHost(), c = h.c; h.ready(); const p = h.savePreset();
    const originalRate = p.isjs.rates[0];
    p.mode = 4; p.samples = ["/tmp/cancelled preset.wav", "", ""]; p.isjs.rates[0] = .4;
    c.loadfile(0, "/tmp/uncancelled native read.wav"); h.restore(p);
    const queued = h.tasks.filter(t => t.active && t.createdState === "restoring");
    check(queued.length > 0, "queued preset has an active progress timeout");
    if (action === "stop") c.stop(); else c.mode(1);
    check(c.state === "idle" && !c.CMPEState().restoring && c.CMPEState().nativeBusy[0], "UI cancels pending settings while tracking the existing disk read");
    const reads = messages(h, "source1", "read").length;
    for (const task of queued) task.fn.call(task.self);
    h.source(0, {frames: 79}); h.advance(31000);
    check(messages(h, "source1", "read").length === reads && c.sources[0].frames === 79, "old completion updates only its current source and does not restore cancelled settings");
    check(c.CMPEState().mode === (action === "stop" ? 0 : 1) && c.CMPEState().settings.isjs.rates[0] === originalRate, "cancelled preset cannot change the selected mode or parameters later");
  }
});

test("restoring settings at startup cancels the deferred demo reads", () => {
  const h = makeHost(), c = h.c; c.loadbang(); const p = h.savePreset();
  p.mode = 2; p.samples = ["/tmp/startup preset.wav", "", ""];
  h.restore(p); h.advance(100);
  const reads = h.events.filter(e => e.type === "message" && /^source[123]$/.test(e.name) && e.selector === "read");
  check(reads.length === 1 && reads[0].args[0] === p.samples[0], "startup DEMO task does not replace restored paths or fill empty slots");
  h.source(0); check(c.sources[1] === null && c.sources[2] === null, "restored startup source requirements stay intact");
});

test("loading an empty sample reference does not silently keep an unrelated old source", () => {
  const h = makeHost(), c = h.c; h.ready(); const p = h.savePreset(); p.samples = ["", "", ""]; p.mode = 3;
  h.restore(p); check(c.sources.every(x => x === null) && c.paths.every(x => x === ""), "empty saved slots clear their previous metadata and paths");
  c.mode(2); c.play(); check(c.state === "idle", "switching to a sample mode does not play an old unrelated source after empty restore");
});

test("shutdown cancels live, recording, source, and render tasks", () => {
  for (const mode of [1, 2, 3, 4]) {
    const h = makeHost(), c = h.c; h.ready([0, 1, 2], true, mode === 3 ? 48000 : 2000); c.mode(mode);
    if (mode === 4) { c.choice(1); c.param(0, 3); c.param(1, 1500); c.param(2, .1); c.play(); h.advance(50); }
    else { c.play(); h.until(() => c.state === "live"); c.recordpath("/tmp/shutdown.wav"); }
    const stale = pendingLive(h); if (mode !== 4) check(stale.length > 0, "live jobs exist before shutdown"); c.shutdown();
    check(c.state === "idle" && !c.CMPEState().recording && h.tasks.every(t => !t.active), "shutdown clears every pending task kind");
    const commands = h.voiceEvents.length, writes = h.pokes.length;
    for (const task of stale) task.fn.call(task.self); h.advance(1000);
    check(h.voiceEvents.length === commands && h.pokes.length === writes, "stale jobs cannot produce work after shutdown");
  }
});

test("audio initialization, refresh, polling, and reentrant readback never write settings", () => {
  const h = makeHost(), c = h.c, hardware = readyAudio(h, {reentrant: true});
  equal(c.CMPEAudioState().menus.driver, {items: ["Fixture driver A", "Fixture driver B"], index: 0}, "native driver menu is enumerated without assumptions");
  equal(c.CMPEAudioState().labels, ["Input device", "Output device"], "native driver labels survive numerical set feedback");
  check(hardware.reentrantCallbacks > 0, "the fixture exercises feedback through menu set messages");
  c.audiorefresh(); h.advance(4050); c.loadbang();
  check(audioWrites(h).length === 0, "initial and repeated read requests do not change global hardware settings");
  for (const name of ["audio_ad_driver", "audio_ad_option1", "audio_ad_option2", "audio_name_option1", "audio_name_option2"])
    check(messages(h, name, "loadbang").length >= 2, "refresh asks native Max to rebuild its own device lists");
  h.startLive(1); const token = c.CMPEState().liveToken;
  c.audiorefresh(); h.advance(2050);
  check(c.state === "live" && c.CMPEState().liveToken === token, "read-only refresh and unchanged polling do not interrupt performance");
  check(audioWrites(h).length === 0 && !c.CMPEAudioState().changing, "menu feedback does not leak into a user change"); c.stop();
});

test("invalid, unchanged, or unsupported audio choices cannot write hardware", () => {
  const h = makeHost(), c = h.c, hardware = readyAudio(h);
  for (const value of [-1, 2, .5, NaN, Infinity]) c.audiochoose("driver", value);
  c.audiochoose("missing", 1); c.audiochoose("driver", 0);
  hardware.catalogs[0].option2 = []; hardware.option2 = -1; c.audiorefresh(); c.audiochoose("option2", 0);
  h.advance(200);
  check(audioWrites(h).length === 0, "only an explicit valid changed index can request a native write");
  equal(lastMessage(h, "audio_option2_menu", "ignoreclick").args, [1], "a driver option without reported choices is disabled");
  equal(hardware.menuItems.option2, [], "unsupported native option remains empty instead of gaining a selectable fake device");
  equal(lastMessage(h, "audio_setup", "ignoreclick").args, [0], "native Audio Setup remains accessible");
});

test("driver changes fade first, retain rendered audio, and rebuild driver-specific choices", () => {
  const h = makeHost(), c = h.c, hardware = readyAudio(h, {reentrant: true}); h.renderOnly();
  const result = h.output(), nativeStarts = messages(h, "audio_driver", "startwindow").length, requested = h.time();
  c.audiochoose("driver", 1);
  check(c.CMPEAudioState().changing && c.CMPEAudioState().pending.phase === "fade", "explicit change waits in the fade phase");
  check(messages(h, "audio_test_stop", "bang").length > 0 && messages(h, "live_stop", "bang").length > 0, "pending test tone and all output gates stop immediately");
  h.advance(29); check(audioWrites(h).length === 0, "hardware remains untouched for the fade interval"); h.advance(1);
  equal(audioWrites(h).map(e => [e.name, e.args[0]]), [["audio_ad_switch", 0], ["audio_ad_driver", 1]], "DSP is disabled before changing the selected native driver index");
  near(audioWrites(h)[0].now - requested, 30, 1e-9, "hardware changes occur after the full 30 ms fade");
  for (const name of ["audio_test_stop", "live_stop"])
    check(lastMessage(h, name, "bang").now < audioWrites(h)[0].now, "native stop precedes global audio changes");
  h.advance(150);
  check(!c.CMPEAudioState().changing && !c.CMPEAudioState().audioOn && hardware.on === 0, "confirmed driver change leaves audio off for an explicit restart");
  equal(c.CMPEAudioState().labels, ["Audio device", "Driver option 2"], "new driver's actual option names replace old labels");
  equal(c.CMPEAudioState().menus.option1.items, ["Fixture duplex A", "Fixture duplex B"], "new driver's actual device choices replace the previous list");
  check(c.CMPEAudioState().menus.option2.items.length === 0, "unused second option stays empty");
  equal(lastMessage(h, "audio_option2_menu", "ignoreclick").args, [1], "unused second option remains disabled");
  check(c.outputReady && h.output() === result && c.state === "ready", "device selection preserves the cached completed render");
  check(messages(h, "audio_driver", "startwindow").length === nativeStarts, "device selection does not start another performance");
});

test("device selection cancels finite audio waits, rendering, and playback", () => {
  for (const stage of ["waiting", "rendering", "playing"]) {
    const h = makeHost(), c = h.c; readyAudio(h, {on: stage !== "waiting"});
    if (stage === "playing") { h.renderOnly(); c.play(); h.until(() => c.state === "playing"); }
    else { c.play(); if (stage === "rendering") h.until(() => c.state === "rendering"); }
    check(c.state === stage, "fixture enters the relevant finite state before changing devices");
    const staleRender = c.renderTask, written = h.pokes.length, starts = outs(h, 3, "bang").length;
    c.audiochoose("option2", 1);
    if (staleRender) staleRender.fn.call(staleRender.self);
    h.advance(180);
    check(["idle", "ready"].includes(c.state) && !c.CMPEAudioState().changing, "device change completes with the transport stopped");
    check(h.pokes.length === written && outs(h, 3, "bang").length === starts, "cancelled render/wait cannot write or autoplay later");
    check(!c.audioTask || !c.audioTask.active, "audio startup polling is cancelled before changing devices");
    if (stage === "playing") check(c.outputReady, "completed audio stays available after playback is stopped");
  }
});

test("every live mode closes recording and cancels voices before a hardware change", () => {
  for (const mode of [1, 2, 3]) {
    const h = makeHost(), c = h.c; readyAudio(h, {sr: mode === 3 ? 48000 : 2000}); h.startLive(mode);
    c.recordpath("/tmp/audio-device-change.wav");
    check(c.CMPEState().recording, "fixture has an open native recording before changing hardware");
    const stale = pendingLive(h); c.audiochoose("option1", 1);
    check(!c.CMPEState().recording && !c.CMPEState().recordArmed && c.CMPEState().activeTasks === 0,
      "live performance scheduling and recording stop immediately");
    const commands = h.voiceEvents.length;
    for (const task of stale) task.fn.call(task.self);
    h.advance(180);
    check(h.voiceEvents.length === commands && c.state === "idle", "stale live callbacks cannot restart audio during a hardware change");
    const firstWrite = audioWrites(h)[0];
    check(lastMessage(h, "recorder", "int").args[0] === 0 && lastMessage(h, "recorder", "int").now < firstWrite.now,
      "recording is closed before the first global DSP write");
    check(lastMessage(h, "audio_test_stop", "bang").now < firstWrite.now
      && lastMessage(h, "live_stop", "bang").now < firstWrite.now, "native test-tone cancellation and mix fade precede hardware changes");
  }
});

test("audio power follows confirmed readback without automatically starting a performance", () => {
  const h = makeHost(), c = h.c; readyAudio(h, {on: false, writeFeedback: false});
  c.audiopower(); h.advance(30);
  equal(audioWrites(h).map(e => [e.name, e.args[0]]), [["audio_ad_switch", 1]], "power ON requests only the native DSP switch");
  check(lastMessage(h, "audio_power", "text").args[0] === "AUDIO OFF", "button does not report success before native readback");
  h.advance(150);
  check(c.CMPEAudioState().audioOn && lastMessage(h, "audio_power", "text").args[0] === "AUDIO ON", "confirmed native state updates the power display");
  check(c.state === "idle" && h.voiceEvents.length === 0 && outs(h, 3, "bang").length === 0, "power ON does not start playback or a live instrument");
  c.audiopower(); h.advance(180);
  check(!c.CMPEAudioState().audioOn && lastMessage(h, "audio_power", "text").args[0] === "AUDIO OFF", "power OFF is confirmed and displayed");
});

test("unknown or rejected native power state stays explicit and recoverable", () => {
  const unknown = makeHost(); unknown.c.loadbang(); unknown.advance(100); unknown.c.audiopower();
  check(audioWrites(unknown).length === 0 && !unknown.c.CMPEAudioState().changing, "unknown DSP state cannot be guessed into a power change");
  check(lastMessage(unknown, "audio_power", "text").args[0] === "AUDIO ?", "unknown native state is labelled honestly");
  const h = makeHost(), c = h.c, hardware = readyAudio(h, {on: false}); hardware.applyWrites = false;
  c.audiopower(); h.advance(1300);
  check(!c.CMPEAudioState().changing && !c.CMPEAudioState().audioOn, "a rejected request does not become a false on state");
  check(/unconfirmed/.test(h.values.get("audio_status")) && /AUDIO SETUP/.test(h.values.get("status")), "failed confirmation explains the native settings recovery path");
});

test("Audio Setup stops running audio before opening native settings", () => {
  const h = makeHost(), c = h.c; readyAudio(h); h.startLive(1); c.recordpath("/tmp/audio-setup.wav");
  c.audiosetup(); h.advance(29);
  check(messages(h, "audio_setup_native", "bang").length === 0 && audioWrites(h).length === 0, "settings shortcut waits for the mix fade");
  check(c.state === "idle" && !c.CMPEState().recording, "settings shortcut closes the live performance and its recording immediately");
  h.advance(1);
  check(messages(h, "audio_setup_native", "bang").length === 1, "native settings open once after fading");
  check(h.events.indexOf(audioWrites(h)[0]) < h.events.indexOf(lastMessage(h, "audio_setup_native", "bang")), "global audio stops before the settings window opens");
  h.advance(150); check(!c.CMPEAudioState().audioOn && !c.CMPEAudioState().changing, "opening settings leaves audio stopped until explicitly restarted");
});

test("STOP and shutdown cancel pending audio changes and reject stale callbacks", () => {
  for (const action of ["stop", "shutdown"]) {
    const h = makeHost(), c = h.c; readyAudio(h); c.audiochoose("driver", 1);
    const stale = h.tasks.filter(t => t.active); h.advance(10); c[action]();
    for (const task of stale) task.fn.call(task.self);
    h.advance(300);
    check(audioWrites(h).length === 0 && !c.CMPEAudioState().changing, "cancelled fade never applies its pending hardware request");
    if (action === "shutdown") check(h.tasks.every(t => !t.active) && c.CMPEAudioState().disposed, "shutdown removes polling as well as change tasks");
  }
  const h = makeHost(), c = h.c; readyAudio(h); c.audiochoose("driver", 1); h.advance(30);
  const stale = h.tasks.filter(t => t.active); c.shutdown(); const count = audioWrites(h).length;
  for (const task of stale) task.fn.call(task.self); h.advance(300);
  check(audioWrites(h).length === count && h.tasks.every(t => !t.active), "shutdown after applying a setting cannot run a stale confirmation or poll");
});

test("synchronous STOP or shutdown during DSP feedback prevents the following device write", () => {
  for (const action of ["stop", "shutdown"]) {
    const h = makeHost(), c = h.c, hardware = readyAudio(h);
    hardware.afterWrite = kind => { if (kind === "switch") { hardware.afterWrite = null; c[action](); } };
    c.audiochoose("driver", 1); h.advance(300);
    equal(audioWrites(h).map(e => [e.name, e.args[0]]), [["audio_ad_switch", 0]], "cancellation inside native DSP feedback fences the subsequent driver selection");
    check(!c.CMPEAudioState().changing && c.CMPEAudioState().pending === null, "reentrant cancellation clears the pending transaction");
    if (action === "shutdown") check(h.tasks.every(t => !t.active), "reentrant shutdown leaves no polling or confirmation tasks");
  }
});

test("changed device catalogs during the fade cannot select a different physical choice", () => {
  for (const change of ["driver-reorder", "option-reorder", "replacement", "disappearance", "driver-changed"]) {
    const h = makeHost(), c = h.c, hardware = readyAudio(h);
    const kind = change === "driver-reorder" ? "driver" : "option2";
    c.audiochoose(kind, 1); h.advance(10);
    if (change === "driver-reorder") hardware.drivers.reverse();
    else if (change === "option-reorder") hardware.catalogs[0].option2.reverse();
    else if (change === "replacement") hardware.catalogs[0].option2[1] = "Fixture replacement output";
    else if (change === "disappearance") hardware.catalogs[0].option2.pop();
    else hardware.driver = 1;
    h.advance(170);
    equal(audioWrites(h).map(e => [e.name, e.args[0]]), [["audio_ad_switch", 0]], "obsolete indices cannot write a driver or device after enumeration changes");
    check(!c.CMPEAudioState().changing && !c.CMPEAudioState().audioOn, "invalidated selection ends with audio safely stopped");
    check(/choices changed/.test(h.values.get("audio_status")), "changed choice identity is reported for a fresh user selection");
  }
});

test("final device confirmation checks the selected identity, not only its old numeric index", () => {
  const h = makeHost(), c = h.c, hardware = readyAudio(h);
  c.audiochoose("option2", 1); h.advance(30);
  check(audioWrites(h).some(e => e.name === "audio_ad_option2" && e.args[0] === 1), "fixture applies the originally selected option before it changes");
  hardware.catalogs[0].option2[1] = "Fixture newly enumerated output"; h.advance(150);
  check(!c.CMPEAudioState().changing && /unconfirmed/.test(h.values.get("audio_status")), "same index with a new identity cannot be reported as confirmed");
});

test("Audio Setup retains a native recovery path when adstatus controls are missing", () => {
  const h = makeHost(), c = h.c; readyAudio(h);
  h.objects.delete("audio_ad_switch"); h.objects.delete("audio_setup_native");
  c.audiosetup(); h.advance(30);
  check(messages(h, "audio_driver", "stop").length === 1 && messages(h, "audio_driver", "open").length === 1,
    "existing native dac~ stops audio and opens settings as the fallback");
  check(h.events.indexOf(lastMessage(h, "audio_driver", "stop")) < h.events.indexOf(lastMessage(h, "audio_driver", "open")),
    "fallback stop still precedes opening native settings");
  h.advance(1600); check(!c.CMPEAudioState().changing, "missing control objects do not leave a permanent settings lock");
});

test("external native settings changes stop a live performance without writing preferences", () => {
  const h = makeHost(), c = h.c, hardware = readyAudio(h); h.startLive(1); c.recordpath("/tmp/external-change.wav");
  hardware.driver = 1; h.advance(2050);
  check(c.state === "idle" && !c.CMPEState().recording && c.CMPEState().activeTasks === 0, "polling a real external driver change closes performance and recording");
  check(audioWrites(h).length === 0, "observing a change from Max does not overwrite global hardware choices");
  equal(c.CMPEAudioState().menus.option1.items, ["Fixture duplex A", "Fixture duplex B"], "external driver selection rebuilds the dependent device list");
});

test("native menu rebuilds retain identity long enough to stop a changed device once", () => {
  const h = makeHost(), c = h.c, hardware = readyAudio(h); h.startLive(1);
  hardware.catalogs[0].option2[0] = "Fixture replacement at the same index";
  function notify() {
    c.audiomenu("option2", "clear");
    for (const item of hardware.catalogs[0].option2) c.audiomenu("option2", "append", item);
    c.audiomenu("option2", "set", 0); c.audiovalue("option2", 0);
  }
  notify(); h.advance(10);
  check(c.state === "idle" && c.CMPEState().activeTasks === 0, "changed item identity survives clear/append/set and stops the live mode");
  const stops = messages(h, "audio_test_stop", "bang").length;
  notify(); h.advance(10);
  check(messages(h, "audio_test_stop", "bang").length === stops, "repeating unchanged native feedback does not stop again");
  check(audioWrites(h).length === 0, "native change notifications never select hardware themselves");
});

test("readback-only refresh retains native menus and repeated enumeration never duplicates them", () => {
  const h = makeHost(), c = h.c, hardware = readyAudio(h);
  const before = plain(c.CMPEAudioState().menus), clears = messages(h, "audio_driver_menu", "clear").length;
  hardware.enumerate = false; c.audiorefresh();
  equal(c.CMPEAudioState().menus, before, "a current-index response does not erase the previously enumerated catalog");
  check(messages(h, "audio_driver_menu", "clear").length === clears, "JS does not clear the native list before asking for a read");
  hardware.enumerate = true; c.audiorefresh(); c.audiorefresh();
  equal(hardware.menuItems.driver, hardware.drivers, "native driver entries appear exactly once after repeated refreshes");
  equal(hardware.menuItems.option2, hardware.catalogs[0].option2, "native device entries are not appended again by JS telemetry");
  check(audioWrites(h).length === 0, "recovering and refreshing menus is read-only");
});

test("deferred native replies and driver left-outlet-only feedback support a confirmed device change", () => {
  const h = makeHost(), c = h.c, hardware = readyAudio(h, {deferMs: 15, driverValue: false});
  h.until(() => c.CMPEAudioState().menus.option2.items.length === 2);
  c.audiochoose("option2", 1); h.advance(30);
  equal(audioWrites(h).map(e => [e.name, e.args[0]]), [["audio_ad_switch", 0]],
    "the device write waits for deferred DSP-off and enumeration responses");
  h.advance(400);
  check(!c.CMPEAudioState().changing && !c.CMPEAudioState().notice && hardware.option2 === 1,
    "fresh asynchronous readback confirms the requested device without a driver right-outlet value");
  check(hardware.on === 0 && c.state === "idle", "confirmed settings leave playback stopped");
  equal(hardware.menuItems.option2, hardware.catalogs[0].option2, "deferred native population does not duplicate entries");
});

test("an older poll cannot authorize a stale index while a fresh catalog is still in flight", () => {
  const h = makeHost(), c = h.c, hardware = readyAudio(h);
  hardware.replyDelays = {driver: 100, option1: 100, option2: 100};
  c.audiochoose("option2", 1); h.advance(10);
  hardware.catalogs[0].option2.reverse();
  const earlierPoll = new c.Task(() => {
    c.audiomenu("driver", "set", 0); c.audiovalue("driver", 0);
    c.audiomenu("option1", "set", 0); c.audiovalue("option1", 0);
    c.audiomenu("option2", "set", 0); c.audiovalue("option2", 0);
  }, c);
  earlierPoll.schedule(30); h.advance(60);
  equal(audioWrites(h).map(e => [e.name, e.args[0]]), [["audio_ad_switch", 0]],
    "a delayed old set/value cannot stand in for the requested full enumeration");
  h.advance(150);
  check(!c.CMPEAudioState().changing && /choices changed/.test(h.values.get("audio_status")),
    "fresh catalog identity mismatch rejects the obsolete requested index");
  check(!audioWrites(h).some(e => e.name === "audio_ad_option2"), "the newly reordered physical device is never selected");
});

test("partial deferred menu enumeration stays pending until its closing set arrives", () => {
  const h = makeHost(), c = h.c, hardware = readyAudio(h);
  hardware.silentKinds = ["option2"];
  c.audiochoose("option2", 1); h.advance(30);
  hardware.emitMenu("option2", "clear"); h.advance(100);
  check(c.CMPEAudioState().changing && !audioWrites(h).some(e => e.name === "audio_ad_option2"),
    "a clear without the rest of the required catalog neither applies nor rejects the selection");
  for (const item of hardware.catalogs[0].option2) hardware.emitMenu("option2", "append", item);
  hardware.emitMenu("option2", "set", 0); hardware.silentKinds = []; h.advance(300);
  check(!c.CMPEAudioState().changing && !c.CMPEAudioState().notice && hardware.option2 === 1,
    "completed deferred enumeration lets the same valid choice finish");
});

test("a known driver catalog remains selectable when the current driver index is unavailable", () => {
  const h = makeHost(), c = h.c, hardware = readyAudio(h);
  hardware.omitDriverIndex = true; c.audiorefresh();
  check(c.CMPEAudioState().menus.driver.index === -1, "fixture reports a catalog with no selected driver");
  equal(lastMessage(h, "audio_driver_menu", "ignoreclick").args, [0], "the driver control can recover from an unknown current index");
  c.audiochoose("driver", 1);
  check(c.CMPEAudioState().changing, "an explicit known driver choice is accepted even when the old current index is missing");
  hardware.omitDriverIndex = false; h.advance(180);
  check(hardware.driver === 1 && !c.CMPEAudioState().changing && !c.CMPEAudioState().notice,
    "fresh validation and readback still confirm the requested driver");
});

test("delayed hardware application waits for confirmed audio-off before writing the device", () => {
  const h = makeHost(), c = h.c, hardware = readyAudio(h, {applyDelay: 100, deferMs: 10, writeFeedback: false});
  c.audiochoose("option2", 1); h.advance(90);
  check(hardware.on === 1 && !audioWrites(h).some(e => e.name === "audio_ad_option2"),
    "delayed DSP stop cannot be mistaken for confirmation that audio is already off");
  h.advance(500);
  check(hardware.on === 0 && hardware.option2 === 1 && !c.CMPEAudioState().changing && !c.CMPEAudioState().notice,
    "read requests confirm eventual hardware application without repeating writes");
  equal(audioWrites(h).map(e => [e.name, e.args[0]]), [["audio_ad_switch", 0], ["audio_ad_option2", 1]],
    "bounded retries query state instead of repeatedly changing preferences");
});

test("deferred settings waits time out or cancel without a later device write", () => {
  const timed = makeHost(), timedHardware = readyAudio(timed);
  timedHardware.dropReplies = true; timed.c.audiochoose("option2", 1); timed.advance(1800);
  check(!timed.c.CMPEAudioState().changing && !timed.c.CMPEAudioState().refreshing,
    "missing native feedback cannot leave the settings controls permanently locked");
  check(!audioWrites(timed).some(e => e.name === "audio_ad_option2"), "unconfirmed native lists cannot authorize a device write");
  for (const action of ["stop", "shutdown"]) {
    const h = makeHost(), c = h.c, hardware = readyAudio(h);
    hardware.replyDelays = {driver: 100, option1: 100, option2: 100, switch: 100};
    c.audiochoose("option2", 1); h.advance(40); c[action](); h.advance(500);
    check(!c.CMPEAudioState().changing && !audioWrites(h).some(e => e.name === "audio_ad_option2"),
      "late native replies cannot resume a cancelled " + action + " transaction");
    if (action === "shutdown") check(h.tasks.filter(t => !t.nativeReply).every(t => !t.active),
      "shutdown cancels all controller-owned read, confirmation, and poll tasks");
  }
});

test("native setup and power confirmation do not depend on a driver-menu reply", () => {
  const h = makeHost(), c = h.c; readyAudio(h, {on: false});
  h.objects.delete("audio_ad_driver");
  c.audiopower(); h.advance(180);
  check(c.CMPEAudioState().audioOn && !c.CMPEAudioState().changing && !c.CMPEAudioState().notice,
    "fresh DSP confirmation suffices for a power request when the driver menu cannot respond");
  c.audiosetup(); h.advance(180);
  check(messages(h, "audio_setup_native", "bang").length === 1 && !c.CMPEAudioState().changing && !c.CMPEAudioState().audioOn,
    "native settings still open and confirm stopped audio independently of driver enumeration");
});

test("instrument presets do not save or restore global audio-device settings", () => {
  const h = makeHost(), c = h.c; readyAudio(h); c.mode(1);
  const preset = h.savePreset();
  check(!Object.keys(preset).some(key => /audio|driver|device/i.test(key)), "saved instrument settings exclude global hardware preferences");
  h.restore(preset); for (let i = 0; i < 3; i++) h.source(i); h.advance(200);
  check(audioWrites(h).length === 0, "restoring instrument settings cannot select a device or toggle audio");
});

console.log(JSON.stringify({runtime: bundle ? "bundle" : "modules", scenarios, checks, framesChecked, failures}, null, 2));
if (failures.length) process.exitCode = 1;
