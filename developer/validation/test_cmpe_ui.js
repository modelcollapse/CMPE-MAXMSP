"use strict";
// Exercise the real production controller through the existing simulated Max
// boundary. This is feedback/PCM regression coverage, not native Max UI QA.
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const root = path.resolve(process.argv[2] || path.join(__dirname, "../.."));
const harnessPath = path.join(root, "developer/validation/test_cmpe_controller.js");
const harness = fs.readFileSync(harnessPath, "utf8");
const marker = 'test("native audio controls route feedback and requests through the guarded controller"';
const boundary = harness.indexOf(marker);
if (boundary < 0) throw new Error("Controller fixture boundary changed; update the UI test loader.");
const tests = String.raw`
if (!runtime.some(source => source.file.endsWith("cmpe_ui_feedback.js"))) {
  runtime.push({file: "developer/cmpe_ui_feedback.js", code: fs.readFileSync(path.join(root, "developer/cmpe_ui_feedback.js"), "utf8")});
}
const view = h => h.c.CMPEUIFeedback();
const label = (h, name) => lastMessage(h, name, "text").args[0];
function loadedLong(h) {
  h.c.loadbang(); h.advance(50);
  for (let slot = 0; slot < 3; slot++) h.source(slot, {frames: 40000 + slot * 1000, sr: 2000});
  h.c.samplerate(2000); h.c.dspstate(1);
}
function contrast(a, b) {
  const luminance = rgb => rgb.slice(0, 3).map(c => c <= .04045 ? c / 12.92 : Math.pow((c + .055) / 1.055, 2.4))
    .reduce((sum, c, i) => sum + c * [.2126, .7152, .0722][i], 0);
  const first = luminance(a), second = luminance(b);
  return (Math.max(first, second) + .05) / (Math.min(first, second) + .05);
}

test("menus and panels use native solid fills and buttons do not invent borders", () => {
  const styles = new Map((patch.styles || []).map(style => [style.name, style.default]));
  for (const {box} of patch.boxes.filter(({box}) => box.presentation)) {
    if (["panel", "umenu"].includes(box.maxclass)) {
      const fill = styles.get(box.style)?.bgfillcolor;
      check(fill && fill.type === "color" && fill.color.length === 4 && fill.autogradient === 0,
        box.id + " has a native solid-fill style");
      check(!Object.hasOwn(box, "bgcolor"), box.id + " does not rely on an unsupported background attribute");
      if (box.maxclass === "umenu") check(box.applycolors === 1, box.id + " uses its fill in the dropdown");
    } else if (box.maxclass === "textbutton") {
      check(!Object.hasOwn(box, "border") && !Object.hasOwn(box, "bordercolor"),
        box.id + " does not rely on unsupported outline attributes");
      equal(box.rounded, 10, box.id + " uses the documented native 10-pixel corner radius");
    }
  }
  const h = makeHost(), c = h.c;
  const classes = new Map(patch.boxes.map(({box}) => [box.varname, box.maxclass]));
  h.onMessage((name, selector) => {
    if (["panel", "umenu"].includes(classes.get(name)))
      check(selector !== "bgcolor", "runtime preserves native fill attributes for " + name);
  });
  h.ready(); c.mode(2); c.play(); h.until(() => c.state === "live"); c.stop(); c.shutdown();
});

test("LOAD remains distinct and readable through loading, playback, and mode changes", () => {
  const h = makeHost(), c = h.c; h.ready();
  const color = (name, selector) => lastMessage(h, name, selector).args;
  const modeAccents = new Set();
  const waveformBackground = patch.boxes.find(({box}) => box.varname === "wave_l").box.bgcolor;
  for (let mode = 0; mode < 5; mode++) {
    c.mode(mode); c.feedbackrefresh();
    const accent = color("mode" + mode, "bgcolor");
    modeAccents.add(JSON.stringify(accent));
    check(contrast(color("mode" + mode, "textcolor"), color("mode" + mode, "bgcolor")) >= 4.5,
      "selected mode retains readable text");
    equal(color("source_accent1", "bgfillcolor"), accent,
      "source accent follows the current instrument");
    check(contrast(color("wave_l", "waveformcolor"), waveformBackground) >= 4.5,
      "the current instrument trace stays visible on the waveform background");
    if (mode > 0) {
      c.param(0, mode === 4 ? 10 : .5);
      equal(color("mode" + mode, "bgcolor"), accent,
        "parameter edits preserve the current instrument accent");
    }
    const required = mode === 3 ? 0 : (mode === 2 || mode === 4 ? 1 : 3);
    for (let slot = 1; slot <= required; slot++) {
      const name = "load" + slot;
      check(contrast(color(name, "textcolor"), color(name, "bgcolor")) >= 7,
        "LOAD text is high contrast when available");
      check(contrast(color(name, "bgcolor"), color("source_card" + slot, "bgfillcolor")) >= 3,
        "LOAD has a distinct control boundary against its source card");
      check(contrast(color(name, "textoncolor"), color(name, "bgoncolor")) >= 4.5,
        "pressed LOAD label remains readable");
      check(contrast(color(name, "textovercolor"), color(name, "bgcolor")) >= 4.5,
        "hover LOAD label remains readable");
      equal(color(name, "active"), [1], "native automatic graying cannot replace the deliberate colors");
      equal(color(name, "usebgoncolor"), [1], "native pressed color is enabled");
      equal(color(name, "usetextovercolor"), [1], "native hover color is enabled");
    }
  }
  equal(modeAccents.size, 5, "each instrument uses a distinct selected color");
  c.mode(0); c.play(); h.until(() => c.state === "playing");
  equal(color("load1", "ignoreclick"), [1], "presentation styling preserves the playback lock");
  check(contrast(color("load1", "textcolor"), color("load1", "bgcolor")) >= 4.5,
    "unavailable LOAD remains readable");
  c.stop(); h.advance(20);
  equal(color("load1", "ignoreclick"), [0], "LOAD becomes clickable when playback stops");
  check(contrast(color("load1", "textcolor"), color("load1", "bgcolor")) >= 7,
    "stopping restores the solid high-contrast LOAD style");
  c.loadfile(0, "/tmp/replacement.wav");
  check(contrast(color("load1", "textcolor"), color("load1", "bgcolor")) >= 4.5,
    "source-loading state does not wash out the label");
  h.source(0);
  check(contrast(color("load1", "textcolor"), color("load1", "bgcolor")) >= 7,
    "completed source read restores the available style");
  c.shutdown();
});

test("sample controls follow instrument slots and APG steps stay in APG", () => {
  const h = makeHost(), c = h.c; h.ready();
  const steps = ["repeat_down1", "repeat_up1", "repeat_down2", "repeat_up2",
    "repeat_down3", "repeat_up3", "pitch_down", "pitch_up"];
  for (let mode = 0; mode < 5; mode++) {
    c.mode(mode);
    const required = mode === 3 ? 0 : (mode === 2 || mode === 4 ? 1 : 3);
    for (const name of steps)
      equal(h.objects.get(name).hidden, mode === 0 ? 0 : 1, name + " follows APG visibility");
    for (let slot = 1; slot <= 3; slot++) {
      for (const prefix of ["source_record", "source_save", "source_wave", "input_state"])
        equal(h.objects.get(prefix + slot).hidden, slot <= required ? 0 : 1,
          prefix + slot + " follows the instrument's actual sample slots");
    }
  }
  c.shutdown();
});

test("input capture feedback distinguishes recording, preparation, and sample saving", () => {
  const h = makeHost(), c = h.c; h.ready();
  const inputState = c.CMPEInputState;
  const priorRenderInfo = h.values.get("render_info");
  let capture = {phase: "recording", busy: true, slot: 0, elapsedMs: 15000, limitMs: 60000};
  c.CMPEInputState = () => capture;
  c.feedbackrefresh();
  equal(view(h).badge, "RECORDING INPUT", "input capture is distinct from output-file recording");
  check(/^Recording sample 1/.test(h.values.get("render_info")), "capture replaces the old generation hint in the visible feedback row");
  near(view(h).progress, .25, 1e-12, "recording progress reflects the actual elapsed fraction of its limit");
  check(contrast(lastMessage(h, "state_badge", "textcolor").args,
    lastMessage(h, "state_badge", "bgcolor").args) >= 4.5, "recording badge remains readable");
  equal(lastMessage(h, "load1", "bgcolor").args, lastMessage(h, "repeat1", "bgcolor").args,
    "source loading and repeat editing share the unavailable style during capture");
  capture = {phase: "trimming", busy: true, slot: 0, elapsedMs: 15000, limitMs: 60000};
  c.feedbackrefresh(); equal(view(h).badge, "FINISHING INPUT", "committing recorded audio is explicit");
  capture = {phase: "saving", busy: false, slot: -1, sources: [{saving: true}, {}, {}]};
  c.feedbackrefresh(); equal(view(h).badge, "SAVING SAMPLE", "saving a sample is distinct from a rendered take");
  check(/^Writing sample 1/.test(h.values.get("render_info")), "the writing source is identified without globally blocking playback");
  c.CMPEInputState = inputState;
  c.feedbackrefresh();
  equal(h.values.get("render_info"), priorRenderInfo, "the normal instrument hint returns after input activity");
  c.shutdown();
});

test("boot, native source loading, and readiness are visibly distinct", () => {
  const h = makeHost(), c = h.c; c.loadbang();
  equal(view(h).badge, "LOADING SAMPLES", "deferred demos are reported as pending");
  h.advance(50); equal(view(h).badge, "LOADING SAMPLES", "native reads remain loading");
  equal(h.values.get("source_state1"), "LOADING", "slot reflects its actual native read");
  h.source(0); h.source(1);
  equal(view(h).badge, "LOADING SAMPLES", "one remaining source keeps loading state");
  h.source(2); equal(view(h).badge, "READY TO GENERATE", "all required loaded samples permit generation");
  equal(label(h, "play_button"), "GENERATE + PLAY", "first playback explains generation");
  check(lastMessage(h, "state_badge", "ignoreclick").args[0] === 1, "status badge is read-only");
  c.shutdown();
});

test("scan, render, ready, playing, loop, and changed settings use real state", () => {
  const h = makeHost(), c = h.c; loadedLong(h);
  c.newpiece(); equal(view(h).badge, "STARTING AUDIO", "audio startup has its own state");
  h.until(() => c.state === "rendering");
  equal(view(h).phase, "scan", "silence scan is not labelled render");
  equal(view(h).progress, c.scanFrame / c.scanLimit, "scan fraction uses the actual checked range");
  h.until(() => view(h).phase === "render");
  h.until(() => c.renderFrame > 0 && c.renderFrame < c.renderHalf);
  near(view(h).progress, c.renderFrame / c.renderHalf, 1e-12, "render fraction uses actual frame count");
  equal(label(h, "play_button"), "PREPARING...", "play visibly waits while rendering");
  h.until(() => c.state === "ready" && c.outputReady);
  equal(view(h).badge, "READY TO PLAY", "ready means a complete buffer exists");
  equal(label(h, "play_button"), "PLAY", "a prepared result replays without regeneration");
  c.play(); h.until(() => c.state === "playing"); c.phase(.25);
  equal(view(h).badge, "PLAYING", "running playback is explicit");
  near(view(h).progress, .25, 1e-12, "play progress comes from native phase input");
  c.loopmode(1); h.advance(10);
  equal(view(h).badge, "LOOPING", "selected repeat mode is explicit");
  c.stop(); h.advance(20); c.pitch(.8);
  equal(view(h).badge, "CHANGES PENDING", "old cached output is distinguished from new settings");
  equal(label(h, "play_button"), "GENERATE + PLAY", "dirty playback will regenerate");
  c.shutdown();
});

test("cancellation and failed generation never claim ready output", () => {
  const h = makeHost(), c = h.c; loadedLong(h);
  c.newpiece(); h.until(() => c.state === "rendering"); c.stop();
  equal(view(h).badge, "CANCELLED", "cancelled work remains identified");
  check(!view(h).outputReady && view(h).progress === 0, "partial buffer has no completed progress");
  c.newpiece(); h.until(() => c.state === "rendering");
  c.renderFailed("Fixture render failure");
  equal(view(h).badge, "RENDER ERROR", "an unsuccessful render has an explicit error state");
  check(!view(h).outputReady, "failed partial waveform never becomes playable");
  c.shutdown();
});

test("native read timeout remains waiting until the native completion arrives", () => {
  const h = makeHost(), c = h.c; c.loadbang(); h.advance(50);
  h.source(1); h.source(2); h.advance(30000);
  check(!c.loading[0] && c.CMPEState().nativeBusy[0], "fixture reproduces the pending native read");
  equal(view(h).badge, "LOAD STALLED", "timeout cannot become false readiness");
  equal(h.values.get("source_state1"), "WAITING", "compact source label fits the current layout");
  h.source(0); equal(view(h).badge, "READY TO GENERATE", "late completion restores the correct state");
  check(!/has not finished|load did not finish/i.test(h.values.get("status")) && view(h).notice === "",
    "successful late native completion removes the stale failure notice");
  c.shutdown();
});

test("live, fade-in, recording, and notice feedback remain separate", () => {
  const h = makeHost(), c = h.c; h.ready(); h.startLive(2);
  equal(view(h).badge, "FADING IN", "Many acknowledges its real initial slow attack");
  h.advance(4200); equal(view(h).badge, "LIVE", "continuous modes do not invent completion percentages");
  equal(view(h).progress, 0, "continuous mode shows no fabricated finite progress");
  c.recordpath("/tmp/ui-feedback-recording.wav");
  equal(view(h).badge, "RECORDING", "recording is visible beyond the button label");
  h.advance(3700);
  check(/Recording did not advance/.test(h.values.get("status")), "failed recording stays visible across live activity pulses");
  check(c.state === "live" && !c.CMPEState().recording, "notice does not change the engine's recovery behavior");
  c.stop(); h.startLive(1);
  equal(view(h).badge, "LIVE", "ISJS runs immediately with no fabricated fade");
  equal(label(h, "play_button"), "LIVE", "running live mode is indicated on transport");
  c.param(0, .7);
  equal(label(h, "play_button"), "LIVE", "private showMode calls cannot reset running transport labels");
  c.stop(); c.mode(3); c.param(0, .1); c.param(3, 2); h.startLive(3);
  equal(view(h).badge, "FADING IN", "drone explains its attack");
  check(h.objects.get("source_state1").hidden === 1, "sample status stays hidden for synthesized drone");
  check(h.objects.get("source_card1").hidden !== 1, "parameter card remains visible when no samples are needed");
  c.shutdown();
});

test("display zoom is bounded, stereo-consistent, and never changes audio samples", () => {
  const h = makeHost(), c = h.c; h.ready(); h.renderOnly();
  const before = h.output().data.map(ch => Array.from(ch));
  const expected = c.renderPeak > c.silenceThreshold ? Math.max(1, Math.min(64, .82 / c.renderPeak)) : 1;
  near(view(h).waveZoom, expected, 1e-12, "completed APG peak determines display scale");
  equal(lastMessage(h, "wave_l", "vzoom").args, [1 / expected], "left waveform receives the reciprocal native amplitude range");
  equal(lastMessage(h, "wave_r", "vzoom").args, [1 / expected], "right waveform receives identical native amplitude range");
  c.feedbackwavezoom(4);
  equal(lastMessage(h, "wave_l", "vzoom").args, [.25], "4x visual gain means a native +/-0.25 range");
  equal(lastMessage(h, "wave_r", "vzoom").args, [.25], "both channels expand at the same gain");
  equal(h.output().data.map(ch => Array.from(ch)), before, "visual scaling leaves every PCM sample unchanged");
  check(/visual only/.test(h.values.get("wave_scale")), "display-only amplification is labelled");
  const count = h.events.length; c.feedbackrefresh(); c.feedbackrefresh();
  equal(h.events.length, count, "unchanged feedback does not emit redundant native messages");
  c.mode(4); equal(view(h).waveZoom, 1, "mode changes discard previous output display scale");
  c.shutdown();
});

test("quiet rendered audio expands within centered full-buffer native waveform views", () => {
  const h = makeHost(), c = h.c;
  c.loadbang(); h.advance(50);
  for (let slot = 0; slot < 3; slot++) h.source(slot, {sample: (channel, i) => .04 * Math.sin(i * .07 + channel * .2)});
  c.samplerate(2000); c.dspstate(1); h.renderOnly();
  const actualPeak = h.output().data.reduce((peak, channel) =>
    channel.reduce((maximum, sample) => Math.max(maximum, Math.abs(sample)), peak), 0);
  check(actualPeak > c.silenceThreshold && actualPeak < .1, "fixture contains quiet audible PCM");
  // Cycling74's index~ help uses vzoom .5 and voffset 1 for a 0..1
  // spectral-gain editor. vzoom specifies range, so projected amplitude divides
  // by it. This asserts the native contract, not execution of Max's painter.
  // https://github.com/Cycling74/max-sdk/blob/15b6fe17eedc7c8a8b4ee249706d3aaf21e192fa/help/index~.maxhelp
  for (const [name, channel] of [["wave_l", 1], ["wave_r", 2]]) {
    const box = patch.boxes.find(entry => entry.box.varname === name).box;
    equal(box.voffset, 0, name + " centers the bipolar waveform");
    equal(box.chanoffset, channel, name + " uses native 1-based channel numbering");
    equal(lastMessage(h, name, "set").args, [c.outputName, channel], name + " is bound to the rendered stereo buffer");
    const range = lastMessage(h, name, "vzoom").args[0];
    check(range >= 1 / 64 && range < 1, name + " narrows the range to enlarge quiet data");
    near(actualPeak / range, .82, 1e-6, name + " projects the real quiet peak to 82% of the half-height");
  }
  equal(lastMessage(h, "wave_link", "list").args,
    [0, c.outputDurationMs, 0, c.outputDurationMs], "both displays cover the complete output buffer");
  c.shutdown();
});

test("SIOE display scale uses the post-normalization peak and keeps the PCM result", () => {
  const h = makeHost(), c = h.c; h.ready(); c.mode(4); c.param(0, 100); c.param(2, .1);
  h.renderOnly();
  const peak = Math.min(c.renderPeak, .98);
  near(view(h).waveZoom, peak > c.silenceThreshold ? Math.max(1, Math.min(64, .82 / peak)) : 1, 1e-12,
    "SIOE display represents the already normalized result");
  const before = h.output().data.map(ch => Array.from(ch));
  c.feedbackrefresh(); equal(h.output().data.map(ch => Array.from(ch)), before, "presentation refresh never normalizes audio");
  c.shutdown();
});

test("optional feedback widgets are safe to omit and installation is idempotent", () => {
  const h = makeHost(), c = h.c;
  for (const name of ["state_badge", "feedback_panel", "activity_heading", "wave_scale",
    "source_card1", "source_card2", "source_card3", "source_state1", "source_state2", "source_state3",
    "group_label1", "group_label2", "group_label3", "group_help1", "group_help2", "group_help3"]) h.objects.delete(name);
  h.ready(); c.feedbackrefresh();
  const ui = c.ui;
  vm.runInContext(fs.readFileSync(path.join(root, "developer/cmpe_ui_feedback.js"), "utf8"), c);
  check(c.ui === ui, "loading the adapter twice does not stack wrappers");
  equal(view(h).badge, "READY TO GENERATE", "feedback still derives state without new widgets");
  c.shutdown();
});

console.log(JSON.stringify({runtime: "production_modules", scenarios, checks, failures, native_max_execution: false}, null, 2));
if (failures.length) process.exitCode = 1;
`;
const sandbox = {require, console, __dirname: path.dirname(harnessPath), process: {
  argv: [process.argv[0], harnessPath, root], exitCode: 0
}};
vm.runInNewContext(harness.slice(0, boundary) + tests, sandbox, {filename: "test_cmpe_ui_fixture.js"});
if (sandbox.process.exitCode) process.exitCode = sandbox.process.exitCode;
