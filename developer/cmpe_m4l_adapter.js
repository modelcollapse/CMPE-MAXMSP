/* CMPE Max for Live host adapter. ES5 for Max's legacy js object.
 * Appended after the unchanged musical models and CMPE controller.
 * Live owns the audio engine. This module never opens or changes a driver.
 * The pattr-bound JSON stores settings and reproducible finite-render seeds,
 * not audio. Original sample files are still required when a Set is reopened.
 */
(function (g) {
    "use strict";
    var under = {}, methods = ["loadbang", "mode", "loadfile", "loaded", "lockUI", "markDirty",
        "play", "newpiece", "requestAudio", "beginRender", "renderComplete", "renderFailed",
        "repeats", "pitch", "param", "choice", "xy", "monitor", "loopmode", "clearloop",
        "commitSelection", "stop", "dspstate", "samplerate", "shutdown"];
    var j;
    for (j = 0; j < methods.length; j++) under[methods[j]] = g[methods[j]];
    var deviceMode = Number(jsarguments.length > 1 ? jsarguments[1] : 0);
    if (!finite(deviceMode) || Math.floor(deviceMode) !== deviceMode || deviceMode < 0 || deviceMode > 4) deviceMode = 0;
    var booted = false, enabled = true, applying = false, deleted = false;
    var pendingState = null, restoreTarget = null, restoreTask = null, waitingRestore = false, pendingUI = {};
    var latch = false, held = [], activeKey = "", manual = false;
    var prepared = null, rebuilding = false, renderSeed = 0, renderRateOverride = 0;
    var restoredSelection = null, format = "cmpe-max-for-live", algorithm = "cmpe-m4l-1";
    var modelAPG = APGPlan.makePlan, modelSIOE = CMPEModel.sioePlan;
    var originalUI = g.ui, originalStatus = g.status, renderingText = "";

    g.ui = function (name, value) {
        originalUI(name, value);
        if (name === "render_info" && state === "rendering") {
            renderingText = String(value);
            originalUI("status", (rebuilding ? "Restoring: " : "") + renderingText + "  |  CANCEL stops");
        }
    };
    g.status = function (value) {
        originalStatus(state === "rendering" && renderingText ?
            (rebuilding ? "Restoring: " : "") + renderingText + "  |  CANCEL stops" : value);
    };
    g.shortName = function (path) {
        var name = fileName(path);
        return name.length > 14 ? name.substring(0, 6) + "..." + name.substring(name.length - 5) : name;
    };

    function finiteMode() { return deviceMode === 0 || deviceMode === 4; }
    function requiredSources() { return deviceMode === 3 ? 0 : (deviceMode === 2 || deviceMode === 4 ? 1 : 3); }
    function copy(value) { return JSON.parse(JSON.stringify(value)); }
    function message(name, selector) {
        var object = named(name);
        if (object) object.message.apply(object, arrayfromargs(arguments).slice(1));
    }
    function changed() {
        if (!booted || applying || deleted) return;
        if (typeof g.notifyclients === "function") g.notifyclients();
    }
    function velocity(value) { message("m4l_velocity", "list", clamp(value, 0, 1), 5); }
    function clearNotes() { held = []; activeKey = ""; manual = false; }
    function readNumber(name) {
        var object = named(name), value;
        if (!object || typeof object.getvalueof !== "function") return null;
        value = object.getvalueof();
        if (value instanceof Array) value = value[0];
        if (value === undefined || value === null || value === "") return null;
        value = Number(value);
        return finite(value) ? value : null;
    }
    function parameterNames() {
        var list = ["monitor_level", "m4l_latch"], i;
        if (finiteMode()) list.push("loop_toggle");
        if (deviceMode === 0) list = list.concat(["repeat1", "repeat2", "repeat3", "pitch"]);
        else {
            var count = deviceMode === 1 ? 6 : (deviceMode === 3 ? 5 : 3);
            for (i = 0; i < count; i++) list.push("param" + i);
        }
        if (deviceMode === 1) list = list.concat(["m4l_position", "m4l_density"]);
        if (deviceMode === 2 || deviceMode === 4) list.push("mode_menu");
        return list;
    }
    function captureParameters() {
        var result = {}, names = parameterNames(), i, value;
        for (i = 0; i < names.length; i++) {
            value = readNumber(names[i]);
            if (value !== null) result[names[i]] = value;
        }
        for (var key in pendingUI) if (pendingUI.hasOwnProperty(key)) result[key] = pendingUI[key];
        return result;
    }
    function overlay(settings, values) {
        var i;
        function has(name) { return values.hasOwnProperty(name) && finite(values[name]); }
        if (has("monitor_level")) settings.monitorDb = clamp(values.monitor_level, -60, 0);
        if (has("loop_toggle")) settings.loop = values.loop_toggle !== 0;
        if (has("m4l_latch")) latch = values.m4l_latch !== 0;
        if (deviceMode === 0) {
            for (i = 0; i < 3; i++) if (has("repeat" + (i + 1))) settings.apg.repetitions[i] = Math.round(clamp(values["repeat" + (i + 1)], 1, 20));
            if (has("pitch")) settings.apg.pitchRange = clamp(values.pitch, 0, 1);
        } else if (deviceMode === 1) {
            for (i = 0; i < 3; i++) {
                if (has("param" + i)) settings.isjs.rates[i] = clamp(values["param" + i], 0.3, 1.7);
                if (has("param" + (i + 3))) settings.isjs.levels[i] = clamp(values["param" + (i + 3)], 0, 1);
            }
            if (has("m4l_position")) settings.isjs.position = clamp(values.m4l_position, 0, 1);
            if (has("m4l_density")) settings.isjs.densityY = clamp(values.m4l_density, 0, 1);
        } else if (deviceMode === 2) {
            if (has("param0")) settings.many.level = clamp(values.param0, 0, 2);
            if (has("param1")) settings.many.delayMaxMs = clamp(values.param1, 0.1, 0.5) * 1000;
            if (has("param2")) settings.many.intervalMaxMs = Math.round(clamp(values.param2, 5, 20)) * 1000;
            if (has("mode_menu")) settings.many.pitchSet = Math.round(clamp(values.mode_menu, 0, 4));
        } else if (deviceMode === 3) {
            if (has("param0")) settings.rmhs.level = clamp(values.param0, 0, 1);
            if (has("param1")) settings.rmhs.fundamentalHz = clamp(values.param1, 20, 20000);
            if (has("param2")) settings.rmhs.intervalSemitones = clamp(values.param2, 0, 24);
            if (has("param3")) settings.rmhs.durationSeconds = clamp(values.param3, 1, 600);
            if (has("param4")) settings.rmhs.harmonics = Math.round(clamp(values.param4, 3, 20));
        } else {
            if (has("param0")) settings.sioe.count = Math.round(clamp(values.param0, 1, 100));
            if (has("param1")) settings.sioe.tempo = clamp(values.param1, 1, 1500);
            if (has("param2")) settings.sioe.hitSeconds = clamp(values.param2, 0.1, 10);
            if (has("mode_menu")) settings.sioe.form = values.mode_menu === 0 ? "short" : "long";
        }
        settings.mode = deviceMode;
        return settings;
    }
    function encodePath(path) {
        for (var i = 1; i <= 3; i++) if (path === localfile("apgw_test" + i + ".wav")) return "cmpe-demo:" + i;
        return path;
    }
    function decodePath(path) {
        var match = /^cmpe-demo:([123])$/.exec(path);
        return match ? localfile("apgw_test" + match[1] + ".wav") : path;
    }
    function defaultSnapshot() {
        var result = g.CMPEHost.snapshot();
        result.mode = deviceMode;
        if (!booted) for (var i = 0; i < requiredSources(); i++) result.samples[i] = localfile("apgw_test" + (i + 1) + ".wav");
        return result;
    }
    function fingerprints() {
        var result = [], i;
        for (i = 0; i < requiredSources(); i++) {
            if (!sources[i]) return null;
            result.push({frames: sources[i].frames, channels: sources[i].channels, durationMs: sources[i].durationMs});
        }
        return result;
    }
    function signature(settings) {
        // The output is independent of monitor volume, MIDI latch and loop.
        var samples = settings.samples.map(encodePath);
        return JSON.stringify({samples: samples, settings: deviceMode === 0 ? settings.apg : settings.sioe});
    }
    function randomSeed() { return (Math.floor(Math.random() * 4294967295) + 1) >>> 0; }
    function seeded(seed) {
        var value = seed >>> 0;
        return function () { value ^= value << 13; value ^= value >>> 17; value ^= value << 5; return (value >>> 0) / 4294967296; };
    }
    APGPlan.makePlan = function (src, reps, pitch, rate, rng) {
        return modelAPG(src, reps, pitch, renderRateOverride || rate, rng || seeded(renderSeed || 1));
    };
    CMPEModel.sioePlan = function (src, settings, rate, rng) {
        return modelSIOE(src, settings, renderRateOverride || rate, rng || seeded(renderSeed || 1));
    };
    function refreshLabels() {
        if (finiteMode()) message("new_button", "text", "GENERATE");
        if (deviceMode === 2 || deviceMode === 3) ui("selection_info", "Record this instrument on a Live track.");
        if (deviceMode === 1) {
            var settings = g.CMPEHost.snapshot().isjs;
            ui("m4l_position", settings.position); ui("m4l_density", settings.densityY);
        }
        ui("m4l_latch", latch ? 1 : 0);
    }
    function invalidate() {
        if (applying) return;
        prepared = null; rebuilding = false; restoredSelection = null;
    }
    function validateState(value) {
        if (!value || value.format !== format || value.version !== 1 || value.mode !== deviceMode ||
                !value.settings || value.settings.mode !== deviceMode) throw new Error("Saved state belongs to a different CMPE device.");
        g.CMPEHost.validate(value.settings);
        if (value.prepared) {
            var p = value.prepared;
            if (p.algorithm !== algorithm || !finite(p.seed) || Math.floor(p.seed) !== p.seed || p.seed < 1 || p.seed > 4294967295 ||
                    !finite(p.sampleRate) || p.sampleRate <= 0 || !p.sources || p.sources.length !== requiredSources() ||
                    typeof p.signature !== "string" || p.signature.length > 16384) throw new Error("Invalid saved render metadata.");
            for (var i = 0; i < p.sources.length; i++) {
                var source = p.sources[i];
                if (!source || !finite(source.frames) || source.frames < 1 || Math.floor(source.frames) !== source.frames ||
                        (source.channels !== 1 && source.channels !== 2) || !finite(source.durationMs) || source.durationMs <= 0) throw new Error("Invalid saved sample metadata.");
            }
        }
        if (value.selection && (value.selection.length !== 2 || !finite(value.selection[0]) || !finite(value.selection[1]))) throw new Error("Invalid saved loop selection.");
    }
    g.getvalueof = function () {
        if (pendingState) return JSON.stringify(pendingState);
        // Native buffer reads cannot be canceled. The CMPE controller may be
        // waiting for an old read before applying this new state; save the
        // requested state throughout that wait, not the previous instrument.
        if (restoreTarget && g.CMPEState().restoring) return JSON.stringify(restoreTarget);
        var settings = defaultSnapshot(), includePrepared = prepared && ((outputReady && !dirty) || rebuilding || waitingRestore);
        settings.samples = settings.samples.map(encodePath);
        return JSON.stringify({format: format, version: 1, mode: deviceMode, settings: settings,
            latch: latch, selection: restoredSelection || [selectedStart, selectedEnd], prepared: includePrepared ? copy(prepared) : null});
    };
    g.setvalueof = function () {
        var values = arrayfromargs(arguments), text = values.length === 1 ? String(values[0]) : values.join(" "), value;
        if (!text || text === "0") return;
        try {
            if (text.length > 131072) throw new Error("Saved state is too large.");
            value = JSON.parse(text); validateState(value);
            pendingState = value;
            if (booted) scheduleRestore();
        } catch (e) { status("State not restored: " + e.message); }
    };
    function scheduleRestore() {
        cancelTask(restoreTask);
        restoreTask = new Task(function () {
            restoreTask = null;
            if (!deleted && pendingState) applyState(pendingState, pendingUI);
        }, host);
        restoreTask.schedule(1);
    }
    function applyState(saved, values) {
        var settings = copy(saved ? saved.settings : defaultSnapshot());
        var originalSignature;
        applying = true;
        try {
            clearNotes(); velocity(1);
            latch = saved ? !!saved.latch : false;
            settings.samples = settings.samples.map(decodePath);
            for (var i = requiredSources(); i < 3; i++) settings.samples[i] = "";
            originalSignature = signature(settings);
            overlay(settings, values || {});
            prepared = saved && saved.prepared ? copy(saved.prepared) : null;
            if (prepared && (signature(settings) !== originalSignature || prepared.signature !== signature(settings))) prepared = null;
            restoredSelection = saved && saved.selection ? saved.selection.slice(0) : null;
            waitingRestore = true; rebuilding = false;
            restoreTarget = {format: format, version: 1, mode: deviceMode, settings: copy(settings),
                latch: latch, selection: restoredSelection, prepared: prepared ? copy(prepared) : null};
            restoreTarget.settings.samples = restoreTarget.settings.samples.map(encodePath);
            g.CMPEHost.restore(settings);
            pendingState = null; pendingUI = {};
            refreshLabels();
            ui("render_info", finiteMode() ? (prepared ? "Restoring saved composition..." : "GENERATE prepares audio. PLAY or MIDI starts it.") : "Ready for MIDI or START.");
        } catch (e) {
            waitingRestore = false; pendingState = null; restoreTarget = null; pendingUI = {}; prepared = null;
            status("State not restored: " + e.message);
        } finally { applying = false; }
        finishRestore();
        changed();
    }
    function finishRestore() {
        if (!booted || applying || !waitingRestore || pendingState || deleted) return;
        var snapshot = g.CMPEState(), i;
        if (snapshot.restoring) return;
        restoreTarget = null;
        for (i = 0; i < requiredSources(); i++) if (snapshot.nativeBusy[i] || loading[i]) return;
        for (i = 0; i < requiredSources(); i++) if (!sources[i]) {
            waitingRestore = false; prepared = null;
            status("A source is missing. Load the original sample, then GENERATE again.");
            changed(); return;
        }
        if (prepared && JSON.stringify(fingerprints()) !== JSON.stringify(prepared.sources)) {
            prepared = null; waitingRestore = false;
            status("A source changed. Press GENERATE to prepare a new result."); changed(); return;
        }
        if (prepared && !enabled) {
            status("Saved composition will rebuild when this device is enabled."); return;
        }
        waitingRestore = false;
        if (prepared && finiteMode()) {
            rebuilding = true; renderSeed = prepared.seed; renderRateOverride = prepared.sampleRate;
            under.beginRender(false);
            renderRateOverride = 0;
            if (state === "rendering") status("Rebuilding the saved composition. MIDI is available when Ready.");
            else { rebuilding = false; prepared = null; }
        } else {
            status(finiteMode() ? "Samples ready. Press GENERATE, then PLAY or a MIDI note." : "Ready. Press START or hold a MIDI note.");
        }
        changed();
    }
    // Only live.thisdevice starts the controller, after Live restores parameters.
    g.loadbang = function () {};
    g.hostready = function () {
        if (deleted) return;
        if (booted) { if (pendingState) scheduleRestore(); return; }
        var values = captureParameters(), saved = pendingState;
        if (!saved) saved = {settings: defaultSnapshot(), latch: false, prepared: null, selection: null};
        applying = true;
        under.loadbang(); cancelTask(demoTask); demoTask = null;
        under.mode(deviceMode);
        booted = true; applying = false;
        applyState(saved, values);
    };
    g.mode = function () { refreshLabels(); };
    g.lockUI = function (flag) {
        under.lockUI(flag); refreshLabels();
        // Generation settings may change between triggers while audio is playing.
        if (state === "playing" || (state === "live" && deviceMode === 3)) {
            var names = parameterNames();
            for (var i = 0; i < names.length; i++) message(names[i], "ignoreclick", 0);
        }
    };
    g.markDirty = function () {
        under.markDirty();
        if (finiteMode() && !applying && !waitingRestore && mutable()) status("Settings ready. Press GENERATE to prepare audio.");
    };
    g.loadfile = function () {
        if (!booted || deleted) return;
        var before = paths.slice(0);
        under.loadfile.apply(host, arguments);
        if (!applying && JSON.stringify(before) !== JSON.stringify(paths)) { invalidate(); changed(); }
    };
    g.loaded = function (slot) {
        under.loaded(slot);
        if (slotOK(Number(slot))) message("file" + (Number(slot) + 1), "hint", paths[Number(slot)]);
        refreshLabels(); finishRestore(); changed();
    };
    g.demos = function () {
        if (!booted || deleted || !mutable()) return;
        for (var i = 0; i < requiredSources(); i++) g.loadfile(i, localfile("apgw_test" + (i + 1) + ".wav"));
    };
    function edit(method, args, uiValues, affectsRender) {
        if (!booted || (pendingState && !applying)) {
            for (var key in uiValues) if (uiValues.hasOwnProperty(key)) pendingUI[key] = uiValues[key];
            return;
        }
        var structural = method === "repeats" || method === "pitch" || method === "param" || method === "choice";
        var previous = state, nextTrigger = structural && (state === "playing" || (state === "live" && deviceMode === 3));
        var before = finiteMode() && affectsRender ? signature(g.CMPEHost.snapshot()) : "";
        if (nextTrigger) state = "idle";
        try { under[method].apply(host, args); }
        finally { if (nextTrigger) state = previous; }
        if (finiteMode() && affectsRender && before !== signature(g.CMPEHost.snapshot())) invalidate();
        refreshLabels();
        if (nextTrigger) g.lockUI(true);
        changed();
    }
    g.repeats = function (slot, value) { var map = {}; map["repeat" + (Number(slot) + 1)] = Number(value); edit("repeats", arguments, map, true); };
    g.pitch = function (value) { edit("pitch", arguments, {pitch: Number(value)}, true); };
    g.param = function (index, value) { var map = {}; map["param" + Number(index)] = Number(value); edit("param", arguments, map, true); };
    g.choice = function (value) { edit("choice", arguments, {mode_menu: Number(value)}, true); };
    g.monitor = function (value) { edit("monitor", arguments, {monitor_level: Number(value)}, false); };
    g.loopmode = function (value) { edit("loopmode", arguments, {loop_toggle: Number(value)}, false); };
    g.xy = function (x, y) { edit("xy", arguments, {m4l_position: Number(x), m4l_density: Number(y)}, false); };
    g.hostxy = function (axis, value) {
        if ((axis !== "x" && axis !== "y") || !finite(Number(value))) return;
        if (!booted || (pendingState && !applying)) {
            pendingUI[axis === "x" ? "m4l_position" : "m4l_density"] = Number(value);
            return;
        }
        var settings = g.CMPEHost.snapshot().isjs;
        g.xy(axis === "x" ? Number(value) : settings.position, axis === "y" ? Number(value) : settings.densityY);
    };
    g.midilatch = function (value) {
        if (!booted || (pendingState && !applying)) { pendingUI.m4l_latch = Number(value); return; }
        latch = Number(value) !== 0; ui("m4l_latch", latch ? 1 : 0);
        if (!latch && activeKey && !held.length && !manual) g.stop();
        changed();
    };
    g.commitSelection = function () { under.commitSelection(); restoredSelection = null; changed(); };
    g.clearloop = function () { under.clearloop(); restoredSelection = null; changed(); };
    g.requestAudio = function (action) {
        if (!booted || deleted || !enabled) { status("Enable this device in Live before starting."); return; }
        if (pendingState || waitingRestore) { status("Restoring samples. Wait for Ready."); return; }
        if (savePending && action !== "play") { status("Wait for the WAV write to finish."); return; }
        var current = g.CMPEState(), i;
        for (i = 0; i < requiredSources(); i++) {
            if (loading[i] || current.nativeBusy[i]) { status("Loading samples. Wait for Ready."); return; }
            if (!sources[i]) { status("Load the required samples or choose DEMO."); return; }
        }
        message("dsp_info", "bang");
        if (sampleRate <= 0) { status("Enable Live's audio engine so the device can read its sample rate."); return; }
        if (action === "play" || !finiteMode()) {
            if (!audioOn) { status("Live's audio engine is off. Enable it, then trigger again."); return; }
            if (finiteMode()) beginPlayback(); else under.beginRender(false);
        } else {
            prepared = null; restoredSelection = null; rebuilding = false;
            renderSeed = randomSeed(); renderRateOverride = 0;
            under.beginRender(false);
        }
        refreshLabels();
    };
    g.play = function () {
        if (!booted || !mutable()) return;
        if (finiteMode() && (!outputReady || dirty)) { status("Press GENERATE first. Playback starts when the waveform is Ready."); return; }
        clearNotes(); manual = true; velocity(1);
        g.requestAudio(finiteMode() ? "play" : "live");
    };
    g.newpiece = function () {
        if (!booted || !mutable()) return;
        if (finiteMode()) g.requestAudio("render");
        else { under.newpiece(); refreshLabels(); changed(); }
    };
    g.renderComplete = function () {
        under.renderComplete();
        prepared = {algorithm: algorithm, seed: renderSeed, sampleRate: plan.sampleRate,
            sources: fingerprints(), signature: signature(g.CMPEHost.snapshot())};
        if (restoredSelection) {
            pendingSelection = restoredSelection.slice(0); restoredSelection = null;
            under.commitSelection();
        }
        rebuilding = false; renderRateOverride = 0; refreshLabels();
        status(firstAudioFrame < 0 ? "The prepared output is silent or very quiet. Check the source audio." : "Ready. PLAY or a MIDI note starts the prepared waveform.");
        changed();
    };
    g.renderFailed = function (reason) {
        under.renderFailed(reason); rebuilding = false; renderRateOverride = 0; refreshLabels(); changed();
    };
    function startNote(note, value, channel) {
        if (!enabled || !booted || pendingState || waitingRestore || rebuilding || deleted) return false;
        if (state === "rendering" || state === "waiting" || state === "restoring") { status("Wait for Ready, then play the note again."); return false; }
        if (finiteMode() && (!outputReady || dirty)) { status("Press GENERATE first, then play the note again when Ready."); return false; }
        message("dsp_info", "bang");
        if (!audioOn || sampleRate <= 0) { status("Enable Live's audio engine, then play the note again."); return false; }
        cancelTask(finishTask); finishTask = null;
        if (!finiteMode()) {
            under.stop();
            if (deviceMode === 3) under.param(1, clamp(440 * Math.pow(2, (note - 69) / 12), 20, 20000));
        } else if (state === "stopping") state = "ready";
        manual = false; velocity(value / 127);
        if (finiteMode()) beginPlayback(); else g.requestAudio("live");
        if (state !== "playing" && state !== "live") return false;
        activeKey = channel + ":" + note;
        refreshLabels(); changed(); return true;
    }
    g.midinote = function (note, value, channel) {
        note = Number(note); value = Number(value); channel = Number(channel || 1);
        if (!finite(note) || !finite(value) || !finite(channel) || note < 0 || note > 127 || value < 0 || value > 127 || channel < 1 || channel > 16) return;
        note = Math.round(note); value = Math.round(value); channel = Math.round(channel);
        var key = channel + ":" + note, i;
        if (value > 0) {
            if (!startNote(note, value, channel)) return;
            for (i = held.length - 1; i >= 0; i--) if (held[i].key === key) held.splice(i, 1);
            held.push({key: key, note: note, velocity: value, channel: channel});
        } else {
            for (i = held.length - 1; i >= 0; i--) if (held[i].key === key) held.splice(i, 1);
            if (manual || key !== activeKey || latch) return;
            if (held.length) {
                var previous = held[held.length - 1];
                if (!startNote(previous.note, previous.velocity, previous.channel)) g.stop();
            } else g.stop();
        }
    };
    g.stop = function () {
        clearNotes();
        if (waitingRestore) { waitingRestore = false; prepared = null; restoredSelection = null; restoreTarget = null; }
        if (state === "rendering") { prepared = null; rebuilding = false; restoredSelection = null; }
        under.stop(); refreshLabels(); changed();
    };
    g.hostactive = function (value) {
        enabled = Number(value) !== 0;
        if (!booted) return;
        if (!enabled) {
            clearNotes();
            var wasRebuilding = rebuilding, saved = prepared;
            // The underlying restore has already stopped the voices. Calling
            // its STOP here would discard a new Set state waiting on disk I/O.
            if (!g.CMPEState().restoring) under.stop();
            cancelTask(finishTask); finishTask = null;
            if (state === "stopping") finishPlayback("Device disabled.");
            velocity(0);
            if (wasRebuilding) { prepared = saved; rebuilding = false; waitingRestore = true; }
            status("Device disabled in Live.");
        } else { velocity(1); finishRestore(); }
    };
    g.dspstate = function (value) {
        under.dspstate(value);
        if (Number(value) === 0) { clearNotes(); if (booted && !rebuilding) status("Live audio is off. Enable it before playback."); }
    };
    g.samplerate = function (value) { under.samplerate(value); };
    g.shutdown = function () {
        deleted = true; clearNotes(); cancelTask(restoreTask); restoreTask = null;
        under.shutdown(); velocity(0);
    };
    g.notifydeleted = function () { g.shutdown(); };
    g.M4LState = function () {
        return {mode: deviceMode, booted: booted, enabled: enabled, waitingRestore: waitingRestore,
            rebuilding: rebuilding, latch: latch, activeNote: activeKey, heldNotes: held.length,
            renderSeed: renderSeed, prepared: prepared ? copy(prepared) : null, deleted: deleted};
    };
}(this));
