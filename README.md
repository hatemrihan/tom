<p align="center">
  <img src="public/favicon.svg" width="72" height="72" alt="TOM, a line-drawn dog">
</p>

<h1 align="center">TOM</h1>

<p align="center">
  Simple and direct.<br>
  The work of <a href="https://tomm.one">Hatem Rihan</a>, and the components that came out of it.
</p>

---

TOM is two things in one place.

**The work.** Products built for real clients and for myself: a medical record shared between patients and clinics, online stores in Arabic and English, a site for a student organisation. Each one has its own page with every screen shown large.

**The components.** 29 interface pieces taken from that work, cleaned up and given away. Each exists twice: once for **React** (TypeScript and Tailwind) and once for **Flutter** (Dart). `tomm-ui` on npm and `tomm` on pub.dev. Install it like any package, or copy a single file and make it your own.

## What we believe

- **One file.** A component you can read from top to bottom in a few minutes is a component you can trust and change.
- **No decoration for its own sake.** Small capitals, one typeface, black on white, one warm blue. If something moves, it moves because it tells you something.
- **Real things.** Tickets carry QR codes that scan. The currency converter uses today's rates. The signature pad saves a real image. Nothing is a picture of a feature.
- **Yours, not ours.** MIT licensed, no theme to fight. Install it when you want it quick, copy the file when you want to own it.

## The components

| | |
| --- | --- |
| **Buttons and inputs** | Hold to Confirm, Music Toggle, Devour Input, Swap Converter, Segment Tags |
| **Feedback** | Receipt Printer, Dynamic Island, Number Flow, Stairs Preloader, Signature, Drawing Cursor |
| **Cards and tickets** | Admission Ticket, Event Ticket, Result Slip, Knockout Bracket, Expand on Hover, Expanding Columns, Hover Members |
| **Text** | Scroll Text Reveal, Box Reveal Text, Horizontal Text Scroll, Scroll Color List |
| **Navigation** | Scroll Spy Nav, Tick Scrollbar, Project Index, Infinite Drag Grid |
| **Glass and backgrounds** | Liquid Glass Logo, Liquid Glass Orb, Topographic Flow |

Every one has a live preview, its full source and install steps at [tomm.one/components](https://tomm.one/components).

## Use it in React

**Install it:**

```bash
npm i tomm-ui
```

```tsx
import { HoldToConfirm } from "tomm-ui";

<HoldToConfirm onConfirm={() => deleteAccount()}>Hold to delete</HoldToConfirm>
```

That is all: the styles and everything else come with the package.

**Or copy it,** and the source file lands in your project for you to change:

```bash
npx tomm-ui list
npx tomm-ui add hold-to-confirm music-toggle
```

## Use it in Flutter

```bash
flutter pub add tomm
```

```dart
import 'package:tomm/tomm.dart';

HoldToConfirm(
  label: 'Hold to delete',
  onConfirm: deleteAccount,
)
```

**Or copy it,** and the source file lands in `lib/tomm/` for you to change:

```bash
dart run tomm list
dart run tomm add hold_to_confirm music_toggle
```

All 29 widgets pass the Flutter analyzer and a suite of widget tests:

```bash
cd flutter/tom_components
flutter analyze
flutter test
```

## What's in this repository

| Folder | What's inside |
| --- | --- |
| `app/` | the site: home, work pages, component pages, contact |
| `components/library/<name>/` | a React component, one file |
| `components/library/demos/` | the example shown as each component's preview |
| `components/library/registry.ts` | names, descriptions and categories |
| `packages/tomm/` | the npm package `tomm-ui`, built from `components/library` |
| `flutter/tom_components/` | the Flutter package `tomm`, with its tests |
| `lib/work.ts` | the projects shown under Work |

### Adding a component

1. Create `components/library/<slug>/<slug>.tsx`.
2. Add a demo at `components/library/demos/<slug>.tsx` (default export).
3. Register it in `registry.ts`.
4. Run `node scripts/gen-previews.mjs`.
5. Run `node packages/tomm/build.mjs` to include it in the npm package.

## Run it yourself

```bash
cp .env.example .env.local   # fill in Supabase + admin key
npm install
npm run dev
```

Create the tables once: paste [`supabase/migrations/20261106000000_init.sql`](supabase/migrations/20261106000000_init.sql) into the Supabase SQL editor and run it (or `supabase db push`). Row Level Security is on: the publishable key can only read component settings, and contact messages are reachable only from the server with the secret key.

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Supabase project (public reads) |
| `SUPABASE_SECRET_KEY` | server-only key for contact messages and admin data |
| `GOOGLE_SITE_VERIFICATION` | optional Search Console token |

The site builds and runs without a database. The contact form and admin show a clear notice until one is connected.

## Need something built?

Interfaces, motion and whole products. Write to me at [tomm.one/contact](https://tomm.one/contact).

## License

[MIT](LICENSE) © Hatem Rihan
