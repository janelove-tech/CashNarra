function mentioned(story: string, label: string) {
  const needle = label.trim().toLowerCase();
  if (needle.length < 2) return false;
  let from = 0;
  while (from < story.length) {
    const at = story.indexOf(needle, from);
    if (at < 0) return false;
    const before = at === 0 ? " " : story[at - 1];
    const after = story[at + needle.length] ?? " ";
    if (!/[a-z0-9]/i.test(before) && !/[a-z0-9]/i.test(after)) return true;
    from = at + needle.length;
  }
  return false;
}
export function mentionFirst<T>(
  items: T[],
  text: string,
  limit: number,
  label: (item: T) => string,
) {
  const story = text.toLowerCase();
  const named = items.filter((item) => mentioned(story, label(item)));
  const rest = items.filter((item) => !named.includes(item));
  const selected = [...named, ...rest].slice(0, limit);
  return {
    selected,
    omitted: selected.length < items.length,
  };
}
