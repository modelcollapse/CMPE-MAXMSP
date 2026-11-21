# CMPE Variety Pack: usage

CMPE Variety Pack brings five of [Joo Won Park's Computer Music Practice Examples](https://joowonpark.net/cmpe/) into one Max/MSP interface. The original ideas and SuperCollider algorithms are his. This adaptation extends APG Wave with a live granular instrument, ambient layers, a synthesized drone, and a supercut generator.

## Open the patch

Extract the complete downloaded project folder and open **`CMPE_Variety_Pack.maxpat`** in Max. Keep the accompanying JavaScript, Max voice patches, and demo WAV files together in that folder. Opening or downloading only the main `.maxpat` file is insufficient.

The patch is designed for Max 8 or Max 9, using stock Max/MSP objects. Python and Node.js are developer tools and are not required to play it. Close older copies of the patch before opening this one.

**`APG_Wave.maxpat` remains available** as the original standalone APG Wave patch. Its detailed guide is [Usage and troubleshooting](USAGE.md).

The three included synthetic demo sounds load automatically. **DEMO** reloads them. **TEST SOUND** produces a short independent tone to check the current Max audio output. Choose an instrument using the five buttons across the top.

**LOAD** uses a solid charcoal button with bold white text on each white source card. The selected instrument and main action are blue. Temporarily unavailable controls remain readable in gray; wait until the source finishes loading or stop the performance before replacing a sample.

## Choose an audio interface

Use the audio controls at the top before starting an instrument:

1. Choose a **Driver** from Max's available drivers.
2. Choose the interface in the driver's device menu. Max supplies the two option labels and their choices. Depending on the driver, these may be **Input Device** and **Output Device**, or other driver-specific settings. An unavailable option is left inactive.
3. Open **AUDIO SETUP** for the complete native settings, including sample rate, buffer size, and mapping the patch's stereo output to physical channels.
4. Use **REFRESH** after connecting or disconnecting hardware, or after making changes in Audio Setup. It reads the current settings without selecting a different interface.
5. Check the reported audio state and press **TEST SOUND**. Then use PLAY or START for the chosen instrument.

The audio power button shows the state reported by Max. Driver and device changes stop the current performance, recording, and pending test tone before applying the change. Max audio is left off; press PLAY/START or use the power button when the interface is ready. Turning audio on by itself does not start an instrument. AUDIO SETUP also stops this patch's current performance and turns Max audio off before opening the native window.

The driver, device, and DSP on/off settings apply to Max as a whole. They are not saved in the instrument's JSON settings files. Opening the patch and refreshing the menus do not replace your current hardware choices.

## Choose an instrument

| Instrument | Audio sources | Start behavior | Output display |
| --- | --- | --- | --- |
| **APG** | Samples 1, 2, and 3 | Renders a finite palindrome, then plays it | Stored stereo waveform and playhead |
| **ISJS** | Samples 1, 2, and 3 | Starts live sample granulation | Position/density pad and live scope |
| **Many** | Sample 1 | Starts live ambient layers with gradual attacks | Live left/right scopes |
| **RMHS** | No sample files | Starts a finite synthesized drone with slow attacks | Live scopes and planned-duration progress |
| **SIOE** | Sample 1 | Renders a finite supercut, then plays it | Stored stereo waveform and playhead |

Use the relevant **LOAD** button to select a mono or stereo WAV/AIFF file. Stop playback before changing source files. Many and SIOE use only sample 1; RMHS generates its own sound.

ISJS, Many, and RMHS start their audio engines immediately after Max audio becomes available. They do not render a whole performance before playing. Many deliberately fades its layers in over 2–4 seconds. RMHS deliberately introduces its partials over 3–20 seconds. Their status messages identify those fades.

## Transport and feedback

**GENERATE + PLAY** appears for APG and SIOE when a result is needed. It generates the audio, then plays the selected range. Once prepared, the button reads **PLAY** and reuses the cached result. **NEW TAKE** generates a fresh randomized result and leaves it ready to play. Source or generation-setting changes return the button to GENERATE + PLAY.

**START** appears for the three live instruments. ISJS and Many continue until stopped. RMHS finishes automatically after its planned voices have faded out. **RESET** restores the ISJS or Many defaults while stopped. RMHS uses **RANDOMIZE** to choose another set of starting controls while stopped.

**STOP** stops playback, cancels an in-progress render, or fades and clears the live voices. It also stops a live recording. Switching instruments stops the previous instrument, its scheduled events, and its recording before showing the next mode. No earlier instrument is left running behind the new one.

The colored badge beside the transport distinguishes loading, audio startup, silence checking, rendering, readiness, playback, and looping. The progress bar follows the actual work for the labelled phase. During silence checking it shows the part of the opening examined; during rendering it shows completed frames; during playback it follows the playhead. Continuous ISJS/Many performances have no finite progress estimate.

**CHANGES PENDING** means the displayed waveform was made with previous settings. **CANCELLED** or **RENDER ERROR** identifies incomplete output. Source cards independently show READY, LOADING, WAITING, or EMPTY. WAITING after a timeout means the native read has not completed; successful late completion clears the earlier notice. A failed recording notice stays visible across live activity updates until another action.

The live scopes show the current signal; they are not a stored recording or a selectable waveform. The meters and **Volume (dB)** control are shared by all instruments. Live modes show FADING IN, LIVE, RECORD ARMED, RECORDING, or COMPLETE as appropriate. Controls that are currently unavailable are muted visually.

Finite waveforms are automatically enlarged vertically according to the completed audio's peak, capped at 64×. **View x… · visual only** shows that display scale. This sends Max's [`waveform~` vertical display scaling](https://docs.cycling74.com/reference/waveform~/) attribute; it does not modify the audio buffer, listening gain, recording level, or export. Both channels use the same scale so their relative amplitude stays visible. Before a result is ready, the display explains whether it is waiting for generation, being prepared, or incomplete.

## APG: audio palindrome generator

Set each sample's repeat maximum from 1–20 and the random pitch range from 0–1. PLAY creates mirrored pairs of events from all three sources. The stored stereo result is sample-symmetric.

Automatic trimming removes long quiet edges equally from both ends, preserving that symmetry. Openings of at least 250 ms are shortened to approximately 25 ms before the first sample above −100 dBFS in either channel. Pauses inside the composition remain. An entirely silent or subthreshold result retains its length and receives a status message.

After rendering, drag over either channel to select a range. **Loop selected range** repeats that selection; **FULL RANGE** restores the complete output. The playhead follows playback. See the [APG guide](USAGE.md) for further detail.

## ISJS: live sample granularizer

Press START, then move inside the pad. **Left to right changes the source position. Moving up increases grain density.** All three sample streams follow the same position and density gesture, with different density ranges: 0.5–40 triggers per second for sample 1, and 0.1–35 for samples 2 and 3.

Each sample has its own **rate**, from 0.3–1.7×, and **level**, from 0–1. These controls remain live while playing. The displayed initial rates are **1.1, 1.03, and 1.2×**, matching the original SuperCollider patch's actual start rates. Small random level and pan changes occur at each trigger.

Each source uses a retriggered player: the next trigger moves that stream to the current pad position. Stereo files are summed before the individual grains are panned. RESET returns the controls to the starting configuration; it does not reload source files.

## Many: ambient layers from one sample

Many starts overlapping, pitched layers from the beginning of sample 1. Each layer feeds a seven-stage stereo allpass network, with no separate dry output, and fades in over 2–4 seconds.

| Control | Range and meaning |
| --- | --- |
| **Layer level** | 0–2; level of subsequently created layers |
| **Max delay (s)** | 0.1–0.5 seconds; sets the range from which each layer's delays are chosen |
| **Max interval (s)** | 5–20 seconds; actual time between layers is randomly half to all of this value |
| **Pitch set** | Major, Minor, Pentatonic, Atonal, or Microtonal |

Defaults are level 1, maximum delay 0.2 seconds, maximum interval 10 seconds, and Minor. Minor uses the original harmonic-minor collection. Microtonal uses a small stored collection within ±0.15 semitones, or ±15 cents.

Changes made while playing affect **new layers**. Existing layers retain their settings. The status displays the number of layers started and the time until the next one.

This adaptation uses 32 live layer voices. A layer is retired after at most 120 seconds. If all voices have been used, the oldest fades out over 10 ms; the next layer waits 15 ms before reusing that voice. At the fastest permitted interval of 2.5 seconds, reuse can retire an old layer after about 80 seconds. STOP fades and clears every remaining tail.

## RMHS: synthesized drone

RMHS needs no audio files. It combines a centered harmonic bank with two panned banks at the chosen interval. The partials have slow amplitude movement and small positive pitch drift.

| Control | Range and meaning |
| --- | --- |
| **Drone level** | 0–1 |
| **Fundamental (Hz)** | 20–20,000 Hz; base frequency for the harmonic banks |
| **Interval (st)** | 0–24 semitones; transposition of the two side banks |
| **Duration (s)** | 1–600 seconds; a parameter used to construct the envelopes |
| **Harmonics** | 3–20; count for each side bank, with a smaller centered bank |

The duration setting is **not the exact final length**. Each voice adds a random 3–20 second attack, a sustain of half the setting, and a release between half and all of the setting. The displayed length and progress use the actual longest planned voice. Controls are locked during the performance; STOP makes them editable again.

Partials whose frequency, including the full possible positive 2% drift, would reach or exceed half the current output sample rate are omitted. The interface reports the omitted count. If no partials remain, lower the fundamental or interval.

## SIOE: audio supercut

SIOE selects evenly spaced starting positions in sample 1. It plays slices from those positions with randomized envelopes and stereo panning. Playback wraps around the source when a slice reaches its end.

**Slices** ranges from 1–100, **Tempo** from 1–1500 BPM, and **Hit duration** from 0.1–10 seconds. The actual release of each slice is randomly half to all of the hit-duration setting, plus a 0.01–0.3 second attack.

**Short** starts all slices together. Tempo is inactive in this form. **Long** builds from one simultaneous slice to the full count, then removes slices until none remain. Each change occurs every **four beats**, so 120 BPM produces a new group every two seconds. The final empty group is part of the original process.

SIOE renders before playback, with a percentage and elapsed-time display. More slices and longer hits increase the work. A result exceeding 10 minutes or 200 MiB of stereo output, whichever limit is reached first, is rejected before output allocation. Reduce Slices or Hit duration, or raise Tempo, when the status reports this limit.

If the combined signal exceeds a peak of 0.98, the completed result is scaled down together to that peak. Its relative levels and envelope shapes are preserved. Once ready, select and loop a range in the waveform just as in APG.

## Save audio

For **APG and SIOE**, use **SAVE WAV** after generation. It saves the **complete cached stereo result** as a 24-bit WAV, including APG's symmetric edge trimming. A selected loop does not restrict the export to that selection.

For **ISJS, Many, and RMHS**, use **RECORD WAV** and choose a destination. If the instrument is stopped, the recorder is armed and START begins the capture. If it is already playing, recording starts after the destination is chosen. **STOP REC** ends recording while allowing the performance to continue; STOP or a mode change ends both.

Live recordings are 24-bit stereo WAV files taken **before the listening-volume control**. Volume (dB) changes what you hear but does not change a live recording or finite-mode export. Source levels, Many's layer level, and RMHS's drone level do affect their recorded signal. TEST SOUND is excluded from live recording.

## Save and load settings

**SAVE SET** writes a JSON settings file. **LOAD SET** restores one of these files, stops current audio, and reloads its referenced source paths.

If a source is already loading, the settings wait for that read to finish before loading the saved files. The status shows that wait. STOP or choosing another instrument cancels the queued settings change. Empty source slots in a saved set clear the corresponding current samples.

The file stores the selected instrument, instrument controls, listening volume, loop-enabled state, and source-file paths. It does **not** embed the sample audio, a rendered composition, a performance, random seeds, or audio-interface settings. Keep the referenced audio files available at their saved locations; use LOAD to relink a moved file. Regenerating a composition or restarting a performance can produce a different randomized result.

## If you hear nothing

Use TEST SOUND first. If it is silent, check the device menus and reported audio state at the top, then open AUDIO SETUP to confirm the output device and channel mapping. Check Volume (dB) and the device's physical level. If a menu is unavailable or an interface has just been connected, use REFRESH or choose it in AUDIO SETUP. Confirm that the source slots required by the selected mode have finished loading. RMHS does not require sources.

If a source load has not finished after 30 seconds, the status reports it. Check Max Console for a file error. A late successful load still completes normally. If Max cannot read the file and the load never completes, close and reopen the patch, then choose a readable WAV/AIFF. The patch does not start a second read into the same buffer while the first is pending.

Read the status before pressing START or PLAY again. APG and SIOE may still be rendering. Many and RMHS may be in their deliberate fade-in. A failed or stalled live recording produces a status message instead of being presented as a successful capture.

**Native Max was not available in the build environment.** Automated model, controller, and patch-structure checks have a narrower scope than running the complete patch in Max. Actual object loading, device output, scopes, mouse interaction, and on-disk WAV recording/export need native verification. See [CMPE validation](../developer/CMPE_VALIDATION.md) for the distinction.

## Original projects

Credit **Joo Won Park** for the original CMPE ideas and algorithms. His [CMPE project page](https://joowonpark.net/cmpe/) contains the original work. The standalone [Audio Palindrome Generator page](https://joowonpark.net/apg/) describes APG. This Max adaptation preserves the musical constructions while using the implementation differences documented in [CMPE validation](../developer/CMPE_VALIDATION.md).
