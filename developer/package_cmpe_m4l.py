"""Package the complete M4L folder, with hashes and a verified portable ZIP."""

from __future__ import annotations

import argparse
import hashlib
import json
from pathlib import Path
import zipfile

from m4l_packaging import read_amxd


ROOT = Path(__file__).resolve().parent.parent
DEVICES = ROOT / "max-for-live"
VERSION = "0.1.0-preview"
FOLDER = "CMPE_Max_for_Live_v" + VERSION


def digest(data):
    return hashlib.sha256(data).hexdigest()


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--output", type=Path, default=ROOT.parent / (FOLDER + ".zip"))
    args = parser.parse_args()
    for mode in ["APG", "ISJS", "Many", "RMHS", "SIOE"]:
        path = DEVICES / ("CMPE_" + mode + ".amxd")
        doc = read_amxd(path)
        assert doc.device_type == "instrument", path
        assert doc.patcher == json.loads(path.with_suffix(".maxpat").read_text()), path
        for dependency in doc.patcher["patcher"]["dependency_cache"]:
            assert (DEVICES / dependency["name"]).is_file(), dependency["name"]
    for name in ["README.md", "START_HERE.html", "VALIDATION.md", "NATIVE_LIVE_CHECKS.md", "ATTRIBUTION.md"]:
        assert (DEVICES / name).is_file(), name
    files = sorted(path for path in DEVICES.rglob("*") if path.is_file()
                   and path.name != "MANIFEST.json" and "__pycache__" not in path.parts)
    assert all(not path.is_symlink() for path in files), "Only regular package files are supported"
    manifest = {
        "name": "CMPE Max for Live",
        "version": VERSION,
        "native_live_verified": False,
        "distribution": "unfrozen devices with adjacent dependencies",
        "source_repository": "https://github.com/modelcollapse/CMPE-MAXMSP",
        "files": [{"path": path.relative_to(DEVICES).as_posix(),
                   "bytes": path.stat().st_size, "sha256": digest(path.read_bytes())} for path in files],
    }
    manifest_path = DEVICES / "MANIFEST.json"
    manifest_path.write_text(json.dumps(manifest, indent=2) + "\n")
    files.append(manifest_path)
    output = args.output.resolve()
    output.parent.mkdir(parents=True, exist_ok=True)
    with zipfile.ZipFile(output, "w", compression=zipfile.ZIP_DEFLATED, compresslevel=9) as archive:
        for path in sorted(files):
            member = FOLDER + "/" + path.relative_to(DEVICES).as_posix()
            info = zipfile.ZipInfo(member, date_time=(2026, 11, 21, 0, 0, 0))
            info.compress_type = zipfile.ZIP_DEFLATED
            info.external_attr = 0o100644 << 16
            archive.writestr(info, path.read_bytes())
    with zipfile.ZipFile(output) as archive:
        assert archive.testzip() is None
        assert len(archive.namelist()) == len(files)
        for record in manifest["files"]:
            content = archive.read(FOLDER + "/" + record["path"])
            assert len(content) == record["bytes"] and digest(content) == record["sha256"], record["path"]
    print(json.dumps({"path": str(output), "bytes": output.stat().st_size,
                      "files": len(files), "sha256": digest(output.read_bytes()),
                      "native_live_verified": False}, indent=2))


if __name__ == "__main__":
    main()
