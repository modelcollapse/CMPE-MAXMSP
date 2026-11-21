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
WIDTH, HEIGHT = 960, 844


def rgba(hex_color, alpha=1.0):
    return [int(hex_color[index:index + 2], 16) / 255.0
            for index in (1, 3, 5)] + [alpha]


BLACK = rgba("#1B2936")
WHITE = rgba("#FFFFFF")
CANVAS = rgba("#F3F6F8")
LIGHT = rgba("#E5ECF0")
BORDER = rgba("#CBD5DD")
MUTED = rgba("#526775")
TEAL = rgba("#087F83")
BLUE = rgba("#315FA6")
VIOLET = rgba("#7257A6")
ROSE = rgba("#8B3338")
ROSE_TINT = rgba("#F5E6E5")
MODE_COLORS = [TEAL, BLUE, VIOLET, rgba("#995E32"), rgba("#986B19")]
ALL_MODES = set(range(5))

patch = copy.deepcopy(json.loads(SOURCE.read_text())["patcher"])
patch["rect"] = [80, 80, WIDTH, HEIGHT]
patch["title"] = "CMPE Variety Pack 1.1.0 / APG · ISJS · Many · RMHS · SIOE"
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
        b.update(bgcolor=WHITE, bgoncolor=LIGHT, hbgcolor=TEAL,
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
               outputmode=1, usegradient=0, rounded=6,
               bgcolor=TEAL if selected else LIGHT,
               bgoncolor=TEAL if selected else BORDER,
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
    present=True, bgcolor=rgba("#E8EFF3"), border=0, rounded=6,
    background=1, ignoreclick=1)
for key, text, x, width in [
    ("driver", "Audio driver", 24, 216),
    ("option1", "Driver option 1", 252, 324),
    ("option2", "Driver option 2", 588, 348),
]:
    comment("audio_" + key + "_label", text, [x, 90, width, 20],
            size=16, textcolor=MUTED, bgcolor=rgba("#E8EFF3"))
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
    accent = [TEAL, BLUE, VIOLET][i - 1]
    tint = [rgba("#E1F0EF"), rgba("#E6EDF7"), rgba("#EDE8F5")][i - 1]
    position("source_label" + str(i), [x, 246, 154, 24], modes=source_modes,
             textcolor=accent)
    position("load" + str(i), [x + 184, 240, 104, 32], modes=source_modes,
             bgcolor=tint, bgoncolor=tint, textcolor=accent,
             textoncolor=accent, textovercolor=accent)
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
        hbgcolor=TEAL, htextcolor=WHITE,
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
    position("meter_" + side, [832, y, 104, 12], bgcolor=rgba("#D5DFE5"),
             offcolor=rgba("#CBD5DD"), oncolor=TEAL)
for side, y in [("l", 430), ("r", 504)]:
    accent = TEAL if side == "l" else BLUE
    position("channel_" + side, [24, y + 20, 28, 25], modes={0, 2, 3, 4})
    position("wave_" + side, [56, y, 880, 66], modes={0, 4},
             bgcolor=WHITE, waveformcolor=accent, gridcolor=rgba("#DFE6EB"),
             selectioncolor=rgba("#087F83", 0.18))
    add("scope_" + side, "scope~", [56, y, 880, 66],
        ins=2, outs=0, present=True, modes={2, 3},
        bgcolor=WHITE, fgcolor=accent,
        gridcolor=rgba("#DFE6EB"), calccount=128, bufsize=256,
        range=[-1.0, 1.0], delay=50, trigger=0)
add("xy_pad", "jsui", [56, 430, 600, 140],
    ins=1, outs=1, types=[""], present=True, modes={1},
    filename="cmpe_xy.js", jsarguments=[], border=1,
    parameter_enable=0, bgcolor=WHITE)
add("scope_xy", "scope~", [672, 430, 264, 140],
    ins=2, outs=0, present=True, modes={1},
    bgcolor=WHITE, fgcolor=TEAL,
    gridcolor=rgba("#DFE6EB"), calccount=64, bufsize=256,
    range=[-1.0, 1.0], delay=50, trigger=0)
wire("xy_pad", 0, "controller")

position("selection_info", [24, 578, 660, 24], fontsize=16.0, textcolor=MUTED)
position("time", [704, 578, 232, 24], fontsize=16.0, textcolor=MUTED)
position("loop_toggle", [24, 616, 24, 24], modes={0, 4},
         bgcolor=WHITE, checkedcolor=TEAL, uncheckedcolor=MUTED)
position("loop_label", [60, 614, 320, 28], modes={0, 4})
position("clear_button", [520, 610, 194, 34], modes={0, 4})
position("save_button", [730, 610, 206, 34], modes={0, 4})
button("record_button", "RECORD WAV", [730, 610, 206, 34], modes={1, 2, 3},
       hint="Record the current live instrument to a stereo WAV file.")
msg("recordtoggle_msg", "recordtoggle", 1460, 1600, 150)
wire("record_button", 0, "recordtoggle_msg")
wire("recordtoggle_msg", 0, "controller")

position("play_button", [24, 654, 448, 48],
         bgcolor=TEAL, bgoncolor=rgba("#066B6E"),
         textcolor=WHITE, textoncolor=WHITE, textovercolor=WHITE,
         hint="Start the selected instrument or play its rendered result.")
position("stop_button", [488, 654, 216, 48],
         bgcolor=ROSE_TINT, bgoncolor=rgba("#EED4D4"),
         textcolor=ROSE, textoncolor=ROSE, textovercolor=ROSE,
         hint="Stop audio or cancel preparation.")
position("new_button", [720, 654, 216, 48],
         hint="Start a fresh result for the selected instrument.")
position("record_button", [730, 610, 206, 34],
         bgcolor=ROSE_TINT, bgoncolor=rgba("#EED4D4"),
         textcolor=ROSE, textoncolor=ROSE, textovercolor=ROSE)
position("progress", [24, 712, 912, 6], bgcolor=LIGHT, elementcolor=LIGHT, knobcolor=TEAL)
position("render_info", [24, 724, 912, 24], fontsize=16.0, textcolor=MUTED)
position("status", [24, 752, 912, 38], fontsize=16.0)
position("original_credit", [24, 810, 620, 24], text="Original CMPE by Joo Won Park",
         fontsize=16.0, textcolor=MUTED)
position("original_link", [668, 806, 268, 32], text="joowonpark.net/cmpe",
         fontsize=16.0, textcolor=TEAL, textoncolor=TEAL, textovercolor=TEAL,
         hint="Open Joo Won Park's original Computer Music Practice Examples.")
boxes["original_url"]["text"] = "; max launchbrowser https://joowonpark.net/cmpe/"
boxes["controller"]["text"] = "js cmpe_variety.js"

# Audio controls only request changes through the controller. The controller
# stops voices/recording and fades before applying global device changes.
for key, native, x in [
    ("driver", "adstatus driver", 1460),
    ("option1", "adstatus option 1", 1760),
    ("option2", "adstatus option 2", 2060),
]:
    obj("audio_ad_" + key, native, x, 2300, 235,
        ins=2, outs=2, types=["", "int"])
    obj("audio_menu_" + key, "prepend audiomenu " + key, x, 2340, 235)
    obj("audio_value_" + key, "prepend audiovalue " + key, x, 2380, 235)
    obj("audio_choose_" + key, "prepend audiochoose " + key, x, 2420, 235)
    wire("audio_ad_" + key, 0, "audio_menu_" + key)
    wire("audio_ad_" + key, 1, "audio_value_" + key)
    wire("audio_menu_" + key, 0, "controller")
    wire("audio_value_" + key, 0, "controller")
    wire("audio_" + key + "_menu", 0, "audio_choose_" + key)
    wire("audio_choose_" + key, 0, "controller")
for i, x in [(1, 1760), (2, 2060)]:
    obj("audio_name_option" + str(i), "adstatus optionname " + str(i),
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

# File operations are requested by the controller so record/preset state can be
# checked before a dialog opens. Only the resulting path returns through a cord.
for id, command, selector, x, y in [
    ("record_dialog", "savedialog WAVE", "recordpath", 1460, 1660),
    ("preset_save_dialog", "savedialog JSON", "presetwrite", 1740, 1660),
    ("preset_load_dialog", "opendialog JSON", "presetread", 2020, 1660),
]:
    obj(id, command, x, y, 235, outs=2, types=["", "bang"])
    obj(id + "_path", "prepend " + selector, x, y + 40, 235)
    wire(id, 0, id + "_path")
    wire(id + "_path", 0, "controller")
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
           "apg_wave_controller.js", "cmpe_extension.js", "cmpe_audio_settings.js"]
source_paths = [ROOT / "developer" / name for name in SOURCES]
if all(path.is_file() for path in source_paths):
    (ROOT / "cmpe_variety.js").write_text("\n\n".join(path.read_text().rstrip() for path in source_paths) + "\n")
    print("Bundled cmpe_variety.js from the six source modules.")
else:
    missing = [path.name for path in source_paths if not path.is_file()]
    print("Runtime sources not all present; bundling deferred: " + ", ".join(missing))
