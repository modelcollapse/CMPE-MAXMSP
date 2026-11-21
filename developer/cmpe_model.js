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
