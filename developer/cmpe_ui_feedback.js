/* CMPE standalone presentation feedback.
 * Append after cmpe_audio_settings.js. No DSP, scheduling, randomization, source
 * reads, or persisted settings are changed here. All new widgets are optional.
 */
(function (g) {
    "use strict";
    if (typeof g.CMPEUIFeedback === "function") return;

    var baseUI = g.ui, depth = 0, drawing = false, disposed = false;
    var bootPending = false, checkingSilence = false, fault = "";
    var currentStatus = "", renderInfo = "", heldNotice = "", elapsedSeconds = 0;
    var playbackFraction = 0, waveZoom = 1, zoomForResult = false, cache = {}, lastView = null;
    function rgba(hex) {
        return [parseInt(hex.substr(1, 2), 16) / 255,
            parseInt(hex.substr(3, 2), 16) / 255,
            parseInt(hex.substr(5, 2), 16) / 255, 1];
    }
    var white = rgba("#FFFFFF"), ink = rgba("#17202B"), muted = rgba("#465365");
    var inactive = rgba("#E0E5EB"), disabled = rgba("#D9DFE7"), disabledInk = rgba("#525C69");
    var blue = rgba("#174FCB"), charcoal = rgba("#263140"), pressed = rgba("#CDD4DD");
    var hover = rgba("#BFDBFE"), bluePressed = rgba("#103A9A");
    var accents = [blue, rgba("#006B64"), rgba("#6C3BAA"), rgba("#8A4B14"), rgba("#A32E58")];
    var pressedAccents = [bluePressed, rgba("#004E49"), rgba("#4E287D"), rgba("#63350D"), rgba("#77203F")];
    var tints = [rgba("#EDF3FF"), rgba("#EAF7F4"), rgba("#F4EEFC"), rgba("#FAF2E8"), rgba("#FBEFF3")];
    var traces = [rgba("#78B7FF"), rgba("#5FD6C8"), rgba("#C5A0F5"), rgba("#EFBA80"), rgba("#F49CBC")];
    var paleTraces = [rgba("#D6E6FA"), rgba("#C5EFE7"), rgba("#E8D9FB"), rgba("#F6E2CB"), rgba("#F8D8E4")];
    var amber = ink, amberTint = inactive;
    var red = rgba("#A82132"), redTint = rgba("#FFF1F2");

    function object(name) { return g.named(name); }
    function send(name, selector, values) {
        var o = object(name), key = name + ":" + selector, signature = JSON.stringify(values);
        if (!o || cache[key] === signature) return;
        cache[key] = signature;
        o.message.apply(o, [selector].concat(values));
    }
    function set(name, value) { send(name, "set", [value]); }
    function color(name, selector, value) { send(name, selector, value); }
    function hide(name, yes) { var o = object(name); if (o) o.hidden = yes ? 1 : 0; }
    function finiteNumber(value) { return typeof value === "number" && isFinite(value); }
    function unit(value) { return Math.max(0, Math.min(1, finiteNumber(value) ? value : 0)); }
    function transport(name, label, enabled, accent, tint, emphasized) {
        send(name, "text", [label]);
        // active=0 makes native textbutton substitute an illegible gray. Keep
        // its presentation active; the original lockUI owns click permissions.
        send(name, "active", [1]);
        send(name, "usebgoncolor", [1]);
        send(name, "usetextovercolor", [1]);
        var bg = enabled || emphasized ? (emphasized ? accent : tint) : disabled;
        var fg = enabled || emphasized ? (emphasized ? white : accent) : disabledInk;
        color(name, "bgcolor", bg);
        color(name, "bgoncolor", enabled || emphasized ? (emphasized ? ink : pressed) : disabled);
        color(name, "textcolor", fg); color(name, "textoncolor", fg); color(name, "textovercolor", fg);
    }
    function styleControl(name, enabled, accent, tint, pressedAccent) {
        var load = /^load[123]$/.test(name);
        var step = /^(?:repeat_(?:down|up)[123]|pitch_(?:down|up))$/.test(name);
        var button = load || step || /^(?:demo_button|save_button|clear_button)$/.test(name);
        var bg = enabled ? (load ? charcoal : (tint || white)) : disabled;
        var fg = enabled ? (load ? white : (accent || ink)) : disabledInk;
        color(name, name === "mode_menu" ? "bgfillcolor" : "bgcolor", bg);
        color(name, "textcolor", fg);
        if (name === "mode_menu") send(name, "applycolors", [1]);
        if (button) {
            // Preserve readable custom disabled colors without changing the
            // controller's ignoreclick lock or enabling a source during reads.
            send(name, "active", [1]);
            send(name, "usebgoncolor", [1]);
            send(name, "usetextovercolor", [1]);
            color(name, "bgoncolor", enabled ? (load ? (pressedAccent || bluePressed) : pressed) : disabled);
            color(name, "textoncolor", fg);
            color(name, "textovercolor", enabled && load ? (tint || hover) : fg);
        }
    }
    function diagnostic(text) {
        return /(?:did not (?:start|advance|finish|complete)|has not finished|not loaded:|no audible partials|cannot be read|check the source file and max console|unconfirmed)/i.test(text);
    }
    function clearNotice() { heldNotice = ""; fault = ""; }
    function info() {
        return typeof g.CMPEState === "function" ? g.CMPEState() :
            {mode: 0, state: g.state, recording: false, recordArmed: false, nativeBusy: [false, false, false]};
    }
    function refresh() {
        if (drawing || disposed || depth > 0) return;
        drawing = true;
        try {
            var cmpe = info(), mode = cmpe.mode, rendered = mode === 0 || mode === 4;
            var audio = typeof g.CMPEAudioState === "function" ? g.CMPEAudioState() : {};
            var input = typeof g.CMPEInputState === "function" ? g.CMPEInputState() : {busy: false};
            var inputSaving = input.phase === "saving";
            var state = g.state, required = mode === 3 ? 0 : (mode === 2 || mode === 4 ? 1 : 3);
            var loading = false, stalled = false, missing = false, i, sourceState;
            var accent = accents[mode] || accents[0], tint = tints[mode] || tints[0];
            var accentPressed = pressedAccents[mode] || pressedAccents[0];
            var trace = traces[mode] || traces[0], paleTrace = paleTraces[mode] || paleTraces[0];
            for (i = 0; i < 3; i++) {
                var nativeBusy = !!(cmpe.nativeBusy && cmpe.nativeBusy[i]);
                var reading = !!(g.loading && g.loading[i]);
                var available = !!(g.sources && g.sources[i]);
                sourceState = nativeBusy && !reading ? "WAITING" :
                    (nativeBusy || reading ? "LOADING" : (available ? "READY" : "EMPTY"));
                hide("source_state" + (i + 1), i >= required);
                set("source_state" + (i + 1), sourceState);
                color("source_state" + (i + 1), "textcolor", sourceState === "WAITING" ? red :
                    (sourceState === "LOADING" ? amber : (available ? ink : muted)));
                color("source_card" + (i + 1), "bgfillcolor", i >= required ? white : (sourceState === "WAITING" ? redTint :
                    (sourceState === "LOADING" ? amberTint : white)));
                color("source_accent" + (i + 1), "bgfillcolor", accent);
                color("source_wave" + (i + 1), "waveformcolor", trace);
                if (i < required) {
                    loading = loading || nativeBusy || reading;
                    stalled = stalled || (nativeBusy && !reading);
                    missing = missing || !available;
                }
            }
            var groupLabels = mode === 3 ? ["DRONE", "HARMONICS", "INTERVAL"] :
                (mode === 2 ? ["", "SPACE", "TIMING + PITCH"] : ["", "PACE", "SHAPE"]);
            var groupHelp = mode === 3 ? ["Sine-wave drone.\nNo sample files needed.", "Tune the fundamental and\nnumber of partials.", "Transpose the side banks\nin semitones."] :
                (mode === 2 ? ["", "Set the longest delay in\nthe layered reverb.", "Control layer spacing and\nthe pitch collection."] :
                    ["", "Tempo shapes the Long form.\nShort plays all slices together.", "Choose the slice length and\na short burst or a gradual build."]);
            for (i = 1; i <= 3; i++) {
                var grouped = mode === 3 || ((mode === 2 || mode === 4) && i > 1);
                hide("group_label" + i, !grouped); hide("group_help" + i, !grouped);
                if (grouped) {
                    set("group_label" + i, groupLabels[i - 1]); set("group_help" + i, groupHelp[i - 1]);
                    color("group_label" + i, "textcolor", accent); color("group_help" + i, "textcolor", muted);
                }
            }
            var label, heading, badgeColor = accent, panelColor = tint, fraction = 0;
            var canEdit = state === "idle" || state === "ready";
            var busy = state === "waiting" || state === "rendering" || state === "stopping" || state === "restoring" || audio.changing || input.busy;
            var inputHeading = input.busy || (inputSaving && canEdit);
            if (inputHeading) {
                var inputSlot = input.slot;
                if (inputSaving && input.sources) {
                    for (i = 0; i < input.sources.length; i++) if (input.sources[i].saving) inputSlot = i;
                }
                var sampleName = inputSlot >= 0 ? "sample " + (inputSlot + 1) : "the sample";
                if (input.phase === "recording") {
                    label = "RECORDING INPUT";
                    heading = "Recording " + sampleName + " · press REC IN or STOP to finish";
                    badgeColor = red; panelColor = redTint;
                    fraction = unit(input.limitMs > 0 ? input.elapsedMs / input.limitMs : 0);
                } else if (input.phase === "saving") {
                    label = "SAVING SAMPLE"; heading = "Writing " + sampleName + " to a WAV file";
                } else {
                    var finishing = input.phase === "stopping" || input.phase === "trimming";
                    label = finishing ? "FINISHING INPUT" : "STARTING INPUT";
                    heading = finishing ? "Preparing " + sampleName + " from the recorded input" : "Waiting for Max audio input";
                    badgeColor = amber; panelColor = amberTint;
                }
            } else if (audio.changing) {
                label = audio.pending && audio.pending.kind === "on" ? "STARTING AUDIO" : "AUDIO SETTINGS";
                heading = audio.pending && audio.pending.kind === "on" ? "Waiting for Max audio" : "Applying audio settings";
                badgeColor = amber; panelColor = amberTint;
            } else if (state === "restoring" || cmpe.restoring) {
                label = "RESTORING SET"; heading = "Waiting for the current sample read";
                badgeColor = amber; panelColor = amberTint;
            } else if (state === "waiting") {
                label = "STARTING AUDIO"; heading = "Waiting for Max audio";
                badgeColor = amber; panelColor = amberTint;
            } else if (state === "rendering") {
                if (checkingSilence && mode === 0) {
                    label = "CHECKING SILENCE"; heading = "Checking the beginning and ending";
                    fraction = unit(g.scanLimit > 0 ? g.scanFrame / g.scanLimit : 0);
                    badgeColor = amber; panelColor = amberTint;
                } else {
                    fraction = unit(g.renderHalf > 0 ? g.renderFrame / g.renderHalf : 0);
                    label = "RENDERING " + Math.floor(fraction * 100) + "%";
                    heading = "Building the audio waveform";
                }
            } else if (state === "playing") {
                label = g.loopEnabled ? "LOOPING" : "PLAYING";
                heading = g.loopEnabled ? "Playing the selected loop" : "Playing the rendered take";
                fraction = playbackFraction;
            } else if (state === "live") {
                var fading = (mode === 2 && elapsedSeconds < 4) || (mode === 3 && elapsedSeconds < 20);
                label = cmpe.recording ? "RECORDING" : (fading ? "FADING IN" : "LIVE");
                heading = mode === 1 ? "Move the pad to shape the grains" :
                    (mode === 2 ? (fading ? "The ambient layers are fading in" : "Playing overlapping ambient layers") :
                        (fading ? "Harmonics enter over 3-20 seconds" : "The harmonic drone is evolving"));
                if (cmpe.recording) { badgeColor = red; panelColor = redTint; }
                // RMHS already sends the true planned-duration fraction. Live
                // ISJS and Many have no finite completion percentage.
                fraction = mode === 3 ? null : 0;
            } else if (state === "stopping") {
                label = "STOPPING"; heading = "Fading the output";
                badgeColor = amber; panelColor = amberTint;
            } else if (stalled) {
                label = "LOAD STALLED"; heading = "A sample read has not finished";
                badgeColor = red; panelColor = redTint;
            } else if (loading || (bootPending && required > 0)) {
                label = "LOADING SAMPLES"; heading = "Reading the source audio";
                badgeColor = amber; panelColor = amberTint;
            } else if (fault) {
                label = fault === "cancelled" ? "CANCELLED" : "RENDER ERROR";
                heading = fault === "cancelled" ? "Generation cancelled · no complete take" : "Generation did not complete";
                badgeColor = fault === "cancelled" ? amber : red;
                panelColor = fault === "cancelled" ? amberTint : redTint;
            } else if (rendered && g.outputReady && g.dirty) {
                label = "CHANGES PENDING"; heading = "Cached waveform · generate the new settings";
                badgeColor = amber; panelColor = amberTint; fraction = 1;
            } else if (rendered && g.outputReady) {
                label = "READY TO PLAY"; heading = "Waveform ready · select a range or play"; fraction = 1;
            } else if (mode === 3 && /^Drone finished\./.test(currentStatus)) {
                label = "COMPLETE"; heading = "Drone finished · START makes another performance"; fraction = 1;
            } else if (missing) {
                label = "LOAD SAMPLES"; heading = required === 1 ? "Load sample 1 or choose DEMO" : "Load three samples or choose DEMO";
                badgeColor = muted; panelColor = inactive;
            } else if (cmpe.recordArmed) {
                label = "RECORD ARMED"; heading = "START begins the performance and recording";
                badgeColor = red; panelColor = redTint;
            } else {
                label = rendered ? "READY TO GENERATE" : "READY TO START";
                heading = rendered ? "Generate a new take from your samples" :
                    (mode === 3 ? "Start a harmonic drone · no samples needed" : "Start the live instrument");
            }
            if (g.savePending && canEdit) { label = "SAVING WAV"; heading = "Writing the complete rendered take"; badgeColor = amber; panelColor = amberTint; }

            send("state_badge", "active", [1]);
            send("state_badge", "ignoreclick", [1]);
            send("state_badge", "text", [label]);
            color("state_badge", "bgcolor", badgeColor); color("state_badge", "bgoncolor", badgeColor);
            color("state_badge", "textcolor", white); color("state_badge", "textoncolor", white); color("state_badge", "textovercolor", white);
            color("feedback_panel", "bgfillcolor", panelColor);
            set("activity_heading", heading); color("activity_heading", "textcolor", ink);
            if (inputHeading) set("render_info", heading);
            else if (lastView && lastView.inputHeading) set("render_info", renderInfo);
            color("status", "textcolor", heldNotice ? red : ink);
            color("progress", "knobcolor", badgeColor);
            if (fraction !== null) set("progress", fraction);
            hide("wave_scale", !rendered);
            var waveHelp = zoomForResult ? "View x" + waveZoom.toFixed(1) + " \u00b7 visual only" :
                (fault ? "Incomplete waveform" : (state === "rendering" ? "Preparing waveform" : "Generate to see waveform"));
            set("wave_scale", waveHelp);
            // Native waveform~ vzoom is the amplitude half-range, not a gain.
            // A smaller range expands quiet audio; keep the label as a gain.
            send("wave_l", "vzoom", [1 / waveZoom]); send("wave_r", "vzoom", [1 / waveZoom]);

            for (i = 0; i < 5; i++) {
                color("mode" + i, "bgcolor", i === mode ? accent : inactive);
                color("mode" + i, "bgoncolor", i === mode ? accentPressed : pressed);
                color("mode" + i, "textcolor", i === mode ? white : ink);
                color("mode" + i, "textoncolor", i === mode ? white : ink);
                color("mode" + i, "textovercolor", i === mode ? white : ink);
            }
            color("mode_info", "textcolor", accent); color("output_label", "textcolor", accent);
            color("wave_scale", "textcolor", muted);
            color("wave_l", "waveformcolor", trace); color("wave_r", "waveformcolor", paleTrace);
            color("scope_l", "fgcolor", trace); color("scope_r", "fgcolor", paleTrace);
            color("scope_xy", "fgcolor", trace);
            color("monitor_level", "hbgcolor", accent);
            color("original_link", "textcolor", accent); color("original_link", "textoncolor", accent);
            color("original_link", "textovercolor", accent);
            var readySources = !missing && !loading && !(bootPending && required > 0);
            var playLabel = busy ? "PREPARING..." : (state === "playing" ? "PLAYING" :
                (state === "live" ? "LIVE" : (rendered ? (g.dirty || !g.outputReady ? "GENERATE + PLAY" : "PLAY") : "START")));
            if (state === "stopping") playLabel = "STOPPING...";
            transport("play_button", playLabel, canEdit && !busy && readySources, accent, tint,
                state === "playing" || state === "live" || (canEdit && readySources && !busy));
            transport("new_button", rendered ? "NEW TAKE" : (mode === 3 ? "RANDOMIZE" : "RESET"),
                canEdit && !busy && !g.savePending && (rendered ? readySources : true), ink, inactive, false);
            transport("stop_button", state === "rendering" || state === "waiting" ? "CANCEL" : "STOP",
                state !== "idle" || loading || audio.changing || input.busy || cmpe.recordArmed || cmpe.recording, red, redTint, false);
            transport("record_button", cmpe.recording ? "STOP REC" : (cmpe.recordArmed ? "ARMED" : "RECORD WAV"),
                !rendered && state !== "waiting" && !audio.changing && !input.busy, red, redTint, cmpe.recording);
            for (i = 1; i <= 3; i++) styleControl("load" + i, canEdit && !busy && !inputSaving && !(cmpe.nativeBusy && cmpe.nativeBusy[i - 1]), accent, tint, accentPressed);
            var paramsEditable = canEdit || (state === "live" && (mode === 1 || mode === 2));
            for (i = 0; i < 6; i++) {
                var activeParam = paramsEditable && !audio.changing && !input.busy;
                if (mode === 4 && i === 1 && cmpe.settings && cmpe.settings.sioe && cmpe.settings.sioe.form === "short") activeParam = false;
                styleControl("param" + i, activeParam);
                color("param" + i, "hbgcolor", accent);
            }
            for (i = 1; i <= 3; i++) {
                styleControl("repeat" + i, canEdit && !busy); color("repeat" + i, "hbgcolor", accent);
                hide("repeat_down" + i, mode !== 0); hide("repeat_up" + i, mode !== 0);
                styleControl("repeat_down" + i, canEdit && !busy, accent, tint);
                styleControl("repeat_up" + i, canEdit && !busy, accent, tint);
            }
            styleControl("pitch", canEdit && !busy); color("pitch", "hbgcolor", accent);
            hide("pitch_down", mode !== 0); hide("pitch_up", mode !== 0);
            styleControl("pitch_down", canEdit && !busy, accent, tint);
            styleControl("pitch_up", canEdit && !busy, accent, tint);
            styleControl("mode_menu", paramsEditable && !audio.changing && !input.busy);
            styleControl("demo_button", canEdit && !busy && required > 0, ink, inactive);
            styleControl("save_button", !busy && !!g.outputReady, ink, inactive);
            styleControl("clear_button", !busy && !!g.outputReady, ink, inactive);
            lastView = {mode: mode, state: state, badge: label, heading: heading,
                phase: state === "rendering" ? (checkingSilence && mode === 0 ? "scan" : "render") : state,
                progress: fraction, notice: heldNotice, sourceLoading: loading, sourceStalled: stalled,
                outputReady: !!g.outputReady, dirty: !!g.dirty, waveZoom: waveZoom, inputHeading: !!inputHeading};
        } finally { drawing = false; }
    }

    g.ui = function (name, value) {
        if (name === "mode_info") {
            // showMode writes the original tab colors before this label on
            // parameter edits and preset restores as well as mode changes.
            // Reapply only those overwritten style attributes after it runs.
            var selectors = ["bgcolor", "bgoncolor", "textcolor", "textoncolor", "textovercolor"];
            for (var mode = 0; mode < 5; mode++) {
                for (var selector = 0; selector < selectors.length; selector++) {
                    delete cache["mode" + mode + ":" + selectors[selector]];
                }
            }
        }
        if (name === "status") {
            currentStatus = String(value);
            if (diagnostic(currentStatus)) heldNotice = currentStatus;
            if (heldNotice) value = heldNotice;
        } else if (name === "render_info") renderInfo = String(value);
        else if (name === "time") {
            var parsed = parseFloat(value); if (finiteNumber(parsed)) elapsedSeconds = parsed;
        }
        // A renderer or native readback can write a property that this adapter
        // last wrote. Invalidate only that key before restoring the state view.
        delete cache[name + ":set"];
        var result = baseUI.call(this, name, value);
        refresh();
        return result;
    };
    function wrap(name, before, after) {
        var fn = g[name];
        if (typeof fn !== "function") return;
        g[name] = function () {
            depth++;
            try {
                if (before) before.apply(this, arguments);
                var result = fn.apply(this, arguments);
                if (after) after.apply(this, arguments);
                return result;
            } finally { depth--; refresh(); }
        };
    }
    wrap("loadbang", function () { if (!g.initialized) bootPending = true; });
    wrap("demos", function () { bootPending = false; clearNotice(); });
    wrap("loadfile", function () { bootPending = false; clearNotice(); });
    wrap("loaded", null, function (slot) {
        if (g.sources && g.sources[Number(slot)] && /(?:source load|source file|load did not finish)/i.test(heldNotice)) {
            var native = info().nativeBusy || [];
            if (!native[0] && !native[1] && !native[2]) {
                heldNotice = "";
                baseUI.call(g, "status", currentStatus);
            }
        }
    });
    wrap("beginRender", function () {
        clearNotice(); checkingSilence = info().mode === 0; playbackFraction = 0; elapsedSeconds = 0;
        waveZoom = 1; zoomForResult = false;
    });
    wrap("prepareOutput", function () { checkingSilence = false; });
    wrap("renderFailed", function (message) {
        fault = /cancel/i.test(String(message)) ? "cancelled" : "error"; checkingSilence = false;
        waveZoom = 1; zoomForResult = false;
    });
    wrap("renderComplete", function () { checkingSilence = false; fault = ""; }, function () {
        if (!g.outputReady) return;
        var peak = Number(g.renderPeak);
        if (info().mode === 4) peak = Math.min(peak, 0.98);
        waveZoom = finiteNumber(peak) && peak > g.silenceThreshold ? Math.max(1, Math.min(64, 0.82 / peak)) : 1;
        zoomForResult = true;
    });
    wrap("beginPlayback", function () { playbackFraction = 0; });
    wrap("phase", function (value) { if (g.state === "playing" && finiteNumber(Number(value))) playbackFraction = unit(Number(value)); });
    wrap("ended", null, function () { if (g.state === "ready") playbackFraction = 1; });
    wrap("mode", function (value) {
        value = Number(value);
        if (finiteNumber(value) && value >= 0 && value <= 4 && Math.floor(value) === value && value !== info().mode && !g.savePending) {
            clearNotice(); checkingSilence = false; elapsedSeconds = 0; waveZoom = 1; zoomForResult = false;
        }
    }, function () {
        // showMode writes its own colors and labels outside ui(). Force just
        // those presentation attributes to be refreshed after a mode change.
        cache = {};
    });
    wrap("lockUI", null, function () { cache = {}; });
    var actions = ["play", "newpiece", "stop", "repeats", "pitch", "param", "choice", "recordtoggle", "recordpath", "presetread", "audiopower", "audiochoose", "audiosetup"];
    for (var k = 0; k < actions.length; k++) wrap(actions[k], clearNotice);
    var updates = ["loaded", "scanOpening", "renderTick", "allocateOutput", "finishPlayback", "markDirty", "commitSelection", "loopmode", "clearloop", "recordelapsed", "saved", "dspstate", "samplerate"];
    for (k = 0; k < updates.length; k++) wrap(updates[k], null, function () {
        // showMode() is private and is also called by loaded()/param(). Those
        // public hooks finish with a fresh view rather than leaving its labels.
        delete cache["play_button:text"]; delete cache["new_button:text"]; delete cache["stop_button:text"];
    });
    wrap("shutdown", null, function () { disposed = true; });
    g.feedbackwavezoom = function (value) {
        value = Number(value); if (!finiteNumber(value) || value <= 0) return;
        waveZoom = value; zoomForResult = true; refresh();
    };
    g.feedbackrefresh = refresh;
    g.CMPEUIFeedback = function () { return lastView ? JSON.parse(JSON.stringify(lastView)) : null; };
}(this));
