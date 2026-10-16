import { expect, it } from "vitest";
import { boundedFormData } from "../src/server/upload";

it("reads a bounded multipart recording without trusting Content-Length", async () => {
  const form = new FormData();
  form.set("workspaceId", "owned-workspace");
  form.set(
    "clip",
    new File(["synthetic audio bytes"], "clip.webm", { type: "audio/webm" }),
  );
  const request = new Request("http://localhost/upload", {
    method: "POST",
    body: form,
  });
  const parsed = await boundedFormData(request, 4096);
  expect(parsed.get("workspaceId")).toBe("owned-workspace");
  expect(await (parsed.get("clip") as File).text()).toBe(
    "synthetic audio bytes",
  );
});

it.each([undefined, "1"])(
  "cancels an oversized stream with declared length %s",
  async (length) => {
    let cancelled = false;
    const body = new ReadableStream<Uint8Array>({
      pull(controller) {
        controller.enqueue(new Uint8Array(64));
      },
      cancel() {
        cancelled = true;
      },
    });
    const headers: Record<string, string> = {
      "content-type": "multipart/form-data; boundary=test",
    };
    if (length) headers["content-length"] = length;
    const request = new Request("http://localhost/upload", {
      method: "POST",
      body,
      headers,
      duplex: "half",
    } as RequestInit);
    await expect(boundedFormData(request, 100)).rejects.toThrow("too large");
    expect(cancelled).toBe(true);
  },
);

it("rejects malformed multipart input with a recoverable message", async () => {
  const request = new Request("http://localhost/upload", {
    method: "POST",
    body: "broken",
    headers: { "content-type": "multipart/form-data; boundary=absent" },
  });
  await expect(boundedFormData(request, 100)).rejects.toThrow("retried");
});
