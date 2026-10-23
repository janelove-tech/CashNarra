import { it, expect, vi } from "vitest";
import { readFileSync } from "node:fs";
import { runInNewContext } from "node:vm";
it("cleans only old CashNarra caches and ignores private/query responses", async () => {
  const handlers: Record<string, (event: Record<string, unknown>) => void> = {};
  const remove = vi.fn(),
    put = vi.fn(),
    skipWaiting = vi.fn(),
    offline = new Response("<h1>You’re offline right now.</h1>");
  const cache = {
    match: vi.fn(async (request: Request | string) =>
      request === "/offline" ? offline : undefined,
    ),
    put,
    addAll: vi.fn(async () => undefined),
  };
  let online = true;
  runInNewContext(readFileSync("public/sw.js", "utf8"), {
    URL,
    Response,
    self: {
      location: { origin: "http://localhost" },
      addEventListener: (name: string, handler: (typeof handlers)[string]) => {
        handlers[name] = handler;
      },
      skipWaiting,
      clients: { claim: async () => undefined },
    },
    caches: {
      keys: async () => [
        "cashnarra-public-v1",
        "cashnarra-public-v2",
        "cashnarra-public-v3",
        "other-app",
      ],
      delete: remove,
      open: async () => cache,
    },
    fetch: async () => {
      if (!online) throw new TypeError("Failed to fetch");
      return new Response("private", {
        headers: { "cache-control": "private, no-store" },
      });
    },
  });
  let pending: Promise<unknown> | undefined;
  handlers.activate({
    waitUntil: (p: Promise<unknown>) => {
      pending = p;
    },
  });
  await pending;
  expect(remove.mock.calls).toEqual([
    ["cashnarra-public-v1"],
    ["cashnarra-public-v2"],
    ["cashnarra-public-v3"],
  ]);
  handlers.install({
    waitUntil: (p: Promise<unknown>) => {
      pending = p;
    },
  });
  await pending;
  expect(cache.addAll).toHaveBeenCalledWith(
    expect.arrayContaining(["/offline"]),
  );
  // An update never applies itself; only the app's message does.
  expect(skipWaiting).not.toHaveBeenCalled();
  handlers.message({ data: "SKIP_WAITING" });
  expect(skipWaiting).toHaveBeenCalledTimes(1);
  const respond = vi.fn((p: Promise<unknown>) => {
    pending = p;
  });
  for (const url of [
    "http://localhost/api/workspaces",
    "http://localhost/brand/icon.svg?token=x",
    "https://other.test/brand/icon.svg",
  ])
    handlers.fetch({ request: new Request(url), respondWith: respond });
  expect(respond).not.toHaveBeenCalled();
  handlers.fetch({
    request: new Request("http://localhost/brand/icon.svg"),
    respondWith: respond,
  });
  await pending;
  expect(put).not.toHaveBeenCalled();
  // A page navigation is served from the network while it works…
  const navigation = () => {
    // Node's Request refuses mode "navigate"; the worker only reads it.
    const request = new Request("http://localhost/app?view=records");
    Object.defineProperty(request, "mode", { value: "navigate" });
    return request;
  };
  handlers.fetch({ request: navigation(), respondWith: respond });
  expect(await (pending as Promise<Response>).then((r) => r.text())).toBe(
    "private",
  );
  expect(put).not.toHaveBeenCalled();
  // …and only when the network fails does the offline page appear.
  online = false;
  handlers.fetch({ request: navigation(), respondWith: respond });
  expect(await pending).toBe(offline);
});
