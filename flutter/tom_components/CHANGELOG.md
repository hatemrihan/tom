## 0.1.2

- A runnable gallery in `example/`.
- Screenshots on the package page, drawn from the real widgets.
- `NumberFlow`, `SwapConverter`, `DevourInput` and `HorizontalTextScroll` now follow your app's font everywhere; before, parts of them were measured or drawn in the system font.
- `dart run tomm add` shares anonymous usage (which widget, tool version, OS) so the most-used widgets get attention first. Nothing personal, no paths, no code. Turn it off with `TOMM_TELEMETRY=0`. Details: https://tomm.one/telemetry

## 0.1.1

- `dart run tomm add <widget>` copies a widget's source into your app and offers to install what it needs.
- `dart run tomm list` shows every widget.

## 0.1.0

- First release: 29 widgets, the Flutter edition of the TOM components.
