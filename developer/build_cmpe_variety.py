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
WIDTH, HEIGHT = 840, 866
BLACK = [0.04, 0.04, 0.04, 1.0]
WHITE = [1.0, 1.0, 1.0, 1.0]
LIGHT = [0.92, 0.92, 0.92, 1.0]
ALL_MODES = set(range(5))

patch = copy.deepcopy(json.loads(SOURCE.read_text())["patcher"])
patch["rect"] = [80, 80, WIDTH, HEIGHT]
patch["title"] = "CMPE Variety Pack / APG · ISJS · Many · RMHS · SIOE"
patch["openinpresentation"] = 1
patch["bgcolor"] = WHITE
patch["bglockedcolor"] = WHITE
boxes = {item["box"]["id"]: item["box"] for item in patch["boxes"]}
visibility = {id: set(ALL_MODES) for id, box in boxes.items() if box.get("presentation")}


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
    return add(id, "comment", rect, text, 1, 0, present=True,
               modes=modes, fontsize=float(size), bgcolor=WHITE, **attrs)


def button(id, text, rect, modes=None, selected=False, size=17, **attrs):
    return add(id, "textbutton", rect, text, 1, 3, ["", "", "int"],
               present=True, modes=modes, fontsize=float(size), mode=0,
               outputmode=1, usegradient=0, rounded=3,
               bgcolor=BLACK if selected else LIGHT,
               bgoncolor=[0.24, 0.24, 0.24, 1] if selected else [0.76, 0.76, 0.76, 1],
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


# Header and mode selection.
position("title", [24, 13, 480, 39], text="CMPE Variety Pack", fontsize=30.0)
position("subtitle", [26, 54, 475, 25], text="Computer Music Practice Examples")
position("demo_button", [522, 18, 124, 30])
position("test_audio", [660, 18, 156, 30])
button("save_preset", "SAVE SET", [522, 54, 124, 26], size=16)
button("load_preset", "LOAD SET", [660, 54, 156, 26], size=16)
hide_original("header_rule")
hide_original("output_rule")
hide_original("meter_label")
position("credit_rule", [24, 815, 792, 1])

for i, name in enumerate(["APG", "ISJS", "Many", "RMHS", "SIOE"]):
    button("mode" + str(i), name, [24 + i * 160, 88, 152, 36],
           selected=i == 0, size=21,
           hint="Choose the " + name + " instrument.")
    msg("mode_msg" + str(i), "mode " + str(i), 1460 + i * 145, 1390, 130)
    wire("mode" + str(i), 0, "mode_msg" + str(i))
    wire("mode_msg" + str(i), 0, "controller")
comment("mode_info", "APG / Audio Palindrome Generator", [24, 132, 792, 25])

# Three common audio slots. RMHS uses its own synthesis instead.
source_modes = {0, 1, 2, 4}
for i, x in enumerate([24, 296, 568], 1):
    position("source_label" + str(i), [x, 173, 116, 26], modes=source_modes)
    position("load" + str(i), [x + 134, 169, 114, 34], modes=source_modes)
    position("file" + str(i), [x, 211, 248, 42], modes=source_modes)
comment("no_samples", "RMHS creates its own sound. No samples are needed.",
        [24, 184, 792, 56], modes={3}, size=18, linecount=2)

# Two rows of generic controls, with APG's original values overlaid at the same
# positions. The extension hides inactive objects before changing modes.
for i in range(6):
    x = [24, 296, 568][i % 3]
    label_y, field_y = (258, 284) if i < 3 else (322, 348)
    modes = {1, 2, 3, 4} if i < 5 else {1}
    comment("param_label" + str(i), "Parameter " + str(i + 1),
            [x, label_y, 248, 23], modes=modes)
    add("param" + str(i), "flonum", [x, field_y, 248, 30],
        ins=1, outs=2, types=["", "bang"], present=True, modes=modes,
        fontsize=20.0, bgcolor=[0.95, 0.95, 0.95, 1],
        bgoncolor=[0.84, 0.84, 0.84, 1],
        hbgcolor=[0.15, 0.15, 0.15, 1], htextcolor=WHITE,
        tricolor=BLACK, triangle=0, format=6, parameter_enable=0)
    obj("param_msg" + str(i), "prepend param " + str(i),
        1460 + (i % 3) * 230, 1450 + (i // 3) * 40, 215)
    wire("param" + str(i), 0, "param_msg" + str(i))
    wire("param_msg" + str(i), 0, "controller")

for i, x in enumerate([24, 296, 568], 1):
    position("repeat_label" + str(i), [x, 258, 248, 23],
             modes={0}, text="Sample " + str(i) + " repeats")
    position("repeat" + str(i), [x, 284, 248, 30], modes={0})
position("pitch_label", [24, 322, 248, 23], modes={0})
position("pitch", [24, 348, 248, 30], modes={0})

comment("menu_label", "Pitch set", [568, 322, 248, 23], modes={2, 4})
add("mode_menu", "umenu", [568, 348, 248, 30],
    ins=1, outs=3, types=["int", "", ""], present=True, modes={2, 4},
    bgcolor=LIGHT, textcolor=BLACK, fontsize=17.0,
    items=["Major", ",", "Minor", ",", "Pentatonic", ",", "Atonal", ",", "Microtonal"],
    parameter_enable=0)
obj("choice_msg", "prepend choice", 1460, 1540, 205)
wire("mode_menu", 0, "choice_msg")
wire("choice_msg", 0, "controller")

# One output region. Finite modes draw a stored waveform; live modes draw scopes;
# ISJS displays its pointer surface and a compact stereo phase scope.
position("output_label", [24, 386, 220, 25], text="OUTPUT")
position("duration", [260, 386, 242, 25])
position("monitor_label", [540, 386, 92, 25], text="Vol (dB)", fontsize=16.0)
position("monitor_level", [634, 382, 96, 30])
position("meter_L", [752, 382, 64, 12])
position("meter_R", [752, 400, 64, 12])
for side, y in [("l", 416), ("r", 488)]:
    position("channel_" + side, [24, y + 20, 28, 25], modes={0, 2, 3, 4})
    position("wave_" + side, [56, y, 760, 66], modes={0, 4})
    add("scope_" + side, "scope~", [56, y, 760, 66],
        ins=2, outs=0, present=True, modes={2, 3},
        bgcolor=[0.96, 0.96, 0.96, 1], fgcolor=BLACK,
        gridcolor=[0.75, 0.75, 0.75, 1], calccount=128, bufsize=256,
        range=[-1.0, 1.0], delay=50, trigger=0)
add("xy_pad", "jsui", [56, 416, 520, 138],
    ins=1, outs=1, types=[""], present=True, modes={1},
    filename="cmpe_xy.js", jsarguments=[], border=1,
    parameter_enable=0, bgcolor=WHITE)
add("scope_xy", "scope~", [592, 416, 224, 138],
    ins=2, outs=0, present=True, modes={1},
    bgcolor=[0.96, 0.96, 0.96, 1], fgcolor=BLACK,
    gridcolor=[0.75, 0.75, 0.75, 1], calccount=64, bufsize=256,
    range=[-1.0, 1.0], delay=50, trigger=0)
wire("xy_pad", 0, "controller")

position("selection_info", [24, 562, 580, 27])
position("time", [620, 562, 196, 27])
position("loop_toggle", [24, 607, 26, 26], modes={0, 4})
position("loop_label", [62, 606, 320, 28], modes={0, 4})
position("clear_button", [424, 602, 182, 34], modes={0, 4})
position("save_button", [624, 602, 192, 34], modes={0, 4})
button("record_button", "RECORD WAV", [624, 602, 192, 34], modes={1, 2, 3},
       hint="Record the current live instrument to a stereo WAV file.")
msg("recordtoggle_msg", "recordtoggle", 1460, 1600, 150)
wire("record_button", 0, "recordtoggle_msg")
wire("recordtoggle_msg", 0, "controller")

position("play_button", [24, 650, 380, 52],
         hint="Start the selected instrument or play its rendered result.")
position("stop_button", [420, 650, 190, 52],
         hint="Stop audio or cancel preparation.")
position("new_button", [626, 650, 190, 52],
         hint="Start a fresh result for the selected instrument.")
position("progress", [24, 714, 792, 8])
position("render_info", [24, 728, 792, 24])
position("status", [24, 760, 792, 44])
position("original_credit", [24, 832, 498, 26], text="Original CMPE by Joo Won Park")
position("original_link", [548, 827, 268, 32], text="joowonpark.net/cmpe",
         hint="Open Joo Won Park's original Computer Music Practice Examples.")
boxes["original_url"]["text"] = "; max launchbrowser https://joowonpark.net/cmpe/"
boxes["controller"]["text"] = "js cmpe_variety.js"

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
    visible = [boxes[id] for id, modes in visibility.items() if mode in modes]
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
           "apg_wave_controller.js", "cmpe_extension.js"]
source_paths = [ROOT / "developer" / name for name in SOURCES]
if all(path.is_file() for path in source_paths):
    (ROOT / "cmpe_variety.js").write_text("\n\n".join(path.read_text().rstrip() for path in source_paths) + "\n")
    print("Bundled cmpe_variety.js from the five source modules.")
else:
    missing = [path.name for path in source_paths if not path.is_file()]
    print("Runtime sources not all present; bundling deferred: " + ", ".join(missing))
