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
