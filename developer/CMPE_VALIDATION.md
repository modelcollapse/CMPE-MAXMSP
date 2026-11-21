# CMPE Variety Pack: implementation and validation

The new collection opens from `CMPE_Variety_Pack.maxpat`. `APG_Wave.maxpat` and its original validation scripts remain available. Musical provenance is Joo Won Park's [CMPE project](https://joowonpark.net/cmpe/) and the user-supplied `CMPE_VarietyPack_ForSC.scd`; [APG](https://joowonpark.net/apg/) is the existing finite-mode foundation.

**Native Max was unavailable during development.** A passing JavaScript test or patch-graph check does not establish native audio output, Max object compatibility, UI behavior, or successful disk recording. The checks and remaining native work are distinguished below.

## Architecture

APG and SIOE are finite generators that write a stereo output buffer before using the waveform and playback transport. APG retains its exact mirrored sample construction and symmetric silence trimming. SIOE generates its own finite event plan and uses a chunked renderer with source-rate compensation, wrapping, stereo summing, and equal-power panning. SIOE is peak-scaled only when its completed mix exceeds 0.98.

ISJS, Many, and RMHS use native `poly~` audio voices and scheduled control messages. ISJS has three continuously retriggered source streams. Many uses at most 32 overlapping ambient voices. RMHS uses up to 55 sine partials. Their scopes display a live signal rather than a stored waveform.

The controller owns tasks, voice lifetimes, mode changes, and recording state. STOP and mode changes cancel the instrument's pending work, fade and clear its live voices, and stop its recorder. They do not perform SuperCollider-style server-wide cleanup.

### Native audio settings

The last bundled module, `developer/cmpe_audio_settings.js`, manages the audio controls. The native graph uses `adstatus driver`, `adstatus option 1/2`, and `adstatus optionname 1/2` to obtain the available choices and their labels. Option indices are driver-specific; they are not assumed to mean input or output device. `adstatus output` describes channel mapping rather than hardware selection, so the patch leaves full channel mapping to Max's Audio Status window. See the official [adstatus reference](https://docs.cycling74.com/reference/adstatus/).

Menu population and current-value feedback are read-only. Only a deliberate user selection issues a setting command. A change first stops the instrument and recorder, cancels a pending test tone, and waits 30 ms for the stop fade before turning DSP off and applying the choice. The available choices are read again before the device write; a changed or missing selection is rejected rather than reusing an obsolete index. The resulting device identity and DSP state are read back. Audio remains off until the user enables it or starts an instrument. AUDIO SETUP follows the same stop path and opens the native window with `; dsp open`, as documented in [Controlling Max with Messages](https://docs.cycling74.com/userguide/controlling_max_with_messages/).

Driver, device, and DSP state are Max-wide settings. They are intentionally excluded from musical presets. A periodic read checks current state; REFRESH rebuilds the available lists after hardware changes. The native Audio Status window remains available when a driver does not expose usable option menus.

## Build and available automated checks

Run commands from the project root:

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
node developer/validation/test_cmpe_ui.js
python3 developer/build_cmpe_previews.py
python3 developer/package_cmpe.py
```

The first builder preserves the standalone APG patch/runtime. The voice builder writes the native instrument subpatches. The collection builder assembles the shared UI, audio connections, and combined legacy-JavaScript runtime. Edit the separate developer modules and rebuild rather than editing only a generated runtime file.

The retained APG checks and their scope are documented in [VALIDATION.md](VALIDATION.md). New collection-controller verification is separate from the pure-model results below; no native execution is implied by controller mocks.

## Completed pure-model validation

`test_cmpe_model.js` completed **15 test cases and 9,229 checks**. It exercises the production `CMPEModel` module with deterministic random sources.

| Area | Verified behavior |
| --- | --- |
| Envelope curves | Numeric SuperCollider-style curve equation, linear and exponential cases, exact endpoints |
| Live envelope points | Ordered breakpoints, source-envelope values, and bounded linear approximation error |
| ISJS | Different density mappings per source, independent rates/levels, timing and pan/level variation |
| Many | Exact source pitch sets, persistent microtonal collection, seven stereo allpass stages, delay ranges and stable decay coefficients |
| RMHS | Three-bank partial counts, frequencies, amplitude weights, pan ranges, duration, and omission of partials whose full drift can exceed Nyquist |
| SIOE planning | Short positions and end wrap, Long's increasing/decreasing voice counts, four-beat spacing, and the `N²` event total |
| Render bounds | 10,000-event plans and rejection of excessive output duration/memory before allocation |
| Audio oracle | Independent scalar comparison for mono/stereo sources, sample-rate differences, pan, envelope, repeated wrap, and a one-frame source |
| Chunk behavior | Bit-identical output across different chunk sizes and matching random-access reads |
| Signal handling | Unclipped model output, reported peak, explicit normalization factor, short reads and non-finite source-data errors |

The audio oracle does not use the production envelope evaluator, cache, active-event queue, or stored pan-gain fields. This gives it a separate calculation path for comparison.

The SIOE source cache requests contiguous pages of at most 2,048 frames and retains at most 256 pages; it does not load a complete source into a JavaScript array. The active-event list avoids traversing every historical event for each sequential render chunk. The plan recommends a chunk size based on concurrent voices to bound work between controller yields.

## Completed controller and distribution validation

`test_cmpe_controller.js` completed **45 scenarios, 7,398 checks, and 5,182 rendered audio frames checked**, with no failures. The same suite passed against both the separate source modules and the generated `cmpe_variety.js` distribution. It executes the actual controller and models with simulated Max tasks, buffers, UI objects, files, and native-message boundaries.

The scenarios cover all five modes, required source counts, hidden unused source controls, audio startup and cancellation, DSP shutdown and sample-rate changes, live parameter changes, Many voice reuse and retirement, stale-task cancellation, RMHS automatic completion, complete SIOE rendering and normalization, cached replay, export commands, recording state and stalled-recorder detection, settings round trips, invalid settings, and shutdown. Preset regressions check serialized native reads, late completion after a timeout, cleared empty slots, newest-preset selection, queued-restore cancellation, and startup DEMO cancellation.

Audio-control regressions check that initialization, refresh, polling, feedback, and preset restoration do not write hardware settings. They cover the stop fade and delayed test-tone cancellation, driver/device identity changes during that fade, unsupported or unconfirmed choices, external native changes, power readback, native Audio Setup recovery, and stale callbacks after STOP or shutdown. The native graph checks require every menu selection to pass through the controller before reaching an audio setting.

The retained APG suites also passed: **710 plans / 500,424 assertions**, **25 renderer plans / 907,564 checks**, and **17 controller scenarios / 1,499,742 checks**. The CMPE controller additionally checks palindrome sample symmetry after switching back from another instrument.

The 1.2.0 main builder validates **252 objects and 220 patch cords**, including connection endpoints, port indices, duplicate cords, unique scripting names, and presentation bounds/overlap. The voice builders validate their message and signal connections: sample voice **40 objects / 55 cords**, Many voice **77 / 152**, and drone voice **45 / 60**. All five interface previews use the generated **1100 × 788** presentation layout, its native color attributes, and the actual XY-pad drawing code. Text-fit and visible-overlap checks pass for all five instruments and seven captured APG states. The images were reviewed for readability. They are labelled interface previews, not native Max screenshots; no attached hardware is claimed. Both shipped CMPE JavaScript files pass an ECMAScript 5 parser check.

The standalone feedback adapter is bundled after the audio-settings module and is excluded from the Max for Live runtime. `test_cmpe_ui.js` completed **8 scenarios and 51 checks** using the real controller with the existing simulated Max boundaries. Coverage includes loading, separate silence-scan/render fractions, readiness, playback/looping, changed settings, incomplete output, native-read timeout and late completion, live fade-ins, recording-failure notice persistence, optional widgets, and idempotent installation. The existing 45-scenario controller suite also passed against the updated source modules and distributed runtime with the same 5,182 compared PCM frames.

Waveform fitting sends only the documented [`waveform~` `vzoom` display attribute](https://docs.cycling74.com/reference/waveform~/). Tests check identical scale messages on both channels, the bounded peak-derived factor, SIOE's existing post-normalization peak, and exact PCM preservation across display-only changes. The adapter does not read/write audio buffers, change gain, schedule audio, consume random values, or replace the engine's click permissions. Native Max must still confirm the exact visual scale, fonts, colors, widgets, and mouse behavior.

`developer/package_cmpe.py` validates the curated `dist/CMPE_Max.zip` download: required dependencies, generated patch version, initial presentation mode, exact ZIP member list, CRC, manifest readback, and every SHA-256 digest. One stable `CMPE_Max` folder contains the main patch and its current supporting files. Legacy entry points, development sources, and Max for Live devices remain in the full source repository. Local documentation links to excluded files are converted to canonical repository links.

These results establish modeled behavior and structural consistency. They do not execute the native MSP voices, draw Max's actual UI, or write audio through Max's native disk recorder.

## Intentional differences from the SuperCollider source

This is a DSP port with documented adaptations, **not a bit-identical reproduction of SuperCollider audio**.

### Live DSP and scheduling

Live envelopes use between 25 and 30 breakpoint points, depending on the envelope, interpreted by native `line~` objects. The continuous source curves remain available in the model. RMHS exponential breakpoints are concentrated where amplitude curvature is larger; the model test bounds their piecewise-linear absolute error below 0.006 across the 120 dB envelope range. SIOE's finite renderer evaluates the curve per sample.

RMHS pitch drift uses linear ramps rather than SuperCollider `Lag`'s exponential smoothing. The random drift update rate has a minimum of 0.001 Hz to avoid reciprocal-of-zero behavior. Partials are omitted if their base frequency plus the full positive 2% drift would reach or exceed Nyquist.

Many is bounded to 32 live voices and a 120-second maximum lifetime per layer. Voice reuse fades the oldest layer over 10 ms and waits 15 ms before reconfiguration, allowing the native delayed mute to finish. At the fastest 2.5-second event spacing, reuse can occur after about 80 seconds. STOP fades and clears all tails. The source permits tails to continue after its event routine stops.

The source's Many envelope supplies four curve values for three segments. The model uses the applicable first three: randomized positive attack curvature, then +1 and +1. The source's fourth negative curve is unused.

### Controls and finite output

ISJS uses a local XY pad rather than the pointer's global screen position. Its displayed initial rates match the source's actual start rates of 1.1, 1.03, and 1.2, correcting the original discrepancy between knob positions and startup values.

The SIOE UI consistently uses **1–1500 BPM** and **0.1–10 seconds** for hit duration. The pure model also accepts the source execution range of 1–3000 BPM and 0.00001–10 seconds, but the collection UI and restored settings apply the narrower displayed ranges. Long mode changes the slice group every four beats and preserves the final empty group in its finite schedule.

SIOE rejects output beyond 10 minutes or 200 MiB of stereo Float32 storage, whichever limit is reached first. The rendered mix is left unclipped by the model; the controller normalizes the completed buffer to 0.98 only when required. Source sample-rate differences are accounted for explicitly, and an end-of-file slice position wraps to frame zero.

RMHS's duration parameter constructs the sustain and release sections; the displayed progress uses the actual planned longest voice including attack. Completion returns transport to a ready state.

### State, files, and recording

All modes have initialized voice definitions; ISJS and RMHS do not depend on another mode having been started first. Mode changes cancel old callbacks. Stop behavior is consistent, including live recording. Invalid or unavailable sources and settings produce status feedback.

SAVE SET / LOAD SET use JSON files rather than the source's single temporary in-memory slot. Controls and source paths are saved; audio files, rendered buffers, performance history, and random seeds are not embedded. Loading settings stops current audio before applying the new state.

Preset restoration waits for existing native source reads to finish before issuing replacement reads. Native busy flags are cleared by completion bangs, not by JavaScript timeouts: a timeout cannot cancel a `buffer~` read. Empty saved slots clear their old paths, metadata, and samples. A new valid preset replaces a queued one; STOP or changing modes cancels the queued restore. A native file error that never produces completion requires reopening the patch before retrying that slot. See Cycling '74's [asynchronous object lifecycle](https://docs.cycling74.com/userguide/patcher_lifecycle/) and [buffer~ reference](https://docs.cycling74.com/reference/buffer~/).

Live recording is 24-bit stereo WAV before monitor gain. Source/layer/drone levels affect the capture; Volume (dB) and the independent test tone do not. APG/SIOE export the complete cached result, regardless of the selected loop. Recording and finite-buffer export are distinct signal paths.

## Native Max acceptance work still required

The following should be checked in an actual Max 8/9 session before treating the collection as native-verified:

1. Open the complete folder and confirm that the main patch, runtime, XY interface, and every voice subpatch load without Max Console errors.
2. Check the driver and dynamically labelled option menus against Max's Audio Status window. Confirm that opening the patch and REFRESH preserve hardware settings. Change an interface while playing, recording, rendering, and waiting for TEST SOUND; verify that the old work stops before the device change and does not resume. Check power readback, connect/disconnect an interface, and inspect drivers that expose fewer than two options. Then verify TEST SOUND and start each mode directly after launch. Confirm source requirements, scopes, slow fades, and RMHS completion.
3. Move the ISJS pad and change its live rate/level controls. Change Many settings during playback and confirm that only new layers receive them.
4. Stop and switch modes during active performances, audio startup, rendering, and an armed/running recording. Check that no old voice or callback resumes afterward.
5. Render APG and SIOE; inspect both waveform channels, drag a selection, loop it, restore full range, and replay the cached result. Confirm the new loading/scanning/rendering/playback badges, labelled display-only waveform scale, visible control availability, and native font fitting in all five modes. Check that changes flag the cached waveform and cancellation never appears ready. Compare perceived loudness and WAV data before/after display scaling; verify stereo view scale and the native `vzoom` direction.
6. Save complete finite-mode WAV files and record a live performance. Open the files independently to confirm stereo channels, 24-bit format, duration, and actual audio. Verify that changing monitor volume does not alter captured/exported amplitude.
7. Save and reload a JSON set, including source paths containing spaces. Move a referenced source to confirm that the missing-file path is understandable and recoverable.
8. Run Many long enough to exercise voice reuse and tail retirement, then confirm that STOP clears all tails and closes recording.

These are remaining native checks, not completed test claims.
