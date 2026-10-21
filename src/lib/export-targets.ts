export type ExportScope = "this" | "another" | "all";

/** A safe filename piece. Empty names become "workspace". */
export function exportFileMark(name: string) {
  const slug = name
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^A-Za-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40);
  return slug || "workspace";
}

/**
 * Which saved workspaces a download covers.
 * "This" keeps the existing filename. The others get a short name so
 * several downloads do not overwrite one another. Ledgers are never combined.
 */
export function exportFileTargets(
  currentId: string,
  summaries: { id: string; name: string }[],
  scope: ExportScope,
  otherId: string,
  hidden: boolean,
): { id: string; mark?: string }[] {
  const list =
    scope === "this"
      ? summaries.filter((item) => item.id === currentId)
      : scope === "another"
        ? summaries.filter(
            (item) => item.id === otherId && item.id !== currentId,
          )
        : summaries;
  if (scope === "this" && list.length !== 1)
    throw new Error("This workspace could not be exported.");
  if (scope === "another" && list.length !== 1)
    throw new Error("Choose another workspace.");
  if (!list.length) throw new Error("Choose a workspace.");
  if (scope === "this") return list.map((item) => ({ id: item.id }));
  const seen = new Map<string, number>();
  return list.map((item) => {
    const base = hidden ? "workspace" : exportFileMark(item.name);
    const count = (seen.get(base) ?? 0) + 1;
    seen.set(base, count);
    return {
      id: item.id,
      mark: count === 1 ? base : `${base}-${count}`,
    };
  });
}
