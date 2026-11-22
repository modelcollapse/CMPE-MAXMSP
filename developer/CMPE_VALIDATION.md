# CMPE Variety Pack: implementation and validation

The new collection opens from `CMPE_Variety_Pack.maxpat`. `APG_Wave.maxpat` and its original validation scripts remain available. Musical provenance is Joo Won Park's [CMPE project](https://joowonpark.net/cmpe/) and the user-supplied `CMPE_VarietyPack_ForSC.scd`; [APG](https://joowonpark.net/apg/) is the existing finite-mode foundation.

**Native Max was unavailable during development.** A passing JavaScript test or patch-graph check does not establish native audio output, Max object compatibility, UI behavior, or successful disk recording. The checks and remaining native work are distinguished below.

## Architecture

APG and SIOE are finite generators that write a stereo output buffer before using the waveform and playback transport. APG retains its exact mirrored sample construction and symmetric silence trimming. SIOE generates its own finite event plan and uses a chunked renderer with source-rate compensation, wrapping, stereo summing, and equal-power panning. SIOE is peak-scaled only when its completed mix exceeds 0.98.

ISJS, Many, and RMHS use native `poly~` audio voices and scheduled control messages. ISJS has three continuously retriggered source streams. Many uses at most 32 overlapping ambient voices. RMHS uses up to 55 sine partials. Their scopes display a live signal rather than a stored waveform.

The controller owns tasks, voice lifetimes, mode changes, and recording state. STOP and mode changes cancel the instrument's pending work, fade and clear its live voices, and stop its recorder. They do not perform SuperCollider-style server-wide cleanup.

### Native audio settings

The audio-settings module, `developer/cmpe_audio_settings.js`, manages the audio controls. The native graph uses `adstatus driver`, `adstatus option 0/1`, and `adstatus optionname 0/1` to obtain the available choices and their labels. Its menu outlets connect directly to the visible `umenu` objects before the controller receives the same telemetry. Option meanings are driver-specific; they are not assumed to mean input or output device. `adstatus output` describes channel mapping rather than hardware selection, so the patch leaves full channel mapping to Max's Audio Status window. See the official [adstatus reference](https://docs.cycling74.com/reference/adstatus/) and the zero-based help-patch evidence in the 1.2.4 record below.

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
node developer/validation/test_cmpe_input_recording.js
node developer/validation/test_cmpe_input_recording.js --bundle
python3 developer/build_cmpe_previews.py
python3 developer/package_cmpe.py
```

The first builder preserves the standalone APG patch/runtime. The voice builder writes the native instrument subpatches. The collection builder assembles the shared UI, audio connections, and combined legacy-JavaScript runtime. Edit the separate developer modules and rebuild rather than editing only a generated runtime file.

The retained APG checks and their scope are documented in [VALIDATION.md](VALIDATION.md). New collection-controller verification is separate from the pure-model results below; no native execution is implied by controller mocks.

## Version 1.3.0: waveform correction and sample input recording

The displayed magnification now sends `1 / magnification` to native `waveform~ vzoom`. The native setting is an amplitude range: reducing it enlarges the trace. The previous controller sent the magnification directly, while its preview incorrectly multiplied amplitude by that native value. This disagreement could make quiet output nearly invisible in Max even though the preview looked correct. Cycling '74's actual [index~ help patch](https://github.com/Cycling74/max-sdk/blob/15b6fe17eedc7c8a8b4ee249706d3aaf21e192fa/help/index~.maxhelp) and [vcomb~ help patch](https://github.com/Cycling74/percolate/blob/639a344916e01a90a88337f671584b9fce6baf43/help/vcomb~.maxhelp) use `vzoom 0.5` with an offset to display a 0–1 control range. The [waveform~ reference](https://docs.cycling74.com/reference/waveform~/) confirms buffer binding, one-based channel selection, the centered zero offset, and display-only scaling. Regressions assert the reciprocal native message, both channel bindings, quiet-PCM projection, and unchanged audio samples.

`developer/cmpe_input_recording.js` is appended last in the standalone runtime. Native `adc~ 1 2` feeds a two-channel `record~`; it has four inlets because its final two set the start/end points. Capture uses one of four private native buffer banks, allocated only after REC IN. Three banks can hold the three adopted source recordings while the remaining bank stages the next take. The prior sample's references remain intact until stopped capture is trimmed and read back successfully. Unused banks are reduced again after pending native work completes.

Native `record~` sync drives `snapshot~` for elapsed display and `peakamp~ 0` for stopped-position confirmation. The recorder is bounded by its 60-second allocation with looping disabled. Max 8's documented millisecond `buffer~ crop` message is used rather than relying on the newer `crop_samples` reference. A sample WAV save requires the native write-completion bang and a matching RIFF/WAVE PCM24 header/data length before its path becomes part of saved settings. These native contracts are documented in [record~](https://docs.cycling74.com/legacy/max8/refpages/record~), [peakamp~](https://docs.cycling74.com/legacy/max8/refpages/peakamp~), and [buffer~](https://docs.cycling74.com/legacy/max8/refpages/buffer~).

The new graph declares `savedialog` with three outlets: path, selected file type, and cancel. Cancel is routed from outlet 2. `opendialog` retains two outlets. The distinction follows the [Max 8 savedialog reference](https://docs.cycling74.com/legacy/max8/refpages/savedialog), and is checked against the generated patch rather than inferred from a mock.

Small source waveforms follow their actual buffer/channel bindings independently of output generation. APG repeat and pitch edits retain the existing numeric validation and add step buttons. Five distinct high-contrast mode accents, 10-pixel native button rounding, and bottom attribution fit in 1100 × 900. The output channel height remains 144 pixels. The builder validates 303 objects and 271 connections, including native endpoints and presentation bounds. Previews remain labelled generated simulations; they do not establish native drawing, input permissions, driver operation, or audible recording on the user's machine.

Final 1.3.0 checks:

| Check | Result |
| --- | --- |
| Controller, separate modules and shipped bundle | 55 scenarios, 7,438 checks, 5,182 rendered-frame comparisons; no failures |
| Source input recording, separate modules and shipped bundle | 22 scenarios, 156 checks; no failures |
| Presentation feedback | 14 scenarios, 464 checks; no failures |
| Generated native graph | 303 objects, 271 connections; valid ports, names, and native dialog routing |
| All five mode previews and seven APG feedback states | Text fit, bounds, and visible overlap pass; images visually reviewed |
| Both distributed JavaScript files | ECMAScript 5 parsing passes |

Recording regressions include actual fixture PCM, STOP versus cancellation, the native capacity limit, source-read conflicts, delayed allocation/crop/position feedback, stale callbacks, saved-WAV verification, unsaved-set guards, and write timeout handling. An independent review reproduced two failures before their fixes: display-only snapshots could authorize an empty take, and a deferred cleanup resize could truncate a later capture. Separate stopped-position evidence and reserved cleanup banks now prevent those failures while preserving previous source data.

## Version 1.2.5: larger waveform display

The user reported 1.2.4 working and requested a larger waveform. This update increases each waveform and stereo live-scope channel from 96 to 144 pixels high at the same 1012-pixel width. ISJS's pad and adjacent scope grow from 202 to 298 pixels. Compact surrounding spacing and header attribution keep the complete window at 1100 × 836, 48 pixels taller than before.

Only presentation geometry, the window title/version, and the attribution placement change in the main patch. The runtime scripts and native audio-control arguments—including the corrected zero-based driver option numbers—remain the working 1.2.4 implementation. Verification is limited to the layout and distribution changes; native Max is not available in this workspace. The builder validates all 252 objects and 223 connections. The five instrument previews and seven APG state previews pass text-fit, bounds, and overlap checks; visual inspection found no clipping. A structural comparison against 1.2.4 confirms identical patch connections, native audio-control arguments, visible color styles, controller scripts, and DSP voice files.

## Version 1.2.4: native option-address correction

The generated native objects now address driver options 0 and 1, with matching optionname arguments. The logical UI identifiers remain option1 and option2. The former 1/2 mapping skipped native option 0. The [official Cycling ’74 guitar-processor tutorial](https://cycling74.com/articles/max-8-guitar-processor-part-1) states that its input-handler controls were copied from adstatus.maxhelp; its [downloadable patch](https://usercontent.cdn.cycling74.com/57ec430afd747b8a71b4f1ab/2021-01-29T02:51:17Z/Max8-GtrProc-1.maxpat) uses `adstatus option 0`. A [mirror of the Max 9 help patch](https://github.com/markusepperer/Maxmsp_Knowledgebase/blob/27e04dd49232367e06848a361c26bf3ef75a63d5/help_maxhelp/msp/adstatus.maxhelp) corroborates both `option 0` and `optionname 0` with an explicit zero-based numbering comment. This differs from the current reference page’s starting-at-1 prose.

A new generated-object regression failed against the old patch and passes after rebuilding. The rebuilt distribution passes **54 controller scenarios, 7,429 checks, and 5,182 rendered-frame comparisons**, with no failures. The controller, musical algorithms, and DSP graphs are unchanged; the native argument mapping is the behavior change.

A separate read-only audit found no missing packaged dependencies or confirmed fatal JavaScript startup defect. TEST SOUND is a native path independent of the controller, so it can succeed without proving controller startup. The user’s exact failure is still unidentified without a symptom or the first Max Console error. Native audio-device operation remains unverified.

## Version 1.2.3 verification

The production controller and rebuilt bundle each pass **53 scenarios, 7,429 checks, and 5,182 rendered-frame comparisons**, with no failures. The eight new audio-control cases cover delayed native replies, driver state from the left menu outlet alone, a stale poll crossing a reordered device catalog, partial enumeration, missing current selections, delayed hardware application, timeout/cancellation, and native setup/power with unavailable menu replies. Completed enumeration is tracked separately from ordinary current-index feedback. A refresh retains known choices until a native replacement arrives and does not issue hardware-setting writes.

The presentation suite passes **10 scenarios and 268 checks**. It checks LOAD text and control-boundary contrast, loading/playback/mode transitions, preserved click locks, native fill settings, and the existing activity feedback. LOAD text contrast is **13.16:1** normally, **9.26:1** on hover, and **10.03:1** when pressed; unavailable labels are **5.06:1**. The white primary-action label on blue is **6.96:1**. These are calculated sRGB ratios for the specified colors, not measurements of native Max rendering.

Panels and menus bind explicit solid `bgfillcolor` styles, and runtime color updates use the documented four-float message. Menus enable `applycolors`; text buttons enable their pressed/hover color attributes. The preview renderer resolves those native styles and does not invent text-button outlines. References: [panel](https://docs.cycling74.com/reference/panel/), [umenu](https://docs.cycling74.com/reference/umenu/), [textbutton](https://docs.cycling74.com/reference/textbutton/), and [Cycling '74's serialized solid-fill example](https://github.com/Cycling74/n4m-core-examples/blob/master/02-message-handlers/message-handlers.maxpat).

The generated patch has **252 objects and 223 connections**. All existing connections and presentation rectangles are preserved; the only three added connections forward native driver/option menu data directly to the corresponding menus. The sound models, renderer, instrument controller, voice patches, standalone APG, and Max for Live files are byte-identical to 1.2.2. Both distributed JavaScript files pass Node syntax checks. The five complete interface previews and seven APG state previews pass text-fit, bounds, and overlap checks. They remain explicitly labelled as generated interface previews.

Native Max, its audio hardware, and the user's running instance were unavailable. This update repairs demonstrated controller weaknesses and native-attribute mismatches; it does not claim that the exact failure on the user's machine was reproduced or that actual device switching has been verified.

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

## Earlier controller and distribution validation (through 1.2.2)

`test_cmpe_controller.js` completed **45 scenarios, 7,398 checks, and 5,182 rendered audio frames checked**, with no failures. The same suite passed against both the separate source modules and the generated `cmpe_variety.js` distribution. It executes the actual controller and models with simulated Max tasks, buffers, UI objects, files, and native-message boundaries.

The scenarios cover all five modes, required source counts, hidden unused source controls, audio startup and cancellation, DSP shutdown and sample-rate changes, live parameter changes, Many voice reuse and retirement, stale-task cancellation, RMHS automatic completion, complete SIOE rendering and normalization, cached replay, export commands, recording state and stalled-recorder detection, settings round trips, invalid settings, and shutdown. Preset regressions check serialized native reads, late completion after a timeout, cleared empty slots, newest-preset selection, queued-restore cancellation, and startup DEMO cancellation.

Audio-control regressions check that initialization, refresh, polling, feedback, and preset restoration do not write hardware settings. They cover the stop fade and delayed test-tone cancellation, driver/device identity changes during that fade, unsupported or unconfirmed choices, external native changes, power readback, native Audio Setup recovery, and stale callbacks after STOP or shutdown. The native graph checks require every menu selection to pass through the controller before reaching an audio setting.

The retained APG suites also passed: **710 plans / 500,424 assertions**, **25 renderer plans / 907,564 checks**, and **17 controller scenarios / 1,499,742 checks**. The CMPE controller additionally checks palindrome sample symmetry after switching back from another instrument.

The 1.2.2 main builder validates **252 objects and 220 patch cords**, including connection endpoints, port indices, duplicate cords, unique scripting names, and presentation bounds/overlap. The voice builders validate their message and signal connections: sample voice **40 objects / 55 cords**, Many voice **77 / 152**, and drone voice **45 / 60**. All five interface previews use the generated **1100 × 788** presentation layout, its native color attributes, and the actual XY-pad drawing code. Each stereo waveform/scope is now **96 pixels high**, and the ISJS pad and its adjacent scope are **202 pixels high**. Text-fit and visible-overlap checks pass for all five instruments and seven captured APG states. The images were reviewed for readability. They are labelled interface previews, not native Max screenshots; no attached hardware is claimed. Both shipped CMPE JavaScript files pass an ECMAScript 5 parser check.

The 1.2.2 palette refresh was compared against 1.2.1: presentation geometry, object identities, connections, and non-color interaction attributes remain identical. Musical source modules and DSP voices are byte-identical, and the Max for Live files are unchanged. The existing feedback suite again passes 8 scenarios and 51 checks. Calculated sRGB contrast is 6.09–7.71:1 for text on instrument accents and 5.39–6.42:1 for accent text on its panel tint; disabled text is 4.52:1. The left and right waveform traces have 8.67:1 and 4.79:1 contrast against the display background, with 6.27:1 for the playhead. These calculations check the specified colors; they do not establish native rendering or overall accessibility conformance.

The standalone feedback adapter is bundled after the audio-settings module and is excluded from the Max for Live runtime. `test_cmpe_ui.js` completed **8 scenarios and 51 checks** using the real controller with the existing simulated Max boundaries. Coverage includes loading, separate silence-scan/render fractions, readiness, playback/looping, changed settings, incomplete output, native-read timeout and late completion, live fade-ins, recording-failure notice persistence, optional widgets, and idempotent installation. The existing 45-scenario controller suite passed against the 1.2.0 source modules and distributed runtime with the same 5,182 compared PCM frames; 1.2.1 changed only layout and 1.2.2 changes only presentation colors.

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
