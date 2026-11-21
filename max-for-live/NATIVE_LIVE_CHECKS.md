# Native Live acceptance checks

Status: **pending**. These checks require Ableton Live and Max for Live on macOS or Windows. They are not replaced by the package's automated controller or file-format checks.

Record the Live version, Max version, OS, audio sample rate, and audio buffer size when completing these checks. Begin with a new Live Set and modest track levels.

## First launch

- Extract the full package and load each `.amxd` onto a separate MIDI track. Confirm that Max reports no missing object, JavaScript, subpatch, or sample dependencies.
- Confirm that all visible controls fit inside the device panel and that names, values, status text, waveforms, XY control, and menus remain readable at the chosen Live display scale.
- Start RMHS manually and allow its slow attack. Confirm stereo track output. Confirm that Live retains control of the interface and no device opens or alters Max's global audio settings.
- Load the included demos in each sample-based instrument. Check mono and stereo source files at 32, 44.1, 48, and 96 kHz, including paths with spaces and non-ASCII characters.

## Playback and MIDI

- APG/SIOE: GENERATE must show progress, complete to Ready, and remain silent until PLAY or a new MIDI note. A note sent during generation must not start playback later.
- Check that note velocity changes output level, latch and held-note behavior match the guide, a note-off on another channel cannot stop the active note, and repeated notes do not leave stuck audio.
- RMHS: check several note pitches and slow fades. ISJS/Many: confirm that their allowed live controls remain responsive.
- Check waveform selection, shared stereo loop boundaries, full-range reset, stop fades, replay, and complete-output WAV export.
- Disable, delete, duplicate, undo deletion, and re-enable devices while playing and rendering. Stopped or deleted devices must not restart old tasks. Duplicate instances must not share buffer names or voices.

## Saved Sets and files

- Save and reopen a Set with all five devices, custom controls, custom source paths, a selected loop, and a prepared APG/SIOE result. Compare restored settings and the reconstructed audio with the pre-save output.
- Repeat restoration at another host sample rate. Check that playback duration, loop boundaries, and pitch remain correct while the saved render rate is preserved.
- Save a new device preset, reload it, and confirm that initialization does not replace saved sources with demos.
- Move the whole device folder and verify portable demo references. Move or remove a custom source and check the missing-file feedback. Test multiple source loads and a restore while a previous native read is pending.
- Compare an exported finite WAV with the prepared buffer. Confirm that the export is complete stereo audio and uses 24-bit PCM.

## Timing, capture, and distribution

- Record live output to an audio track in real time, listen to the complete recording, and check stop/release behavior.
- Test Offline Export and Freeze Track separately for every device. JavaScript task scheduling and wall-clock voice lifetimes may behave differently in accelerated rendering. Do not mark offline rendering supported until the captured result is checked.
- If creating a frozen single-file distribution, freeze and save each device in Max, inspect its dependencies, then load it from a clean location without access to the development folder. Check dynamic demo loading as well as JS and voice patches. Keep the complete-folder release until this succeeds.

## Result record

| Field | Result |
| --- | --- |
| Live / Max / OS versions | Pending |
| Audio sample rate / buffer size | Pending |
| Device loading and audio | Pending |
| UI and parameter automation | Pending |
| MIDI, latch, and cleanup | Pending |
| Saved Set restoration | Pending |
| Real-time recording | Pending |
| Offline export / Freeze Track | Pending |
| Frozen device distribution | Pending |
