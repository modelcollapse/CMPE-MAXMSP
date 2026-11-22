"""Build the shared CMPE Variety Pack UI and native audio graph.

The APG transport is cloned unchanged except for the combined live-audio feed.
If every source module exists, also rebuild the combined legacy-js runtime.
The DSP voice builders and controller modules are maintained separately.
"""

from pathlib import Path
import copy
import json


ROOT = Path(__file__).resolve().parent.parent
SOURCE = ROOT / "APG_Wave.maxpat"
TARGET = ROOT / "CMPE_Variety_Pack.maxpat"
WIDTH, HEIGHT = 1100, 900


def rgba(hex_color, alpha=1.0):
    return [int(hex_color[index:index + 2], 16) / 255.0
            for index in (1, 3, 5)] + [alpha]


# Neutral surfaces keep the blue current action and dark LOAD buttons distinct.
BLACK = rgba("#17202B")
WHITE = rgba("#FFFFFF")
CANVAS = rgba("#EFF1F4")
LIGHT = rgba("#E0E5EB")
BORDER = rgba("#7B8694")
MUTED = rgba("#465365")
BLUE = rgba("#174FCB")
CHARCOAL = rgba("#263140")
ROSE = rgba("#A82132")
ROSE_TINT = rgba("#FFF1F2")
MODE_COLORS = [BLUE, rgba("#006B64"), rgba("#6C3BAA"),
               rgba("#8A4B14"), rgba("#A32E58")]
ALL_MODES = set(range(5))

patch = copy.deepcopy(json.loads(SOURCE.read_text())["patcher"])
patch["rect"] = [80, 80, WIDTH, HEIGHT]
patch["title"] = "CMPE Variety Pack 1.3.0 / APG · ISJS · Many · RMHS · SIOE"
patch["openinpresentation"] = 1
patch["bgcolor"] = CANVAS
patch["bglockedcolor"] = CANVAS
boxes = {item["box"]["id"]: item["box"] for item in patch["boxes"]}
visibility = {id: set(ALL_MODES) for id, box in boxes.items() if box.get("presentation")}

# Apply the collection palette only to cloned presentation objects. The
# standalone APG patch and all audio connections remain their original files.
for b in boxes.values():
    if not b.get("presentation"):
        continue
    b["textcolor"] = BLACK
    if b["maxclass"] == "comment":
        b["bgcolor"] = CANVAS
    elif b["maxclass"] == "textbutton":
        b.update(bgcolor=LIGHT, bgoncolor=BORDER, textcolor=BLACK,
                 textoncolor=BLACK, textovercolor=BLACK, rounded=6)
    elif b["maxclass"] in ("number", "flonum"):
        b.update(bgcolor=WHITE, bgoncolor=LIGHT, hbgcolor=BLUE,
                 htextcolor=WHITE, tricolor=BLACK)


def position(id, rect, modes=None, text=None, named=True, **attrs):
    b = boxes[id]
    b["patching_rect"] = list(rect)
    b["presentation_rect"] = list(rect)
    b["presentation"] = 1
    if named:
        b["varname"] = id
    if text is not None:
        b["text"] = text
    if modes is not None:
        visibility[id] = set(modes)
        b["hidden"] = 0 if 0 in modes else 1
    b.update(attrs)
    return b


def add(id, cls, rect, text=None, ins=1, outs=1, types=None,
        present=False, named=True, modes=None, **attrs):
    assert id not in boxes, id
    b = {"id": id, "maxclass": cls, "numinlets": ins, "numoutlets": outs,
         "patching_rect": list(rect), "fontname": "Arial", "fontsize": 17.0,
         "textcolor": BLACK}
    if text is not None:
        b["text"] = text
    if types is not None:
        b["outlettype"] = types
    if named:
        b["varname"] = id
    if present:
        b["presentation"] = 1
        b["presentation_rect"] = list(rect)
        visibility[id] = set(ALL_MODES if modes is None else modes)
        b["hidden"] = 0 if 0 in visibility[id] else 1
    b.update(attrs)
    boxes[id] = b
    patch["boxes"].append({"box": b})
    return b


def obj(id, text, x, y, width=180, ins=1, outs=1, types=None, **attrs):
    return add(id, "newobj", [x, y, width, 24], text,
               ins, outs, types, **attrs)


def msg(id, text, x, y, width=180):
    return add(id, "message", [x, y, width, 24], text,
               2, 1, [""], bgcolor=WHITE)


def comment(id, text, rect, modes=None, size=17, **attrs):
    attrs.setdefault("bgcolor", CANVAS)
    return add(id, "comment", rect, text, 1, 0, present=True,
               modes=modes, fontsize=float(size), **attrs)


def button(id, text, rect, modes=None, selected=False, size=17, **attrs):
    return add(id, "textbutton", rect, text, 1, 3, ["", "", "int"],
               present=True, modes=modes, fontsize=float(size), mode=0,
               outputmode=1, usegradient=0, rounded=10,
               bgcolor=BLUE if selected else LIGHT,
               bgoncolor=BLUE if selected else BORDER,
               textcolor=WHITE if selected else BLACK,
               textoncolor=WHITE if selected else BLACK,
               textovercolor=WHITE if selected else BLACK,
               parameter_enable=0, **attrs)


def wire(src, outlet, dst, inlet=0):
    patch["lines"].append({"patchline": {
        "source": [src, outlet], "destination": [dst, inlet]}})


def remove_wire(src, outlet, dst, inlet):
    match = [src, outlet], [dst, inlet]
    before = len(patch["lines"])
    patch["lines"] = [e for e in patch["lines"] if
                      (e["patchline"]["source"], e["patchline"]["destination"]) != match]
    assert len(patch["lines"]) == before - 1, match


def hide_original(id):
    boxes[id]["presentation"] = 0
    boxes[id]["hidden"] = 1
    visibility.pop(id, None)


# Header and a persistent audio-device strip. Native driver and option menus
# receive their labels and items from Max, never from a hardcoded device list.
position("title", [24, 12, 470, 38], text="CMPE Variety Pack 1.1.0", fontsize=30.0)
hide_original("subtitle")
position("demo_button", [512, 16, 88, 30], fontsize=16.0)
position("test_audio", [608, 16, 120, 30], fontsize=16.0)
button("save_preset", "SAVE SET", [736, 16, 96, 30], size=16)
button("load_preset", "LOAD SET", [840, 16, 96, 30], size=16)
comment("audio_status", "Reading Max audio settings...", [24, 54, 470, 24],
        size=16, textcolor=MUTED)
button("audio_setup", "AUDIO SETUP", [512, 52, 136, 30], size=16,
       hint="Open Max's native Audio Status or Audio Settings window.")
button("audio_refresh", "REFRESH", [656, 52, 104, 30], size=16,
       hint="Read the current audio driver and available devices from Max.")
button("audio_power", "AUDIO OFF", [768, 52, 168, 30], size=16,
       hint="Turn Max audio on or off. This setting affects all Max patches.")
add("audio_panel", "panel", [14, 86, 932, 68], ins=1, outs=0,
    present=True, bgcolor=LIGHT, border=0, rounded=6,
    background=1, ignoreclick=1)
for key, text, x, width in [
    ("driver", "Audio driver", 24, 216),
    ("option1", "Driver option 1", 252, 324),
    ("option2", "Driver option 2", 588, 348),
]:
    comment("audio_" + key + "_label", text, [x, 90, width, 20],
            size=16, textcolor=MUTED, bgcolor=LIGHT)
    add("audio_" + key + "_menu", "umenu", [x, 114, width, 30],
        ins=1, outs=3, types=["int", "", ""], present=True,
        bgcolor=WHITE, textcolor=BLACK, fontsize=16.0,
        items=["Waiting for Max..."], parameter_enable=0)

hide_original("header_rule")
hide_original("output_rule")
hide_original("meter_label")
position("credit_rule", [24, 800, 912, 1], bgcolor=BORDER)

for i, name in enumerate(["APG", "ISJS", "Many", "RMHS", "SIOE"]):
    button("mode" + str(i), name, [24 + i * 184, 164, 176, 36],
           selected=i == 0, size=21,
           hint="Choose the " + name + " instrument.")
    msg("mode_msg" + str(i), "mode " + str(i), 1460 + i * 145, 1390, 130)
    wire("mode" + str(i), 0, "mode_msg" + str(i))
    wire("mode_msg" + str(i), 0, "controller")
comment("mode_info", "APG / Audio Palindrome Generator", [24, 208, 912, 24],
        textcolor=MUTED)

# Three common audio slots. RMHS uses its own synthesis instead.
for i, x in enumerate([24, 336, 648], 1):
    source_modes = {0, 1, 2, 4} if i == 1 else {0, 1}
    position("source_label" + str(i), [x, 246, 154, 24], modes=source_modes,
             textcolor=BLACK)
    position("load" + str(i), [x + 184, 240, 104, 32], modes=source_modes,
             bgcolor=CHARCOAL, bgoncolor=rgba("#103A9A"), textcolor=WHITE,
             textoncolor=WHITE, textovercolor=rgba("#BFDBFE"),
             active=1, usebgoncolor=1, usetextovercolor=1, fontface=1)
    position("file" + str(i), [x, 278, 288, 40], modes=source_modes,
             fontsize=16.0)
comment("no_samples", "RMHS creates its own sound. No samples are needed.",
        [24, 256, 912, 48], modes={3}, size=18, linecount=2, textcolor=MUTED)

# Paired controls beneath each sample keep rate/level relationships readable.
# One row recovers vertical space for the always-visible audio-device strip.
for i in range(6):
    x = [24, 336, 648][i % 3] + (150 if i >= 3 else 0)
    modes = {1, 2, 3, 4} if i < 5 else {1}
    comment("param_label" + str(i), "Parameter " + str(i + 1),
            [x, 324, 138, 22], modes=modes, size=16, textcolor=MUTED)
    add("param" + str(i), "flonum", [x, 350, 138, 30],
        ins=1, outs=2, types=["", "bang"], present=True, modes=modes,
        fontsize=20.0, bgcolor=WHITE, bgoncolor=LIGHT,
        hbgcolor=BLUE, htextcolor=WHITE,
        tricolor=BLACK, triangle=0, format=6, parameter_enable=0)
    obj("param_msg" + str(i), "prepend param " + str(i),
        1460 + (i % 3) * 230, 1450 + (i // 3) * 40, 215)
    wire("param" + str(i), 0, "param_msg" + str(i))
    wire("param_msg" + str(i), 0, "controller")

for i, x in enumerate([24, 336, 648], 1):
    position("repeat_label" + str(i), [x, 324, 138, 22],
             modes={0}, text="Sample " + str(i) + " repeats",
             fontsize=16.0, textcolor=MUTED)
    position("repeat" + str(i), [x, 350, 138, 30], modes={0})
position("pitch_label", [174, 324, 138, 22], modes={0},
         text="Pitch range (all)", fontsize=16.0, textcolor=MUTED)
position("pitch", [174, 350, 138, 30], modes={0})

comment("menu_label", "Pitch set", [798, 324, 138, 22], modes={2, 4},
        size=16, textcolor=MUTED)
add("mode_menu", "umenu", [798, 350, 138, 30],
    ins=1, outs=3, types=["int", "", ""], present=True, modes={2, 4},
    bgcolor=WHITE, textcolor=BLACK, fontsize=16.0,
    items=["Major", ",", "Minor", ",", "Pentatonic", ",", "Atonal", ",", "Microtonal"],
    parameter_enable=0)
obj("choice_msg", "prepend choice", 1460, 1540, 205)
wire("mode_menu", 0, "choice_msg")
wire("choice_msg", 0, "controller")

# One output region. Finite modes draw a stored waveform; live modes draw scopes;
# ISJS displays its pointer surface and a compact stereo phase scope.
position("output_label", [24, 394, 220, 24], text="OUTPUT")
position("duration", [260, 394, 260, 24], fontsize=16.0, textcolor=MUTED)
position("monitor_label", [592, 394, 116, 24], text="Volume (dB)",
         fontsize=16.0, textcolor=MUTED)
position("monitor_level", [712, 390, 96, 30])
for side, y in [("L", 390), ("R", 408)]:
    position("meter_" + side, [832, y, 104, 12], bgcolor=LIGHT,
             offcolor=BORDER, oncolor=BLUE)
for side, y in [("l", 430), ("r", 504)]:
    accent = BLUE if side == "l" else CHARCOAL
    position("channel_" + side, [24, y + 20, 28, 25], modes={0, 2, 3, 4})
    position("wave_" + side, [56, y, 880, 66], modes={0, 4},
             bgcolor=WHITE, waveformcolor=accent, gridcolor=LIGHT,
             selectioncolor=rgba("#174FCB", 0.18))
    add("scope_" + side, "scope~", [56, y, 880, 66],
        ins=2, outs=0, present=True, modes={2, 3},
        bgcolor=WHITE, fgcolor=accent,
        gridcolor=LIGHT, calccount=128, bufsize=256,
        range=[-1.0, 1.0], delay=50, trigger=0)
add("xy_pad", "jsui", [56, 430, 600, 140],
    ins=1, outs=1, types=[""], present=True, modes={1},
    filename="cmpe_xy.js", jsarguments=[], border=1,
    parameter_enable=0, bgcolor=WHITE)
add("scope_xy", "scope~", [672, 430, 264, 140],
    ins=2, outs=0, present=True, modes={1},
    bgcolor=WHITE, fgcolor=BLUE,
    gridcolor=LIGHT, calccount=64, bufsize=256,
    range=[-1.0, 1.0], delay=50, trigger=0)
wire("xy_pad", 0, "controller")

position("selection_info", [24, 578, 660, 24], fontsize=16.0, textcolor=MUTED)
position("time", [704, 578, 232, 24], fontsize=16.0, textcolor=MUTED)
position("loop_toggle", [24, 616, 24, 24], modes={0, 4},
         bgcolor=WHITE, checkedcolor=BLUE, uncheckedcolor=MUTED)
position("loop_label", [60, 614, 320, 28], modes={0, 4})
position("clear_button", [520, 610, 194, 34], modes={0, 4})
position("save_button", [730, 610, 206, 34], modes={0, 4})
button("record_button", "RECORD WAV", [730, 610, 206, 34], modes={1, 2, 3},
       hint="Record the current live instrument to a stereo WAV file.")
msg("recordtoggle_msg", "recordtoggle", 1460, 1600, 150)
wire("record_button", 0, "recordtoggle_msg")
wire("recordtoggle_msg", 0, "controller")

position("play_button", [24, 654, 448, 48],
         bgcolor=BLUE, bgoncolor=rgba("#103A9A"),
         textcolor=WHITE, textoncolor=WHITE, textovercolor=WHITE,
         hint="Start the selected instrument or play its rendered result.")
position("stop_button", [488, 654, 216, 48],
         bgcolor=ROSE_TINT, bgoncolor=rgba("#F4C6CC"),
         textcolor=ROSE, textoncolor=ROSE, textovercolor=ROSE,
         hint="Stop audio or cancel preparation.")
position("new_button", [720, 654, 216, 48],
         hint="Start a fresh result for the selected instrument.")
position("record_button", [730, 610, 206, 34],
         bgcolor=ROSE_TINT, bgoncolor=rgba("#F4C6CC"),
         textcolor=ROSE, textoncolor=ROSE, textovercolor=ROSE)
position("progress", [24, 712, 912, 6], bgcolor=LIGHT, elementcolor=LIGHT, knobcolor=BLUE)
position("render_info", [24, 724, 912, 24], fontsize=16.0, textcolor=MUTED)
position("status", [24, 752, 912, 38], fontsize=16.0)
position("original_credit", [24, 810, 620, 24], text="Original CMPE by Joo Won Park",
         fontsize=16.0, textcolor=MUTED)
position("original_link", [668, 806, 268, 32], text="joowonpark.net/cmpe",
         fontsize=16.0, textcolor=BLUE, textoncolor=BLUE, textovercolor=BLUE,
         hint="Open Joo Won Park's original Computer Music Practice Examples.")
boxes["original_url"]["text"] = "; max launchbrowser https://joowonpark.net/cmpe/"
boxes["controller"]["text"] = "js cmpe_variety.js"

# The presentation layout is independent of the native audio graph below.
# Keep the full collection visible in one window, with sources, the output,
# transport, and actual engine feedback in distinct visual groups.
layout = {
    "title": [20, 10, 580, 36],
    "demo_button": [620, 12, 90, 32],
    "test_audio": [718, 12, 126, 32],
    "save_preset": [852, 12, 110, 32],
    "load_preset": [970, 12, 110, 32],
    "audio_panel": [20, 48, 1060, 58],
    "audio_driver_label": [32, 50, 182, 20],
    "audio_driver_menu": [32, 72, 182, 28],
    "audio_option1_label": [226, 50, 242, 20],
    "audio_option1_menu": [226, 72, 242, 28],
    "audio_option2_label": [480, 50, 242, 20],
    "audio_option2_menu": [480, 72, 242, 28],
    "audio_status": [736, 50, 332, 20],
    "audio_setup": [736, 72, 124, 28],
    "audio_refresh": [868, 72, 92, 28],
    "audio_power": [968, 72, 100, 28],
    "mode_info": [24, 146, 1052, 20],
    "no_samples": [32, 254, 1036, 40],
    "output_label": [32, 386, 204, 24],
    "duration": [244, 386, 210, 24],
    "monitor_label": [752, 386, 116, 24],
    "monitor_level": [872, 384, 80, 28],
    "meter_L": [980, 386, 88, 11],
    "meter_R": [980, 401, 88, 11],
    "channel_l": [32, 480, 20, 24],
    "channel_r": [32, 634, 20, 24],
    "wave_l": [56, 420, 1012, 144],
    "wave_r": [56, 574, 1012, 144],
    "scope_l": [56, 420, 1012, 144],
    "scope_r": [56, 574, 1012, 144],
    "xy_pad": [56, 420, 684, 298],
    "scope_xy": [756, 420, 312, 298],
    "selection_info": [32, 726, 580, 22],
    "time": [856, 726, 212, 22],
    "loop_toggle": [632, 726, 22, 22],
    "loop_label": [664, 724, 180, 28],
    "clear_button": [720, 760, 172, 42],
    "save_button": [904, 760, 176, 42],
    "record_button": [720, 760, 360, 42],
    "play_button": [20, 760, 328, 42],
    "stop_button": [360, 760, 148, 42],
    "new_button": [520, 760, 188, 42],
    "render_info": [276, 812, 792, 20],
    "status": [276, 834, 792, 36],
    "progress": [32, 852, 228, 10],
    "credit_rule": [20, 874, 1060, 1],
    "original_credit": [24, 876, 680, 20],
    "original_link": [812, 876, 268, 20],
}
for id, rect in layout.items():
    position(id, rect)
position("title", layout["title"], text="CMPE / Variety Pack", fontsize=30.0, fontface=1)
for i in range(5):
    position("mode" + str(i), [20 + i * 215, 112, 200, 32], fontsize=20.0)

for i, x in enumerate([20, 378, 736], 1):
    source_modes = {0, 1, 2, 4} if i == 1 else {0, 1}
    add("source_card" + str(i), "panel", [x, 170, 344, 200],
        ins=1, outs=0, present=True, bgcolor=WHITE,
        border=1, bordercolor=BORDER, rounded=10, background=1, ignoreclick=1)
    add("source_accent" + str(i), "panel", [x + 1, 171, 342, 4],
        ins=1, outs=0, present=True, bgcolor=BLUE,
        border=0, rounded=0, background=1, ignoreclick=1)
    position("source_label" + str(i), [x + 12, 178, 112, 22],
             fontsize=16.0, fontface=1)
    comment("source_state" + str(i), "EMPTY", [x + 130, 180, 100, 20],
            size=16, textcolor=MUTED, modes=source_modes)
    comment("input_state" + str(i), "", [x + 240, 180, 92, 20],
            size=16, textcolor=ROSE, modes=source_modes)
    position("file" + str(i), [x + 12, 202, 320, 36], fontsize=16.0)
    position("load" + str(i), [x + 12, 242, 104, 30], fontsize=16.0)
    button("source_record" + str(i), "REC IN", [x + 124, 242, 104, 30],
           modes=source_modes, size=16, fontface=1,
           hint="Record the selected audio input into sample " + str(i) + ". Click again or press STOP to finish.")
    position("source_record" + str(i), [x + 124, 242, 104, 30],
             bgcolor=ROSE_TINT, bgoncolor=rgba("#F4C6CC"),
             textcolor=ROSE, textoncolor=ROSE, textovercolor=ROSE)
    button("source_save" + str(i), "SAVE", [x + 236, 242, 96, 30],
           modes=source_modes, size=16,
           hint="Save recorded input from sample " + str(i) + " to a WAV file. Available after recording.")
    add("source_wave" + str(i), "waveform~", [x + 12, 276, 320, 28],
        ins=5, outs=6, types=["float", "float", "float", "float", "list", "list"],
        present=True, modes=source_modes, buffername="apgw_source_init" + str(i),
        chanoffset=1, allowdrag=0, setmode=0, labels=0, quiet=1, ignoreclick=1,
        bgcolor=BLACK, waveformcolor=rgba("#78B7FF"), gridcolor=MUTED,
        bordercolor=BLACK, vzoom=1.0, voffset=0.0,
        hint="Preview of sample " + str(i) + ". Recorded input appears here after recording finishes.")
    position("repeat_label" + str(i), [x + 12, 308, 152, 20], fontsize=16.0)
    position("repeat" + str(i), [x + 52, 332, 72, 34], fontsize=24.0)
    button("repeat_down" + str(i), "−", [x + 12, 332, 34, 34],
           modes={0}, size=22, hint="Decrease sample " + str(i) + " repeats by one.")
    button("repeat_up" + str(i), "+", [x + 130, 332, 34, 34],
           modes={0}, size=22, hint="Increase sample " + str(i) + " repeats by one.")
    group_modes = {3} if i == 1 else {2, 3, 4}
    comment("group_label" + str(i), "", [x + 12, 178, 320, 22],
            modes=group_modes, size=16, fontface=1, textcolor=MUTED)
    comment("group_help" + str(i), "", [x + 12, 202, 320, 36],
            modes=group_modes, size=16, textcolor=MUTED)
hide_original("no_samples")
for i in range(6):
    x = [32, 390, 748][i % 3] + (168 if i >= 3 else 0)
    position("param_label" + str(i), [x, 308, 152, 20], fontsize=16.0)
    position("param" + str(i), [x, 332, 152, 34], fontsize=20.0)
position("pitch_label", [200, 308, 152, 20], fontsize=16.0)
position("pitch", [240, 332, 72, 34], fontsize=24.0)
button("pitch_down", "−", [200, 332, 34, 34], modes={0}, size=22,
       hint="Decrease the pitch range for all samples by 0.1.")
button("pitch_up", "+", [318, 332, 34, 34], modes={0}, size=22,
       hint="Increase the pitch range for all samples by 0.1.")
position("menu_label", [916, 308, 152, 20], fontsize=16.0)
position("mode_menu", [916, 332, 152, 34], fontsize=16.0)

add("output_panel", "panel", [20, 378, 1060, 374], ins=1, outs=0,
    present=True, bgcolor=WHITE, border=1, bordercolor=BORDER,
    rounded=10, background=1, ignoreclick=1)
add("feedback_panel", "panel", [20, 808, 1060, 64], ins=1, outs=0,
    present=True, bgcolor=WHITE, border=1, bordercolor=BORDER, rounded=10,
    background=1, ignoreclick=1)
button("state_badge", "LOADING", [32, 816, 228, 28], size=16,
       ignoreclick=1, fontface=1)
comment("wave_scale", "Wave view 1x", [468, 386, 272, 24], size=16,
        textcolor=MUTED, hint="The waveform is enlarged for visibility only. Audio playback and export levels do not change.")

# Display chrome is intentionally quieter than the current action. Native
# widgets remain standard Max controls; text remains at least 16 points.
for b in boxes.values():
    if not b.get("presentation"):
        continue
    if b["maxclass"] == "comment":
        b["bgcolor"] = [0, 0, 0, 0]
    if b["maxclass"] == "textbutton":
        b.update(rounded=10, usegradient=0,
                 usebgoncolor=1, usetextovercolor=1)
        b.pop("border", None)
        b.pop("bordercolor", None)
        b.setdefault("fontface", 0)
    if b["maxclass"] in ("number", "flonum", "umenu"):
        b.update(bgcolor=WHITE, bordercolor=BORDER)
position("play_button", layout["play_button"], fontsize=22.0, fontface=1)
position("stop_button", layout["stop_button"], fontsize=20.0)
position("new_button", layout["new_button"], fontsize=20.0)
position("original_credit", layout["original_credit"],
         text="Original CMPE by Joo Won Park", fontsize=16.0)
position("original_link", layout["original_link"], bgcolor=CANVAS,
         bgoncolor=LIGHT, fontsize=16.0)
for id in ("audio_setup", "audio_refresh", "audio_power"):
    position(id, layout[id], bgcolor=CHARCOAL, bgoncolor=BLACK,
             textcolor=WHITE, textoncolor=WHITE,
             textovercolor=rgba("#BFDBFE"))
for side in ("l", "r"):
    position("wave_" + side, layout["wave_" + side],
             bgcolor=BLACK, gridcolor=rgba("#465365"),
             waveformcolor=rgba("#78B7FF" if side == "l" else "#D6E6FA"),
             bordercolor=BLACK, linecolor=WHITE,
             selectioncolor=rgba("#FFFFFF", 0.18))
    position("scope_" + side, layout["scope_" + side],
             bgcolor=BLACK, gridcolor=rgba("#465365"),
             fgcolor=rgba("#78B7FF" if side == "l" else "#D6E6FA"))
position("scope_xy", layout["scope_xy"], bgcolor=BLACK,
         fgcolor=rgba("#78B7FF"), gridcolor=rgba("#465365"))

# panel and umenu use bgfillcolor, not the bgcolor attribute of textbutton and
# number. Max serializes a solid fill in a style dictionary. This follows the
# format in Cycling74/n4m-core-examples/02-message-handlers/message-handlers.maxpat.
# Runtime changes use the documented bgfillcolor message with four RGBA floats.
fill_styles = {}
for b in boxes.values():
    if not b.get("presentation") or b["maxclass"] not in ("panel", "umenu"):
        continue
    fill = b.pop("bgcolor", WHITE)
    name = "CMPE_Solid_" + "_".join(str(round(c * 255)) for c in fill)
    b["style"] = name
    if b["maxclass"] == "umenu":
        b["applycolors"] = 1
        b.pop("bordercolor", None)
    fill_styles[name] = {"name": name, "default": {"bgfillcolor": {
        "type": "color", "color": fill, "color1": fill, "color2": fill,
        "angle": 270.0, "proportion": 0.5, "autogradient": 0.0,
    }}, "parentstyle": "", "multi": 0}
patch["styles"] = [s for s in patch.get("styles", [])
                   if s.get("name") not in fill_styles] + list(fill_styles.values())

# Audio controls only request changes through the controller. The controller
# stops voices/recording and fades before applying global device changes.
# Native driver option IDs are zero-based; option1/option2 remain UI identifiers.
# adstatus.maxhelp's "driver options" example explicitly starts at 0. Cycling
# '74's tutorial copies that help example and uses `adstatus option 0`:
# https://cycling74.com/articles/max-8-guitar-processor-part-1
for key, native, x in [
    ("driver", "adstatus driver", 1460),
    ("option1", "adstatus option 0", 1760),
    ("option2", "adstatus option 1", 2060),
]:
    obj("audio_ad_" + key, native, x, 2300, 235,
        ins=2, outs=2, types=["", "int"])
    obj("audio_menu_" + key, "prepend audiomenu " + key, x, 2340, 235)
    obj("audio_value_" + key, "prepend audiovalue " + key, x, 2380, 235)
    obj("audio_choose_" + key, "prepend audiochoose " + key, x, 2420, 235)
    # Native clear/append/set messages populate the visible menu directly.
    # The controller observes the same stream for guarded user changes; it
    # must not reconstruct the visible list while native items are arriving.
    wire("audio_ad_" + key, 0, "audio_" + key + "_menu")
    wire("audio_ad_" + key, 0, "audio_menu_" + key)
    wire("audio_ad_" + key, 1, "audio_value_" + key)
    wire("audio_menu_" + key, 0, "controller")
    wire("audio_value_" + key, 0, "controller")
    wire("audio_" + key + "_menu", 0, "audio_choose_" + key)
    wire("audio_choose_" + key, 0, "controller")
for i, x in [(1, 1760), (2, 2060)]:
    obj("audio_name_option" + str(i), "adstatus optionname " + str(i - 1),
        x, 2480, 235, ins=2, outs=2, types=["", ""])
    obj("audio_name_msg" + str(i), "prepend audioname " + str(i), x, 2520, 235)
    wire("audio_name_option" + str(i), 0, "audio_name_msg" + str(i))
    wire("audio_name_msg" + str(i), 0, "controller")
obj("audio_ad_switch", "adstatus switch", 1460, 2480, 235,
    ins=2, outs=2, types=["", "int"])
obj("audio_switch_msg", "prepend audioswitch", 1460, 2520, 235)
wire("audio_ad_switch", 1, "audio_switch_msg")
wire("audio_switch_msg", 0, "controller")
msg("audio_setup_native", "; dsp open", 1460, 2570, 235)
boxes["test_stop_delay"]["varname"] = "audio_test_stop"
for key, selector, x in [("setup", "audiosetup", 1460),
                          ("refresh", "audiorefresh", 1760),
                          ("power", "audiopower", 2060)]:
    msg("audio_" + key + "_msg", selector, x, 2620, 235)
    wire("audio_" + key, 0, "audio_" + key + "_msg")
    wire("audio_" + key + "_msg", 0, "controller")

# Direct input capture is separate from recording a live instrument to disk.
# Four small initial banks allow one staging take while all three source slots
# retain their current recordings. The controller allocates only on REC IN and
# adopts a verified, stopped bank; an interrupted take never overwrites a source.
# record~'s two rightmost inlets are start/end, after its two signal inlets.
# https://docs.cycling74.com/reference/record~/
obj("input_adc", "adc~ 1 2", 1460, 2740, 180,
    ins=1, outs=2, types=["signal", "signal"])
obj("input_recorder", "record~ #0_input_bank0 2 @loop 0 @append 0", 1460, 2790, 440,
    ins=4, outs=1, types=["signal"])
wire("input_adc", 0, "input_recorder", 0)
wire("input_adc", 1, "input_recorder", 1)
obj("input_position_peak", "peakamp~ 0", 1460, 2840, 180,
    ins=2, outs=1, types=["float"])
obj("input_position_tag", "prepend inputposition 0 0", 1460, 2880, 270)
obj("input_progress", "snapshot~ 50", 1760, 2840, 180,
    ins=2, outs=1, types=["float"])
obj("input_progress_tag", "prepend inputprogress 0", 1760, 2880, 270)
wire("input_recorder", 0, "input_position_peak")
wire("input_recorder", 0, "input_progress")
wire("input_position_peak", 0, "input_position_tag")
wire("input_position_tag", 0, "controller")
wire("input_progress", 0, "input_progress_tag")
wire("input_progress_tag", 0, "controller")
for bank in range(4):
    x = 1460 + bank * 280
    obj("input_bank" + str(bank), "buffer~ #0_input_bank" + str(bank) + " 1 2",
        x, 2940, 265, ins=1, outs=2, types=["float", "bang"])
    obj("input_bank_done" + str(bank), "prepend inputbankdone " + str(bank),
        x, 2980, 265)
    wire("input_bank" + str(bank), 1, "input_bank_done" + str(bank))
    wire("input_bank_done" + str(bank), 0, "controller")
for slot in range(3):
    x = 1460 + slot * 280
    for action, selector, y in [("record", "inputrecord", 3040),
                                ("save", "inputsave", 3080)]:
        name = "source_" + action + str(slot + 1)
        msg(name + "_msg", selector + " " + str(slot), x, y, 265)
        wire(name, 0, name + "_msg")
        wire(name + "_msg", 0, "controller")
    for direction, value, y in [("down", -1, 3140), ("up", 1, 3180)]:
        name = "repeat_" + direction + str(slot + 1)
        msg(name + "_msg", "repeatstep " + str(slot) + " " + str(value), x, y, 265)
        wire(name, 0, name + "_msg")
        wire(name + "_msg", 0, "controller")
for direction, value, y in [("down", "-0.1", 3240), ("up", "0.1", 3280)]:
    name = "pitch_" + direction
    msg(name + "_msg", "pitchstep " + value, 1460, y, 265)
    wire(name, 0, name + "_msg")
    wire(name + "_msg", 0, "controller")

# File operations are requested by the controller so record/preset state can be
# checked before a dialog opens. Only the resulting path returns through a cord.
for id, command, selector, x, y in [
    ("record_dialog", "savedialog WAVE", "recordpath", 1460, 1660),
    ("preset_save_dialog", "savedialog JSON", "presetwrite", 1740, 1660),
    ("preset_load_dialog", "opendialog JSON", "presetread", 2020, 1660),
    ("input_save_dialog", "savedialog WAVE", "inputsavepath", 2300, 1660),
]:
    save_dialog = command.startswith("savedialog ")
    obj(id, command, x, y, 235, outs=3 if save_dialog else 2,
        types=["", "", "bang"] if save_dialog else ["", "bang"])
    obj(id + "_path", "prepend " + selector, x, y + 40, 235)
    wire(id, 0, id + "_path")
    wire(id + "_path", 0, "controller")
msg("input_save_cancel", "inputsavecancel", 2300, 1740, 235)
wire("input_save_dialog", 2, "input_save_cancel")
wire("input_save_cancel", 0, "controller")
# savedialog has path, file type, and cancel outlets; opendialog has only path
# and cancel. Correct the inherited finite-export dialog metadata as well.
# https://docs.cycling74.com/legacy/max8/refpages/savedialog
for b in boxes.values():
    if b.get("maxclass") == "newobj" and b.get("text", "").startswith("savedialog "):
        b.update(numinlets=1, numoutlets=3, outlettype=["", "", "bang"])
for source, selector, x in [("save_preset", "presetsave", 1740),
                            ("load_preset", "presetload", 2020)]:
    msg(source + "_msg", selector, x, 1600, 180)
    wire(source, 0, source + "_msg")
    wire(source + "_msg", 0, "controller")

# Live DSP voices receive messages from the script by scripting name.
for id, name, voices, x in [("grain_engine", "cmpe_sample_voice", 3, 1460),
                           ("many_engine", "cmpe_many_voice", 32, 1780),
                           ("drone_engine", "cmpe_drone_voice", 64, 2100)]:
    obj(id, "poly~ " + name + " " + str(voices), x, 1790, 300,
        ins=1, outs=2, types=["signal", "signal"])
obj("live_gate", "line~ 0.", 2440, 1790, 130,
    ins=2, outs=2, types=["signal", "bang"])
boxes["native_stop_fade"]["varname"] = "live_stop"
wire("native_stop_fade", 0, "live_gate")
obj("recorder", "sfrecord~ 2", 2440, 2110, 170,
    ins=2, outs=1, types=["signal"])
obj("record_snapshot", "snapshot~ 250", 2440, 2160, 180,
    ins=2, outs=1, types=["float"])
obj("record_elapsed_msg", "prepend recordelapsed", 2440, 2200, 235)
wire("recorder", 0, "record_snapshot")
wire("record_snapshot", 0, "record_elapsed_msg")
wire("record_elapsed_msg", 0, "controller")

for side, channel, x in [("L", 0, 1460), ("R", 1, 1780)]:
    obj("live_pair_" + side, "+~", x, 1870, 65, ins=2, types=["signal"])
    obj("live_sum_" + side, "+~", x, 1920, 65, ins=2, types=["signal"])
    obj("live_" + side, "*~", x, 1970, 65, ins=2, types=["signal"])
    obj("program_" + side, "+~", x, 2040, 65, ins=2, types=["signal"])
    wire("grain_engine", channel, "live_pair_" + side)
    wire("many_engine", channel, "live_pair_" + side, 1)
    wire("live_pair_" + side, 0, "live_sum_" + side)
    wire("drone_engine", channel, "live_sum_" + side, 1)
    wire("live_sum_" + side, 0, "live_" + side)
    wire("live_gate", 0, "live_" + side, 1)
    wire("live_" + side, 0, "scope_" + side.lower())
    wire("live_" + side, 0, "scope_xy", channel)
    wire("live_" + side, 0, "recorder", channel)
    # Preserve the existing test-tone branch and monitor gain. The recorder
    # receives gated live output only, before monitor gain and without test tone.
    remove_wire("gate_" + side, 0, "listen_sum_" + side, 0)
    wire("gate_" + side, 0, "program_" + side)
    wire("live_" + side, 0, "program_" + side, 1)
    wire("program_" + side, 0, "listen_sum_" + side)

boxes["backend_note"]["text"] = (
    "Finite audio: rendered stereo buffer -> existing APG transport. Live audio: poly~ voices -> live gate.\n"
    "Both paths enter the common monitor. TEST SOUND remains independent; native STOP fades both paths.\n"
    "Live recording is before monitor volume and excludes TEST SOUND. Original CMPE: Joo Won Park / joowonpark.net/cmpe."
)

# Validate each mode's intended visibility group, including the overlaid controls.
seen, fanouts = set(), {}
for entry in patch["lines"]:
    line = entry["patchline"]
    src, outlet = line["source"]
    dst, inlet = line["destination"]
    assert src in boxes and dst in boxes, line
    assert 0 <= outlet < boxes[src]["numoutlets"], line
    assert 0 <= inlet < boxes[dst]["numinlets"], line
    key = src, outlet, dst, inlet
    assert key not in seen, key
    seen.add(key)
    line.pop("order", None)
    fanouts.setdefault((src, outlet), []).append(line)
for lines in fanouts.values():
    if len(lines) > 1:
        for order, line in enumerate(lines):
            line["order"] = order
names = [b["varname"] for b in boxes.values() if b.get("varname")]
assert len(names) == len(set(names)), "Duplicate scripting names"
for id, modes in visibility.items():
    b = boxes[id]
    x, y, width, height = b["presentation_rect"]
    assert x >= 0 and y >= 0 and x + width <= WIDTH and y + height <= HEIGHT, id
    assert b.get("fontsize", 17) >= 16, id
for mode in range(5):
    visible = [boxes[id] for id, modes in visibility.items()
               if mode in modes and not boxes[id].get("background")]
    for i, a in enumerate(visible):
        ax, ay, aw, ah = a["presentation_rect"]
        for b in visible[i + 1:]:
            bx, by, bw, bh = b["presentation_rect"]
            assert not (ax < bx + bw and bx < ax + aw and ay < by + bh and by < ay + ah), (mode, a["id"], b["id"])

patch["dependency_cache"] = [
    {"name": name, "type": type_, "implicit": 1} for name, type_ in [
        ("cmpe_variety.js", "TEXT"), ("cmpe_xy.js", "TEXT"),
        ("cmpe_sample_voice.maxpat", "JSON"),
        ("cmpe_many_voice.maxpat", "JSON"),
        ("cmpe_drone_voice.maxpat", "JSON"),
    ]
]
TARGET.write_text(json.dumps({"patcher": patch}, indent=2) + "\n")
print(f"Built {TARGET.name}: {len(boxes)} objects, {len(patch['lines'])} connections.")

SOURCES = ["apg_wave_plan.js", "apg_render.js", "cmpe_model.js",
           "apg_wave_controller.js", "cmpe_extension.js", "cmpe_audio_settings.js",
           "cmpe_ui_feedback.js", "cmpe_input_recording.js"]
source_paths = [ROOT / "developer" / name for name in SOURCES]
if all(path.is_file() for path in source_paths):
    (ROOT / "cmpe_variety.js").write_text("\n\n".join(path.read_text().rstrip() for path in source_paths) + "\n")
    print("Bundled cmpe_variety.js from the eight source modules.")
else:
    missing = [path.name for path in source_paths if not path.is_file()]
    print("Runtime sources not all present; bundling deferred: " + ", ".join(missing))
