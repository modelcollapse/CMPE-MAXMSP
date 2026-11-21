# Changes

## CMPE Variety Pack 1.2.1 — November 21, 2026

- Increased each stereo waveform and live scope from 62 to 96 pixels high, about 55% taller, while retaining the complete 1100 × 788 presentation and text at least 16 points.
- Increased the ISJS position/density pad and its adjacent scope from 134 to 202 pixels high.
- Tightened header and source-card spacing. Loop selection remains directly below the waveform; FULL RANGE and SAVE WAV now sit beside the main transport. Live recording uses the same right-hand transport area.
- Updated all interface previews and the complete `CMPE_Max.zip` download. This update changes layout only; the existing colors and audio behavior are retained.

## CMPE Variety Pack 1.2.0 — November 21, 2026

- Reorganized the complete standalone interface into a compact audio strip, five colored instrument tabs, source/parameter cards, a distinct waveform area, and transport feedback. The presentation is 1100 × 788 with text at least 16 points.
- Added state badges for loading, audio startup, silence analysis, render percentage, ready output, playback/looping, live fade-in, recording, cancellation, failed renders, changed settings, and completed drones.
- Transport labels now distinguish GENERATE + PLAY, PLAY, START, PREPARING, PLAYING, and LIVE. NEW TAKE makes fresh finite output. Existing controller locks remain authoritative; unavailable controls are visually muted.
- Source cards distinguish actual ready/loading/waiting/empty states, including native reads that outlive a timeout. Late completion clears stale notices. Recording failures remain visible through live activity updates.
- Automatically scales the displayed finite waveform for visibility, with a bounded, labelled view scale shared by both channels. This changes no PCM samples, DSP voices, recording gain, or exported levels.
- Added complete five-instrument and APG-state previews, a first-use guide, and one current playable package at `dist/CMPE_Max.zip`. The main file remains `CMPE_Variety_Pack.maxpat`.

The Max for Live devices retain their previous preview release. Layout previews and simulated-controller tests do not establish native Max rendering or audio-device operation.

## CMPE Max for Live 0.1.0 preview — November 21, 2026

Added five separate Max Instrument entry points in `max-for-live/`, with real unfrozen AMXD containers, adjacent dependencies, and editable `.maxpat` sources. The existing standalone Max collection is retained.

- Compact 169-pixel-high interfaces retain source loading, waveform / XY / scope displays, status, progress, performance controls, and visible credit to Joo Won Park.
- Live owns the audio engine. Each device routes stereo audio through `plugout~`; standalone interface selectors and the test tone are excluded.
- MIDI triggers whole performances, velocity controls output level, and RMHS uses note pitch for its fundamental. A latch option supports long performances.
- Fixed parameter names and stored device state integrate controls, sample references, loop settings, and finite-render seeds with Live. Prepared APG/SIOE results can be reconstructed from the same source audio after recall.
- APG/SIOE generation is explicit. PLAY and MIDI trigger prepared audio without beginning a new render.

The package includes automated verification and native acceptance instructions. Native Live execution and frozen single-file distribution have not been verified; this is labelled a preview throughout.

## CMPE Variety Pack 1.1.0 — November 21, 2026

- Added a visible audio section with a driver selector, two dynamically labelled driver-option menus, an observed audio on/off state, REFRESH, and a shortcut to Max's full Audio Status window.
- Device changes stop the current performance, recording, and pending test tone before changing hardware. Opening or refreshing the menus does not overwrite the existing audio-interface settings. Musical presets do not store hardware choices.
- Reworked the presentation with a light slate background, dark text, teal primary controls, a distinct selected color for each instrument, and tinted sample groups. Larger fields, shorter parameter labels, and a single parameter row improve readability.
- Updated all five interface previews and the setup guide. The previews remain explicitly labelled; native Max audio-device operation still needs verification in Max.

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
