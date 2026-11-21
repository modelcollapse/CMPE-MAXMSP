# CMPE Variety Pack for Max

**Max/MSP adaptations of [Joo Won Park’s Computer Music Practice Examples](https://joowonpark.net/cmpe/).** The original musical ideas and SuperCollider algorithms are his. This project brings APG, ISJS, Many, RMHS, and SIOE into one simple interface, extending the existing APG Wave patch.

## Download and open

1. **[Download the complete project ZIP](https://github.com/modelcollapse/apg-wave/archive/refs/heads/main.zip)**, or choose **Code → Download ZIP** on this repository.
2. Extract the ZIP into a folder on your computer.
3. Open **`CMPE_Variety_Pack.maxpat`** in Max.
4. The three included demo samples load automatically. Choose an instrument and press **PLAY** or **START**.

Keep all the files in the extracted folder together. The main patch needs its JavaScript files, voice patches, and demo audio beside it. Downloading only a `.maxpat` file is insufficient. Downloading the ZIP does not open it in Max; extract it first.

The collection is designed for **Max 8 or Max 9**, using stock Max/MSP objects and the legacy `js` object. No third-party externals, Node.js, or Python are required to play it. Close older copies before opening this version. Use **TEST SOUND** to check Max’s selected audio output.

**Native Max was unavailable during development.** The models, rendered samples, controller behavior, and patch connections have automated checks; actual Max object loading, audible output, mouse interaction, and disk recording still require verification in Max. See [validation details](developer/CMPE_VALIDATION.md).

## Five instruments

| Instrument | What it does | Sources | How it starts |
| --- | --- | --- | --- |
| **APG** | Generates an audio palindrome with matching forward and backward halves | Three samples | Renders a waveform, then plays |
| **ISJS** | Granulates samples; move in the pad to change position and density | Three samples | Starts live |
| **Many** | Builds overlapping pitched layers through seven stereo allpass stages | Sample 1 | Starts live, with 2–4 second fades |
| **RMHS** | Generates an evolving drone from sine-wave harmonics | No samples | Starts live, with 3–20 second attacks |
| **SIOE** | Combines slices into a short supercut or a gradually growing and shrinking sequence | Sample 1 | Renders a waveform, then plays |

Only the source controls needed by the selected instrument are shown. Use **LOAD** to choose mono or stereo WAV/AIFF files while stopped. **DEMO** reloads the included synthetic samples.

ISJS and Many continue until stopped. RMHS finishes automatically after its planned voices fade out. Its displayed duration includes the slow attacks and releases, so it can exceed the duration setting. Many and RMHS identify their fade-ins in the status area.

## Interface previews

These images are rendered from the shipped Max patch layout and its controller state. APG and SIOE show output generated from the included demo sounds by the production renderer. They are **interface previews, not native Max screenshots**; live instruments are shown stopped.

### APG

![APG interface preview showing its rendered stereo palindrome waveform](docs/images/apg-interface-preview.png)

<details>
<summary>ISJS: position and density pad</summary>

![ISJS interface preview with three sample rates, levels, and position-density pad](docs/images/isjs-interface-preview.png)

</details>

<details>
<summary>Many: ambient sample layers</summary>

![Many interface preview showing layer level, maximum delay, interval, and pitch set](docs/images/many-interface-preview.png)

</details>

<details>
<summary>RMHS: harmonic drone</summary>

![RMHS interface preview showing harmonic drone controls and live output scopes](docs/images/rmhs-interface-preview.png)

</details>

<details>
<summary>SIOE: rendered audio supercut</summary>

![SIOE interface preview showing its rendered stereo supercut waveform](docs/images/sioe-interface-preview.png)

</details>

## Common controls

| Control | Behavior |
| --- | --- |
| **PLAY / START** | Generates and plays APG/SIOE when needed, or starts a live instrument. Later PLAY presses reuse the cached finite result. |
| **STOP / CANCEL** | Stops playback, cancels generation, clears live tails and scheduled events, and ends recording. |
| **NEW** | Generates another APG/SIOE result and leaves it ready to play. |
| **RESET / RANDOMIZE** | Restores ISJS/Many defaults, or chooses new RMHS starting controls, while stopped. |
| **Waveform** | APG/SIOE: drag across either channel to select a playback range. |
| **Loop selected range / FULL RANGE** | Repeat the selected range, or restore the full finite result. |
| **Live scopes** | Show the current signal in ISJS, Many, and RMHS. |
| **Vol (dB)** | Changes listening volume. It does not change exported or recorded audio. |
| **SAVE SET / LOAD SET** | Save or restore instrument settings and source paths in a JSON file. |

Changing instruments stops the previous one and its recording. ISJS rates, levels, and position/density pad remain editable during playback. Many controls affect new layers. RMHS controls are locked until its performance stops.

Finite generation shows progress and elapsed time. Playback shows a moving playhead and time. A remaining quiet opening in a rendered result is identified with a countdown to the first sound.

## Save audio

**APG and SIOE:** choose **SAVE WAV** after generation. This exports the complete cached stereo result as a 24-bit WAV. The selected loop does not limit the export.

**ISJS, Many, and RMHS:** choose **RECORD WAV** and a destination. While stopped, this arms recording for START. During a performance, it begins recording after you choose the file. **STOP REC** ends recording while the instrument continues; STOP or a mode change ends both.

Live recording is taken before the listening-volume control. Use the instrument’s source, layer, or drone levels to change the recorded level. The test tone is excluded. A settings file contains source paths and controls; it does not embed audio, a rendered result, or random seeds.

## APG’s silence trimming

APG removes long quiet edges while preserving the palindrome. An opening of at least **250 ms** is shortened to approximately **25 ms** before the first sample above **−100 dBFS** in either channel. The same number of samples is removed from the end. Internal pauses remain. An entirely silent or subthreshold result keeps its length and receives a status message.

Waveform, playback, loop selection, and export all use the trimmed result. SIOE uses its own supercut structure and does not apply APG’s symmetric trimming.

## Standalone APG Wave

**`APG_Wave.maxpat`** remains the standalone APG Wave version 5. Its audio engine and controls are unchanged by this extension. Open it if you only want the palindrome generator.

- [CMPE collection: complete usage and troubleshooting](docs/CMPE_USAGE.md)
- [Standalone APG Wave: usage and troubleshooting](docs/USAGE.md)
- [Original-project attribution and implementation provenance](ATTRIBUTION.md)
- [Change history](CHANGELOG.md)

## Project files

| File or folder | Purpose |
| --- | --- |
| `CMPE_Variety_Pack.maxpat` | Main five-instrument collection to open in Max |
| `cmpe_variety.js` | Complete controller and finite-rendering runtime |
| `cmpe_xy.js` | ISJS position/density pad |
| `cmpe_sample_voice.maxpat` | Live sample voice for ISJS |
| `cmpe_many_voice.maxpat` | Ambient layer and allpass network for Many |
| `cmpe_drone_voice.maxpat` | Harmonic voice for RMHS |
| `APG_Wave.maxpat`, `apg_wave.js` | Preserved standalone APG Wave |
| `apgw_test1.wav`, `apgw_test2.wav`, `apgw_test3.wav` | Synthetic demonstration sounds |
| `developer/` | Source modules, patch builders, and automated checks |
| `docs/` | Operating instructions |

## Development

Run these commands from the repository’s root folder. Python 3 builds the patch files; Node.js runs the automated checks.

```sh
python3 developer/build_apg_wave.py
python3 developer/build_cmpe_voices.py
python3 developer/build_cmpe_variety.py

node developer/validation/test_apg.js
node developer/validation/test_render.js
node developer/validation/test_wave_controller.js
node developer/validation/test_cmpe_model.js
node developer/validation/test_cmpe_controller.js
node developer/validation/test_cmpe_controller.js --bundle
```

Edit the separate modules in `developer/`, then rebuild and reopen the patch. Editing only a generated runtime will lose the change on the next build. The controller tests simulate Max buffers, tasks, files, UI objects, and messages; they do not run the native audio engine.

To regenerate the interface previews, run `python3 developer/build_cmpe_previews.py`. This documentation step requires Python's Pillow package and Node.js. It renders the current patch layout and production controller state, including demo-audio output for APG and SIOE.

See [CMPE implementation and validation](developer/CMPE_VALIDATION.md) for the source mappings, intentional DSP differences, resource limits, completed checks, and remaining native acceptance work. The [APG validation record](developer/VALIDATION.md) covers the retained palindrome engine.

## Original project

**Original CMPE instruments and SuperCollider algorithms: Joo Won Park.** His [CMPE project page](https://joowonpark.net/cmpe/) links the original instruments, code, explanations, and Variety Pack. The [original APG page](https://joowonpark.net/apg/) provides its app and source and requests proper credit when the idea is used in another project. Both Max entry points include visible credit and a link to the original work.
