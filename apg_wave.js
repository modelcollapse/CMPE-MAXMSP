/* APG event planner. ES5 for Max 8's legacy js object and Node validation.
 * Musical algorithm: Joo Won Park, Audio Palindrome Generator, 2020.
 * This is a new Max implementation of the supplied SuperCollider source.
 */
var APGPlan = (function () {
    "use strict";
    function finite(x) { return typeof x === "number" && isFinite(x); }
    function clamp(x, a, b) { return Math.max(a, Math.min(b, x)); }
    function makePlan(sources, repeats, pitchRange, sampleRate, random) {
        var i, j, source, longest = 0, events = [], counts = [], edges = [];
        if (!sources || sources.length !== 3) throw new Error("Load all three samples.");
        if (!finite(sampleRate) || sampleRate <= 0) throw new Error("Audio sample rate is unavailable.");
        if (!repeats || repeats.length !== 3) throw new Error("Three repeat values are required.");
        if (!finite(pitchRange)) throw new Error("Pitch range must be a finite number.");
        pitchRange = clamp(pitchRange, 0, 1);
        random = random || Math.random;
        function rnd() {
            var r = random();
            if (!finite(r) || r < 0 || r >= 1) throw new Error("Random values must be in [0, 1).");
            return r;
        }
        for (i = 0; i < 3; i++) {
            source = sources[i];
            if (!source || typeof source.name !== "string" || !source.name.length ||
                    !finite(source.durationMs) || source.durationMs <= 0 ||
                    !finite(source.frames) || source.frames < 2 || Math.floor(source.frames) !== source.frames ||
                    (source.channels !== 1 && source.channels !== 2)) {
                throw new Error("Each sample must be a nonempty mono or stereo audio buffer.");
            }
            if (!finite(repeats[i])) throw new Error("Repeat values must be finite numbers.");
            longest = Math.max(longest, source.durationMs);
        }
        var totalFrames = Math.max(4, Math.round(2 * longest * sampleRate / 1000));
        // count~ takes integer settings. Keep the entire timeline within signed 32-bit range.
        if (totalFrames > 2147483646) throw new Error("These samples are too long for the sample counter.");
        var pair = 0;
        for (i = 0; i < 3; i++) {
            source = sources[i];
            var maximum = clamp(Math.round(repeats[i]), 1, 20);
            var minimum = Math.ceil(maximum / 2);
            var count = minimum + Math.floor(rnd() * (maximum - minimum + 1));
            counts.push(count);
            for (j = 0; j < count; j++) {
                var amplitude = 0.2 + 0.3 * rnd();
                var location = 0.01 + 0.47 * rnd();
                var rate = 1 + pitchRange * rnd();
                var direction = rnd() < 0.5 ? -1 : 1;
                var length = Math.max(2, Math.round(source.durationMs * sampleRate / (1000 * rate)));
                var a = Math.round(location * totalFrames);
                // Only relevant for sub-millisecond files: keep rounding within the interval.
                a = clamp(a, 0, totalFrames - length);
                var b = totalFrames - a - length;
                var lastMs = source.durationMs * (source.frames - 1) / source.frames;
                var add = function (start, dir) {
                    var ev = {
                        slot: i, pair: pair, bufferName: source.name,
                        startFrame: start, lengthFrames: length,
                        rate: rate, amplitude: amplitude, direction: dir,
                        positionStartMs: dir === 1 ? 0 : lastMs,
                        positionDeltaMs: dir === 1 ? lastMs : -lastMs,
                        mono: source.channels === 1
                    };
                    events.push(ev);
                    var weight = amplitude * 0.8 * (ev.mono ? Math.SQRT1_2 : 1);
                    edges.push({frame: start, delta: weight});
                    edges.push({frame: start + length, delta: -weight});
                };
                add(a, direction);
                add(b, -direction);
                pair++;
            }
        }
        edges.sort(function (a, b) { return a.frame - b.frame || a.delta - b.delta; });
        var bound = 0, peakBound = 0;
        for (i = 0; i < edges.length; i++) {
            bound += edges[i].delta;
            peakBound = Math.max(peakBound, bound);
        }
        return {
            sampleRate: sampleRate, totalFrames: totalFrames,
            durationMs: totalFrames * 1000 / sampleRate,
            counts: counts, events: events,
            // Constant for the whole composition. No compressor or moving gain envelope.
            normalization: Math.min(1, 0.85 / Math.max(0.85, peakBound))
        };
    }
    return {makePlan: makePlan};
}());
if (typeof module !== "undefined" && module.exports) module.exports = APGPlan;


/* APG offline audio renderer, ES5-compatible for the legacy Max js engine.
 * It has no Max-specific calls. readSource supplies contiguous source samples.
 * Musical construction: Joo Won Park's Audio Palindrome Generator.
 */
var APGRender = (function () {
    "use strict";
    function finite(value) { return typeof value === "number" && isFinite(value); }
    function integer(value) { return finite(value) && Math.floor(value) === value; }
    function clamp(value, low, high) { return Math.max(low, Math.min(high, value)); }

    function readChecked(reader, slot, channel, first, count) {
        var data = reader(slot, channel, first, count), i;
        // Max versions may return a scalar when exactly one sample is requested.
        if (count === 1 && finite(data)) data = [data];
        if (!data || !integer(data.length) || data.length < count) {
            throw new Error("Source reader returned too few samples.");
        }
        for (i = 0; i < count; i++) {
            if (!finite(data[i])) throw new Error("Source audio contains a non-finite sample.");
        }
        return data;
    }

    function renderChunk(plan, sources, start, count, readSource) {
        var i, j, event, source, end, n, size, left, right, peak = 0;
        if (!plan || !integer(plan.totalFrames) || plan.totalFrames < 0 ||
                !plan.events || !integer(plan.events.length) || plan.events.length < 0 ||
                !finite(plan.normalization) || plan.normalization < 0 || plan.normalization > 1) {
            throw new Error("Invalid render plan.");
        }
        if (!sources || !integer(sources.length) || sources.length < 1) {
            throw new Error("Source metadata is required.");
        }
        if (!integer(start) || start < 0 || start > plan.totalFrames ||
                !integer(count) || count < 0 || typeof readSource !== "function") {
            throw new Error("Invalid render chunk or source reader.");
        }
        size = Math.min(count, plan.totalFrames - start);
        end = start + size;
        left = new Array(size); right = new Array(size);
        for (i = 0; i < size; i++) { left[i] = 0; right[i] = 0; }

        for (i = 0; i < plan.events.length; i++) {
            event = plan.events[i];
            if (!event || !integer(event.slot) || event.slot < 0 || event.slot >= sources.length ||
                    !integer(event.startFrame) || event.startFrame < 0 ||
                    !integer(event.lengthFrames) || event.lengthFrames < 2 ||
                    event.startFrame + event.lengthFrames > plan.totalFrames ||
                    !finite(event.amplitude) || event.amplitude < 0 ||
                    !finite(event.positionStartMs) || !finite(event.positionDeltaMs)) {
                throw new Error("Invalid event in render plan.");
            }
            source = sources[event.slot];
            if (!source || !integer(source.frames) || source.frames < 2 ||
                    !finite(source.durationMs) || source.durationMs <= 0 ||
                    (source.channels !== 1 && source.channels !== 2) ||
                    Boolean(event.mono) !== (source.channels === 1)) {
                throw new Error("Invalid source metadata for render event.");
            }
            var first = Math.max(start, event.startFrame);
            var last = Math.min(end, event.startFrame + event.lengthFrames);
            if (last <= first || size === 0 || event.amplitude === 0 || plan.normalization === 0) continue;

            var denominator = event.lengthFrames - 1;
            // Endpoints are exactly zero. Avoid source I/O for a zero-only overlap.
            first = Math.max(first, event.startFrame + 1);
            last = Math.min(last, event.startFrame + denominator);
            if (last <= first) continue;

            var framesPerMs = source.frames / source.durationMs;
            var sourceStart = event.positionStartMs * framesPerMs;
            var sourceSpan = event.positionDeltaMs * framesPerMs;
            var lastSourceFrame = source.frames - 1;
            var sourceEnd = sourceStart + sourceSpan;
            var tolerance = 1e-6;
            if (!finite(framesPerMs) || !finite(sourceStart) || !finite(sourceEnd) ||
                    sourceStart < -tolerance || sourceStart > lastSourceFrame + tolerance ||
                    sourceEnd < -tolerance || sourceEnd > lastSourceFrame + tolerance) {
                throw new Error("An event reads outside its source buffer.");
            }
            var firstPosition = clamp(sourceStart + ((first - event.startFrame) / denominator) * sourceSpan, 0, lastSourceFrame);
            var lastPosition = clamp(sourceStart + ((last - 1 - event.startFrame) / denominator) * sourceSpan, 0, lastSourceFrame);
            var readFirst = Math.floor(Math.min(firstPosition, lastPosition));
            var readLast = Math.min(lastSourceFrame, Math.floor(Math.max(firstPosition, lastPosition)) + 1);
            var readCount = readLast - readFirst + 1;
            var sourceLeft = readChecked(readSource, event.slot, 1, readFirst, readCount);
            var sourceRight = event.mono ? sourceLeft : readChecked(readSource, event.slot, 2, readFirst, readCount);
            var gain = event.amplitude * 0.8 * (event.mono ? Math.SQRT1_2 : 1) * plan.normalization;

            for (n = first; n < last; n++) {
                // Use the absolute frame, not a running phase accumulator. Chunk
                // boundaries therefore cannot change the generated sample values.
                var phase = (n - event.startFrame) / denominator;
                var envelope = phase < 0.01 ? phase * 100 : (phase > 0.99 ? (1 - phase) * 100 : 1);
                var position = clamp(sourceStart + phase * sourceSpan, 0, lastSourceFrame);
                var index = Math.floor(position);
                var fraction = position - index;
                var a = index - readFirst;
                var b = Math.min(index + 1, lastSourceFrame) - readFirst;
                var scale = envelope * gain;
                j = n - start;
                left[j] += (sourceLeft[a] + fraction * (sourceLeft[b] - sourceLeft[a])) * scale;
                right[j] += (sourceRight[a] + fraction * (sourceRight[b] - sourceRight[a])) * scale;
            }
        }
        for (i = 0; i < size; i++) {
            left[i] = clamp(left[i], -0.99, 0.99);
            right[i] = clamp(right[i], -0.99, 0.99);
            peak = Math.max(peak, Math.abs(left[i]), Math.abs(right[i]));
        }
        return {left: left, right: right, peak: peak};
    }
    return {renderChunk: renderChunk};
}());
if (typeof module !== "undefined" && module.exports) module.exports = APGRender;


/* APG Wave: Max 8/9 legacy-js controller. APGPlan and APGRender are embedded
 * above this file in apg_wave.js. Original musical algorithm: Joo Won Park.
 */
autowatch = 0;
inlets = 1;
outlets = 4; // groove~, speed sig~, run gate, sample counter
var host = this;
var prefix = "apgw_" + new Date().getTime() + "_" + Math.floor(Math.random() * 1000000000);
var outputName = prefix + "_output";
var sources = [null, null, null], sourceBuffers = [null, null, null];
var paths = ["", "", ""], loading = [false, false, false], loadTasks = [null, null, null];
var repetitions = [3, 4, 5], pitchRange = 0.5, monitorDb = -12;
var audioOn = false, sampleRate = 0, state = "idle", initialized = false;
var plan = null, output = null, outputReady = false, dirty = true;
// Keep the original plan's coordinates intact; the output can be a shorter,
// symmetrically cropped interval of that plan.
var outputFrames = 0, outputDurationMs = 0, trimFrames = 0;
var scanFrame = 0, scanLimit = 0;
var silenceThreshold = 0.00001, trimPaddingMs = 25, minimumSilenceMs = 250;
var renderFrame = 0, renderHalf = 0, renderStarted = 0, renderPeak = 0;
var firstAudioFrame = -1, renderTask = null, lastWaveRefresh = 0;
var audioTask = null, demoTask = null, finishTask = null, selectionTask = null;
var startAction = "play", autoPlay = false, audioAttempts = 0, playToken = 0;
var loopEnabled = false, selectedStart = 0, selectedEnd = 0;
var activeStart = 0, activeEnd = 0, pendingSelection = [0, 0], updatingWave = false;
var savePending = false, saveTask = null, savePath = "";

function named(name) { return host.patcher.getnamed(name); }
function ui(name, value) { var o = named(name); if (o) o.message("set", value); }
function status(value) { ui("status", value); }
function finite(value) { return typeof value === "number" && isFinite(value); }
function clamp(value, low, high) { return Math.max(low, Math.min(high, value)); }
function slotOK(slot) { return finite(slot) && Math.floor(slot) === slot && slot >= 0 && slot < 3; }
function fileName(path) { return String(path).split(/[\\/:]/).pop(); }
function shortName(path) { var s = fileName(path); return s.length > 25 ? s.substring(0, 15) + "..." + s.substring(s.length - 7) : s; }
function localfile(name) {
    var path = String(host.patcher.filepath || ""), slash = path.lastIndexOf("/");
    return slash < 0 ? name : path.substring(0, slash + 1) + name;
}
function mutable() { return state === "idle" || state === "ready"; }
function cancelTask(task) { if (task) task.cancel(); }
function lockUI(flag) {
    var names = ["load1", "load2", "load3", "repeat1", "repeat2", "repeat3", "pitch", "demo_button", "new_button"];
    var i;
    for (i = 0; i < names.length; i++) { var o = named(names[i]); if (o) o.message("ignoreclick", flag ? 1 : 0); }
    var busy = state === "rendering" || state === "waiting" || state === "stopping";
    var optional = ["play_button", "loop_toggle", "clear_button", "save_button"];
    for (i = 0; i < optional.length; i++) {
        var item = named(optional[i]);
        if (item) item.message("ignoreclick", (busy || (optional[i] === "save_button" && !outputReady)) ? 1 : 0);
    }
    named("wave_l").message("setmode", outputReady && !busy ? 1 : 0);
    named("wave_r").message("setmode", outputReady && !busy ? 1 : 0);
}
function waveformLine(ms) { named("wave_l").message("line", ms); named("wave_r").message("line", ms); }
function refreshWave(resetRange) {
    updatingWave = true;
    named("wave_l").message("set", outputName, 1);
    named("wave_r").message("set", outputName, 2);
    if (plan) named("wave_link").message("list", 0, outputDurationMs,
        resetRange ? 0 : selectedStart, resetRange ? outputDurationMs : selectedEnd);
    updatingWave = false;
}
function loadbang() {
    if (initialized) return;
    initialized = true;
    var i;
    outlet(1, 0); outlet(2, 0); outlet(3, "stop");
    for (i = 0; i < 3; i++) named("source" + (i + 1)).message("name", prefix + "_source" + i);
    named("output_buffer").message("name", outputName);
    output = new Buffer(outputName);
    outlet(0, "set", outputName);
    named("wave_l").message("set", outputName, 1); named("wave_r").message("set", outputName, 2);
    named("wave_l").message("buftime", 150); named("wave_r").message("buftime", 150);
    named("wave_l").message("mouseoutput", "up"); named("wave_r").message("mouseoutput", "up");
    waveformLine(-1);
    ui("repeat1", 3); ui("repeat2", 4); ui("repeat3", 5); ui("pitch", 0.5);
    ui("loop_toggle", 0); ui("monitor_level", monitorDb); ui("progress", 0); ui("time", "0.0 s");
    named("monitor_gain").message("float", Math.pow(10, monitorDb / 20));
    ui("render_info", "Automatic edge trimming is on. Press PLAY to generate.");
    ui("selection_info", "Drag across the output to choose a loop.");
    status("Loading demo sounds...");
    lockUI(false);
    named("dsp_info").message("bang");
    demoTask = new Task(function () { demos(); }, host); demoTask.schedule(50);
    post("APG Wave: ready to load sources.\n");
}
function markDirty() {
    dirty = true;
    status(outputReady ? "Settings changed. PLAY will generate a new result." : "Ready. PLAY generates the waveform, then plays it.");
}
function loadfile(slot) {
    slot = Number(slot);
    var args = arrayfromargs(arguments), path = args.slice(1).join(" ");
    if (!slotOK(slot) || !path || !mutable()) return;
    if (loading[slot]) { status("This source is still loading."); return; }
    if (!/\.(wav|wave|aif|aiff)$/i.test(path)) { status("Choose a mono or stereo WAV/AIFF."); return; }
    loading[slot] = true; sources[slot] = null; sourceBuffers[slot] = null; paths[slot] = path; dirty = true;
    ui("file" + (slot + 1), "Loading..."); status("Loading source audio...");
    (function (s) {
        loadTasks[s] = new Task(function () {
            if (loading[s]) { loading[s] = false; ui("file" + (s + 1), "Load did not finish"); status("Check the source file and Max Console."); }
        }, host); loadTasks[s].schedule(30000);
    }(slot));
    named("source" + (slot + 1)).message("read", path, 0, -1, 0);
}
function loaded(slot) {
    slot = Number(slot); if (!slotOK(slot)) return;
    cancelTask(loadTasks[slot]); loadTasks[slot] = null; loading[slot] = false;
    try {
        var name = prefix + "_source" + slot, b = new Buffer(name);
        var frames = b.framecount(), duration = b.length(), channels = b.channelcount();
        if (frames < 2 || !finite(duration) || duration <= 0 || (channels !== 1 && channels !== 2)) throw new Error("Use mono or stereo audio.");
        sourceBuffers[slot] = b;
        sources[slot] = {name: name, frames: frames, durationMs: duration, channels: channels};
        ui("file" + (slot + 1), shortName(paths[slot]) + "\n" + (duration / 1000).toFixed(2) + " s / " + (channels === 1 ? "mono" : "stereo"));
        if (sources[0] && sources[1] && sources[2] && !loading[0] && !loading[1] && !loading[2]) {
            ui("duration", "Before trim: " + (2 * Math.max(sources[0].durationMs, sources[1].durationMs, sources[2].durationMs) / 1000).toFixed(1) + " s");
            markDirty();
        }
    } catch (e) { sources[slot] = null; status(e.message); }
}
function demos() {
    if (!mutable()) return;
    loadfile(0, localfile("apgw_test1.wav")); loadfile(1, localfile("apgw_test2.wav")); loadfile(2, localfile("apgw_test3.wav"));
}
function repeats(slot, value) {
    slot = Number(slot); value = Number(value); if (!slotOK(slot)) return;
    if (mutable() && finite(value)) { repetitions[slot] = clamp(Math.round(value), 1, 20); markDirty(); }
    ui("repeat" + (slot + 1), repetitions[slot]);
}
function pitch(value) {
    value = Number(value); if (mutable() && finite(value)) { pitchRange = clamp(value, 0, 1); markDirty(); }
    ui("pitch", pitchRange);
}
function monitor(value) {
    value = Number(value); if (!finite(value)) return;
    monitorDb = clamp(value, -60, 0); ui("monitor_level", monitorDb);
    named("monitor_gain").message("list", Math.pow(10, monitorDb / 20), 20);
}
function dspstate(value) {
    audioOn = Number(value) !== 0;
    if (!audioOn && state === "playing") finishPlayback("Audio stopped. The generated result is still available.");
}
function samplerate(value) {
    value = Number(value); if (!finite(value) || value <= 0) return;
    if (state === "playing" && sampleRate > 0 && value !== sampleRate) finishPlayback("Audio settings changed. Press PLAY again.");
    sampleRate = value;
}
function play() {
    if (state === "playing") return;
    if (!mutable()) return;
    requestAudio(dirty || !outputReady ? "renderplay" : "play");
}
function newpiece() {
    if (!mutable()) return;
    requestAudio("render");
}
function requestAudio(action) {
    if (savePending && action !== "play") { status("Wait for the WAV save to finish before generating again."); return; }
    if (loading[0] || loading[1] || loading[2]) { status("Please wait for the sources to finish loading."); return; }
    if (!sources[0] || !sources[1] || !sources[2]) { status("Load three samples or choose DEMO."); return; }
    state = "waiting"; startAction = action; audioAttempts = 0; lockUI(true);
    status("Starting audio..."); named("audio_driver").message("startwindow");
    audioTask = new Task(waitForAudio, host); audioTask.schedule(50);
}
function waitForAudio() {
    if (state !== "waiting") return;
    named("dsp_info").message("bang");
    if (audioOn && sampleRate > 0) {
        if (startAction === "play") beginPlayback(); else beginRender(startAction === "renderplay");
        return;
    }
    audioAttempts++;
    if (audioAttempts >= 100) { state = outputReady ? "ready" : "idle"; lockUI(false); status("Audio did not start. Check Max Audio Status."); return; }
    audioTask.schedule(100);
}
function beginRender(thenPlay) {
    try { plan = APGPlan.makePlan(sources, repetitions, pitchRange, sampleRate); }
    catch (e) { state = outputReady ? "ready" : "idle"; lockUI(false); status(e.message); return; }
    state = "rendering"; autoPlay = thenPlay; outputReady = false; dirty = true;
    outputFrames = plan.totalFrames; outputDurationMs = plan.durationMs; trimFrames = 0;
    renderFrame = 0; renderHalf = Math.ceil(outputFrames / 2); renderPeak = 0; firstAudioFrame = -1;
    scanLimit = renderHalf; scanFrame = scanLimit;
    var i;
    // Frames before every scheduled event are known to be zero. Starting at
    // the earliest event avoids calculating a potentially very long empty gap.
    for (i = 0; i < plan.events.length; i++) scanFrame = Math.min(scanFrame, plan.events[i].startFrame);
    renderStarted = new Date().getTime(); lastWaveRefresh = 0; selectedStart = 0; selectedEnd = outputDurationMs;
    outlet(1, 0); outlet(2, 0); outlet(0, "stop"); outlet(3, "stop");
    lockUI(true); named("stop_button").message("text", "CANCEL"); ui("progress", 0);
    ui("render_info", "Finding the start of the sound..."); status("Checking the quiet beginning and ending..."); waveformLine(-1);
    renderTask = new Task(scanOpening, host); renderTask.schedule(1);
}
function scanOpening() {
    if (state !== "rendering") return;
    var tickStart = new Date().getTime(), chunkSize = plan.events.length > 60 ? 512 : 2048;
    try {
        while (scanFrame < scanLimit) {
            var count = Math.min(chunkSize, scanLimit - scanFrame);
            var chunk = APGRender.renderChunk(plan, sources, scanFrame, count, readSource);
            if (chunk.peak > silenceThreshold) {
                var i;
                for (i = 0; i < count; i++) {
                    if (Math.max(Math.abs(chunk.left[i]), Math.abs(chunk.right[i])) > silenceThreshold) {
                        firstAudioFrame = scanFrame + i;
                        prepareOutput(); return;
                    }
                }
            }
            scanFrame += count;
            if (new Date().getTime() - tickStart >= 10) break;
        }
        ui("render_info", "Checking opening  /  " + (scanFrame / plan.sampleRate).toFixed(1) + " s examined");
        if (scanFrame >= scanLimit) prepareOutput(); else renderTask.schedule(1);
    } catch (e) { renderFailed(e.message); }
}
function prepareOutput() {
    if (state !== "rendering") return;
    if (firstAudioFrame >= Math.ceil(minimumSilenceMs * plan.sampleRate / 1000)) {
        var padding = Math.max(1, Math.round(trimPaddingMs * plan.sampleRate / 1000));
        trimFrames = Math.max(0, firstAudioFrame - padding);
        trimFrames = Math.min(trimFrames, Math.floor((plan.totalFrames - 2) / 2));
    }
    outputFrames = plan.totalFrames - 2 * trimFrames;
    outputDurationMs = outputFrames * 1000 / plan.sampleRate;
    if (firstAudioFrame >= 0) firstAudioFrame -= trimFrames;
    renderFrame = 0; renderHalf = Math.ceil(outputFrames / 2);
    selectedStart = 0; selectedEnd = outputDurationMs;
    ui("render_info", "Rendering 0%"); ui("progress", 0);
    status(trimFrames > 0 ? "Quiet edges trimmed. Rendering the shorter piece..." : "Rendering audio. CANCEL stops generation.");
    cancelTask(renderTask);
    renderTask = new Task(allocateOutput, host); renderTask.schedule(1);
}
function allocateOutput() {
    if (state !== "rendering") return;
    try {
        var b = named("output_buffer");
        b.message("sr", plan.sampleRate); b.message("sizeinsamps", outputFrames, 2); b.message("clear");
        output = new Buffer(outputName);
        if (output.framecount() !== outputFrames || output.channelcount() !== 2) throw new Error("Output buffer allocation did not complete.");
        refreshWave(true);
        renderTask = new Task(renderTick, host); renderTask.schedule(1);
    } catch (e) { renderFailed(e.message); }
}
function readSource(slot, channel, first, count) { return sourceBuffers[slot].peek(channel, first, count); }
function renderTick() {
    if (state !== "rendering") return;
    var tickStart = new Date().getTime(), chunkSize = plan.events.length > 60 ? 512 : 2048;
    try {
        do {
            var count = Math.min(chunkSize, renderHalf - renderFrame);
            var chunk = APGRender.renderChunk(plan, sources, trimFrames + renderFrame, count, readSource);
            output.poke(1, renderFrame, chunk.left); output.poke(2, renderFrame, chunk.right);
            // Reflect the already computed half: exact matching stored sample pairs,
            // half as much mixing, and no full-file JavaScript arrays.
            var mirrorStart = outputFrames - renderFrame - count;
            output.poke(1, mirrorStart, chunk.left.slice(0).reverse());
            output.poke(2, mirrorStart, chunk.right.slice(0).reverse());
            if (firstAudioFrame < 0 && chunk.peak > silenceThreshold) {
                var i;
                for (i = 0; i < count; i++) if (Math.max(Math.abs(chunk.left[i]), Math.abs(chunk.right[i])) > silenceThreshold) { firstAudioFrame = renderFrame + i; break; }
            }
            renderPeak = Math.max(renderPeak, chunk.peak); renderFrame += count;
        } while (renderFrame < renderHalf && new Date().getTime() - tickStart < 10);
        var now = new Date().getTime(), fraction = renderFrame / renderHalf;
        ui("progress", fraction);
        ui("render_info", "Rendering " + Math.floor(fraction * 100) + "%  /  " + ((now - renderStarted) / 1000).toFixed(1) + " s elapsed");
        status("Rendering audio. CANCEL stops generation.");
        if (now - lastWaveRefresh > 500) { refreshWave(true); lastWaveRefresh = now; }
        if (renderFrame >= renderHalf) renderComplete(); else renderTask.schedule(1);
    } catch (e) { renderFailed(e.message); }
}
function renderComplete() {
    state = "ready"; outputReady = true; dirty = false; cancelTask(renderTask); renderTask = null;
    refreshWave(true); waveformLine(0); selectedStart = 0; selectedEnd = outputDurationMs;
    pendingSelection = [selectedStart, selectedEnd];
    ui("progress", 1); ui("time", "0.0 / " + (outputDurationMs / 1000).toFixed(1) + " s");
    ui("duration", "Length: " + (outputDurationMs / 1000).toFixed(1) + " s");
    var trimSummary = trimFrames > 0 ? "  /  trimmed " + (trimFrames / plan.sampleRate).toFixed(2) + " s from each end" : (firstAudioFrame < 0 ? "  /  too quiet to trim" : "  /  no long edge silence");
    ui("render_info", "Ready" + trimSummary);
    named("stop_button").message("text", "STOP"); lockUI(false); selectionLabel();
    status(firstAudioFrame < 0 ? (renderPeak === 0 ? "The rendered output is silent. Check the source samples." : "Very quiet result. Edges kept; press PLAY to listen.") : "Ready. PLAY replays this result; NEW generates another.");
    if (autoPlay && firstAudioFrame >= 0) beginPlayback();
}
function renderFailed(message) {
    cancelTask(renderTask); renderTask = null; state = "idle"; outputReady = false; dirty = true;
    named("stop_button").message("text", "STOP"); lockUI(false);
    ui("render_info", "Render did not complete."); status(message); post("APG Wave render: " + message + "\n");
}
function beginPlayback() {
    if (!outputReady || !plan) return;
    if (!audioOn || sampleRate <= 0) {
        state = "ready"; lockUI(false);
        status("Audio stopped. Press PLAY to start audio and play this result."); return;
    }
    state = "playing"; playToken++; activeStart = selectedStart; activeEnd = selectedEnd;
    if (activeEnd - activeStart < 2 * 1000 / plan.sampleRate) { activeStart = 0; activeEnd = outputDurationMs; }
    var duration = activeEnd - activeStart;
    // Reset the old counter while completion is disabled, before assigning the
    // new run's token. A queued completion from an earlier run keeps its old token.
    outlet(2, 0); outlet(1, 0); named("loop_flag").message("float", 1);
    outlet(3, "stop");
    named("play_token").message("set", playToken);
    named("total_frames").message("int", Math.max(2, Math.round(duration * sampleRate / 1000)));
    named("edge_scale").message("float", duration / Math.min(5, duration / 4));
    outlet(0, "set", outputName);
    outlet(0, "setloop", activeStart, activeEnd); outlet(0, "loop", 1);
    outlet(0, "startloop"); outlet(3, "bang");
    named("loop_flag").message("float", loopEnabled ? 1 : 0);
    outlet(1, 1); outlet(2, 1, 5);
    lockUI(true); waveformLine(activeStart);
    status(loopEnabled ? "Looping selection..." : "Playing...");
}
function phase(value) {
    value = Number(value); if (state !== "playing" || !finite(value)) return;
    var ms = activeStart + clamp(value, 0, 1) * (activeEnd - activeStart);
    waveformLine(ms); ui("time", (ms / 1000).toFixed(1) + " / " + (outputDurationMs / 1000).toFixed(1) + " s");
    var firstMs = firstAudioFrame < 0 ? -1 : firstAudioFrame * 1000 / plan.sampleRate;
    if (firstMs >= 0 && ms < firstMs && firstMs < activeEnd) status("Playing: first sound in " + ((firstMs - ms) / 1000).toFixed(1) + " s.");
    else status(loopEnabled ? "Looping selection..." : "Playing...");
}
function ended(token) {
    if (state === "playing" && !loopEnabled && Number(token) === playToken) {
        waveformLine(activeEnd); ui("time", (activeEnd / 1000).toFixed(1) + " / " + (outputDurationMs / 1000).toFixed(1) + " s");
        finishPlayback("Done. Replay, select a loop, or generate NEW.");
    }
}
function finishPlayback(message) {
    cancelTask(finishTask); finishTask = null;
    outlet(2, 0); outlet(1, 0); outlet(0, "stop"); outlet(3, "stop");
    state = outputReady ? "ready" : "idle"; lockUI(false); status(message);
}
function stop() {
    cancelTask(audioTask); audioTask = null; cancelTask(selectionTask); selectionTask = null;
    cancelTask(finishTask); finishTask = null;
    if (state === "rendering") { renderFailed("Rendering cancelled. Press PLAY to try again."); return; }
    if (state === "waiting") { state = outputReady ? "ready" : "idle"; lockUI(false); status("Cancelled."); return; }
    if (state === "stopping") { finishPlayback("Stopped. The waveform is ready to replay."); return; }
    if (state === "playing") {
        state = "stopping"; outlet(2, 0, 8);
        finishTask = new Task(function () { finishPlayback("Stopped. The waveform is ready to replay."); }, host); finishTask.schedule(12);
    } else { status(outputReady ? "Ready. Select a range or press PLAY." : "Ready to generate."); }
}
function wavechange(viewStart, viewLength, a, b) {
    if (updatingWave || !outputReady || (state !== "ready" && state !== "playing")) return;
    a = Number(a); b = Number(b); if (!finite(a) || !finite(b)) return;
    pendingSelection = [a, b];
}
function wavemouse(x, y, event) {
    if (Number(event) !== 0 || updatingWave || !outputReady) return;
    cancelTask(selectionTask);
    selectionTask = new Task(commitSelection, host); selectionTask.schedule(1);
}
function commitSelection() {
    if (!outputReady || (state !== "ready" && state !== "playing")) return;
    var a = clamp(Math.min(pendingSelection[0], pendingSelection[1]), 0, outputDurationMs);
    var b = clamp(Math.max(pendingSelection[0], pendingSelection[1]), 0, outputDurationMs);
    // Snap to actual stored frames without destructive waveform edits.
    a = Math.round(a * plan.sampleRate / 1000) * 1000 / plan.sampleRate;
    b = Math.round(b * plan.sampleRate / 1000) * 1000 / plan.sampleRate;
    if (b - a < 2 * 1000 / plan.sampleRate) { a = 0; b = outputDurationMs; }
    selectedStart = a; selectedEnd = b; pendingSelection = [a, b];
    // Keep the drawn range identical to the committed range, including clicks
    // that expand back to full length and sub-sample endpoint rounding.
    updatingWave = true;
    named("wave_link").message("list", 0, outputDurationMs, a, b);
    updatingWave = false; selectionLabel();
    if (state === "playing") restartSelection();
    else status("Selection ready. PLAY once, or enable LOOP to repeat.");
}
function selectionLabel() {
    if (!plan) return;
    ui("selection_info", "Selection: " + (selectedStart / 1000).toFixed(2) + " - " + (selectedEnd / 1000).toFixed(2) + " s  (" + ((selectedEnd - selectedStart) / 1000).toFixed(2) + " s)");
}
function loopmode(value) {
    if (state === "rendering" || state === "waiting" || state === "stopping") { ui("loop_toggle", loopEnabled ? 1 : 0); return; }
    loopEnabled = Number(value) !== 0; ui("loop_toggle", loopEnabled ? 1 : 0);
    if (state === "playing") restartSelection();
}
function restartSelection() {
    state = "stopping"; outlet(2, 0, 5); cancelTask(finishTask); lockUI(true);
    finishTask = new Task(function () {
        finishTask = null;
        if (state !== "stopping") return;
        outlet(1, 0); outlet(0, "stop"); beginPlayback();
    }, host); finishTask.schedule(8);
}
function clearloop() {
    if (!outputReady || (state !== "ready" && state !== "playing")) return;
    selectedStart = 0; selectedEnd = outputDurationMs; pendingSelection = [selectedStart, selectedEnd];
    refreshWave(true); selectionLabel();
    if (state === "playing") restartSelection(); else status("Full output selected.");
}
function savepath() {
    if (!outputReady || savePending) return;
    var path = arrayfromargs(arguments).join(" "); if (!path) return;
    if (!/\.wav$/i.test(path)) path += ".wav";
    savePending = true; savePath = path;
    named("output_buffer").message("format", "int24"); named("output_buffer").message("filetype", "wave");
    status("Saving the complete output WAV...");
    named("output_buffer").message("writewave", path);
    saveTask = new Task(function () {
        if (savePending) { savePending = false; status("WAV save was requested. Check the destination and Max Console."); }
    }, host); saveTask.schedule(30000);
}
function saved() {
    if (!savePending) return;
    savePending = false; cancelTask(saveTask); saveTask = null;
    status("WAV write completed: " + shortName(savePath));
}
function shutdown() {
    cancelTask(audioTask); cancelTask(demoTask); cancelTask(renderTask); cancelTask(finishTask); cancelTask(selectionTask); cancelTask(saveTask);
    var i; for (i = 0; i < 3; i++) cancelTask(loadTasks[i]);
    outlet(2, 0); outlet(1, 0); outlet(0, "stop"); outlet(3, "stop"); state = "idle";
}
function notifydeleted() { shutdown(); }

