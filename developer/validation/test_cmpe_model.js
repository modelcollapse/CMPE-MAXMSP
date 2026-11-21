/* Deterministic, independent checks of the new CMPE musical models.
 * Run with: node developer/validation/test_cmpe_model.js
 * No Max installation, packages, or audio device is required.
 */
"use strict";
var assert = require("assert");
var M = require("../cmpe_model.js");
var checks = 0, cases = 0;
function ok(value, message) { checks++; assert.ok(value, message); }
function eq(actual, expected, message) { checks++; assert.deepStrictEqual(actual, expected, message); }
function near(actual, expected, tolerance, message) {
    checks++;
    assert.ok(Math.abs(actual - expected) <= (tolerance || 1e-12),
        (message || "values differ") + ": " + actual + " vs " + expected);
}
function throws(fn, pattern) { checks++; assert.throws(fn, pattern); }
function test(name, fn) { fn(); cases++; }
function middle() { return 0.5; }
function zero() { return 0; }
function one() { return 1; }
function seeded(seed) {
    var state = seed >>> 0;
    return function () {
        state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
        return state / 4294967296;
    };
}
function makeSource(channelArrays, sourceRate) {
    return {frames: channelArrays[0].length, durationMs: channelArrays[0].length * 1000 / sourceRate,
        channels: channelArrays.length};
}
function readerFor(arrays, metadata, stats) {
    return function (slot, channel, first, count) {
        eq(slot, 0, "only source 1 should be read");
        ok(channel >= 1 && channel <= metadata.channels, "valid one-based channel");
        ok(first >= 0 && count >= 1 && first + count <= metadata.frames, "bounded contiguous read");
        ok(count <= 2048, "source data must be read in bounded pages");
        if (stats) { stats.calls++; stats.largest = Math.max(stats.largest, count); }
        return count === 1 ? arrays[channel - 1][first] : arrays[channel - 1].slice(first, first + count);
    };
}
/* Independent oracle, deliberately scalar and without the production cache,
 * active-event queue, envelope function, or gain fields.
 */
function oracle(plan, metadata, arrays, frame) {
    var l = 0, r = 0, i, e, elapsed, progress, level, position, a, b, amount, mono, ch;
    for (i = 0; i < plan.events.length; i++) {
        e = plan.events[i];
        if (frame < e.startFrame || frame >= e.startFrame + e.lengthFrames) continue;
        elapsed = (frame - e.startFrame) / plan.sampleRate;
        if (elapsed <= 0 || elapsed >= (e.attackMs + e.releaseMs) / 1000) continue;
        if (elapsed < e.attackMs / 1000) {
            progress = elapsed / (e.attackMs / 1000);
            level = (Math.exp(e.curve * progress) - 1) / (Math.exp(e.curve) - 1);
        } else {
            progress = (elapsed - e.attackMs / 1000) / (e.releaseMs / 1000);
            level = 1 - (Math.exp(e.curve * progress) - 1) / (Math.exp(e.curve) - 1);
        }
        position = e.sourceStartFrame + elapsed * metadata.frames / (metadata.durationMs / 1000);
        position -= Math.floor(position / metadata.frames) * metadata.frames;
        a = Math.floor(position); b = a + 1 === metadata.frames ? 0 : a + 1; amount = position - a;
        mono = 0;
        for (ch = 0; ch < arrays.length; ch++) mono += arrays[ch][a] * (1 - amount) + arrays[ch][b] * amount;
        l += mono * level * e.amplitude * Math.sqrt((1 + Math.cos((e.pan + 1) * Math.PI / 2)) / 2) * plan.normalization;
        r += mono * level * e.amplitude * Math.sqrt((1 - Math.cos((e.pan + 1) * Math.PI / 2)) / 2) * plan.normalization;
    }
    return [l, r];
}
function collect(renderer, total, chunks) {
    var l = [], r = [], start = 0, step = 0, chunk;
    while (start < total) {
        chunk = renderer.renderChunk(start, Math.min(chunks[step++ % chunks.length], total - start));
        l = l.concat(chunk.left); r = r.concat(chunk.right); start += chunk.frames;
    }
    return [l, r];
}

test("SC curve equations and endpoints", function () {
    near(M.curve(0, 1, 0.5, 2), 1 / (1 + Math.E));
    near(M.curve(0, 1, 0.5, -2), Math.E / (1 + Math.E));
    near(M.curve(2, 6, 0.25, 0), 3);
    near(M.curve(0.000001, 1, 0.5, "exp"), 0.001);
    eq(M.curve(3, 9, 0, 4), 3); eq(M.curve(3, 9, 1, 4), 9);
    throws(function () { M.curve(0, 1, 0.5, "exp"); }, /positive/);
});

test("breakpoints preserve source envelopes and bound approximation error", function () {
    var segments = [
        {durationMs: 10000, from: 0.000001, to: 1, curve: "exp"},
        {durationMs: 5000, from: 1, to: 1, curve: "exp"},
        {durationMs: 12000, from: 1, to: 0.000001, curve: "exp"}
    ];
    var points = M.envelopePoints(segments, 14), i, p, previous = -1, j, t, expected, linear;
    ok(points.length <= 32);
    for (i = 0; i < points.length; i++) {
        p = points[i]; ok(p.timeMs >= previous); previous = p.timeMs;
        near(p.value, M.envelopeValue(segments, p.timeMs), 1e-12);
        if (i) for (j = 1; j < 10; j++) {
            t = points[i - 1].timeMs + (p.timeMs - points[i - 1].timeMs) * j / 10;
            expected = M.envelopeValue(segments, t);
            linear = points[i - 1].value + (p.value - points[i - 1].value) * j / 10;
            near(linear, expected, 0.006, "live envelope approximation");
        }
    }
    eq(points[points.length - 1].timeMs, 27000);
});

test("ISJS retains distinct density mappings and independent controls", function () {
    var s = {position: 0.75, densityY: 0.5, rates: [0.3, 1.25, 1.7], levels: [0.4, 0.7, 1], panWidths: [0.6, 0.7, 0.8]};
    var first = M.isjsEvent(s, 0, middle), second = M.isjsEvent(s, 1, middle), third = M.isjsEvent(s, 2, one);
    near(first.densityHz, 20.25); near(second.densityHz, 17.55);
    near(first.periodMs, 1000 / 20.25);
    near(first.durationMs, (1000 / 20.25 + 10) * 0.99);
    near(first.amplitude, 0.42); eq(first.position, 0.75); eq(first.rate, 0.3);
    eq(second.rate, 1.25); near(third.pan, 0.8); near(third.amplitude, 1.2);
    ok(first.envelope.length >= 16 && first.envelope.length <= 32);
    throws(function () { M.isjsEvent(s, 3, middle); }, /source/);
});

test("Many uses exact pitch sets and wet-only allpass parameters", function () {
    eq(M.pitchSets[0], [-12, -10, -8, -7, -5, -3, -1, 0, 2, 4, 5, 7, 9, 11, 12]);
    eq(M.pitchSets[1], [-12, -10, -9, -7, -5, -4, -1, 0, 2, 3, 5, 7, 8, 11, 12]);
    eq(M.pitchSets[2], [0, 2, 4, 7, 9, -3, -5, -8, -10, -12]);
    eq(M.pitchSets[3].length, 25);
    var s = M.defaultSettings("many", middle), e = M.manyEvent(s, middle), i;
    eq(s.pitchSet, 1); eq(s.intervalMaxMs, 10000); eq(s.delayMaxMs, 200);
    eq(e.semitones, 0); eq(e.rate, 1); eq(e.stages.length, 7); near(e.feed, 1.06);
    near(e.voiceDelayMaxMs, 150); near(e.nextMs, 7500); near(e.dryDurationMs, 3000);
    near(e.drySegments[0].durationMs, 300); near(e.drySegments[1].durationMs, 1200);
    near(e.drySegments[2].durationMs, 1500); eq(e.drySegments[2].curve, 1);
    for (i = 0; i < 7; i++) {
        near(e.stages[i].leftMs, 93.75); near(e.stages[i].rightMs, 93.75);
        near(e.stages[i].decaySeconds, 20);
        near(e.stages[i].leftK, Math.exp(-Math.log(1000) * 0.09375 / 20));
        ok(e.stages[i].leftK > 0 && e.stages[i].leftK < 1);
    }
    ok(e.dryEnvelope.length <= 32); ok(e.wetEnvelope.length <= 32);
    near(M.envelopeValue(e.wetSegments, 99999), 1);
});

test("Many microtonal set persists and randomization stays bounded", function () {
    var set = M.makeMicrotonalSet(seeded(33)), rng = seeded(9), i, e;
    eq(set.length, 12);
    for (i = 0; i < 200; i++) {
        e = M.manyEvent({pitchSet: 4, microtonalSet: set, level: 2, delayMaxMs: 500, intervalMaxMs: 20000}, rng);
        ok(set.indexOf(e.semitones) >= 0); eq(e.microtonalSet, set);
        ok(e.nextMs >= 10000 && e.nextMs <= 20000);
        ok(e.voiceDelayMaxMs >= 250 && e.voiceDelayMaxMs <= 500);
    }
    throws(function () { M.manyEvent({pitchSet: 4, microtonalSet: [2]}, middle); }, /0.15/);
});

test("RMHS builds all three banks and source amplitude weights", function () {
    var p = M.rmhsPlan({level: 0.4, fundamentalHz: 100, intervalSemitones: 12, durationSeconds: 20, harmonics: 8}, 48000, middle);
    eq(p.voices.length, 22); eq(p.skippedPartials, 0); eq(p.totalPartials, 22);
    eq(p.voices[0].bank, "center"); eq(p.voices[0].frequencyHz, 100);
    near(p.voices[0].amplitude, 0.4 * 0.25 * 2 * (2 / 3));
    eq(p.voices[6].bank, "right"); eq(p.voices[6].frequencyHz, 200);
    near(p.voices[6].amplitude, 0.4 * 0.25 * (2 / 3));
    near(p.voices[6].pan, 0.45); near(p.voices[14].pan, -0.45);
    near(p.voices[0].driftMaxHz, 2); near(p.voices[0].driftRateHz, 0.1505);
    near(p.voices[0].driftLagMs, 500 / 0.1505);
    near(p.voices[0].modRateHz, 0.011); near(p.voices[0].modPhase, Math.PI / 2);
    near(p.durationMs, 36500); ok(p.voices[0].envelope.length <= 32);
});

test("RMHS skips partials whose drift can cross Nyquist", function () {
    var s = {level: 0.4, fundamentalHz: 100, intervalSemitones: 12, durationSeconds: 20, harmonics: 8};
    var p = M.rmhsPlan(s, 1000, zero), i;
    eq(p.voices.length, 8); eq(p.skippedPartials, 14);
    for (i = 0; i < p.voices.length; i++) {
        ok(p.voices[i].frequencyHz + p.voices[i].driftMaxHz < 500);
        ok(p.voices[i].driftRateHz > 0 && isFinite(p.voices[i].driftLagMs));
    }
    eq(M.rmhsPlan({harmonics: 20, fundamentalHz: 30}, 48000, middle).totalPartials, 55);
    eq(M.rmhsPlan({fundamentalHz: 0}, 48000, middle).voices.length, 0);
});

test("SIOE short positions, amplitude, and wrapping", function () {
    var source = {frames: 1000, durationMs: 1000, channels: 1};
    var p = M.sioePlan([source], {count: 4, hitSeconds: 1, form: "short"}, 1000, middle);
    eq(p.events.length, 4); eq(p.events.map(function (e) { return e.sourceStartFrame; }), [250, 500, 750, 0]);
    eq(p.events.map(function (e) { return e.startFrame; }), [0, 0, 0, 0]);
    near(p.events[0].amplitude, 0.5625); near(p.events[0].attackMs, 155);
    near(p.events[0].releaseMs, 750); near(p.events[0].curve, -4.5);
    eq(p.totalFrames, 906); eq(p.maxConcurrent, 4);
});

test("SIOE long counts and four-beat spacing are exact", function () {
    var p = M.sioePlan([{frames: 1000, durationMs: 1000, channels: 1}],
        {count: 4, tempo: 120, hitSeconds: 0.2, form: "long"}, 1000, middle);
    var chords = [0, 0, 0, 0, 0, 0, 0, 0], i, e;
    eq(p.events.length, 16); eq(p.chordIntervalMs, 2000);
    for (i = 0; i < p.events.length; i++) {
        e = p.events[i]; chords[e.chord]++;
        eq(e.startFrame, e.chord * 2000);
        near(e.amplitude, 0.9 / (0.8 * e.chordVoices));
    }
    eq(chords, [1, 2, 3, 4, 3, 2, 1, 0]); eq(p.totalFrames, 16000);
});

test("SIOE high count is finite and guards allocation size early", function () {
    var sources = [{frames: 1000, durationMs: 1000, channels: 1}];
    var p = M.sioePlan(sources, {count: 100, tempo: 3000, hitSeconds: 0.1, form: "long"}, 48000, seeded(17));
    eq(p.events.length, 10000); ok(p.recommendedChunkFrames >= 16 && p.recommendedChunkFrames <= 4096);
    ok(p.totalFrames * 8 < M.MAX_OUTPUT_BYTES);
    throws(function () { M.sioePlan(sources, {count: 100, tempo: 1, form: "long"}, 48000, middle); }, /10-minute/);
    throws(function () { M.sioePlan(sources, {count: 50, tempo: 120, form: "long"}, 192000, middle); }, /200 MiB/);
});

test("SIOE renderer matches independent mono/stereo rate and wrap oracle", function () {
    var fixtures = [
        {a: [[0.2]], sr: 44100, out: 1000},
        {a: [[0.2, -0.4, 0.8]], sr: 22050, out: 1000},
        {a: [[0.1, -0.3, 0.9, 0.4, -0.7], [0.6, 0.1, -0.2, 0.5, 0.2]], sr: 11025, out: 4000},
        {a: [[0.1, 0.5, -0.3, 0.8, 0.2, -0.6, 0.4]], sr: 800, out: 2000}
    ];
    fixtures.forEach(function (f, fixture) {
        var source = makeSource(f.a, f.sr), p = M.sioePlan([source],
            {count: 3, tempo: 3000, hitSeconds: 0.1, form: fixture % 2 ? "short" : "long"}, f.out, seeded(80 + fixture));
        var stats = {calls: 0, largest: 0};
        var renderer = M.createSioeRenderer(p, [source], readerFor(f.a, source, stats));
        var rendered = collect(renderer, p.totalFrames, [1, 7, 31, 64, 13]);
        var n, expected;
        for (n = 0; n < p.totalFrames; n++) {
            expected = oracle(p, source, f.a, n);
            near(rendered[0][n], expected[0], 2e-10, "oracle left");
            near(rendered[1][n], expected[1], 2e-10, "oracle right");
        }
        ok(stats.calls <= source.channels, "tiny source pages should stay cached");
    });
});

test("SIOE chunk boundaries and random-access reads do not alter samples", function () {
    var a = [[], []], i, source, p, all, split, backwards, partial;
    for (i = 0; i < 7000; i++) { a[0].push(Math.sin(i * 0.07) * 0.2); a[1].push(Math.cos(i * 0.11) * 0.1); }
    source = makeSource(a, 44100);
    p = M.sioePlan([source], {count: 7, tempo: 3000, hitSeconds: 0.2, form: "long"}, 8000, seeded(104));
    all = collect(M.createSioeRenderer(p, [source], readerFor(a, source)), p.totalFrames, [p.totalFrames]);
    split = collect(M.createSioeRenderer(p, [source], readerFor(a, source)), p.totalFrames, [3, 257, 19, 2048, 61]);
    eq(split, all, "bit-identical samples across chunk sizes");
    backwards = M.createSioeRenderer(p, [source], readerFor(a, source));
    partial = backwards.renderChunk(2300, 123); eq(partial.left, all[0].slice(2300, 2423));
    partial = backwards.renderChunk(20, 17); eq(partial.right, all[1].slice(20, 37));
    partial = backwards.renderChunk(p.totalFrames, 100); eq(partial.frames, 0);
});

test("SIOE exposes peak without clipping and obeys explicit normalization", function () {
    var a = [[1], [1]], source = makeSource(a, 48000);
    var p = M.sioePlan([source], {count: 1, hitSeconds: 0.1, form: "short"}, 1000, middle);
    var full = M.renderSioeChunk(p, [source], 0, p.totalFrames, readerFor(a, source));
    ok(full.peak > 1, "raw source-faithful mix must not hard-clip");
    p.normalization = 0.25;
    var quiet = M.renderSioeChunk(p, [source], 0, p.totalFrames, readerFor(a, source)), i;
    for (i = 0; i < full.left.length; i++) near(quiet.left[i], full.left[i] * 0.25);
    near(quiet.peak, full.peak * 0.25);
});

test("SIOE reader errors and malformed plans fail clearly", function () {
    var sources = [{frames: 10, durationMs: 10, channels: 1}];
    var p = M.sioePlan(sources, {count: 1, hitSeconds: 0.1, form: "short"}, 1000, middle);
    throws(function () { M.renderSioeChunk(p, sources, 0, 10, function () { return []; }); }, /too few/);
    throws(function () { M.renderSioeChunk(p, sources, 0, 10, function () { return [NaN, 0, 0, 0, 0, 0, 0, 0, 0, 0]; }); }, /non-finite/);
    throws(function () { M.renderSioeChunk(p, sources, -1, 10, function () {}); }, /chunk/);
    p.events[0].startFrame = -1;
    throws(function () { M.createSioeRenderer(p, sources, function () {}); }, /event/);
});

test("defaults are reproducible and use actual RMHS popup values", function () {
    eq(M.defaultSettings("isjs", middle).rates, [1.1, 1.03, 1.2]);
    eq(M.defaultSettings("RMHS", zero).harmonics, 7);
    eq(M.defaultSettings("rmhs", one).harmonics, 13);
    eq(M.defaultSettings("sioe", middle), {count: 10, tempo: 120, hitSeconds: 3, form: "long"});
    eq(M.defaultSettings("many", seeded(31)), M.defaultSettings("many", seeded(31)));
    throws(function () { M.isjsEvent({}, 0, function () { return NaN; }); }, /Random source/);
});

console.log(JSON.stringify({suite: "CMPE musical models", cases: cases, checks: checks, passed: true}));
