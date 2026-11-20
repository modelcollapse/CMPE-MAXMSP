"""Regenerate the original synthetic demo WAVs using Python's standard library."""

from pathlib import Path
import math
import struct
import wave


ROOT = Path(__file__).resolve().parent.parent
FIXTURES = [(44100, 1, 1.2), (48000, 2, 1.7), (32000, 1, 2.4)]

for index, (sample_rate, channels, duration) in enumerate(FIXTURES):
    data = bytearray()
    for frame in range(round(sample_rate * duration)):
        t = frame / sample_rate
        envelope = min(1.0, t / 0.01, (duration - t) / 0.03)
        envelope *= math.exp(-t / (duration * 0.45))
        for channel in range(channels):
            frequency = 150 + index * 105 + channel * 80
            value = 0.36 * envelope * (
                math.sin(2 * math.pi * (frequency * t + 18 * t * t))
                + 0.15 * math.sin(2 * math.pi * frequency * 2.4 * t)
            )
            data.extend(struct.pack("<h", round(max(-1.0, min(1.0, value)) * 32767)))
    target = ROOT / f"apgw_test{index + 1}.wav"
    with wave.open(str(target), "wb") as output:
        output.setnchannels(channels)
        output.setsampwidth(2)
        output.setframerate(sample_rate)
        output.writeframes(data)
    print(target.name)
