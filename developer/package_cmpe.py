"""Build and verify the curated, complete standalone CMPE Max download.

Run after rebuilding the runtime and interface previews:
    python3 developer/package_cmpe.py

The download has one stable folder name, CMPE_Max. The version belongs in its
guide and manifest. The legacy APG entry point, Max for Live edition, and build
sources remain in the source repository rather than cluttering this playable
folder. Relative documentation links to omitted files point to that repository.
"""

from __future__ import annotations

import argparse
import hashlib
import json
import posixpath
import re
from pathlib import Path
from urllib.parse import quote, urlsplit
import zipfile


ROOT = Path(__file__).resolve().parent.parent
VERSION = "1.3.0"
FOLDER = "CMPE_Max"
MAIN = "CMPE_Variety_Pack.maxpat"
REPOSITORY = "https://github.com/modelcollapse/CMPE-MAXMSP"
REQUIRED = [
    MAIN,
    "cmpe_variety.js",
    "cmpe_xy.js",
    "cmpe_sample_voice.maxpat",
    "cmpe_many_voice.maxpat",
    "cmpe_drone_voice.maxpat",
    "apgw_test1.wav",
    "apgw_test2.wav",
    "apgw_test3.wav",
    "README.md",
    "ATTRIBUTION.md",
    "START_HERE.html",
    "docs/CMPE_USAGE.md",
] + ["docs/images/" + mode + "-interface-preview.png"
     for mode in ["apg", "isjs", "many", "rmhs", "sioe"]]
OPTIONAL = [
    "docs/images/all-instruments-overview.png",
    "docs/images/apg-feedback-states.png",
]

PLAYABLE_README = """# CMPE Variety Pack for Max — 1.3.0

**Open `CMPE_Variety_Pack.maxpat` in Max.** It contains all five instruments.

Keep this entire `CMPE_Max` folder together. The scripts, voice patches, and
demo samples are required beside the main patch. `START_HERE.html` is the
illustrated short guide; open it in a web browser.

## Start

1. Extract the complete ZIP and close any older copy of the patch.
2. Open `CMPE_Variety_Pack.maxpat` in Max 8 or Max 9.
3. Choose your audio output in the top controls or AUDIO SETUP. Use TEST SOUND
   to check the output.
4. The included demo samples load automatically. Choose an instrument and use
   GENERATE + PLAY for APG/SIOE, or START for ISJS/Many/RMHS.

No third-party externals, Python, or Node.js are needed to play this folder.

## Five instruments

| Instrument | Sources | Behavior |
| --- | --- | --- |
| APG | Three samples | Generates a mirrored audio palindrome |
| ISJS | Three samples | Live grains shaped with a position/density pad |
| Many | Sample 1 | Ambient layers, with 2–4 second fade-ins |
| RMHS | No samples | Harmonic drone, with 3–20 second attacks |
| SIOE | Sample 1 | A rendered short or gradually developing supercut |

## Controls and feedback

LOAD buttons have solid charcoal backgrounds with bold white labels. Rounded
buttons use a distinct accent for each selected instrument: APG blue, ISJS teal,
Many purple, RMHS copper, and SIOE rose. Original-author credit is at the bottom.

Each sample card has a waveform and REC IN button. Select your input device,
then REC IN captures input channels 1 and 2 into that slot for up to 60 seconds.
Press the same button again or STOP to finish. A failed or cancelled take keeps
the previous sample. APG/ISJS share three slots; Many/SIOE use sample 1.
The sample card's SAVE button writes a new recording as a 24-bit WAV. Save new
samples before SAVE SET, which stores their file paths.

APG repeat and pitch fields are larger and have minus/plus step buttons.
Repeat steps are one; pitch-range steps are 0.1. Direct number entry still works.

GENERATE + PLAY builds the finite result and plays it. PLAY reuses the prepared
result. NEW TAKE generates another randomized result and leaves it ready.
STOP/CANCEL stops audio or preparation. The state badge distinguishes loading,
silence checking, rendering, ready, playback, and changes pending.

Drag over either APG/SIOE waveform to select a range. Loop selected range repeats
it; FULL RANGE restores the complete piece. Automatic waveform view scaling only
changes the display, not playback or export level. Live scopes display the
current signal, not a stored recording. The small source waveforms appear as
samples load; the large output waveform appears after generation.

SAVE WAV exports the complete APG/SIOE result as 24-bit stereo WAV. RECORD WAV
captures a live instrument; while stopped it arms capture for START. STOP REC
ends recording while the performance continues. SAVE SET stores settings and
sample paths, not embedded audio or rendered results.

## Included files

The main patch is `CMPE_Variety_Pack.maxpat`. `cmpe_variety.js`, `cmpe_xy.js`, the
three `cmpe_*_voice.maxpat` files, and the three `apgw_test*.wav` files support it.
The `docs` folder contains the usage guide and explicitly labelled interface
previews. `MANIFEST.json` records the version and file hashes.

[Start guide](START_HERE.html) · [Detailed usage](docs/CMPE_USAGE.md) ·
[Attribution](ATTRIBUTION.md) ·
[Source repository](https://github.com/modelcollapse/CMPE-MAXMSP)

## Credit and verification

Original musical ideas and algorithms: **Joo Won Park**.
[Original CMPE project](https://joowonpark.net/cmpe/) ·
[Original APG project](https://joowonpark.net/apg/).

Automated checks cover the models, controller, rendered samples, layout, and
patch connections. Native Max UI, audio output, mouse interaction, and disk
recording still require verification in Max. The interface images are generated
previews, not native Max screenshots.
"""


def digest(data: bytes) -> str:
    return hashlib.sha256(data).hexdigest()


def portable_markdown(name: str, data: bytes, included: set[str]) -> bytes:
    """Preserve docs, while keeping links useful in a smaller playable pack."""
    text = data.decode("utf-8")

    def replace(match: re.Match[str]) -> str:
        image, label, target = match.groups()
        parsed = urlsplit(target)
        if parsed.scheme or parsed.netloc or target.startswith("#"):
            return match.group(0)
        relative = posixpath.normpath(posixpath.join(posixpath.dirname(name), parsed.path))
        if relative in included:
            return match.group(0)
        # Repository documentation references build details and other editions
        # intentionally omitted from the standalone download.
        if relative.startswith("../") or relative.startswith("/"):
            raise ValueError("Documentation link escapes the repository: " + target)
        base = ("https://raw.githubusercontent.com/modelcollapse/CMPE-MAXMSP/main/"
                if image else REPOSITORY + "/blob/main/")
        suffix = ("?" + parsed.query if parsed.query else "")
        suffix += ("#" + parsed.fragment if parsed.fragment else "")
        return image + "[" + label + "](" + base + quote(relative, safe="/") + suffix + ")"

    text = re.sub(r"(!?)\[([^\]]*)\]\(([^\s)]+)\)", replace, text)
    return text.encode("utf-8")


def payloads() -> tuple[dict[str, bytes], dict]:
    missing = [name for name in REQUIRED if not (ROOT / name).is_file()]
    if missing:
        raise FileNotFoundError("Rebuild before packaging; missing: " + ", ".join(missing))
    names = REQUIRED + [name for name in OPTIONAL if (ROOT / name).is_file()]
    included = set(names)
    assert len(included) == len(names), "Duplicate package paths"
    for name in names:
        assert not (ROOT / name).is_symlink(), "Only regular package files are supported: " + name

    contents = {name: (ROOT / name).read_bytes() for name in names}
    contents["README.md"] = PLAYABLE_README.encode("utf-8")
    main = json.loads(contents[MAIN])["patcher"]
    assert VERSION in main.get("title", ""), "The generated main patch has a different version"
    assert b"CMPEUIFeedback" in contents["cmpe_variety.js"], "Rebuild the runtime with its feedback adapter"
    assert b"CMPEInputState" in contents["cmpe_variety.js"], "Rebuild the runtime with sample input recording"
    for name, data in contents.items():
        if name.endswith(".maxpat"):
            patch = json.loads(data)["patcher"]
            for dependency in patch.get("dependency_cache", []):
                target = dependency["name"]
                if target.endswith((".js", ".maxpat", ".wav", ".aif", ".aiff")):
                    assert target in included, "Missing patch dependency: " + target
    for name in list(contents):
        if name.endswith(".md"):
            contents[name] = portable_markdown(name, contents[name], included)

    manifest = {
        "name": "CMPE Variety Pack for Max",
        "version": VERSION,
        "folder": FOLDER,
        "main_file": MAIN,
        "native_max_verified": False,
        "source_repository": REPOSITORY,
        "distribution": "Complete standalone Max patch with adjacent dependencies",
        "files": [{"path": name, "bytes": len(data), "sha256": digest(data)}
                  for name, data in sorted(contents.items())],
    }
    contents["MANIFEST.json"] = (json.dumps(manifest, indent=2) + "\n").encode("utf-8")
    return contents, manifest


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--output", type=Path, default=ROOT / "dist" / (FOLDER + ".zip"))
    parser.add_argument("--check-only", action="store_true",
                        help="Validate the current package inputs without writing an archive")
    args = parser.parse_args()
    contents, manifest = payloads()
    if args.check_only:
        print(json.dumps({"version": VERSION, "main_file": MAIN,
                          "files": len(contents), "input_validation": "passed"}, indent=2))
        return

    output = args.output.resolve()
    output.parent.mkdir(parents=True, exist_ok=True)
    with zipfile.ZipFile(output, "w", compression=zipfile.ZIP_DEFLATED, compresslevel=9) as archive:
        for name, data in sorted(contents.items()):
            entry = zipfile.ZipInfo(FOLDER + "/" + name, date_time=(2026, 11, 21, 0, 0, 0))
            entry.compress_type = zipfile.ZIP_DEFLATED
            entry.external_attr = 0o100644 << 16
            archive.writestr(entry, data)
    with zipfile.ZipFile(output) as archive:
        assert archive.testzip() is None, "ZIP CRC verification failed"
        assert set(archive.namelist()) == {FOLDER + "/" + name for name in contents}
        saved = json.loads(archive.read(FOLDER + "/MANIFEST.json"))
        assert saved == manifest, "Manifest readback mismatch"
        for item in saved["files"]:
            data = archive.read(FOLDER + "/" + item["path"])
            assert len(data) == item["bytes"] and digest(data) == item["sha256"], item["path"]
        assert json.loads(archive.read(FOLDER + "/" + MAIN))["patcher"].get("openinpresentation") == 1
    print(json.dumps({"path": str(output), "folder": FOLDER, "version": VERSION,
                      "main_file": MAIN, "files": len(contents),
                      "bytes": output.stat().st_size, "sha256": digest(output.read_bytes()),
                      "zip_crc_and_manifest": "passed", "native_max_verified": False}, indent=2))


if __name__ == "__main__":
    main()
