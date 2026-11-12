<p align="center">
  <img src="public/favicon.svg" width="72" height="72" alt="TOM, a line-drawn dog">
</p>

<h1 align="center">TOM</h1>

<p align="center">
  Simple and direct.<br>
  The work of <a href="https://tomm.one">tomm.</a>, and the components that came out of it.
</p>

---


My vision is make a simple and direct components for the users.



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


## License

[MIT](LICENSE) © Hatem Rihan
