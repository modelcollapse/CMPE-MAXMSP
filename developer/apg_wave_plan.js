/* APG event planner. ES5 for Max 8's legacy js object and Node validation.
 * Musical algorithm: Joo Won Park, Audio Palindrome Generator, 2020.
 * This is a new Max implementation of the supplied SuperCollider source.
 */
var APGPlan = (function () {
    "use strict";
    function finite(x) { return typeof x === "number" && isFinite(x); }
    function clamp(x, a, b) { return Math.max(a, Math.min(b, x)); }
    function makePlan(sources, repeats, pitchRange, sampleRate, random) {
        var i, j, source, longest = 0, events = [], counts = [], edges = [];
        if (!sources || sources.length !== 3) throw new Error("Load all three samples.");
        if (!finite(sampleRate) || sampleRate <= 0) throw new Error("Audio sample rate is unavailable.");
        if (!repeats || repeats.length !== 3) throw new Error("Three repeat values are required.");
        if (!finite(pitchRange)) throw new Error("Pitch range must be a finite number.");
        pitchRange = clamp(pitchRange, 0, 1);
        random = random || Math.random;
        function rnd() {
            var r = random();
            if (!finite(r) || r < 0 || r >= 1) throw new Error("Random values must be in [0, 1).");
            return r;
        }
        for (i = 0; i < 3; i++) {
            source = sources[i];
            if (!source || typeof source.name !== "string" || !source.name.length ||
                    !finite(source.durationMs) || source.durationMs <= 0 ||
                    !finite(source.frames) || source.frames < 2 || Math.floor(source.frames) !== source.frames ||
                    (source.channels !== 1 && source.channels !== 2)) {
                throw new Error("Each sample must be a nonempty mono or stereo audio buffer.");
            }
            if (!finite(repeats[i])) throw new Error("Repeat values must be finite numbers.");
            longest = Math.max(longest, source.durationMs);
        }
        var totalFrames = Math.max(4, Math.round(2 * longest * sampleRate / 1000));
        // count~ takes integer settings. Keep the entire timeline within signed 32-bit range.
        if (totalFrames > 2147483646) throw new Error("These samples are too long for the sample counter.");
        var pair = 0;
        for (i = 0; i < 3; i++) {
            source = sources[i];
            var maximum = clamp(Math.round(repeats[i]), 1, 20);
            var minimum = Math.ceil(maximum / 2);
            var count = minimum + Math.floor(rnd() * (maximum - minimum + 1));
            counts.push(count);
            for (j = 0; j < count; j++) {
                var amplitude = 0.2 + 0.3 * rnd();
                var location = 0.01 + 0.47 * rnd();
                var rate = 1 + pitchRange * rnd();
                var direction = rnd() < 0.5 ? -1 : 1;
                var length = Math.max(2, Math.round(source.durationMs * sampleRate / (1000 * rate)));
                var a = Math.round(location * totalFrames);
                // Only relevant for sub-millisecond files: keep rounding within the interval.
                a = clamp(a, 0, totalFrames - length);
                var b = totalFrames - a - length;
                var lastMs = source.durationMs * (source.frames - 1) / source.frames;
                var add = function (start, dir) {
                    var ev = {
                        slot: i, pair: pair, bufferName: source.name,
                        startFrame: start, lengthFrames: length,
                        rate: rate, amplitude: amplitude, direction: dir,
                        positionStartMs: dir === 1 ? 0 : lastMs,
                        positionDeltaMs: dir === 1 ? lastMs : -lastMs,
                        mono: source.channels === 1
                    };
                    events.push(ev);
                    var weight = amplitude * 0.8 * (ev.mono ? Math.SQRT1_2 : 1);
                    edges.push({frame: start, delta: weight});
                    edges.push({frame: start + length, delta: -weight});
                };
                add(a, direction);
                add(b, -direction);
                pair++;
            }
        }
        edges.sort(function (a, b) { return a.frame - b.frame || a.delta - b.delta; });
        var bound = 0, peakBound = 0;
        for (i = 0; i < edges.length; i++) {
            bound += edges[i].delta;
            peakBound = Math.max(peakBound, bound);
        }
        return {
            sampleRate: sampleRate, totalFrames: totalFrames,
            durationMs: totalFrames * 1000 / sampleRate,
            counts: counts, events: events,
            // Constant for the whole composition. No compressor or moving gain envelope.
            normalization: Math.min(1, 0.85 / Math.max(0.85, peakBound))
        };
    }
    return {makePlan: makePlan};
}());
if (typeof module !== "undefined" && module.exports) module.exports = APGPlan;
