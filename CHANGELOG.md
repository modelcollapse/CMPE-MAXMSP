# Changes

## Documentation update — November 21, 2026

Named the README **CMPE Variety Pack for Max** and added five reproducible interface previews. The APG and SIOE images show output generated from the included demo audio; live instruments are shown stopped. Each image is explicitly labelled as a preview rather than a native Max screenshot.

## CMPE Variety Pack 1.0.0 — November 21, 2026

Added `CMPE_Variety_Pack.maxpat`, extending the project to all five instruments in Joo Won Park's supplied Variety Pack: APG, ISJS, Many, RMHS, and SIOE. The standalone APG Wave version 5 remains unchanged.

- A shared high-contrast interface shows the selected instrument's source and parameter controls.
- ISJS uses three live sample voices and a position/density pad; Many uses overlapping pitched layers through seven stereo allpass stages; RMHS generates harmonic drone voices with slow modulation and pitch drift.
- SIOE renders a short or long supercut with visible progress, stereo waveform, selectable loop, cached replay, and full-result WAV export. Its long form follows the original four-beat chord spacing.
- Live modes have scopes, elapsed-time feedback, and 24-bit stereo WAV recording. Many and RMHS explicitly report their slow fade-ins.
- STOP and mode switching cancel scheduled work, clear live tails, and stop recording. Many has a bounded voice pool; RMHS reports its actual planned duration and excludes partials above the audio range.
- SAVE SET / LOAD SET persist controls and sample paths in JSON. Restoration waits for existing source reads before loading replacement paths and clears empty saved source slots.
- The interface and documentation credit Joo Won Park and link to his original CMPE project. Guides cover operation, source mappings, implementation differences, and validation.

Automated model, controller, rendered-audio, and patch-graph checks accompany the extension. Native Max execution remains to be verified in Max; these checks do not establish native playback or recording.

## 5.0.0

A clearer Max interface with a larger stereo waveform, grouped playback controls, and a visible link crediting Joo Won Park's original Audio Palindrome Generator. GitHub documentation covers installation, playback, loop selection, automatic trimming, export, and development checks.

The audio engine and automatic trimming behavior are unchanged from version 4.

## 4.0.0

Added automatic removal of long near-silent beginnings and endings. The same number of samples is removed from both sides to preserve the palindrome. Openings of at least 250 milliseconds trigger trimming, with 25 milliseconds retained at each edge. Internal pauses remain. Waveform display, playback, loop bounds, and complete-output WAV export use the shorter result.

## 3.0.0

Added a rendered stereo output waveform, visible generation progress, a moving playhead, draggable loop selection, cached replay, and full-composition WAV export. PLAY generates only when necessary; NEW generates another result.

## Earlier versions

Initial Max adaptation of the supplied SuperCollider APG algorithm, followed by clearer controls and an independent test tone.
