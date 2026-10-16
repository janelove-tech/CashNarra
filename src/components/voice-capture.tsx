"use client";
import { useEffect, useRef, useState } from "react";
import { Button } from "./ui";
import s from "./app.module.css";
import { microphoneError, transcriptText } from "@/lib/voice";
export default function VoiceCapture({
  workspaceId,
  onTranscript,
  transcriptionEnabled,
}: {
  workspaceId: string;
  onTranscript: (text: string) => void;
  transcriptionEnabled: boolean;
}) {
  const recorder = useRef<MediaRecorder | null>(null),
    stream = useRef<MediaStream | null>(null),
    timer = useRef<ReturnType<typeof setInterval> | null>(null),
    started = useRef(0),
    cancelled = useRef(false),
    mounted = useRef(true);
  const requesting = useRef(false);
  const permissionRevision = useRef(0);
  const upload = useRef<AbortController | null>(null);
  const [replace, setReplace] = useState(false);
  const [waiting, setWaiting] = useState(false);
  const [recording, setRecording] = useState(false),
    [seconds, setSeconds] = useState(0),
    [clip, setClip] = useState<Blob | null>(null),
    [url, setUrl] = useState(""),
    [text, setText] = useState(""),
    [error, setError] = useState(""),
    [busy, setBusy] = useState(false);
  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
      cancelled.current = true;
      upload.current?.abort();
      if (recorder.current?.state === "recording") recorder.current.stop();
      stream.current?.getTracks().forEach((t) => t.stop());
      if (timer.current) clearInterval(timer.current);
    };
  }, []);
  useEffect(() => {
    if (!clip && !text && !recording) return;
    const warn = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = "";
    };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [clip, text, recording]);
  useEffect(
    () => () => {
      if (url) URL.revokeObjectURL(url);
    },
    [url],
  );
  function stop(cancel = false) {
    cancelled.current = cancel;
    if (recorder.current?.state === "recording") recorder.current.stop();
    stream.current?.getTracks().forEach((t) => t.stop());
    if (timer.current) clearInterval(timer.current);
    setRecording(false);
    if (cancel) {
      setClip(null);
      setUrl("");
    }
  }
  async function start() {
    if (requesting.current || recording || busy) return;
    requesting.current = true;
    const attempt = ++permissionRevision.current;
    setWaiting(true);
    setError("");
    try {
      if (
        !navigator.mediaDevices?.getUserMedia ||
        typeof MediaRecorder === "undefined"
      )
        throw new Error("This browser cannot record. Type your story instead.");
      const mime = ["audio/webm;codecs=opus"].find((x) =>
        MediaRecorder.isTypeSupported(x),
      );
      if (!mime)
        throw new Error(
          "No supported recording format. Type your story instead.",
        );
      const media = await navigator.mediaDevices.getUserMedia({ audio: true });
      if (!mounted.current || attempt !== permissionRevision.current) {
        media.getTracks().forEach((t) => t.stop());
        return;
      }
      stream.current = media;
      const rec = new MediaRecorder(media, {
        mimeType: mime,
        audioBitsPerSecond: 64000,
      });
      recorder.current = rec;
      const chunks: Blob[] = [];
      let size = 0;
      cancelled.current = false;
      setClip(null);
      setSeconds(0);
      rec.ondataavailable = (e) => {
        size += e.data.size;
        if (size > 3 * 1024 * 1024) {
          cancelled.current = true;
          stop(true);
          setError("Recording exceeded 3 MB. Try a shorter story.");
        } else chunks.push(e.data);
      };
      rec.onstop = () => {
        media.getTracks().forEach((track) => track.stop());
        if (timer.current) clearInterval(timer.current);
        if (mounted.current) setRecording(false);
        if (!cancelled.current && mounted.current) {
          const blob = new Blob(chunks, { type: mime.split(";")[0] });
          if (!blob.size) {
            setError(
              "No sound was captured. Try recording again or type your story.",
            );
            return;
          }
          setClip(blob);
          setUrl(URL.createObjectURL(blob));
        }
      };
      rec.onerror = () => {
        stop(true);
        setError("Recording failed. You can type your story.");
      };
      rec.start(250);
      started.current = Date.now();
      setRecording(true);
      timer.current = setInterval(() => {
        const elapsed = Math.floor((Date.now() - started.current) / 1000);
        setSeconds(Math.min(60, elapsed));
        if (elapsed >= 60) stop();
      }, 250);
    } catch (e) {
      if (attempt === permissionRevision.current)
        stream.current?.getTracks().forEach((t) => t.stop());
      if (mounted.current && attempt === permissionRevision.current)
        setError(microphoneError(e));
    } finally {
      if (attempt === permissionRevision.current) {
        requesting.current = false;
        if (mounted.current) setWaiting(false);
      }
    }
  }
  async function transcribe() {
    if (!clip || !transcriptionEnabled || upload.current) return;
    if (!navigator.onLine) {
      setError(
        "You are offline. Keep this clip and try transcription when you are connected.",
      );
      return;
    }
    const controller = new AbortController();
    upload.current = controller;
    const deadline = setTimeout(() => controller.abort(), 55000);
    setBusy(true);
    setError("");
    try {
      const data = new FormData();
      data.set("workspaceId", workspaceId);
      data.set(
        "clip",
        clip,
        clip.type === "audio/mp4" ? "story.m4a" : "story.webm",
      );
      data.set("seconds", String(seconds));
      const response = await fetch("/api/transcribe", {
        method: "POST",
        body: data,
        signal: controller.signal,
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error);
      const words = transcriptText(result);
      if (mounted.current && !controller.signal.aborted) setText(words);
    } catch {
      if (mounted.current)
        setError(
          (controller.signal.aborted
            ? "Transcription stopped. The provider may already have received the clip."
            : "Transcription did not finish. Try again or type the words yourself.") +
            " Your recording is still here for playback or download.",
        );
    } finally {
      clearTimeout(deadline);
      upload.current = null;
      if (mounted.current) setBusy(false);
    }
  }
  return (
    <>
      <p>
        Up to 60 seconds and 3 MB. Recording starts only when you choose Start.
        Your clip stays on this device unless you choose to send it for
        transcription or share a downloaded copy.
      </p>
      {!transcriptionEnabled && (
        <p>
          Recording and playback are available. Automatic transcription is not
          enabled here yet. You can keep a private copy, or type the words
          below.
        </p>
      )}
      {transcriptionEnabled && (
        <p>
          Transcription sends this clip to OpenAI. Review the words before
          continuing.
        </p>
      )}
      <p role="status">
        {recording
          ? `Recording · ${seconds} / 60 seconds`
          : busy
            ? "Transcribing…"
            : waiting
              ? "Waiting for microphone permission…"
              : "Microphone is off."}
      </p>
      <div className={s.actions}>
        {!recording && (
          <Button
            onClick={() => (clip ? setReplace(true) : void start())}
            disabled={busy || waiting}
          >
            {clip ? "Record again" : "Start recording"}
          </Button>
        )}
        {recording && (
          <>
            <Button primary onClick={() => stop()}>
              Stop recording
            </Button>
            <Button onClick={() => stop(true)}>Cancel recording</Button>
          </>
        )}
      </div>
      {waiting && (
        <Button
          onClick={() => {
            permissionRevision.current++;
            requesting.current = false;
            setWaiting(false);
            setError(
              "Permission request cancelled here. If the browser still asks, choose Block. Any late microphone access will be stopped.",
            );
          }}
        >
          Cancel microphone request
        </Button>
      )}
      {replace && (
        <section aria-label="Replace recording">
          <p>
            Download the current clip first if you want to keep it. Your typed
            words will stay.
          </p>
          <Button
            onClick={() => {
              setReplace(false);
              void start();
            }}
          >
            Replace clip and record
          </Button>
          <Button onClick={() => setReplace(false)}>Keep current clip</Button>
        </section>
      )}
      {busy && (
        <Button onClick={() => upload.current?.abort()}>
          Stop waiting for transcription
        </Button>
      )}
      {clip && url && (
        <>
          <audio
            controls
            src={url}
            aria-label="Play your recorded story"
            style={{ maxWidth: "100%" }}
          />
          <p>
            {seconds} seconds · {Math.ceil(clip.size / 1024)} KB · WebM audio
          </p>
          <p>
            <a
              href={url}
              download={
                clip.type === "audio/mp4"
                  ? "CashNarra-story.m4a"
                  : "CashNarra-story.webm"
              }
            >
              Keep a private copy of this clip
            </a>
          </p>
          {transcriptionEnabled && (
            <Button
              primary
              onClick={transcribe}
              disabled={busy || !!text.trim()}
            >
              Transcribe recording
            </Button>
          )}
          {transcriptionEnabled && text.trim() && (
            <p>
              There are already words in the editor. Keep a copy and clear them
              before requesting another transcript.
            </p>
          )}
          <Button disabled={busy} onClick={() => stop(true)}>
            Discard this clip
          </Button>
        </>
      )}
      {(clip || text) && (
        <>
          <label htmlFor="voice-transcript">
            {transcriptionEnabled
              ? "Review and edit your transcript"
              : "Type the words from your recording"}
          </label>
          <textarea
            id="voice-transcript"
            value={text}
            onChange={(e) => setText(e.target.value)}
            maxLength={12000}
            disabled={busy}
          />
          <p>
            {text.length} / 12,000 characters. Typed words stay when you discard
            or replace a clip.
          </p>
          {text.trim() && (
            <Button
              onClick={() => {
                const link = document.createElement("a");
                const address = URL.createObjectURL(
                  new Blob([text], { type: "text/plain;charset=utf-8" }),
                );
                link.href = address;
                link.download = "CashNarra-private-words.txt";
                link.click();
                setTimeout(() => URL.revokeObjectURL(address), 1000);
              }}
            >
              Download these words
            </Button>
          )}
          <Button
            primary
            disabled={!text.trim() || busy}
            onClick={() => onTranscript(text.trim())}
          >
            Use reviewed words
          </Button>
        </>
      )}
      <p role="alert">{error}</p>
      <p className={s.notice}>
        Download any clip you want to keep before closing this recording window.
        Failed transcription does not save financial records.
      </p>
    </>
  );
}
