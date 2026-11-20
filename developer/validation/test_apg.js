"use strict";

// Independent verification of the event plan. This does not run Max/MSP.
// Usage: node validation/test_apg.js [path/to/apg_plan.js]
const assert = require("node:assert/strict");
const path = require("node:path");
const target = process.argv[2] || path.join(__dirname, "../apg_wave_plan.js");
const imported = require(path.resolve(target));
const APGPlan = imported.APGPlan || imported;
assert.equal(typeof APGPlan.makePlan, "function", "APGPlan.makePlan must be exported");

let assertionCount = 0;
let planCount = 0;
let maximumVoices = 0;

function check(condition, message) {
    assertionCount += 1;
    assert.ok(condition, message);
}

function near(a, b, tolerance, message) {
    check(Number.isFinite(a) && Number.isFinite(b) && Math.abs(a - b) <= tolerance,
        `${message}: ${a} versus ${b}`);
}

function seeded(seed) {
    let state = seed >>> 0;
    return function () {
        state ^= state << 13;
        state ^= state >>> 17;
        state ^= state << 5;
        return (state >>> 0) / 4294967296;
    };
}

function source(name, frames, sampleRate, channels) {
    return { name, frames, durationMs: frames / sampleRate * 1000, channels };
}

const mixed = [
    source("test_mono_44100", 2017, 44100, 1),
    source("test_stereo_48000", 1787, 48000, 2),
    source("test_stereo_32000", 1703, 32000, 2)
];

function verifyPlan(sources, repeats, pitch, sampleRate, random) {
    const plan = APGPlan.makePlan(sources, repeats, pitch, sampleRate, random);
    planCount += 1;
    const expectedN = Math.max(4, Math.round(2 * Math.max(...sources.map(s => s.durationMs)) * sampleRate / 1000));
    check(plan.totalFrames === expectedN, "piece length equals twice longest sample, rounded to output frames");
    near(plan.durationMs, plan.totalFrames / sampleRate * 1000, 1e-9, "reported duration uses integer frame total");
    check(plan.sampleRate === sampleRate, "output sample rate retained");
    check(Array.isArray(plan.counts) && plan.counts.length === 3, "three actual pair counts");
    check(Array.isArray(plan.events), "event array exists");
    check(Number.isFinite(plan.normalization) && plan.normalization > 0 && plan.normalization <= 1,
        "normalization is finite and within (0, 1]");
    maximumVoices = Math.max(maximumVoices, plan.events.length);
    const groups = new Map();
    const eventCounts = [0, 0, 0];
    for (let i = 0; i < 3; i++) {
        check(Number.isInteger(plan.counts[i]) && plan.counts[i] >= Math.ceil(repeats[i] / 2)
            && plan.counts[i] <= repeats[i], "repeat counts are inclusive integers from ceil(max/2) through max");
    }
    check(plan.events.length === 2 * plan.counts.reduce((a, b) => a + b, 0), "two events per pair");
    check(plan.events.length <= 120, "configured maximum fits 120 dedicated voices");

    for (const event of plan.events) {
        check(Number.isInteger(event.slot) && event.slot >= 0 && event.slot < 3, "valid sample slot");
        const sample = sources[event.slot];
        const lastPosition = (sample.frames - 1) * sample.durationMs / sample.frames;
        check(event.bufferName === sample.name, "voice addresses its source buffer");
        check(Number.isInteger(event.startFrame) && event.startFrame >= 0, "nonnegative integer event start");
        check(Number.isInteger(event.lengthFrames) && event.lengthFrames >= 2, "at least two output frames per event");
        check(event.startFrame + event.lengthFrames <= plan.totalFrames, "event ends within piece");
        check(Number.isFinite(event.rate) && event.rate >= 1 && event.rate <= 1 + pitch + 1e-14,
            "rate fits selected speed/pitch range");
        check(event.lengthFrames === Math.max(2, Math.round(sample.durationMs / event.rate * sampleRate / 1000)),
            "duration follows speed and rounds to output frames");
        check(Number.isFinite(event.amplitude) && event.amplitude >= 0.2 - 1e-14 && event.amplitude <= 0.5 + 1e-14,
            "amplitude follows source bounds");
        check(event.direction === 1 || event.direction === -1, "direction is forward or reverse");
        check(Boolean(event.mono) === (sample.channels === 1), "mono flag matches source metadata");
        near(event.positionStartMs, event.direction > 0 ? 0 : lastPosition, 1e-10,
            "sample start is explicit first or last frame");
        near(event.positionDeltaMs, event.direction * lastPosition, 1e-10,
            "sample trajectory reaches the opposite endpoint");
        const key = `${event.slot}:${event.pair}`;
        if (!groups.has(key)) groups.set(key, []);
        groups.get(key).push(event);
        eventCounts[event.slot] += 1;
    }
    for (let i = 0; i < 3; i++) {
        check(eventCounts[i] === 2 * plan.counts[i], "slot counts match event plan");
    }
    for (const pair of groups.values()) {
        check(pair.length === 2, "each pair identifier has exactly two events");
        const [a, b] = pair;
        check(a.lengthFrames === b.lengthFrames, "paired lengths match");
        check(a.direction === -b.direction, "paired directions oppose");
        check(a.startFrame + b.startFrame + a.lengthFrames === plan.totalFrames,
            "paired intervals reflect exactly in integer output frames");
        near(a.rate, b.rate, 0, "paired rates match exactly");
        near(a.amplitude, b.amplitude, 0, "paired amplitudes match exactly");
        near(a.positionDeltaMs, -b.positionDeltaMs, 1e-12, "paired sample trajectories oppose");
    }
    // Independently compute the full-amplitude overlap bound by directly checking
    // active intervals, rather than repeating the implementation's sorted edges.
    let independentBound = 0;
    for (const event of plan.events) {
        let sum = 0;
        for (const other of plan.events) {
            if (other.startFrame <= event.startFrame && event.startFrame < other.startFrame + other.lengthFrames) {
                sum += other.amplitude * 0.8 * (other.mono ? Math.SQRT1_2 : 1);
            }
        }
        independentBound = Math.max(independentBound, sum);
    }
    check(independentBound * plan.normalization <= 0.85 + 1e-12,
        "static normalization bounds overlapping unity-peak samples at 0.85");
    return plan;
}

// Input array mutation would corrupt later runs in a persistent Max js object.
const originalSources = JSON.stringify(mixed);
const originalRepeats = [3, 4, 5];
verifyPlan(mixed, originalRepeats, 0.5, 48000, seeded(1));
check(JSON.stringify(mixed) === originalSources, "source metadata is not mutated");
check(JSON.stringify(originalRepeats) === "[3,4,5]", "repeat controls are not mutated");

// Zero, near-one, and middle random values exercise range endpoints and overlap.
for (const sampleRate of [8000, 44100, 48000, 96000, 192000]) {
    for (const repeats of [[1, 1, 1], [3, 4, 5], [20, 20, 20], [1, 20, 2]]) {
        for (const pitch of [0, 0.5, 1]) {
            for (const draw of [0, 0.5, 1 - Number.EPSILON]) {
                verifyPlan(mixed, repeats, pitch, sampleRate, () => draw);
            }
        }
    }
}

for (let seed = 1; seed <= 500; seed++) {
    const random = seeded(seed);
    const durations = [
        source("a", 7 + Math.floor(random() * 5000), 44100, 1),
        source("b", 7 + Math.floor(random() * 5000), 48000, 2),
        source("c", 7 + Math.floor(random() * 5000), 32000, seed % 2 ? 1 : 2)
    ];
    const repeats = [0, 1, 2].map(() => 1 + Math.floor(random() * 20));
    verifyPlan(durations, repeats, random(), 48000, random);
}

// Deliberately overlapping, chronologically inverted pairs are valid.
const equalSources = ["one", "two", "three"].map(name => source(name, 48000, 48000, 1));
const overlapping = verifyPlan(equalSources, [20, 20, 20], 0, 48000, () => 1 - Number.EPSILON);
let overlappingPairs = 0;
for (let i = 0; i < overlapping.events.length; i++) {
    const first = overlapping.events[i];
    const second = overlapping.events.find((item, j) => i !== j && item.slot === first.slot && item.pair === first.pair);
    if (first.startFrame < second.startFrame && first.startFrame + first.lengthFrames > second.startFrame) overlappingPairs++;
}
check(overlappingPairs === 60, "all sixty pairs can overlap around the midpoint");
check(maximumVoices === 120, "maximum controls and random endpoint reach 120 events");

// Extremely short inputs retain a viable four-frame timeline and two-frame voices.
const tiny = ["tiny_a", "tiny_b", "tiny_c"].map(name => source(name, 2, 192000, 1));
verifyPlan(tiny, [20, 20, 20], 1, 8000, () => 1 - Number.EPSILON);

const clippedLow = APGPlan.makePlan(mixed, [-10, 40, 2.6], -2, 48000, seeded(88));
const expectedLow = APGPlan.makePlan(mixed, [1, 20, 3], 0, 48000, seeded(88));
assert.deepEqual(clippedLow, expectedLow, "finite repeat/pitch controls clip and round deterministically");
assert.deepEqual(
    APGPlan.makePlan(mixed, [3, 4, 5], 9, 48000, seeded(9)),
    APGPlan.makePlan(mixed, [3, 4, 5], 1, 48000, seeded(9)),
    "pitch range above one is clipped"
);
assertionCount += 2;

// Explicitly verify invalid source metadata and clock inputs cannot produce a plan.
function mustReject(sources, repeats, pitch, sampleRate, label) {
    let rejected = false;
    try { APGPlan.makePlan(sources, repeats, pitch, sampleRate, seeded(10)); }
    catch (_) { rejected = true; }
    check(rejected, `reject invalid input: ${label}`);
}
for (const invalid of [null, [], mixed.slice(0, 2)]) {
    mustReject(invalid, [3, 4, 5], 0.5, 48000, "three sources required");
}
for (const [key, value] of [
    ["durationMs", 0], ["durationMs", -1], ["durationMs", NaN], ["durationMs", Infinity],
    ["frames", 0], ["frames", 1], ["frames", -1], ["frames", NaN], ["frames", 1.5],
    ["channels", 0], ["channels", 3], ["name", ""]
]) {
    const changed = mixed.map(item => ({ ...item }));
    changed[1][key] = value;
    mustReject(changed, [3, 4, 5], 0.5, 48000, `${key}=${String(value)}`);
}
for (const sampleRate of [0, -1, NaN, Infinity]) {
    mustReject(mixed, [3, 4, 5], 0.5, sampleRate, `sampleRate=${String(sampleRate)}`);
}
for (const value of [NaN, Infinity, -Infinity]) {
    mustReject(mixed, [3, value, 5], 0.5, 48000, "nonfinite repeat value");
    mustReject(mixed, [3, 4, 5], value, 48000, "nonfinite pitch range");
}
for (const repeats of [null, [], [3, 4]]) {
    mustReject(mixed, repeats, 0.5, 48000, "three repeat controls required");
}
const huge = mixed.map(item => ({ ...item, durationMs: 30000000 }));
mustReject(huge, [3, 4, 5], 0.5, 48000, "timeline cannot overflow signed 32-bit sample counter");
for (const draw of [-0.1, 1, NaN, Infinity]) {
    let rejected = false;
    try { APGPlan.makePlan(mixed, [3, 4, 5], 0.5, 48000, () => draw); }
    catch (_) { rejected = true; }
    check(rejected, "invalid random generator output is rejected");
}

// Independent source synthesis and interpolation. The asymmetric signals expose
// accidental same-direction playback, start/end mistakes, and channel swapping.
function synthesize(metadata, index) {
    return Array.from({ length: metadata.channels }, (_, channel) =>
        Float64Array.from({ length: metadata.frames }, (_, frame) => {
            const t = frame / (metadata.frames - 1);
            return 0.37 * Math.sin((7.7 + index * 3.1 + channel * 0.8) * t)
                + 0.19 * Math.cos((11.3 + index * 2.9 + channel * 5.1) * t * t)
                + 0.11 * t + (channel ? -0.025 : 0.035);
        })
    );
}

function interpolate(samples, sourceFrame) {
    const x = Math.max(0, Math.min(samples.length - 1, sourceFrame));
    const lower = Math.floor(x);
    const upper = Math.min(samples.length - 1, lower + 1);
    return samples[lower] + (samples[upper] - samples[lower]) * (x - lower);
}

function render(plan, sources) {
    const audio = sources.map(synthesize);
    const result = [new Float64Array(plan.totalFrames), new Float64Array(plan.totalFrames)];
    for (const event of plan.events) {
        const metadata = sources[event.slot];
        const sourceChannels = audio[event.slot];
        const toFrames = metadata.frames / metadata.durationMs;
        const channelGain = event.mono ? Math.SQRT1_2 : 1;
        for (let k = 0; k < event.lengthFrames; k++) {
            const phase = k / (event.lengthFrames - 1);
            const envelope = Math.max(0, Math.min(100 * phase, 100 * (1 - phase), 1));
            const positionMs = event.positionStartMs + phase * event.positionDeltaMs;
            const gain = event.amplitude * envelope * 0.8 * channelGain * plan.normalization;
            const outputFrame = event.startFrame + k;
            for (let channel = 0; channel < 2; channel++) {
                const samples = sourceChannels[event.mono ? 0 : channel];
                result[channel][outputFrame] += interpolate(samples, positionMs * toFrames) * gain;
            }
        }
    }
    return result;
}

let maximumReflectionError = 0;
let renderedPlans = 0;
for (const outputRate of [44100, 48000, 96000]) {
    for (const pitch of [0, 0.5, 1]) {
        for (const seed of [7, 131, 994]) {
            const plan = verifyPlan(mixed, [3, 4, 5], pitch, outputRate, seeded(seed));
            const audio = render(plan, mixed);
            let peak = 0;
            for (const channel of audio) {
                for (let i = 0; i < channel.length; i++) {
                    peak = Math.max(peak, Math.abs(channel[i]));
                    maximumReflectionError = Math.max(maximumReflectionError,
                        Math.abs(channel[i] - channel[channel.length - 1 - i]));
                }
            }
            check(peak > 1e-6, "rendered reflection check contains audible, nonzero data");
            renderedPlans++;
        }
    }
}
check(maximumReflectionError < 1e-10, "independently rendered stereo mix reflects sample-for-sample within numerical precision");

console.log(JSON.stringify({
    result: "PASS",
    checkedPlans: planCount,
    assertions: assertionCount,
    maximumScheduledVoices: maximumVoices,
    independentAudioRenders: renderedPlans,
    maximumReflectionError,
    limit: "Plan and independent DSP-model checks only. Native Max/MSP was not available; this does not verify actual Max audio output, UI, or recording."
}, null, 2));
