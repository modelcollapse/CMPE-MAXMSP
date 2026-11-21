# Unfrozen Max for Live packaging

`m4l_packaging.py` writes the real chunked `.amxd` format. It does not rename a
`.maxpat`, embed dependencies, or claim that native Max/Live has validated a
device. Use native Max's Freeze Device command for a self-contained release.

## Builder interface

```python
from m4l_packaging import prepare_device, write_amxd, read_amxd

# document is the complete {"patcher": {...}} JSON object.
document = prepare_device(document, device_type="instrument", width=1100)
write_amxd("max-for-live/CMPE_APG.amxd", document, device_type="instrument")
assert read_amxd("max-for-live/CMPE_APG.amxd").patcher == document
```

`prepare_device` returns a deep copy, supplies presentation/project metadata,
and leaves the caller's graph and parameter definitions intact. `write_amxd`
preserves the prepared width. `pack_amxd(document, device_type)` returns bytes;
`unpack_amxd(bytes)` returns an `AMXDDocument`. Its `.patcher` is the **complete**
JSON document, `.device_type` is the canonical type string, and `.chunks`/
`.metadata` retain the original binary data. `.to_bytes()` returns the original
chunks exactly; use `pack_amxd` to serialize a modified `.patcher`.

CLI commands are `pack SOURCE.maxpat OUTPUT.amxd --type instrument --width 1100`,
`inspect DEVICE.amxd`, and `unpack DEVICE.amxd OUTPUT.maxpat`.

## Format evidence

The authoritative implementation inspected was Ableton's
[AMXD parser](https://github.com/Ableton/maxdevtools/blob/5b39dec9a203d2747ff1d08e10c849742a4e654a/maxdiff/amxd_textconv.py).
It reads four-character tags followed by unsigned 32-bit **little-endian payload
lengths**. Unfrozen devices contain these chunks:

| Offset | Data | Meaning |
| --- | --- | --- |
| 0 | `ampf`, length 4 | Device type chunk |
| 8 | `iiii` | Instrument; `aaaa` is audio effect, `mmmm` MIDI effect |
| 12 | `meta`, length 4 | Opaque metadata |
| 20 | Four zero bytes | Metadata used by the official unfrozen CPU Reporter |
| 24 | `ptch`, length N | Patcher chunk |
| 32 | UTF-8 JSON, terminal NUL | N counts bytes including the NUL |

The official reader also accepts JSON without a terminal NUL. It identifies
frozen payloads by the `mx@c` prefix and encrypted devices by a `ciph` chunk.
This module rejects those formats explicitly. Metadata is preserved when
reading; no undocumented interpretation of its flags is assumed.

## Host metadata

The official unfrozen examples contain `patcher.project.amxdtype` as a serialized
FourCC integer: **1768515945** for Instrument (`iiii`), **1633771873** for Audio
(`aaaa`), and **1835887981** for MIDI (`mmmm`). This differs from the Inspector's
[documented enum](https://docs.cycling74.com/reference/project/), where Instrument
is 3. The writer checks that the serialized project type matches the container.

`devicewidth` is a patcher number; the official Connection Kit's JSON Video
device uses 230.0. The helper sets the requested width, `openinpresentation: 1`,
and `openrect: [0, 0, width, 169]`. Cycling '74 documents the
[169-pixel device height and saved fixed-width behavior](https://docs.cycling74.com/userguide/m4l/live_userinterfaces/).

Live controls need their own `parameter_enable: 1` and
`saved_attribute_attributes.valueof` definitions. The official examples register
each parameter in `patcher.parameters` as
`object_id: [long_name, short_name, 0]`, with `parameterbanks` and
`inherited_shortname: 1`. The helper preserves these definitions; it does not
invent controls or parameter IDs. Stable unique long names matter for recall,
as explained in Ableton's
[production guidelines](https://github.com/Ableton/maxdevtools/blob/5b39dec9a203d2747ff1d08e10c849742a4e654a/m4l-production-guidelines/m4l-production-guidelines.md).

## Dependencies and verification limits

Keep the complete device folder together. An unfrozen `.amxd` contains its main
patcher only: JavaScript, abstractions, and demo audio must remain available
through the actual paths used by the builder/runtime. Arbitrarily placing
support files in a subfolder does not make them discoverable. Max's
[project/search-path rules](https://docs.cycling74.com/userguide/search_path/)
still apply. The helper preserves supplied project contents, dependency cache,
and search paths, and does not add machine-specific paths.

Byte and JSON checks were run against these real official fixtures, downloaded
outside this repository and not redistributed:

| Fixture | Source revision | SHA-256 |
| --- | --- | --- |
| `maxdiff/tests/test_files/Test.amxd` | Ableton/maxdevtools `5b39dec9a203d2747ff1d08e10c849742a4e654a` | `c62046f4d870108ea8952973759d8d340728bd9eb7a178be6622ac9edb95b7ba` |
| `cpu-reporter/CPU Reporter.amxd` | Same revision | `0487da6ae9f51ce21e34fcdd519c2a6005d826072d5dc1392432194161042ef0` |
| `maxdiff/tests/test_files/FrozenTest.amxd` | Same revision | `61f350d9dd92600771f941930a17ba2247fa2df22e8555ef982e0ce4f66b1fb0` |
| `JSON Video/JSON Video.amxd` | Ableton/m4l-connection-kit `ede1772387f75cf4b187c4f750f704b5dcbe0731` | `a6c8c9e4e91c8654829ef560ac8335850f24877f4d1375e680052675272ce6cc` |

All three unfrozen fixtures passed exact chunk-byte round trips and semantic
JSON repacking. The frozen fixture was rejected as intended. Generated
containers passed round trips for every supported type, including UTF-8 text,
NUL and non-NUL payloads. Corrupt lengths, truncated/duplicate type chunks,
unknown types, invalid widths, and non-finite JSON were rejected.

These are container and static metadata checks. Native loading, dependency
resolution, sound, Live Set recall, automation, multiple device instances, and
Freeze Device still require Max/Ableton Live testing.
