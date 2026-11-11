/**
 * Component registry — the single source of truth for the library.
 * Each entry's `files` are read from disk at build time to render the code
 * on the docs pages, so docs can never drift from the real source.
 *
 * Admin overrides (title, description, hidden, featured) are layered on top
 * at runtime from the database — see lib/component-settings.ts.
 */

export type Category =
  | "Buttons"
  | "Text"
  | "Cards & Surfaces"
  | "Media"
  | "Inputs"
  | "Feedback"
  | "Navigation"
  | "Backgrounds"
  | "Cursor & Motion";

export interface RegistryEntry {
  slug: string;
  name: string;
  description: string;
  category: Category;
  /** Paths relative to components/library. First file is the main component. */
  files: string[];
  /** npm packages required besides react. */
  dependencies: string[];
  /** Short notes shown on the docs page. */
  notes?: string[];
  /** Dart file of the Flutter edition, inside flutter/tom_components/lib/src. */
  flutter?: string;
  /** Preview canvas height in px. */
  previewHeight?: number;
  /** Pin the preview to the top when it opens a menu downward. */
  previewAlign?: "top";
  /** Date added (YYYY-MM-DD). */
  added: string;
}

const MOTION = ["motion", "clsx", "tailwind-merge"];
const BASE = ["clsx", "tailwind-merge"];

export const registry: RegistryEntry[] = [
  /* -------------------------------- Kitchen -------------------------------- */
  {
    slug: "hold-to-confirm",
    name: "Hold to Confirm",
    description: "A deliberate destructive action: fills while held, drains back if released early.",
    category: "Buttons",
    files: ["hold-to-confirm/hold-to-confirm.tsx"],
    dependencies: MOTION,
    notes: ["Works with mouse, touch and keyboard (hold Space or Enter).", "Vibrates briefly on supported phones when confirmed."],
    flutter: "hold_to_confirm.dart",
    added: "2026-11-06",
  },
  {
    slug: "receipt-printer",
    name: "Receipt Printer",
    description: "A card payment that ends like a real one: approved, then a paper receipt feeds out with every detail.",
    category: "Feedback",
    files: ["receipt-printer/receipt-printer.tsx"],
    dependencies: MOTION,
    previewHeight: 460,
    flutter: "receipt_printer.dart",
    added: "2026-11-06",
  },
  {
    slug: "signature",
    name: "Signature",
    description: "An SVG signature that draws itself at a constant pen speed.",
    category: "Text",
    files: ["signature/signature.tsx"],
    dependencies: BASE,
    flutter: "signature.dart",
    added: "2026-11-06",
  },

  /* ----------------------------- Glass & physics ---------------------------- */
  {
    slug: "liquid-glass-logo",
    name: "Liquid Glass Logo",
    description: "A droplet becomes a glass tile around your logo, ripples out, then dissolves away.",
    category: "Feedback",
    files: ["liquid-glass-logo/liquid-glass-logo.tsx"],
    dependencies: MOTION,
    notes: ["Accepts any node — SVG, <img> or text.", "The logo ends at its natural size on the background."],
    previewHeight: 380,
    flutter: "liquid_glass_logo.dart",
    added: "2026-11-06",
  },
  {
    slug: "liquid-glass-orb",
    name: "Liquid Glass Orb",
    description: "An AI assistant orb — coloured liquid merges inside glass, reacting to each state.",
    category: "Feedback",
    files: ["liquid-glass-orb/liquid-glass-orb.tsx"],
    dependencies: MOTION,
    previewHeight: 360,
    flutter: "liquid_glass_orb.dart",
    added: "2026-11-06",
  },
  {
    slug: "topographic-flow",
    name: "Topographic Flow",
    description: "Living contour lines traced with marching squares over drifting noise.",
    category: "Backgrounds",
    files: ["topographic-flow/topographic-flow.tsx", "_lib/noise.ts"],
    dependencies: BASE,
    notes: ["Line colour follows CSS `color`.", "Pauses automatically while offscreen."],
    flutter: "topographic_flow.dart",
    added: "2026-11-06",
  },

  /* ----------------------------- Interaction kit ---------------------------- */
  {
    slug: "dynamic-island",
    name: "Dynamic Island",
    description: "A small pill that springs between sizes to say the small things: saved, copied, publishing, live.",
    category: "Feedback",
    files: ["dynamic-island/dynamic-island.tsx"],
    dependencies: MOTION,
    flutter: "dynamic_island.dart",
    added: "2026-11-06",
  },
  {
    slug: "number-flow",
    name: "Number Flow",
    description: "Digits spin like reels to their new value; formatting is handled by Intl.",
    category: "Text",
    files: ["number-flow/number-flow.tsx"],
    dependencies: MOTION,
    flutter: "number_flow.dart",
    added: "2026-11-06",
  },
  {
    slug: "text-reveal-scroll",
    name: "Scroll Text Reveal",
    description: "Words light up one by one as the paragraph scrolls past.",
    category: "Text",
    files: ["text-reveal-scroll/text-reveal-scroll.tsx"],
    dependencies: MOTION,
    previewHeight: 400,
    flutter: "text_reveal_scroll.dart",
    added: "2026-11-06",
  },
  {
    slug: "expand-on-hover",
    name: "Expand on Hover",
    description: "Image panels where the hovered one expands and the rest compress.",
    category: "Media",
    files: ["expand-on-hover/expand-on-hover.tsx"],
    dependencies: MOTION,
    previewHeight: 360,
    flutter: "expand_on_hover.dart",
    added: "2026-11-06",
  },
  {
    slug: "expand-columns",
    name: "Expanding Columns",
    description: "Thin columns with sideways labels; the one you point at opens to show its image. A list of rows on phones.",
    category: "Media",
    files: ["expand-columns/expand-columns.tsx"],
    dependencies: BASE,
    notes: ["Opens on hover, focus and tap, so it works with a keyboard and on touch screens.", "Set the height with a class such as `md:h-[600px]`."],
    previewHeight: 560,
    flutter: "expand_columns.dart",
    added: "2026-11-11",
  },
  {
    slug: "stairs-preloader",
    name: "Stairs Preloader",
    description: "Counts to 100, then lifts away as a staircase to reveal the page.",
    category: "Feedback",
    files: ["stairs-preloader/stairs-preloader.tsx"],
    dependencies: MOTION,
    previewHeight: 620,
    flutter: "stairs_preloader.dart",
    added: "2026-11-06",
  },

  /* ------------------------------- Batch 4 -------------------------------- */
  {
    slug: "scroll-color-list",
    name: "Scroll Color List",
    description: "An endless list of oversized titles — the focused row turns solid, the surface tints, a preview swaps in.",
    category: "Navigation",
    files: ["scroll-color-list/scroll-color-list.tsx"],
    dependencies: MOTION,
    notes: ["Loops forever in both directions.", "Optional `tick` plays a soft click + haptic on each change (after the first tap).", "↑ ↓ to move, Enter to open the active link."],
    previewHeight: 520,
    flutter: "scroll_color_list.dart",
    added: "2026-11-06",
  },
  {
    slug: "music-toggle",
    name: "Music Toggle",
    description: "A sound switch pared down to a few moving bars and one word.",
    category: "Buttons",
    files: ["music-toggle/music-toggle.tsx"],
    dependencies: MOTION,
    flutter: "music_toggle.dart",
    added: "2026-11-06",
  },
  {
    slug: "infinite-drag-grid",
    name: "Infinite Drag Grid",
    description: "An endless plane of tiles — drag or scroll any direction, with momentum.",
    category: "Media",
    files: ["infinite-drag-grid/infinite-drag-grid.tsx"],
    dependencies: MOTION,
    notes: ["Only visible tiles are rendered, so it stays fast with any number of items."],
    previewHeight: 500,
    flutter: "infinite_drag_grid.dart",
    added: "2026-11-06",
  },
  {
    slug: "hover-members",
    name: "Hover Members",
    description: "A row of small portraits: the one you point at grows and the caption swaps to that person.",
    category: "Cursor & Motion",
    files: ["hover-members/hover-members.tsx"],
    dependencies: MOTION,
    previewHeight: 380,
    flutter: "hover_members.dart",
    added: "2026-11-06",
  },
  {
    slug: "tick-scrollbar",
    name: "Tick Scrollbar",
    description: "A ruler for reading progress, in its own row under the text: a needle over ticks that swell as it passes.",
    category: "Navigation",
    files: ["tick-scrollbar/tick-scrollbar.tsx"],
    dependencies: MOTION,
    previewHeight: 460,
    flutter: "tick_scrollbar.dart",
    added: "2026-11-06",
  },
  {
    slug: "swap-converter",
    name: "Swap Converter",
    description: "A currency converter on live rates for about 160 currencies: type, read, flip.",
    category: "Inputs",
    files: ["swap-converter/swap-converter.tsx"],
    dependencies: MOTION,
    previewHeight: 460,
    notes: ["Rates come from the open fawazahmed0/currency-api on jsDelivr, free and without a key. They change once a day.", "Pass `endpoint` to use your own rates API, `currencies` to limit the list and `fallback` for offline values."],
    flutter: "swap_converter.dart",
    added: "2026-11-06",
  },
  {
    slug: "devour-input",
    name: "Devour Input",
    description: "An oversized line input — on submit, the arrow swallows your text letter by letter.",
    category: "Inputs",
    files: ["devour-input/devour-input.tsx"],
    dependencies: MOTION,
    flutter: "devour_input.dart",
    added: "2026-11-06",
  },
  {
    slug: "scroll-spy-nav",
    name: "Scroll Spy Nav",
    description: "A long-form page with a side index that follows along: a dot on the current section and a rule for progress.",
    category: "Navigation",
    files: ["scroll-spy-nav/scroll-spy-nav.tsx"],
    dependencies: MOTION,
    previewHeight: 480,
    flutter: "scroll_spy_nav.dart",
    added: "2026-11-06",
  },
  {
    slug: "box-reveal-text",
    name: "Box Reveal Text",
    description: "Each line hides behind a solid box that slides away as the block scrolls into view.",
    category: "Text",
    files: ["box-reveal-text/box-reveal-text.tsx"],
    dependencies: MOTION,
    previewHeight: 460,
    flutter: "box_reveal_text.dart",
    added: "2026-11-06",
  },
  {
    slug: "project-index",
    name: "Project Index",
    description: "Every name on one line, and one framed preview that wipes to whichever you point at.",
    category: "Navigation",
    files: ["project-index/project-index.tsx"],
    dependencies: MOTION,
    previewHeight: 420,
    flutter: "project_index.dart",
    added: "2026-11-06",
  },
  {
    slug: "knockout-bracket",
    name: "Knockout Bracket",
    description: "A tournament bracket drawn like a fixture list: names, scores and thin rules, no boxes.",
    category: "Cards & Surfaces",
    files: ["knockout-bracket/knockout-bracket.tsx"],
    dependencies: MOTION,
    previewHeight: 480,
    flutter: "knockout_bracket.dart",
    added: "2026-11-06",
  },
  {
    slug: "admission-ticket",
    name: "Admission Ticket",
    description: "A museum-style ticket: paper body, coloured strip, and a dark stub that leans away as if about to be torn off.",
    category: "Cards & Surfaces",
    files: ["admission-ticket/admission-ticket.tsx"],
    dependencies: ["uqr", "clsx", "tailwind-merge"],
    notes: ["The QR codes are real and scan to whatever you pass as `qr`.", "The barcode is drawn from the ticket number for looks; it is not a scannable symbology."],
    previewHeight: 600,
    flutter: "admission_ticket.dart",
    added: "2026-11-11",
  },
  {
    slug: "result-slip",
    name: "Result Slip",
    description: "A printed slip on tinted paper with tabbed edges, set in small monospaced capitals and stamped with the real date and time.",
    category: "Cards & Surfaces",
    files: ["result-slip/result-slip.tsx"],
    dependencies: BASE,
    previewHeight: 460,
    flutter: "result_slip.dart",
    added: "2026-11-11",
  },
  {
    slug: "event-ticket",
    name: "Event Ticket",
    description: "A tall, plain event ticket: one coloured panel with a large date, the facts in small capitals, and a stub with a real QR code.",
    category: "Cards & Surfaces",
    files: ["event-ticket/event-ticket.tsx"],
    dependencies: ["uqr", "clsx", "tailwind-merge"],
    notes: ["The QR code is real and scans to whatever you pass as `qr`.", "Set `color`, `onColor` and `paper` to match your brand."],
    previewHeight: 560,
    flutter: "event_ticket.dart",
    added: "2026-11-11",
  },
  {
    slug: "segment-tags",
    name: "Segment Tags",
    description: "A label built from soft-cornered tiles: a square mark, one tile per label, and optionally a picture.",
    category: "Navigation",
    files: ["segment-tags/segment-tags.tsx"],
    dependencies: BASE,
    notes: ["Server-component safe: no client JavaScript.", "Everything scales from one `size` value."],
    previewHeight: 380,
    flutter: "segment_tags.dart",
    added: "2026-11-11",
  },
  {
    slug: "drawing-cursor",
    name: "Drawing Cursor",
    description: "An ink layer over any content: an evaporating trail, or real drawing you can save as a PNG.",
    category: "Cursor & Motion",
    files: ["drawing-cursor/drawing-cursor.tsx"],
    dependencies: BASE,
    previewHeight: 380,
    flutter: "drawing_cursor.dart",
    added: "2026-11-06",
  },
  {
    slug: "horizontal-text-scroll",
    name: "Horizontal Text Scroll",
    description: "Vertical scroll drives a giant line of text sideways while it fills with ink. The speed is yours to set.",
    category: "Text",
    files: ["horizontal-text-scroll/horizontal-text-scroll.tsx"],
    dependencies: MOTION,
    previewHeight: 380,
    flutter: "horizontal_text_scroll.dart",
    added: "2026-11-06",
  },
];

export const CATEGORIES: Category[] = [
  "Buttons",
  "Text",
  "Cards & Surfaces",
  "Media",
  "Inputs",
  "Feedback",
  "Navigation",
  "Backgrounds",
  "Cursor & Motion",
];

export function getEntry(slug: string) {
  return registry.find((e) => e.slug === slug);
}
