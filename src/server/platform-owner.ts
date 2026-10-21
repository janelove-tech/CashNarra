import type { Context } from "@/server/store";

const userIdPattern =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export function platformOwnerIds(
  raw = process.env.CASHNARRA_PLATFORM_OWNER_IDS ?? "",
) {
  return raw
    .split(",")
    .map((value) => value.trim())
    .filter((value) => userIdPattern.test(value));
}

/** Server allowlist only. Demo sessions and account metadata are not a role. */
export function platformOwnerAllowed(input: {
  userId: string | null;
  demo: boolean;
  allowlist: readonly string[];
}) {
  if (input.demo || !input.userId) return false;
  return input.allowlist.includes(input.userId);
}

export function platformOwnerFromContext(
  ctx: Pick<Context, "userId" | "demo">,
  allowlist = platformOwnerIds(),
) {
  return platformOwnerAllowed({
    userId: ctx.userId,
    demo: ctx.demo,
    allowlist,
  });
}
