"use strict";
// Reuses the repository's Max boundary simulator, then runs the actual M4L
// adapter against the real musical models and controller. These are not native
// Live/Max tests; the host verification document remains a separate requirement.
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const assert = require("node:assert/strict");
const root = path.resolve(__dirname, "../..");
const bundle = process.argv.includes("--bundle");
const harnessFile = path.join(__dirname, "test_cmpe_controller.js");
let harnessSource = fs.readFileSync(harnessFile, "utf8").split("\nfunction messages(")[0];
harnessSource = harnessSource
  .replace('"cmpe_audio_settings.js"', '"cmpe_m4l_adapter.js"')
  .replace("function makeHost(seed = 91)", "function makeHost(seed = 91, deviceMode = 0)")
  .replace('jsarguments: ["cmpe_variety.js"]', 'jsarguments: ["cmpe_m4l.js", deviceMode]')
  .replace('bundle ? ["cmpe_variety.js"]', 'bundle ? ["max-for-live/cmpe_m4l.js"]');
const harnessModule = {exports: {}};
vm.runInNewContext(harnessSource + "\nmodule.exports = {makeHost};", {
  require, module: harnessModule, process: {argv: ["node", harnessFile, root].concat(bundle ? ["--bundle"] : [])},
  __dirname, console
}, {filename: harnessFile});
const modeNames = ["APG", "ISJS", "Many", "RMHS", "SIOE"];
let checks = 0, scenarios = 0, comparedFrames = 0;
const failures = [];
function check(value, message) { checks++; assert.ok(value, message); }
function plain(value) { return JSON.parse(JSON.stringify(value)); }
function equal(a, b, message) { checks++; assert.deepEqual(plain(a), plain(b), message); }
function test(name, fn) {
  scenarios++;
  try { fn(); }
  catch (error) { failures.push({name, message: error.message, stack: error.stack.split("\n").slice(0, 5).join("\n")}); }
}
function makeHost(mode = 0, seed = 91) {
  const h = harnessModule.exports.makeHost(seed, mode);
  h.mode = mode;
  h.patch = JSON.parse(fs.readFileSync(path.join(root, "max-for-live/CMPE_" + modeNames[mode] + ".maxpat"), "utf8")).patcher;
  h.parameterNames = [];
  for (const {box} of h.patch.boxes) {
    const name = box.varname;
    if (!name) continue;
    if (!h.objects.has(name)) h.objects.set(name, {
      message(selector, ...args) {
        h.events.push({type: "message", name, selector, args, now: h.time()});
        if (["set", "int", "float", "text"].includes(selector)) h.values.set(name, args[0]);
      }
    });
    const parameter = box.saved_attribute_attributes && box.saved_attribute_attributes.valueof;
    if (parameter && parameter.parameter_type !== 3) {
      h.parameterNames.push(name);
      if (parameter.parameter_initial_enable) h.values.set(name, parameter.parameter_initial[0]);
    }
  }
  for (const [name, object] of h.objects) object.getvalueof = () => h.values.get(name);
  h.c.notifyclients = () => h.events.push({type: "notifyclients", now: h.time()});
  h.c.patcher.filepath = "/tmp/CMPE Max for Live/CMPE_" + modeNames[mode] + ".amxd";
  h.boot = (sampleRate = 2000) => {
    h.c.samplerate(sampleRate); h.c.dspstate(1); h.c.hostready();
    return h;
  };
  h.completeSources = options => {
    const count = mode === 3 ? 0 : (mode === 2 || mode === 4 ? 1 : 3);
    for (let i = 0; i < count; i++) if (h.c.CMPEState().nativeBusy[i]) h.source(i, options && options[i]);
    return h;
  };
  h.initialize = (sampleRate = 2000) => h.boot(sampleRate).completeSources();
  h.captureUI = () => Object.fromEntries(h.parameterNames.map(name => [name, h.values.get(name)]));
  h.restoreUI = values => { for (const [name, value] of Object.entries(values)) h.values.set(name, value); };
  h.saved = () => JSON.parse(h.c.getvalueof());
  return h;
}
function events(h, name, selector) { return h.events.filter(e => e.type === "message" && e.name === name && e.selector === selector); }
function prohibitedAudio(h) {
  return h.events.filter(e => e.type === "message" && (e.selector === "startwindow" ||
    (/^audio_ad_/.test(e.name) && ["int", "float"].includes(e.selector)) ||
    (e.name === "audio_driver" && ["open", "stop", "start", "startwindow"].includes(e.selector))));
}
function render(h) {
  h.c.newpiece();
  h.until(() => h.c.state === "ready" && h.c.outputReady);
  return h.output();
}

test("All five initialize only after Live, load required demos, and retain stable device modes", () => {
  for (let mode = 0; mode < 5; mode++) {
    const h = makeHost(mode), c = h.c;
    c.loadbang(); h.advance(100);
    check(!c.initialized && !c.M4LState().booted, "raw loadbang cannot overwrite restored values");
    h.initialize();
    equal(c.CMPEState().mode, mode, "fixed instrument");
    equal(c.M4LState().waitingRestore, false, "source restore completes");
    const required = mode === 3 ? 0 : (mode === 2 || mode === 4 ? 1 : 3);
    equal(h.events.filter(e => e.selector === "read").length, required, "only required sample files read");
    c.hostready(); c.mode((mode + 1) % 5); h.advance(100);
    equal(c.CMPEState().mode, mode, "mode is fixed after repeated host messages");
    equal(h.events.filter(e => e.selector === "read").length, required, "startup demo cannot reload on a later Live initialization bang");
    equal(prohibitedAudio(h), [], "Live owns all audio device settings");
    if (mode === 0 || mode === 4) equal(h.values.get("new_button"), "GENERATE", "finite render label survives mode refresh");
    if (mode === 2 || mode === 3) equal(h.values.get("selection_info"), "Record this instrument on a Live track.", "no hidden standalone recorder instructions");
  }
});

test("Live parameters restored before initialization survive default setup", () => {
  const h = makeHost(3), c = h.c;
  h.values.set("param1", 432); h.values.set("param3", 125); h.values.set("monitor_level", -23);
  c.param(2, 11); c.midilatch(1);
  h.initialize();
  const settings = c.CMPEState().settings;
  equal(settings.rmhs.fundamentalHz, 432, "stored fundamental survives default setup");
  equal(settings.rmhs.durationSeconds, 125, "stored duration survives default setup");
  equal(settings.rmhs.intervalSemitones, 11, "early parameter output survives default setup");
  equal(settings.monitorDb, -23, "stored level survives default setup");
  check(c.M4LState().latch, "latch restored");
});

test("MIDI and manual PLAY never generate finite audio implicitly", () => {
  for (const mode of [0, 4]) {
    const h = makeHost(mode).initialize(), c = h.c;
    c.play(); c.midinote(60, 100, 1); h.advance(1000);
    equal(c.state, "idle", "unprepared trigger stays idle");
    equal(c.M4LState().heldNotes, 0, "unprepared notes are not queued");
    check(!c.outputReady && !h.pokes.length, "no audio render on PLAY or note");
    if (mode === 4) { c.choice(0); c.param(0, 3); c.param(2, 0.1); }
    c.newpiece(); c.midinote(60, 100, 1);
    equal(c.M4LState().heldNotes, 0, "notes during rendering are discarded");
    h.until(() => c.state === "ready" && c.outputReady);
    check(h.events.some(e => e.name === "status" && /Rendering.*%/.test(String(e.args[0]))), "visible status carries render percentage");
    equal(c.state, "ready", "render never autoplays or services an old note");
    c.midinote(60, 100, 1);
    equal(c.state, "playing", "a new note starts prepared audio");
    equal(c.M4LState().activeNote, "1:60", "correct note owns gate");
    equal(events(h, "m4l_velocity", "list").at(-1).args, [100 / 127, 5], "MIDI velocity controls output gain");
    c.midinote(61, 0, 1); equal(c.state, "playing", "unrelated note-off does not stop");
    c.midinote(60, 0, 1); h.advance(20);
    equal(c.state, "ready", "matching note-off stops");
  }
});

test("Five instruments respond to notes and deactivation stops performance without changing hardware", () => {
  for (let mode = 0; mode < 5; mode++) {
    const h = makeHost(mode).initialize(), c = h.c;
    if (mode === 0) render(h);
    if (mode === 4) { c.choice(0); c.param(0, 2); c.param(2, 0.1); render(h); }
    c.midinote(57, 90, 2);
    equal(c.state, mode === 0 || mode === 4 ? "playing" : "live", "notes trigger correct engine");
    if (mode === 3) equal(c.CMPEState().settings.rmhs.fundamentalHz, 220, "MIDI note sets drone fundamental");
    c.hostactive(0); h.advance(1000);
    check(c.state === "ready" || c.state === "idle", "disabled device has no performance");
    equal(c.CMPEState().activeTasks, 0, "all live scheduling canceled");
    equal(c.M4LState().heldNotes, 0, "held notes cleared on deactivate");
    equal(events(h, "m4l_velocity", "list").at(-1).args[0], 0, "disabled output muted");
    c.midinote(60, 100, 1); c.hostactive(1); h.advance(100);
    check(c.state === "ready" || c.state === "idle", "reactivation does not replay an ignored note");
    equal(prohibitedAudio(h), [], "no global DSP or driver commands");
    if (mode === 0 || mode === 4) check(c.outputReady && c.M4LState().prepared, "deactivation preserves prepared result");
  }
});

test("MIDI gate has last-note priority, latch ignores release, and manual playback is independent", () => {
  const h = makeHost(3).initialize(), c = h.c;
  c.midinote(45, 127, 1); c.midinote(57, 64, 1);
  equal(c.CMPEState().settings.rmhs.fundamentalHz, 220, "last note pitch wins");
  c.midinote(57, 0, 1);
  equal(c.CMPEState().settings.rmhs.fundamentalHz, 110, "release returns to held note");
  c.midilatch(1); c.midinote(45, 0, 1);
  equal(c.state, "live", "latch ignores note release");
  c.midilatch(0);
  equal(c.state, "idle", "turning latch off releases unheld sound");
  c.play(); c.midinote(45, 0, 1);
  equal(c.state, "live", "MIDI releases cannot stop manually started performance");
  c.stop(); equal(c.state, "idle", "STOP always works");
});

test("Source paths, loop, parameters, and deterministic output survive saved Set roundtrip and changed host rate", () => {
  for (const mode of [0, 4]) {
    const h = makeHost(mode).initialize(), c = h.c;
    if (mode === 4) { c.choice(0); c.param(0, 3); c.param(2, 0.1); }
    if (mode === 0) { c.repeats(1, 7); c.pitch(0.31); }
    c.monitor(-19); c.midilatch(1);
    const before = render(h).data.map(ch => Array.from(ch));
    c.wavechange(0, c.outputDurationMs, c.outputDurationMs * .15, c.outputDurationMs * .8);
    c.wavemouse(0, 0, 0); h.advance(1); c.loopmode(1);
    const serialized = c.getvalueof(), saved = JSON.parse(serialized), values = h.captureUI();
    check(saved.prepared.seed > 0, "render seed stored");
    equal(saved.prepared.sampleRate, 2000, "original render rate stored");
    check(saved.settings.samples[0] === "cmpe-demo:1", "packaged demo path portable");
    const restored = makeHost(mode, 456), d = restored.c;
    d.patcher.filepath = "/another/location/CMPE_" + modeNames[mode] + ".amxd";
    restored.restoreUI(values); d.setvalueof(serialized); restored.boot(3000).completeSources();
    check(d.M4LState().rebuilding, "saved composition reconstruction visible");
    d.midinote(60, 100, 1);
    restored.until(() => d.state === "ready" && d.outputReady);
    equal(d.sampleRate, 3000, "Live engine sample rate preserved");
    equal(d.plan.sampleRate, 2000, "cached PCM rebuilt at original rate");
    equal(restored.output().data.map(ch => Array.from(ch)), before, "same stored audio samples rebuilt");
    comparedFrames += before[0].length;
    equal(d.selectedStart, c.selectedStart, "loop start restored");
    equal(d.selectedEnd, c.selectedEnd, "loop end restored");
    check(d.loopEnabled && d.M4LState().latch, "loop and latch restored");
    equal(d.state, "ready", "Set restore does not autoplay");
    equal(d.M4LState().heldNotes, 0, "note during rebuild not queued");
    equal(d.paths[0], "/another/location/apgw_test1.wav", "portable demo resolves beside current device");
    equal(prohibitedAudio(restored), [], "restore makes no global audio changes");
  }
});

test("Custom source with demo filename stays external; changed file geometry blocks exact rebuild", () => {
  const h = makeHost(0).initialize(), c = h.c;
  c.loadfile(0, "/recordings/apgw_test1.wav"); h.source(0); render(h);
  const saved = c.getvalueof();
  equal(JSON.parse(saved).settings.samples[0], "/recordings/apgw_test1.wav", "unrelated custom file is not converted to package token");
  const restored = makeHost(0), d = restored.c;
  restored.restoreUI(h.captureUI()); d.setvalueof(saved); restored.boot().completeSources([{frames: 258}]);
  check(!d.M4LState().prepared && !d.outputReady, "changed source length invalidates previous audio identity");
  check(/source changed/i.test(restored.values.get("status")), "changed source reported visibly");
});

test("New generation uses new seed; settings changes during playback invalidate next MIDI trigger", () => {
  const h = makeHost(0).initialize(), c = h.c;
  render(h); const firstSeed = c.M4LState().renderSeed;
  render(h); check(c.M4LState().renderSeed !== firstSeed, "GENERATE creates a new composition");
  c.play(); c.pitch(.77);
  equal(c.state, "playing", "setting change preserves current playback");
  equal(c.pitchRange, .77, "generation setting editable between triggers");
  check(c.dirty && !c.M4LState().prepared, "next trigger requires generation with new settings");
  c.stop(); h.advance(20); c.midinote(60, 100, 1);
  equal(c.state, "ready", "dirty audio not retriggered silently");
  check(!h.saved().prepared, "unprepared state cannot claim preserved rendered output");
});

test("XY changes synchronize both Live parameters; drone edits affect the next trigger", () => {
  const h = makeHost(1).initialize(), c = h.c;
  c.xy(.25, .8);
  equal(h.values.get("m4l_position"), .25, "pad x stored in Live control");
  equal(h.values.get("m4l_density"), .8, "pad y stored in Live control");
  c.hostxy("x", .7); c.hostxy("y", .2);
  equal(c.CMPEState().settings.isjs.position, .7, "automated x updates grain position");
  equal(c.CMPEState().settings.isjs.densityY, .2, "automated y updates grain density");
  const drone = makeHost(3).initialize(); drone.c.play(); drone.c.param(4, 17);
  equal(drone.c.state, "live", "editing next drone does not stop current performance");
  equal(drone.c.CMPEState().settings.rmhs.harmonics, 17, "next-trigger harmonic setting stored");
});

test("Loop automation updates native playback and independently restored XY axes retain both values", () => {
  const h = makeHost(0).initialize(), c = h.c;
  render(h); c.play(); c.loopmode(1); h.advance(20);
  equal(c.state, "playing", "loop change restarts selected playback");
  equal(events(h, "loop_flag", "float").at(-1).args[0], 1, "native counter observes loop enabled");
  c.loopmode(0); h.advance(20);
  equal(events(h, "loop_flag", "float").at(-1).args[0], 0, "native counter observes loop disabled");
  for (const order of [["x", "y"], ["y", "x"]]) {
    const xy = makeHost(1);
    for (const axis of order) xy.c.hostxy(axis, axis === "x" ? .8 : .7);
    xy.initialize();
    equal(xy.c.CMPEState().settings.isjs.position, .8, "restored x survives either message order");
    equal(xy.c.CMPEState().settings.isjs.densityY, .7, "restored y survives either message order");
  }
});

test("Deferred native reads preserve incoming host state across save and deactivation", () => {
  const original = makeHost(0).initialize(); original.c.pitch(.71); original.c.repeats(0, 9);
  original.c.loadfile(0, "/saved/new-source.wav"); original.source(0);
  const incoming = original.c.getvalueof();
  const h = makeHost(0).initialize(), c = h.c;
  c.loadfile(0, "/older/pending.wav");
  c.setvalueof(incoming); h.advance(1);
  check(c.CMPEState().restoring, "new host state waits for prior read");
  equal(h.saved().settings.samples[0], "/saved/new-source.wav", "saving during wait preserves incoming path");
  equal(h.saved().settings.apg.pitchRange, .71, "saving during wait preserves incoming settings");
  c.hostactive(0);
  check(c.CMPEState().restoring, "deactivation does not discard pending host state");
  h.source(0); h.completeSources();
  equal(c.CMPEState().settings.apg.repetitions[0], 9, "deferred target eventually applies");
  equal(c.paths[0], "/saved/new-source.wav", "deferred target source is loaded");
  check(!c.M4LState().enabled && c.state === "idle", "restore remains silent while disabled");
});

test("Disabled restore remains dormant, resumes reconstruction on enable, and canceled rebuild cannot autoplay", () => {
  const h = makeHost(0).initialize(); render(h);
  const saved = h.c.getvalueof(), restored = makeHost(0), c = restored.c;
  restored.restoreUI(h.captureUI()); c.setvalueof(saved); c.hostactive(0); restored.boot().completeSources();
  check(c.M4LState().waitingRestore && !c.M4LState().rebuilding, "disabled device postpones reconstruction");
  c.hostactive(1); check(c.M4LState().rebuilding, "enabling begins prepared-result reconstruction");
  c.hostactive(0); check(!c.M4LState().rebuilding, "deactivate cancels reconstruction tasks");
  check(c.M4LState().waitingRestore && c.M4LState().prepared, "saved recipe retained while disabled");
  c.hostactive(1); restored.until(() => c.state === "ready" && c.outputReady);
  equal(c.state, "ready", "resumed preparation remains silent");
});

test("Malformed or mismatched blob state is rejected without changing current sound settings", () => {
  const h = makeHost(3).initialize(), c = h.c;
  c.midinote(57, 64, 1);
  const before = plain(c.CMPEState().settings);
  const noteBefore = c.M4LState().activeNote, gainWritesBefore = events(h, "m4l_velocity", "list").length;
  c.setvalueof("{bad json}");
  const other = h.saved(); other.mode = 0;
  c.setvalueof(JSON.stringify(other)); h.advance(10);
  const brokenSettings = h.saved(); delete brokenSettings.settings.rmhs;
  c.setvalueof(JSON.stringify(brokenSettings)); h.advance(10);
  equal(c.CMPEState().settings, before, "invalid state cannot mutate settings");
  equal(c.M4LState().activeNote, noteBefore, "invalid nested state cannot release current note ownership");
  equal(events(h, "m4l_velocity", "list").length, gainWritesBefore, "invalid state cannot change MIDI gain");
  equal(c.state, "live", "invalid state does not stop current performance");
  check(/State not restored/.test(h.values.get("status")), "state problem shown");
});

test("DEMO loads only required sources and cannot invalidate a SIOE render through late unused reads", () => {
  for (const mode of [2, 4]) {
    const h = makeHost(mode).initialize(), c = h.c;
    c.demos();
    equal(c.CMPEState().nativeBusy, [true, false, false], "single-source device DEMO loads one file");
    h.source(0);
    if (mode === 4) {
      c.choice(0); c.param(0, 2); c.param(2, .1); render(h);
      h.advance(31000);
      check(c.outputReady && !c.dirty && c.M4LState().prepared, "no unused source completion invalidates prepared supercut");
      c.midinote(60, 100, 1); equal(c.state, "playing", "prepared result remains MIDI playable");
    }
  }
});

test("Independent instances use distinct buffers; deletion cancels every scheduled task", () => {
  const a = makeHost(1, 100).initialize(), b = makeHost(1, 200).initialize();
  check(a.c.prefix !== b.c.prefix, "independent buffer namespace");
  check(a.c.outputName !== b.c.outputName, "independent output buffers");
  a.c.play(); b.c.play(); a.c.notifydeleted(); a.advance(1000);
  equal(a.c.CMPEState().activeTasks, 0, "deleted live task registry empty");
  equal(a.tasks.filter(task => task.active).length, 0, "all deleted-device Tasks canceled");
  equal(b.c.state, "live", "another instance continues");
  check(a.c.M4LState().deleted, "deleted flag prevents future restart");
  a.c.hostready(); a.c.midinote(60, 100, 1);
  equal(a.c.state, "idle", "deleted device cannot restart");
});

console.log(JSON.stringify({runtime: bundle ? "bundle" : "modules", scenarios, checks, comparedFrames, failures}, null, 2));
if (failures.length) process.exitCode = 1;
