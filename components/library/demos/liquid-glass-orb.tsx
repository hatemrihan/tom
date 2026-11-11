"use client";

import { useEffect, useRef, useState } from "react";
import { LiquidGlassOrb, type OrbState } from "../liquid-glass-orb/liquid-glass-orb";

const STATES: OrbState[] = ["idle", "listening", "thinking", "speaking"];
const TRACK = { src: "/audio/satie-gymnopedie-1.mp3", title: "Satie, Gymnopédie No. 1" };

/** A short phrase of soft tones: the orb's own voice, instead of a robot reading text. */
const PHRASE = [523.25, 659.25, 587.33, 783.99, 659.25, 880, 783.99, 659.25, 698.46, 523.25];

export default function LiquidGlassOrbDemo() {
  const [state, setState] = useState<OrbState>("idle");
  const [level, setLevel] = useState(0);
  const [note, setNote] = useState("");
  const audio = useRef<HTMLAudioElement>(null);
  const ctxRef = useRef<AudioContext | null>(null);
  const musicNode = useRef<AnalyserNode | null>(null);

  useEffect(() => {
    const el = audio.current;
    if (!el || state === "idle") return;

    const ctx = (ctxRef.current ??= new AudioContext());
    void ctx.resume();
    const analyser = ctx.createAnalyser();
    analyser.fftSize = 256;
    const data = new Uint8Array(analyser.frequencyBinCount);
    const cleanup: (() => void)[] = [];
    let alive = true;

    // The orb follows whatever is feeding the analyser.
    let frame = requestAnimationFrame(function follow() {
      frame = requestAnimationFrame(follow);
      analyser.getByteFrequencyData(data);
      const loud = data.reduce((sum, v) => sum + v, 0) / (data.length * 255);
      setLevel((prev) => prev + (Math.min(1, loud * 3.5) - prev) * 0.3);
    });
    cleanup.push(() => cancelAnimationFrame(frame));

    if (state === "listening") {
      // Real listening: your microphone. Nothing is recorded or sent anywhere.
      navigator.mediaDevices
        ?.getUserMedia({ audio: true })
        .then((stream) => {
          if (!alive) return stream.getTracks().forEach((t) => t.stop());
          const source = ctx.createMediaStreamSource(stream);
          source.connect(analyser);
          setNote("Say something, it moves with your voice");
          cleanup.push(() => {
            source.disconnect();
            stream.getTracks().forEach((t) => t.stop());
          });
        })
        .catch(() => alive && setNote("Microphone blocked, so it cannot hear you"));
    }

    if (state === "thinking") {
      // Thinks to music, quietly.
      if (!musicNode.current) {
        musicNode.current = ctx.createAnalyser();
        ctx.createMediaElementSource(el).connect(musicNode.current);
        musicNode.current.connect(ctx.destination);
      }
      const music = musicNode.current;
      music.connect(analyser);
      el.volume = 0.5;
      el.play().catch(() => {});
      cleanup.push(() => {
        el.pause();
        music.disconnect(analyser);
      });
    }

    if (state === "speaking") {
      // A gentle run of sine tones with soft attack and release.
      const out = ctx.createGain();
      out.gain.value = 0.12;
      out.connect(analyser);
      out.connect(ctx.destination);
      const start = ctx.currentTime + 0.05;
      PHRASE.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const env = ctx.createGain();
        const t = start + i * 0.19;
        osc.type = "sine";
        osc.frequency.value = freq;
        env.gain.setValueAtTime(0, t);
        env.gain.linearRampToValueAtTime(1, t + 0.03);
        env.gain.exponentialRampToValueAtTime(0.001, t + 0.26);
        osc.connect(env).connect(out);
        osc.start(t);
        osc.stop(t + 0.3);
      });
      const timer = setTimeout(() => alive && setState("idle"), PHRASE.length * 190 + 500);
      cleanup.push(() => {
        clearTimeout(timer);
        out.disconnect();
      });
    }

    return () => {
      alive = false;
      cleanup.forEach((fn) => fn());
      analyser.disconnect();
    };
  }, [state]);

  const caption =
    state === "idle"
      ? "Pick a state"
      : state === "listening"
        ? note || "Asking for your microphone"
        : state === "thinking"
          ? `Thinking to ${TRACK.title}`
          : "Speaking in tones";

  return (
    <div className="flex flex-col items-center gap-7 text-[11px] font-medium uppercase tracking-[0.01em]">
      <audio ref={audio} src={TRACK.src} loop preload="none" />
      <LiquidGlassOrb state={state} level={state === "idle" ? 0 : level} />
      <div className="flex gap-5">
        {STATES.map((s) => (
          <button
            key={s}
            type="button"
            aria-pressed={s === state}
            onClick={() => {
              setNote("");
              setState(s);
            }}
            className={`cursor-pointer uppercase outline-none transition-colors focus-visible:underline ${
              s === state ? "text-neutral-900 underline underline-offset-4 dark:text-white" : "text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
            }`}
          >
            {s}
          </button>
        ))}
      </div>
      <p className="-mt-4 font-normal text-neutral-400" aria-live="polite">
        {caption}
      </p>
    </div>
  );
}
