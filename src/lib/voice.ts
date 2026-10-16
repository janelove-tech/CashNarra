export function microphoneError(error: unknown): string {
  const name = error instanceof Error ? error.name : "";
  if (name === "NotAllowedError" || name === "SecurityError")
    return "Microphone access was not allowed. Allow it in your browser settings or type your story.";
  if (name === "NotFoundError")
    return "No microphone was found. Connect one or type your story.";
  if (name === "NotReadableError")
    return "The microphone could not be opened. Check whether another app is using it, then try again.";
  return "Recording could not start. Try again or type your story.";
}
export function transcriptText(result: unknown): string {
  if (
    !result ||
    typeof result !== "object" ||
    !("text" in result) ||
    typeof result.text !== "string" ||
    !result.text.trim() ||
    result.text.length > 12000
  )
    throw new Error(
      "No usable words came back. Try again or type the words yourself.",
    );
  return result.text;
}
