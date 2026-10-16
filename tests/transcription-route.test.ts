import { beforeEach, afterEach, it, expect, vi } from "vitest";
const f = vi.hoisted(() => ({
  create: vi.fn(),
  get: vi.fn(),
  reserve: vi.fn(),
  validate: vi.fn(),
  form: vi.fn(),
}));
vi.mock("openai", () => ({
  default: class {
    audio = { transcriptions: { create: f.create } };
  },
}));
vi.mock("../src/server/auth", () => ({
  sameOrigin: vi.fn(),
  context: async () => ({ demo: false, db: { rpc: f.reserve } }),
}));
vi.mock("../src/server/store", () => ({ get: f.get }));
vi.mock("../src/server/recording", () => ({ validateRecording: f.validate }));
vi.mock("../src/server/upload", () => ({ boundedFormData: f.form }));
import { POST } from "../src/app/api/transcribe/route";
beforeEach(() => {
  vi.resetAllMocks();
  vi.stubEnv("VOICE_ENABLED", "true");
  vi.stubEnv("VOICE_QUALITY_APPROVED", "true");
  vi.stubEnv("OPENAI_API_KEY", "synthetic-test-not-a-key");
  f.reserve.mockResolvedValue({ error: null });
  f.create.mockResolvedValue({ text: "Synthetic reviewed words" });
  const data = new FormData();
  data.set("workspaceId", "owned");
  data.set("seconds", "1");
  data.set(
    "clip",
    new File(
      ["fixture bytes; container validator separately tested"],
      "clip.webm",
      { type: "audio/webm" },
    ),
  );
  f.form.mockResolvedValue(data);
});
afterEach(() => vi.unstubAllEnvs());
it("returns only editable text and propagates cancellation to the provider adapter", async () => {
  const request = new Request("http://localhost/api/transcribe", {
    method: "POST",
  });
  const result = await POST(request);
  expect(await result.json()).toEqual({ text: "Synthetic reviewed words" });
  expect(f.get).toHaveBeenCalledWith(expect.anything(), "owned");
  expect(f.create.mock.calls[0][1].signal).toBe(request.signal);
});
it("rejects foreign workspaces before reserving budget or calling the provider", async () => {
  f.get.mockRejectedValue(new Error("Workspace unavailable"));
  expect(
    (await POST(new Request("http://localhost", { method: "POST" }))).status,
  ).toBe(422);
  expect(f.reserve).not.toHaveBeenCalled();
  expect(f.create).not.toHaveBeenCalled();
});
it.each([{}, { text: "" }, { text: 10 }, { text: "a".repeat(12001) }])(
  "fails closed for malformed transcript %#",
  async (output) => {
    f.create.mockResolvedValue(output);
    expect(
      (await POST(new Request("http://localhost", { method: "POST" }))).status,
    ).toBe(422);
  },
);
it("does not process an aborted request", async () => {
  const abort = new AbortController();
  abort.abort();
  expect(
    (
      await POST(
        new Request("http://localhost", {
          method: "POST",
          signal: abort.signal,
        }),
      )
    ).status,
  ).toBe(422);
  expect(f.create).not.toHaveBeenCalled();
});
