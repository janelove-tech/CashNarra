/** Bound bytes before JSON parsing, including requests without Content-Length. */
export async function boundedJson(req: Request, maximum = 100000) {
  const reader = req.body?.getReader();
  if (!reader) throw new Error("Request body is required.");
  const chunks: Uint8Array<ArrayBuffer>[] = [];
  let size = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > maximum) {
        await reader.cancel().catch(() => {});
        throw new Error("Request too large.");
      }
      chunks.push(new Uint8Array(value));
    }
  } finally {
    reader.releaseLock();
  }
  try {
    const value = JSON.parse(await new Blob(chunks).text());
    if (!value || typeof value !== "object" || Array.isArray(value))
      throw new Error();
    return value;
  } catch {
    throw new Error("Send a valid request object.");
  }
}
