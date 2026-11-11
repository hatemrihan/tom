# tomm-ui

Simple, direct React components with motion. 29 of them, taken from real products.

Previews, source and docs for every one: **[tomm.one/components](https://tomm.one/components)**

There are two ways to use them. Pick whichever suits the project.

## 1. Install it

```bash
npm i tomm-ui
```

```tsx
import { HoldToConfirm } from "tomm-ui";

<HoldToConfirm onConfirm={() => deleteAccount()}>Hold to delete</HoldToConfirm>
```

That is all. The styles come with the components, so there is nothing to configure, with or without Tailwind in your project. Dark mode follows a `dark` class on any parent element, the usual Tailwind and shadcn/ui convention.

Every component is a client component and is marked as one, so it can be imported straight into a Next.js server component.

## 2. Copy it

If you would rather own the code, the same package copies a component's source file into your project:

```bash
npx tomm-ui list
npx tomm-ui add hold-to-confirm music-toggle
```

The files land in `components/tomm/` (or `src/components/tomm/`). They are yours from then on: rename things, change the colours, delete what you don't need. Use `--dir <folder>` to choose another place and `--force` to replace files you already have.

## What's inside

| | |
| --- | --- |
| **Buttons and inputs** | Hold to Confirm, Music Toggle, Devour Input, Swap Converter, Segment Tags |
| **Feedback** | Receipt Printer, Dynamic Island, Number Flow, Stairs Preloader, Signature, Drawing Cursor |
| **Cards and tickets** | Admission Ticket, Event Ticket, Result Slip, Knockout Bracket, Expand on Hover, Expanding Columns, Hover Members |
| **Text** | Scroll Text Reveal, Box Reveal Text, Horizontal Text Scroll, Scroll Color List |
| **Navigation** | Scroll Spy Nav, Tick Scrollbar, Project Index, Infinite Drag Grid |
| **Glass and backgrounds** | Liquid Glass Logo, Liquid Glass Orb, Topographic Flow |

## Needs

React 18 or newer. [Motion](https://motion.dev) and the styles come with the package. Copied source files (`npx tomm-ui add`) are styled with Tailwind CSS 4 classes, so that route needs Tailwind in your project.

There is a Flutter edition too: [`tomm` on pub.dev](https://pub.dev/packages/tomm).

## Anonymous usage

The `add` command tells tomm.one which components were added, plus the tool version, operating system and runtime version. No names, file paths or code are sent, and the components themselves never send anything. Turn it off with `TOMM_TELEMETRY=0`, `DO_NOT_TRACK=1` or `--no-telemetry`. Everything that is and is not collected: [tomm.one/telemetry](https://tomm.one/telemetry).

## License

MIT © [Hatem Rihan](https://tomm.one)
