#!/usr/bin/env python3
"""Read/write the unfrozen Max for Live container used by Ableton's own tools.

The format is grounded in Ableton/maxdevtools/maxdiff/amxd_textconv.py and
its Test.amxd / CPU Reporter.amxd fixtures (commit
5b39dec9a203d2747ff1d08e10c849742a4e654a). See m4l_packaging_notes.md.
This module does not implement freezing, encryption, or native Live validation.
"""

from __future__ import annotations

import argparse
import copy
import json
import math
from dataclasses import dataclass
from pathlib import Path
import struct
from typing import Any, Iterable, Mapping


DEVICE_CODES = {
    "audio": b"aaaa",
    "midi": b"mmmm",
    "instrument": b"iiii",
    "midi-generator": b"nagg",
    "midi-transformation": b"natt",
}
DEVICE_ALIASES = {"audio-effect": "audio", "midi-effect": "midi"}
DEVICE_HEIGHT = 169
_MAX_CHUNK_SIZE = (1 << 32) - 1


class AMXDError(ValueError):
    """A malformed, inconsistent, or unsupported AMXD container."""


class UnsupportedAMXD(AMXDError):
    """A valid-looking device whose frozen/encrypted payload is unsupported."""


@dataclass(frozen=True)
class AMXDChunk:
    tag: str
    data: bytes


@dataclass(frozen=True)
class AMXDDocument:
    device_type: str
    # The complete JSON document, including the outer "patcher" key.
    patcher: dict[str, Any]
    metadata: bytes
    chunks: tuple[AMXDChunk, ...]
    null_terminated: bool

    def to_bytes(self) -> bytes:
        """Return the original chunks losslessly (does not reserialize patcher).

        To serialize modifications to .patcher, call pack_amxd instead.
        """
        return encode_chunks(self.chunks)


def _device_type(device_type: str) -> str:
    name = DEVICE_ALIASES.get(device_type, device_type)
    if name not in DEVICE_CODES:
        raise AMXDError(f"Unknown device type: {device_type!r}")
    return name


def _validate_document(document: Mapping[str, Any]) -> dict[str, Any]:
    if not isinstance(document, Mapping):
        raise AMXDError("Expected a Max JSON document with an outer 'patcher' key")
    patcher = document.get("patcher")
    if not isinstance(patcher, dict):
        raise AMXDError("The document's 'patcher' must be an object")
    for field in ("boxes", "lines"):
        if not isinstance(patcher.get(field), list):
            raise AMXDError(f"patcher.{field} must be an array")
    return patcher


def _validate_project_type(document: Mapping[str, Any], device_type: str) -> None:
    project = document["patcher"].get("project", {})
    if not isinstance(project, dict):
        raise AMXDError("patcher.project must be an object")
    expected = int.from_bytes(DEVICE_CODES[device_type], "big")
    if "amxdtype" in project and project["amxdtype"] != expected:
        raise AMXDError(
            f"project.amxdtype must be {expected} for {device_type}; "
            "the serialized value is a FourCC integer, not the Inspector enum"
        )


def decode_chunks(data: bytes) -> tuple[AMXDChunk, ...]:
    """Parse the outer little-endian chunk framing with strict bounds checks."""
    if not isinstance(data, bytes):
        raise TypeError("AMXD data must be bytes")
    chunks: list[AMXDChunk] = []
    offset = 0
    while offset < len(data):
        if len(data) - offset < 8:
            raise AMXDError(f"Truncated chunk header at byte {offset}")
        raw_tag = data[offset : offset + 4]
        if any(c < 32 or c > 126 for c in raw_tag):
            raise AMXDError(f"Invalid chunk tag at byte {offset}")
        tag = raw_tag.decode("ascii")
        size = struct.unpack_from("<I", data, offset + 4)[0]
        start, end = offset + 8, offset + 8 + size
        if end > len(data):
            raise AMXDError(
                f"Truncated {tag!r} chunk: declared {size} bytes, "
                f"only {len(data) - start} remain"
            )
        chunks.append(AMXDChunk(tag, data[start:end]))
        offset = end
    if not chunks or chunks[0].tag != "ampf":
        raise AMXDError("The first chunk must be 'ampf'")
    return tuple(chunks)


def encode_chunks(chunks: Iterable[AMXDChunk]) -> bytes:
    """Serialize chunks exactly, preserving opaque metadata and unknown tags."""
    parts: list[bytes] = []
    for chunk in chunks:
        try:
            tag = chunk.tag.encode("ascii")
        except (AttributeError, UnicodeEncodeError) as exc:
            raise AMXDError("Chunk tags must be four printable ASCII bytes") from exc
        if len(tag) != 4 or any(c < 32 or c > 126 for c in tag):
            raise AMXDError("Chunk tags must be four printable ASCII bytes")
        if not isinstance(chunk.data, bytes):
            raise TypeError("Chunk payloads must be bytes")
        if len(chunk.data) > _MAX_CHUNK_SIZE:
            raise AMXDError("AMXD chunk exceeds the unsigned 32-bit size limit")
        parts.extend((tag, struct.pack("<I", len(chunk.data)), chunk.data))
    encoded = b"".join(parts)
    decode_chunks(encoded)
    return encoded


def _single_chunk(chunks: tuple[AMXDChunk, ...], tag: str) -> bytes:
    matching = [chunk.data for chunk in chunks if chunk.tag == tag]
    if len(matching) != 1:
        raise AMXDError(f"Expected exactly one {tag!r} chunk, found {len(matching)}")
    return matching[0]


def _reject_nonfinite(value: str) -> None:
    raise AMXDError(f"Non-finite JSON number: {value}")


def unpack_amxd(data: bytes) -> AMXDDocument:
    """Decode an unfrozen, unencrypted AMXD into its complete Max JSON document."""
    chunks = decode_chunks(data)
    device_code = _single_chunk(chunks, "ampf")
    reverse = {code: name for name, code in DEVICE_CODES.items()}
    if device_code not in reverse:
        raise AMXDError(f"Unrecognized device FourCC: {device_code!r}")
    metadata = _single_chunk(chunks, "meta")
    payload = _single_chunk(chunks, "ptch")
    if any(chunk.tag == "ciph" for chunk in chunks):
        raise UnsupportedAMXD("Encrypted AMXD payloads are not supported")
    if payload.startswith(b"mx@c"):
        raise UnsupportedAMXD("Frozen AMXD payloads must be handled by native Max")
    null_terminated = payload.endswith(b"\x00")
    json_bytes = payload[:-1] if null_terminated else payload
    try:
        document = json.loads(json_bytes.decode("utf-8"), parse_constant=_reject_nonfinite)
    except (UnicodeDecodeError, json.JSONDecodeError) as exc:
        raise AMXDError(f"Invalid UTF-8 patcher JSON: {exc}") from exc
    _validate_document(document)
    device_type = reverse[device_code]
    _validate_project_type(document, device_type)
    return AMXDDocument(device_type, document, metadata, chunks, null_terminated)


def pack_amxd(
    document: Mapping[str, Any],
    device_type: str = "instrument",
    *,
    metadata: bytes = b"\x00\x00\x00\x00",
    null_terminated: bool = True,
    indent: int | None = 2,
) -> bytes:
    """Wrap a complete Max JSON document in a genuine unfrozen AMXD container.

    All lengths count UTF-8 bytes, including the terminal NUL when present.
    This function preserves the supplied devicewidth and other patcher metadata.
    It does not freeze or copy external dependencies.
    """
    device_type = _device_type(device_type)
    _validate_document(document)
    _validate_project_type(document, device_type)
    if not isinstance(metadata, bytes) or len(metadata) != 4:
        raise AMXDError("Unfrozen metadata must be four opaque bytes")
    try:
        payload = (json.dumps(document, ensure_ascii=False, allow_nan=False, indent=indent) + "\n").encode("utf-8")
    except (TypeError, ValueError, UnicodeEncodeError) as exc:
        raise AMXDError(f"Patcher document is not valid finite UTF-8 JSON: {exc}") from exc
    if null_terminated:
        payload += b"\x00"
    return encode_chunks((
        AMXDChunk("ampf", DEVICE_CODES[device_type]),
        AMXDChunk("meta", metadata),
        AMXDChunk("ptch", payload),
    ))


def read_amxd(path: str | Path) -> AMXDDocument:
    return unpack_amxd(Path(path).read_bytes())


def write_amxd(
    path: str | Path,
    document: Mapping[str, Any],
    device_type: str = "instrument",
    **kwargs: Any,
) -> Path:
    """Write a device after validation and return its path."""
    encoded = pack_amxd(document, device_type, **kwargs)
    # Verify the emitted chunk lengths and JSON before writing an artifact.
    unpack_amxd(encoded)
    output = Path(path)
    output.parent.mkdir(parents=True, exist_ok=True)
    output.write_bytes(encoded)
    return output


def prepare_device(
    document: Mapping[str, Any],
    device_type: str = "instrument",
    *,
    width: float | None = None,
) -> dict[str, Any]:
    """Return a deep copy with host metadata matching official unfrozen examples.

    The caller still supplies the audio graph, live.* parameter definitions,
    parameter registry/banks, and portable dependency paths. The project type
    deliberately uses the serialized FourCC integer, not the Inspector enum.
    """
    device_type = _device_type(device_type)
    _validate_document(document)
    prepared = copy.deepcopy(dict(document))
    patcher = prepared["patcher"]
    if width is None:
        width = patcher.get("devicewidth", 0)
        if not isinstance(width, (float, int)) or width <= 0:
            width = 640.0
    if isinstance(width, bool) or not isinstance(width, (float, int)) or not math.isfinite(width) or width <= 0:
        raise AMXDError("Device width must be a positive finite number")
    patcher.update({
        "openinpresentation": 1,
        "devicewidth": float(width),
        "openrect": [0.0, 0.0, float(width), float(DEVICE_HEIGHT)],
        "openrectmode": 0,
        "autosave": 0,
    })
    for key, value in {
        "fileversion": 1, "classnamespace": "box", "latency": 0, "is_mpe": 0,
        "minimum_live_version": "", "minimum_max_version": "",
        "platform_compatibility": 0, "dependency_cache": [],
    }.items():
        patcher.setdefault(key, value)
    parameters = patcher.setdefault("parameters", {})
    if not isinstance(parameters, dict):
        raise AMXDError("patcher.parameters must be an object")
    parameters.setdefault("parameterbanks", {})
    parameters.setdefault("inherited_shortname", 1)
    project = patcher.setdefault("project", {})
    if not isinstance(project, dict):
        raise AMXDError("patcher.project must be an object")
    defaults = {
        "version": 1,
        "viewrect": [0.0, 0.0, 300.0, 500.0],
        "autoorganize": 1, "hideprojectwindow": 1,
        "showdependencies": 1, "autolocalize": 0,
        "contents": {"patchers": {}}, "layout": {}, "searchpath": {},
        "detailsvisible": 0, "readonly": 0,
        "devpathtype": 0, "devpath": ".",
        "sortmode": 0, "viewmode": 0, "includepackages": 0,
    }
    for key, value in defaults.items():
        project.setdefault(key, value)
    project["amxdtype"] = int.from_bytes(DEVICE_CODES[device_type], "big")
    return prepared


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    commands = parser.add_subparsers(dest="command", required=True)
    pack = commands.add_parser("pack", help="Wrap a maxpat in an unfrozen AMXD")
    pack.add_argument("source", type=Path)
    pack.add_argument("output", type=Path)
    pack.add_argument("--type", default="instrument", choices=list(DEVICE_CODES))
    pack.add_argument("--width", type=float)
    unpack = commands.add_parser("unpack", help="Extract an unfrozen patcher")
    unpack.add_argument("source", type=Path)
    unpack.add_argument("output", type=Path)
    inspect = commands.add_parser("inspect", help="Validate and summarize a container")
    inspect.add_argument("source", type=Path)
    args = parser.parse_args()
    try:
        if args.command == "pack":
            document = json.loads(args.source.read_text(encoding="utf-8"))
            document = prepare_device(document, args.type, width=args.width)
            print(write_amxd(args.output, document, args.type))
        else:
            result = read_amxd(args.source)
            if args.command == "unpack":
                args.output.parent.mkdir(parents=True, exist_ok=True)
                args.output.write_text(json.dumps(result.patcher, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
                print(args.output)
            else:
                print(json.dumps({
                    "device_type": result.device_type,
                    "metadata_hex": result.metadata.hex(),
                    "null_terminated": result.null_terminated,
                    "chunks": [{"tag": c.tag, "bytes": len(c.data)} for c in result.chunks],
                    "devicewidth": result.patcher["patcher"].get("devicewidth"),
                    "native_host_verified": False,
                }, indent=2))
    except (AMXDError, OSError, json.JSONDecodeError) as exc:
        parser.exit(2, f"AMXD error: {exc}\n")


if __name__ == "__main__":
    main()
