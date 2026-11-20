# Build and validation

This directory is for development. To use APG, open `APG_Wave.maxpat` in the parent directory.

## Rebuild after editing

Run this command from the `APG_Wave` folder with Python 3:

```sh
python3 developer/build_apg_wave.py
```

It rebuilds the Max patch and concatenates the three source modules into `apg_wave.js`. Close the patch before rebuilding and reopen it afterward so Max loads the current runtime.

## Automated checks

These checks use Node.js. Node is not required to run the Max patch.

```sh
node developer/validation/test_apg.js
node developer/validation/test_render.js
node developer/validation/test_wave_controller.js
```

The planner checks cover 710 plans and an independent sample model. The renderer checks compare generated samples with an independent full-signal reference, exercise chunk boundaries and mixed source sample rates, and read the included WAV fixtures. The controller checks use the real planner and renderer with a simulated Max host, including Float32 buffers and a deferred-task queue.

The controller scenarios cover exact mirrored output, render progress, cached replay, NEW, dirty settings, cancellation, waveform selections, loop duration and completion tokens, STOP during selection restart, loss of audio during rendering, complete-output WAV commands, and shutdown. Version 4 adds exact symmetric trimming at 44.1 kHz and 48 kHz, odd/even centers, preservation of interior silence and quiet material, either-channel onset detection, retained 25 ms padding, the 250 ms minimum silence rule, silent-output preservation, correct shortened waveform/playback/export duration, and cancellation during the opening scan. Export checks inspect the requested operation; they do not write through Max.

The generated patch is also checked for valid object and port references, unique scripting names, duplicate connections, and presentation bounds. Its UI layout was reviewed using a layout approximation, not a native Max screenshot. The combined JavaScript parses as ES5 for the legacy `js` object.

## Native verification remains necessary

Max was unavailable in the build environment. These automated checks cannot establish native object loading, waveform drawing, physical audio output, disk-export behavior, or the timing between Max's audio and UI threads.

When running in Max, the key remaining checks are: the demo's PLAY generates a visible waveform and produces sound; dragging either channel changes the displayed and heard range; LOOP repeats it; STOP prevents restarts; and SAVE WAV produces the full trimmed stereo output. Verify that the Ready readout reports the cut at each edge and that PLAY begins close to the first sound.
