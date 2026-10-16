import { it, expect, vi } from "vitest";
import { readFileSync } from "node:fs";
import { runInNewContext } from "node:vm";
it("cleans only old CashNarra caches and ignores private/query responses", async () => {
  const handlers: Record<string, (event: Record<string, unknown>) => void> = {};
  const remove = vi.fn(),
    put = vi.fn();
  const cache = { match: vi.fn().mockResolvedValue(undefined), put };
  runInNewContext(readFileSync("public/sw.js", "utf8"), {
    URL,
    self: {
      location: { origin: "http://localhost" },
      addEventListener: (name: string, handler: (typeof handlers)[string]) => {
        handlers[name] = handler;
      },
    },
    caches: {
      keys: async () => [
        "cashnarra-public-v1",
        "cashnarra-public-v2",
        "other-app",
      ],
      delete: remove,
      open: async () => cache,
    },
    fetch: async () =>
      new Response("private", {
        headers: { "cache-control": "private, no-store" },
      }),
  });
  let pending: Promise<unknown> | undefined;
  handlers.activate({
    waitUntil: (p: Promise<unknown>) => {
      pending = p;
    },
  });
  await pending;
  expect(remove.mock.calls).toEqual([["cashnarra-public-v1"]]);
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
});
