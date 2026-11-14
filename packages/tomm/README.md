# tomm-ui

[![npm version](https://img.shields.io/npm/v/tomm-ui.svg?color=4763c9)](https://www.npmjs.com/package/tomm-ui)
[![downloads](https://img.shields.io/npm/dm/tomm-ui.svg?color=1c1917)](https://www.npmjs.com/package/tomm-ui)
[![license: MIT](https://img.shields.io/badge/license-MIT-1c1917.svg)](https://www.npmjs.com/package/tomm-ui)

The small details people remember. 30 React components with motion, each one taken from a real product and cleaned up until nothing was left to remove.

**[See every one moving at tomm.one/components](https://tomm.one/components)**

## Install

```bash
npm i tomm-ui
```

```tsx
import { HoldToConfirm } from "tomm-ui";

<HoldToConfirm onConfirm={() => deleteAccount()}>Hold to delete</HoldToConfirm>
```

That is the whole setup. The styles and [Motion](https://motion.dev) come with the package, so there is nothing to configure, with or without Tailwind in your project.

- **One install.** No extra packages to add, no stylesheet to import, no config to edit.
- **Typed.** Written in TypeScript, with types for every prop.
- **Next.js ready.** Every component is marked as a client component, so it can be imported straight into a server component.
- **Dark mode.** Follows a `dark` class on any parent element, the usual Tailwind and shadcn/ui convention.

## Three to start with

A delete button that has to be held, so nobody deletes by accident:

```tsx
<HoldToConfirm onConfirm={deleteAccount}>Hold to delete</HoldToConfirm>
```

A total whose digits roll to the new value whenever it changes:

```tsx
<NumberFlow value={total} />
```

A sound switch with bars that move while it is on:

```tsx
<MusicToggle />
```

Every component's page has its props, a live preview you can play with, and the full source.

## Or own the code

If you would rather have the file in your project than a package in `node_modules`, the same tool copies a component's source for you:

```bash
npx tomm-ui list
npx tomm-ui add hold-to-confirm music-toggle
```

The files land in `components/tomm/` (or `src/components/tomm/`). They are yours from then on: rename things, change the colours, delete what you don't need. Use `--dir <folder>` to choose another place and `--force` to replace files you already have. Copied files are styled with Tailwind CSS 4 classes, so this route needs Tailwind in your project.

## Every component

Each name links to its page.

<!-- components -->
| Component | What it does |
| --- | --- |
| [Hold to Confirm](https://tomm.one/components/hold-to-confirm) | A deliberate destructive action: fills while held, drains back if released early. |
| [Music Toggle](https://tomm.one/components/music-toggle) | A sound switch pared down to a few moving bars and one word. |
| [Receipt Printer](https://tomm.one/components/receipt-printer) | A card payment that ends like a real one: approved, then a paper receipt feeds out with every detail. |
| [Liquid Glass Logo](https://tomm.one/components/liquid-glass-logo) | A droplet becomes a glass tile around your logo, ripples out, then dissolves away. |
| [Liquid Glass Orb](https://tomm.one/components/liquid-glass-orb) | An AI assistant orb: coloured liquid merges inside glass, reacting to each state. |
| [Dynamic Island](https://tomm.one/components/dynamic-island) | A small pill that springs between sizes to say the small things: saved, copied, publishing, live. |
| [Stairs Preloader](https://tomm.one/components/stairs-preloader) | Counts to 100, then lifts away as a staircase to reveal the page. |
| [Words Preloader](https://tomm.one/components/words-preloader) | Says a few words, one at a time, then the cover lifts away with a bowed edge to reveal the page. |
| [Signature](https://tomm.one/components/signature) | An SVG signature that draws itself at a constant pen speed. |
| [Number Flow](https://tomm.one/components/number-flow) | Digits spin like reels to their new value; formatting is handled by Intl. |
| [Scroll Text Reveal](https://tomm.one/components/text-reveal-scroll) | Words light up one by one as the paragraph scrolls past. |
| [Box Reveal Text](https://tomm.one/components/box-reveal-text) | Each line hides behind a solid box that slides away as the block scrolls into view. |
| [Horizontal Text Scroll](https://tomm.one/components/horizontal-text-scroll) | Vertical scroll drives a giant line of text sideways while it fills with ink. The speed is yours to set. |
| [Topographic Flow](https://tomm.one/components/topographic-flow) | Living contour lines traced with marching squares over drifting noise. |
| [Expand on Hover](https://tomm.one/components/expand-on-hover) | Image panels where the hovered one expands and the rest compress. |
| [Expanding Columns](https://tomm.one/components/expand-columns) | Thin columns with sideways labels; the one you point at opens to show its image. A list of rows on phones. |
| [Infinite Drag Grid](https://tomm.one/components/infinite-drag-grid) | An endless plane of tiles: drag or scroll any direction, with momentum. |
| [Scroll Color List](https://tomm.one/components/scroll-color-list) | An endless list of oversized titles: the focused row turns solid, the surface tints, a preview swaps in. |
| [Tick Scrollbar](https://tomm.one/components/tick-scrollbar) | A ruler for reading progress, in its own row under the text: a needle over ticks that swell as it passes. |
| [Scroll Spy Nav](https://tomm.one/components/scroll-spy-nav) | A long-form page with a side index that follows along: a dot on the current section and a rule for progress. |
| [Project Index](https://tomm.one/components/project-index) | Every name on one line, and one framed preview that wipes to whichever you point at. |
| [Segment Tags](https://tomm.one/components/segment-tags) | A label built from soft-cornered tiles: a square mark, one tile per label, and optionally a picture. |
| [Hover Members](https://tomm.one/components/hover-members) | A row of small portraits: the one you point at grows and the caption swaps to that person. |
| [Drawing Cursor](https://tomm.one/components/drawing-cursor) | An ink layer over any content: an evaporating trail, or real drawing you can save as a PNG. |
| [Swap Converter](https://tomm.one/components/swap-converter) | A currency converter on live rates for about 160 currencies: type, read, flip. |
| [Devour Input](https://tomm.one/components/devour-input) | An oversized line input: on submit, the arrow swallows your text letter by letter. |
| [Knockout Bracket](https://tomm.one/components/knockout-bracket) | A tournament bracket drawn like a fixture list: names, scores and thin rules, no boxes. |
| [Admission Ticket](https://tomm.one/components/admission-ticket) | A museum-style ticket: paper body, coloured strip, and a dark stub that leans away as if about to be torn off. |
| [Result Slip](https://tomm.one/components/result-slip) | A printed slip on tinted paper with tabbed edges, set in small monospaced capitals and stamped with the real date and time. |
| [Event Ticket](https://tomm.one/components/event-ticket) | A tall, plain event ticket: one coloured panel with a large date, the facts in small capitals, and a stub with a real QR code. |
<!-- /components -->

## Needs

React 18 or newer. Nothing else.

## Built something with it?

I would like to see it. Send a link through [tomm.one/contact](https://tomm.one/contact).

There is a Flutter edition too: [`tomm` on pub.dev](https://pub.dev/packages/tomm).

## Anonymous usage

The `add` command tells tomm.one which components were added, plus the tool version, operating system and runtime version. No names, file paths or code are sent, and the components themselves never send anything. Turn it off with `TOMM_TELEMETRY=0`, `DO_NOT_TRACK=1` or `--no-telemetry`. Everything that is and is not collected: [tomm.one/telemetry](https://tomm.one/telemetry).

## License

MIT © [Hatem Rihan](https://tomm.one)
