# CMPE Max for Live 0.1.0: verification

Verification date: **November 21, 2026**.

**Native Ableton Live and Max were unavailable in this environment.** This record describes completed file, graph, JavaScript, simulated-host, and rendered-buffer checks. It does not establish native object loading, audible Live output, real parameter recall, offline export, or successful device freezing. The remaining host work is listed in NATIVE_LIVE_CHECKS.md.

## Completed checks

| Check | Result | What this establishes |
| --- | --- | --- |
| Max for Live controller, modular sources | 15 scenarios, 188 checks, no failures | Host lifecycle, triggering, restoration, and source-load behavior against simulated Max boundaries |
| Max for Live controller, distributed JavaScript bundle | 15 scenarios, 188 checks, no failures | The shipped bundle exercises the same integration behavior |
| Finite saved-result reconstruction | 1,377 PCM frames compared exactly | APG/SIOE reconstruct the same tested audio from saved seeds and sources, even when the simulated host rate changes |
| Independent device/container/graph inspection | 3,453 checks across five devices, passed | Binary framing, source equivalence, dependencies, MIDI routing, stereo signal paths, parameter metadata, and presentation bounds |
| Existing standalone controller regression | 45 scenarios, 7,398 checks, 5,182 rendered frames, no failures | Adding the validated snapshot/restore host hooks preserved the existing checked standalone behavior |
| Existing CMPE musical models | 15 cases, 9,229 checks, passed | The reused musical-model cases remain valid |
| Legacy JavaScript parsing | Both shipped JS files pass ES5 parsing | Syntax is compatible with the legacy `js` / `jsui` language level |
| Interface previews | Five individual images and one overview, text-fit checks passed | The generated presentation layouts fit their declared 1100 × 169 device area |

Check counts include individual assertions and structural comparisons; they are not counts of native Live tests. The finite audio comparisons use the production renderer with simulated buffer I/O.

## Behaviors exercised

The host integration suite checks initialization after `live.thisdevice`, preservation of restored parameter values, fixed device modes, required-only demo loading, and the absence of global driver commands. It verifies MIDI velocity, last-note priority, channel-aware note release, latch operation, and manual start independence.

APG/SIOE checks establish that PLAY or a MIDI note cannot silently begin rendering; notes received during generation or saved-result reconstruction are not queued. Visible rendering status is exercised. Loop automation updates the native transport messages, generation changes invalidate the next trigger appropriately, and new generation uses a new seed.

State checks include changed host sample rate, loop endpoints, portable demo references, external custom paths, changed source geometry, both XY restoration orders, a save during a pending native source read, deactivation during deferred restoration, deactivation during reconstruction, malformed state while a note is active, independent buffer namespaces, and task cleanup on deletion.

The independent graph validator parses AMXD chunks without importing the packer's decoder. It checks that every instrument's packed patch equals its `.maxpat` source, both channels reach `plugout~` through output and velocity gain, the meters measure the delivered output, MIDI tuple fields are wired in the right order, and source files are present. It also checks the audio-rate finite counter and deferred completion-token path, parameter registry/banks, presentation bounds, and exclusion of standalone hardware controls.

## Container evidence

The unfrozen AMXD format was checked against Ableton's public [parser](https://github.com/Ableton/maxdevtools/blob/5b39dec9a203d2747ff1d08e10c849742a4e654a/maxdiff/amxd_textconv.py) and three official unfrozen device examples. Those examples passed lossless chunk round trips and semantic JSON repacking. An official frozen example was explicitly rejected by this unfrozen-only helper. Fixtures are not redistributed.

Each supplied instrument uses the `ampf` / `iiii` type, four-byte `meta` payload, and UTF-8 JSON `ptch` payload with a counted terminal NUL. Instrument project metadata uses its serialized FourCC integer. This is actual AMXD framing; native host compatibility still needs confirmation.

## Reproduce from the full source repository

These commands run from the root of the [CMPE-MAXMSP repository](https://github.com/modelcollapse/CMPE-MAXMSP). Python and Node.js are only needed for development. Pillow is needed only for preview generation.

```sh
python3 developer/build_cmpe_variety.py
python3 developer/build_m4l_bundle.py
python3 developer/build_cmpe_m4l.py
node developer/validation/test_cmpe_m4l.js
node developer/validation/test_cmpe_m4l.js --bundle
python3 developer/validation/test_m4l_graph.py
node developer/validation/test_cmpe_controller.js --bundle
python3 developer/build_m4l_previews.py
python3 developer/package_cmpe_m4l.py
```

The generated device files and support files are all in `max-for-live/`. The packager checks device/source equivalence and dependency presence, adds a SHA-256 manifest, and verifies the completed ZIP before returning its path.
