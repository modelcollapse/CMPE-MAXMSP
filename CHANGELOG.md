# Changes

## 5.0.0

A clearer Max interface with a larger stereo waveform, grouped playback controls, and a visible link crediting Joo Won Park's original Audio Palindrome Generator. GitHub documentation covers installation, playback, loop selection, automatic trimming, export, and development checks.

The audio engine and automatic trimming behavior are unchanged from version 4.

## 4.0.0

Added automatic removal of long near-silent beginnings and endings. The same number of samples is removed from both sides to preserve the palindrome. Openings of at least 250 milliseconds trigger trimming, with 25 milliseconds retained at each edge. Internal pauses remain. Waveform display, playback, loop bounds, and complete-output WAV export use the shorter result.

## 3.0.0

Added a rendered stereo output waveform, visible generation progress, a moving playhead, draggable loop selection, cached replay, and full-composition WAV export. PLAY generates only when necessary; NEW generates another result.

## Earlier versions

Initial Max adaptation of the supplied SuperCollider APG algorithm, followed by clearer controls and an independent test tone.
