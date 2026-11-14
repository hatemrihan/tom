import { WordsPreloader, wordsPreloaderTimeline } from "@/components/library/words-preloader/words-preloader";
import type { Media, MotionSpec } from "../types";

type V = {
  words: string[];
  size: number;
  onColor: string;
  label: string;
  count: boolean;
  color: string;
  curve: number;
  first: number;
  pace: number;
  hold: number;
  lift: number;
  media: Media | null;
  title: string;
  pageColor: string;
  pageInk: string;
  after: number;
};

const defaults: V = {
  words: ["Hello", "أهلاً", "Bonjour", "Ciao", "Hola", "こんにちは", "Hallo", "Olá"],
  size: 88,
  onColor: "#1c1917",
  label: "Loading",
  count: true,
  color: "#e7e2d9",
  curve: 0.3,
  first: 1000,
  pace: 180,
  hold: 500,
  lift: 900,
  media: null,
  title: "Components, in code and in motion.",
  pageColor: "#ffffff",
  pageInk: "#1c1917",
  after: 1400,
};

const timeline = (v: V) => wordsPreloaderTimeline({ words: v.words.length, first: v.first, pace: v.pace, hold: v.hold, lift: v.lift });

const q = (s: string) => JSON.stringify(s);
const dartString = (s: string) => `'${s.replace(/[\\'$]/g, (c) => `\\${c}`)}'`;
const dartColor = (hex: string) => `Color(0xFF${hex.replace("#", "").toUpperCase().padEnd(6, "0").slice(0, 6)})`;

export const wordsPreloader: MotionSpec<V> = {
  defaults,

  layers: [
    { id: "words", name: "Words", kind: "text" },
    { id: "label", name: "Label", kind: "text" },
    { id: "cover", name: "Cover", kind: "shape" },
    { id: "page", name: "Page", kind: "media" },
  ],

  fields: [
    { key: "words", label: "Words", layer: "words", group: "design", type: "list", hint: "One on each line" },
    { key: "size", label: "Size", layer: "words", group: "design", type: "number", min: 24, max: 200, step: 1, unit: "px" },
    { key: "onColor", label: "Colour", layer: "words", group: "design", type: "color" },
    { key: "first", label: "First word", layer: "words", group: "animate", type: "number", min: 200, max: 3000, step: 10, unit: "ms" },
    { key: "pace", label: "Each word after", layer: "words", group: "animate", type: "number", min: 60, max: 1000, step: 10, unit: "ms" },
    { key: "hold", label: "Last word", layer: "words", group: "animate", type: "number", min: 100, max: 3000, step: 10, unit: "ms" },

    { key: "label", label: "Label", layer: "label", group: "design", type: "text" },
    { key: "count", label: "Show the count", layer: "label", group: "design", type: "toggle" },

    { key: "color", label: "Colour", layer: "cover", group: "design", type: "color" },
    { key: "lift", label: "Lift", layer: "cover", group: "animate", type: "number", min: 200, max: 3000, step: 10, unit: "ms" },
    { key: "curve", label: "Bow of the edge", layer: "cover", group: "animate", type: "number", min: 0, max: 1, step: 0.01 },

    { key: "media", label: "Image or video", layer: "page", group: "design", type: "media" },
    { key: "title", label: "Title", layer: "page", group: "design", type: "text" },
    { key: "pageInk", label: "Title colour", layer: "page", group: "design", type: "color" },
    { key: "pageColor", label: "Background", layer: "page", group: "design", type: "color" },
    { key: "after", label: "Stays on after", layer: "page", group: "animate", type: "number", min: 0, max: 6000, step: 50, unit: "ms" },
  ],

  duration: (v) => timeline(v).total + v.after,

  tracks: (v) => {
    const { starts, liftAt, total } = timeline(v);
    const last = starts[starts.length - 1];
    const words =
      v.words.length > 1
        ? [
            { label: "First", start: 0, end: v.first, field: "first" },
            ...(v.words.length > 2 ? [{ label: `${v.words.length - 2} more`, start: v.first, end: last, field: "pace", per: v.words.length - 2 }] : []),
            { label: "Last", start: last, end: liftAt, field: "hold" },
          ]
        : [{ label: "Word", start: 0, end: v.first, field: "first" }];
    return [
      { layer: "words", name: "Words", segments: words },
      { layer: "cover", name: "Cover", segments: [{ label: "Lifts", start: liftAt, end: total, field: "lift" }] },
      {
        layer: "page",
        name: "Page",
        segments: [
          { label: "Revealed", start: liftAt, end: total },
          ...(v.after > 0 ? [{ label: "Stays", start: total, end: total + v.after, field: "after" }] : []),
        ],
      },
    ];
  },

  render: (v, time) => {
    const { liftAt } = timeline(v);
    return (
      <WordsPreloader
        className="h-full w-full"
        time={time}
        words={v.words.length ? v.words : [""]}
        label={v.label}
        count={v.count}
        color={v.color}
        onColor={v.onColor}
        size={v.size}
        first={v.first}
        pace={v.pace}
        hold={v.hold}
        lift={v.lift}
        curve={v.curve}
      >
        <div className="relative h-full w-full" style={{ background: v.pageColor, color: v.pageInk }}>
          {v.media?.kind === "image" && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={v.media.url} alt="" className="absolute inset-0 h-full w-full object-cover" />
          )}
          {v.media?.kind === "video" && (
            // The film starts as the cover begins to lift, so its opening is what gets revealed.
            <video src={v.media.url} data-motion-start={liftAt} muted playsInline loop preload="auto" className="absolute inset-0 h-full w-full object-cover" />
          )}
          {v.title && (
            <p className="absolute inset-0 flex items-center justify-center px-16 text-center text-[56px] font-medium leading-[1.05] tracking-[-0.03em]">
              <span className="max-w-[14em]">{v.title}</span>
            </p>
          )}
        </div>
      </WordsPreloader>
    );
  },

  code: (v) => {
    const d = defaults;
    const tsx = [
      `words={[${v.words.map(q).join(", ")}]}`,
      v.label !== "Loading" && `label=${q(v.label)}`,
      !v.count && `count={false}`,
      v.color !== d.color && `color=${q(v.color)}`,
      v.onColor !== d.onColor && `onColor=${q(v.onColor)}`,
      v.size !== 56 && `size={${v.size}}`,
      v.first !== d.first && `first={${v.first}}`,
      v.pace !== d.pace && `pace={${v.pace}}`,
      v.hold !== d.hold && `hold={${v.hold}}`,
      v.lift !== d.lift && `lift={${v.lift}}`,
      v.curve !== d.curve && `curve={${v.curve}}`,
    ].filter(Boolean);

    const ms = (n: number) => `const Duration(milliseconds: ${Math.round(n)})`;
    const dart = [
      `words: const [${v.words.map(dartString).join(", ")}],`,
      v.label !== "Loading" && `label: ${dartString(v.label)},`,
      !v.count && `count: false,`,
      v.color !== d.color && `color: const ${dartColor(v.color)},`,
      v.onColor !== d.onColor && `onColor: const ${dartColor(v.onColor)},`,
      v.size !== 56 && `size: ${v.size},`,
      v.first !== d.first && `first: ${ms(v.first)},`,
      v.pace !== d.pace && `pace: ${ms(v.pace)},`,
      v.hold !== d.hold && `hold: ${ms(v.hold)},`,
      v.lift !== d.lift && `lift: ${ms(v.lift)},`,
      v.curve !== d.curve && `curve: ${v.curve},`,
    ].filter(Boolean);

    return {
      tsx: `import { WordsPreloader } from "tomm-ui";\n\n<WordsPreloader\n${tsx.map((l) => `  ${l}`).join("\n")}\n>\n  <YourPage />\n</WordsPreloader>\n`,
      dart: `import 'package:tomm/tomm.dart';\n\nWordsPreloader(\n${dart.map((l) => `  ${l}`).join("\n")}\n  child: const YourPage(),\n)\n`,
    };
  },
};
