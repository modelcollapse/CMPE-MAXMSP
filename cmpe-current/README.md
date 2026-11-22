# Match levels

Tested live in Max 9 on 2026-11-22.

**MATCH LEVELS** (instrument row, on by default) brings every loaded sample to a common peak level of **−8 dBFS** as it loads. A quiet field recording and a mastered track then drive APG, ISJS, Many and SIOE about equally, and the default instrument gains suit both.
- Only the loaded copy in Max changes; **files on disk are never modified**.
- Each sample card shows the adjustment, e.g. "Using 157.07 s of 157.07 s · −8.0 dB". The demo samples already peak near −8 dBFS (measured from the files), so they move by only +0.1 / −0.2 dB.
- Boost is capped at +30 dB, so near-silent files don't become amplified noise. Silent files are left alone.
- Region edits and previews use the matched level. Turning the option off reloads your samples at their original levels and keeps their regions.
- SAVE SET stores the setting; older sets load with it on.
- Live checks: matching applied on load, turning it off reloaded the samples at their original levels, and a 157-second stereo WAV was measured and matched within 2 seconds.

88 offline checks pass (validation/*.cjs).

---

# Levels, ISJS + Many presets, FX check

Tested live in Max 9 on 2026-11-22, including the preset menus for ISJS, Many and RMHS.

**Measured levels** (post-limiter peaks at Gain 0 dB with the demo samples): APG −20.6, ISJS about −15, Many −16 to −29, RMHS about −14 (drone level 0.22), SIOE about −12.4 dBFS. The demo samples themselves peak around −22 dBFS. Default gains: APG +6, ISJS +3, Many +6, RMHS +6, SIOE +3 dB. Combined with the monitor change from −12 to 0 dB, playback is 15–18 dB louder than before. Loud samples can reach the −0.18 dBFS limiter but cannot clip.

**Louder by default**
- **Monitor Volume** now starts at **0 dB** (was −12 dB, a quarter of the signal). It's safe: the Tape + Memory output already has a linked limiter at −0.18 dBFS.
- **Gain (dB)** on the instrument row is a new per-instrument gain from −12 to +24 dB, applied before Tape + Memory, so it also lifts processed recordings. The output limiter prevents clipping. Defaults come from the measurements above. SAVE SET stores each instrument's gain.

**Preset menu** (instrument row; ISJS, Many, RMHS). Editing a related setting switches it back to Custom.
- **ISJS:** rates use just ratios, so the three samples form real intervals. Presets: Just major triad (4:5:6), Just minor triad (10:12:15), Open fifths, Unison chorus (±10¢), Pentatonic sparkle, Sub and air, Granular rain. Each also sets density, stereo width, grain curve and attack. Below the pad, the guidance line names each sample's rate interval against sample 1, e.g. "S2: Major 3rd 5:4 · S3: Perfect 5th 3:2". It assumes the samples share a pitch.
- **Many:** Major bloom, Minor cathedral, Pentatonic garden, Atonal fog, Microtonal haze, Metallic swarm. Each sets the pitch set, max delay, layer interval, fade-in, reverb decay and delay spread. The SPACE and TIMING + PITCH cards describe the result (tail length, metallic vs smooth, pitch-set character).
- **RMHS:** its harmony presets moved to this menu.

**FX**
- The Tape and Memory switches now read "OFF · CLICK TO TURN ON" or "● TAPE ON" / "● MEMORY ON". "BYPASSED" looked like a status label.
- Verified: the switches respond live and audio reaches the FX output. Earlier native recordings show the processing: dry input is mono (side/mid −155 dB), processed output is stereo (side/mid −4.7 dB) with tails, HOLD sustains and CLEAR silences. The FX audio code is unchanged.

84 offline checks pass (validation/*.cjs).

---

# RMHS harmony: tuning, series, guidance and presets

Tested live in Max 9 on 2026-11-22.

**Live theory guidance on the RMHS cards.** It updates as you edit.
- HARMONICS shows the fundamental's nearest note and cents (A4 = 440 Hz), the series, and the top partial's frequency.
- INTERVAL shows the interval's name, its just ratio and how it feels: smooth, sweet, bittersweet or tense, ranked by ratio complexity (log₂ p·q).
  - **Just tuning:** which partials coincide. For a fifth: side 2,4,6… = root 3,6,9…
  - **Equal tuning:** how far the interval is from pure, and how fast the first near-coincidence beats. For a fifth on 100 Hz: −2¢ vs 3:2, beats 0.3 Hz.

**Harmony preset** menu on the INTERVAL card. A preset sets the root, interval, partial count, tuning, series, tilt and motion ranges; level and duration stay yours. Editing the fundamental, interval or harmonics switches the menu back to Custom.

| Preset | Idea |
|---|---|
| Tanpura (root + fifth) | C#2, pure 3:2, bright, slow bloom |
| Just-fifth organ | C2, octaves + fifths only, pure 3:2 |
| Hollow fourth | D2, odd partials, pure 4:3 |
| Major-third glow | F2, pure 5:4, darker tilt |
| Minor-sixth dusk | E2, pure 8:5 |
| Octave choir | A1, pure octave, lively drift |
| Tritone unrest | B1, equal-tempered tritone (beating by design) |
| Deep sub | G1, unison banks, dark tilt |

**ADVANCED → harmony row (RMHS)**
- **Tuning:** Equal temperament (as before) or Just 5-limit. Just uses exact ratios for whole-semitone intervals (6:5, 5:4, 4:3, 3:2, …), so side-bank partials land on root partials with no beating. Interval entries round to whole semitones in Just.
- **Harmonic series:** All harmonics (as before), Odd harmonics (hollow, clarinet-like), or Octaves + fifths (harmonics 1, 2, 3, 4, 6, 8, 9, 12 …; organ-like and very consonant).
- **Root:** Free (any Hz) or Snap to notes. Snap rounds a typed fundamental to the nearest equal-tempered note.
- **Spectral tilt:** partial n has amplitude 1/n^tilt. 1 is the original; lower is brighter, higher is darker.

The defaults reproduce the previous sound exactly (bit-identical in 240 seeded comparisons). The fade-in text and badge follow the actual attack range. The live-output scopes now use the light theme.

78 offline checks pass (validation/*.cjs), including 6 new harmony tests.

---

# Instrument ADVANCED panels (ISJS, Many, RMHS, SIOE)

Tested live in Max 9 on 2026-11-22.

ADVANCED now opens a panel for whichever instrument is selected. Fixed and random values in the code are now editable ranges: each grain, layer, partial or slice picks a random value between MIN and MAX. The defaults equal the previous fixed values; in 240 seeded comparisons against the previous version, every output was bit-identical.

| Instrument | Controls | Applies |
|---|---|---|
| ISJS | Stereo width (MIN–MAX %), Grain curve (MIN–MAX), Grain attack (% of grain) | Next grains; width at the next START |
| Many | Layer fade-in (s), Reverb decay (s), Delay spread (% of max delay) | Next layer |
| RMHS | Partial attack (s), Stereo spread (%), Drift rate (Hz), Drift depth (%) | Next START |
| SIOE | Slice attack (ms), Slice release (% of hit), Stereo spread (%) | Next generated take |

- **Variation lock** for all four, as in APG: LOCK VARIATION repeats the same random choices at every START or take; NEW VARIATION picks a new seed. All random choices in these instruments now come from the seed, including RMHS pitch drift and ISJS pan widths.
- Entering a MIN above MAX moves MAX up to match, and the reverse. Values are clamped to each control's limits.
- SAVE SET / LOAD SET store these settings. Older set files load with the defaults.
- SIOE settings are locked during rendering and playback, like APG. ISJS, Many and RMHS can be edited while running.
- Many's number of delay stages (7) is fixed in the voice patch and is not exposed. Delay spread is exposed instead.

72 offline checks pass (validation/*.cjs), including 11 in the new validation/modeadv.cjs.

---

# Theme 2: one accessible light theme + looping sample preview

Tested live in Max 9 on 2026-11-22.

- **One light theme.** Advanced, the sample editors and Tape + Memory used to be dark navy panels; they now share the main page's light surfaces.
- **Consistent button roles.** Filled blue is the main action (GENERATE + PLAY, APPLY REGION, the selected instrument). Grey is secondary (LOAD, DEMO, AUDIO SETUP, panel toggles). Red is stop and record. A panel that is open shows ▼ on a light blue button.
- **Accessibility (WCAG 2.1 AA).** All text/background pairs are at least 4.5:1: body text 16:1, secondary text 7.8:1, white on blue 7:1, Tape orange 6.3:1. Fields, knobs and waveforms are at least 3:1 against their background. Text is never smaller than 13 px. Every state is also written as a word (READY, LOADING, LOOPING, LOOP ON), not shown by color alone. Number fields now have a visible fill so they look editable.
- **Looping sample preview.** Each EDIT / PREVIEW panel has a LOOP toggle. With LOOP ON, PREVIEW repeats the region until STOP. Drag the waveform or type START / END while it plays; the next pass uses the new region. The loop restarts at the end of each pass, so a very short gap at the loop point is possible. This is for auditioning, not seamless playback.

61 offline checks pass (validation/*.cjs), including a new loop test.

---

# Loader 3: sample loading fixes and drag-and-drop

Tested live in Max 9 on 2026-11-22.

- **Drag and drop:** drag an audio file from Finder onto a sample card to load it. LOAD still opens the file picker.
- **LOAD during playback no longer gets lost.** Previously, a file picked while playback was still stopping was silently ignored. Requests now stop playback, wait until the controller is ready, then load. A 157 s stereo WAV picked during playback loaded in under 2 s.
- **Non-audio files are refused immediately.** Previously a PNG or other non-audio file left the card on "Loading…" until the watchdog fired. The card now says "Not an audio file" and keeps the current sample. The watchdog for files that cannot be read is 20 s.
- **Less queue load while audio is on.** The playhead `snapshot~` sent about 30 messages a second to the controller, each restyling the whole UI, even when nothing was playing. Phase is now ignored when stopped. While playing, the playhead updates every tick and the full UI refreshes at most four times a second.
- **Startup after an in-place reload.** When Max reloaded the open patch because its files changed on disk, the UI could stay at "Waiting for controller startup…" with no samples. The controller now starts itself 1.5 s after a reload if nothing else has started it. Teardown errors about missing voices are suppressed.
- **OUTPUT header layout:** the view label no longer wraps onto two lines, and the level meters are wider.

60 offline checks pass (validation/*.cjs), including 5 new loading tests. Dragging a file from Finder onto a card was not tested live; the drop handler is covered by an offline test.

---

# Loader 2 startup and completion fix

Open CMPE_CURRENT.maxpat in this folder. Its window title includes “Loader 2” and its main heading reads “CMPE / CURRENT”. Close the previously opened patch first. The entry patch and controller script now have unique names to avoid stale copies being resolved from Max’s search path.

Controller initialization is explicitly deferred until patch construction has completed. WAV/AIFF files use Max’s native replace operation; other files use importreplace. A buffer metadata watcher handles a missed completion callback, and a 15-second decode timeout clears busy state and enables LOAD again. Optional sample-editor display errors no longer discard decoded audio or leave a Loading label behind.

55 offline checks passed, including eight targeted startup/completion tests. This fix has not been verified live in Max: the window connection timed out. The preceding native reports remain historical evidence.

---

# Inline panels and importing update

ADVANCED and TAPE + MEMORY now expand/collapse inside the main patch. EDIT / PREVIEW expands the chosen sample editor under the sample cards. Only one source editor is expanded at a time. Expanded panels move the output below them; scroll the main patch if needed. There are no separate editor windows.

Output waveforms use blue on a light background, with translucent blue range selection. Monitor gain remains separate from visual magnification.

LOAD uses an unrestricted picker and Max's native `buffer~ importreplace`, rather than rejecting everything outside WAV/AIFF before Max can decode it. Formats depend on Max's installed decoder support; loaded sources must still be mono or stereo. A stalled import can be retried with LOAD. Paths containing spaces are preserved.

This revision passes 47 offline checks. Live verification of the inline panels and updated importer is pending: the computer-control connection timed out twice. Native reports below describe the preceding revisions and are not a live test of this update. Close and reopen the main patch to load the new layout and controller.

---

# CMPE Current

Open `CMPE_CURRENT.maxpat` in Max 9. Keep this complete folder together. The previous version is archived in CMPE_OLD_VERSIONS.

## Waveform and output range

Waveforms automatically fit vertically after generation. VIEW × changes visual magnification from 1–512; it does not change audio or recording level. Bright cyan waveforms and blue selection shading make the active range clear. The waveform ruler is in milliseconds; the START and END fields are in seconds.

Drag either output waveform to select a playback range, or type START and END. Selecting a range automatically enables AUTO LOOP. Turn AUTO LOOP off for one-shot playback. FULL RANGE selects the complete take. A new render resets the selection to its full duration.

Monitor Volume now spans −72 to +18 dB. It affects listening and dry source preview, not the level sent to RECORD FX. The monitor outputs have a peak ceiling. For recorded balance, use APG's sample levels and the Tape / Memory output controls.

## Choose source regions and preview

1. Load a mono or stereo WAV/AIFF, then stop playback.
2. Click EDIT / PREVIEW under that sample to expand its inline editor. Click it again to collapse.
3. Drag the waveform or enter START / END in seconds.
4. PREVIEW auditions that draft region once, dry, through the monitor. STOP ends the preview. Preview does not enter RECORD FX.
5. APPLY REGION creates a working audio buffer for the generators. The source file and full loaded audio remain intact. Full SAMPLE selects the whole original; click APPLY REGION to restore its use.
6. Return to the main patch and generate a new take. Applied regions are shared by APG, ISJS, Many and SIOE. RMHS uses no source samples.

The main sample card shows the duration used versus the original duration. SAVE SET includes applied source regions; unapplied draft edits are not saved. Older sets use the full samples. Set files reference original sample paths; they do not embed audio.

## APG Advanced and effects

ADVANCED expands APG length (Auto or 0.1–600 s, subject to render memory limits), 0–200% sample levels, Variation Lock and New Variation. Locked choices reproduce with the same samples, regions, parameters and sample rate. Manual length describes the dry render. PLAY replays an unchanged take; NEW TAKE regenerates.

TAPE + MEMORY expands the shared effects chain inline. RECORD FX captures processed stereo 24-bit WAV; STOP REC leaves playback running. SAVE DRY exports the complete generated take. SAVE SET / LOAD SET retains instrument, Advanced, source regions and FX settings; effect memory is cleared on recall.

## Validation

41 offline checks and 12 native checks passed for this update. In Max 9.2.1 at 48 kHz, a 0.2–0.8 s region copied the exact 44.1 kHz source samples and restored without shifting; preview captured stereo audio; cropped-source APG rendered a 2 s exact palindrome; a 0.25–1.5 s output range enabled looping; +12 dB restored; waveform auto-fit was visibly clear. See validation/regions-native-results.json. Other source-based modes share the working buffers but were not individually auditioned in this run. Earlier validation reports document prior Advanced, Tape, Memory and processed-recording checks.
