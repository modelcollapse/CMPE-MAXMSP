"""Build the three native MSP voice abstractions for CMPE Variety Pack.

No external Max packages are required. Each abstraction has one message inlet,
two signal outlets, and explicit per-voice thispoly~ muting. The parent sends
line~ breakpoint lists as target/time pairs, including an initial 0 0 reset.

Original musical processes: Joo Won Park, https://joowonpark.net/cmpe/
Max object references used for the port:
https://docs.cycling74.com/reference/groove~/
https://docs.cycling74.com/reference/allpass~/
https://docs.cycling74.com/reference/line~/
https://docs.cycling74.com/reference/cycle~/
https://docs.cycling74.com/reference/thispoly~/
"""

from pathlib import Path
import json


ROOT = Path(__file__).resolve().parent.parent


class Patch:
    def __init__(self, name, selectors, protocol, width=1500, height=1000):
        self.name = name
        self.boxes = {}
        self.lines = []
        self.selectors = selectors.split()
        self.patcher = {
            "fileversion": 1,
            "appversion": {"major": 8, "minor": 6, "revision": 5,
                           "architecture": "x64", "modernui": 1},
            "classnamespace": "box",
            "rect": [80, 80, width, height],
            "default_fontsize": 13.0,
            "default_fontname": "Arial",
            "title": name,
            "boxes": [], "lines": self.lines,
            "autosave": 0,
        }
        self.comment("protocol", protocol, 20, 12, width - 40, 76)
        self.obj("input", "in 1", 20, 110, 70, ins=1)
        self.obj("route", "route " + selectors, 20, 150, width - 40,
                 outs=len(self.selectors) + 1)
        self.wire("input", 0, "route")

    def box(self, key, cls, text, x, y, width=130, height=24,
            ins=1, outs=1, types=None, **attrs):
        assert key not in self.boxes, key
        value = {"id": key, "maxclass": cls, "numinlets": ins,
                 "numoutlets": outs, "patching_rect": [x, y, width, height],
                 "fontname": "Arial", "fontsize": 13.0, "text": text}
        if types is not None:
            assert len(types) == outs, (key, types, outs)
            value["outlettype"] = types
        elif outs:
            value["outlettype"] = [""] * outs
        value.update(attrs)
        self.boxes[key] = value
        self.patcher["boxes"].append({"box": value})
        return key

    def obj(self, key, text, x, y, width=130, ins=1, outs=1, types=None):
        return self.box(key, "newobj", text, x, y, width,
                        ins=ins, outs=outs, types=types)

    def msg(self, key, text, x, y, width=110):
        return self.box(key, "message", text, x, y, width, ins=2)

    def comment(self, key, text, x, y, width=400, height=48):
        return self.box(key, "comment", text, x, y, width, height, outs=0)

    def wire(self, source, outlet, destination, inlet=0):
        self.lines.append({"patchline": {"source": [source, outlet],
                                         "destination": [destination, inlet]}})

    def route(self, selector, destination, inlet=0):
        self.wire("route", self.selectors.index(selector), destination, inlet)

    def signal(self, key, text, x, y, width=130, ins=1):
        return self.obj(key, text, x, y, width, ins=ins, types=["signal"])

    def line(self, key, initial, x, y):
        return self.obj(key, "line~ " + str(initial), x, y, 150,
                        ins=2, outs=2, types=["signal", "bang"])

    def amp(self, x, y):
        self.obj("amp_ramp", "pack f 5.", x, y, 110, ins=2)
        self.line("amplitude", "0.", x, y + 40)
        self.route("amp", "amp_ramp")
        self.wire("amp_ramp", 0, "amplitude")

    def pan(self, x, y):
        self.obj("pan_clip", "clip -1. 1.", x, y, 110, ins=3)
        self.obj("pan_left_value", "expr cos(($f1+1.)*0.7853981633974483)",
                 x, y + 40, 330, types=["float"])
        self.obj("pan_right_value", "expr sin(($f1+1.)*0.7853981633974483)",
                 x + 360, y + 40, 330, types=["float"])
        self.obj("pan_left_ramp", "pack f 5.", x, y + 80, 110, ins=2)
        self.obj("pan_right_ramp", "pack f 5.", x + 360, y + 80, 110, ins=2)
        self.line("pan_left", "0.7071067811865476", x, y + 120)
        self.line("pan_right", "0.7071067811865476", x + 360, y + 120)
        self.route("pan", "pan_clip")
        for side in ("left", "right"):
            self.wire("pan_clip", 0, "pan_" + side + "_value")
            self.wire("pan_" + side + "_value", 0, "pan_" + side + "_ramp")
            self.wire("pan_" + side + "_ramp", 0, "pan_" + side)

    def lifecycle(self, x, y, player=None, clear=None, start_reset=None):
        """Cancel every pending mute before start; fade before stopping DSP.

        Do not connect envelope completion bangs to muting. A stale completion
        bang must never mute a newly retriggered sample. Parent explicit voice
        scheduling owns lifetime, including the bounded Many tails.
        """
        self.obj("this_voice", "thispoly~", x + 600, y + 180, 110,
                 outs=3, types=["int", "int", "int"])
        self.obj("initialize", "loadbang", x + 600, y, 110)
        self.obj("init_order", "t b b", x + 600, y + 40, 70,
                 outs=2, types=["bang", "bang"])
        self.msg("muted", "mute 1", x + 710, y + 100, 90)
        self.msg("available", "0", x + 600, y + 100, 50)
        self.wire("initialize", 0, "init_order")
        self.wire("init_order", 1, "available")
        self.wire("init_order", 0, "muted")
        self.wire("muted", 0, "this_voice")
        self.wire("available", 0, "this_voice")

        self.line("run_gate", "0.", x + 120, y + 280)
        self.obj("mute_delay", "delay 12", x + 300, y + 80, 110, ins=2)
        self.msg("cancel_mute", "stop", x + 300, y, 90)
        self.wire("cancel_mute", 0, "mute_delay")

        start_type = "f" if player else "b"
        self.obj("start_order", "t " + start_type + " b b b b b", x, y, 180,
                 outs=6, types=["float" if player else "bang"] + ["bang"] * 5)
        self.route("start", "start_order")
        self.wire("start_order", 5, "cancel_mute")
        if clear:
            self.wire("start_order", 4, clear)
        self.msg("unmute", "mute 0", x, y + 80, 90)
        self.msg("busy", "1", x + 110, y + 80, 50)
        self.msg("gate_on", "1. 0.", x + 180, y + 80, 80)
        self.wire("start_order", 3, "unmute")
        self.wire("start_order", 2, "busy")
        self.wire("start_order", 1, "gate_on")
        self.wire("unmute", 0, "this_voice")
        self.wire("busy", 0, "this_voice")
        self.wire("gate_on", 0, "run_gate")
        if player:
            self.wire("start_order", 0, player)
        if start_reset:
            self.wire("start_order", 0, start_reset)

        self.obj("stop_order", "t b b b", x, y + 140, 95,
                 outs=3, types=["bang"] * 3)
        self.route("stop", "stop_order")
        self.route("panic", "stop_order")
        self.msg("gate_off", "0. 10.", x + 120, y + 180, 85)
        self.wire("stop_order", 2, "cancel_mute")
        self.wire("stop_order", 1, "gate_off")
        self.wire("stop_order", 0, "mute_delay")
        self.wire("gate_off", 0, "run_gate")

        self.obj("retire_order", "t b b b b", x + 300, y + 140, 110,
                 outs=4, types=["bang"] * 4)
        self.wire("mute_delay", 0, "retire_order")
        if player:
            self.msg("player_stop", "stop", x + 300, y + 220, 75)
            self.wire("retire_order", 3, "player_stop")
            self.wire("player_stop", 0, player)
        if clear:
            self.wire("retire_order", 2, clear)
        self.wire("retire_order", 1, "available")
        self.wire("retire_order", 0, "muted")

    def write(self):
        fanouts = {}
        seen = set()
        for item in self.lines:
            line = item["patchline"]
            src, out = line["source"]
            dst, inlet = line["destination"]
            assert src in self.boxes and dst in self.boxes, line
            assert 0 <= out < self.boxes[src]["numoutlets"], line
            assert 0 <= inlet < self.boxes[dst]["numinlets"], line
            key = (src, out, dst, inlet)
            assert key not in seen, key
            seen.add(key)
            fanouts.setdefault((src, out), []).append(line)
        for lines in fanouts.values():
            if len(lines) > 1:
                for index, line in enumerate(lines):
                    line["order"] = index
        assert self.boxes["input"]["text"] == "in 1"
        assert [b["text"] for b in self.boxes.values()
                if b["text"].startswith("out~ ")] == ["out~ 1", "out~ 2"]
        target = ROOT / (self.name + ".maxpat")
        target.write_text(json.dumps({"patcher": self.patcher}, indent=2) + "\n")
        print("Built %s: %d objects, %d cords" % (target.name,
                                                 len(self.boxes), len(self.lines)))


def make_sample():
    p = Patch("cmpe_sample_voice", "set rate amp pan env start stop panic",
              "ISJS native sample voice. Messages: set buffer; rate ratio; amp gain; "
              "pan -1..1; env target/ms pairs; start positionMs; stop; panic.\n"
              "Both source channels are summed before equal-power panning. "
              "Original musical process: Joo Won Park / joowonpark.net/cmpe.",
              width=1500, height=1250)
    p.obj("buffer_set", "prepend set", 20, 220, 130)
    p.signal("rate", "sig~ 1.", 180, 220, 95)
    p.obj("player", "groove~ cmpe_unassigned 2 @loop 1 @loopinterp 1",
          20, 300, 450, ins=3, outs=3, types=["signal"] * 3)
    p.signal("mono", "+~", 20, 360, 70, ins=2)
    p.line("envelope", "0.", 360, 360)
    p.amp(530, 220)
    p.pan(770, 220)
    p.route("set", "buffer_set")
    p.wire("buffer_set", 0, "player")
    p.route("rate", "rate")
    p.wire("rate", 0, "player")
    p.route("env", "envelope")
    p.wire("player", 0, "mono")
    p.wire("player", 1, "mono", 1)
    p.signal("shaped", "*~", 20, 440, 70, ins=2)
    p.signal("scaled", "*~", 20, 500, 70, ins=2)
    p.signal("gated", "*~", 20, 560, 70, ins=2)
    p.wire("mono", 0, "shaped")
    p.wire("envelope", 0, "shaped", 1)
    p.wire("shaped", 0, "scaled")
    p.wire("amplitude", 0, "scaled", 1)
    p.wire("scaled", 0, "gated")
    p.lifecycle(20, 810, player="player")
    p.wire("run_gate", 0, "gated", 1)
    for side, index, x in [("left", 1, 20), ("right", 2, 280)]:
        p.signal("panned_" + side, "*~", x, 640, 70, ins=2)
        p.obj("out_" + side, "out~ " + str(index), x, 710, 80, outs=0)
        p.wire("gated", 0, "panned_" + side)
        p.wire("pan_" + side, 0, "panned_" + side, 1)
        p.wire("panned_" + side, 0, "out_" + side)
    p.write()


def make_many():
    p = Patch("cmpe_many_voice",
              "set rate amp sumgain feed dryenv wetenv stage clear start stop panic",
              "Many native voice. Messages: set buffer; rate ratio; amp wetGain; "
              "sumgain (1 mono, 0.70710678 stereo); feed inputMultiplier; dryenv/wetenv target/ms pairs;\n"
              "stage index delayLms coefficientL delayRms coefficientR; clear; start positionMs; stop; panic. "
              "Each of seven allpasses receives feed at its INPUT. Feedback coefficients must be below 1.",
              width=1560, height=1760)
    p.obj("buffer_set", "prepend set", 20, 210, 130)
    p.signal("rate", "sig~ 1.", 180, 210, 100)
    p.obj("player", "groove~ cmpe_unassigned 2 @loop 0", 20, 280, 370,
          ins=3, outs=3, types=["signal"] * 3)
    p.signal("mono", "+~", 20, 330, 70, ins=2)
    p.signal("source_gain", "sig~ 1.", 180, 330, 100)
    p.signal("normalized", "*~", 20, 380, 70, ins=2)
    p.line("dry_envelope", "0.", 300, 330)
    p.signal("excitation", "*~", 20, 430, 70, ins=2)
    p.signal("feed", "sig~ 1.05", 460, 330, 115)
    p.line("wet_envelope", "0.", 600, 330)
    p.amp(800, 210)
    p.obj("stage_route", "route 1 2 3 4 5 6 7", 990, 210, 290,
          outs=8)
    p.msg("clear_filters", "clear", 1310, 210, 90)
    p.route("set", "buffer_set")
    p.route("rate", "rate")
    p.route("sumgain", "source_gain")
    p.route("feed", "feed")
    p.route("dryenv", "dry_envelope")
    p.route("wetenv", "wet_envelope")
    p.route("stage", "stage_route")
    p.route("clear", "clear_filters")
    p.wire("buffer_set", 0, "player")
    p.wire("rate", 0, "player")
    p.wire("player", 0, "mono")
    p.wire("player", 1, "mono", 1)
    p.wire("mono", 0, "normalized")
    p.wire("source_gain", 0, "normalized", 1)
    p.wire("normalized", 0, "excitation")
    p.wire("dry_envelope", 0, "excitation", 1)
    prior = {"L": "excitation", "R": "excitation"}
    for stage in range(1, 8):
        y = 510 + (stage - 1) * 85
        unpack = "stage_values_" + str(stage)
        p.obj(unpack, "unpack f f f f", 1050, y, 160,
              outs=4, types=["float"] * 4)
        p.wire("stage_route", stage - 1, unpack)
        for side, x, delay_out, coefficient_out in [("L", 20, 0, 1), ("R", 510, 2, 3)]:
            mul = "feed_" + side + str(stage)
            ap = "allpass_" + side + str(stage)
            p.signal(mul, "*~", x, y, 65, ins=2)
            p.signal(ap, "allpass~ 500. 50. 0.98", x + 110, y, 230, ins=3)
            p.wire(prior[side], 0, mul)
            p.wire("feed", 0, mul, 1)
            p.wire(mul, 0, ap)
            p.wire(unpack, delay_out, ap, 1)
            p.wire(unpack, coefficient_out, ap, 2)
            p.wire("clear_filters", 0, ap)
            prior[side] = ap
    p.lifecycle(20, 1380, player="player", clear="clear_filters")
    for side, index, x in [("L", 1, 20), ("R", 2, 510)]:
        p.signal("wet_" + side, "*~", x, 1130, 65, ins=2)
        p.signal("scaled_" + side, "*~", x + 110, 1180, 65, ins=2)
        p.signal("gated_" + side, "*~", x + 220, 1230, 65, ins=2)
        p.obj("out_" + side, "out~ " + str(index), x + 220, 1290, 85, outs=0)
        p.wire(prior[side], 0, "wet_" + side)
        p.wire("wet_envelope", 0, "wet_" + side, 1)
        p.wire("wet_" + side, 0, "scaled_" + side)
        p.wire("amplitude", 0, "scaled_" + side, 1)
        p.wire("scaled_" + side, 0, "gated_" + side)
        p.wire("run_gate", 0, "gated_" + side, 1)
        p.wire("gated_" + side, 0, "out_" + side)
    p.comment("many_note", "Source: Joo Won Park / CMPE. Allpass coefficient = "
              "pow(0.001, delaySeconds / decaySeconds). start and stop clear delay memory. "
              "Parent fades a reused voice before reconfiguration; explicit targeting owns tail lifetime.",
              900, 1380, 610, 100)
    p.write()


def make_drone():
    p = Patch("cmpe_drone_voice",
              "freq drift mod modphase amp pan env start stop panic",
              "RMHS native drone voice. Messages: freq Hz; drift targetHz durationMs; "
              "mod Hz; modphase 0..1 (cycle phase); amp gain; pan -1..1; env target/ms pairs; start; stop; panic.\n"
              "Carrier = sine(freq + drift). Amplitude = amp * (1 + 0.5*cos(modPhase)). "
              "Original musical process: Joo Won Park / joowonpark.net/cmpe.",
              width=1500, height=1310)
    p.signal("frequency", "sig~ 110.", 20, 230, 130)
    p.line("drift", "0.", 200, 230)
    p.signal("frequency_sum", "+~", 20, 300, 70, ins=2)
    p.signal("carrier", "cycle~ 110.", 20, 360, 130, ins=2)
    p.msg("carrier_reset", "reset 0.75", 180, 360, 120)
    p.signal("modulator", "cycle~ 0.01", 400, 230, 130, ins=2)
    p.obj("mod_phase", "prepend reset", 570, 230, 150)
    p.signal("mod_depth", "*~ 0.5", 400, 300, 100, ins=2)
    p.signal("mod_bias", "+~ 1.", 400, 360, 100, ins=2)
    p.amp(570, 300)
    p.line("envelope", "0.", 570, 420)
    p.pan(770, 230)
    p.route("freq", "frequency")
    p.route("drift", "drift")
    p.route("mod", "modulator")
    p.route("modphase", "mod_phase")
    p.route("env", "envelope")
    p.wire("frequency", 0, "frequency_sum")
    p.wire("drift", 0, "frequency_sum", 1)
    p.wire("frequency_sum", 0, "carrier")
    p.wire("carrier_reset", 0, "carrier")
    p.wire("mod_phase", 0, "modulator")
    p.wire("modulator", 0, "mod_depth")
    p.wire("mod_depth", 0, "mod_bias")
    p.signal("modulated", "*~", 20, 450, 70, ins=2)
    p.signal("scaled", "*~", 20, 510, 70, ins=2)
    p.signal("shaped", "*~", 20, 570, 70, ins=2)
    p.signal("gated", "*~", 20, 630, 70, ins=2)
    p.wire("carrier", 0, "modulated")
    p.wire("mod_bias", 0, "modulated", 1)
    p.wire("modulated", 0, "scaled")
    p.wire("amplitude", 0, "scaled", 1)
    p.wire("scaled", 0, "shaped")
    p.wire("envelope", 0, "shaped", 1)
    p.wire("shaped", 0, "gated")
    p.lifecycle(20, 890, start_reset="carrier_reset")
    p.wire("run_gate", 0, "gated", 1)
    for side, index, x in [("left", 1, 20), ("right", 2, 280)]:
        p.signal("panned_" + side, "*~", x, 700, 70, ins=2)
        p.obj("out_" + side, "out~ " + str(index), x, 770, 85, outs=0)
        p.wire("gated", 0, "panned_" + side)
        p.wire("pan_" + side, 0, "panned_" + side, 1)
        p.wire("panned_" + side, 0, "out_" + side)
    p.write()


def main():
    ROOT.mkdir(exist_ok=True)
    make_sample()
    make_many()
    make_drone()


if __name__ == "__main__":
    main()
