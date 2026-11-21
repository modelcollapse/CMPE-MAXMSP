/* CMPE audio settings. Append after cmpe_extension.js.
 * Native adstatus objects enumerate the active Max driver's own options.
 * No device names, driver indices, or option meanings are assumed here.
 * Startup, refresh, and polling only read global Max audio settings.
 */
(function (g) {
    "use strict";
    var base = {}, wrapped = ["loadbang", "lockUI", "requestAudio", "stop", "dspstate", "samplerate", "shutdown"];
    var k;
    for (k = 0; k < wrapped.length; k++) base[wrapped[k]] = g[wrapped[k]];
    var menus = {
        driver: {native: "audio_ad_driver", ui: "audio_driver_menu", items: [], index: -1, seen: -1, seenName: ""},
        option1: {native: "audio_ad_option1", ui: "audio_option1_menu", items: [], index: -1, seen: -1, seenName: ""},
        option2: {native: "audio_ad_option2", ui: "audio_option2_menu", items: [], index: -1, seen: -1, seenName: ""}
    };
    var labels = ["Driver option 1", "Driver option 2"];
    var disposed = false, started = false, updating = false, refreshing = false;
    var switchKnown = false, changing = false, pending = null, generation = 0;
    var bootTask = null, changeTask = null, settleTask = null, pollTask = null, externalTask = null;
    var refreshFault = false, notice = "", fadeMs = 30;

    function objectMessage(name, args) {
        var o = named(name);
        if (!o) return false;
        o.message.apply(o, args);
        return true;
    }
    function clickable(name, yes) { objectMessage(name, ["ignoreclick", yes ? 0 : 1]); }
    function currentMenu(kind) { return menus.hasOwnProperty(kind) ? menus[kind] : null; }
    function validIndex(m, index) {
        return m && finite(index) && Math.floor(index) === index && index >= 0 && index < m.items.length;
    }
    function mainStatus(text) { if (!disposed) status(text); }
    function display() {
        if (disposed) return;
        var text;
        if (changing) text = pending && pending.kind === "on" ? "Starting audio..." : "Applying audio settings...";
        else if (notice) text = notice;
        else if (!switchKnown) text = "Audio status unavailable · AUDIO SETUP";
        else if (!audioOn) text = "Audio off · press PLAY / START";
        else text = "Audio on" + (sampleRate > 0 ? " · " + (sampleRate / 1000).toFixed(sampleRate % 1000 ? 1 : 0) + " kHz" : "");
        ui("audio_status", text);
        objectMessage("audio_power", ["text", switchKnown ? (audioOn ? "AUDIO ON" : "AUDIO OFF") : "AUDIO ?"]);
        var bg = switchKnown && audioOn ? [0.031373, 0.498039, 0.513725, 1] : [0.898039, 0.925490, 0.941176, 1];
        var fg = switchKnown && audioOn ? [1, 1, 1, 1] : [0.105882, 0.160784, 0.211765, 1];
        objectMessage("audio_power", ["bgcolor"].concat(bg));
        objectMessage("audio_power", ["bgoncolor"].concat(switchKnown && audioOn ? [0.023529, 0.392157, 0.403922, 1] : [0.839216, 0.882353, 0.909804, 1]));
        objectMessage("audio_power", ["textcolor"].concat(fg));
        objectMessage("audio_power", ["textoncolor"].concat(fg));
        objectMessage("audio_power", ["textovercolor"].concat(fg));
    }
    function locks() {
        var name, m;
        for (name in menus) if (menus.hasOwnProperty(name)) {
            m = menus[name];
            clickable(m.ui, !changing && !refreshing && !externalTask && !disposed && validIndex(m, m.index) &&
                (name === "driver" || validIndex(menus.driver, menus.driver.index)));
        }
        clickable("audio_power", !changing && !disposed);
        clickable("audio_setup", !changing && !disposed);
        clickable("audio_refresh", !changing && !disposed);
        if (changing) {
            clickable("play_button", false); clickable("new_button", false);
            clickable("test_audio", false); clickable("record_button", false);
        } else if (!disposed) clickable("test_audio", true);
    }
    function drawMenu(m) {
        var previous = updating, j;
        updating = true;
        try {
            objectMessage(m.ui, ["clear"]);
            if (!m.items.length) {
                objectMessage(m.ui, ["append", "Choose in Setup"]);
                objectMessage(m.ui, ["set", 0]);
            } else {
                for (j = 0; j < m.items.length; j++) objectMessage(m.ui, ["append", m.items[j]]);
                objectMessage(m.ui, ["set", validIndex(m, m.index) ? m.index : -1]);
            }
        } finally { updating = previous; }
        locks();
    }
    function drawIndex(m) {
        var previous = updating;
        updating = true;
        try { objectMessage(m.ui, ["set", validIndex(m, m.index) ? m.index : (m.items.length ? -1 : 0)]); }
        finally { updating = previous; }
        locks();
    }
    function quiet() {
        // stop() cancels the controller's finite/live/render/record work. The
        // TEST SOUND delay and native gates need their separate native stops.
        base.stop();
        objectMessage("audio_test_stop", ["bang"]);
        objectMessage("live_stop", ["bang"]);
    }
    function read(name, selector) {
        if (disposed) return;
        try {
            if (!objectMessage(name, [selector])) refreshFault = true;
        } catch (e) { refreshFault = true; }
    }
    function refreshAll() {
        if (disposed) return;
        var name, m;
        refreshing = true; refreshFault = false;
        try {
            for (name in menus) if (menus.hasOwnProperty(name)) {
                m = menus[name]; m.items = []; m.index = -1; drawMenu(m);
            }
            labels = ["Driver option 1", "Driver option 2"];
            ui("audio_option1_label", labels[0]); ui("audio_option2_label", labels[1]);
            read("audio_ad_driver", "loadbang");
            read("audio_name_option1", "loadbang"); read("audio_name_option2", "loadbang");
            read("audio_ad_option1", "loadbang"); read("audio_ad_option2", "loadbang");
            read("audio_ad_switch", "bang");
        } finally { refreshing = false; }
        if (refreshFault) notice = "Audio controls unavailable · AUDIO SETUP";
        locks(); display();
    }
    function queryCurrent() {
        if (disposed || changing || refreshing) return;
        read("audio_ad_driver", "bang");
        read("audio_ad_option1", "bang"); read("audio_ad_option2", "bang");
        read("audio_ad_switch", "bang");
    }
    function schedulePoll() {
        if (disposed) return;
        cancelTask(pollTask);
        pollTask = new Task(function () {
            if (disposed) return;
            queryCurrent(); schedulePoll();
        }, host);
        pollTask.schedule(2000);
    }
    function externalChange() {
        if (disposed || refreshing || changing || externalTask) return;
        quiet();
        mainStatus("Audio settings changed in Max. Refreshing devices; press PLAY or START when ready.");
        var token = generation;
        externalTask = new Task(function () {
            if (disposed || token !== generation || changing) return;
            externalTask = null;
            refreshAll();
        }, host);
        locks();
        externalTask.schedule(1);
    }
    function readIndex(kind, value) {
        var m = currentMenu(kind), previous, oldName, newName, n = Number(value);
        if (disposed || !m || !finite(n) || Math.floor(n) !== n) return;
        previous = m.seen; oldName = m.seenName; newName = validIndex(m, n) ? m.items[n] : "";
        m.index = n; m.seen = n; m.seenName = newName;
        drawIndex(m);
        if (previous >= 0 && (n !== previous || (oldName && newName && oldName !== newName)) && !refreshing && !changing) externalChange();
    }
    function clearPending() {
        generation++;
        cancelTask(changeTask); cancelTask(settleTask); cancelTask(externalTask);
        changeTask = null; settleTask = null; externalTask = null;
        changing = false; pending = null;
    }
    function sameChoice(request) {
        var m = currentMenu(request.kind), driver = menus.driver;
        return validIndex(m, request.index) && m.items[request.index] === request.label &&
            (request.kind === "driver" || (validIndex(driver, driver.index) && driver.index === request.driverIndex &&
                driver.items[driver.index] === request.driverLabel));
    }
    function finishChange(token) {
        if (disposed || token !== generation || !pending) return;
        settleTask = null;
        var request = pending, confirmed;
        refreshAll();
        if (disposed || token !== generation || !pending) return;
        if (request.kind === "on") confirmed = switchKnown && audioOn;
        else if (request.kind === "off" || request.kind === "setup") confirmed = switchKnown && !audioOn;
        else confirmed = sameChoice(request) && menus[request.kind].index === request.index && switchKnown && !audioOn;
        changing = false; pending = null;
        notice = confirmed ? "" : "Audio setting unconfirmed · use AUDIO SETUP";
        g.lockUI(!mutable()); display();
        if (!confirmed) mainStatus("Max did not confirm the requested audio setting. Open AUDIO SETUP and check the driver and devices.");
        else if (request.kind === "on") mainStatus("Audio is on. Press PLAY or START to begin.");
        else if (request.kind === "setup") mainStatus("Audio Setup opened with playback stopped. Choose your interface, then press PLAY / START or turn audio on.");
        else mainStatus("Audio off. Press PLAY / START or turn audio on when ready.");
    }
    function beginChange(kind, index) {
        if (disposed || updating || refreshing) return;
        if (changing) { mainStatus("Please wait for the current audio setting change."); return; }
        if (savePending && kind !== "off") { mainStatus("Wait for the WAV save to finish before changing audio settings."); return; }
        clearPending();
        var m = currentMenu(kind), driver = menus.driver;
        changing = true; pending = {kind: kind, index: index, phase: "fade",
            label: m ? m.items[index] : "", driverIndex: driver.index,
            driverLabel: validIndex(driver, driver.index) ? driver.items[driver.index] : ""}; notice = "";
        var token = generation;
        quiet();
        if (disposed || token !== generation || !pending) return;
        g.lockUI(true); display();
        mainStatus(kind === "on" ? "Starting audio..." : "Stopping playback before changing audio settings...");
        if (disposed || token !== generation || !pending) return;
        changeTask = new Task(function () {
            if (disposed || token !== generation || !pending) return;
            changeTask = null;
            try {
                pending.phase = "apply";
                // These are the only writes to global audio settings in this
                // module. They follow an explicit user action and a 30 ms fade.
                var switched = false;
                try { switched = objectMessage("audio_ad_switch", ["int", kind === "on" ? 1 : 0]); } catch (switchError) {}
                if (disposed || token !== generation || !pending) return;
                if (!switched) {
                    // dac~ stop/open remain a native recovery path if an
                    // adstatus object is missing or unavailable.
                    if (kind === "on" || !objectMessage("audio_driver", ["stop"])) throw new Error("Audio switch unavailable");
                }
                if (disposed || token !== generation || !pending) return;
                if (kind === "setup") {
                    var opened = false;
                    try { opened = objectMessage("audio_setup_native", ["bang"]); } catch (setupError) {}
                    if (disposed || token !== generation || !pending) return;
                    if (!opened && !objectMessage("audio_driver", ["open"])) throw new Error("Audio Setup unavailable");
                } else if (currentMenu(kind)) {
                    // Devices can disappear or be reordered during the fade.
                    // Re-enumerate and compare identities before using an index.
                    refreshAll();
                    if (disposed || token !== generation || !pending) return;
                    if (!sameChoice(pending) || !switchKnown || audioOn) {
                        clearPending(); notice = "Audio choices changed · press REFRESH";
                        g.lockUI(!mutable()); display();
                        mainStatus("Audio choices changed or Max did not confirm audio off. Press REFRESH, then choose the interface again, or open AUDIO SETUP.");
                        return;
                    }
                    if (!objectMessage(menus[kind].native, ["int", index])) throw new Error("Audio option unavailable");
                }
                if (disposed || token !== generation || !pending) return;
                pending.phase = "readback";
                settleTask = new Task(function () { finishChange(token); }, host);
                settleTask.schedule(150);
            } catch (e) {
                if (disposed || token !== generation) return;
                changing = false; pending = null;
                notice = "Audio controls unavailable · AUDIO SETUP";
                g.lockUI(!mutable()); display();
                mainStatus("Audio settings could not be changed. Open Max's Options > Audio Status and choose your interface there.");
            }
        }, host);
        changeTask.schedule(fadeMs);
    }

    g.audiomenu = function (kind, selector) {
        var m = currentMenu(String(kind)), args = arrayfromargs(arguments), text;
        if (disposed || !m) return;
        if (selector === "clear") { m.items = []; m.index = -1; drawMenu(m); }
        else if (selector === "append") {
            text = args.slice(2).join(" ");
            if (text) { m.items.push(text); drawMenu(m); }
        } else if (selector === "set") readIndex(String(kind), args[2]);
    };
    g.audiovalue = function (kind, value) { readIndex(String(kind), value); };
    g.audioname = function (number, selector) {
        number = Number(number);
        if (disposed || (number !== 1 && number !== 2)) return;
        var args = arrayfromargs(arguments), text = "";
        if (selector === "clear") text = "Driver option " + number;
        else if (selector === "append" || selector === "set") {
            if (selector === "set" && args.length === 3 && finite(Number(args[2]))) return;
            text = args.slice(2).join(" ");
        } else text = args.slice(1).join(" ");
        if (text) { labels[number - 1] = text; ui("audio_option" + number + "_label", text); }
    };
    g.audioswitch = function (value) {
        value = Number(value);
        if (value === 0 || value === 1) g.dspstate(value);
    };
    g.audiochoose = function (kind, value) {
        kind = String(kind); value = Number(value);
        var m = currentMenu(kind);
        if (disposed || updating || refreshing || changing || externalTask || !m) return;
        if (!validIndex(m, value) || !validIndex(m, m.index) ||
            (kind !== "driver" && !validIndex(menus.driver, menus.driver.index))) {
            mainStatus("No current device choices were reported. Press REFRESH or open AUDIO SETUP.");
            drawMenu(m); return;
        }
        if (value === m.index) return;
        beginChange(kind, value);
    };
    g.audiopower = function () {
        if (disposed || changing) return;
        queryCurrent();
        if (!switchKnown) {
            notice = "Audio status unavailable · AUDIO SETUP"; display();
            mainStatus("Max has not reported its audio state. Open AUDIO SETUP, or press REFRESH to try again.");
            return;
        }
        beginChange(audioOn ? "off" : "on", -1);
    };
    g.audiosetup = function () { beginChange("setup", -1); };
    g.audiorefresh = function () {
        if (disposed || changing) return;
        notice = ""; refreshAll();
        mainStatus(refreshFault || !menus.driver.items.length ?
            "Audio choices were not reported. Open AUDIO SETUP to choose your interface." :
            "Audio choices refreshed from Max. Driver option names and devices depend on your audio driver.");
    };
    g.loadbang = function () {
        base.loadbang();
        if (started || disposed) return;
        started = true;
        display(); locks();
        bootTask = new Task(function () {
            bootTask = null;
            if (disposed) return;
            if (!changing) refreshAll();
            schedulePoll();
        }, host);
        bootTask.schedule(80);
    };
    g.lockUI = function (flag) { base.lockUI(flag || changing); locks(); };
    g.requestAudio = function (action) {
        if (disposed) return;
        if (changing) { mainStatus("Please wait for the audio setting change, then press PLAY or START."); return; }
        notice = ""; queryCurrent(); display();
        base.requestAudio(action);
    };
    g.stop = function () {
        if (disposed) return;
        var cancelled = changing;
        if (cancelled) clearPending();
        quiet();
        if (cancelled) {
            notice = ""; refreshAll(); g.lockUI(!mutable());
            mainStatus("Audio change stopped. Check AUDIO SETUP if the setting had already been applied.");
        }
    };
    g.dspstate = function (value) {
        value = Number(value);
        if (disposed || (value !== 0 && value !== 1)) return;
        var stopped = switchKnown && audioOn && value === 0;
        switchKnown = true;
        if (stopped && !changing) quiet();
        base.dspstate(value);
        display();
    };
    g.samplerate = function (value) {
        if (disposed) return;
        base.samplerate(value); display();
    };
    g.shutdown = function () {
        if (disposed) return;
        disposed = true; clearPending();
        cancelTask(bootTask); cancelTask(pollTask); bootTask = null; pollTask = null;
        objectMessage("audio_test_stop", ["bang"]); objectMessage("live_stop", ["bang"]);
        base.shutdown();
    };
    // Read-only diagnostic snapshot. Hardware/global preferences are deliberately
    // excluded from the instrument JSON preset produced by cmpe_extension.js.
    g.CMPEAudioState = function () {
        var result = {changing: changing, refreshing: refreshing, disposed: disposed,
            switchKnown: switchKnown, audioOn: audioOn, sampleRate: sampleRate,
            generation: generation, pending: pending ? {kind: pending.kind, index: pending.index, phase: pending.phase,
                label: pending.label, driverIndex: pending.driverIndex, driverLabel: pending.driverLabel} : null,
            labels: labels.slice(0), menus: {}, notice: notice,
            tasks: {boot: !!bootTask, change: !!changeTask, settle: !!settleTask, poll: !!pollTask, external: !!externalTask}};
        var name, m;
        for (name in menus) if (menus.hasOwnProperty(name)) {
            m = menus[name]; result.menus[name] = {items: m.items.slice(0), index: m.index};
        }
        return result;
    };
}(this));
