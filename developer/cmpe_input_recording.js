/* CMPE source input recording. Append LAST, after cmpe_ui_feedback.js.
 *
 * Native contract: adc~ 1 2 -> record~ <bank> 2 @loop 0 @append 0.
 * record~ sync -> peakamp~ 0 -> prepend inputposition <generation> <query>;
 *              -> snapshot~ 50 -> prepend inputprogress <generation>.
 * Four buffer~ banks leave one free while three slots hold recorded samples.
 * A stopped, cropped bank becomes a source by changing JS references. Existing
 * source samples are never overwritten while a new take is being prepared.
 *
 * Cycling '74: /legacy/max8/refpages/record~ (0 stops; sync is 0 when off),
 * /legacy/max8/refpages/peakamp~ (maximum since the previous report), and
 * /legacy/max8/refpages/buffer~ (crop in ms; right bang completes read/write),
 * all at https://docs.cycling74.com. No microphone recording starts on load.
 */
(function (g) {
    "use strict";
    if (typeof g.CMPEInputState === "function") return;
    var base = {}, hooks = ["loadbang", "lockUI", "loadfile", "loaded", "requestAudio", "stop",
        "mode", "dspstate", "samplerate", "presetload", "presetread", "presetsave", "presetwrite",
        "audiochoose", "audiopower", "audiosetup", "audiovalue", "audiomenu", "shutdown"];
    var i;
    for (i = 0; i < hooks.length; i++) base[hooks[i]] = g[hooks[i]];
    var limitMs = 60000, phase = "idle", take = null, generation = 0, serial = 0;
    var started = false, disposed = false, drawing = false, notice = "", lastElapsed = 0;
    var task = null, watchTask = null, cleanupTask = null, saveTask = null;
    var dialog = null, writing = null, banks = [], zoom = [1, 1, 1];
    var waveKeys = [null, null, null], waveChannels = [1, 1, 1];
    var red = [168 / 255, 33 / 255, 50 / 255, 1], white = [1, 1, 1, 1];
    var ink = [23 / 255, 32 / 255, 43 / 255, 1], tint = [1, 241 / 255, 242 / 255, 1];
    var gray = [224 / 255, 229 / 255, 235 / 255, 1];
    var disabled = [217 / 255, 223 / 255, 231 / 255, 1], disabledInk = [82 / 255, 92 / 255, 105 / 255, 1];
    var pressed = [205 / 255, 212 / 255, 221 / 255, 1];

    function now() { return new Date().getTime(); }
    function num(value) { return typeof value === "number" && isFinite(value); }
    function validSlot(value) { return num(value) && value === Math.floor(value) && value >= 0 && value < 3; }
    function object(name) { return g.named(name); }
    function send(name, args, required) {
        var o = object(name);
        if (!o) { if (required) throw new Error("Missing input recording object: " + name); return false; }
        o.message.apply(o, args); return true;
    }
    function show(text) { notice = text || ""; if (text && !disposed) g.status(text); }
    function cmpe() { return g.CMPEState(); }
    function audio() { return typeof g.CMPEAudioState === "function" ? g.CMPEAudioState() : {}; }
    function count() { var m = cmpe().mode; return m === 3 ? 0 : (m === 2 || m === 4 ? 1 : 3); }
    function active() { return phase !== "idle"; }
    function sourcesBusy() {
        var s = cmpe(), j;
        if (s.restoring) return true;
        for (j = 0; j < 3; j++) if (g.loading[j] || (s.nativeBusy && s.nativeBusy[j])) return true;
        return false;
    }
    function slotBank(slot) {
        var source = g.sources[slot], j;
        if (!source) return null;
        for (j = 0; j < banks.length; j++) if (banks[j].name === source.name) return banks[j];
        return null;
    }
    function used(bank) {
        for (var j = 0; j < 3; j++) if (g.sources[j] && g.sources[j].name === bank.name) return true;
        return false;
    }
    function unsaved() {
        var result = [], j, b;
        for (j = 0; j < 3; j++) { b = slotBank(j); if (b && !b.path) result.push(j + 1); }
        return result;
    }
    function cancelTimers() {
        g.cancelTask(task); g.cancelTask(watchTask); task = null; watchTask = null;
    }
    function schedule(fn, delay) {
        var token = generation;
        g.cancelTask(task);
        task = new Task(function () {
            task = null;
            if (!disposed && token === generation) {
                try { fn(); } catch (e) { cancelTake("Input recording stopped: " + e.message); }
            }
        }, g.host);
        task.schedule(delay);
    }
    function shape(bank, frames, rate, tolerance) {
        try {
            var b = new Buffer(bank.name), n = b.framecount(), ms = b.length(), channels = b.channelcount();
            return channels === 2 && num(n) && Math.abs(n - frames) <= tolerance && ms > 0 &&
                Math.abs(n * 1000 / ms - rate) < 0.1 ? {buffer: b, frames: n, durationMs: ms, channels: channels} : null;
        } catch (e) { return null; }
    }
    function settleUnused() {
        var pending = false, j, bank, p;
        for (j = 0; j < banks.length; j++) {
            bank = banks[j];
            if (used(bank) || (take && take.bank === bank) || (writing && writing.bank === bank)) continue;
            p = bank.pending;
            if (p && shape(bank, p.frames, p.rate, p.tolerance)) {
                bank.pending = null;
                if (p.release) { bank.allocated = false; bank.path = ""; }
            }
            if (bank.pending) { pending = true; continue; }
            if (bank.allocated && now() >= bank.releaseAt) {
                // Reserve the shrink too: a delayed cleanup must not truncate
                // a later recording which has already reused this bank.
                bank.pending = {frames: 1, rate: bank.rate, tolerance: 0, release: true};
                try {
                    send(bank.object, ["sizeinsamps", 1, 2], true);
                    if (shape(bank, 1, bank.rate, 0)) { bank.pending = null; bank.allocated = false; bank.path = ""; }
                } catch (e) {}
                if (bank.pending) pending = true;
            } else if (bank.allocated) pending = true;
        }
        return pending;
    }
    function cleanup() {
        g.cancelTask(cleanupTask); cleanupTask = null;
        var attempts = 0;
        function tick() {
            cleanupTask = null;
            if (disposed) return;
            // An unconfirmed native resize/crop keeps its bank reserved. A
            // timeout never licenses reusing memory that may still be changing.
            if (settleUnused() && attempts++ < 50) {
                cleanupTask = new Task(tick, g.host); cleanupTask.schedule(100);
            }
        }
        tick();
    }
    function freeBank() {
        settleUnused();
        for (var j = 0; j < banks.length; j++) if (!used(banks[j]) && !banks[j].pending &&
            !(writing && writing.bank === banks[j]) && now() >= banks[j].releaseAt) return banks[j];
        return null;
    }
    function refreshWave(slot, measure) {
        var source = g.sources[slot], target = "source_wave" + (slot + 1), b, peak = 0, j, k, first, n, values, ch;
        var signature = source ? source.name + ":" + source.frames + ":" + source.channels + ":" + source.durationMs : "";
        if (!measure && waveKeys[slot] === signature) return;
        waveKeys[slot] = signature;
        if (!source) { send(target, ["set"]); zoom[slot] = 1; waveChannels[slot] = 1; return; }
        if (measure || source) {
            zoom[slot] = 1;
            try {
                b = g.sourceBuffers[slot]; n = Math.min(1024, source.frames);
                // Bounded display-only scan, including both ends. It neither
                // normalizes nor edits audio and does not scale with file size.
                var peaks = [0, 0];
                for (ch = 1; ch <= source.channels; ch++) {
                    for (j = 0; j < 16; j++) {
                        first = Math.floor((source.frames - n) * j / 15);
                        values = b.peek(ch, first, n); if (typeof values === "number") values = [values];
                        for (k = 0; k < values.length; k++) if (num(values[k])) peaks[ch - 1] = Math.max(peaks[ch - 1], Math.abs(values[k]));
                    }
                }
                waveChannels[slot] = peaks[1] > peaks[0] ? 2 : 1; peak = peaks[waveChannels[slot] - 1];
                if (peak > 0.00001) zoom[slot] = Math.max(1 / 64, Math.min(1, peak / 0.82));
            } catch (e) { zoom[slot] = 1; waveChannels[slot] = 1; }
        }
        // set resets to the entire buffer by contract. A four-value link list
        // belongs to waveform~ inlet 5, not Maxobj.message's left inlet.
        send(target, ["set", source.name, waveChannels[slot]]);
        send(target, ["setmode", 0]); send(target, ["voffset", 0]); send(target, ["vzoom", zoom[slot]]);
        send(target, ["hint", "Source waveform: channel " + waveChannels[slot] +
            (source.channels === 2 ? (waveChannels[slot] === 1 ? " (left)" : " (right)") : " (mono)") + ". Display only."]);
    }
    function refresh() {
        if (drawing || disposed) return;
        drawing = true;
        try {
            var required = count(), change = audio().changing, busy = active(), j, b, rec, save, target, current;
            for (j = 0; j < 3; j++) {
                refreshWave(j, false);
                b = slotBank(j); current = take && take.slot === j;
                rec = !change && !writing && j < required && !sourcesBusy() && !g.savePending &&
                    (!busy || (current && (phase === "recording" || phase === "preparing" || phase === "waiting" || phase === "resetting")));
                save = !!b && !busy && !writing && !change && g.mutable() && !sourcesBusy();
                for (var k = 0; k < 4; k++) {
                    target = object(["source_record", "source_save", "source_wave", "input_state"][k] + (j + 1));
                    if (target) target.hidden = j >= required ? 1 : 0;
                }
                send("source_record" + (j + 1), ["ignoreclick", rec ? 0 : 1]);
                send("source_record" + (j + 1), ["text", current && phase === "recording" ? "STOP REC" : "REC IN"]);
                send("source_record" + (j + 1), ["bgcolor"].concat(current ? red : (rec ? tint : disabled)));
                send("source_record" + (j + 1), ["bgoncolor"].concat(rec || current ? red : disabled));
                send("source_record" + (j + 1), ["textcolor"].concat(current ? white : (rec ? red : disabledInk)));
                send("source_record" + (j + 1), ["textoncolor"].concat(rec || current ? white : disabledInk));
                send("source_record" + (j + 1), ["textovercolor"].concat(current ? white : (rec ? red : disabledInk)));
                send("source_save" + (j + 1), ["ignoreclick", save ? 0 : 1]);
                send("source_save" + (j + 1), ["bgcolor"].concat(save ? gray : disabled));
                send("source_save" + (j + 1), ["bgoncolor"].concat(save ? pressed : disabled));
                send("source_save" + (j + 1), ["textcolor"].concat(save ? ink : disabledInk));
                send("source_save" + (j + 1), ["textoncolor"].concat(save ? ink : disabledInk));
                send("source_save" + (j + 1), ["textovercolor"].concat(save ? ink : disabledInk));
                for (k = 0; k < 2; k++) {
                    var control = ["source_record", "source_save"][k] + (j + 1);
                    send(control, ["active", 1]); send(control, ["usebgoncolor", 1]); send(control, ["usetextovercolor", 1]);
                }
                var label = current ? (phase === "recording" ? "REC " + (take.elapsedMs / 1000).toFixed(1) + "s" :
                    (phase === "stopping" || phase === "trimming" ? "FINISHING" : "PREPARING")) :
                    (writing && writing.slot === j ? (writing.timedOut ? "SAVE WAIT" : "SAVING") : (b && !b.path ? "UNSAVED" : ""));
                send("input_state" + (j + 1), ["set", label]);
                if (busy || writing) send("load" + (j + 1), ["ignoreclick", 1]);
            }
            if (busy) {
                var blocked = ["play_button", "new_button", "demo_button", "test_audio", "record_button",
                    "repeat1", "repeat2", "repeat3", "pitch", "param0", "param1", "param2", "param3", "param4", "param5",
                    "mode_menu", "xy_pad", "loop_toggle", "clear_button", "save_button"];
                for (j = 0; j < blocked.length; j++) send(blocked[j], ["ignoreclick", 1]);
                send("stop_button", ["ignoreclick", 0]);
            }
            var stepsEnabled = !busy && !change && g.mutable() && cmpe().mode === 0;
            for (j = 1; j <= 3; j++) {
                send("repeat_down" + j, ["ignoreclick", stepsEnabled ? 0 : 1]);
                send("repeat_up" + j, ["ignoreclick", stepsEnabled ? 0 : 1]);
            }
            send("pitch_down", ["ignoreclick", stepsEnabled ? 0 : 1]); send("pitch_up", ["ignoreclick", stepsEnabled ? 0 : 1]);
            if (typeof g.feedbackrefresh === "function") g.feedbackrefresh();
        } finally { drawing = false; }
    }
    function unlock() { base.lockUI(!g.mutable()); refresh(); }
    function stopNative() {
        try { send("input_recorder", ["int", 0]); } catch (e) {}
        try { send("input_progress", ["stop"]); } catch (e2) {}
    }
    function cancelTake(message) {
        var old = take;
        generation++; cancelTimers(); stopNative(); take = null; phase = "idle";
        if (old) old.bank.releaseAt = now() + 100;
        cleanup(); unlock(); if (message) show(message);
    }
    function hardwareChanged() {
        if (!take) return false;
        var current = audio(), before = take.hardware, keys = ["driver", "option1", "option2"], j, a, b;
        if (current.changing || current.disposed) return true;
        for (j = 0; j < keys.length; j++) {
            a = before.menus && before.menus[keys[j]]; b = current.menus && current.menus[keys[j]];
            if (a && b && a.index >= 0 && b.index >= 0 &&
                (a.index !== b.index || (a.items[a.index] && b.items[b.index] && a.items[a.index] !== b.items[b.index]))) return true;
        }
        return false;
    }
    function ensureTake() {
        if (!take || disposed) return false;
        if (cmpe().mode !== take.mode || sourcesBusy() || hardwareChanged() ||
            (take.rate > 0 && (!g.audioOn || Math.abs(g.sampleRate - take.rate) > 0.1))) {
            cancelTake("Input recording cancelled after an audio or source change. Previous sample kept."); return false;
        }
        return true;
    }
    function watch() {
        if (!take || phase !== "recording" || !ensureTake()) return;
        if (now() - take.started >= limitMs) { finishTake(); return; }
        if (now() - take.progressAt > 2500) {
            cancelTake("Input recording did not advance. Check Audio Setup and input permissions. Previous sample kept."); return;
        }
        refresh(); watchTask = new Task(watch, g.host); watchTask.schedule(100);
    }
    function startNative() {
        if (!ensureTake() || phase !== "resetting") return;
        cancelTimers(); phase = "recording"; take.started = now(); take.progressAt = now();
        take.elapsedMs = 0; take.displayPeak = 0; take.peak = 0;
        send("input_progress_tag", ["set", "inputprogress", generation], true);
        send("input_progress", ["start"], true);
        send("input_recorder", ["int", 1], true);
        show("Recording input into sample " + (take.slot + 1) + ". REC or STOP finishes the take; limit 60 seconds.");
        watch();
    }
    function resetPeak() {
        if (!ensureTake()) return;
        phase = "resetting"; take.query = 0;
        schedule(function () { cancelTake("Input position was not reported. Previous sample kept."); }, 1000);
        send("input_position_tag", ["set", "inputposition", generation, 0], true);
        send("input_position_peak", ["bang"], true);
        refresh();
    }
    function waitAllocation() {
        if (!ensureTake()) return;
        var match = shape(take.bank, take.capacity, take.rate, 0);
        if (match) {
            take.bank.pending = null;
            send(take.bank.object, ["clear"], true);
            send("input_recorder", ["set", take.bank.name], true);
            send("input_recorder", ["loop", 0], true); send("input_recorder", ["append", 0], true);
            send("input_recorder", ["reset"], true); resetPeak(); return;
        }
        if (now() >= take.deadline) { cancelTake("Input buffer allocation did not complete. Previous sample kept."); return; }
        schedule(waitAllocation, 25);
    }
    function awaitAudio() {
        if (!take || disposed) return;
        if (cmpe().mode !== take.mode || sourcesBusy() || hardwareChanged()) {
            cancelTake("Input recording cancelled. Previous sample kept."); return;
        }
        send("dsp_info", ["bang"]);
        if (g.audioOn && num(g.sampleRate) && g.sampleRate > 0) {
            take.rate = g.sampleRate; take.bank.rate = take.rate;
            take.capacity = Math.round(take.rate * limitMs / 1000);
            take.bank.allocated = true; take.bank.pending = {frames: take.capacity, rate: take.rate, tolerance: 0};
            take.deadline = now() + 1500;
            send(take.bank.object, ["sr", take.rate], true);
            send(take.bank.object, ["sizeinsamps", take.capacity, 2], true);
            waitAllocation(); return;
        }
        phase = "waiting";
        if (now() >= take.deadline) { cancelTake("Audio did not start for input recording. Check Audio Setup. Previous sample kept."); return; }
        schedule(awaitAudio, 50); refresh();
    }
    function beginTake(slot) {
        var bank = freeBank();
        if (!bank) { show("No free recording buffer is ready. Wait for the pending operation or reopen the patch."); return; }
        generation++; cancelTimers(); dialog = null; lastElapsed = 0;
        take = {slot: slot, mode: cmpe().mode, bank: bank, rate: 0, capacity: 0,
            hardware: audio(), elapsedMs: 0, displayPeak: 0, peak: 0, query: 0, deadline: now() + 5000};
        phase = "preparing";
        g.cancelTask(g.demoTask); g.demoTask = null;
        base.stop(); send("audio_test_stop", ["bang"]); send("live_stop", ["bang"]);
        refresh();
        schedule(function () {
            if (!take) return;
            if (!g.audioOn) send("audio_driver", ["startwindow"], true);
            awaitAudio();
        }, 30);
    }
    function queryStopped() {
        if (!ensureTake() || phase !== "stopping") return;
        if (now() >= take.deadline) { cancelTake("Stopped input position was not confirmed. Previous sample kept."); return; }
        take.query++;
        send("input_position_tag", ["set", "inputposition", generation, take.query], true);
        schedule(function () { cancelTake("Stopped input position was not confirmed. Previous sample kept."); },
            Math.max(1, take.deadline - now()));
        send("input_position_peak", ["bang"], true);
    }
    function finishTake() {
        if (!take) return;
        if (phase !== "recording") {
            if (phase !== "stopping" && phase !== "trimming") cancelTake("Input recording cancelled. Previous sample kept.");
            return;
        }
        phase = "stopping"; cancelTimers(); stopNative();
        take.deadline = now() + 1500; take.zeroReports = 0; take.peak = 0;
        show("Finishing input take..."); refresh(); schedule(queryStopped, 30);
    }
    function commitTake(match) {
        if (!ensureTake() || phase !== "trimming") return;
        var completed = take, slot = completed.slot, old = g.sources[slot], bank = completed.bank;
        bank.pending = null; bank.path = ""; bank.revision = ++serial;
        g.sourceBuffers[slot] = match.buffer;
        g.sources[slot] = {name: bank.name, frames: match.frames, durationMs: match.durationMs, channels: 2};
        g.paths[slot] = ""; g.loading[slot] = false; g.dirty = true;
        lastElapsed = match.durationMs; generation++; cancelTimers(); take = null; phase = "idle";
        // The old file buffer is no longer referenced by any playing/rendering
        // voice. Releasing it is safe only after the new take has been adopted.
        if (old && old.name === g.prefix + "_source" + slot && !sourcesBusy()) {
            try { send("source" + (slot + 1), ["sizeinsamps", 1, 2]); } catch (e) {}
        }
        g.ui("file" + (slot + 1), "Input take " + bank.revision + "\n" + (match.durationMs / 1000).toFixed(2) + " s / stereo");
        refreshWave(slot, true); g.markDirty(); cleanup(); unlock();
        show("Input recorded into sample " + (slot + 1) + ". SAVE this sample before saving the set or closing the patch.");
    }
    function waitCrop() {
        if (!ensureTake() || phase !== "trimming") return;
        var match = shape(take.bank, take.frames, take.rate, 1);
        if (match && match.frames >= 2 && match.frames <= take.capacity) { commitTake(match); return; }
        if (now() >= take.deadline) { cancelTake("Input take trimming did not complete. Previous sample kept."); return; }
        schedule(waitCrop, 25);
    }
    function cropTake() {
        if (!ensureTake()) return;
        var frames = Math.min(take.capacity, Math.round(take.peak * take.capacity) + 1);
        if (!num(frames) || frames < 2 || take.peak <= 0) { cancelTake("No input samples were recorded. Previous sample kept."); return; }
        phase = "trimming"; take.frames = frames; take.deadline = now() + 1500;
        take.bank.pending = {frames: frames, rate: take.rate, tolerance: 1};
        // crop_samples is not documented in Max 8. Convert to milliseconds
        // for its supported crop message, then verify the native frame count.
        send(take.bank.object, ["crop", 0, frames * 1000 / take.rate], true);
        waitCrop(); refresh();
    }

    g.inputrecord = function (slot) {
        slot = Number(slot);
        if (disposed || !started || !validSlot(slot) || slot >= count()) return;
        if (active()) { if (take.slot === slot) finishTake(); return; }
        if (writing || sourcesBusy() || cmpe().restoring || g.savePending || audio().changing) {
            show("Wait for the current sample or audio operation before recording input."); return;
        }
        try { beginTake(slot); } catch (e) { cancelTake("Input recording could not start: " + e.message); }
    };
    g.inputprogress = function (token, fraction) {
        token = Number(token); fraction = Number(fraction);
        if (!take || phase !== "recording" || token !== generation || !num(fraction) || fraction < 0 || fraction > 1) return;
        // Snapshot feedback is display-only. Only tagged peakamp reports after
        // record~ has stopped may authorize a committed sample count.
        if (fraction > take.displayPeak) {
            take.displayPeak = fraction; take.elapsedMs = Math.min(limitMs, fraction * limitMs); take.progressAt = now();
        }
        if (fraction === 0 && take.displayPeak > 0.99) { finishTake(); return; }
        refresh();
    };
    g.inputposition = function (token, query, fraction) {
        token = Number(token); query = Number(query); fraction = Number(fraction);
        if (!take || token !== generation || query !== take.query || !num(fraction) || fraction < 0 || fraction > 1) return;
        if (phase === "resetting" && query === 0) { schedule(startNative, 1); return; }
        if (phase !== "stopping" || query <= 0) return;
        g.cancelTask(task); task = null;
        take.peak = Math.max(take.peak, fraction);
        take.zeroReports = fraction === 0 ? take.zeroReports + 1 : 0;
        if (take.zeroReports >= 2) { cropTake(); return; }
        schedule(queryStopped, 30);
    };

    function wavMatches(path, source) {
        var f, bytes, offset = 12, fmt = null, data = null, loops = 0;
        function word(a, at) { return a[at] + a[at + 1] * 256; }
        function dword(a, at) { return word(a, at) + word(a, at + 2) * 65536; }
        function tag(a, at) { return String.fromCharCode(a[at], a[at + 1], a[at + 2], a[at + 3]); }
        try {
            f = new File(path, "read"); if (!f.isopen || f.eof < 44) return false;
            bytes = f.readbytes(12);
            if (bytes.length !== 12 || tag(bytes, 0) !== "RIFF" || tag(bytes, 8) !== "WAVE") return false;
            while (offset + 8 <= f.eof && loops++ < 128) {
                f.position = offset; bytes = f.readbytes(8); if (bytes.length !== 8) return false;
                var name = tag(bytes, 0), length = dword(bytes, 4), end = offset + 8 + length;
                if (end > f.eof) return false;
                if (name === "fmt ") {
                    if (length < 16) return false;
                    bytes = f.readbytes(Math.min(length, 40));
                    fmt = {format: word(bytes, 0), channels: word(bytes, 2), rate: dword(bytes, 4),
                        align: word(bytes, 12), bits: word(bytes, 14)};
                    if (fmt.format === 65534 && bytes.length >= 40) fmt.format = word(bytes, 24);
                } else if (name === "data") data = {length: length, end: end};
                if (fmt && data) break;
                offset = end + length % 2;
            }
            return !!(fmt && data && fmt.format === 1 && fmt.channels === 2 && fmt.bits === 24 && fmt.align === 6 &&
                Math.abs(fmt.rate - source.frames * 1000 / source.durationMs) < 0.1 && data.length === source.frames * 6 && data.end <= f.eof);
        } catch (e) { return false; }
        finally { if (f && f.isopen) f.close(); }
    }
    function finishSave() {
        if (!writing || !writing.complete || disposed) return;
        var saved = writing, success = wavMatches(saved.path, saved.source);
        writing = null; g.cancelTask(saveTask); saveTask = null;
        if (success && saved.bank.revision === saved.revision) {
            saved.bank.path = saved.path;
            if (g.sources[saved.slot] && g.sources[saved.slot].name === saved.bank.name) {
                g.paths[saved.slot] = saved.path;
                g.ui("file" + (saved.slot + 1), g.shortName(saved.path) + "\n" + (saved.source.durationMs / 1000).toFixed(2) + " s / stereo");
            }
            show("Sample WAV saved: " + g.shortName(saved.path));
        } else show("Sample WAV could not be verified. The recorded sample is still in memory; choose SAVE again.");
        cleanup(); unlock();
    }
    g.inputsave = function (slot) {
        slot = Number(slot); var bank = validSlot(slot) ? slotBank(slot) : null;
        if (disposed || !bank || active() || writing || !g.mutable() || sourcesBusy() || audio().changing) return;
        dialog = {slot: slot, bank: bank, revision: bank.revision};
        send("input_save_dialog", ["bang"], true);
    };
    g.inputsavecancel = function () { dialog = null; };
    g.inputsavepath = function () {
        var selected = dialog, path = arrayfromargs(arguments).join(" "); dialog = null;
        if (!selected || !path || disposed || active() || writing || sourcesBusy() || !g.mutable() ||
            slotBank(selected.slot) !== selected.bank || selected.bank.revision !== selected.revision) return;
        if (!/\.wav$/i.test(path)) path += ".wav";
        writing = {slot: selected.slot, bank: selected.bank, revision: selected.revision,
            path: path, source: g.sources[selected.slot], complete: false, timedOut: false};
        try {
            send(selected.bank.object, ["format", "int24"], true);
            send(selected.bank.object, ["filetype", "wave"], true);
            send(selected.bank.object, ["dither", 0], true);
            show("Saving recorded sample WAV..."); refresh();
            saveTask = new Task(function () {
                saveTask = null;
                if (writing && !disposed) {
                    writing.timedOut = true;
                    show("Sample write is not confirmed. Check the destination and Max Console; the take remains in memory."); refresh();
                }
            }, g.host); saveTask.schedule(30000);
            send(selected.bank.object, ["writewave", path], true);
        } catch (e) {
            writing = null; g.cancelTask(saveTask); saveTask = null;
            show("Sample save could not start: " + e.message); unlock();
        }
    };
    g.inputbankdone = function (index) {
        index = Number(index);
        // These banks never read audio files. Their only file operation is one
        // serialized write; resizing/cropping does not constitute a file write.
        if (!writing || disposed || writing.bank.index !== index) return;
        writing.complete = true; finishSave();
    };
    function guardSetSave(fn, args) {
        var pending = unsaved();
        if (active() || writing || pending.length) {
            show(pending.length ? "SAVE recorded sample " + pending.join(", ") + " before saving the set." :
                "Finish input recording and sample saving before saving the set."); return;
        }
        return fn.apply(g, args);
    }
    g.presetsave = function () { return guardSetSave(base.presetsave, arguments); };
    g.presetwrite = function () { return guardSetSave(base.presetwrite, arguments); };
    g.loadbang = function () {
        base.loadbang(); if (started || disposed) return;
        started = true;
        for (var j = 0; j < 4; j++) {
            var bank = {index: j, object: "input_bank" + j, name: g.prefix + "_inputbank" + j,
                allocated: false, pending: null, releaseAt: 0, rate: 44100, revision: 0, path: ""};
            banks.push(bank); send(bank.object, ["name", bank.name]);
        }
        stopNative(); refresh();
    };
    g.lockUI = function (flag) { base.lockUI(flag || active()); refresh(); };
    g.loadfile = function (slot) {
        if (active() || writing) { show("Finish input recording or sample saving before loading a source."); return; }
        var result = base.loadfile.apply(g, arguments); refresh(); return result;
    };
    g.loaded = function (slot) {
        var result = base.loaded.apply(g, arguments); slot = Number(slot);
        if (validSlot(slot)) refreshWave(slot, true);
        cleanup(); refresh(); return result;
    };
    g.requestAudio = function () {
        if (active()) { show("Finish the input take with REC or STOP before playing the instrument."); return; }
        return base.requestAudio.apply(g, arguments);
    };
    var editHooks = ["repeats", "pitch", "repeatstep", "pitchstep", "param", "choice", "xy", "newpiece",
        "recordtoggle", "recordpath", "loopmode", "clearloop", "savepath", "demos"];
    for (i = 0; i < editHooks.length; i++) (function (name) {
        var fn = g[name]; if (typeof fn !== "function") return;
        g[name] = function () {
            if (active()) { show("Finish the input take with REC or STOP before changing the instrument."); return; }
            return fn.apply(g, arguments);
        };
    }(editHooks[i]));
    g.stop = function () {
        if (take) { finishTake(); return; }
        return base.stop.apply(g, arguments);
    };
    g.mode = function (value) {
        value = Number(value);
        if (take && num(value) && value === Math.floor(value) && value >= 0 && value <= 4 && value !== cmpe().mode && !g.savePending)
            cancelTake("Input recording cancelled by instrument change. Previous sample kept.");
        dialog = null; var result = base.mode.apply(g, arguments); cleanup(); refresh(); return result;
    };
    g.dspstate = function (value) {
        if (take && Number(value) === 0 && take.rate > 0) cancelTake("Input recording cancelled because audio stopped. Previous sample kept.");
        return base.dspstate.apply(g, arguments);
    };
    g.samplerate = function (value) {
        if (take && take.rate > 0 && num(Number(value)) && Math.abs(Number(value) - take.rate) > 0.1)
            cancelTake("Input recording cancelled after the sample rate changed. Previous sample kept.");
        return base.samplerate.apply(g, arguments);
    };
    function cancelling(name, reason) {
        g[name] = function () {
            if (take) cancelTake(reason); dialog = null;
            var result = base[name].apply(g, arguments); cleanup(); refresh(); return result;
        };
    }
    cancelling("presetload", "Input recording cancelled before loading settings. Previous sample kept.");
    cancelling("presetread", "Input recording cancelled before restoring settings. Previous sample kept.");
    cancelling("audiochoose", "Input recording cancelled before changing audio devices. Previous sample kept.");
    cancelling("audiopower", "Input recording cancelled before changing audio power. Previous sample kept.");
    cancelling("audiosetup", "Input recording cancelled before opening Audio Setup. Previous sample kept.");
    for (i = 0; i < 2; i++) (function (name) {
        g[name] = function () {
            var result = base[name].apply(g, arguments);
            if (take && hardwareChanged()) cancelTake("Input recording cancelled after an audio device changed. Previous sample kept.");
            return result;
        };
    }(["audiovalue", "audiomenu"][i]));
    if (g.CMPEHost) {
        var restore = g.CMPEHost.restore, snapshot = g.CMPEHost.snapshot;
        g.CMPEHost.restore = function () {
            if (take) cancelTake("Input recording cancelled before restoring settings. Previous sample kept.");
            dialog = null; var result = restore.apply(g.CMPEHost, arguments); cleanup(); refresh(); return result;
        };
        g.CMPEHost.snapshot = function () {
            if (active() || writing || unsaved().length) throw new Error("SAVE recorded samples before saving the set.");
            return snapshot.apply(g.CMPEHost, arguments);
        };
    }
    g.shutdown = function () {
        if (disposed) return;
        if (take) cancelTake(""); disposed = true; generation++; dialog = null;
        cancelTimers(); g.cancelTask(cleanupTask); g.cancelTask(saveTask); cleanupTask = null; saveTask = null;
        stopNative(); base.shutdown();
    };
    g.inputrefresh = refresh;
    g.CMPEInputState = function () {
        var result = {phase: writing && !active() ? "saving" : phase, busy: active(), slot: take ? take.slot : -1,
            generation: generation, elapsedMs: take ? take.elapsedMs : lastElapsed, limitMs: limitMs,
            disposed: disposed, notice: notice, sources: []};
        for (var j = 0; j < 3; j++) {
            var b = slotBank(j);
            result.sources.push({recorded: !!b, unsaved: !!b && !b.path,
                durationMs: g.sources[j] ? g.sources[j].durationMs : 0,
                saving: !!writing && writing.slot === j, bank: b ? b.index : -1, waveChannel: waveChannels[j]});
        }
        return result;
    };
}(this));
