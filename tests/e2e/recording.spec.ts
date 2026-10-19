import { test, expect } from "@playwright/test";
import { validateRecording } from "../../src/server/recording";
test("offers real local recording without claiming transcription or opening the microphone", async ({
  page,
}) => {
  const uploads: string[] = [];
  page.on("request", (req) => {
    if (req.url().includes("/api/transcribe")) uploads.push(req.url());
  });
  await page.goto("/");
  await page.getByRole("button", { name: "Explore with sample data" }).click();
  await page.getByRole("button", { name: "Voice", exact: true }).click();
  const dialog = page.getByRole("dialog", {
    name: "A short story, in your voice",
  });
  await expect(
    dialog.getByRole("button", { name: "Start recording", exact: true }),
  ).toBeEnabled();
  await expect(
    dialog.getByText("Microphone is off.", { exact: true }),
  ).toBeVisible();
  await expect(
    dialog.getByText(/Automatic transcription is not enabled here yet/),
  ).toBeVisible();
  await expect(
    dialog.getByRole("button", { name: "Transcribe recording", exact: true }),
  ).toHaveCount(0);
  await dialog
    .getByRole("button", { name: "Type your story", exact: true })
    .click();
  await expect(
    page.getByLabel("Your money story", { exact: true }),
  ).toBeVisible();
  expect(uploads).toEqual([]);
});

test("validates actual browser-generated Opus without accessing a microphone", async ({
  page,
}) => {
  await page.goto("/");
  const bytes = await page.evaluate(async () => {
    const audio = new AudioContext();
    const oscillator = audio.createOscillator();
    const output = audio.createMediaStreamDestination();
    oscillator.connect(output);
    oscillator.start();
    await audio.resume();
    const recorder = new MediaRecorder(output.stream, {
      mimeType: "audio/webm;codecs=opus",
      audioBitsPerSecond: 64000,
    });
    const chunks: Blob[] = [];
    recorder.ondataavailable = (e) => chunks.push(e.data);
    const finished = new Promise<void>((resolve) => {
      recorder.onstop = () => resolve();
    });
    recorder.start(250);
    await new Promise((resolve) => setTimeout(resolve, 1200));
    recorder.stop();
    await finished;
    oscillator.stop();
    output.stream.getTracks().forEach((t) => t.stop());
    await audio.close();
    return Array.from(new Uint8Array(await new Blob(chunks).arrayBuffer()));
  });
  const seconds = validateRecording(new Uint8Array(bytes), "audio/webm");
  expect(seconds).toBeGreaterThan(0.5);
  expect(seconds).toBeLessThan(3);
});
