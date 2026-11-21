"""Independently inspect the distributed CMPE Max for Live device packages.

This checks file framing, dependencies, host I/O, source reachability, parameter
registrations and Presentation bounds. It does not load Max objects or execute
native MSP/Live. Run after building the devices and cmpe_m4l.js.
"""

from __future__ import annotations

from collections import defaultdict, deque
import json
from pathlib import Path
import re
import struct


ROOT = Path(__file__).resolve().parents[2]
DEVICES = ROOT / "max-for-live"
NAMES = ["APG", "ISJS", "Many", "RMHS", "SIOE"]
checks = 0


def check(condition, description):
    global checks
    checks += 1
    if not condition:
        raise AssertionError(description)


def decode_amxd(path):
    # Deliberately independent from the builder's m4l_packaging.py helper.
    # Official unfrozen instrument chunk structure: ampf/iiii, meta, ptch/JSON.
    data = path.read_bytes()
    chunks = []
    offset = 0
    while offset < len(data):
        check(offset + 8 <= len(data), path.name + ": complete chunk header")
        tag = data[offset:offset + 4]
        size = struct.unpack_from("<I", data, offset + 4)[0]
        offset += 8
        check(offset + size <= len(data), path.name + ": complete chunk data")
        chunks.append((tag, data[offset:offset + size]))
        offset += size
    check([tag for tag, _ in chunks] == [b"ampf", b"meta", b"ptch"], path.name + ": unfrozen chunk ordering")
    check(chunks[0][1] == b"iiii", path.name + ": instrument type")
    check(len(chunks[1][1]) == 4, path.name + ": metadata field length")
    check(chunks[2][1].endswith(b"\0"), path.name + ": JSON terminal NUL")
    return json.loads(chunks[2][1][:-1].decode("utf-8"))


def routes(patch):
    edges = defaultdict(list)
    for entry in patch["lines"]:
        line = entry["patchline"]
        edges[line["source"][0]].append(line["destination"][0])
    return edges


def reachable(edges, source, destination, exclude=()):
    queue, visited = deque([source]), set(exclude)
    while queue:
        current = queue.popleft()
        if current in visited:
            continue
        if current == destination:
            return True
        visited.add(current)
        queue.extend(edges[current])
    return False


def direct(patch, source, outlet, destination, inlet):
    return any(item["patchline"]["source"] == [source, outlet]
               and item["patchline"]["destination"] == [destination, inlet]
               for item in patch["lines"])


def read_dependency(name):
    target = DEVICES / name
    check(target.is_file(), "Shipped dependency exists: " + name)
    return target


def inspect(name, mode):
    source = json.loads((DEVICES / f"CMPE_{name}.maxpat").read_text())
    packed = decode_amxd(DEVICES / f"CMPE_{name}.amxd")
    check(source == packed, name + ": AMXD matches editable source exactly")
    patch = packed["patcher"]
    boxes = {entry["box"]["id"]: entry["box"] for entry in patch["boxes"]}
    edges = routes(patch)
    check(len(boxes) == len(patch["boxes"]), name + ": unique object IDs")
    varnames = [box["varname"] for box in boxes.values() if box.get("varname")]
    check(len(varnames) == len(set(varnames)), name + ": unique scripting names")
    check(patch["project"]["amxdtype"] == 1768515945, name + ": instrument project metadata")
    check(patch["devicewidth"] == 1100 and patch["openinpresentation"] == 1, name + ": device dimensions and initial presentation")
    for line in patch["lines"]:
        src, outlet = line["patchline"]["source"]
        dst, inlet = line["patchline"]["destination"]
        check(src in boxes and dst in boxes, name + ": existing patch cord endpoints")
        check(0 <= outlet < boxes[src]["numoutlets"] and 0 <= inlet < boxes[dst]["numinlets"],
              name + ": valid patch cord inlet/outlet indices")

    # Connections into Live cannot reach the host without the monitor and MIDI
    # velocity stages; finite and native voice paths both reach this output.
    output = boxes["audio_driver"]
    check(output["text"] == "plugout~", name + ": audio goes to the Live track")
    check(boxes["controller"]["text"] == f"js cmpe_m4l.js {mode}", name + ": fixed-mode host adapter")
    for engine in ["grain_engine", "many_engine", "drone_engine", "groove"]:
        check(reachable(edges, engine, "audio_driver"), name + ": audible source path " + engine)
    for side, inlet in [("L", 0), ("R", 1)]:
        stage = "m4l_output_" + side
        check(direct(patch, "monitor_" + side, 0, stage, 0), name + ": output monitoring precedes velocity " + side)
        check(direct(patch, "m4l_velocity", 0, stage, 1), name + ": MIDI velocity scales channel " + side)
        check(direct(patch, stage, 0, "audio_driver", inlet), name + ": stereo host output channel " + side)
        check(direct(patch, stage, 0, "meter_" + side, 0), name + ": meter measures actual host output " + side)
        check(not reachable(edges, "monitor_" + side, "audio_driver", exclude=[stage]),
              name + ": no output bypass around velocity stage " + side)

    # Host initialization must be separate from ordinary loadbang, and MIDI's
    # pitch outlet must trigger a list only after velocity/channel are stored.
    check(boxes["m4l_device"]["text"] == "live.thisdevice", name + ": host lifecycle object")
    check(direct(patch, "m4l_device", 0, "m4l_ready", 0)
          and boxes["m4l_ready"]["text"] == "hostready"
          and direct(patch, "m4l_ready", 0, "controller", 0), name + ": Live-ready initialization path")
    check(direct(patch, "m4l_device", 1, "m4l_active", 0)
          and boxes["m4l_active"]["text"] == "prepend hostactive"
          and direct(patch, "m4l_active", 0, "controller", 0), name + ": Live enabled/disabled path")
    check(boxes["m4l_notein"]["text"] == "notein" and boxes["m4l_notepack"]["text"] == "pack 0 0 0", name + ": complete MIDI note tuple")
    for i in range(3):
        check(direct(patch, "m4l_notein", i, "m4l_notepack", i), name + ": correct note tuple field " + str(i))
    check(boxes["m4l_note"]["text"] == "prepend midinote" and reachable(edges, "m4l_notein", "controller"), name + ": MIDI reaches adapter")

    # Audio-rate sample count determines one-shot completion independently of
    # GUI/JS timer resolution. Preserve the deferred token route to ignore stale
    # completion messages after a retrigger or new selection.
    for src, dst in [("clock", "reached_end"), ("total_frames", "reached_end"),
                     ("reached_end", "done"), ("loop_flag", "done"),
                     ("done", "done_edge"), ("done_edge", "play_token"),
                     ("play_token", "done_defer"), ("done_defer", "ended_msg")]:
        check(reachable(edges, src, dst), name + ": audio-rate completion path " + src + " -> " + dst)
    check(boxes["ended_msg"]["text"] == "prepend ended" and direct(patch, "ended_msg", 0, "controller", 0),
          name + ": completion token returns to controller")

    registry = patch["parameters"]
    all_parameters = {id: box for id, box in boxes.items() if box.get("parameter_enable")}
    check(all_parameters, name + ": parameter-enabled UI exists")
    visible_names = set()
    longnames = []
    for id, box in all_parameters.items():
        attrs = box["saved_attribute_attributes"]["valueof"]
        longname, shortname = attrs["parameter_longname"], attrs["parameter_shortname"]
        longnames.append(longname)
        check(registry.get(id) == [longname, shortname, 0], name + ": parameter registration " + id)
        check(attrs.get("parameter_order") == (0 if id == "cmpe_state" else 1), name + ": ordered saved-state restore " + id)
        if attrs["parameter_type"] != 3:
            visible_names.add(longname)
            check(attrs["parameter_invisible"] == 0, name + ": parameter visible to automation " + id)
            value = attrs["parameter_initial"][0]
            check(attrs["parameter_mmin"] <= value <= attrs["parameter_mmax"], name + ": parameter initial value within bounds " + id)
            check(reachable(edges, id, "controller"), name + ": parameter updates reach runtime " + id)
    check(len(longnames) == len(set(longnames)), name + ": parameter names unique")
    banks = registry["parameterbanks"]
    listed = []
    for bank in banks.values():
        check(len(bank["parameters"]) == 8, name + ": eight parameter slots per bank")
        listed += [p for p in bank["parameters"] if p != "-"]
    check(set(listed) == visible_names and len(listed) == len(visible_names), name + ": every automatable parameter appears once in banks")
    blob = boxes["cmpe_state"]
    check("@bindto controller" in blob["text"] and blob["saved_attribute_attributes"]["valueof"]["parameter_type"] == 3
          and blob["saved_attribute_attributes"]["valueof"]["parameter_invisible"] == 1,
          name + ": device state is bound and stored, not hidden")

    visible = [b for b in boxes.values() if b.get("presentation") and not b.get("hidden")]
    for b in visible:
        x, y, w, h = b["presentation_rect"]
        check(x >= 0 and y >= 0 and x + w <= 1100 and y + h <= 169, name + ": visible control within host bounds " + b["id"])
    for id in ["status", "progress", "play_button", "stop_button", "new_button", "monitor_level", "original_link"]:
        check(boxes[id] in visible, name + ": critical control/status visible " + id)
    for b in boxes.values():
        if b["maxclass"] in ("message", "newobj"):
            check(not re.match(r"(?:dac~\b|ezdac~\b|adstatus\b|startwindow\b|;\s*dsp\b)", b.get("text", "")),
                  name + ": no global audio/hardware control " + b["id"])
    for dependency in patch["dependency_cache"]:
        read_dependency(dependency["name"])
    check(boxes["new_button"]["text"] == ("GENERATE" if mode in (0, 4) else "RANDOMIZE" if mode == 3 else "RESET"),
          name + ": action label matches instrument behavior")
    return {"device": name, "objects": len(boxes), "cords": len(patch["lines"]),
            "automatable_parameters": len(visible_names), "source_matches_amxd": True}


def main():
    results = [inspect(name, mode) for mode, name in enumerate(NAMES)]
    for path in DEVICES.glob("cmpe_*_voice.maxpat"):
        patch = json.loads(path.read_text())["patcher"]
        for entry in patch["boxes"]:
            box = entry["box"]
            check(not re.match(r"(?:dac~\b|ezdac~\b|adstatus\b)", box.get("text", "")), path.name + ": voice does not own hardware")
    print(json.dumps({"checks": checks, "devices": results, "native_live_execution": False}, indent=2))


if __name__ == "__main__":
    main()
