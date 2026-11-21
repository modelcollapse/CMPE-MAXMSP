"""Build five unfrozen CMPE Max for Live instruments from the shared DSP graph.

Run: python3 developer/build_cmpe_m4l.py

The standalone Max files are inputs only. Generated devices and editable source
patchers share one flat directory with their dependencies. Native Live/Max
loading, Set recall, playback and freezing still require host verification.
"""

from __future__ import annotations

import argparse
import copy
import json
from pathlib import Path
import shutil


ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "max-for-live"
WIDTH, HEIGHT = 1100, 169
VERSION = "0.1.0"
MODES = ["APG", "ISJS", "Many", "RMHS", "SIOE"]
SUBTITLES = ["Audio palindrome", "Granular sampler", "Ambient layers", "Harmonic drone", "Sample supercut"]


def rgba(value, alpha=1.0):
    return [int(value[i:i + 2], 16) / 255 for i in (1, 3, 5)] + [alpha]


INK = rgba("#1B2936")
MUTED = rgba("#526775")
CANVAS = rgba("#F3F6F8")
WHITE = rgba("#FFFFFF")
BORDER = rgba("#CBD5DD")
LIGHT = rgba("#E5ECF0")
ACCENTS = [rgba(c) for c in ["#087F83", "#315FA6", "#7257A6", "#995E32", "#986B19"]]


def build(mode):
    patch = copy.deepcopy(json.loads((ROOT / "CMPE_Variety_Pack.maxpat").read_text())["patcher"])
    name, accent = MODES[mode], ACCENTS[mode]
    patch.update(rect=[80, 80, WIDTH, HEIGHT], title=f"CMPE · {name} {VERSION}",
                 openinpresentation=1, default_fontsize=11.0, bgcolor=CANVAS,
                 bglockedcolor=CANVAS, autosave=0)
    boxes = {item["box"]["id"]: item["box"] for item in patch["boxes"]}

    # Keep controllers' named UI objects, but only the selected instrument's
    # compact controls belong to Presentation. showMode() cannot expose the
    # old standalone UI when those objects have presentation=0.
    for b in boxes.values():
        b["presentation"] = 0
        b.pop("presentation_rect", None)
        if b.get("maxclass") in {"number", "flonum", "umenu", "toggle", "slider"}:
            b["parameter_enable"] = 0
        b["fontname"] = "Arial"
        b["fontsize"] = 11.0

    # Drop every global audio-engine/hardware control and the independent test
    # tone. The output object keeps its scripting name for compatibility, but
    # is exclusively an audio connection to Live.
    remove = {id for id in boxes if (id.startswith("audio_") and id != "audio_driver")
              or id.startswith("test_")}
    remove.add("audio_on")
    for id in remove:
        boxes.pop(id, None)
    patch["lines"] = [x for x in patch["lines"]
                      if x["patchline"]["source"][0] not in remove
                      and x["patchline"]["destination"][0] not in remove]
    boxes["audio_driver"].update(text="plugout~", numinlets=2, numoutlets=0)
    boxes["controller"]["text"] = f"js cmpe_m4l.js {mode}"
    for engine, voice_file, active_mode, voices in [
        ("grain_engine", "sample", 1, 3),
        ("many_engine", "many", 2, 32),
        ("drone_engine", "drone", 3, 64),
    ]:
        boxes[engine]["text"] = f"poly~ cmpe_{voice_file}_voice {voices if mode == active_mode else 1}"
    boxes["new_msg"]["text"] = "newpiece"
    boxes["backend_note"]["text"] = (
        "CMPE Max for Live 0.1.0 preview. MIDI -> instance-local controller. "
        "Finite buffer / live poly~ voices -> monitor -> MIDI velocity -> plugout~. "
        "Live owns hardware and audio engine. No adstatus, dac~ or startwindow. "
        "State is a stored-only pattr bound to the controller. Native host testing pending."
    )

    def wire(src, outlet, dst, inlet=0, **kwargs):
        patch["lines"].append({"patchline": {"source": [src, outlet],
                                             "destination": [dst, inlet], **kwargs}})

    def add(id, cls, rect, text=None, ins=1, outs=1, types=None, **attrs):
        if id in boxes:
            raise ValueError("Duplicate object " + id)
        b = {"id": id, "maxclass": cls, "numinlets": ins, "numoutlets": outs,
             "patching_rect": rect, "fontname": "Arial", "fontsize": 11.0,
             "varname": id, "textcolor": INK}
        if text is not None:
            b["text"] = text
        if types is not None:
            b["outlettype"] = types
        b.update(attrs)
        boxes[id] = b
        return b

    def present(id, rect, text=None, **attrs):
        b = boxes[id]
        b.update(presentation=1, presentation_rect=list(rect), hidden=0,
                 fontname="Arial", fontsize=11.0, textcolor=INK)
        if text is not None:
            b["text"] = text
        if b["maxclass"] == "comment":
            b.update(bgcolor=CANVAS, linecount=1)
        elif b["maxclass"] == "textbutton":
            b.update(bgcolor=LIGHT, bgoncolor=BORDER, textcolor=INK,
                     textoncolor=INK, textovercolor=INK, rounded=4)
        elif b["maxclass"] in {"number", "flonum", "umenu"}:
            b.update(bgcolor=WHITE, bgcolor2=WHITE, triangle=0, hbgcolor=accent,
                     htextcolor=WHITE, fontsize=15.0)
        b.update(attrs)
        return b

    def comment(id, text, rect, **attrs):
        add(id, "comment", rect, text=text, outs=0)
        return present(id, rect, **attrs)

    def parameter(id, longname, shortname, low, high, initial, *, integer=False,
                  enum=None, unit=1, order=1, annotation=None):
        b = boxes[id]
        b["parameter_enable"] = 1
        attrs = {"parameter_longname": longname, "parameter_shortname": shortname,
                 "parameter_type": 2 if enum else (1 if integer else 0),
                 "parameter_initial_enable": 1, "parameter_initial": [initial],
                 "parameter_invisible": 0, "parameter_order": order,
                 "parameter_unitstyle": unit, "parameter_defer": 1}
        if enum:
            attrs["parameter_enum"] = enum
            attrs["parameter_mmin"], attrs["parameter_mmax"] = 0, len(enum) - 1
        else:
            attrs["parameter_mmin"], attrs["parameter_mmax"] = low, high
            b["minimum"], b["maximum"] = low, high
        b["saved_attribute_attributes"] = {"valueof": attrs}
        if annotation:
            b["annotation"] = annotation
            b["hint"] = annotation
        params[id] = [longname, shortname, 0]
        return b

    params = {}
    # Small colored identity column and separators give each device a stable
    # shape while retaining the collection's accessible light palette.
    for i, x in enumerate((140, 352, 616, 898)):
        add(f"m4l_rule{i}", "panel", [x, 8, 1, 130], ins=1, outs=0,
            bgcolor=BORDER, border=0, background=1)
        present(f"m4l_rule{i}", [x, 8, 1, 130])
    present("title", [8, 10, 128, 27], text=f"CMPE · {name}", fontsize=18.0,
            fontface=1, textcolor=accent)
    present("subtitle", [8, 42, 128, 32], text=SUBTITLES[mode], linecount=2,
            textcolor=MUTED, fontsize=12.0)
    present("original_credit", [8, 103, 128, 16], text="Original: Joo Won Park", textcolor=MUTED)
    present("original_link", [8, 122, 124, 21], text="Original CMPE", textcolor=accent,
            textoncolor=accent, textovercolor=accent, bgcolor=CANVAS)
    comment("m4l_version", "v0.1.0 preview", [8, 148, 128, 15], textcolor=MUTED)
    if mode != 3:
        present("demo_button", [8, 78, 124, 22], text="LOAD DEMO",
                hint="Load the included demonstration samples. This replaces the current sources.")
    else:
        comment("m4l_synthesis_note", "Sine synthesis", [8, 80, 128, 18], textcolor=accent)

    source_count = [3, 3, 1, 0, 1][mode]
    for i in range(1, source_count + 1):
        y = 10 + (i - 1) * 44
        present(f"source_label{i}", [148, y, 145, 16], text=f"SAMPLE {i}",
                textcolor=ACCENTS[i - 1], fontface=1)
        present(f"file{i}", [148, y + 16, 148, 28], text="No sample loaded", linecount=2)
        present(f"load{i}", [300, y + 8, 48, 24], text="LOAD",
                hint=f"Choose a mono or stereo WAV or AIFF for sample {i}.")
    if source_count <= 1:
        notes = {
            2: "Layers fade in over 2–4 seconds.\nRecord the track in Live.",
            3: "No sample needed.\nMIDI sets the base pitch.\nThe drone has a slow attack.",
            4: "GENERATE prepares audio.\nPLAY or MIDI triggers it.\nDrag the wave to select a loop."
        }
        comment("m4l_source_note", notes[mode], [148, 68 if source_count else 35, 200, 64],
                textcolor=MUTED, linecount=4, fontsize=12.0)

    def control(id, label_id, label, col, row, low, high, initial, longname,
                shortname, integer=False, unit=1):
        x, y = 360 + col * 86, 9 + row * 65
        present(label_id, [x, y, 78, 27], text=label, linecount=2, textcolor=MUTED)
        present(id, [x, y + 28, 78, 26], numdecimalplaces=0 if integer else 2)
        parameter(id, longname, shortname, low, high, initial, integer=integer, unit=unit)

    if mode == 0:
        for i, initial in enumerate([3, 4, 5], 1):
            control(f"repeat{i}", f"repeat_label{i}", f"Sample {i} repeats", i - 1, 0,
                    1, 20, initial, f"Sample {i} Repeats", f"Rep {i}", integer=True, unit=0)
        control("pitch", "pitch_label", "Pitch range", 0, 1, 0, 1, 0.5, "Pitch Range", "Pitch")
        comment("m4l_apg_note", "Symmetric edge trim\nkeeps the palindrome.", [446, 82, 164, 42],
                textcolor=MUTED, linecount=3)
    elif mode == 1:
        for i, initial in enumerate([1.1, 1.03, 1.2]):
            control(f"param{i}", f"param_label{i}", f"Sample {i + 1} rate", i, 0,
                    0.3, 1.7, initial, f"Sample {i + 1} Rate", f"Rate {i + 1}")
            control(f"param{i + 3}", f"param_label{i + 3}", f"Sample {i + 1} level", i, 1,
                    0, 1, 0.5, f"Sample {i + 1} Level", f"Level {i + 1}")
    elif mode == 2:
        for i, spec in enumerate([
            ("Layer level", 0, 2, 1, "Layer Level", "Level"),
            ("Max delay (s)", 0.1, 0.5, 0.2, "Maximum Delay", "Delay"),
            ("Max interval (s)", 5, 20, 10, "Maximum Interval", "Interval")
        ]):
            label, low, high, value, longname, shortname = spec
            control(f"param{i}", f"param_label{i}", label, i, 0, low, high, value, longname, shortname)
    elif mode == 3:
        for i, spec in enumerate([
            ("Drone level", 0, 1, 0.2, "Drone Level", "Level", False, 1),
            ("Fundamental (Hz)", 20, 20000, 110, "Fundamental Frequency", "Base Hz", False, 3),
            ("Interval (st)", 0, 24, 7, "Interval Semitones", "Interval", False, 7),
            ("Duration (s)", 1, 600, 60, "Drone Duration", "Dur s", False, 1),
            ("Harmonics", 3, 20, 10, "Harmonic Count", "Harm", True, 0)
        ]):
            label, low, high, value, longname, shortname, integer, unit = spec
            control(f"param{i}", f"param_label{i}", label, i % 3, i // 3,
                    low, high, value, longname, shortname, integer=integer, unit=unit)
    else:
        for i, spec in enumerate([
            ("Slices", 1, 100, 10, "Slice Count", "Slices", True),
            ("Tempo (BPM)", 1, 1500, 120, "Render Tempo", "BPM", False),
            ("Hit duration (s)", 0.1, 10, 3, "Hit Duration", "Hit s", False)
        ]):
            label, low, high, value, longname, shortname, integer = spec
            control(f"param{i}", f"param_label{i}", label, i, 0, low, high,
                    value, longname, shortname, integer=integer, unit=0 if integer else 1)
    if mode in (2, 4):
        values = ["Major", "Minor", "Pentatonic", "Atonal", "Microtonal"] if mode == 2 else ["Short", "Long"]
        label = "Pitch set" if mode == 2 else "Form"
        present("menu_label", [360, 79, 252, 18], text=label, textcolor=MUTED)
        menu_items = []
        for i, value in enumerate(values):
            if i:
                menu_items.append(",")
            menu_items.append(value)
        present("mode_menu", [360, 101, 252, 26], items=menu_items, fontsize=13.0)
        parameter("mode_menu", "Pitch Set" if mode == 2 else "Supercut Form", "Pitch" if mode == 2 else "Form",
                  0, len(values) - 1, 1, enum=values, unit=0)

    rendered = mode in (0, 4)
    present("output_label", [624, 9, 170 if mode == 1 else 100, 16],
            text="POSITION / DENSITY" if mode == 1 else "OUTPUT", textcolor=MUTED, fontface=1)
    if mode != 1:
        present("duration", [734, 9, 160, 16], text="Not generated" if rendered else "Stopped", textcolor=MUTED)
    if rendered or mode in (2, 3):
        for channel, y in [("l", 29), ("r", 70)]:
            present("channel_" + channel, [624, y + 8, 12, 16], textcolor=MUTED)
            display = "wave_" + channel if rendered else "scope_" + channel
            present(display, [640, y, 254, 33], bgcolor=WHITE, waveformcolor=accent, fgcolor=accent,
                    labels=0, bordercolor=BORDER, gridcolor=LIGHT)
    if rendered:
        present("loop_toggle", [624, 114, 18, 18], checkedcolor=accent, bgcolor=WHITE)
        present("loop_label", [648, 114, 41, 18], text="Loop")
        parameter("loop_toggle", "Loop Selection", "Loop", 0, 1, 0, integer=True, unit=0,
                  annotation="Loop the selected waveform range. FULL restores the complete generated result.")
        present("clear_button", [696, 110, 86, 24], text="FULL RANGE")
        present("save_button", [790, 110, 104, 24], text="SAVE WAV")
    elif mode == 1:
        present("xy_pad", [624, 28, 178, 80], hint="Horizontal: sample position. Vertical: grain density.")
        present("scope_xy", [810, 28, 84, 80], fgcolor=accent, bgcolor=WHITE, gridcolor=LIGHT)
        for axis, id, label, x in [("x", "m4l_position", "Position", 624), ("y", "m4l_density", "Density", 760)]:
            comment(id + "_label", label, [x, 116, 57, 18], textcolor=MUTED)
            add(id, "flonum", [x + 61, 112, 66, 23], outs=2, types=["", "bang"], format=6)
            present(id, [x + 61, 112, 66, 23], numdecimalplaces=2)
            parameter(id, label, label, 0, 1, 0.5)
            add(id + "_msg", "newobj", [1300, 260 + (0 if axis == "x" else 35), 180, 22], text=f"prepend hostxy {axis}")
            wire(id, 0, id + "_msg")
            wire(id + "_msg", 0, "controller")
    else:
        present("selection_info", [624, 112, 270, 25], text="Record this instrument on a Live track.",
                linecount=2, textcolor=MUTED)
    present("progress", [624, 137, 270, 3], bgcolor=LIGHT, elementcolor=LIGHT, knobcolor=accent)

    # Output and trigger controls stay in the same place across the collection.
    new_label = "GENERATE" if rendered else ("RANDOMIZE" if mode == 3 else "RESET")
    present("new_button", [906, 10, 184, 28], text=new_label, bgcolor=LIGHT)
    present("play_button", [906, 45, 88, 28], text="PLAY" if rendered else "START",
            bgcolor=accent, bgoncolor=accent, textcolor=WHITE, textoncolor=WHITE, textovercolor=WHITE)
    present("stop_button", [1002, 45, 88, 28], text="STOP", bgcolor=rgba("#F5E6E5"),
            textcolor=rgba("#8B3338"), textoncolor=rgba("#8B3338"), textovercolor=rgba("#8B3338"))
    add("m4l_latch", "toggle", [906, 82, 17, 17], outs=1, types=["int"])
    present("m4l_latch", [906, 82, 17, 17], checkedcolor=accent, bgcolor=WHITE)
    parameter("m4l_latch", "MIDI Latch", "Latch", 0, 1, 0, integer=True, unit=0,
              annotation="Off: releasing the triggering MIDI note stops sound. On: ignore note-off; use STOP to end sound.")
    comment("m4l_latch_label", "Latch MIDI notes", [930, 81, 160, 20])
    add("m4l_latch_msg", "newobj", [1300, 330, 170, 22], text="prepend midilatch")
    wire("m4l_latch", 0, "m4l_latch_msg")
    wire("m4l_latch_msg", 0, "controller")
    present("monitor_label", [906, 110, 88, 21], text="Output dB", textcolor=MUTED)
    present("monitor_level", [1002, 106, 88, 26], numdecimalplaces=1)
    parameter("monitor_level", "Output Level", "Output", -60, 0, -12, unit=4)
    present("meter_L", [906, 140, 184, 7], bgcolor=LIGHT, oncolor=accent, offcolor=BORDER)
    present("meter_R", [906, 153, 184, 7], bgcolor=LIGHT, oncolor=accent, offcolor=BORDER)
    present("status", [148, 147, 746, 17], text="Ready. Load samples or choose LOAD DEMO." if source_count else "Ready. Press START or hold a MIDI note.",
            fontsize=11.0, textcolor=INK, linecount=1)

    # Initialization waits for Live's saved parameters. notein emits right to
    # left, so channel and velocity reach the cold pack inlets before pitch.
    add("m4l_device", "newobj", [1300, 400, 180, 22], text="live.thisdevice", outs=3,
        types=["bang", "int", "int"])
    add("m4l_ready", "message", [1300, 440, 120, 22], text="hostready", ins=2)
    add("m4l_active", "newobj", [1440, 440, 180, 22], text="prepend hostactive")
    wire("m4l_device", 0, "m4l_ready")
    wire("m4l_ready", 0, "controller")
    wire("m4l_device", 1, "m4l_active")
    wire("m4l_active", 0, "controller")
    add("m4l_notein", "newobj", [1300, 490, 180, 22], text="notein", outs=3,
        types=["int", "int", "int"])
    add("m4l_notepack", "newobj", [1300, 530, 180, 22], text="pack 0 0 0", ins=3)
    add("m4l_note", "newobj", [1300, 570, 180, 22], text="prepend midinote")
    for i in range(3):
        wire("m4l_notein", i, "m4l_notepack", i)
    wire("m4l_notepack", 0, "m4l_note")
    wire("m4l_note", 0, "controller")

    add("cmpe_state", "newobj", [1300, 630, 420, 22],
        text="pattr cmpe_state @bindto controller @parameter_enable 1", outs=3,
        types=["", "", ""], parameter_enable=1, saved_object_attributes={"parameter_enable": 1},
        saved_attribute_attributes={"valueof": {"parameter_longname": "CMPE Device State",
            "parameter_shortname": "State", "parameter_type": 3, "parameter_invisible": 1,
            "parameter_order": 0, "parameter_initial_enable": 0}})
    params["cmpe_state"] = ["CMPE Device State", "State", 0]

    add("m4l_velocity", "newobj", [1300, 690, 150, 22], text="line~ 1.", ins=2, outs=2,
        types=["signal", "bang"])
    for side, inlet in [("L", 0), ("R", 1)]:
        add("m4l_output_" + side, "newobj", [1300 + inlet * 180, 730, 130, 22], text="*~", ins=2,
            outs=1, types=["signal"])
        # Meter the same signal that reaches Live, including MIDI velocity.
        patch["lines"] = [x for x in patch["lines"]
                          if not (x["patchline"]["source"][0] == "monitor_" + side
                                  and x["patchline"]["destination"][0] in {"audio_driver", "meter_" + side})]
        wire("monitor_" + side, 0, "m4l_output_" + side)
        wire("m4l_velocity", 0, "m4l_output_" + side, 1)
        wire("m4l_output_" + side, 0, "meter_" + side, order=0)
        wire("m4l_output_" + side, 0, "audio_driver", inlet, order=1)

    # Never create an empty bank. Banks refer to parameter long names, not box
    # IDs, matching files saved by native Max. State blobs are stored only.
    names = [v[0] for k, v in params.items() if k != "cmpe_state"]
    params["parameterbanks"] = {
        str(i // 8): {"index": i // 8, "name": name if i == 0 else name + " More",
                      "parameters": names[i:i + 8] + ["-"] * max(0, 8 - len(names[i:i + 8]))}
        for i in range(0, len(names), 8)
    }
    params["inherited_shortname"] = 1
    patch["parameters"] = params
    patch["dependency_cache"] = [
        {"name": "cmpe_m4l.js", "type": "TEXT", "implicit": 1},
        {"name": "cmpe_xy.js", "type": "TEXT", "implicit": 1},
        *[{"name": f"cmpe_{voice}_voice.maxpat", "type": "JSON", "implicit": 1}
          for voice in ["sample", "many", "drone"]],
        *[{"name": f"apgw_test{i}.wav", "type": "WAVE", "implicit": 1} for i in range(1, 4)]
    ]
    patch["boxes"] = [{"box": b} for b in boxes.values()]
    validate(patch, mode)
    return {"patcher": patch}


def validate(patch, mode):
    boxes = {x["box"]["id"]: x["box"] for x in patch["boxes"]}
    assert len(boxes) == len(patch["boxes"]), "Duplicate IDs"
    for item in patch["lines"]:
        line = item["patchline"]
        src, outlet = line["source"]
        dst, inlet = line["destination"]
        assert src in boxes and dst in boxes, (src, dst)
        assert 0 <= outlet < boxes[src]["numoutlets"], (src, outlet)
        assert 0 <= inlet < boxes[dst]["numinlets"], (dst, inlet)
    for b in boxes.values():
        text = b.get("text", "")
        if b["maxclass"] in {"newobj", "message"}:
            assert not text.startswith(("dac~", "adstatus", "startwindow", "; dsp")), text
        if not b.get("presentation"):
            continue
        x, y, width, height = b["presentation_rect"]
        assert min(x, y, width, height) >= 0, b["id"]
        assert x + width <= WIDTH and y + height <= HEIGHT, b["id"]
        assert b.get("fontsize", 11) >= 11, b["id"]
    assert boxes["audio_driver"]["text"] == "plugout~"
    assert boxes["controller"]["text"] == f"js cmpe_m4l.js {mode}"
    assert all(boxes[k]["parameter_enable"] for k in ["monitor_level", "m4l_latch", "cmpe_state"])
    banks = patch["parameters"]["parameterbanks"]
    assert banks and all(len(v["parameters"]) == 8 for v in banks.values())
    visible = [b for b in boxes.values() if b.get("presentation") and not b.get("hidden")
               and b["maxclass"] != "panel"]
    for i, a in enumerate(visible):
        ax, ay, aw, ah = a["presentation_rect"]
        for b in visible[i + 1:]:
            bx, by, bw, bh = b["presentation_rect"]
            assert min(ax + aw, bx + bw) <= max(ax, bx) or min(ay + ah, by + bh) <= max(ay, by), (
                "Presentation overlap", a["id"], b["id"])


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--patchers-only", action="store_true", help="Build source maxpat without AMXD containers")
    args = parser.parse_args()
    if not args.patchers_only:
        from m4l_packaging import prepare_device, write_amxd
    OUT.mkdir(parents=True, exist_ok=True)
    for mode, name in enumerate(MODES):
        document = build(mode)
        if not args.patchers_only:
            document = prepare_device(document, device_type="instrument", width=WIDTH)
        target = OUT / f"CMPE_{name}.maxpat"
        target.write_text(json.dumps(document, indent=2, ensure_ascii=False) + "\n")
        if not args.patchers_only:
            write_amxd(target.with_suffix(".amxd"), document, device_type="instrument")
        patch = document["patcher"]
        print(f"CMPE_{name}: {len(patch['boxes'])} objects, {len(patch['lines'])} cords, {WIDTH}×{HEIGHT}")
    for file in ["cmpe_xy.js", "cmpe_sample_voice.maxpat", "cmpe_many_voice.maxpat", "cmpe_drone_voice.maxpat",
                 "apgw_test1.wav", "apgw_test2.wav", "apgw_test3.wav"]:
        shutil.copyfile(ROOT / file, OUT / file)


if __name__ == "__main__":
    main()
