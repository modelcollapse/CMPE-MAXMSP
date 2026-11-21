"""Assemble the legacy-JavaScript runtime used by the five M4L devices.

The standalone hardware-control module is deliberately excluded. The final
adapter owns host initialization, MIDI, persistence and output activation.
"""

from pathlib import Path


ROOT = Path(__file__).resolve().parent.parent
MODULES = [
    "apg_wave_plan.js",
    "apg_render.js",
    "cmpe_model.js",
    "apg_wave_controller.js",
    "cmpe_extension.js",
    "cmpe_m4l_adapter.js",
]


def main():
    sources = [ROOT / "developer" / name for name in MODULES]
    missing = [str(path.relative_to(ROOT)) for path in sources if not path.is_file()]
    if missing:
        raise SystemExit("Missing source modules: " + ", ".join(missing))
    target = ROOT / "max-for-live" / "cmpe_m4l.js"
    target.parent.mkdir(parents=True, exist_ok=True)
    header = "/* CMPE Max for Live 0.1.0 preview. Generated; edit developer modules. */\n"
    target.write_text(header + "\n\n".join(path.read_text().rstrip() for path in sources) + "\n")
    print(f"Bundled {target.relative_to(ROOT)} from {len(sources)} source modules.")


if __name__ == "__main__":
    main()
