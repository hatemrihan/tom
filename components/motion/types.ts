import type { ReactNode } from "react";

/**
 * A motion edition: what makes a component editable as a motion graphic.
 * The editor (layers, timeline, panel, export) is the same for every component
 * and reads everything it shows from one of these.
 */

export type Value = string | number | boolean | string[] | Media | null;
export type Values = Record<string, Value>;

/** A picture or film the visitor chose. It stays on their machine. */
export interface Media {
  kind: "image" | "video";
  url: string;
  name: string;
}

interface FieldBase {
  key: string;
  label: string;
  /** The layer it belongs to. */
  layer: string;
  /** Which side of the panel: how it looks, or how it moves. */
  group: "design" | "animate";
}

export type Field =
  | (FieldBase & { type: "text" })
  | (FieldBase & { type: "list"; hint?: string })
  | (FieldBase & { type: "color" })
  | (FieldBase & { type: "toggle" })
  | (FieldBase & { type: "number"; min: number; max: number; step: number; unit?: string })
  | (FieldBase & { type: "media" });

export interface Layer {
  id: string;
  name: string;
  kind: "text" | "shape" | "media";
  /** A true/false value that shows or hides this layer. */
  toggle?: string;
}

export interface Segment {
  label: string;
  start: number;
  end: number;
  /** Dragging the end of this bar changes this number: value = length / per. */
  field?: string;
  per?: number;
}

export interface Track {
  layer: string;
  name: string;
  segments: Segment[];
}

export interface MotionSpec<V extends Values = Values> {
  defaults: V;
  fields: Field[];
  layers: Layer[];
  /** Length of the piece, in ms. */
  duration: (v: V) => number;
  tracks: (v: V) => Track[];
  /** The real component at one moment. It fills the stage. */
  render: (v: V, time: number) => ReactNode;
  /** The same values, written out as code. */
  code: (v: V) => { tsx: string; dart?: string };
}

export const FORMATS = [
  { id: "16:9", w: 1280, h: 720 },
  { id: "1:1", w: 720, h: 720 },
  { id: "4:5", w: 720, h: 900 },
  { id: "9:16", w: 720, h: 1280 },
] as const;

export type Format = (typeof FORMATS)[number];
