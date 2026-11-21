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
const modules = ["apg_wave_plan.js", "apg_render.js", "cmpe_model.js", "apg_wave_controller.js", "cmpe_extension.js"];
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
    step, advance, until, source, ready, startLive, renderOnly, output, savePreset, restore, time: clock};
}
function messages(h, name, selector) { return h.events.filter(e => e.type === "message" && e.name === name && e.selector === selector); }
function lastMessage(h, name, selector) { return messages(h, name, selector).at(-1); }
function voices(h, engine, selector, voice) { return h.voiceEvents.filter(e => e.engine === engine && e.selector === selector && (voice === undefined || e.voice === voice)); }
function outs(h, index, selector) { return h.events.filter(e => e.type === "outlet" && e.index === index && e.args[0] === selector); }
function pendingLive(h) { return h.tasks.filter(t => t.active && t.createdState === "live"); }

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

console.log(JSON.stringify({runtime: bundle ? "bundle" : "modules", scenarios, checks, framesChecked, failures}, null, 2));
if (failures.length) process.exitCode = 1;
