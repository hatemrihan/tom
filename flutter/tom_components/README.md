# tomm

Simple, direct Flutter widgets with motion. 29 of them, taken from real products.

Previews and docs for every one: **[tomm.one/components](https://tomm.one/components)** (the previews there show the React edition of the same components).

## Install

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

The widgets use whatever font your app already uses, set in small capitals. Nothing needs a theme or a wrapper.

## What's inside

| | |
| --- | --- |
| **Buttons and inputs** | HoldToConfirm, MusicToggle, DevourInput, SwapConverter, SegmentTags |
| **Feedback** | ReceiptPrinter, DynamicIsland, NumberFlow, StairsPreloader, Signature, DrawingCursor |
| **Cards and tickets** | AdmissionTicket, EventTicket, ResultSlip, KnockoutBracket, ExpandOnHover, ExpandColumns, HoverMembers |
| **Text** | TextRevealScroll, BoxRevealText, HorizontalTextScroll, ScrollColorList |
| **Navigation** | ScrollSpyNav, TickScrollbar, ProjectIndex, InfiniteDragGrid |
| **Glass and backgrounds** | LiquidGlassLogo, LiquidGlassOrb, TopographicFlow |

## Good to know

- The tickets paint real, scannable QR codes.
- `SwapConverter` fetches live exchange rates and falls back to built-in ones when offline.
- `DrawingCursor` hands you the drawing as PNG bytes through `onSave`; saving the file is up to your app.
- `LiquidGlassOrb` takes a loudness `level` and moves to it; it does not record or play audio itself.
- Widgets that react to hover on the web also react to a tap.

## Prefer to own the code?

After adding the package, copy any widget's source into your app:

```bash
dart run tomm list
dart run tomm add hold_to_confirm music_toggle
```

The files land in `lib/tomm/`, together with the small shared files they import, and the tool offers to add any package they need. They are yours from then on. Use `--dir <folder>` to choose another place and `--force` to replace files you already have.

There is a React edition too: [`tomm-ui` on npm](https://www.npmjs.com/package/tomm-ui).

## Anonymous usage

The `add` command tells tomm.one which components were added, plus the tool version, operating system and runtime version. No names, file paths or code are sent, and the components themselves never send anything. Turn it off with `TOMM_TELEMETRY=0`, `DO_NOT_TRACK=1` or `--no-telemetry`. Everything that is and is not collected: [tomm.one/telemetry](https://tomm.one/telemetry).

## License

MIT © [Hatem Rihan](https://tomm.one)
