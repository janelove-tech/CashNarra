/** Bound the actual stream, including multipart overhead, before parsing it.
 * Content-Length is advisory: chunked or dishonest requests get the same limit.
 */
export async function boundedFormData(req: Request, maximum: number) {
  const contentType = req.headers.get("content-type") ?? "";
  if (!contentType.toLowerCase().startsWith("multipart/form-data;"))
    throw new Error("Send a supported recording upload.");
  const declared = req.headers.get("content-length");
  if (
    declared !== null &&
    (!/^\d+$/.test(declared) || Number(declared) > maximum)
  )
    throw new Error("Recording upload is too large.");
  if (!req.body) throw new Error("Recording upload is empty.");
  const reader = req.body.getReader();
  const chunks: Uint8Array<ArrayBuffer>[] = [];
  let size = 0;
  try {
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > maximum) {
        await reader.cancel().catch(() => {});
        throw new Error("Recording upload is too large.");
      }
      chunks.push(new Uint8Array(value));
    }
  } finally {
    reader.releaseLock();
  }
  try {
    return await new Response(new Blob(chunks), {
      headers: { "content-type": contentType },
    }).formData();
  } catch {
    throw new Error(
      "Recording upload could not be read. Your clip can be retried.",
    );
  }
}
