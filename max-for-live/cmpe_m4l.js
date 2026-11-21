/* CMPE Max for Live 0.1.0 preview. Generated; edit developer modules. */
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

/* APG offline audio renderer, ES5-compatible for the legacy Max js engine.
 * It has no Max-specific calls. readSource supplies contiguous source samples.
 * Musical construction: Joo Won Park's Audio Palindrome Generator.
 */
var APGRender = (function () {
    "use strict";
    function finite(value) { return typeof value === "number" && isFinite(value); }
    function integer(value) { return finite(value) && Math.floor(value) === value; }
    function clamp(value, low, high) { return Math.max(low, Math.min(high, value)); }

    function readChecked(reader, slot, channel, first, count) {
        var data = reader(slot, channel, first, count), i;
        // Max versions may return a scalar when exactly one sample is requested.
        if (count === 1 && finite(data)) data = [data];
        if (!data || !integer(data.length) || data.length < count) {
            throw new Error("Source reader returned too few samples.");
        }
        for (i = 0; i < count; i++) {
            if (!finite(data[i])) throw new Error("Source audio contains a non-finite sample.");
        }
        return data;
    }

    function renderChunk(plan, sources, start, count, readSource) {
        var i, j, event, source, end, n, size, left, right, peak = 0;
        if (!plan || !integer(plan.totalFrames) || plan.totalFrames < 0 ||
                !plan.events || !integer(plan.events.length) || plan.events.length < 0 ||
                !finite(plan.normalization) || plan.normalization < 0 || plan.normalization > 1) {
            throw new Error("Invalid render plan.");
        }
        if (!sources || !integer(sources.length) || sources.length < 1) {
            throw new Error("Source metadata is required.");
        }
        if (!integer(start) || start < 0 || start > plan.totalFrames ||
                !integer(count) || count < 0 || typeof readSource !== "function") {
            throw new Error("Invalid render chunk or source reader.");
        }
        size = Math.min(count, plan.totalFrames - start);
        end = start + size;
        left = new Array(size); right = new Array(size);
        for (i = 0; i < size; i++) { left[i] = 0; right[i] = 0; }

        for (i = 0; i < plan.events.length; i++) {
            event = plan.events[i];
            if (!event || !integer(event.slot) || event.slot < 0 || event.slot >= sources.length ||
                    !integer(event.startFrame) || event.startFrame < 0 ||
                    !integer(event.lengthFrames) || event.lengthFrames < 2 ||
                    event.startFrame + event.lengthFrames > plan.totalFrames ||
                    !finite(event.amplitude) || event.amplitude < 0 ||
                    !finite(event.positionStartMs) || !finite(event.positionDeltaMs)) {
                throw new Error("Invalid event in render plan.");
            }
            source = sources[event.slot];
            if (!source || !integer(source.frames) || source.frames < 2 ||
                    !finite(source.durationMs) || source.durationMs <= 0 ||
                    (source.channels !== 1 && source.channels !== 2) ||
                    Boolean(event.mono) !== (source.channels === 1)) {
                throw new Error("Invalid source metadata for render event.");
            }
            var first = Math.max(start, event.startFrame);
            var last = Math.min(end, event.startFrame + event.lengthFrames);
            if (last <= first || size === 0 || event.amplitude === 0 || plan.normalization === 0) continue;

            var denominator = event.lengthFrames - 1;
            // Endpoints are exactly zero. Avoid source I/O for a zero-only overlap.
            first = Math.max(first, event.startFrame + 1);
            last = Math.min(last, event.startFrame + denominator);
            if (last <= first) continue;

            var framesPerMs = source.frames / source.durationMs;
            var sourceStart = event.positionStartMs * framesPerMs;
            var sourceSpan = event.positionDeltaMs * framesPerMs;
            var lastSourceFrame = source.frames - 1;
            var sourceEnd = sourceStart + sourceSpan;
            var tolerance = 1e-6;
            if (!finite(framesPerMs) || !finite(sourceStart) || !finite(sourceEnd) ||
                    sourceStart < -tolerance || sourceStart > lastSourceFrame + tolerance ||
                    sourceEnd < -tolerance || sourceEnd > lastSourceFrame + tolerance) {
                throw new Error("An event reads outside its source buffer.");
            }
            var firstPosition = clamp(sourceStart + ((first - event.startFrame) / denominator) * sourceSpan, 0, lastSourceFrame);
            var lastPosition = clamp(sourceStart + ((last - 1 - event.startFrame) / denominator) * sourceSpan, 0, lastSourceFrame);
            var readFirst = Math.floor(Math.min(firstPosition, lastPosition));
            var readLast = Math.min(lastSourceFrame, Math.floor(Math.max(firstPosition, lastPosition)) + 1);
            var readCount = readLast - readFirst + 1;
            var sourceLeft = readChecked(readSource, event.slot, 1, readFirst, readCount);
            var sourceRight = event.mono ? sourceLeft : readChecked(readSource, event.slot, 2, readFirst, readCount);
            var gain = event.amplitude * 0.8 * (event.mono ? Math.SQRT1_2 : 1) * plan.normalization;

            for (n = first; n < last; n++) {
                // Use the absolute frame, not a running phase accumulator. Chunk
                // boundaries therefore cannot change the generated sample values.
                var phase = (n - event.startFrame) / denominator;
                var envelope = phase < 0.01 ? phase * 100 : (phase > 0.99 ? (1 - phase) * 100 : 1);
                var position = clamp(sourceStart + phase * sourceSpan, 0, lastSourceFrame);
                var index = Math.floor(position);
                var fraction = position - index;
                var a = index - readFirst;
                var b = Math.min(index + 1, lastSourceFrame) - readFirst;
                var scale = envelope * gain;
                j = n - start;
                left[j] += (sourceLeft[a] + fraction * (sourceLeft[b] - sourceLeft[a])) * scale;
                right[j] += (sourceRight[a] + fraction * (sourceRight[b] - sourceRight[a])) * scale;
            }
        }
        for (i = 0; i < size; i++) {
            left[i] = clamp(left[i], -0.99, 0.99);
            right[i] = clamp(right[i], -0.99, 0.99);
            peak = Math.max(peak, Math.abs(left[i]), Math.abs(right[i]));
        }
        return {left: left, right: right, peak: peak};
    }
    return {renderChunk: renderChunk};
}());
if (typeof module !== "undefined" && module.exports) module.exports = APGRender;

/* Pure musical models for the CMPE Variety Pack Max adaptation.
 * Original algorithms: Joo Won Park, https://joowonpark.net/cmpe/.
 * ES5 only: runs in Max's legacy js object and in Node for verification.
 * Time fields are milliseconds unless their names explicitly say otherwise.
 * Source-reader channels are ONE-based, matching Max Buffer.peek().
 */
var CMPEModel = (function () {
    "use strict";
    var MAX_DURATION_MS = 600000;
    var MAX_OUTPUT_BYTES = 200 * 1024 * 1024;
    var PITCH_SETS = [
        [-12, -10, -8, -7, -5, -3, -1, 0, 2, 4, 5, 7, 9, 11, 12],
        [-12, -10, -9, -7, -5, -4, -1, 0, 2, 3, 5, 7, 8, 11, 12],
        [0, 2, 4, 7, 9, -3, -5, -8, -10, -12],
        [-12, -11, -10, -9, -8, -7, -6, -5, -4, -3, -2, -1, 0,
            1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
    ];
    var PITCH_NAMES = ["Major", "Minor", "Pentatonic", "Atonal", "Microtonal"];

    function finite(value) { return typeof value === "number" && isFinite(value); }
    function integer(value) { return finite(value) && Math.floor(value) === value; }
    function clamp(value, low, high) { return Math.max(low, Math.min(high, value)); }
    function number(value, fallback) { return finite(value) ? value : fallback; }
    function unit(rng) {
        var value = (rng || Math.random)();
        if (!finite(value) || value < 0 || value > 1) {
            throw new Error("Random source must return a number between zero and one.");
        }
        return value;
    }
    function uniform(rng, low, high) { return low + (high - low) * unit(rng); }
    function choose(rng, values) {
        return values[Math.min(values.length - 1, Math.floor(unit(rng) * values.length))];
    }
    function ratio(semitones) { return Math.pow(2, semitones / 12); }
    function arrayValue(values, index, fallback) {
        return values && finite(values[index]) ? values[index] : fallback;
    }
    function microtonalSet(rng) {
        var values = [], i;
        for (i = 0; i < 12; i++) values.push(uniform(rng, -0.15, 0.15));
        return values;
    }
    function pitchSetIndex(value) {
        var i;
        if (typeof value === "string") {
            for (i = 0; i < PITCH_NAMES.length; i++) {
                if (PITCH_NAMES[i].toLowerCase() === value.toLowerCase()) return i;
            }
            return 1;
        }
        return clamp(Math.round(number(value, 1)), 0, 4);
    }

    /* SuperCollider numeric Env curve interpolation. "exp" is geometric.
     * A numeric curve of zero is linear. Endpoint branches are exact.
     */
    function curve(from, to, phase, shape) {
        var t = clamp(phase, 0, 1), amount;
        if (t <= 0) return from;
        if (t >= 1) return to;
        if (from === to) return from;
        if (shape === "exp") {
            if (from <= 0 || to <= 0) throw new Error("Exponential envelope endpoints must be positive.");
            return from * Math.pow(to / from, t);
        }
        shape = number(shape, 0);
        amount = Math.abs(shape) < 0.000001 ? t :
            (1 - Math.exp(t * shape)) / (1 - Math.exp(shape));
        return from + (to - from) * amount;
    }
    function envelopeValue(segments, timeMs) {
        var t = Math.max(0, timeMs), elapsed = 0, i, seg;
        if (!segments || !segments.length) return 0;
        if (timeMs < 0) return segments[0].from;
        for (i = 0; i < segments.length; i++) {
            seg = segments[i];
            if (seg.durationMs > 0 && t < elapsed + seg.durationMs) {
                return curve(seg.from, seg.to, (t - elapsed) / seg.durationMs, seg.curve);
            }
            elapsed += seg.durationMs;
        }
        return segments[segments.length - 1].to;
    }
    function envelopePoints(segments, stepsPerCurve) {
        var steps = clamp(Math.round(number(stepsPerCurve, 16)), 1, 64);
        var result = [], elapsed = 0, i, j, count, seg, phase, rootLevel;
        if (!segments || !segments.length) return result;
        result.push({timeMs: 0, value: segments[0].from});
        for (i = 0; i < segments.length; i++) {
            seg = segments[i];
            if (!finite(seg.durationMs) || seg.durationMs < 0 ||
                    !finite(seg.from) || !finite(seg.to)) throw new Error("Invalid envelope segment.");
            count = seg.from === seg.to || seg.curve === 0 || seg.durationMs === 0 ? 1 : steps;
            for (j = 1; j <= count; j++) {
                phase = j / count;
                /* Exponential fades span 120 dB. Allocate more knots where
                 * their absolute amplitude curvature is greatest, rather
                 * than spending most knots on almost inaudible levels.
                 */
                if (seg.curve === "exp" && seg.from !== seg.to && j < count) {
                    rootLevel = Math.sqrt(seg.from) + (Math.sqrt(seg.to) - Math.sqrt(seg.from)) * phase;
                    phase = Math.log(rootLevel * rootLevel / seg.from) / Math.log(seg.to / seg.from);
                }
                result.push({timeMs: elapsed + seg.durationMs * phase,
                    value: curve(seg.from, seg.to, phase, seg.curve)});
            }
            elapsed += seg.durationMs;
        }
        return result;
    }
    function defaultSettings(mode, rng) {
        mode = String(mode || "").toLowerCase();
        if (mode === "isjs") return {
            position: 0.5, densityY: 0.5,
            rates: [1.1, 1.03, 1.2], levels: [0.5, 0.5, 0.5],
            panWidths: [uniform(rng, 0.3, 1), uniform(rng, 0.3, 1), uniform(rng, 0.3, 1)]
        };
        if (mode === "many") return {
            level: 1, delayMaxMs: 200, intervalMaxMs: 10000,
            pitchSet: 1, microtonalSet: microtonalSet(rng)
        };
        if (mode === "rmhs") return {
            level: Math.round(uniform(rng, 0.05, 0.5) * 100) / 100,
            fundamentalHz: Math.min(150, 30 + Math.floor(unit(rng) * 121)),
            intervalSemitones: Math.min(14, Math.floor(unit(rng) * 15)),
            durationSeconds: Math.min(200, 20 + Math.floor(unit(rng) * 181)),
            harmonics: Math.min(13, 7 + Math.floor(unit(rng) * 7))
        };
        if (mode === "sioe") return {count: 10, tempo: 120, hitSeconds: 3, form: "long"};
        throw new Error("Unknown CMPE mode.");
    }

    function isjsEvent(settings, slot, rng) {
        settings = settings || {};
        if (!integer(slot) || slot < 0 || slot > 2) throw new Error("ISJS source must be 0, 1, or 2.");
        var y = clamp(number(settings.densityY, 0.5), 0, 1);
        var density = slot === 0 ? 0.5 + 39.5 * y : 0.1 + 34.9 * y;
        var period = 1000 / density;
        var scale = period + 10;
        var level = clamp(arrayValue(settings.levels, slot, 0.5), 0, 1);
        var width = clamp(arrayValue(settings.panWidths, slot, 1), 0, 1);
        var shape = uniform(rng, 1, 2);
        var segments = [
            {durationMs: 0.02 * scale, from: 0, to: 1, curve: shape},
            {durationMs: 0.97 * scale, from: 1, to: 0, curve: shape}
        ];
        return {
            slot: slot, position: clamp(number(settings.position, 0.5), 0, 1),
            rate: clamp(arrayValue(settings.rates, slot, [1.1, 1.03, 1.2][slot]), 0.3, 1.7),
            level: level, densityHz: density, periodMs: period, durationMs: 0.99 * scale,
            pan: uniform(rng, -width, width), amplitude: level * uniform(rng, 0.9, 1.2),
            segments: segments, envelope: envelopePoints(segments, 12)
        };
    }

    function manyEvent(settings, rng) {
        settings = settings || {};
        var index = pitchSetIndex(settings.pitchSet), pitches, i;
        if (index === 4) {
            pitches = settings.microtonalSet || microtonalSet(rng);
            if (!pitches.length) throw new Error("Microtonal pitch set is empty.");
            for (i = 0; i < pitches.length; i++) {
                if (!finite(pitches[i]) || Math.abs(pitches[i]) > 0.15 + 1e-12) {
                    throw new Error("Microtonal pitches must lie within plus or minus 0.15 semitones.");
                }
            }
        } else pitches = PITCH_SETS[index];
        var semitones = choose(rng, pitches);
        var delayMax = clamp(number(settings.delayMaxMs, 200), 100, 500);
        var voiceDelayMax = delayMax * uniform(rng, 0.5, 1);
        var feed = uniform(rng, 1.02, 1.1);
        var dryDuration = uniform(rng, 2000, 4000);
        var dryCurve = uniform(rng, 0.5, 1.4);
        var wetAttack = uniform(rng, 2000, 4000);
        var stages = [], left, right, decay;
        for (i = 0; i < 7; i++) {
            left = uniform(rng, voiceDelayMax * 0.25, voiceDelayMax);
            right = uniform(rng, voiceDelayMax * 0.25, voiceDelayMax);
            decay = uniform(rng, 10, 30);
            stages.push({leftMs: left, rightMs: right, decaySeconds: decay,
                leftK: Math.min(0.999999, Math.pow(0.001, left / (1000 * decay))),
                rightK: Math.min(0.999999, Math.pow(0.001, right / (1000 * decay)))});
        }
        /* The SC file supplies four curve values for three segments. Its
         * fourth (negative) value is unused: the actual release curve is +1.
         */
        var drySegments = [
            {durationMs: dryDuration * 0.1, from: 0.00001, to: 1, curve: dryCurve},
            {durationMs: dryDuration * 0.4, from: 1, to: 1, curve: 1},
            {durationMs: dryDuration * 0.5, from: 1, to: 0.00001, curve: 1}
        ];
        var wetSegments = [{durationMs: wetAttack, from: 0.00001, to: 1, curve: 4}];
        return {
            slot: 0, pitchSet: index, semitones: semitones, rate: ratio(semitones),
            level: clamp(number(settings.level, 1), 0, 2), feed: feed,
            voiceDelayMaxMs: voiceDelayMax, stages: stages,
            dryDurationMs: dryDuration, drySegments: drySegments, dryEnvelope: envelopePoints(drySegments, 12),
            wetAttackMs: wetAttack, wetSegments: wetSegments, wetEnvelope: envelopePoints(wetSegments, 24),
            nextMs: uniform(rng, 0.5, 1) * clamp(number(settings.intervalMaxMs, 10000), 5000, 20000),
            microtonalSet: index === 4 ? pitches.slice(0) : null
        };
    }

    function rmhsPlan(settings, sampleRate, rng) {
        settings = settings || {};
        if (!finite(sampleRate) || sampleRate <= 0) throw new Error("A positive output sample rate is required.");
        var level = clamp(number(settings.level, 0.2), 0, 1), base = level * 0.25;
        var fundamental = clamp(number(settings.fundamentalHz, 100), 0, 20000);
        var interval = clamp(number(settings.intervalSemitones, 7), 0, 24);
        var harmonicCount = clamp(Math.round(number(settings.harmonics, 10)), 3, 20);
        var duration = Math.abs(number(settings.durationSeconds, 100)) * 1000;
        if (!finite(duration)) throw new Error("Drone duration is too large.");
        var voices = [], skipped = 0, total = 0, longest = 0, bank, h, count;
        var frequency, pan, amplitude, driftRate, attack, release, segments, voiceDuration;
        for (bank = 0; bank < 3; bank++) {
            count = bank === 0 ? Math.round(harmonicCount * 3 / 4) : harmonicCount;
            for (h = 1; h <= count; h++) {
                total++;
                frequency = fundamental * h * (bank === 0 ? 1 : ratio(interval));
                /* Reserve room for the complete positive 2% pitch drift. */
                if (frequency <= 0 || frequency * 1.02 >= sampleRate / 2) { skipped++; continue; }
                pan = bank === 0 ? 0 : (bank === 1 ? uniform(rng, 0.2, 0.7) : uniform(rng, -0.7, -0.2));
                amplitude = base * (bank === 0 ? 2 : 1) * (2 / 3) / h;
                driftRate = uniform(rng, 0.001, 0.3);
                attack = uniform(rng, 3000, 20000);
                release = duration * uniform(rng, 0.5, 1);
                voiceDuration = attack + 0.5 * duration + release;
                segments = [
                    {durationMs: attack, from: 0.000001, to: 1, curve: "exp"},
                    {durationMs: duration * 0.5, from: 1, to: 1, curve: "exp"},
                    {durationMs: release, from: 1, to: 0.000001, curve: "exp"}
                ];
                voices.push({bank: ["center", "right", "left"][bank], harmonic: h,
                    frequencyHz: frequency, amplitude: amplitude, pan: pan,
                    driftRateHz: driftRate, driftMaxHz: frequency * 0.02, driftLagMs: 500 / driftRate,
                    modRateHz: uniform(rng, 0.002, 0.02), modPhase: uniform(rng, 0, Math.PI),
                    durationMs: voiceDuration, segments: segments, envelope: envelopePoints(segments, 14)});
                longest = Math.max(longest, voiceDuration);
            }
        }
        return {voices: voices, durationMs: longest, skippedPartials: skipped,
            totalPartials: total, sampleRate: sampleRate, harmonics: harmonicCount};
    }

    function sourceCheck(source) {
        if (!source || !integer(source.frames) || source.frames < 1 ||
                !finite(source.durationMs) || source.durationMs <= 0 ||
                (source.channels !== 1 && source.channels !== 2)) {
            throw new Error("Load a valid mono or stereo source in sample 1.");
        }
    }
    function outputGuard(frames, sampleRate) {
        if (!integer(frames) || frames < 1 || !finite(sampleRate) || sampleRate <= 0) {
            throw new Error("Invalid output duration or sample rate.");
        }
        if (frames * 1000 / sampleRate > MAX_DURATION_MS + 1e-7 || frames * 8 > MAX_OUTPUT_BYTES) {
            throw new Error("This supercut exceeds the 10-minute / 200 MiB output limit. Reduce the count or hit duration, or increase tempo.");
        }
    }
    function concurrency(events) {
        var points = [], i, running = 0, maximum = 0;
        for (i = 0; i < events.length; i++) {
            points.push({frame: events[i].startFrame, delta: 1});
            points.push({frame: events[i].startFrame + events[i].lengthFrames, delta: -1});
        }
        points.sort(function (a, b) { return a.frame - b.frame || a.delta - b.delta; });
        for (i = 0; i < points.length; i++) {
            running += points[i].delta;
            maximum = Math.max(maximum, running);
        }
        return maximum;
    }
    function sioePlan(sources, settings, sampleRate, rng) {
        settings = settings || {};
        sourceCheck(sources && sources[0]);
        if (!finite(sampleRate) || sampleRate <= 0) throw new Error("A positive output sample rate is required.");
        var count = clamp(Math.round(number(settings.count, 10)), 1, 100);
        var tempo = clamp(number(settings.tempo, 120), 1, 3000);
        var hitSeconds = clamp(number(settings.hitSeconds, 3), 0.00001, 10);
        var form = settings.form === "short" || settings.form === 0 ? "short" : "long";
        var beatMs = 240000 / tempo;
        var nominalFrames = form === "long" ? Math.round(2 * count * beatMs * sampleRate / 1000) : 1;
        outputGuard(Math.max(1, nominalFrames), sampleRate);
        var source = sources[0], events = [], longest = nominalFrames, order = 0;
        var chord, voices, slice, start, attack, release, pan, amplitude, length, ev;
        var chords = form === "short" ? 1 : 2 * count;
        for (chord = 0; chord < chords; chord++) {
            voices = form === "short" ? count : (chord < count ? chord + 1 : 2 * count - chord - 1);
            start = form === "short" ? 0 : Math.round(chord * beatMs * sampleRate / 1000);
            for (slice = 1; slice <= voices; slice++) {
                attack = uniform(rng, 10, 300);
                release = uniform(rng, hitSeconds * 500, hitSeconds * 1000);
                pan = uniform(rng, -1, 1);
                amplitude = 0.9 / (voices * (form === "short" ? 0.4 : 0.8));
                length = Math.ceil((attack + release) * sampleRate / 1000) + 1;
                ev = {slot: 0, order: order++, chord: chord, chordVoices: voices, slice: slice,
                    startFrame: start, lengthFrames: length,
                    sourceStartFrame: (slice % count) * source.frames / count,
                    rate: 1, attackMs: attack, releaseMs: release, curve: uniform(rng, -5, -4),
                    pan: pan, amplitude: amplitude,
                    gainLeft: amplitude * Math.cos((pan + 1) * Math.PI / 4),
                    gainRight: amplitude * Math.sin((pan + 1) * Math.PI / 4)};
                events.push(ev);
                longest = Math.max(longest, start + length);
            }
        }
        outputGuard(longest, sampleRate);
        var maxConcurrent = concurrency(events), workFrames = 0;
        for (chord = 0; chord < events.length; chord++) workFrames += events[chord].lengthFrames;
        return {mode: "sioe", form: form, count: count, tempo: tempo, hitSeconds: hitSeconds,
            events: events, totalFrames: longest, sampleRate: sampleRate,
            durationMs: longest * 1000 / sampleRate, normalization: 1,
            chordIntervalMs: beatMs, nominalFrames: nominalFrames,
            maxConcurrent: maxConcurrent, workFrames: workFrames,
            recommendedChunkFrames: Math.max(16, Math.min(4096, Math.floor(131072 / Math.max(1, maxConcurrent))))};
    }

    /* Bounded source-page cache. The file is never materialized into a full JS
     * array. The same path also handles one-frame buffers and repeated wraps.
     */
    function SourceCache(sources, reader) {
        this.sources = sources; this.reader = reader;
        this.pageFrames = 2048; this.maxPages = 256;
        this.pages = {}; this.order = [];
    }
    SourceCache.prototype.sample = function (slot, channel, index) {
        var source = this.sources[slot], pageIndex = Math.floor(index / this.pageFrames);
        var key = slot + ":" + channel + ":" + pageIndex, page = this.pages[key];
        var first, count, values, i;
        if (!page) {
            first = pageIndex * this.pageFrames;
            count = Math.min(this.pageFrames, source.frames - first);
            values = this.reader(slot, channel, first, count);
            if (count === 1 && finite(values)) values = [values];
            if (!values || !integer(values.length) || values.length < count) {
                throw new Error("Source reader returned too few samples.");
            }
            for (i = 0; i < count; i++) {
                if (!finite(values[i])) throw new Error("Source audio contains a non-finite sample.");
            }
            page = {first: first, values: values};
            if (this.order.length >= this.maxPages) delete this.pages[this.order.shift()];
            this.order.push(key); this.pages[key] = page;
        }
        return page.values[index - page.first];
    };
    function SioeRenderer(plan, sources, reader) {
        if (!plan || !plan.events || !integer(plan.events.length) ||
                !finite(plan.normalization) || plan.normalization < 0 || plan.normalization > 1 ||
                typeof reader !== "function") throw new Error("Invalid supercut render plan or reader.");
        sourceCheck(sources && sources[0]);
        outputGuard(plan.totalFrames, plan.sampleRate);
        var i, event, previous = -1;
        for (i = 0; i < plan.events.length; i++) {
            event = plan.events[i];
            if (!event || event.slot !== 0 || !integer(event.startFrame) || event.startFrame < 0 || event.startFrame < previous ||
                    !integer(event.lengthFrames) || event.lengthFrames < 1 ||
                    event.startFrame + event.lengthFrames > plan.totalFrames ||
                    !finite(event.sourceStartFrame) || event.sourceStartFrame < 0 ||
                    event.sourceStartFrame >= sources[0].frames ||
                    !finite(event.attackMs) || event.attackMs <= 0 || !finite(event.releaseMs) || event.releaseMs <= 0 ||
                    !finite(event.gainLeft) || !finite(event.gainRight) || !finite(event.curve)) {
                throw new Error("Invalid event in supercut render plan.");
            }
            previous = event.startFrame;
        }
        this.plan = plan; this.sources = sources; this.cache = new SourceCache(sources, reader);
        this.next = 0; this.active = []; this.lastEnd = 0;
    }
    SioeRenderer.prototype.renderChunk = function (start, count) {
        var plan = this.plan, source = this.sources[0], i, n, event, first, last, sampleTime, env;
        if (!integer(start) || start < 0 || start > plan.totalFrames || !integer(count) || count < 0) {
            throw new Error("Invalid supercut render chunk.");
        }
        var size = Math.min(count, plan.totalFrames - start), end = start + size;
        var left = new Array(size), right = new Array(size), active = [], peak = 0;
        var step = source.frames * 1000 / (source.durationMs * plan.sampleRate);
        var position, index, nextIndex, fraction, a, b, value, offset;
        for (i = 0; i < size; i++) { left[i] = 0; right[i] = 0; }
        if (start !== this.lastEnd) { this.next = 0; this.active = []; }
        for (i = 0; i < this.active.length; i++) {
            if (this.active[i].startFrame + this.active[i].lengthFrames > start) active.push(this.active[i]);
        }
        while (this.next < plan.events.length && plan.events[this.next].startFrame < end) {
            event = plan.events[this.next++];
            if (event.startFrame + event.lengthFrames > start) active.push(event);
        }
        this.active = active; this.lastEnd = end;
        for (i = 0; i < active.length; i++) {
            event = active[i];
            first = Math.max(start, event.startFrame);
            last = Math.min(end, event.startFrame + event.lengthFrames);
            if (plan.normalization === 0) continue;
            for (n = first; n < last; n++) {
                sampleTime = (n - event.startFrame) * 1000 / plan.sampleRate;
                if (sampleTime <= 0 || sampleTime >= event.attackMs + event.releaseMs) continue;
                env = sampleTime < event.attackMs ? curve(0, 1, sampleTime / event.attackMs, event.curve) :
                    curve(1, 0, (sampleTime - event.attackMs) / event.releaseMs, event.curve);
                /* Absolute frame math makes output independent of chunk sizes. */
                position = (event.sourceStartFrame + (n - event.startFrame) * step) % source.frames;
                index = Math.floor(position); nextIndex = (index + 1) % source.frames;
                fraction = position - index;
                a = this.cache.sample(0, 1, index); b = this.cache.sample(0, 1, nextIndex);
                value = a + (b - a) * fraction;
                if (source.channels === 2) {
                    a = this.cache.sample(0, 2, index); b = this.cache.sample(0, 2, nextIndex);
                    value += a + (b - a) * fraction;
                }
                value *= env * plan.normalization;
                offset = n - start;
                left[offset] += value * event.gainLeft;
                right[offset] += value * event.gainRight;
            }
        }
        for (i = 0; i < size; i++) peak = Math.max(peak, Math.abs(left[i]), Math.abs(right[i]));
        return {left: left, right: right, peak: peak, frames: size, startFrame: start};
    };
    function createSioeRenderer(plan, sources, reader) { return new SioeRenderer(plan, sources, reader); }
    function renderSioeChunk(plan, sources, start, count, reader) {
        return createSioeRenderer(plan, sources, reader).renderChunk(start, count);
    }
    return {
        version: 1, MAX_DURATION_MS: MAX_DURATION_MS, MAX_OUTPUT_BYTES: MAX_OUTPUT_BYTES,
        pitchNames: PITCH_NAMES.slice(0),
        pitchSets: [PITCH_SETS[0].slice(0), PITCH_SETS[1].slice(0), PITCH_SETS[2].slice(0), PITCH_SETS[3].slice(0)],
        curve: curve, envelopeValue: envelopeValue, envelopePoints: envelopePoints,
        defaultSettings: defaultSettings, makeMicrotonalSet: microtonalSet,
        isjsEvent: isjsEvent, manyEvent: manyEvent, rmhsPlan: rmhsPlan,
        sioePlan: sioePlan, createSioeRenderer: createSioeRenderer, renderSioeChunk: renderSioeChunk
    };
}());
if (typeof module !== "undefined" && module.exports) module.exports = CMPEModel;

/* APG Wave: Max 8/9 legacy-js controller. APGPlan and APGRender are embedded
 * above this file in apg_wave.js. Original musical algorithm: Joo Won Park.
 */
autowatch = 0;
inlets = 1;
outlets = 4; // groove~, speed sig~, run gate, sample counter
var host = this;
var prefix = "apgw_" + new Date().getTime() + "_" + Math.floor(Math.random() * 1000000000);
var outputName = prefix + "_output";
var sources = [null, null, null], sourceBuffers = [null, null, null];
var paths = ["", "", ""], loading = [false, false, false], loadTasks = [null, null, null];
var repetitions = [3, 4, 5], pitchRange = 0.5, monitorDb = -12;
var audioOn = false, sampleRate = 0, state = "idle", initialized = false;
var plan = null, output = null, outputReady = false, dirty = true;
// Keep the original plan's coordinates intact; the output can be a shorter,
// symmetrically cropped interval of that plan.
var outputFrames = 0, outputDurationMs = 0, trimFrames = 0;
var scanFrame = 0, scanLimit = 0;
var silenceThreshold = 0.00001, trimPaddingMs = 25, minimumSilenceMs = 250;
var renderFrame = 0, renderHalf = 0, renderStarted = 0, renderPeak = 0;
var firstAudioFrame = -1, renderTask = null, lastWaveRefresh = 0;
var audioTask = null, demoTask = null, finishTask = null, selectionTask = null;
var startAction = "play", autoPlay = false, audioAttempts = 0, playToken = 0;
var loopEnabled = false, selectedStart = 0, selectedEnd = 0;
var activeStart = 0, activeEnd = 0, pendingSelection = [0, 0], updatingWave = false;
var savePending = false, saveTask = null, savePath = "";

function named(name) { return host.patcher.getnamed(name); }
function ui(name, value) { var o = named(name); if (o) o.message("set", value); }
function status(value) { ui("status", value); }
function finite(value) { return typeof value === "number" && isFinite(value); }
function clamp(value, low, high) { return Math.max(low, Math.min(high, value)); }
function slotOK(slot) { return finite(slot) && Math.floor(slot) === slot && slot >= 0 && slot < 3; }
function fileName(path) { return String(path).split(/[\\/:]/).pop(); }
function shortName(path) { var s = fileName(path); return s.length > 25 ? s.substring(0, 15) + "..." + s.substring(s.length - 7) : s; }
function localfile(name) {
    var path = String(host.patcher.filepath || ""), slash = path.lastIndexOf("/");
    return slash < 0 ? name : path.substring(0, slash + 1) + name;
}
function mutable() { return state === "idle" || state === "ready"; }
function cancelTask(task) { if (task) task.cancel(); }
function lockUI(flag) {
    var names = ["load1", "load2", "load3", "repeat1", "repeat2", "repeat3", "pitch", "demo_button", "new_button"];
    var i;
    for (i = 0; i < names.length; i++) { var o = named(names[i]); if (o) o.message("ignoreclick", flag ? 1 : 0); }
    var busy = state === "rendering" || state === "waiting" || state === "stopping";
    var optional = ["play_button", "loop_toggle", "clear_button", "save_button"];
    for (i = 0; i < optional.length; i++) {
        var item = named(optional[i]);
        if (item) item.message("ignoreclick", (busy || (optional[i] === "save_button" && !outputReady)) ? 1 : 0);
    }
    named("wave_l").message("setmode", outputReady && !busy ? 1 : 0);
    named("wave_r").message("setmode", outputReady && !busy ? 1 : 0);
}
function waveformLine(ms) { named("wave_l").message("line", ms); named("wave_r").message("line", ms); }
function refreshWave(resetRange) {
    updatingWave = true;
    named("wave_l").message("set", outputName, 1);
    named("wave_r").message("set", outputName, 2);
    if (plan) named("wave_link").message("list", 0, outputDurationMs,
        resetRange ? 0 : selectedStart, resetRange ? outputDurationMs : selectedEnd);
    updatingWave = false;
}
function loadbang() {
    if (initialized) return;
    initialized = true;
    var i;
    outlet(1, 0); outlet(2, 0); outlet(3, "stop");
    for (i = 0; i < 3; i++) named("source" + (i + 1)).message("name", prefix + "_source" + i);
    named("output_buffer").message("name", outputName);
    output = new Buffer(outputName);
    outlet(0, "set", outputName);
    named("wave_l").message("set", outputName, 1); named("wave_r").message("set", outputName, 2);
    named("wave_l").message("buftime", 150); named("wave_r").message("buftime", 150);
    named("wave_l").message("mouseoutput", "up"); named("wave_r").message("mouseoutput", "up");
    waveformLine(-1);
    ui("repeat1", 3); ui("repeat2", 4); ui("repeat3", 5); ui("pitch", 0.5);
    ui("loop_toggle", 0); ui("monitor_level", monitorDb); ui("progress", 0); ui("time", "0.0 s");
    named("monitor_gain").message("float", Math.pow(10, monitorDb / 20));
    ui("render_info", "Automatic edge trimming is on. Press PLAY to generate.");
    ui("selection_info", "Drag across the output to choose a loop.");
    status("Loading demo sounds...");
    lockUI(false);
    named("dsp_info").message("bang");
    demoTask = new Task(function () { demos(); }, host); demoTask.schedule(50);
    post("APG Wave: ready to load sources.\n");
}
function markDirty() {
    dirty = true;
    status(outputReady ? "Settings changed. PLAY will generate a new result." : "Ready. PLAY generates the waveform, then plays it.");
}
function loadfile(slot) {
    slot = Number(slot);
    var args = arrayfromargs(arguments), path = args.slice(1).join(" ");
    if (!slotOK(slot) || !path || !mutable()) return;
    if (loading[slot]) { status("This source is still loading."); return; }
    if (!/\.(wav|wave|aif|aiff)$/i.test(path)) { status("Choose a mono or stereo WAV/AIFF."); return; }
    loading[slot] = true; sources[slot] = null; sourceBuffers[slot] = null; paths[slot] = path; dirty = true;
    ui("file" + (slot + 1), "Loading..."); status("Loading source audio...");
    (function (s) {
        loadTasks[s] = new Task(function () {
            if (loading[s]) { loading[s] = false; ui("file" + (s + 1), "Load did not finish"); status("Check the source file and Max Console."); }
        }, host); loadTasks[s].schedule(30000);
    }(slot));
    named("source" + (slot + 1)).message("read", path, 0, -1, 0);
}
function loaded(slot) {
    slot = Number(slot); if (!slotOK(slot)) return;
    cancelTask(loadTasks[slot]); loadTasks[slot] = null; loading[slot] = false;
    try {
        var name = prefix + "_source" + slot, b = new Buffer(name);
        var frames = b.framecount(), duration = b.length(), channels = b.channelcount();
        if (frames < 2 || !finite(duration) || duration <= 0 || (channels !== 1 && channels !== 2)) throw new Error("Use mono or stereo audio.");
        sourceBuffers[slot] = b;
        sources[slot] = {name: name, frames: frames, durationMs: duration, channels: channels};
        ui("file" + (slot + 1), shortName(paths[slot]) + "\n" + (duration / 1000).toFixed(2) + " s / " + (channels === 1 ? "mono" : "stereo"));
        if (sources[0] && sources[1] && sources[2] && !loading[0] && !loading[1] && !loading[2]) {
            ui("duration", "Before trim: " + (2 * Math.max(sources[0].durationMs, sources[1].durationMs, sources[2].durationMs) / 1000).toFixed(1) + " s");
            markDirty();
        }
    } catch (e) { sources[slot] = null; status(e.message); }
}
function demos() {
    if (!mutable()) return;
    loadfile(0, localfile("apgw_test1.wav")); loadfile(1, localfile("apgw_test2.wav")); loadfile(2, localfile("apgw_test3.wav"));
}
function repeats(slot, value) {
    slot = Number(slot); value = Number(value); if (!slotOK(slot)) return;
    if (mutable() && finite(value)) { repetitions[slot] = clamp(Math.round(value), 1, 20); markDirty(); }
    ui("repeat" + (slot + 1), repetitions[slot]);
}
function pitch(value) {
    value = Number(value); if (mutable() && finite(value)) { pitchRange = clamp(value, 0, 1); markDirty(); }
    ui("pitch", pitchRange);
}
function monitor(value) {
    value = Number(value); if (!finite(value)) return;
    monitorDb = clamp(value, -60, 0); ui("monitor_level", monitorDb);
    named("monitor_gain").message("list", Math.pow(10, monitorDb / 20), 20);
}
function dspstate(value) {
    audioOn = Number(value) !== 0;
    if (!audioOn && state === "playing") finishPlayback("Audio stopped. The generated result is still available.");
}
function samplerate(value) {
    value = Number(value); if (!finite(value) || value <= 0) return;
    if (state === "playing" && sampleRate > 0 && value !== sampleRate) finishPlayback("Audio settings changed. Press PLAY again.");
    sampleRate = value;
}
function play() {
    if (state === "playing") return;
    if (!mutable()) return;
    requestAudio(dirty || !outputReady ? "renderplay" : "play");
}
function newpiece() {
    if (!mutable()) return;
    requestAudio("render");
}
function requestAudio(action) {
    if (savePending && action !== "play") { status("Wait for the WAV save to finish before generating again."); return; }
    if (loading[0] || loading[1] || loading[2]) { status("Please wait for the sources to finish loading."); return; }
    if (!sources[0] || !sources[1] || !sources[2]) { status("Load three samples or choose DEMO."); return; }
    state = "waiting"; startAction = action; audioAttempts = 0; lockUI(true);
    status("Starting audio..."); named("audio_driver").message("startwindow");
    audioTask = new Task(waitForAudio, host); audioTask.schedule(50);
}
function waitForAudio() {
    if (state !== "waiting") return;
    named("dsp_info").message("bang");
    if (audioOn && sampleRate > 0) {
        if (startAction === "play") beginPlayback(); else beginRender(startAction === "renderplay");
        return;
    }
    audioAttempts++;
    if (audioAttempts >= 100) { state = outputReady ? "ready" : "idle"; lockUI(false); status("Audio did not start. Check Max Audio Status."); return; }
    audioTask.schedule(100);
}
function beginRender(thenPlay) {
    try { plan = APGPlan.makePlan(sources, repetitions, pitchRange, sampleRate); }
    catch (e) { state = outputReady ? "ready" : "idle"; lockUI(false); status(e.message); return; }
    state = "rendering"; autoPlay = thenPlay; outputReady = false; dirty = true;
    outputFrames = plan.totalFrames; outputDurationMs = plan.durationMs; trimFrames = 0;
    renderFrame = 0; renderHalf = Math.ceil(outputFrames / 2); renderPeak = 0; firstAudioFrame = -1;
    scanLimit = renderHalf; scanFrame = scanLimit;
    var i;
    // Frames before every scheduled event are known to be zero. Starting at
    // the earliest event avoids calculating a potentially very long empty gap.
    for (i = 0; i < plan.events.length; i++) scanFrame = Math.min(scanFrame, plan.events[i].startFrame);
    renderStarted = new Date().getTime(); lastWaveRefresh = 0; selectedStart = 0; selectedEnd = outputDurationMs;
    outlet(1, 0); outlet(2, 0); outlet(0, "stop"); outlet(3, "stop");
    lockUI(true); named("stop_button").message("text", "CANCEL"); ui("progress", 0);
    ui("render_info", "Finding the start of the sound..."); status("Checking the quiet beginning and ending..."); waveformLine(-1);
    renderTask = new Task(scanOpening, host); renderTask.schedule(1);
}
function scanOpening() {
    if (state !== "rendering") return;
    var tickStart = new Date().getTime(), chunkSize = plan.events.length > 60 ? 512 : 2048;
    try {
        while (scanFrame < scanLimit) {
            var count = Math.min(chunkSize, scanLimit - scanFrame);
            var chunk = APGRender.renderChunk(plan, sources, scanFrame, count, readSource);
            if (chunk.peak > silenceThreshold) {
                var i;
                for (i = 0; i < count; i++) {
                    if (Math.max(Math.abs(chunk.left[i]), Math.abs(chunk.right[i])) > silenceThreshold) {
                        firstAudioFrame = scanFrame + i;
                        prepareOutput(); return;
                    }
                }
            }
            scanFrame += count;
            if (new Date().getTime() - tickStart >= 10) break;
        }
        ui("render_info", "Checking opening  /  " + (scanFrame / plan.sampleRate).toFixed(1) + " s examined");
        if (scanFrame >= scanLimit) prepareOutput(); else renderTask.schedule(1);
    } catch (e) { renderFailed(e.message); }
}
function prepareOutput() {
    if (state !== "rendering") return;
    if (firstAudioFrame >= Math.ceil(minimumSilenceMs * plan.sampleRate / 1000)) {
        var padding = Math.max(1, Math.round(trimPaddingMs * plan.sampleRate / 1000));
        trimFrames = Math.max(0, firstAudioFrame - padding);
        trimFrames = Math.min(trimFrames, Math.floor((plan.totalFrames - 2) / 2));
    }
    outputFrames = plan.totalFrames - 2 * trimFrames;
    outputDurationMs = outputFrames * 1000 / plan.sampleRate;
    if (firstAudioFrame >= 0) firstAudioFrame -= trimFrames;
    renderFrame = 0; renderHalf = Math.ceil(outputFrames / 2);
    selectedStart = 0; selectedEnd = outputDurationMs;
    ui("render_info", "Rendering 0%"); ui("progress", 0);
    status(trimFrames > 0 ? "Quiet edges trimmed. Rendering the shorter piece..." : "Rendering audio. CANCEL stops generation.");
    cancelTask(renderTask);
    renderTask = new Task(allocateOutput, host); renderTask.schedule(1);
}
function allocateOutput() {
    if (state !== "rendering") return;
    try {
        var b = named("output_buffer");
        b.message("sr", plan.sampleRate); b.message("sizeinsamps", outputFrames, 2); b.message("clear");
        output = new Buffer(outputName);
        if (output.framecount() !== outputFrames || output.channelcount() !== 2) throw new Error("Output buffer allocation did not complete.");
        refreshWave(true);
        renderTask = new Task(renderTick, host); renderTask.schedule(1);
    } catch (e) { renderFailed(e.message); }
}
function readSource(slot, channel, first, count) { return sourceBuffers[slot].peek(channel, first, count); }
function renderTick() {
    if (state !== "rendering") return;
    var tickStart = new Date().getTime(), chunkSize = plan.events.length > 60 ? 512 : 2048;
    try {
        do {
            var count = Math.min(chunkSize, renderHalf - renderFrame);
            var chunk = APGRender.renderChunk(plan, sources, trimFrames + renderFrame, count, readSource);
            output.poke(1, renderFrame, chunk.left); output.poke(2, renderFrame, chunk.right);
            // Reflect the already computed half: exact matching stored sample pairs,
            // half as much mixing, and no full-file JavaScript arrays.
            var mirrorStart = outputFrames - renderFrame - count;
            output.poke(1, mirrorStart, chunk.left.slice(0).reverse());
            output.poke(2, mirrorStart, chunk.right.slice(0).reverse());
            if (firstAudioFrame < 0 && chunk.peak > silenceThreshold) {
                var i;
                for (i = 0; i < count; i++) if (Math.max(Math.abs(chunk.left[i]), Math.abs(chunk.right[i])) > silenceThreshold) { firstAudioFrame = renderFrame + i; break; }
            }
            renderPeak = Math.max(renderPeak, chunk.peak); renderFrame += count;
        } while (renderFrame < renderHalf && new Date().getTime() - tickStart < 10);
        var now = new Date().getTime(), fraction = renderFrame / renderHalf;
        ui("progress", fraction);
        ui("render_info", "Rendering " + Math.floor(fraction * 100) + "%  /  " + ((now - renderStarted) / 1000).toFixed(1) + " s elapsed");
        status("Rendering audio. CANCEL stops generation.");
        if (now - lastWaveRefresh > 500) { refreshWave(true); lastWaveRefresh = now; }
        if (renderFrame >= renderHalf) renderComplete(); else renderTask.schedule(1);
    } catch (e) { renderFailed(e.message); }
}
function renderComplete() {
    state = "ready"; outputReady = true; dirty = false; cancelTask(renderTask); renderTask = null;
    refreshWave(true); waveformLine(0); selectedStart = 0; selectedEnd = outputDurationMs;
    pendingSelection = [selectedStart, selectedEnd];
    ui("progress", 1); ui("time", "0.0 / " + (outputDurationMs / 1000).toFixed(1) + " s");
    ui("duration", "Length: " + (outputDurationMs / 1000).toFixed(1) + " s");
    var trimSummary = trimFrames > 0 ? "  /  trimmed " + (trimFrames / plan.sampleRate).toFixed(2) + " s from each end" : (firstAudioFrame < 0 ? "  /  too quiet to trim" : "  /  no long edge silence");
    ui("render_info", "Ready" + trimSummary);
    named("stop_button").message("text", "STOP"); lockUI(false); selectionLabel();
    status(firstAudioFrame < 0 ? (renderPeak === 0 ? "The rendered output is silent. Check the source samples." : "Very quiet result. Edges kept; press PLAY to listen.") : "Ready. PLAY replays this result; NEW generates another.");
    if (autoPlay && firstAudioFrame >= 0) beginPlayback();
}
function renderFailed(message) {
    cancelTask(renderTask); renderTask = null; state = "idle"; outputReady = false; dirty = true;
    named("stop_button").message("text", "STOP"); lockUI(false);
    ui("render_info", "Render did not complete."); status(message); post("APG Wave render: " + message + "\n");
}
function beginPlayback() {
    if (!outputReady || !plan) return;
    if (!audioOn || sampleRate <= 0) {
        state = "ready"; lockUI(false);
        status("Audio stopped. Press PLAY to start audio and play this result."); return;
    }
    state = "playing"; playToken++; activeStart = selectedStart; activeEnd = selectedEnd;
    if (activeEnd - activeStart < 2 * 1000 / plan.sampleRate) { activeStart = 0; activeEnd = outputDurationMs; }
    var duration = activeEnd - activeStart;
    // Reset the old counter while completion is disabled, before assigning the
    // new run's token. A queued completion from an earlier run keeps its old token.
    outlet(2, 0); outlet(1, 0); named("loop_flag").message("float", 1);
    outlet(3, "stop");
    named("play_token").message("set", playToken);
    named("total_frames").message("int", Math.max(2, Math.round(duration * sampleRate / 1000)));
    named("edge_scale").message("float", duration / Math.min(5, duration / 4));
    outlet(0, "set", outputName);
    outlet(0, "setloop", activeStart, activeEnd); outlet(0, "loop", 1);
    outlet(0, "startloop"); outlet(3, "bang");
    named("loop_flag").message("float", loopEnabled ? 1 : 0);
    outlet(1, 1); outlet(2, 1, 5);
    lockUI(true); waveformLine(activeStart);
    status(loopEnabled ? "Looping selection..." : "Playing...");
}
function phase(value) {
    value = Number(value); if (state !== "playing" || !finite(value)) return;
    var ms = activeStart + clamp(value, 0, 1) * (activeEnd - activeStart);
    waveformLine(ms); ui("time", (ms / 1000).toFixed(1) + " / " + (outputDurationMs / 1000).toFixed(1) + " s");
    var firstMs = firstAudioFrame < 0 ? -1 : firstAudioFrame * 1000 / plan.sampleRate;
    if (firstMs >= 0 && ms < firstMs && firstMs < activeEnd) status("Playing: first sound in " + ((firstMs - ms) / 1000).toFixed(1) + " s.");
    else status(loopEnabled ? "Looping selection..." : "Playing...");
}
function ended(token) {
    if (state === "playing" && !loopEnabled && Number(token) === playToken) {
        waveformLine(activeEnd); ui("time", (activeEnd / 1000).toFixed(1) + " / " + (outputDurationMs / 1000).toFixed(1) + " s");
        finishPlayback("Done. Replay, select a loop, or generate NEW.");
    }
}
function finishPlayback(message) {
    cancelTask(finishTask); finishTask = null;
    outlet(2, 0); outlet(1, 0); outlet(0, "stop"); outlet(3, "stop");
    state = outputReady ? "ready" : "idle"; lockUI(false); status(message);
}
function stop() {
    cancelTask(audioTask); audioTask = null; cancelTask(selectionTask); selectionTask = null;
    cancelTask(finishTask); finishTask = null;
    if (state === "rendering") { renderFailed("Rendering cancelled. Press PLAY to try again."); return; }
    if (state === "waiting") { state = outputReady ? "ready" : "idle"; lockUI(false); status("Cancelled."); return; }
    if (state === "stopping") { finishPlayback("Stopped. The waveform is ready to replay."); return; }
    if (state === "playing") {
        state = "stopping"; outlet(2, 0, 8);
        finishTask = new Task(function () { finishPlayback("Stopped. The waveform is ready to replay."); }, host); finishTask.schedule(12);
    } else { status(outputReady ? "Ready. Select a range or press PLAY." : "Ready to generate."); }
}
function wavechange(viewStart, viewLength, a, b) {
    if (updatingWave || !outputReady || (state !== "ready" && state !== "playing")) return;
    a = Number(a); b = Number(b); if (!finite(a) || !finite(b)) return;
    pendingSelection = [a, b];
}
function wavemouse(x, y, event) {
    if (Number(event) !== 0 || updatingWave || !outputReady) return;
    cancelTask(selectionTask);
    selectionTask = new Task(commitSelection, host); selectionTask.schedule(1);
}
function commitSelection() {
    if (!outputReady || (state !== "ready" && state !== "playing")) return;
    var a = clamp(Math.min(pendingSelection[0], pendingSelection[1]), 0, outputDurationMs);
    var b = clamp(Math.max(pendingSelection[0], pendingSelection[1]), 0, outputDurationMs);
    // Snap to actual stored frames without destructive waveform edits.
    a = Math.round(a * plan.sampleRate / 1000) * 1000 / plan.sampleRate;
    b = Math.round(b * plan.sampleRate / 1000) * 1000 / plan.sampleRate;
    if (b - a < 2 * 1000 / plan.sampleRate) { a = 0; b = outputDurationMs; }
    selectedStart = a; selectedEnd = b; pendingSelection = [a, b];
    // Keep the drawn range identical to the committed range, including clicks
    // that expand back to full length and sub-sample endpoint rounding.
    updatingWave = true;
    named("wave_link").message("list", 0, outputDurationMs, a, b);
    updatingWave = false; selectionLabel();
    if (state === "playing") restartSelection();
    else status("Selection ready. PLAY once, or enable LOOP to repeat.");
}
function selectionLabel() {
    if (!plan) return;
    ui("selection_info", "Selection: " + (selectedStart / 1000).toFixed(2) + " - " + (selectedEnd / 1000).toFixed(2) + " s  (" + ((selectedEnd - selectedStart) / 1000).toFixed(2) + " s)");
}
function loopmode(value) {
    if (state === "rendering" || state === "waiting" || state === "stopping") { ui("loop_toggle", loopEnabled ? 1 : 0); return; }
    loopEnabled = Number(value) !== 0; ui("loop_toggle", loopEnabled ? 1 : 0);
    if (state === "playing") restartSelection();
}
function restartSelection() {
    state = "stopping"; outlet(2, 0, 5); cancelTask(finishTask); lockUI(true);
    finishTask = new Task(function () {
        finishTask = null;
        if (state !== "stopping") return;
        outlet(1, 0); outlet(0, "stop"); beginPlayback();
    }, host); finishTask.schedule(8);
}
function clearloop() {
    if (!outputReady || (state !== "ready" && state !== "playing")) return;
    selectedStart = 0; selectedEnd = outputDurationMs; pendingSelection = [selectedStart, selectedEnd];
    refreshWave(true); selectionLabel();
    if (state === "playing") restartSelection(); else status("Full output selected.");
}
function savepath() {
    if (!outputReady || savePending) return;
    var path = arrayfromargs(arguments).join(" "); if (!path) return;
    if (!/\.wav$/i.test(path)) path += ".wav";
    savePending = true; savePath = path;
    named("output_buffer").message("format", "int24"); named("output_buffer").message("filetype", "wave");
    status("Saving the complete output WAV...");
    named("output_buffer").message("writewave", path);
    saveTask = new Task(function () {
        if (savePending) { savePending = false; status("WAV save was requested. Check the destination and Max Console."); }
    }, host); saveTask.schedule(30000);
}
function saved() {
    if (!savePending) return;
    savePending = false; cancelTask(saveTask); saveTask = null;
    status("WAV write completed: " + shortName(savePath));
}
function shutdown() {
    cancelTask(audioTask); cancelTask(demoTask); cancelTask(renderTask); cancelTask(finishTask); cancelTask(selectionTask); cancelTask(saveTask);
    var i; for (i = 0; i < 3; i++) cancelTask(loadTasks[i]);
    outlet(2, 0); outlet(1, 0); outlet(0, "stop"); outlet(3, "stop"); state = "idle";
}
function notifydeleted() { shutdown(); }

/* CMPE Variety Pack for Max.
 * Musical designs: Joo Won Park, https://joowonpark.net/cmpe/
 * This extension keeps the APG controller intact and supplies the four other
 * instruments. Native MSP performs live audio; JS schedules control events.
 */
(function (g) {
    "use strict";
    var base = {}, names = ["loadbang", "lockUI", "loadfile", "loaded", "markDirty", "requestAudio",
        "beginRender", "renderTick", "renderComplete", "newpiece", "stop", "shutdown",
        "dspstate", "samplerate", "notifydeleted"];
    var i;
    for (i = 0; i < names.length; i++) base[names[i]] = g[names[i]];
    var modeIndex = 0, modeNames = ["APG", "ISJS", "Many", "RMHS", "SIOE"];
    var modeColors = [
        [0.031373, 0.498039, 0.513725, 1], // APG: teal
        [0.192157, 0.372549, 0.650980, 1], // ISJS: blue
        [0.447059, 0.341176, 0.650980, 1], // Many: violet
        [0.600000, 0.368627, 0.196078, 1], // RMHS: copper
        [0.596078, 0.419608, 0.098039, 1]  // SIOE: ochre
    ];
    var grain = CMPEModel.defaultSettings("isjs"), many = CMPEModel.defaultSettings("many");
    var drone = CMPEModel.defaultSettings("rmhs"), cut = CMPEModel.defaultSettings("sioe");
    var liveToken = 0, taskSerial = 0, tasks = {}, grainTasks = [null, null, null];
    var grainDue = [0, 0, 0], grainVariation = [1, 1, 1];
    var liveStarted = 0, liveEnd = 0, nextLayer = 0, layerCount = 0, manyCursor = 0;
    var manyUse = [], droneVoices = [], cutRenderer = null;
    var recordArmed = false, recording = false, recordFile = "", recordMs = 0;
    var recordRequested = 0, recordLastChange = 0, recordCheck = null, updatingControls = false;
    // buffer~ completion bangs carry no request ID. Keep one native read per
    // slot, and defer a preset until existing reads have actually completed.
    // A JavaScript timeout does not cancel native disk I/O.
    var nativeBusy = [false, false, false], pendingPreset = null, presetTask = null;
    var descriptions = [
        "APG: make an audio palindrome from three samples.",
        "ISJS: move in the pad to change sample position and grain density.",
        "Many: turn sample 1 into overlapping ambient layers.",
        "RMHS: build a slowly evolving drone from sine-wave harmonics.",
        "SIOE: combine slices of sample 1 into a short or gradual supercut."
    ];

    function now() { return new Date().getTime(); }
    function liveMode() { return modeIndex > 0 && modeIndex < 4; }
    function objectMessage(name, args) {
        var o = named(name);
        if (o) o.message.apply(o, args);
    }
    function hidden(name, yes) { var o = named(name); if (o) o.hidden = yes ? 1 : 0; }
    function clickable(name, yes) { objectMessage(name, ["ignoreclick", yes ? 0 : 1]); }
    function textOf(name, value) { objectMessage(name, ["text", value]); }
    function lineList(points) {
        var list = [], previous = 0, j;
        for (j = 0; j < points.length; j++) {
            list.push(points[j].value, Math.max(0, points[j].timeMs - previous));
            previous = points[j].timeMs;
        }
        return list;
    }
    function voice(engine, index, commands) {
        var o = named(engine), j;
        if (!o) throw new Error("A required audio voice is missing: " + engine);
        o.message("target", index);
        for (j = 0; j < commands.length; j++) o.message.apply(o, commands[j]);
    }
    function later(fn, delayMs) {
        var token = liveToken, id = ++taskSerial;
        var task = new Task(function () {
            delete tasks[id];
            if (token === liveToken && state === "live") {
                try { fn(); } catch (e) { haltLive("Stopped: " + e.message); }
            }
        }, host);
        tasks[id] = task;
        task.schedule(Math.max(1, delayMs));
        return task;
    }
    function cancelLiveTask(task) {
        if (!task) return;
        task.cancel();
        for (var key in tasks) if (tasks.hasOwnProperty(key) && tasks[key] === task) delete tasks[key];
    }
    function cancelLiveTasks() {
        liveToken++;
        var key;
        for (key in tasks) if (tasks.hasOwnProperty(key)) cancelTask(tasks[key]);
        tasks = {}; grainTasks = [null, null, null];
    }
    function stopRecording() {
        cancelTask(recordCheck); recordCheck = null;
        if (recordArmed || recording) objectMessage("recorder", ["int", 0]);
        recordArmed = false; recording = false; recordMs = 0;
        textOf("record_button", "RECORD WAV");
    }
    function stopVoices() {
        objectMessage("live_gate", ["list", 0, 10]);
        voice("grain_engine", 0, [["panic"]]);
        voice("many_engine", 0, [["panic"]]);
        voice("drone_engine", 0, [["panic"]]);
    }
    function haltLive(message) {
        cancelLiveTasks(); stopVoices(); stopRecording();
        state = outputReady ? "ready" : "idle";
        ui("progress", 0);
        g.lockUI(false);
        if (message) status(message);
    }
    function haltForChange() {
        cancelPresetRestore();
        cancelTask(audioTask); cancelTask(renderTask); cancelTask(finishTask); cancelTask(selectionTask);
        audioTask = null; renderTask = null; finishTask = null; selectionTask = null;
        haltLive("");
        outlet(2, 0); outlet(1, 0); outlet(0, "stop"); outlet(3, "stop");
        state = "idle"; outputReady = false; dirty = true; cutRenderer = null;
        plan = null; waveformLine(-1);
    }
    function setParam(index, label, value, low, high) {
        hidden("param" + index, false); hidden("param_label" + index, false);
        ui("param_label" + index, label);
        objectMessage("param" + index, ["minimum", low]);
        objectMessage("param" + index, ["maximum", high]);
        ui("param" + index, value);
    }
    function menu(label, items, selected) {
        hidden("mode_menu", false); hidden("menu_label", false);
        ui("menu_label", label);
        objectMessage("mode_menu", ["clear"]);
        for (var k = 0; k < items.length; k++) objectMessage("mode_menu", ["append", items[k]]);
        objectMessage("mode_menu", ["set", selected]);
    }
    function showMode() {
        if (updatingControls) return;
        updatingControls = true;
        try {
        var j, apg = modeIndex === 0, rendered = apg || modeIndex === 4;
        var sourceCount = modeIndex === 3 ? 0 : ((modeIndex === 2 || modeIndex === 4) ? 1 : 3);
        for (j = 0; j < 5; j++) {
            objectMessage("mode" + j, ["bgcolor"].concat(j === modeIndex ? modeColors[j] : [0.898039, 0.925490, 0.941176, 1]));
            objectMessage("mode" + j, ["bgoncolor"].concat(j === modeIndex ? modeColors[j] : [0.839216, 0.882353, 0.909804, 1]));
            var foreground = j === modeIndex ? [1, 1, 1, 1] : [0.105882, 0.160784, 0.211765, 1];
            objectMessage("mode" + j, ["textcolor"].concat(foreground));
            objectMessage("mode" + j, ["textoncolor"].concat(foreground));
            objectMessage("mode" + j, ["textovercolor"].concat(foreground));
        }
        ui("mode_info", descriptions[modeIndex]);
        for (j = 0; j < 6; j++) { hidden("param" + j, true); hidden("param_label" + j, true); }
        hidden("mode_menu", true); hidden("menu_label", true);
        for (j = 1; j <= 3; j++) {
            hidden("repeat" + j, !apg); hidden("repeat_label" + j, !apg);
            hidden("source_label" + j, j > sourceCount);
            hidden("load" + j, j > sourceCount); hidden("file" + j, j > sourceCount);
        }
        hidden("pitch", !apg); hidden("pitch_label", !apg);
        hidden("no_samples", modeIndex !== 3);
        hidden("wave_l", !rendered); hidden("wave_r", !rendered);
        hidden("scope_l", rendered || modeIndex === 1); hidden("scope_r", rendered || modeIndex === 1);
        hidden("scope_xy", modeIndex !== 1); hidden("xy_pad", modeIndex !== 1);
        hidden("channel_l", modeIndex === 1); hidden("channel_r", modeIndex === 1);
        hidden("loop_toggle", !rendered); hidden("loop_label", !rendered);
        hidden("clear_button", !rendered); hidden("save_button", !rendered);
        hidden("record_button", rendered);
        ui("output_label", rendered ? "OUTPUT" : (modeIndex === 1 ? "POSITION / DENSITY" : "LIVE OUTPUT"));
        textOf("play_button", rendered ? "PLAY" : "START");
        textOf("stop_button", "STOP");
        textOf("new_button", rendered ? "NEW" : (modeIndex === 3 ? "RANDOMIZE" : "RESET"));
        if (modeIndex === 1) {
            for (j = 0; j < 3; j++) {
                setParam(j, "Sample " + (j + 1) + " rate", grain.rates[j], 0.3, 1.7);
                setParam(j + 3, "Sample " + (j + 1) + " level", grain.levels[j], 0, 1);
            }
            objectMessage("xy_pad", ["set", grain.position, grain.densityY]);
        } else if (modeIndex === 2) {
            setParam(0, "Layer level", many.level, 0, 2);
            setParam(1, "Max delay (s)", many.delayMaxMs / 1000, 0.1, 0.5);
            setParam(2, "Max interval (s)", many.intervalMaxMs / 1000, 5, 20);
            menu("Pitch set", ["Major", "Minor", "Pentatonic", "Atonal", "Microtonal"], many.pitchSet);
        } else if (modeIndex === 3) {
            setParam(0, "Drone level", drone.level, 0, 1);
            setParam(1, "Fundamental (Hz)", drone.fundamentalHz, 20, 20000);
            setParam(2, "Interval (st)", drone.intervalSemitones, 0, 24);
            setParam(3, "Duration (s)", drone.durationSeconds, 1, 600);
            setParam(4, "Harmonics", drone.harmonics, 3, 20);
        } else if (modeIndex === 4) {
            setParam(0, "Slices", cut.count, 1, 100);
            setParam(1, "Tempo (BPM)", cut.tempo, 1, 1500);
            setParam(2, "Hit duration (s)", cut.hitSeconds, 0.1, 10);
            menu("Form", ["Short", "Long"], cut.form === "short" ? 0 : 1);
        }
        if (liveMode() && state !== "live") {
            ui("duration", modeIndex === 3 ? "Slow fade-in" : "Continuous");
            ui("time", "0.0 s");
            ui("selection_info", modeIndex === 1 ? "Left to right: sample position. Up: denser grains." : "Record a performance with RECORD WAV.");
        }
        g.lockUI(state !== "idle" && state !== "ready");
        } finally { updatingControls = false; }
    }
    function modeHint() {
        if (modeIndex === 0) return "Automatic edge trimming is on. Press PLAY to generate.";
        if (modeIndex === 1) return "START, then move inside the pad. Rates and levels remain live.";
        if (modeIndex === 2) return "Layers fade in over 2-4 seconds. Controls affect the next layer.";
        if (modeIndex === 3) return "Slow attack: 3-20 seconds. Progress shows the actual planned length.";
        return "Short: one supercut. Long: adds and removes slices every four beats.";
    }
    g.loadbang = function () {
        var already = initialized;
        base.loadbang();
        if (already) return;
        objectMessage("live_gate", ["float", 0]);
        objectMessage("recorder", ["samptype", "int24"]);
        objectMessage("recorder", ["beginramp", 10]); objectMessage("recorder", ["endramp", 10]);
        showMode(); ui("render_info", modeHint());
        post("CMPE Variety Pack: Joo Won Park / joowonpark.net/cmpe\n");
    };
    g.lockUI = function (flag) {
        base.lockUI(flag);
        var editable = mutable() || (state === "live" && (modeIndex === 1 || modeIndex === 2));
        var j, required = modeIndex === 3 ? 0 : ((modeIndex === 2 || modeIndex === 4) ? 1 : 3);
        for (j = 0; j < 6; j++) clickable("param" + j, editable && !(modeIndex === 4 && cut.form === "short" && j === 1));
        clickable("mode_menu", editable);
        clickable("xy_pad", modeIndex === 1 && (mutable() || state === "live"));
        for (j = 1; j <= 3; j++) clickable("load" + j, mutable() && j <= required);
        clickable("demo_button", mutable() && required > 0);
        clickable("new_button", mutable());
        clickable("record_button", liveMode() && state !== "waiting");
        clickable("load_preset", !savePending);
        clickable("save_preset", true);
    };
    g.mode = function (value) {
        value = Number(value);
        if (!finite(value) || value < 0 || value > 4 || Math.floor(value) !== value || value === modeIndex) return;
        if (savePending) { status("Wait for the WAV save to finish before changing instruments."); return; }
        haltForChange(); modeIndex = value;
        ui("progress", 0); ui("duration", "Length: --"); ui("time", "0.0 s");
        showMode(); ui("render_info", modeHint()); status("Ready. " + descriptions[modeIndex]);
    };
    function sourcesBusy() { return nativeBusy[0] || nativeBusy[1] || nativeBusy[2]; }
    function cancelPresetRestore() {
        pendingPreset = null; cancelTask(presetTask); presetTask = null;
    }
    function clearSource(slot) {
        cancelTask(loadTasks[slot]); loadTasks[slot] = null; loading[slot] = false;
        sources[slot] = null; sourceBuffers[slot] = null; paths[slot] = "";
        named("source" + (slot + 1)).message("clear");
        ui("file" + (slot + 1), "No sample loaded");
    }
    g.loadfile = function (slot) {
        var args = arrayfromargs(arguments), path = args.slice(1).join(" ");
        slot = Number(slot);
        if (!slotOK(slot) || !path || !mutable()) return;
        if (nativeBusy[slot]) { status("This source is still loading. Check Max Console if the load has stalled."); return; }
        if (loading[slot] || !/\.(wav|wave|aif|aiff)$/i.test(path)) { base.loadfile.apply(host, args); return; }
        nativeBusy[slot] = true;
        try { base.loadfile.apply(host, args); }
        catch (e) { nativeBusy[slot] = false; throw e; }
        if (nativeBusy[slot]) {
            cancelTask(loadTasks[slot]);
            loadTasks[slot] = new Task(function () {
                if (!nativeBusy[slot]) return;
                loading[slot] = false;
                ui("file" + (slot + 1), "Load has not finished");
                status("Source load has not finished. Check Max Console; reopen the patch if the file cannot be read.");
            }, host);
            loadTasks[slot].schedule(30000);
        }
    };
    g.loaded = function (slot) {
        slot = Number(slot);
        if (!slotOK(slot) || !nativeBusy[slot]) return;
        nativeBusy[slot] = false;
        base.loaded(slot);
        if (pendingPreset) {
            if (!sourcesBusy()) {
                var saved = pendingPreset;
                cancelPresetRestore();
                applyPreset(saved);
            } else status("Waiting for the current source load before restoring settings...");
            return;
        }
        if (modeIndex !== 0) {
            showMode();
            if (modeIndex === 4 && mutable()) ui("duration", "Length: --");
            var required = modeIndex === 3 ? 0 : (modeIndex === 1 ? 3 : 1), ready = true;
            for (var j = 0; j < required; j++) if (!sources[j] || nativeBusy[j]) ready = false;
            if (ready && mutable()) g.markDirty();
        }
    };
    g.markDirty = function () {
        if (modeIndex === 0) { base.markDirty(); return; }
        dirty = true;
        if (mutable()) status(modeIndex === 4 ? "Ready. PLAY renders the supercut, then plays it." : "Ready. Press START.");
    };
    g.param = function (index, value) {
        if (updatingControls) return;
        index = Number(index); value = Number(value);
        if (!finite(index) || Math.floor(index) !== index || index < 0 || index > 5 || !finite(value)) return;
        if (!(mutable() || (state === "live" && (modeIndex === 1 || modeIndex === 2)))) { showMode(); return; }
        if (modeIndex === 1) {
            if (index < 3) {
                grain.rates[index] = clamp(value, 0.3, 1.7);
                if (state === "live") voice("grain_engine", index + 1, [["rate", grain.rates[index]]]);
            } else {
                grain.levels[index - 3] = clamp(value, 0, 1);
                if (state === "live") voice("grain_engine", index - 2, [["amp", grain.levels[index - 3] * grainVariation[index - 3]]]);
            }
        } else if (modeIndex === 2) {
            if (index === 0) many.level = clamp(value, 0, 2);
            if (index === 1) many.delayMaxMs = clamp(value, 0.1, 0.5) * 1000;
            if (index === 2) many.intervalMaxMs = Math.round(clamp(value, 5, 20)) * 1000;
        } else if (modeIndex === 3) {
            if (index === 0) drone.level = clamp(value, 0, 1);
            if (index === 1) drone.fundamentalHz = clamp(value, 20, 20000);
            if (index === 2) drone.intervalSemitones = clamp(value, 0, 24);
            if (index === 3) drone.durationSeconds = clamp(value, 1, 600);
            if (index === 4) drone.harmonics = Math.round(clamp(value, 3, 20));
        } else if (modeIndex === 4) {
            if (index === 0) cut.count = Math.round(clamp(value, 1, 100));
            if (index === 1 && cut.form !== "short") cut.tempo = clamp(value, 1, 1500);
            if (index === 2) cut.hitSeconds = clamp(value, 0.1, 10);
            dirty = true;
        }
        showMode();
        if (mutable()) g.markDirty();
    };
    g.choice = function (value) {
        if (updatingControls) return;
        value = Math.round(Number(value));
        if (!finite(value) || !(mutable() || (state === "live" && modeIndex === 2))) return;
        if (modeIndex === 2) many.pitchSet = clamp(value, 0, 4);
        if (modeIndex === 4) { cut.form = value === 0 ? "short" : "long"; dirty = true; }
        showMode();
    };
    g.xy = function (x, y) {
        if (updatingControls) return;
        x = Number(x); y = Number(y);
        if (modeIndex !== 1 || !finite(x) || !finite(y)) return;
        if (!(mutable() || state === "live")) return;
        grain.position = clamp(x, 0, 1); grain.densityY = clamp(y, 0, 1);
        objectMessage("xy_pad", ["set", grain.position, grain.densityY]);
        if (state === "live") {
            for (var j = 0; j < 3; j++) {
                var period = 1000 / (j === 0 ? 0.5 + 39.5 * grain.densityY : 0.1 + 34.9 * grain.densityY);
                if (grainDue[j] - now() > period) {
                    cancelLiveTask(grainTasks[j]); scheduleGrain(j, period);
                }
            }
        }
    };
    g.newpiece = function () {
        if (!mutable()) return;
        if (!liveMode()) { base.newpiece(); return; }
        if (modeIndex === 1) grain = CMPEModel.defaultSettings("isjs");
        if (modeIndex === 2) many = CMPEModel.defaultSettings("many");
        if (modeIndex === 3) drone = CMPEModel.defaultSettings("rmhs");
        showMode(); ui("render_info", modeHint()); status("Settings ready. Press START.");
    };
    g.requestAudio = function (action) {
        if (pendingPreset) { status("Waiting for the current source load before restoring settings..."); return; }
        if (modeIndex === 0) { base.requestAudio(action); return; }
        if (savePending) { status("Wait for the WAV save to finish."); return; }
        var required = modeIndex === 3 ? 0 : (modeIndex === 1 ? 3 : 1), j;
        for (j = 0; j < required; j++) {
            if (loading[j]) { status("Please wait for the source to finish loading."); return; }
            if (!sources[j]) { status("Load " + (required === 1 ? "sample 1" : "three samples") + " or choose DEMO."); return; }
        }
        state = "waiting"; startAction = action; audioAttempts = 0;
        g.lockUI(true); status("Starting audio...");
        named("audio_driver").message("startwindow");
        audioTask = new Task(waitForAudio, host); audioTask.schedule(50);
    };
    g.beginRender = function (thenPlay) {
        if (modeIndex === 0) { base.beginRender(thenPlay); return; }
        if (liveMode()) { beginLive(); return; }
        try {
            plan = CMPEModel.sioePlan(sources, cut, sampleRate);
            cutRenderer = CMPEModel.createSioeRenderer(plan, sources, readSource);
            state = "rendering"; autoPlay = thenPlay; outputReady = false; dirty = true;
            outputFrames = plan.totalFrames; outputDurationMs = plan.durationMs; trimFrames = 0;
            renderFrame = 0; renderHalf = outputFrames; renderPeak = 0; firstAudioFrame = -1;
            renderStarted = now(); lastWaveRefresh = 0; selectedStart = 0; selectedEnd = outputDurationMs;
            outlet(1, 0); outlet(2, 0); outlet(0, "stop"); outlet(3, "stop");
            ui("duration", "Length: " + (outputDurationMs / 1000).toFixed(1) + " s");
            ui("progress", 0); ui("render_info", "Rendering SIOE 0%");
            status("Rendering the supercut. CANCEL stops generation.");
            g.lockUI(true); textOf("stop_button", "CANCEL"); waveformLine(-1);
            renderTask = new Task(allocateOutput, host); renderTask.schedule(1);
        } catch (e) { renderFailed(e.message); }
    };
    g.renderTick = function () {
        if (modeIndex !== 4) { base.renderTick(); return; }
        if (state !== "rendering") return;
        var started = now();
        try {
            do {
                var count = Math.min(plan.recommendedChunkFrames || 1024, outputFrames - renderFrame);
                var chunk = cutRenderer.renderChunk(renderFrame, count), j;
                output.poke(1, renderFrame, chunk.left); output.poke(2, renderFrame, chunk.right);
                if (firstAudioFrame < 0 && chunk.peak > silenceThreshold) {
                    for (j = 0; j < count; j++) if (Math.max(Math.abs(chunk.left[j]), Math.abs(chunk.right[j])) > silenceThreshold) { firstAudioFrame = renderFrame + j; break; }
                }
                renderPeak = Math.max(renderPeak, chunk.peak); renderFrame += count;
            } while (renderFrame < outputFrames && now() - started < 10);
            ui("progress", renderFrame / outputFrames);
            ui("render_info", "Rendering SIOE " + Math.floor(100 * renderFrame / outputFrames) + "%  /  " + ((now() - renderStarted) / 1000).toFixed(1) + " s elapsed");
            if (now() - lastWaveRefresh > 500) { refreshWave(true); lastWaveRefresh = now(); }
            if (renderFrame >= outputFrames) g.renderComplete(); else renderTask.schedule(1);
        } catch (e) { renderFailed(e.message); }
    };
    g.renderComplete = function () {
        if (modeIndex === 4 && renderPeak > 0.98) named("output_buffer").message("normalize", 0.98);
        base.renderComplete();
        if (modeIndex === 4) {
            ui("render_info", "SIOE ready  /  " + plan.events.length + " slices" + (renderPeak > 0.98 ? "  /  peak level adjusted" : ""));
            cutRenderer = null;
        }
    };
    function scheduleGrain(slot, delayMs) {
        grainDue[slot] = now() + delayMs;
        grainTasks[slot] = later(function () { fireGrain(slot); }, delayMs);
    }
    function fireGrain(slot) {
        var e = CMPEModel.isjsEvent(grain, slot);
        grainVariation[slot] = e.level > 0 ? e.amplitude / e.level : 1;
        voice("grain_engine", slot + 1, [
            ["set", sources[slot].name], ["rate", e.rate], ["amp", e.amplitude], ["pan", e.pan],
            ["env"].concat(lineList(e.envelope)),
            ["start", (e.position >= 1 ? 0 : e.position) * sources[slot].durationMs]
        ]);
        scheduleGrain(slot, e.periodMs);
    }
    function addLayer() {
        var e = CMPEModel.manyEvent(many), index = (manyCursor++ % 32) + 1;
        var reuse = manyUse[index] !== undefined, generation = (manyUse[index] || 0) + 1;
        manyUse[index] = generation;
        if (reuse) voice("many_engine", index, [["stop"]]);
        function launch() {
            var commands = [["set", sources[0].name], ["rate", e.rate], ["amp", e.level],
                ["sumgain", sources[0].channels === 1 ? 1 : Math.SQRT1_2], ["feed", e.feed]];
            for (var k = 0; k < e.stages.length; k++) {
                var s = e.stages[k];
                commands.push(["stage", k + 1, s.leftMs, s.leftK, s.rightMs, s.rightK]);
            }
            commands.push(["dryenv"].concat(lineList(e.dryEnvelope)));
            commands.push(["wetenv"].concat(lineList(e.wetEnvelope)));
            commands.push(["start", 0]);
            voice("many_engine", index, commands);
            later(function () {
                if (manyUse[index] === generation) voice("many_engine", index, [["stop"]]);
            }, 120000);
        }
        if (reuse) later(launch, 15); else launch();
        layerCount++; nextLayer = now() + e.nextMs;
        later(addLayer, e.nextMs);
    }
    function driftNext(index, v) {
        var delay = -Math.log(Math.max(1e-12, 1 - Math.random())) * 1000 / v.driftRateHz;
        later(function () {
            if (now() >= liveStarted + v.durationMs) return;
            voice("drone_engine", index, [["drift", Math.random() * v.driftMaxHz, v.driftLagMs]]);
            driftNext(index, v);
        }, delay);
    }
    function beginLive() {
        try {
            cancelLiveTasks();
            state = "live"; outputReady = false; dirty = true; liveStarted = now();
            liveEnd = 0; layerCount = 0; manyCursor = 0; manyUse = [];
            outlet(2, 0); outlet(1, 0); outlet(0, "stop"); outlet(3, "stop");
            objectMessage("live_gate", ["list", 1, 15]);
            ui("progress", 0); ui("time", "0.0 s");
            g.lockUI(true);
            if (modeIndex === 1) {
                grain.panWidths = [0.3 + 0.7 * Math.random(), 0.3 + 0.7 * Math.random(), 0.3 + 0.7 * Math.random()];
                for (var j = 0; j < 3; j++) fireGrain(j);
            } else if (modeIndex === 2) {
                addLayer();
            } else {
                var result = CMPEModel.rmhsPlan(drone, sampleRate);
                if (!result.voices.length) throw new Error("No audible partials at this frequency. Lower the fundamental.");
                droneVoices = result.voices; liveEnd = liveStarted + result.durationMs;
                for (var k = 0; k < result.voices.length; k++) {
                    var v = result.voices[k];
                    voice("drone_engine", k + 1, [["freq", v.frequencyHz], ["drift", 0, 0],
                        ["mod", v.modRateHz], ["modphase", (v.modPhase / (2 * Math.PI) + 0.75) % 1],
                        ["amp", v.amplitude], ["pan", v.pan],
                        ["env"].concat(lineList(v.envelope)), ["start"]]);
                    driftNext(k + 1, v);
                    (function (index, duration) { later(function () { voice("drone_engine", index, [["stop"]]); }, duration + 15); }(k + 1, v.durationMs));
                }
                ui("duration", "Length: " + (result.durationMs / 1000).toFixed(1) + " s");
                ui("selection_info", result.voices.length + " partials" + (result.skippedPartials ? "  /  " + result.skippedPartials + " above the audio range omitted" : ""));
            }
            if (recordArmed) startRecording();
            pulse();
        } catch (e) { haltLive(e.message); }
    }
    function pulse() {
        var elapsed = now() - liveStarted, suffix = recording ? "  /  REC " + (recordMs / 1000).toFixed(1) + " s" : (recordArmed ? "  /  record armed" : "");
        ui("time", (elapsed / 1000).toFixed(1) + " s" + suffix);
        if (modeIndex === 1) {
            ui("render_info", "Position " + Math.round(grain.position * 100) + "%  /  density " + (0.5 + 39.5 * grain.densityY).toFixed(1) + " Hz (sample 1)");
            status("Playing live. Move the pad; adjust rates and levels.");
        } else if (modeIndex === 2) {
            ui("render_info", layerCount + " layers started  /  next layer in " + Math.max(0, (nextLayer - now()) / 1000).toFixed(1) + " s");
            status(elapsed < 4000 ? "The ambient layers are fading in." : "Playing ambient layers. STOP fades and clears all tails.");
        } else {
            var length = liveEnd - liveStarted, remaining = Math.max(0, liveEnd - now());
            ui("progress", clamp(elapsed / length, 0, 1));
            ui("render_info", "Drone: " + (remaining / 1000).toFixed(1) + " s remaining");
            status(elapsed < 20000 ? "Slow fade-in. The partials enter over 3-20 seconds." : "The drone is evolving...");
            if (remaining <= 0) { haltLive("Drone finished. Press START for another performance."); ui("progress", 1); return; }
        }
        later(pulse, 150);
    }
    g.stop = function () {
        if (pendingPreset) {
            cancelPresetRestore();
            haltLive("Settings load cancelled. The current source read can finish.");
            return;
        }
        if (state === "live" || liveMode()) {
            cancelTask(audioTask); audioTask = null;
            haltLive("Stopped. Press START when ready.");
            return;
        }
        base.stop();
    };
    g.dspstate = function (value) {
        if (Number(value) === 0 && state === "live") haltLive("Audio stopped. Check Max Audio Status, then press START.");
        base.dspstate(value);
    };
    g.samplerate = function (value) {
        value = Number(value);
        if (state === "live" && finite(value) && sampleRate > 0 && value !== sampleRate) haltLive("Audio settings changed. Press START again.");
        base.samplerate(value);
    };
    function startRecording() {
        if (!recordArmed || state !== "live") return;
        objectMessage("recorder", ["int", 1]);
        recording = true; recordArmed = false; recordMs = 0;
        recordRequested = now(); recordLastChange = now();
        textOf("record_button", "STOP REC");
        recordCheck = new Task(function () {
            if (!recording) return;
            if (now() - recordLastChange > 3000) {
                stopRecording();
                status("Recording did not advance. Check the destination and Max Console.");
                return;
            }
            recordCheck.schedule(1000);
        }, host);
        recordCheck.schedule(3500);
    }
    g.recordtoggle = function () {
        if (!liveMode()) return;
        if (recording || recordArmed) { stopRecording(); status("Recording stopped."); return; }
        if (state === "waiting") return;
        objectMessage("record_dialog", ["bang"]);
    };
    g.recordpath = function () {
        if (!liveMode()) return;
        var path = arrayfromargs(arguments).join(" ");
        if (!path) return;
        if (!/\.wav$/i.test(path)) path += ".wav";
        stopRecording(); recordFile = path;
        objectMessage("recorder", ["samptype", "int24"]);
        objectMessage("recorder", ["open", path, "wave"]);
        recordArmed = true; textOf("record_button", "ARMED");
        if (state === "live") startRecording();
        else status("Recording armed. START begins a 24-bit stereo WAV.");
    };
    g.recordelapsed = function (milliseconds) {
        milliseconds = Number(milliseconds);
        if (recording && finite(milliseconds) && milliseconds > recordMs) {
            recordMs = milliseconds; recordLastChange = now();
        }
    };
    function snapshot() {
        return {format: "cmpe-variety-pack", version: 1, mode: modeIndex,
            samples: paths.slice(0), apg: {repetitions: repetitions.slice(0), pitchRange: pitchRange},
            isjs: grain, many: many, rmhs: drone, sioe: cut, monitorDb: monitorDb,
            loop: loopEnabled};
    }
    g.presetsave = function () { objectMessage("preset_save_dialog", ["bang"]); };
    g.presetload = function () { if (!savePending) objectMessage("preset_load_dialog", ["bang"]); };
    g.presetwrite = function () {
        var path = arrayfromargs(arguments).join(" "), f;
        if (!path) return;
        if (!/\.json$/i.test(path)) path += ".json";
        try {
            f = new File(path, "write");
            if (!f.isopen) throw new Error("Cannot write that settings file.");
            f.eof = 0; f.writestring(JSON.stringify(snapshot(), null, 2) + "\n"); f.close();
            status("Settings saved: " + shortName(path));
        } catch (e) { if (f && f.isopen) f.close(); status(e.message); }
    };
    function validNumbers(values, count) {
        if (!values || values.length !== count) return false;
        for (var k = 0; k < count; k++) if (!finite(values[k])) return false;
        return true;
    }
    function validatePreset(p) {
        if (!p || p.format !== "cmpe-variety-pack" || p.version !== 1 ||
                !finite(p.mode) || p.mode < 0 || p.mode > 4 || Math.floor(p.mode) !== p.mode ||
                !p.apg || !validNumbers(p.apg.repetitions, 3) || !finite(p.apg.pitchRange) ||
                !p.isjs || !validNumbers(p.isjs.rates, 3) || !validNumbers(p.isjs.levels, 3) ||
                !finite(p.isjs.position) || !finite(p.isjs.densityY) ||
                !p.many || !validNumbers([p.many.level, p.many.delayMaxMs, p.many.intervalMaxMs, p.many.pitchSet], 4) ||
                !p.rmhs || !validNumbers([p.rmhs.level, p.rmhs.fundamentalHz, p.rmhs.intervalSemitones, p.rmhs.durationSeconds, p.rmhs.harmonics], 5) ||
                !p.sioe || !validNumbers([p.sioe.count, p.sioe.tempo, p.sioe.hitSeconds], 3) ||
                (p.sioe.form !== "short" && p.sioe.form !== "long") || !finite(p.monitorDb) ||
                !p.samples || p.samples.length !== 3) throw new Error("Choose a valid CMPE settings JSON file.");
        for (var k = 0; k < 3; k++) if (typeof p.samples[k] !== "string" || p.samples[k].length > 4096) throw new Error("Invalid sample path in settings.");
    }
    function restorePreset(p) {
        validatePreset(p);
        haltForChange();
        cancelTask(demoTask); demoTask = null;
        if (sourcesBusy()) {
            pendingPreset = p; state = "restoring"; g.lockUI(true);
            status("Waiting for the current source load before restoring settings...");
            presetTask = new Task(function () {
                if (pendingPreset) status("A source load is still pending. Settings will restore when it finishes; STOP cancels.");
            }, host);
            presetTask.schedule(30000);
            return;
        }
        applyPreset(p);
    }
    function applyPreset(p) {
        haltForChange();
        var j;
        for (j = 0; j < 3; j++) clearSource(j);
        for (j = 0; j < 3; j++) repetitions[j] = Math.round(clamp(p.apg.repetitions[j], 1, 20));
        pitchRange = clamp(p.apg.pitchRange, 0, 1);
        grain = CMPEModel.defaultSettings("isjs");
        grain.position = clamp(p.isjs.position, 0, 1); grain.densityY = clamp(p.isjs.densityY, 0, 1);
        for (j = 0; j < 3; j++) { grain.rates[j] = clamp(p.isjs.rates[j], 0.3, 1.7); grain.levels[j] = clamp(p.isjs.levels[j], 0, 1); }
        many = CMPEModel.defaultSettings("many");
        many.level = clamp(p.many.level, 0, 2); many.delayMaxMs = clamp(p.many.delayMaxMs, 100, 500);
        many.intervalMaxMs = clamp(p.many.intervalMaxMs, 5000, 20000); many.pitchSet = Math.round(clamp(p.many.pitchSet, 0, 4));
        if (validNumbers(p.many.microtonalSet, 12)) many.microtonalSet = p.many.microtonalSet.map(function (v) { return clamp(v, -0.15, 0.15); });
        drone = {level: clamp(p.rmhs.level, 0, 1), fundamentalHz: clamp(p.rmhs.fundamentalHz, 20, 20000),
            intervalSemitones: clamp(p.rmhs.intervalSemitones, 0, 24), durationSeconds: clamp(p.rmhs.durationSeconds, 1, 600),
            harmonics: Math.round(clamp(p.rmhs.harmonics, 3, 20))};
        cut = {count: Math.round(clamp(p.sioe.count, 1, 100)), tempo: clamp(p.sioe.tempo, 1, 1500),
            hitSeconds: clamp(p.sioe.hitSeconds, 0.1, 10), form: p.sioe.form};
        modeIndex = p.mode; loopEnabled = !!p.loop; monitor(clamp(p.monitorDb, -60, 0));
        for (j = 0; j < 3; j++) ui("repeat" + (j + 1), repetitions[j]);
        ui("pitch", pitchRange); ui("loop_toggle", loopEnabled ? 1 : 0);
        showMode(); ui("render_info", modeHint());
        for (j = 0; j < 3; j++) if (p.samples[j]) loadfile(j, p.samples[j]);
        status(sourcesBusy() ? "Settings restored. Loading referenced samples..." : "Settings restored. Press PLAY or START.");
    }
    g.presetread = function () {
        var path = arrayfromargs(arguments).join(" "), f, body = "";
        if (!path || savePending) return;
        try {
            f = new File(path, "read");
            if (!f.isopen || f.eof > 1048576) throw new Error("Cannot read that CMPE settings file.");
            while (f.position < f.eof) body += f.readline(8192) + "\n";
            f.close(); restorePreset(JSON.parse(body));
        } catch (e) { if (f && f.isopen) f.close(); status("Settings not loaded: " + e.message); }
    };
    g.shutdown = function () {
        cancelPresetRestore();
        cancelLiveTasks(); stopVoices(); stopRecording(); cutRenderer = null;
        base.shutdown();
    };
    g.notifydeleted = function () { g.shutdown(); };
    // Host integrations can preserve the same validated settings format without
    // writing an intermediate JSON file. Returned state is a detached snapshot;
    // restores still use the serialized native-buffer loading safeguards above.
    g.CMPEHost = {
        snapshot: function () { return JSON.parse(JSON.stringify(snapshot())); },
        validate: validatePreset,
        restore: restorePreset
    };
    // Read-only state for the developer harness; this does not expose audio data.
    g.CMPEState = function () {
        return {mode: modeIndex, state: state, settings: snapshot(), recording: recording,
            recordArmed: recordArmed, activeTasks: Object.keys(tasks).length, liveToken: liveToken,
            restoring: pendingPreset !== null, nativeBusy: nativeBusy.slice(0)};
    };
}(this));

/* CMPE Max for Live host adapter. ES5 for Max's legacy js object.
 * Appended after the unchanged musical models and CMPE controller.
 * Live owns the audio engine. This module never opens or changes a driver.
 * The pattr-bound JSON stores settings and reproducible finite-render seeds,
 * not audio. Original sample files are still required when a Set is reopened.
 */
(function (g) {
    "use strict";
    var under = {}, methods = ["loadbang", "mode", "loadfile", "loaded", "lockUI", "markDirty",
        "play", "newpiece", "requestAudio", "beginRender", "renderComplete", "renderFailed",
        "repeats", "pitch", "param", "choice", "xy", "monitor", "loopmode", "clearloop",
        "commitSelection", "stop", "dspstate", "samplerate", "shutdown"];
    var j;
    for (j = 0; j < methods.length; j++) under[methods[j]] = g[methods[j]];
    var deviceMode = Number(jsarguments.length > 1 ? jsarguments[1] : 0);
    if (!finite(deviceMode) || Math.floor(deviceMode) !== deviceMode || deviceMode < 0 || deviceMode > 4) deviceMode = 0;
    var booted = false, enabled = true, applying = false, deleted = false;
    var pendingState = null, restoreTarget = null, restoreTask = null, waitingRestore = false, pendingUI = {};
    var latch = false, held = [], activeKey = "", manual = false;
    var prepared = null, rebuilding = false, renderSeed = 0, renderRateOverride = 0;
    var restoredSelection = null, format = "cmpe-max-for-live", algorithm = "cmpe-m4l-1";
    var modelAPG = APGPlan.makePlan, modelSIOE = CMPEModel.sioePlan;
    var originalUI = g.ui, originalStatus = g.status, renderingText = "";

    g.ui = function (name, value) {
        originalUI(name, value);
        if (name === "render_info" && state === "rendering") {
            renderingText = String(value);
            originalUI("status", (rebuilding ? "Restoring: " : "") + renderingText + "  |  CANCEL stops");
        }
    };
    g.status = function (value) {
        originalStatus(state === "rendering" && renderingText ?
            (rebuilding ? "Restoring: " : "") + renderingText + "  |  CANCEL stops" : value);
    };
    g.shortName = function (path) {
        var name = fileName(path);
        return name.length > 14 ? name.substring(0, 6) + "..." + name.substring(name.length - 5) : name;
    };

    function finiteMode() { return deviceMode === 0 || deviceMode === 4; }
    function requiredSources() { return deviceMode === 3 ? 0 : (deviceMode === 2 || deviceMode === 4 ? 1 : 3); }
    function copy(value) { return JSON.parse(JSON.stringify(value)); }
    function message(name, selector) {
        var object = named(name);
        if (object) object.message.apply(object, arrayfromargs(arguments).slice(1));
    }
    function changed() {
        if (!booted || applying || deleted) return;
        if (typeof g.notifyclients === "function") g.notifyclients();
    }
    function velocity(value) { message("m4l_velocity", "list", clamp(value, 0, 1), 5); }
    function clearNotes() { held = []; activeKey = ""; manual = false; }
    function readNumber(name) {
        var object = named(name), value;
        if (!object || typeof object.getvalueof !== "function") return null;
        value = object.getvalueof();
        if (value instanceof Array) value = value[0];
        if (value === undefined || value === null || value === "") return null;
        value = Number(value);
        return finite(value) ? value : null;
    }
    function parameterNames() {
        var list = ["monitor_level", "m4l_latch"], i;
        if (finiteMode()) list.push("loop_toggle");
        if (deviceMode === 0) list = list.concat(["repeat1", "repeat2", "repeat3", "pitch"]);
        else {
            var count = deviceMode === 1 ? 6 : (deviceMode === 3 ? 5 : 3);
            for (i = 0; i < count; i++) list.push("param" + i);
        }
        if (deviceMode === 1) list = list.concat(["m4l_position", "m4l_density"]);
        if (deviceMode === 2 || deviceMode === 4) list.push("mode_menu");
        return list;
    }
    function captureParameters() {
        var result = {}, names = parameterNames(), i, value;
        for (i = 0; i < names.length; i++) {
            value = readNumber(names[i]);
            if (value !== null) result[names[i]] = value;
        }
        for (var key in pendingUI) if (pendingUI.hasOwnProperty(key)) result[key] = pendingUI[key];
        return result;
    }
    function overlay(settings, values) {
        var i;
        function has(name) { return values.hasOwnProperty(name) && finite(values[name]); }
        if (has("monitor_level")) settings.monitorDb = clamp(values.monitor_level, -60, 0);
        if (has("loop_toggle")) settings.loop = values.loop_toggle !== 0;
        if (has("m4l_latch")) latch = values.m4l_latch !== 0;
        if (deviceMode === 0) {
            for (i = 0; i < 3; i++) if (has("repeat" + (i + 1))) settings.apg.repetitions[i] = Math.round(clamp(values["repeat" + (i + 1)], 1, 20));
            if (has("pitch")) settings.apg.pitchRange = clamp(values.pitch, 0, 1);
        } else if (deviceMode === 1) {
            for (i = 0; i < 3; i++) {
                if (has("param" + i)) settings.isjs.rates[i] = clamp(values["param" + i], 0.3, 1.7);
                if (has("param" + (i + 3))) settings.isjs.levels[i] = clamp(values["param" + (i + 3)], 0, 1);
            }
            if (has("m4l_position")) settings.isjs.position = clamp(values.m4l_position, 0, 1);
            if (has("m4l_density")) settings.isjs.densityY = clamp(values.m4l_density, 0, 1);
        } else if (deviceMode === 2) {
            if (has("param0")) settings.many.level = clamp(values.param0, 0, 2);
            if (has("param1")) settings.many.delayMaxMs = clamp(values.param1, 0.1, 0.5) * 1000;
            if (has("param2")) settings.many.intervalMaxMs = Math.round(clamp(values.param2, 5, 20)) * 1000;
            if (has("mode_menu")) settings.many.pitchSet = Math.round(clamp(values.mode_menu, 0, 4));
        } else if (deviceMode === 3) {
            if (has("param0")) settings.rmhs.level = clamp(values.param0, 0, 1);
            if (has("param1")) settings.rmhs.fundamentalHz = clamp(values.param1, 20, 20000);
            if (has("param2")) settings.rmhs.intervalSemitones = clamp(values.param2, 0, 24);
            if (has("param3")) settings.rmhs.durationSeconds = clamp(values.param3, 1, 600);
            if (has("param4")) settings.rmhs.harmonics = Math.round(clamp(values.param4, 3, 20));
        } else {
            if (has("param0")) settings.sioe.count = Math.round(clamp(values.param0, 1, 100));
            if (has("param1")) settings.sioe.tempo = clamp(values.param1, 1, 1500);
            if (has("param2")) settings.sioe.hitSeconds = clamp(values.param2, 0.1, 10);
            if (has("mode_menu")) settings.sioe.form = values.mode_menu === 0 ? "short" : "long";
        }
        settings.mode = deviceMode;
        return settings;
    }
    function encodePath(path) {
        for (var i = 1; i <= 3; i++) if (path === localfile("apgw_test" + i + ".wav")) return "cmpe-demo:" + i;
        return path;
    }
    function decodePath(path) {
        var match = /^cmpe-demo:([123])$/.exec(path);
        return match ? localfile("apgw_test" + match[1] + ".wav") : path;
    }
    function defaultSnapshot() {
        var result = g.CMPEHost.snapshot();
        result.mode = deviceMode;
        if (!booted) for (var i = 0; i < requiredSources(); i++) result.samples[i] = localfile("apgw_test" + (i + 1) + ".wav");
        return result;
    }
    function fingerprints() {
        var result = [], i;
        for (i = 0; i < requiredSources(); i++) {
            if (!sources[i]) return null;
            result.push({frames: sources[i].frames, channels: sources[i].channels, durationMs: sources[i].durationMs});
        }
        return result;
    }
    function signature(settings) {
        // The output is independent of monitor volume, MIDI latch and loop.
        var samples = settings.samples.map(encodePath);
        return JSON.stringify({samples: samples, settings: deviceMode === 0 ? settings.apg : settings.sioe});
    }
    function randomSeed() { return (Math.floor(Math.random() * 4294967295) + 1) >>> 0; }
    function seeded(seed) {
        var value = seed >>> 0;
        return function () { value ^= value << 13; value ^= value >>> 17; value ^= value << 5; return (value >>> 0) / 4294967296; };
    }
    APGPlan.makePlan = function (src, reps, pitch, rate, rng) {
        return modelAPG(src, reps, pitch, renderRateOverride || rate, rng || seeded(renderSeed || 1));
    };
    CMPEModel.sioePlan = function (src, settings, rate, rng) {
        return modelSIOE(src, settings, renderRateOverride || rate, rng || seeded(renderSeed || 1));
    };
    function refreshLabels() {
        if (finiteMode()) message("new_button", "text", "GENERATE");
        if (deviceMode === 2 || deviceMode === 3) ui("selection_info", "Record this instrument on a Live track.");
        if (deviceMode === 1) {
            var settings = g.CMPEHost.snapshot().isjs;
            ui("m4l_position", settings.position); ui("m4l_density", settings.densityY);
        }
        ui("m4l_latch", latch ? 1 : 0);
    }
    function invalidate() {
        if (applying) return;
        prepared = null; rebuilding = false; restoredSelection = null;
    }
    function validateState(value) {
        if (!value || value.format !== format || value.version !== 1 || value.mode !== deviceMode ||
                !value.settings || value.settings.mode !== deviceMode) throw new Error("Saved state belongs to a different CMPE device.");
        g.CMPEHost.validate(value.settings);
        if (value.prepared) {
            var p = value.prepared;
            if (p.algorithm !== algorithm || !finite(p.seed) || Math.floor(p.seed) !== p.seed || p.seed < 1 || p.seed > 4294967295 ||
                    !finite(p.sampleRate) || p.sampleRate <= 0 || !p.sources || p.sources.length !== requiredSources() ||
                    typeof p.signature !== "string" || p.signature.length > 16384) throw new Error("Invalid saved render metadata.");
            for (var i = 0; i < p.sources.length; i++) {
                var source = p.sources[i];
                if (!source || !finite(source.frames) || source.frames < 1 || Math.floor(source.frames) !== source.frames ||
                        (source.channels !== 1 && source.channels !== 2) || !finite(source.durationMs) || source.durationMs <= 0) throw new Error("Invalid saved sample metadata.");
            }
        }
        if (value.selection && (value.selection.length !== 2 || !finite(value.selection[0]) || !finite(value.selection[1]))) throw new Error("Invalid saved loop selection.");
    }
    g.getvalueof = function () {
        if (pendingState) return JSON.stringify(pendingState);
        // Native buffer reads cannot be canceled. The CMPE controller may be
        // waiting for an old read before applying this new state; save the
        // requested state throughout that wait, not the previous instrument.
        if (restoreTarget && g.CMPEState().restoring) return JSON.stringify(restoreTarget);
        var settings = defaultSnapshot(), includePrepared = prepared && ((outputReady && !dirty) || rebuilding || waitingRestore);
        settings.samples = settings.samples.map(encodePath);
        return JSON.stringify({format: format, version: 1, mode: deviceMode, settings: settings,
            latch: latch, selection: restoredSelection || [selectedStart, selectedEnd], prepared: includePrepared ? copy(prepared) : null});
    };
    g.setvalueof = function () {
        var values = arrayfromargs(arguments), text = values.length === 1 ? String(values[0]) : values.join(" "), value;
        if (!text || text === "0") return;
        try {
            if (text.length > 131072) throw new Error("Saved state is too large.");
            value = JSON.parse(text); validateState(value);
            pendingState = value;
            if (booted) scheduleRestore();
        } catch (e) { status("State not restored: " + e.message); }
    };
    function scheduleRestore() {
        cancelTask(restoreTask);
        restoreTask = new Task(function () {
            restoreTask = null;
            if (!deleted && pendingState) applyState(pendingState, pendingUI);
        }, host);
        restoreTask.schedule(1);
    }
    function applyState(saved, values) {
        var settings = copy(saved ? saved.settings : defaultSnapshot());
        var originalSignature;
        applying = true;
        try {
            clearNotes(); velocity(1);
            latch = saved ? !!saved.latch : false;
            settings.samples = settings.samples.map(decodePath);
            for (var i = requiredSources(); i < 3; i++) settings.samples[i] = "";
            originalSignature = signature(settings);
            overlay(settings, values || {});
            prepared = saved && saved.prepared ? copy(saved.prepared) : null;
            if (prepared && (signature(settings) !== originalSignature || prepared.signature !== signature(settings))) prepared = null;
            restoredSelection = saved && saved.selection ? saved.selection.slice(0) : null;
            waitingRestore = true; rebuilding = false;
            restoreTarget = {format: format, version: 1, mode: deviceMode, settings: copy(settings),
                latch: latch, selection: restoredSelection, prepared: prepared ? copy(prepared) : null};
            restoreTarget.settings.samples = restoreTarget.settings.samples.map(encodePath);
            g.CMPEHost.restore(settings);
            pendingState = null; pendingUI = {};
            refreshLabels();
            ui("render_info", finiteMode() ? (prepared ? "Restoring saved composition..." : "GENERATE prepares audio. PLAY or MIDI starts it.") : "Ready for MIDI or START.");
        } catch (e) {
            waitingRestore = false; pendingState = null; restoreTarget = null; pendingUI = {}; prepared = null;
            status("State not restored: " + e.message);
        } finally { applying = false; }
        finishRestore();
        changed();
    }
    function finishRestore() {
        if (!booted || applying || !waitingRestore || pendingState || deleted) return;
        var snapshot = g.CMPEState(), i;
        if (snapshot.restoring) return;
        restoreTarget = null;
        for (i = 0; i < requiredSources(); i++) if (snapshot.nativeBusy[i] || loading[i]) return;
        for (i = 0; i < requiredSources(); i++) if (!sources[i]) {
            waitingRestore = false; prepared = null;
            status("A source is missing. Load the original sample, then GENERATE again.");
            changed(); return;
        }
        if (prepared && JSON.stringify(fingerprints()) !== JSON.stringify(prepared.sources)) {
            prepared = null; waitingRestore = false;
            status("A source changed. Press GENERATE to prepare a new result."); changed(); return;
        }
        if (prepared && !enabled) {
            status("Saved composition will rebuild when this device is enabled."); return;
        }
        waitingRestore = false;
        if (prepared && finiteMode()) {
            rebuilding = true; renderSeed = prepared.seed; renderRateOverride = prepared.sampleRate;
            under.beginRender(false);
            renderRateOverride = 0;
            if (state === "rendering") status("Rebuilding the saved composition. MIDI is available when Ready.");
            else { rebuilding = false; prepared = null; }
        } else {
            status(finiteMode() ? "Samples ready. Press GENERATE, then PLAY or a MIDI note." : "Ready. Press START or hold a MIDI note.");
        }
        changed();
    }
    // Only live.thisdevice starts the controller, after Live restores parameters.
    g.loadbang = function () {};
    g.hostready = function () {
        if (deleted) return;
        if (booted) { if (pendingState) scheduleRestore(); return; }
        var values = captureParameters(), saved = pendingState;
        if (!saved) saved = {settings: defaultSnapshot(), latch: false, prepared: null, selection: null};
        applying = true;
        under.loadbang(); cancelTask(demoTask); demoTask = null;
        under.mode(deviceMode);
        booted = true; applying = false;
        applyState(saved, values);
    };
    g.mode = function () { refreshLabels(); };
    g.lockUI = function (flag) {
        under.lockUI(flag); refreshLabels();
        // Generation settings may change between triggers while audio is playing.
        if (state === "playing" || (state === "live" && deviceMode === 3)) {
            var names = parameterNames();
            for (var i = 0; i < names.length; i++) message(names[i], "ignoreclick", 0);
        }
    };
    g.markDirty = function () {
        under.markDirty();
        if (finiteMode() && !applying && !waitingRestore && mutable()) status("Settings ready. Press GENERATE to prepare audio.");
    };
    g.loadfile = function () {
        if (!booted || deleted) return;
        var before = paths.slice(0);
        under.loadfile.apply(host, arguments);
        if (!applying && JSON.stringify(before) !== JSON.stringify(paths)) { invalidate(); changed(); }
    };
    g.loaded = function (slot) {
        under.loaded(slot);
        if (slotOK(Number(slot))) message("file" + (Number(slot) + 1), "hint", paths[Number(slot)]);
        refreshLabels(); finishRestore(); changed();
    };
    g.demos = function () {
        if (!booted || deleted || !mutable()) return;
        for (var i = 0; i < requiredSources(); i++) g.loadfile(i, localfile("apgw_test" + (i + 1) + ".wav"));
    };
    function edit(method, args, uiValues, affectsRender) {
        if (!booted || (pendingState && !applying)) {
            for (var key in uiValues) if (uiValues.hasOwnProperty(key)) pendingUI[key] = uiValues[key];
            return;
        }
        var structural = method === "repeats" || method === "pitch" || method === "param" || method === "choice";
        var previous = state, nextTrigger = structural && (state === "playing" || (state === "live" && deviceMode === 3));
        var before = finiteMode() && affectsRender ? signature(g.CMPEHost.snapshot()) : "";
        if (nextTrigger) state = "idle";
        try { under[method].apply(host, args); }
        finally { if (nextTrigger) state = previous; }
        if (finiteMode() && affectsRender && before !== signature(g.CMPEHost.snapshot())) invalidate();
        refreshLabels();
        if (nextTrigger) g.lockUI(true);
        changed();
    }
    g.repeats = function (slot, value) { var map = {}; map["repeat" + (Number(slot) + 1)] = Number(value); edit("repeats", arguments, map, true); };
    g.pitch = function (value) { edit("pitch", arguments, {pitch: Number(value)}, true); };
    g.param = function (index, value) { var map = {}; map["param" + Number(index)] = Number(value); edit("param", arguments, map, true); };
    g.choice = function (value) { edit("choice", arguments, {mode_menu: Number(value)}, true); };
    g.monitor = function (value) { edit("monitor", arguments, {monitor_level: Number(value)}, false); };
    g.loopmode = function (value) { edit("loopmode", arguments, {loop_toggle: Number(value)}, false); };
    g.xy = function (x, y) { edit("xy", arguments, {m4l_position: Number(x), m4l_density: Number(y)}, false); };
    g.hostxy = function (axis, value) {
        if ((axis !== "x" && axis !== "y") || !finite(Number(value))) return;
        if (!booted || (pendingState && !applying)) {
            pendingUI[axis === "x" ? "m4l_position" : "m4l_density"] = Number(value);
            return;
        }
        var settings = g.CMPEHost.snapshot().isjs;
        g.xy(axis === "x" ? Number(value) : settings.position, axis === "y" ? Number(value) : settings.densityY);
    };
    g.midilatch = function (value) {
        if (!booted || (pendingState && !applying)) { pendingUI.m4l_latch = Number(value); return; }
        latch = Number(value) !== 0; ui("m4l_latch", latch ? 1 : 0);
        if (!latch && activeKey && !held.length && !manual) g.stop();
        changed();
    };
    g.commitSelection = function () { under.commitSelection(); restoredSelection = null; changed(); };
    g.clearloop = function () { under.clearloop(); restoredSelection = null; changed(); };
    g.requestAudio = function (action) {
        if (!booted || deleted || !enabled) { status("Enable this device in Live before starting."); return; }
        if (pendingState || waitingRestore) { status("Restoring samples. Wait for Ready."); return; }
        if (savePending && action !== "play") { status("Wait for the WAV write to finish."); return; }
        var current = g.CMPEState(), i;
        for (i = 0; i < requiredSources(); i++) {
            if (loading[i] || current.nativeBusy[i]) { status("Loading samples. Wait for Ready."); return; }
            if (!sources[i]) { status("Load the required samples or choose DEMO."); return; }
        }
        message("dsp_info", "bang");
        if (sampleRate <= 0) { status("Enable Live's audio engine so the device can read its sample rate."); return; }
        if (action === "play" || !finiteMode()) {
            if (!audioOn) { status("Live's audio engine is off. Enable it, then trigger again."); return; }
            if (finiteMode()) beginPlayback(); else under.beginRender(false);
        } else {
            prepared = null; restoredSelection = null; rebuilding = false;
            renderSeed = randomSeed(); renderRateOverride = 0;
            under.beginRender(false);
        }
        refreshLabels();
    };
    g.play = function () {
        if (!booted || !mutable()) return;
        if (finiteMode() && (!outputReady || dirty)) { status("Press GENERATE first. Playback starts when the waveform is Ready."); return; }
        clearNotes(); manual = true; velocity(1);
        g.requestAudio(finiteMode() ? "play" : "live");
    };
    g.newpiece = function () {
        if (!booted || !mutable()) return;
        if (finiteMode()) g.requestAudio("render");
        else { under.newpiece(); refreshLabels(); changed(); }
    };
    g.renderComplete = function () {
        under.renderComplete();
        prepared = {algorithm: algorithm, seed: renderSeed, sampleRate: plan.sampleRate,
            sources: fingerprints(), signature: signature(g.CMPEHost.snapshot())};
        if (restoredSelection) {
            pendingSelection = restoredSelection.slice(0); restoredSelection = null;
            under.commitSelection();
        }
        rebuilding = false; renderRateOverride = 0; refreshLabels();
        status(firstAudioFrame < 0 ? "The prepared output is silent or very quiet. Check the source audio." : "Ready. PLAY or a MIDI note starts the prepared waveform.");
        changed();
    };
    g.renderFailed = function (reason) {
        under.renderFailed(reason); rebuilding = false; renderRateOverride = 0; refreshLabels(); changed();
    };
    function startNote(note, value, channel) {
        if (!enabled || !booted || pendingState || waitingRestore || rebuilding || deleted) return false;
        if (state === "rendering" || state === "waiting" || state === "restoring") { status("Wait for Ready, then play the note again."); return false; }
        if (finiteMode() && (!outputReady || dirty)) { status("Press GENERATE first, then play the note again when Ready."); return false; }
        message("dsp_info", "bang");
        if (!audioOn || sampleRate <= 0) { status("Enable Live's audio engine, then play the note again."); return false; }
        cancelTask(finishTask); finishTask = null;
        if (!finiteMode()) {
            under.stop();
            if (deviceMode === 3) under.param(1, clamp(440 * Math.pow(2, (note - 69) / 12), 20, 20000));
        } else if (state === "stopping") state = "ready";
        manual = false; velocity(value / 127);
        if (finiteMode()) beginPlayback(); else g.requestAudio("live");
        if (state !== "playing" && state !== "live") return false;
        activeKey = channel + ":" + note;
        refreshLabels(); changed(); return true;
    }
    g.midinote = function (note, value, channel) {
        note = Number(note); value = Number(value); channel = Number(channel || 1);
        if (!finite(note) || !finite(value) || !finite(channel) || note < 0 || note > 127 || value < 0 || value > 127 || channel < 1 || channel > 16) return;
        note = Math.round(note); value = Math.round(value); channel = Math.round(channel);
        var key = channel + ":" + note, i;
        if (value > 0) {
            if (!startNote(note, value, channel)) return;
            for (i = held.length - 1; i >= 0; i--) if (held[i].key === key) held.splice(i, 1);
            held.push({key: key, note: note, velocity: value, channel: channel});
        } else {
            for (i = held.length - 1; i >= 0; i--) if (held[i].key === key) held.splice(i, 1);
            if (manual || key !== activeKey || latch) return;
            if (held.length) {
                var previous = held[held.length - 1];
                if (!startNote(previous.note, previous.velocity, previous.channel)) g.stop();
            } else g.stop();
        }
    };
    g.stop = function () {
        clearNotes();
        if (waitingRestore) { waitingRestore = false; prepared = null; restoredSelection = null; restoreTarget = null; }
        if (state === "rendering") { prepared = null; rebuilding = false; restoredSelection = null; }
        under.stop(); refreshLabels(); changed();
    };
    g.hostactive = function (value) {
        enabled = Number(value) !== 0;
        if (!booted) return;
        if (!enabled) {
            clearNotes();
            var wasRebuilding = rebuilding, saved = prepared;
            // The underlying restore has already stopped the voices. Calling
            // its STOP here would discard a new Set state waiting on disk I/O.
            if (!g.CMPEState().restoring) under.stop();
            cancelTask(finishTask); finishTask = null;
            if (state === "stopping") finishPlayback("Device disabled.");
            velocity(0);
            if (wasRebuilding) { prepared = saved; rebuilding = false; waitingRestore = true; }
            status("Device disabled in Live.");
        } else { velocity(1); finishRestore(); }
    };
    g.dspstate = function (value) {
        under.dspstate(value);
        if (Number(value) === 0) { clearNotes(); if (booted && !rebuilding) status("Live audio is off. Enable it before playback."); }
    };
    g.samplerate = function (value) { under.samplerate(value); };
    g.shutdown = function () {
        deleted = true; clearNotes(); cancelTask(restoreTask); restoreTask = null;
        under.shutdown(); velocity(0);
    };
    g.notifydeleted = function () { g.shutdown(); };
    g.M4LState = function () {
        return {mode: deviceMode, booted: booted, enabled: enabled, waitingRestore: waitingRestore,
            rebuilding: rebuilding, latch: latch, activeNote: activeKey, heldNotes: held.length,
            renderSeed: renderSeed, prepared: prepared ? copy(prepared) : null, deleted: deleted};
    };
}(this));
