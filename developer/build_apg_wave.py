"""Build the APG Wave Max patch and its combined JavaScript runtime."""

from pathlib import Path
import json


BASE = Path(__file__).resolve().parent.parent
OUT = BASE
OUT.mkdir(exist_ok=True)

BLACK = [0.04, 0.04, 0.04, 1.0]
WHITE = [1.0, 1.0, 1.0, 1.0]
LIGHT = [0.92, 0.92, 0.92, 1.0]
WIDTH, HEIGHT = 840, 820

patch = {
    "fileversion": 1,
    "appversion": {"major": 8, "minor": 6, "revision": 5,
                   "architecture": "x64", "modernui": 1},
    "classnamespace": "box",
    "rect": [80, 80, WIDTH, HEIGHT],
    "openinpresentation": 1,
    "default_fontsize": 17.0,
    "default_fontface": 0,
    "default_fontname": "Arial",
    "bgcolor": WHITE,
    "bglockedcolor": WHITE,
    "title": "APG Wave v5 / Audio palindrome",
    "boxes": [],
    "lines": [],
    "autosave": 0,
}
boxes = {}


def box(id, cls, rect, text=None, ins=1, outs=1, types=None,
        present=False, named=False, **attrs):
    assert id not in boxes, id
    obj = {
        "id": id, "maxclass": cls, "numinlets": ins,
        "numoutlets": outs, "patching_rect": list(rect),
        "fontname": "Arial", "fontsize": 17.0, "textcolor": BLACK,
    }
    if text is not None:
        obj["text"] = text
    if types is not None:
        obj["outlettype"] = types
    if present:
        obj.update(presentation=1, presentation_rect=list(rect))
    if named:
        obj["varname"] = id
    obj.update(attrs)
    boxes[id] = obj
    patch["boxes"].append({"box": obj})
    return id


def obj(id, text, x, y, w=160, ins=1, outs=1, types=None,
        named=False, **attrs):
    return box(id, "newobj", [x, y, w, 24], text, ins, outs, types,
               named=named, **attrs)


def msg(id, text, x, y, w=150):
    return box(id, "message", [x, y, w, 24], text,
               2, 1, [""], bgcolor=WHITE)


def label(id, text, rect, size=17.0, named=False, **attrs):
    return box(id, "comment", rect, text, 1, 0,
               present=True, named=named, fontsize=size,
               bgcolor=WHITE, **attrs)


def button(id, text, rect, size=18.0, primary=False, **attrs):
    return box(id, "textbutton", rect, text, 1, 3, ["", "", "int"],
               present=True, named=True, mode=0, outputmode=1,
               fontsize=size, usegradient=0, rounded=3.0,
               bgcolor=BLACK if primary else LIGHT,
               bgoncolor=[0.24, 0.24, 0.24, 1.0] if primary else [0.76, 0.76, 0.76, 1.0],
               textcolor=WHITE if primary else BLACK,
               textoncolor=WHITE if primary else BLACK,
               textovercolor=WHITE if primary else BLACK,
               parameter_enable=0, **attrs)


def number(id, rect, floating=False, **attrs):
    return box(id, "flonum" if floating else "number", rect,
               ins=1, outs=2, types=["", "bang"], present=True, named=True,
               fontsize=20.0, bgcolor=[0.95, 0.95, 0.95, 1.0],
               bgoncolor=[0.84, 0.84, 0.84, 1.0],
               hbgcolor=[0.15, 0.15, 0.15, 1.0], htextcolor=WHITE,
               tricolor=BLACK, triangle=0, parameter_enable=0, **attrs)


def wire(src, outlet, dst, inlet=0, **attrs):
    patch["lines"].append({"patchline": {
        "source": [src, outlet], "destination": [dst, inlet], **attrs
    }})


# Presentation: a compact source section, a larger stereo result, and one transport.
label("title", "APG Wave", [24, 13, 420, 40], 32.0, fontface=1)
label("subtitle", "Audio palindrome generator", [26, 54, 420, 25])
button("demo_button", "DEMO", [522, 25, 124, 34], 17.0,
       hint="Load the three included demo sounds.")
button("test_audio", "TEST SOUND", [660, 25, 156, 34], 17.0,
       hint="Play a short independent tone through the selected audio output.")
for id, y in [("header_rule", 85), ("output_rule", 280), ("credit_rule", 772)]:
    box(id, "panel", [24, y, 792, 1], ins=1, outs=0,
        present=True, bgcolor=[0.81, 0.81, 0.81, 1.0],
        border=0, rounded=0, ignoreclick=1)

for index, x in enumerate([24, 296, 568], 1):
    label("source_label" + str(index), "SAMPLE " + str(index),
          [x, 101, 116, 26], fontface=1)
    button("load" + str(index), "LOAD", [x + 134, 97, 114, 33], 17.0,
           hint="Choose a mono or stereo WAV/AIFF for sample " + str(index) + ".")
    label("file" + str(index), "Loading demo sound...", [x, 139, 248, 42],
          named=True, linecount=2)
    label("repeat_label" + str(index), "Repeats", [x, 194, 114, 26])
    number("repeat" + str(index), [x + 136, 189, 112, 32],
           minimum=1, maximum=20)

label("pitch_label", "Pitch range", [24, 242, 112, 26])
number("pitch", [139, 236, 90, 34], floating=True,
       minimum=0.0, maximum=1.0, format=6)
label("monitor_label", "Volume (dB)", [296, 242, 122, 26])
number("monitor_level", [424, 236, 90, 34], floating=True,
       minimum=-60.0, maximum=0.0, format=6)
label("meter_label", "LEVEL", [568, 242, 96, 26])
for side, y in [("L", 240), ("R", 257)]:
    box("meter_" + side, "meter~", [674, y, 142, 11], ins=1, outs=1,
        types=["float"], present=True,
        bgcolor=[0.17, 0.17, 0.17, 1.0],
        offcolor=[0.28, 0.28, 0.28, 1.0],
        oncolor=[0.18, 0.78, 0.26, 1.0], monotone=1, orientation=1)

label("output_label", "OUTPUT", [24, 286, 130, 27], fontface=1)
label("duration", "Length: --", [166, 286, 365, 27], named=True)
label("time", "0.0 s", [562, 286, 254, 27], named=True, textjustification=2)
for side, channel, y in [("l", 1, 318), ("r", 2, 420)]:
    label("channel_" + side, side.upper(), [24, y + 34, 28, 27], fontface=1)
    box("wave_" + side, "waveform~", [56, y, 760, 96],
        ins=5, outs=6, types=["float", "float", "float", "float", "list", "list"],
        present=True, named=True, buffername="apgw_out_init", chanoffset=channel,
        allowdrag=0, setmode=1, setunit=0, labels=1, quiet=0, outmode=4,
        bgcolor=[0.96, 0.96, 0.96, 1.0], waveformcolor=BLACK,
        gridcolor=[0.65, 0.65, 0.65, 1.0],
        selectioncolor=[0.15, 0.43, 0.85, 0.26],
        fontsize=17.0, vzoom=1.0, voffset=0.0,
        hint="Drag across the waveform to choose a playback or loop range.")

label("selection_info", "Drag across the waveform to select a range.",
      [24, 524, 792, 26], named=True)
box("loop_toggle", "toggle", [24, 570, 26, 26],
    ins=1, outs=1, types=["int"], present=True, named=True,
    bgcolor=WHITE, checkedcolor=BLACK, uncheckedcolor=[0.18, 0.18, 0.18, 1.0],
    parameter_enable=0,
    hint="Repeat the selected range. Turn off to play it once.")
label("loop_label", "Loop selected range", [62, 568, 320, 28])
button("clear_button", "FULL RANGE", [424, 560, 182, 38],
       hint="Reset the selected range to the entire rendered piece.")
button("save_button", "SAVE WAV", [624, 560, 192, 38],
       hint="Save the complete rendered piece as a WAV file.")

button("play_button", "PLAY", [24, 610, 380, 56], 26.0,
       primary=True, fontface=1,
       hint="Play the current render. A new piece is prepared only when needed.")
button("stop_button", "STOP", [420, 610, 190, 56], 24.0,
       active=1,
       hint="Stop playback or cancel preparation.")
button("new_button", "NEW", [626, 610, 190, 56], 24.0,
       hint="Make a new random palindrome from the current three sounds.")
box("progress", "slider", [24, 678, 792, 8],
    ins=1, outs=1, types=[""], present=True, named=True,
    floatoutput=1, size=1.0, min=0.0, mult=1.0, inputrangemode=1,
    orientation=1, ignoreclick=1, parameter_enable=0,
    bgcolor=[0.84, 0.84, 0.84, 1.0], elementcolor=[0.84, 0.84, 0.84, 1.0],
    knobcolor=BLACK, knobshape=0)
label("render_info", "Starting...", [24, 692, 792, 24], named=True)
label("status", "Loading the audio controller...", [24, 721, 792, 45],
      18.0, named=True, linecount=2)
label("original_credit", "Original APG by Joo Won Park", [24, 782, 498, 26])
button("original_link", "joowonpark.net/apg", [548, 779, 268, 32], 17.0,
       hint="Open Joo Won Park's original Audio Palindrome Generator.")

# Open the credited source in the system browser. The Max application receives
# semicolon-prefixed messages directly; this adds no audio or JS dependency.
msg("original_url", "; max launchbrowser https://joowonpark.net/apg/", 1460, 1320, 600)
wire("original_link", 0, "original_url")

# File dialogs and parameter routing. Everything below is outside Presentation.
for index, x in enumerate([24, 340, 656]):
    n = index + 1
    obj("open" + str(n), "opendialog WAVE AIFF", x, 850, 225,
        outs=2, types=["", "bang"])
    obj("path" + str(n), "prepend loadfile " + str(index), x, 890, 215)
    obj("repeats" + str(n), "prepend repeats " + str(index), x, 930, 215)
    obj("source" + str(n), "buffer~ apgw_init" + str(n), x, 990, 225,
        outs=2, types=["float", "bang"], named=True)
    obj("loaded_defer" + str(n), "deferlow", x, 1030, 90)
    msg("loaded_msg" + str(n), "loaded " + str(index), x, 1070, 110)
    wire("load" + str(n), 0, "open" + str(n))
    wire("open" + str(n), 0, "path" + str(n))
    wire("path" + str(n), 0, "controller")
    wire("repeat" + str(n), 0, "repeats" + str(n))
    wire("repeats" + str(n), 0, "controller")
    wire("source" + str(n), 1, "loaded_defer" + str(n))
    wire("loaded_defer" + str(n), 0, "loaded_msg" + str(n))
    wire("loaded_msg" + str(n), 0, "controller")

for id, source, selector, x in [
    ("play_msg", "play_button", "play", 24),
    ("new_msg", "new_button", "newpiece", 145),
    ("demo_msg", "demo_button", "demos", 286),
    ("clear_msg", "clear_button", "clearloop", 407),
]:
    msg(id, selector, x, 1130, 112)
    wire(source, 0, id)
    wire(id, 0, "controller")

for id, source, selector, x in [
    ("pitch_msg", "pitch", "pitch", 24),
    ("monitor_msg", "monitor_level", "monitor", 230),
    ("loop_msg", "loop_toggle", "loopmode", 460),
]:
    obj(id, "prepend " + selector, x, 1180, 195)
    wire(source, 0, id)
    wire(id, 0, "controller")

obj("save_dialog", "savedialog WAVE", 24, 1230, 195,
    outs=2, types=["", "bang"])
obj("save_msg", "prepend savepath", 245, 1230, 195)
wire("save_button", 0, "save_dialog")
wire("save_dialog", 0, "save_msg")
wire("save_msg", 0, "controller")
obj("close", "closebang", 480, 1230, 108)
msg("shutdown_msg", "shutdown", 615, 1230, 110)
wire("close", 0, "shutdown_msg")
wire("shutdown_msg", 0, "controller")

obj("controller", "js apg_wave.js", 24, 1310, 225,
    outs=4, types=["", "", "", ""], named=True)
obj("output_buffer", "buffer~ apgw_out_init 1 2", 300, 1310, 285,
    outs=2, types=["float", "bang"], named=True)
obj("save_complete_defer", "deferlow", 880, 1310, 100)
msg("save_complete_msg", "saved", 1005, 1310, 85)
wire("output_buffer", 1, "save_complete_defer")
wire("save_complete_defer", 0, "save_complete_msg")
wire("save_complete_msg", 0, "controller")
obj("wave_link", "t l", 650, 1310, 65,
    types=["list"], named=True)
wire("wave_link", 0, "wave_l", 4)
for side, other, y in [("l", "r", 1370), ("r", "l", 1410)]:
    wire("wave_" + side, 5, "wave_" + other, 4)
    obj("wave_change_" + side, "prepend wavechange", 300, y, 240)
    obj("wave_mouse_" + side, "prepend wavemouse", 575, y, 240)
    wire("wave_" + side, 5, "wave_change_" + side)
    wire("wave_change_" + side, 0, "controller")
    wire("wave_" + side, 4, "wave_mouse_" + side)
    wire("wave_mouse_" + side, 0, "controller")

# Native transport. The done mask stops a one-shot at the signal boundary.
obj("groove", "groove~ apgw_out_init 2 @loop 1 @loopinterp 1",
    24, 1500, 490, ins=3, outs=3, types=["signal", "signal", "signal"])
obj("speed", "sig~ 0.", 24, 1450, 95, types=["signal"], named=True)
obj("run_gate", "line~ 0.", 550, 1500, 110,
    ins=2, outs=2, types=["signal", "bang"], named=True)
obj("clock", "count~ 0 0 0 0", 730, 1500, 175,
    ins=2, types=["signal"], named=True)
wire("controller", 0, "groove")
wire("controller", 1, "speed")
wire("controller", 2, "run_gate")
wire("controller", 3, "clock")
wire("speed", 0, "groove")

obj("phase_snapshot", "snapshot~ 33", 24, 1560, 145,
    ins=2, types=["float"])
obj("phase_msg", "prepend phase", 24, 1600, 160)
wire("groove", 2, "phase_snapshot")
wire("phase_snapshot", 0, "phase_msg")
wire("phase_msg", 0, "controller")

obj("total_frames", "sig~ 2147483647.", 920, 1500, 205,
    types=["signal"], named=True)
obj("loop_flag", "sig~ 0.", 1185, 1500, 105,
    types=["signal"], named=True)
obj("reached_end", ">=~", 730, 1560, 70, ins=2, types=["signal"])
obj("one_shot", "!-~ 1.", 1185, 1560, 95, ins=2, types=["signal"])
obj("done", "*~", 920, 1620, 55, ins=2, types=["signal"])
obj("done_edge", "edge~", 920, 1670, 80,
    outs=2, types=["bang", "bang"])
obj("play_token", "i 0", 1025, 1670, 60,
    ins=2, types=["int"], named=True)
obj("done_defer", "deferlow", 1025, 1710, 100)
obj("ended_msg", "prepend ended", 1025, 1750, 175)
obj("not_done", "!-~ 1.", 730, 1670, 95, ins=2, types=["signal"])
wire("clock", 0, "reached_end")
wire("total_frames", 0, "reached_end", 1)
wire("loop_flag", 0, "one_shot")
wire("reached_end", 0, "done")
wire("one_shot", 0, "done", 1)
wire("done", 0, "done_edge")
wire("done", 0, "not_done")
wire("done_edge", 0, "play_token")
wire("play_token", 0, "done_defer")
wire("done_defer", 0, "ended_msg")
wire("ended_msg", 0, "controller")

# Five-millisecond edge fades: the controller supplies duration / fade duration.
obj("edge_scale", "sig~ 200.", 370, 1560, 135,
    types=["signal"], named=True)
obj("attack", "*~", 210, 1620, 55, ins=2, types=["signal"])
obj("reverse_phase", "!-~ 1.", 370, 1620, 100, ins=2, types=["signal"])
obj("release", "*~", 370, 1670, 55, ins=2, types=["signal"])
obj("edge_min", "minimum~", 210, 1720, 125, ins=2, types=["signal"])
obj("edge_envelope", "clip~ 0. 1.", 210, 1770, 125, ins=3, types=["signal"])
obj("one_shot_gate", "*~", 550, 1770, 55, ins=2, types=["signal"])
obj("amplitude_gate", "*~", 550, 1820, 55, ins=2, types=["signal"])
wire("groove", 2, "attack")
wire("groove", 2, "reverse_phase")
wire("edge_scale", 0, "attack", 1)
wire("reverse_phase", 0, "release")
wire("edge_scale", 0, "release", 1)
wire("attack", 0, "edge_min")
wire("release", 0, "edge_min", 1)
wire("edge_min", 0, "edge_envelope")
wire("edge_envelope", 0, "one_shot_gate")
wire("not_done", 0, "one_shot_gate", 1)
wire("one_shot_gate", 0, "amplitude_gate")
wire("run_gate", 0, "amplitude_gate", 1)

# Device state and monitor gain, addressed by the JS controller.
obj("dsp_info", "dspstate~", 1025, 1820, 125,
    outs=4, types=["int", "float", "int", "int"], named=True)
obj("dsp_msg", "prepend dspstate", 920, 1870, 195)
obj("samplerate_msg", "prepend samplerate", 1140, 1870, 225)
wire("dsp_info", 0, "dsp_msg")
wire("dsp_msg", 0, "controller")
wire("dsp_info", 1, "samplerate_msg")
wire("samplerate_msg", 0, "controller")
obj("monitor_gain", "line~ 0.25118864", 550, 2070, 205,
    ins=2, outs=2, types=["signal", "bang"], named=True)
obj("audio_driver", "dac~ 1 2", 24, 2190, 120,
    ins=2, outs=0, named=True)

# Independent native test tone, preserved from APG Simple v2.
obj("test_trigger", "t b b b", 1460, 850, 90,
    outs=3, types=["bang", "bang", "bang"])
msg("audio_on", "startwindow", 1590, 850, 135)
msg("test_status", "set Test sound: listen for a short tone.", 1460, 900, 430)
obj("test_delay", "delay 200", 1460, 950, 115,
    ins=2, types=["bang"])
msg("test_envelope_msg", "0., 0.12 10 0.12 250 0. 20", 1460, 1000, 350)
obj("test_envelope", "line~ 0.", 1460, 1050, 110,
    ins=2, outs=2, types=["signal", "bang"])
obj("test_oscillator", "cycle~ 440", 1630, 1050, 125,
    ins=2, types=["signal"])
obj("test_product", "*~", 1460, 1100, 55,
    ins=2, types=["signal"])
wire("test_audio", 0, "test_trigger")
wire("test_trigger", 2, "audio_on")
wire("audio_on", 0, "audio_driver")
wire("test_trigger", 1, "test_status")
wire("test_status", 0, "status")
wire("test_trigger", 0, "test_delay")
wire("test_delay", 0, "test_envelope_msg")
wire("test_envelope_msg", 0, "test_envelope")
wire("test_envelope", 0, "test_product", 1)
wire("test_oscillator", 0, "test_product")

# Native STOP actions run before the JS stop message.
obj("stop_trigger", "t b b b", 1460, 1180, 90,
    outs=3, types=["bang", "bang", "bang"])
msg("test_stop_delay", "stop", 1740, 1230, 75)
msg("native_stop_fade", "0. 10", 1590, 1230, 85)
msg("stop_msg", "stop", 1460, 1230, 75)
wire("stop_button", 0, "stop_trigger")
wire("stop_trigger", 2, "test_stop_delay")
wire("test_stop_delay", 0, "test_delay")
wire("stop_trigger", 1, "native_stop_fade")
wire("native_stop_fade", 0, "test_envelope")
wire("native_stop_fade", 0, "run_gate")
wire("stop_trigger", 0, "stop_msg")
wire("stop_msg", 0, "controller")

# Test and rendered audio share the monitor, meters, and physical output device.
for side, channel, x in [("L", 0, 24), ("R", 1, 260)]:
    obj("gate_" + side, "*~", x, 1900, 55, ins=2, types=["signal"])
    obj("listen_sum_" + side, "+~", x, 1970, 55, ins=2, types=["signal"])
    obj("monitor_" + side, "*~", x, 2070, 55, ins=2, types=["signal"])
    wire("groove", channel, "gate_" + side)
    wire("amplitude_gate", 0, "gate_" + side, 1)
    wire("gate_" + side, 0, "listen_sum_" + side)
    wire("test_product", 0, "listen_sum_" + side, 1)
    wire("listen_sum_" + side, 0, "monitor_" + side)
    wire("monitor_gain", 0, "monitor_" + side, 1)
    wire("monitor_" + side, 0, "meter_" + side)
    wire("monitor_" + side, 0, "audio_driver", channel)

box("backend_note", "comment", [24, 2270, 1100, 86],
    "Native audio: rendered stereo buffer -> groove~ -> edge fades + one-shot mask -> monitor -> dac~.\n"
    "The test tone bypasses rendering and playback gates. STOP always fades both paths.\n"
    "Original APG: Joo Won Park / joowonpark.net/apg. Max adaptation with output waveform and loop selection.",
    ins=1, outs=0, bgcolor=WHITE)

# Validate references and port indices, and assign explicit order to fan-out cords.
seen = set()
fanouts = {}
for entry in patch["lines"]:
    line = entry["patchline"]
    src, outlet = line["source"]
    dst, inlet = line["destination"]
    assert src in boxes and dst in boxes, line
    assert 0 <= outlet < boxes[src]["numoutlets"], line
    assert 0 <= inlet < boxes[dst]["numinlets"], line
    key = (src, outlet, dst, inlet)
    assert key not in seen, key
    seen.add(key)
    fanouts.setdefault((src, outlet), []).append(line)
for lines in fanouts.values():
    if len(lines) > 1:
        for order, line in enumerate(lines):
            line["order"] = order

names = [b["varname"] for b in boxes.values() if "varname" in b]
assert len(names) == len(set(names)), "Duplicate scripting names"
for b in boxes.values():
    if b.get("presentation"):
        x, y, width, height = b["presentation_rect"]
        assert x >= 0 and y >= 0 and x + width <= WIDTH and y + height <= HEIGHT, b["id"]
        assert b.get("fontsize", 17.0) >= 17.0, b["id"]

visible = [b for b in boxes.values() if b.get("presentation")]
for i, a in enumerate(visible):
    ax, ay, aw, ah = a["presentation_rect"]
    for b in visible[i + 1:]:
        bx, by, bw, bh = b["presentation_rect"]
        assert not (ax < bx + bw and bx < ax + aw and ay < by + bh and by < ay + ah), (a["id"], b["id"])

patch["dependency_cache"] = [
    {"name": "apg_wave.js", "type": "TEXT", "implicit": 1},
]
target = OUT / "APG_Wave.maxpat"
target.write_text(json.dumps({"patcher": patch}, indent=2) + "\n")
print(f"Built {target}: {len(boxes)} boxes, {len(patch['lines'])} patch cords.")

parts = ["apg_wave_plan.js", "apg_render.js", "apg_wave_controller.js"]
source = Path(__file__).resolve().parent
(OUT / "apg_wave.js").write_text("\n\n".join((source / name).read_text() for name in parts) + "\n")
print("Rebuilt the combined JavaScript runtime.")
