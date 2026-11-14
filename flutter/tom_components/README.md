# tomm

[![pub version](https://img.shields.io/pub/v/tomm.svg?color=4763c9)](https://pub.dev/packages/tomm)
[![license: MIT](https://img.shields.io/badge/license-MIT-1c1917.svg)](https://pub.dev/packages/tomm/license)
[![platforms](https://img.shields.io/badge/platforms-android%20%C2%B7%20ios%20%C2%B7%20web%20%C2%B7%20desktop-1c1917.svg)](https://pub.dev/packages/tomm)

The small details people remember. 30 Flutter widgets with motion, each one taken from a real product and cleaned up until nothing was left to remove.

[![Tickets with real QR codes](https://tomm.one/packages/tickets.png)](https://tomm.one/components)

**[See every one moving at tomm.one/components](https://tomm.one/components)** (the previews there show the React edition of the same components).

## Install

```bash
flutter pub add tomm
```

```dart
import 'package:tomm/tomm.dart';
```

That is the whole setup. No theme to register and no wrapper widget. The widgets use the font your app already uses.

## Three to start with

A delete button that has to be held, so nobody deletes by accident:

```dart
HoldToConfirm(
  label: 'Hold to delete',
  onConfirm: deleteAccount,
)
```

A total whose digits roll to the new value whenever it changes:

```dart
NumberFlow(value: total, prefix: r'$')
```

A ticket with a QR code that really scans:

```dart
EventTicket(
  kicker: 'Evening talks',
  title: 'The grammar of motion',
  day: '19',
  month: 'November 2026',
  number: '000 114 351',
  qr: 'https://example.com/ticket/114351',
  details: [
    TicketDetail('Doors', '19.00'),
    TicketDetail('Seat', 'B 12'),
  ],
)
```

There is a runnable gallery in the [`example`](https://pub.dev/packages/tomm/example) tab.

| | |
| --- | --- |
| ![Hold to confirm, music toggle and number flow](https://tomm.one/packages/controls.png) | ![Swap converter](https://tomm.one/packages/converter.png) |

## Every widget

Each name links to its page, with a live preview and the full source.

<!-- components -->
| Component | What it does |
| --- | --- |
| [`HoldToConfirm`](https://tomm.one/components/hold-to-confirm) | A deliberate destructive action: fills while held, drains back if released early. |
| [`MusicToggle`](https://tomm.one/components/music-toggle) | A sound switch pared down to a few moving bars and one word. |
| [`ReceiptPrinter`](https://tomm.one/components/receipt-printer) | A card payment that ends like a real one: approved, then a paper receipt feeds out with every detail. |
| [`LiquidGlassLogo`](https://tomm.one/components/liquid-glass-logo) | A droplet becomes a glass tile around your logo, ripples out, then dissolves away. |
| [`LiquidGlassOrb`](https://tomm.one/components/liquid-glass-orb) | An AI assistant orb: coloured liquid merges inside glass, reacting to each state. |
| [`DynamicIsland`](https://tomm.one/components/dynamic-island) | A small pill that springs between sizes to say the small things: saved, copied, publishing, live. |
| [`StairsPreloader`](https://tomm.one/components/stairs-preloader) | Counts to 100, then lifts away as a staircase to reveal the page. |
| [`WordsPreloader`](https://tomm.one/components/words-preloader) | Says a few words, one at a time, then the cover lifts away with a bowed edge to reveal the page. |
| [`Signature`](https://tomm.one/components/signature) | A signature that draws itself at a constant pen speed. |
| [`NumberFlow`](https://tomm.one/components/number-flow) | Digits spin like reels to their new value, with prefix, suffix and thousands separators. |
| [`TextRevealScroll`](https://tomm.one/components/text-reveal-scroll) | Words light up one by one as the paragraph scrolls past. |
| [`BoxRevealText`](https://tomm.one/components/box-reveal-text) | Each line hides behind a solid box that slides away as the block scrolls into view. |
| [`HorizontalTextScroll`](https://tomm.one/components/horizontal-text-scroll) | Vertical scroll drives a giant line of text sideways while it fills with ink. The speed is yours to set. |
| [`TopographicFlow`](https://tomm.one/components/topographic-flow) | Living contour lines traced with marching squares over drifting noise. |
| [`ExpandOnHover`](https://tomm.one/components/expand-on-hover) | Image panels where the hovered one expands and the rest compress. |
| [`ExpandColumns`](https://tomm.one/components/expand-columns) | Thin columns with sideways labels; the one you point at opens to show its image. A list of rows on phones. |
| [`InfiniteDragGrid`](https://tomm.one/components/infinite-drag-grid) | An endless plane of tiles: drag or scroll any direction, with momentum. |
| [`ScrollColorList`](https://tomm.one/components/scroll-color-list) | An endless list of oversized titles: the focused row turns solid, the surface tints, a preview swaps in. |
| [`TickScrollbar`](https://tomm.one/components/tick-scrollbar) | A ruler for reading progress, in its own row under the text: a needle over ticks that swell as it passes. |
| [`ScrollSpyNav`](https://tomm.one/components/scroll-spy-nav) | A long-form page with a side index that follows along: a dot on the current section and a rule for progress. |
| [`ProjectIndex`](https://tomm.one/components/project-index) | Every name on one line, and one framed preview that wipes to whichever you point at. |
| [`SegmentTags`](https://tomm.one/components/segment-tags) | A label built from soft-cornered tiles: a square mark, one tile per label, and optionally a picture. |
| [`HoverMembers`](https://tomm.one/components/hover-members) | A row of small portraits: the one you point at grows and the caption swaps to that person. |
| [`DrawingCursor`](https://tomm.one/components/drawing-cursor) | An ink layer over any content: an evaporating trail, or real drawing you can save as a PNG. |
| [`SwapConverter`](https://tomm.one/components/swap-converter) | A currency converter on live rates for about 160 currencies: type, read, flip. |
| [`DevourInput`](https://tomm.one/components/devour-input) | An oversized line input: on submit, the arrow swallows your text letter by letter. |
| [`KnockoutBracket`](https://tomm.one/components/knockout-bracket) | A tournament bracket drawn like a fixture list: names, scores and thin rules, no boxes. |
| [`AdmissionTicket`](https://tomm.one/components/admission-ticket) | A museum-style ticket: paper body, coloured strip, and a dark stub that leans away as if about to be torn off. |
| [`ResultSlip`](https://tomm.one/components/result-slip) | A printed slip on tinted paper with tabbed edges, set in small monospaced capitals and stamped with the real date and time. |
| [`EventTicket`](https://tomm.one/components/event-ticket) | A tall, plain event ticket: one coloured panel with a large date, the facts in small capitals, and a stub with a real QR code. |
<!-- /components -->

## Good to know

- The tickets paint real, scannable QR codes.
- `SwapConverter` fetches live exchange rates and falls back to built-in ones when offline.
- `DrawingCursor` hands you the drawing as PNG bytes through `onSave`; saving the file is up to your app.
- `LiquidGlassOrb` takes a loudness `level` and moves to it; it does not record or play audio itself.
- Widgets that react to hover on the web also react to a tap.
- Works on Android, iOS, web, macOS, Windows and Linux.

## Prefer to own the code?

After adding the package, copy any widget's source into your app:

```bash
dart run tomm list
dart run tomm add hold_to_confirm music_toggle
```

The files land in `lib/tomm/`, together with the small shared files they import, and the tool offers to add any package they need. They are yours from then on: rename things, change the colours, delete what you don't need. Use `--dir <folder>` to choose another place and `--force` to replace files you already have.

## Built something with it?

I would like to see it. Send a link through [tomm.one/contact](https://tomm.one/contact). And if a widget saved you an afternoon, a like on [pub.dev](https://pub.dev/packages/tomm) helps the next person find it.

There is a React edition too: [`tomm-ui` on npm](https://www.npmjs.com/package/tomm-ui).

## Anonymous usage

The `add` command tells tomm.one which components were added, plus the tool version, operating system and runtime version. No names, file paths or code are sent, and the widgets themselves never send anything. Turn it off with `TOMM_TELEMETRY=0`, `DO_NOT_TRACK=1` or `--no-telemetry`. Everything that is and is not collected: [tomm.one/telemetry](https://tomm.one/telemetry).

## License

MIT © [Hatem Rihan](https://tomm.one)
