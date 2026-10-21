// Deliberately narrow: browser WebM with a single non-laced Opus audio track.
// Inspect packet durations as well as timestamps; container duration is untrusted.
import {
  FREE_VOICE_SECONDS,
  RECORDING_BYTES,
  RECORDING_SECONDS,
} from "../lib/recording-limits";
export function validateRecording(
  bytes: Uint8Array,
  mime: string,
  maxSeconds = RECORDING_SECONDS,
): number {
  const invalid = () =>
    new Error(
      "This recording cannot be safely verified. Keep a copy and use text instead.",
    );
  if (
    mime !== "audio/webm" ||
    bytes.length < 16 ||
    bytes.length > RECORDING_BYTES
  )
    throw invalid();
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  function vint(at: number, id = false) {
    if (at >= bytes.length || bytes[at] === 0) throw invalid();
    let width = 1;
    while (!(bytes[at] & (1 << (8 - width)))) width++;
    if (width > (id ? 4 : 8) || at + width > bytes.length) throw invalid();
    let value = id ? bytes[at] : bytes[at] & ((1 << (8 - width)) - 1);
    let unknown = !id && value === (1 << (8 - width)) - 1;
    for (let i = 1; i < width; i++) {
      value = value * 256 + bytes[at + i];
      unknown = unknown && bytes[at + i] === 255;
    }
    if (!unknown && !Number.isSafeInteger(value)) throw invalid();
    return { value, width, unknown };
  }
  function uint(start: number, end: number) {
    if (end <= start || end - start > 6) throw invalid();
    let result = 0;
    for (let at = start; at < end; at++) result = result * 256 + bytes[at];
    return result;
  }
  const text = (start: number, end: number) =>
    new TextDecoder().decode(bytes.subarray(start, end));
  let scale = 1000000,
    track = 0,
    tracks = 0,
    packets = 0,
    totalMs = 0,
    lastEndMs = 0;
  let ebml = false,
    segment = false,
    docType = false;
  function elements(
    start: number,
    end: number,
    visit: (id: number, a: number, b: number) => void,
  ) {
    let count = 0;
    for (let at = start; at < end;) {
      if (++count > 20000) throw invalid();
      const id = vint(at, true);
      at += id.width;
      const size = vint(at);
      at += size.width;
      // Streaming MediaRecorder may leave Segment and Cluster sizes unknown.
      if (size.unknown && ![0x18538067, 0x1f43b675].includes(id.value))
        throw invalid();
      let next = size.unknown ? end : at + size.value;
      if (size.unknown && id.value === 0x1f43b675) {
        let cursor = at;
        while (cursor < end) {
          const child = vint(cursor, true);
          if (child.value === 0x1f43b675 || child.value === 0x1c53bb6b) break;
          const length = vint(cursor + child.width);
          if (length.unknown) throw invalid();
          cursor += child.width + length.width + length.value;
          if (cursor > end) throw invalid();
        }
        next = cursor;
      }
      if (next > end || next < at) throw invalid();
      visit(id.value, at, next);
      at = next;
    }
  }
  function packetDuration(start: number, end: number) {
    if (end - start < 2) throw invalid();
    const toc = bytes[start],
      config = toc >> 3,
      code = toc & 3;
    const frameMs =
      config >= 16
        ? 2.5 * 2 ** (config & 3)
        : config >= 12
          ? 10 * 2 ** (config & 1)
          : (config & 3) === 3
            ? 60
            : 10 * 2 ** (config & 3);
    const frames = code === 0 ? 1 : code === 3 ? bytes[start + 1] & 63 : 2;
    const duration = frameMs * frames;
    if (!frames || duration > 120) throw invalid();
    return duration;
  }
  elements(0, bytes.length, (id, a, b) => {
    if (id === 0x1a45dfa3 && !ebml && !segment) {
      ebml = true;
      elements(a, b, (key, x, y) => {
        if (key === 0x4282) docType = text(x, y) === "webm";
      });
    } else if (id === 0x18538067 && ebml && docType && !segment) {
      segment = true;
      elements(a, b, (key, x, y) => {
        if (key === 0x1549a966) {
          if (packets) throw invalid();
          elements(x, y, (k, p, q) => {
            if (k === 0x2ad7b1) scale = uint(p, q);
          });
          if (scale <= 0 || scale > 1000000000) throw invalid();
        } else if (key === 0x1654ae6b) {
          if (tracks || packets) throw invalid();
          elements(x, y, (k, p, q) => {
            if (k !== 0xae) return;
            tracks++;
            let type = 0,
              codec = "";
            elements(p, q, (t, c, d) => {
              // Track-level scaling or content transforms need separate support.
              if (t === 0x23314f || t === 0x6d80) throw invalid();
              if (t === 0xd7) track = uint(c, d);
              if (t === 0x83) type = uint(c, d);
              if (t === 0x86) codec = text(c, d);
            });
            if (tracks !== 1 || type !== 2 || codec !== "A_OPUS" || !track)
              throw invalid();
          });
        } else if (key === 0x1f43b675) {
          if (tracks !== 1) throw invalid();
          let clusterTime: number | null = null;
          elements(x, y, (k, p, q) => {
            if (k === 0xe7) clusterTime = uint(p, q);
            else if (k === 0xa3) {
              if (clusterTime === null) throw invalid();
              const number = vint(p);
              const header = p + number.width;
              if (
                number.value !== track ||
                header + 3 >= q ||
                bytes[header + 2] & 6
              )
                throw invalid();
              const startMs =
                ((clusterTime + view.getInt16(header)) * scale) / 1000000;
              // Chromium packet timestamps can jitter by a few milliseconds.
              // Decoded packet duration is independently summed and capped below.
              if (startMs < 0 || (packets && startMs < lastEndMs - 5))
                throw invalid();
              const duration = packetDuration(header + 3, q);
              totalMs += duration;
              lastEndMs = startMs + duration;
              packets++;
              if (totalMs > maxSeconds * 1000 || lastEndMs > maxSeconds * 1000)
                throw new Error(
                  maxSeconds > FREE_VOICE_SECONDS
                    ? "That recording is over two minutes. Try a shorter clip."
                    : "That recording is over one minute. Try a shorter clip.",
                );
            } else if (k !== 0xec && k !== 0xbf) throw invalid();
          });
        }
      });
    } else if (id !== 0xec && id !== 0xbf) throw invalid();
  });
  if (!segment || !packets || totalMs <= 0) throw invalid();
  return Math.max(totalMs, lastEndMs) / 1000;
}
