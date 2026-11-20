# APG Wave

**A Max/MSP adaptation of [Joo Won Park’s Audio Palindrome Generator](https://joowonpark.net/apg/).** The original idea and SuperCollider algorithm are his. APG Wave adds a rendered stereo waveform, progress feedback, loop selection, automatic trimming of silent edges, and WAV export.

Give it three samples and it makes a composition whose stored audio is the same forwards and backwards. Version 5 keeps the controls simple and places a direct link to the original project in the patch.

## Download and open

On this repository’s GitHub page, select **Code → Download ZIP**, then extract the entire archive. Open **`APG_Wave.maxpat`** in Max. Keep `apg_wave.js` and the three `apgw_test*.wav` files beside it; downloading only the `.maxpat` file is not sufficient. GitHub’s [archive download instructions](https://docs.github.com/en/repositories/working-with-files/using-files/downloading-source-code-archives) describe the same download route.

The patch is designed for **Max 8 or Max 9**, using stock Max/MSP objects and the legacy `js` object. No third-party externals, Node.js, or Python are needed to run it. Python and Node.js are only used to rebuild the patch and run developer checks.

Close an older APG patch before opening this version. The three included demo sounds load automatically. Press **PLAY** to generate a piece and hear it. To use your own material, press **STOP**, then use the three **LOAD** controls to choose mono or stereo WAV/AIFF files.

## Controls

| Control | What it does |
| --- | --- |
| **PLAY** | Generates a result when needed, then plays the selected range. Later presses reuse the same result. |
| **STOP / CANCEL** | Stops playback or cancels generation. |
| **NEW** | Generates another randomized result and leaves it ready to play. |
| **Waveform** | Shows the generated left and right channels. Drag across either channel to select a range. |
| **Loop selected range** | Repeats the selected range. With Loop off, PLAY plays the selection once. |
| **FULL RANGE** | Restores the selection to the complete output. |
| **SAVE WAV** | Saves the complete trimmed stereo result as a 24-bit WAV. |
| **DEMO** | Reloads the three included synthetic samples. |
| **TEST SOUND** | Plays a short independent tone through the audio output. |

The first generation can take time with long samples. The status distinguishes checking the opening, rendering, and playback. Rendering shows a real completion percentage and elapsed time. During playback, the cursor and time display follow the output; a remaining quiet opening is identified with a countdown to the first sound.

Changing a source, repeat count, or pitch range causes the next PLAY to generate again. Use **NEW** when you want another random arrangement without changing those settings. Source and generation controls are locked during playback and preparation.

## Trimming and saving

Automatic trimming removes long quiet edges while preserving the palindrome. Openings of at least **250 ms** are trimmed to approximately **25 ms** before the first sample above the detection threshold in either channel. Exactly the same number of samples is removed from the end. The threshold is **−100 dBFS**; pauses inside the composition remain in place. If the entire result is silent or below the threshold, its length is preserved and the status explains that it is silent or very quiet.

The waveform, playback, loop selection, and export all use the trimmed result. **SAVE WAV exports the whole result, not only the selected loop.** The listening-volume control and the short playback fades at selection edges do not affect the saved file.

See [Usage and troubleshooting](docs/USAGE.md) for the controls, status messages, and audio checks in more detail.

## Project files

| File or folder | Purpose |
| --- | --- |
| `APG_Wave.maxpat` | The patch to open in Max. |
| `apg_wave.js` | Complete runtime loaded by the patch. |
| `apgw_test1.wav`, `apgw_test2.wav`, `apgw_test3.wav` | Small synthetic demo and test samples. |
| `developer/` | Separate source modules, patch builder, and automated checks. |
| `docs/USAGE.md` | Detailed operating instructions. |
| `ATTRIBUTION.md` | Original-project credit and implementation provenance. |

## Development and validation

Run these commands from the repository’s root folder. The builder uses Python 3; the checks use Node.js and its built-in modules.

```sh
python3 developer/build_apg_wave.py
node developer/validation/test_apg.js
node developer/validation/test_render.js
node developer/validation/test_wave_controller.js
```

Edit the source modules in `developer/`, then rebuild to update both the Max patch and the combined runtime. Close and reopen the patch after rebuilding. Do not edit only the generated `apg_wave.js` if you want the change to survive another build.

The automated checks exercise the actual planner and renderer, sample symmetry, trimming, cached replay, loop timing, cancellation, and export commands. Controller tests simulate Max’s buffers and task scheduler.

**Native Max was not available in the build environment. Actual Max object loading, audio output, waveform drawing, mouse interaction, and disk export still need verification in Max.** Automated checks do not establish those native behaviors. See [developer/VALIDATION.md](developer/VALIDATION.md) for the validation scope.

## Original project

Please credit **Joo Won Park** when using the original APG idea or algorithm in your own work, as requested on his project page. Read about APG and find its original app and SuperCollider patch at **[joowonpark.net/apg](https://joowonpark.net/apg/)**. More provenance is recorded in [ATTRIBUTION.md](ATTRIBUTION.md).
