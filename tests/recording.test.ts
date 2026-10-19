import { it, expect } from "vitest";
import { validateRecording } from "../src/server/recording";
function el(id: number[], payload: number[]) {
  const length = payload.length;
  const size =
    length < 127 ? [128 | length] : [0x40 | (length >> 8), length & 255];
  return [...id, ...size, ...payload];
}
function clip(count: number, step = 20, flags = 0, type = 2) {
  const text = (v: string) => [...new TextEncoder().encode(v)];
  const ebml = el([0x1a, 0x45, 0xdf, 0xa3], el([0x42, 0x82], text("webm")));
  const tracks = el(
    [0x16, 0x54, 0xae, 0x6b],
    el(
      [0xae],
      [
        ...el([0xd7], [1]),
        ...el([0x83], [type]),
        ...el([0x86], text("A_OPUS")),
      ],
    ),
  );
  const blocks = Array.from({ length: count }, (_, i) => {
    const t = i * step;
    // CELT 20 ms, one frame per packet. A separate cluster keeps int16 offsets bounded.
    return el(
      [0x1f, 0x43, 0xb6, 0x75],
      [
        ...el([0xe7], [(t >> 16) & 255, (t >> 8) & 255, t & 255]),
        ...el([0xa3], [0x81, 0, 0, flags, 0x98, 0]),
      ],
    );
  }).flat();
  return new Uint8Array([
    ...ebml,
    0x18,
    0x53,
    0x80,
    0x67,
    0xff,
    ...tracks,
    ...blocks,
  ]);
}
it("counts Opus packets even without duration metadata", () => {
  expect(validateRecording(clip(50), "audio/webm")).toBe(1);
  expect(validateRecording(clip(9000), "audio/webm")).toBe(180);
  expect(validateRecording(clip(50, 17), "audio/webm")).toBe(1);
});
it("rejects excess packet duration and gaps beyond the limit", () => {
  expect(() => validateRecording(clip(9001), "audio/webm")).toThrow(
    "three minutes",
  );
  expect(() => validateRecording(clip(2, 180000), "audio/webm")).toThrow(
    "three minutes",
  );
});
it("fails closed on overlapping timing, lacing, video and unsupported containers", () => {
  expect(() => validateRecording(clip(50, 0), "audio/webm")).toThrow();
  expect(() => validateRecording(clip(1, 20, 2), "audio/webm")).toThrow();
  expect(() => validateRecording(clip(1, 20, 0, 1), "audio/webm")).toThrow();
  expect(() => validateRecording(clip(1), "audio/mp4")).toThrow();
  expect(() => validateRecording(clip(1).slice(0, -1), "audio/webm")).toThrow();
});
