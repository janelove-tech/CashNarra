import { expect, test } from "@playwright/test";

test("a signed-out visitor cannot read private workspaces", async ({ request }) => {
  const result = await request.get("/api/workspaces");
  expect(result.status()).toBe(401);
  const body = await result.json();
  expect(body).not.toHaveProperty("workspaces");
});

test("missing or foreign origins cannot create a demo session", async ({ request }) => {
  for (const origin of [null, "https://untrusted.example.test"]) {
    const options: { headers?: Record<string, string> } = {};
    if (origin) options.headers = { Origin: origin };
    const result = await request.post("/api/demo", options);
    expect(result.status()).toBe(403);
    expect(result.headers()["set-cookie"]).toBeUndefined();
  }
});

test("a same-origin explicit demo request remains available", async ({ request }) => {
  const result = await request.post("/api/demo", {
    headers: { Origin: "http://127.0.0.1:3100" },
  });
  expect(result.status()).toBe(200);
  expect((await result.json()).ok).toBe(true);
  expect(result.headers()["set-cookie"]).toContain("HttpOnly");
});

test("a foreign origin cannot mutate records even with a demo session", async ({ request }) => {
  const session = await request.post("/api/demo", {
    headers: { Origin: "http://127.0.0.1:3100" },
  });
  expect(session.status()).toBe(200);

  const forbidden = await request.post("/api/workspaces", {
    headers: { Origin: "https://untrusted.example.test" },
    data: { action: "create", name: "Must not exist" },
  });
  expect(forbidden.status()).toBe(409);
  expect((await forbidden.json()).error).toContain("origin is not allowed");
});
