# Using APG Wave

APG Wave is a Max/MSP adaptation of [Joo Won Park’s Audio Palindrome Generator](https://joowonpark.net/apg/). It uses three source samples to generate a stereo composition that is symmetrical in time.

## Open the complete project

Download the repository with **Code → Download ZIP**, then unzip it. Open **`APG_Wave.maxpat`** from the extracted folder. Leave `apg_wave.js` and the three `apgw_test*.wav` files beside the patch. The folder name may include a GitHub branch name, such as `-main`; that does not affect the patch.

If another APG version is open, close it first. This version’s window title identifies **APG Wave v5**. The patch is intended for Max 8 or Max 9 and uses stock objects; no additional Max packages are required.

## Start with the demos

The three demo sounds load automatically. Wait until their names and durations appear, then press **PLAY**. The patch starts audio, checks the quiet edges, renders the result, and begins playback. The waveform displays the actual generated audio.

Press **STOP** to end playback. Press **PLAY** again to replay the same composition. Press **NEW** to generate a different randomized arrangement; the new result waits for PLAY. Each NEW restores the selection to the full output.

**TEST SOUND** plays a short tone through the same output device and volume control. It is independent of composition generation and can help distinguish an audio-output problem from a problem with the sources or generated result.

## Load your sounds

Press STOP before changing the sources. Each **LOAD** control chooses one mono or stereo WAV/AIFF file. All three sources must finish loading before a new composition can be generated. **DEMO** restores the included samples.

The source files may have different sample rates and lengths. The initial composition length is twice the longest source, so long recordings increase generation time and memory use. Automatic edge trimming may shorten the final piece.

## Shape the arrangement

Each **Repeats** value is a maximum between 1 and 20. The actual number of forward/reverse pairs for that source is randomly chosen between half that maximum, rounded up, and the maximum. For example, a value of 5 creates between 3 and 5 pairs.

**Pitch range** runs from 0 to 1. At 0, each event uses its source’s normal rate. At 1, rates are randomized between the normal rate and twice that rate. A faster event is higher in pitch and shorter in duration; its mirrored partner uses the same rate.

Changing a source, repeat value, or pitch range marks the result for regeneration on the next PLAY. The currently displayed result remains available until another generation begins. **NEW** always generates another random arrangement. The source and generation controls are locked while playback or preparation is active.

**Volume (dB)** changes listening level. It does not change the generated samples or WAV export.

## Read the status

| Status | Meaning |
| --- | --- |
| **Loading…** | A source file is being read. |
| **Starting audio…** | The patch is waiting for Max’s audio engine and sample rate. |
| **Finding the start of the sound…** | The mixed output is being checked for leading silence. |
| **Rendering …%** | Audio is being written into the output buffer. The percentage reflects completed output frames. |
| **Ready / trimmed … s from each end** | Generation finished and the same amount was cut from both ends. |
| **Playing…** | The selected range is playing once. |
| **Playing: first sound in … s** | Playback is moving through a remaining quiet opening. |
| **Looping selection…** | The selected range is repeating. |

During preparation, STOP is labeled **CANCEL**. Cancelling prevents the unfinished result from starting playback. Press PLAY to generate again.

## Select a range and loop it

After generation, drag across either waveform to select a range. The left and right selections stay linked, and the selection readout reports its start, end, and duration.

With **Loop selected range** off, PLAY plays that range once. Turn Loop on to repeat it. You can select another range while the piece is running; playback changes to the new selection when you release the mouse. Switching loop mode restarts the selected range.

**FULL RANGE** selects the complete trimmed output again. Clicking without creating a meaningful range also restores the full range. A selection changes playback boundaries without cutting the stored audio. Short fades at selection edges reduce clicks during playback.

## Understand automatic edge trimming

Trimming is enabled automatically. The patch looks for the first sample whose amplitude exceeds **0.00001 of full scale**, or **−100 dBFS**, in either output channel. If that opening lasts at least **250 ms**, it trims to approximately **25 ms** before the detected sound. It removes exactly the same number of samples from the end to preserve the palindrome.

This keeps quiet material above the threshold, leaves a small margin around the sound, and preserves pauses within the piece. An opening shorter than 250 ms remains intact. An entirely silent or subthreshold result is kept at its original length and identified in the status; it does not autoplay after generation. A very quiet result can still be played manually.

The waveform and all playback times refer to the shorter, trimmed result. The status reports the cut at each edge rather than the combined reduction. For example, trimming 4 seconds from each end reduces the total duration by 8 seconds.

## Save the result

Choose **SAVE WAV** and a destination. The patch saves the complete trimmed stereo result as a **24-bit WAV**, even if a smaller playback range is selected. To save a newly changed arrangement, generate it with PLAY or NEW first.

The saved file contains the generated audio level. The listening-volume setting and playback-only fades at selection edges are not applied. Wait for **WAV write completed** before generating another result. If a completion notification does not arrive, the patch asks you to check the chosen destination and Max Console.

## If you hear nothing

First try TEST SOUND. If that is also silent, check the listening volume and the output device in Max’s Audio Status. The output meters show the signal after the volume control.

If TEST SOUND works, check that all three source names and durations are present. Watch the preparation status and progress rather than pressing PLAY repeatedly. If the status identifies a silent or very quiet result, try the included demos or other source material. A countdown during playback indicates an actual quiet opening in the generated audio.

If the patch reports a missing file or script, confirm that the entire archive was extracted and `apg_wave.js` is beside `APG_Wave.maxpat`. Close the patch, restore the files, and reopen it. For other errors, copy the relevant Max Console message together with the Max version, operating system, and action that produced it.

## Verification status

The planner, renderer, and controller have automated checks, including exact sample symmetry and trimming. Controller checks use simulated Max buffers and tasks. Native Max was not available during the build, so actual audio, GUI interaction, and disk writing still require verification in Max. See [the validation notes](../developer/VALIDATION.md) for the distinction.
