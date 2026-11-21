/* CMPE Variety Pack for Max.
 * Musical designs: Joo Won Park, https://joowonpark.net/cmpe/
 * This extension keeps the APG controller intact and supplies the four other
 * instruments. Native MSP performs live audio; JS schedules control events.
 */
(function (g) {
    "use strict";
    var base = {}, names = ["loadbang", "lockUI", "loadfile", "loaded", "markDirty", "requestAudio",
        "beginRender", "renderTick", "renderComplete", "newpiece", "stop", "shutdown",
        "dspstate", "samplerate", "notifydeleted"];
    var i;
    for (i = 0; i < names.length; i++) base[names[i]] = g[names[i]];
    var modeIndex = 0, modeNames = ["APG", "ISJS", "Many", "RMHS", "SIOE"];
    var grain = CMPEModel.defaultSettings("isjs"), many = CMPEModel.defaultSettings("many");
    var drone = CMPEModel.defaultSettings("rmhs"), cut = CMPEModel.defaultSettings("sioe");
    var liveToken = 0, taskSerial = 0, tasks = {}, grainTasks = [null, null, null];
    var grainDue = [0, 0, 0], grainVariation = [1, 1, 1];
    var liveStarted = 0, liveEnd = 0, nextLayer = 0, layerCount = 0, manyCursor = 0;
    var manyUse = [], droneVoices = [], cutRenderer = null;
    var recordArmed = false, recording = false, recordFile = "", recordMs = 0;
    var recordRequested = 0, recordLastChange = 0, recordCheck = null, updatingControls = false;
    // buffer~ completion bangs carry no request ID. Keep one native read per
    // slot, and defer a preset until existing reads have actually completed.
    // A JavaScript timeout does not cancel native disk I/O.
    var nativeBusy = [false, false, false], pendingPreset = null, presetTask = null;
    var descriptions = [
        "APG: make an audio palindrome from three samples.",
        "ISJS: move in the pad to change sample position and grain density.",
        "Many: turn sample 1 into overlapping ambient layers.",
        "RMHS: build a slowly evolving drone from sine-wave harmonics.",
        "SIOE: combine slices of sample 1 into a short or gradual supercut."
    ];

    function now() { return new Date().getTime(); }
    function liveMode() { return modeIndex > 0 && modeIndex < 4; }
    function objectMessage(name, args) {
        var o = named(name);
        if (o) o.message.apply(o, args);
    }
    function hidden(name, yes) { var o = named(name); if (o) o.hidden = yes ? 1 : 0; }
    function clickable(name, yes) { objectMessage(name, ["ignoreclick", yes ? 0 : 1]); }
    function textOf(name, value) { objectMessage(name, ["text", value]); }
    function lineList(points) {
        var list = [], previous = 0, j;
        for (j = 0; j < points.length; j++) {
            list.push(points[j].value, Math.max(0, points[j].timeMs - previous));
            previous = points[j].timeMs;
        }
        return list;
    }
    function voice(engine, index, commands) {
        var o = named(engine), j;
        if (!o) throw new Error("A required audio voice is missing: " + engine);
        o.message("target", index);
        for (j = 0; j < commands.length; j++) o.message.apply(o, commands[j]);
    }
    function later(fn, delayMs) {
        var token = liveToken, id = ++taskSerial;
        var task = new Task(function () {
            delete tasks[id];
            if (token === liveToken && state === "live") {
                try { fn(); } catch (e) { haltLive("Stopped: " + e.message); }
            }
        }, host);
        tasks[id] = task;
        task.schedule(Math.max(1, delayMs));
        return task;
    }
    function cancelLiveTask(task) {
        if (!task) return;
        task.cancel();
        for (var key in tasks) if (tasks.hasOwnProperty(key) && tasks[key] === task) delete tasks[key];
    }
    function cancelLiveTasks() {
        liveToken++;
        var key;
        for (key in tasks) if (tasks.hasOwnProperty(key)) cancelTask(tasks[key]);
        tasks = {}; grainTasks = [null, null, null];
    }
    function stopRecording() {
        cancelTask(recordCheck); recordCheck = null;
        if (recordArmed || recording) objectMessage("recorder", ["int", 0]);
        recordArmed = false; recording = false; recordMs = 0;
        textOf("record_button", "RECORD WAV");
    }
    function stopVoices() {
        objectMessage("live_gate", ["list", 0, 10]);
        voice("grain_engine", 0, [["panic"]]);
        voice("many_engine", 0, [["panic"]]);
        voice("drone_engine", 0, [["panic"]]);
    }
    function haltLive(message) {
        cancelLiveTasks(); stopVoices(); stopRecording();
        state = outputReady ? "ready" : "idle";
        ui("progress", 0);
        g.lockUI(false);
        if (message) status(message);
    }
    function haltForChange() {
        cancelPresetRestore();
        cancelTask(audioTask); cancelTask(renderTask); cancelTask(finishTask); cancelTask(selectionTask);
        audioTask = null; renderTask = null; finishTask = null; selectionTask = null;
        haltLive("");
        outlet(2, 0); outlet(1, 0); outlet(0, "stop"); outlet(3, "stop");
        state = "idle"; outputReady = false; dirty = true; cutRenderer = null;
        plan = null; waveformLine(-1);
    }
    function setParam(index, label, value, low, high) {
        hidden("param" + index, false); hidden("param_label" + index, false);
        ui("param_label" + index, label);
        objectMessage("param" + index, ["minimum", low]);
        objectMessage("param" + index, ["maximum", high]);
        ui("param" + index, value);
    }
    function menu(label, items, selected) {
        hidden("mode_menu", false); hidden("menu_label", false);
        ui("menu_label", label);
        objectMessage("mode_menu", ["clear"]);
        for (var k = 0; k < items.length; k++) objectMessage("mode_menu", ["append", items[k]]);
        objectMessage("mode_menu", ["set", selected]);
    }
    function showMode() {
        if (updatingControls) return;
        updatingControls = true;
        try {
        var j, apg = modeIndex === 0, rendered = apg || modeIndex === 4;
        var sourceCount = modeIndex === 3 ? 0 : ((modeIndex === 2 || modeIndex === 4) ? 1 : 3);
        for (j = 0; j < 5; j++) {
            objectMessage("mode" + j, ["bgcolor"].concat(j === modeIndex ? [0.04, 0.04, 0.04, 1] : [0.92, 0.92, 0.92, 1]));
            objectMessage("mode" + j, ["bgoncolor"].concat(j === modeIndex ? [0.24, 0.24, 0.24, 1] : [0.76, 0.76, 0.76, 1]));
            var foreground = j === modeIndex ? [1, 1, 1, 1] : [0.04, 0.04, 0.04, 1];
            objectMessage("mode" + j, ["textcolor"].concat(foreground));
            objectMessage("mode" + j, ["textoncolor"].concat(foreground));
            objectMessage("mode" + j, ["textovercolor"].concat(foreground));
        }
        ui("mode_info", descriptions[modeIndex]);
        for (j = 0; j < 6; j++) { hidden("param" + j, true); hidden("param_label" + j, true); }
        hidden("mode_menu", true); hidden("menu_label", true);
        for (j = 1; j <= 3; j++) {
            hidden("repeat" + j, !apg); hidden("repeat_label" + j, !apg);
            hidden("source_label" + j, j > sourceCount);
            hidden("load" + j, j > sourceCount); hidden("file" + j, j > sourceCount);
        }
        hidden("pitch", !apg); hidden("pitch_label", !apg);
        hidden("no_samples", modeIndex !== 3);
        hidden("wave_l", !rendered); hidden("wave_r", !rendered);
        hidden("scope_l", rendered || modeIndex === 1); hidden("scope_r", rendered || modeIndex === 1);
        hidden("scope_xy", modeIndex !== 1); hidden("xy_pad", modeIndex !== 1);
        hidden("channel_l", modeIndex === 1); hidden("channel_r", modeIndex === 1);
        hidden("loop_toggle", !rendered); hidden("loop_label", !rendered);
        hidden("clear_button", !rendered); hidden("save_button", !rendered);
        hidden("record_button", rendered);
        ui("output_label", rendered ? "OUTPUT" : (modeIndex === 1 ? "POSITION / DENSITY" : "LIVE OUTPUT"));
        textOf("play_button", rendered ? "PLAY" : "START");
        textOf("stop_button", "STOP");
        textOf("new_button", rendered ? "NEW" : (modeIndex === 3 ? "RANDOMIZE" : "RESET"));
        if (modeIndex === 1) {
            for (j = 0; j < 3; j++) {
                setParam(j, "Sample " + (j + 1) + " rate", grain.rates[j], 0.3, 1.7);
                setParam(j + 3, "Sample " + (j + 1) + " level", grain.levels[j], 0, 1);
            }
            objectMessage("xy_pad", ["set", grain.position, grain.densityY]);
        } else if (modeIndex === 2) {
            setParam(0, "Layer level", many.level, 0, 2);
            setParam(1, "Max delay (seconds)", many.delayMaxMs / 1000, 0.1, 0.5);
            setParam(2, "Max interval (seconds)", many.intervalMaxMs / 1000, 5, 20);
            menu("Pitch set", ["Major", "Minor", "Pentatonic", "Atonal", "Microtonal"], many.pitchSet);
        } else if (modeIndex === 3) {
            setParam(0, "Drone level", drone.level, 0, 1);
            setParam(1, "Fundamental (Hz)", drone.fundamentalHz, 20, 20000);
            setParam(2, "Interval (semitones)", drone.intervalSemitones, 0, 24);
            setParam(3, "Duration setting (s)", drone.durationSeconds, 1, 600);
            setParam(4, "Harmonics", drone.harmonics, 3, 20);
        } else if (modeIndex === 4) {
            setParam(0, "Slices", cut.count, 1, 100);
            setParam(1, "Tempo (BPM)", cut.tempo, 1, 1500);
            setParam(2, "Hit duration (s)", cut.hitSeconds, 0.1, 10);
            menu("Form", ["Short", "Long"], cut.form === "short" ? 0 : 1);
        }
        if (liveMode() && state !== "live") {
            ui("duration", modeIndex === 3 ? "Slow fade-in" : "Continuous");
            ui("time", "0.0 s");
            ui("selection_info", modeIndex === 1 ? "Left to right: sample position. Up: denser grains." : "Record a performance with RECORD WAV.");
        }
        g.lockUI(state !== "idle" && state !== "ready");
        } finally { updatingControls = false; }
    }
    function modeHint() {
        if (modeIndex === 0) return "Automatic edge trimming is on. Press PLAY to generate.";
        if (modeIndex === 1) return "START, then move inside the pad. Rates and levels remain live.";
        if (modeIndex === 2) return "Layers fade in over 2-4 seconds. Controls affect the next layer.";
        if (modeIndex === 3) return "Slow attack: 3-20 seconds. Progress shows the actual planned length.";
        return "Short: one supercut. Long: adds and removes slices every four beats.";
    }
    g.loadbang = function () {
        var already = initialized;
        base.loadbang();
        if (already) return;
        objectMessage("live_gate", ["float", 0]);
        objectMessage("recorder", ["samptype", "int24"]);
        objectMessage("recorder", ["beginramp", 10]); objectMessage("recorder", ["endramp", 10]);
        showMode(); ui("render_info", modeHint());
        post("CMPE Variety Pack: Joo Won Park / joowonpark.net/cmpe\n");
    };
    g.lockUI = function (flag) {
        base.lockUI(flag);
        var editable = mutable() || (state === "live" && (modeIndex === 1 || modeIndex === 2));
        var j, required = modeIndex === 3 ? 0 : ((modeIndex === 2 || modeIndex === 4) ? 1 : 3);
        for (j = 0; j < 6; j++) clickable("param" + j, editable && !(modeIndex === 4 && cut.form === "short" && j === 1));
        clickable("mode_menu", editable);
        clickable("xy_pad", modeIndex === 1 && (mutable() || state === "live"));
        for (j = 1; j <= 3; j++) clickable("load" + j, mutable() && j <= required);
        clickable("demo_button", mutable() && required > 0);
        clickable("new_button", mutable());
        clickable("record_button", liveMode() && state !== "waiting");
        clickable("load_preset", !savePending);
        clickable("save_preset", true);
    };
    g.mode = function (value) {
        value = Number(value);
        if (!finite(value) || value < 0 || value > 4 || Math.floor(value) !== value || value === modeIndex) return;
        if (savePending) { status("Wait for the WAV save to finish before changing instruments."); return; }
        haltForChange(); modeIndex = value;
        ui("progress", 0); ui("duration", "Length: --"); ui("time", "0.0 s");
        showMode(); ui("render_info", modeHint()); status("Ready. " + descriptions[modeIndex]);
    };
    function sourcesBusy() { return nativeBusy[0] || nativeBusy[1] || nativeBusy[2]; }
    function cancelPresetRestore() {
        pendingPreset = null; cancelTask(presetTask); presetTask = null;
    }
    function clearSource(slot) {
        cancelTask(loadTasks[slot]); loadTasks[slot] = null; loading[slot] = false;
        sources[slot] = null; sourceBuffers[slot] = null; paths[slot] = "";
        named("source" + (slot + 1)).message("clear");
        ui("file" + (slot + 1), "No sample loaded");
    }
    g.loadfile = function (slot) {
        var args = arrayfromargs(arguments), path = args.slice(1).join(" ");
        slot = Number(slot);
        if (!slotOK(slot) || !path || !mutable()) return;
        if (nativeBusy[slot]) { status("This source is still loading. Check Max Console if the load has stalled."); return; }
        if (loading[slot] || !/\.(wav|wave|aif|aiff)$/i.test(path)) { base.loadfile.apply(host, args); return; }
        nativeBusy[slot] = true;
        try { base.loadfile.apply(host, args); }
        catch (e) { nativeBusy[slot] = false; throw e; }
        if (nativeBusy[slot]) {
            cancelTask(loadTasks[slot]);
            loadTasks[slot] = new Task(function () {
                if (!nativeBusy[slot]) return;
                loading[slot] = false;
                ui("file" + (slot + 1), "Load has not finished");
                status("Source load has not finished. Check Max Console; reopen the patch if the file cannot be read.");
            }, host);
            loadTasks[slot].schedule(30000);
        }
    };
    g.loaded = function (slot) {
        slot = Number(slot);
        if (!slotOK(slot) || !nativeBusy[slot]) return;
        nativeBusy[slot] = false;
        base.loaded(slot);
        if (pendingPreset) {
            if (!sourcesBusy()) {
                var saved = pendingPreset;
                cancelPresetRestore();
                applyPreset(saved);
            } else status("Waiting for the current source load before restoring settings...");
            return;
        }
        if (modeIndex !== 0) {
            showMode();
            if (modeIndex === 4 && mutable()) ui("duration", "Length: --");
            var required = modeIndex === 3 ? 0 : (modeIndex === 1 ? 3 : 1), ready = true;
            for (var j = 0; j < required; j++) if (!sources[j] || nativeBusy[j]) ready = false;
            if (ready && mutable()) g.markDirty();
        }
    };
    g.markDirty = function () {
        if (modeIndex === 0) { base.markDirty(); return; }
        dirty = true;
        if (mutable()) status(modeIndex === 4 ? "Ready. PLAY renders the supercut, then plays it." : "Ready. Press START.");
    };
    g.param = function (index, value) {
        if (updatingControls) return;
        index = Number(index); value = Number(value);
        if (!finite(index) || Math.floor(index) !== index || index < 0 || index > 5 || !finite(value)) return;
        if (!(mutable() || (state === "live" && (modeIndex === 1 || modeIndex === 2)))) { showMode(); return; }
        if (modeIndex === 1) {
            if (index < 3) {
                grain.rates[index] = clamp(value, 0.3, 1.7);
                if (state === "live") voice("grain_engine", index + 1, [["rate", grain.rates[index]]]);
            } else {
                grain.levels[index - 3] = clamp(value, 0, 1);
                if (state === "live") voice("grain_engine", index - 2, [["amp", grain.levels[index - 3] * grainVariation[index - 3]]]);
            }
        } else if (modeIndex === 2) {
            if (index === 0) many.level = clamp(value, 0, 2);
            if (index === 1) many.delayMaxMs = clamp(value, 0.1, 0.5) * 1000;
            if (index === 2) many.intervalMaxMs = Math.round(clamp(value, 5, 20)) * 1000;
        } else if (modeIndex === 3) {
            if (index === 0) drone.level = clamp(value, 0, 1);
            if (index === 1) drone.fundamentalHz = clamp(value, 20, 20000);
            if (index === 2) drone.intervalSemitones = clamp(value, 0, 24);
            if (index === 3) drone.durationSeconds = clamp(value, 1, 600);
            if (index === 4) drone.harmonics = Math.round(clamp(value, 3, 20));
        } else if (modeIndex === 4) {
            if (index === 0) cut.count = Math.round(clamp(value, 1, 100));
            if (index === 1 && cut.form !== "short") cut.tempo = clamp(value, 1, 1500);
            if (index === 2) cut.hitSeconds = clamp(value, 0.1, 10);
            dirty = true;
        }
        showMode();
        if (mutable()) g.markDirty();
    };
    g.choice = function (value) {
        if (updatingControls) return;
        value = Math.round(Number(value));
        if (!finite(value) || !(mutable() || (state === "live" && modeIndex === 2))) return;
        if (modeIndex === 2) many.pitchSet = clamp(value, 0, 4);
        if (modeIndex === 4) { cut.form = value === 0 ? "short" : "long"; dirty = true; }
        showMode();
    };
    g.xy = function (x, y) {
        if (updatingControls) return;
        x = Number(x); y = Number(y);
        if (modeIndex !== 1 || !finite(x) || !finite(y)) return;
        if (!(mutable() || state === "live")) return;
        grain.position = clamp(x, 0, 1); grain.densityY = clamp(y, 0, 1);
        objectMessage("xy_pad", ["set", grain.position, grain.densityY]);
        if (state === "live") {
            for (var j = 0; j < 3; j++) {
                var period = 1000 / (j === 0 ? 0.5 + 39.5 * grain.densityY : 0.1 + 34.9 * grain.densityY);
                if (grainDue[j] - now() > period) {
                    cancelLiveTask(grainTasks[j]); scheduleGrain(j, period);
                }
            }
        }
    };
    g.newpiece = function () {
        if (!mutable()) return;
        if (!liveMode()) { base.newpiece(); return; }
        if (modeIndex === 1) grain = CMPEModel.defaultSettings("isjs");
        if (modeIndex === 2) many = CMPEModel.defaultSettings("many");
        if (modeIndex === 3) drone = CMPEModel.defaultSettings("rmhs");
        showMode(); ui("render_info", modeHint()); status("Settings ready. Press START.");
    };
    g.requestAudio = function (action) {
        if (pendingPreset) { status("Waiting for the current source load before restoring settings..."); return; }
        if (modeIndex === 0) { base.requestAudio(action); return; }
        if (savePending) { status("Wait for the WAV save to finish."); return; }
        var required = modeIndex === 3 ? 0 : (modeIndex === 1 ? 3 : 1), j;
        for (j = 0; j < required; j++) {
            if (loading[j]) { status("Please wait for the source to finish loading."); return; }
            if (!sources[j]) { status("Load " + (required === 1 ? "sample 1" : "three samples") + " or choose DEMO."); return; }
        }
        state = "waiting"; startAction = action; audioAttempts = 0;
        g.lockUI(true); status("Starting audio...");
        named("audio_driver").message("startwindow");
        audioTask = new Task(waitForAudio, host); audioTask.schedule(50);
    };
    g.beginRender = function (thenPlay) {
        if (modeIndex === 0) { base.beginRender(thenPlay); return; }
        if (liveMode()) { beginLive(); return; }
        try {
            plan = CMPEModel.sioePlan(sources, cut, sampleRate);
            cutRenderer = CMPEModel.createSioeRenderer(plan, sources, readSource);
            state = "rendering"; autoPlay = thenPlay; outputReady = false; dirty = true;
            outputFrames = plan.totalFrames; outputDurationMs = plan.durationMs; trimFrames = 0;
            renderFrame = 0; renderHalf = outputFrames; renderPeak = 0; firstAudioFrame = -1;
            renderStarted = now(); lastWaveRefresh = 0; selectedStart = 0; selectedEnd = outputDurationMs;
            outlet(1, 0); outlet(2, 0); outlet(0, "stop"); outlet(3, "stop");
            ui("duration", "Length: " + (outputDurationMs / 1000).toFixed(1) + " s");
            ui("progress", 0); ui("render_info", "Rendering SIOE 0%");
            status("Rendering the supercut. CANCEL stops generation.");
            g.lockUI(true); textOf("stop_button", "CANCEL"); waveformLine(-1);
            renderTask = new Task(allocateOutput, host); renderTask.schedule(1);
        } catch (e) { renderFailed(e.message); }
    };
    g.renderTick = function () {
        if (modeIndex !== 4) { base.renderTick(); return; }
        if (state !== "rendering") return;
        var started = now();
        try {
            do {
                var count = Math.min(plan.recommendedChunkFrames || 1024, outputFrames - renderFrame);
                var chunk = cutRenderer.renderChunk(renderFrame, count), j;
                output.poke(1, renderFrame, chunk.left); output.poke(2, renderFrame, chunk.right);
                if (firstAudioFrame < 0 && chunk.peak > silenceThreshold) {
                    for (j = 0; j < count; j++) if (Math.max(Math.abs(chunk.left[j]), Math.abs(chunk.right[j])) > silenceThreshold) { firstAudioFrame = renderFrame + j; break; }
                }
                renderPeak = Math.max(renderPeak, chunk.peak); renderFrame += count;
            } while (renderFrame < outputFrames && now() - started < 10);
            ui("progress", renderFrame / outputFrames);
            ui("render_info", "Rendering SIOE " + Math.floor(100 * renderFrame / outputFrames) + "%  /  " + ((now() - renderStarted) / 1000).toFixed(1) + " s elapsed");
            if (now() - lastWaveRefresh > 500) { refreshWave(true); lastWaveRefresh = now(); }
            if (renderFrame >= outputFrames) g.renderComplete(); else renderTask.schedule(1);
        } catch (e) { renderFailed(e.message); }
    };
    g.renderComplete = function () {
        if (modeIndex === 4 && renderPeak > 0.98) named("output_buffer").message("normalize", 0.98);
        base.renderComplete();
        if (modeIndex === 4) {
            ui("render_info", "SIOE ready  /  " + plan.events.length + " slices" + (renderPeak > 0.98 ? "  /  peak level adjusted" : ""));
            cutRenderer = null;
        }
    };
    function scheduleGrain(slot, delayMs) {
        grainDue[slot] = now() + delayMs;
        grainTasks[slot] = later(function () { fireGrain(slot); }, delayMs);
    }
    function fireGrain(slot) {
        var e = CMPEModel.isjsEvent(grain, slot);
        grainVariation[slot] = e.level > 0 ? e.amplitude / e.level : 1;
        voice("grain_engine", slot + 1, [
            ["set", sources[slot].name], ["rate", e.rate], ["amp", e.amplitude], ["pan", e.pan],
            ["env"].concat(lineList(e.envelope)),
            ["start", (e.position >= 1 ? 0 : e.position) * sources[slot].durationMs]
        ]);
        scheduleGrain(slot, e.periodMs);
    }
    function addLayer() {
        var e = CMPEModel.manyEvent(many), index = (manyCursor++ % 32) + 1;
        var reuse = manyUse[index] !== undefined, generation = (manyUse[index] || 0) + 1;
        manyUse[index] = generation;
        if (reuse) voice("many_engine", index, [["stop"]]);
        function launch() {
            var commands = [["set", sources[0].name], ["rate", e.rate], ["amp", e.level],
                ["sumgain", sources[0].channels === 1 ? 1 : Math.SQRT1_2], ["feed", e.feed]];
            for (var k = 0; k < e.stages.length; k++) {
                var s = e.stages[k];
                commands.push(["stage", k + 1, s.leftMs, s.leftK, s.rightMs, s.rightK]);
            }
            commands.push(["dryenv"].concat(lineList(e.dryEnvelope)));
            commands.push(["wetenv"].concat(lineList(e.wetEnvelope)));
            commands.push(["start", 0]);
            voice("many_engine", index, commands);
            later(function () {
                if (manyUse[index] === generation) voice("many_engine", index, [["stop"]]);
            }, 120000);
        }
        if (reuse) later(launch, 15); else launch();
        layerCount++; nextLayer = now() + e.nextMs;
        later(addLayer, e.nextMs);
    }
    function driftNext(index, v) {
        var delay = -Math.log(Math.max(1e-12, 1 - Math.random())) * 1000 / v.driftRateHz;
        later(function () {
            if (now() >= liveStarted + v.durationMs) return;
            voice("drone_engine", index, [["drift", Math.random() * v.driftMaxHz, v.driftLagMs]]);
            driftNext(index, v);
        }, delay);
    }
    function beginLive() {
        try {
            cancelLiveTasks();
            state = "live"; outputReady = false; dirty = true; liveStarted = now();
            liveEnd = 0; layerCount = 0; manyCursor = 0; manyUse = [];
            outlet(2, 0); outlet(1, 0); outlet(0, "stop"); outlet(3, "stop");
            objectMessage("live_gate", ["list", 1, 15]);
            ui("progress", 0); ui("time", "0.0 s");
            g.lockUI(true);
            if (modeIndex === 1) {
                grain.panWidths = [0.3 + 0.7 * Math.random(), 0.3 + 0.7 * Math.random(), 0.3 + 0.7 * Math.random()];
                for (var j = 0; j < 3; j++) fireGrain(j);
            } else if (modeIndex === 2) {
                addLayer();
            } else {
                var result = CMPEModel.rmhsPlan(drone, sampleRate);
                if (!result.voices.length) throw new Error("No audible partials at this frequency. Lower the fundamental.");
                droneVoices = result.voices; liveEnd = liveStarted + result.durationMs;
                for (var k = 0; k < result.voices.length; k++) {
                    var v = result.voices[k];
                    voice("drone_engine", k + 1, [["freq", v.frequencyHz], ["drift", 0, 0],
                        ["mod", v.modRateHz], ["modphase", (v.modPhase / (2 * Math.PI) + 0.75) % 1],
                        ["amp", v.amplitude], ["pan", v.pan],
                        ["env"].concat(lineList(v.envelope)), ["start"]]);
                    driftNext(k + 1, v);
                    (function (index, duration) { later(function () { voice("drone_engine", index, [["stop"]]); }, duration + 15); }(k + 1, v.durationMs));
                }
                ui("duration", "Length: " + (result.durationMs / 1000).toFixed(1) + " s");
                ui("selection_info", result.voices.length + " partials" + (result.skippedPartials ? "  /  " + result.skippedPartials + " above the audio range omitted" : ""));
            }
            if (recordArmed) startRecording();
            pulse();
        } catch (e) { haltLive(e.message); }
    }
    function pulse() {
        var elapsed = now() - liveStarted, suffix = recording ? "  /  REC " + (recordMs / 1000).toFixed(1) + " s" : (recordArmed ? "  /  record armed" : "");
        ui("time", (elapsed / 1000).toFixed(1) + " s" + suffix);
        if (modeIndex === 1) {
            ui("render_info", "Position " + Math.round(grain.position * 100) + "%  /  density " + (0.5 + 39.5 * grain.densityY).toFixed(1) + " Hz (sample 1)");
            status("Playing live. Move the pad; adjust rates and levels.");
        } else if (modeIndex === 2) {
            ui("render_info", layerCount + " layers started  /  next layer in " + Math.max(0, (nextLayer - now()) / 1000).toFixed(1) + " s");
            status(elapsed < 4000 ? "The ambient layers are fading in." : "Playing ambient layers. STOP fades and clears all tails.");
        } else {
            var length = liveEnd - liveStarted, remaining = Math.max(0, liveEnd - now());
            ui("progress", clamp(elapsed / length, 0, 1));
            ui("render_info", "Drone: " + (remaining / 1000).toFixed(1) + " s remaining");
            status(elapsed < 20000 ? "Slow fade-in. The partials enter over 3-20 seconds." : "The drone is evolving...");
            if (remaining <= 0) { haltLive("Drone finished. Press START for another performance."); ui("progress", 1); return; }
        }
        later(pulse, 150);
    }
    g.stop = function () {
        if (pendingPreset) {
            cancelPresetRestore();
            haltLive("Settings load cancelled. The current source read can finish.");
            return;
        }
        if (state === "live" || liveMode()) {
            cancelTask(audioTask); audioTask = null;
            haltLive("Stopped. Press START when ready.");
            return;
        }
        base.stop();
    };
    g.dspstate = function (value) {
        if (Number(value) === 0 && state === "live") haltLive("Audio stopped. Check Max Audio Status, then press START.");
        base.dspstate(value);
    };
    g.samplerate = function (value) {
        value = Number(value);
        if (state === "live" && finite(value) && sampleRate > 0 && value !== sampleRate) haltLive("Audio settings changed. Press START again.");
        base.samplerate(value);
    };
    function startRecording() {
        if (!recordArmed || state !== "live") return;
        objectMessage("recorder", ["int", 1]);
        recording = true; recordArmed = false; recordMs = 0;
        recordRequested = now(); recordLastChange = now();
        textOf("record_button", "STOP REC");
        recordCheck = new Task(function () {
            if (!recording) return;
            if (now() - recordLastChange > 3000) {
                stopRecording();
                status("Recording did not advance. Check the destination and Max Console.");
                return;
            }
            recordCheck.schedule(1000);
        }, host);
        recordCheck.schedule(3500);
    }
    g.recordtoggle = function () {
        if (!liveMode()) return;
        if (recording || recordArmed) { stopRecording(); status("Recording stopped."); return; }
        if (state === "waiting") return;
        objectMessage("record_dialog", ["bang"]);
    };
    g.recordpath = function () {
        if (!liveMode()) return;
        var path = arrayfromargs(arguments).join(" ");
        if (!path) return;
        if (!/\.wav$/i.test(path)) path += ".wav";
        stopRecording(); recordFile = path;
        objectMessage("recorder", ["samptype", "int24"]);
        objectMessage("recorder", ["open", path, "wave"]);
        recordArmed = true; textOf("record_button", "ARMED");
        if (state === "live") startRecording();
        else status("Recording armed. START begins a 24-bit stereo WAV.");
    };
    g.recordelapsed = function (milliseconds) {
        milliseconds = Number(milliseconds);
        if (recording && finite(milliseconds) && milliseconds > recordMs) {
            recordMs = milliseconds; recordLastChange = now();
        }
    };
    function snapshot() {
        return {format: "cmpe-variety-pack", version: 1, mode: modeIndex,
            samples: paths.slice(0), apg: {repetitions: repetitions.slice(0), pitchRange: pitchRange},
            isjs: grain, many: many, rmhs: drone, sioe: cut, monitorDb: monitorDb,
            loop: loopEnabled};
    }
    g.presetsave = function () { objectMessage("preset_save_dialog", ["bang"]); };
    g.presetload = function () { if (!savePending) objectMessage("preset_load_dialog", ["bang"]); };
    g.presetwrite = function () {
        var path = arrayfromargs(arguments).join(" "), f;
        if (!path) return;
        if (!/\.json$/i.test(path)) path += ".json";
        try {
            f = new File(path, "write");
            if (!f.isopen) throw new Error("Cannot write that settings file.");
            f.eof = 0; f.writestring(JSON.stringify(snapshot(), null, 2) + "\n"); f.close();
            status("Settings saved: " + shortName(path));
        } catch (e) { if (f && f.isopen) f.close(); status(e.message); }
    };
    function validNumbers(values, count) {
        if (!values || values.length !== count) return false;
        for (var k = 0; k < count; k++) if (!finite(values[k])) return false;
        return true;
    }
    function validatePreset(p) {
        if (!p || p.format !== "cmpe-variety-pack" || p.version !== 1 ||
                !finite(p.mode) || p.mode < 0 || p.mode > 4 || Math.floor(p.mode) !== p.mode ||
                !p.apg || !validNumbers(p.apg.repetitions, 3) || !finite(p.apg.pitchRange) ||
                !p.isjs || !validNumbers(p.isjs.rates, 3) || !validNumbers(p.isjs.levels, 3) ||
                !finite(p.isjs.position) || !finite(p.isjs.densityY) ||
                !p.many || !validNumbers([p.many.level, p.many.delayMaxMs, p.many.intervalMaxMs, p.many.pitchSet], 4) ||
                !p.rmhs || !validNumbers([p.rmhs.level, p.rmhs.fundamentalHz, p.rmhs.intervalSemitones, p.rmhs.durationSeconds, p.rmhs.harmonics], 5) ||
                !p.sioe || !validNumbers([p.sioe.count, p.sioe.tempo, p.sioe.hitSeconds], 3) ||
                (p.sioe.form !== "short" && p.sioe.form !== "long") || !finite(p.monitorDb) ||
                !p.samples || p.samples.length !== 3) throw new Error("Choose a valid CMPE settings JSON file.");
        for (var k = 0; k < 3; k++) if (typeof p.samples[k] !== "string" || p.samples[k].length > 4096) throw new Error("Invalid sample path in settings.");
    }
    function restorePreset(p) {
        validatePreset(p);
        haltForChange();
        cancelTask(demoTask); demoTask = null;
        if (sourcesBusy()) {
            pendingPreset = p; state = "restoring"; g.lockUI(true);
            status("Waiting for the current source load before restoring settings...");
            presetTask = new Task(function () {
                if (pendingPreset) status("A source load is still pending. Settings will restore when it finishes; STOP cancels.");
            }, host);
            presetTask.schedule(30000);
            return;
        }
        applyPreset(p);
    }
    function applyPreset(p) {
        haltForChange();
        var j;
        for (j = 0; j < 3; j++) clearSource(j);
        for (j = 0; j < 3; j++) repetitions[j] = Math.round(clamp(p.apg.repetitions[j], 1, 20));
        pitchRange = clamp(p.apg.pitchRange, 0, 1);
        grain = CMPEModel.defaultSettings("isjs");
        grain.position = clamp(p.isjs.position, 0, 1); grain.densityY = clamp(p.isjs.densityY, 0, 1);
        for (j = 0; j < 3; j++) { grain.rates[j] = clamp(p.isjs.rates[j], 0.3, 1.7); grain.levels[j] = clamp(p.isjs.levels[j], 0, 1); }
        many = CMPEModel.defaultSettings("many");
        many.level = clamp(p.many.level, 0, 2); many.delayMaxMs = clamp(p.many.delayMaxMs, 100, 500);
        many.intervalMaxMs = clamp(p.many.intervalMaxMs, 5000, 20000); many.pitchSet = Math.round(clamp(p.many.pitchSet, 0, 4));
        if (validNumbers(p.many.microtonalSet, 12)) many.microtonalSet = p.many.microtonalSet.map(function (v) { return clamp(v, -0.15, 0.15); });
        drone = {level: clamp(p.rmhs.level, 0, 1), fundamentalHz: clamp(p.rmhs.fundamentalHz, 20, 20000),
            intervalSemitones: clamp(p.rmhs.intervalSemitones, 0, 24), durationSeconds: clamp(p.rmhs.durationSeconds, 1, 600),
            harmonics: Math.round(clamp(p.rmhs.harmonics, 3, 20))};
        cut = {count: Math.round(clamp(p.sioe.count, 1, 100)), tempo: clamp(p.sioe.tempo, 1, 1500),
            hitSeconds: clamp(p.sioe.hitSeconds, 0.1, 10), form: p.sioe.form};
        modeIndex = p.mode; loopEnabled = !!p.loop; monitor(clamp(p.monitorDb, -60, 0));
        for (j = 0; j < 3; j++) ui("repeat" + (j + 1), repetitions[j]);
        ui("pitch", pitchRange); ui("loop_toggle", loopEnabled ? 1 : 0);
        showMode(); ui("render_info", modeHint());
        for (j = 0; j < 3; j++) if (p.samples[j]) loadfile(j, p.samples[j]);
        status(sourcesBusy() ? "Settings restored. Loading referenced samples..." : "Settings restored. Press PLAY or START.");
    }
    g.presetread = function () {
        var path = arrayfromargs(arguments).join(" "), f, body = "";
        if (!path || savePending) return;
        try {
            f = new File(path, "read");
            if (!f.isopen || f.eof > 1048576) throw new Error("Cannot read that CMPE settings file.");
            while (f.position < f.eof) body += f.readline(8192) + "\n";
            f.close(); restorePreset(JSON.parse(body));
        } catch (e) { if (f && f.isopen) f.close(); status("Settings not loaded: " + e.message); }
    };
    g.shutdown = function () {
        cancelPresetRestore();
        cancelLiveTasks(); stopVoices(); stopRecording(); cutRenderer = null;
        base.shutdown();
    };
    g.notifydeleted = function () { g.shutdown(); };
    // Read-only state for the developer harness; this does not expose audio data.
    g.CMPEState = function () {
        return {mode: modeIndex, state: state, settings: snapshot(), recording: recording,
            recordArmed: recordArmed, activeTasks: Object.keys(tasks).length, liveToken: liveToken,
            restoring: pendingPreset !== null, nativeBusy: nativeBusy.slice(0)};
    };
}(this));
