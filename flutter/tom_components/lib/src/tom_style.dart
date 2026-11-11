import 'package:flutter/widgets.dart';

/// The type and colours shared by every TOM component: small, medium-weight
/// capitals in whatever sans-serif the app already uses.
abstract final class Tom {
  static const Color ink = Color(0xFF171717);
  static const Color muted = Color(0xFF737373);
  static const Color faint = Color(0xFFA3A3A3);
  static const Color rule = Color(0xFFD4D4D4);
  static const Color paper = Color(0xFFFFFFFF);
  static const Color danger = Color(0xFFDC2626);
  static const Color blue = Color(0xFF4763C9);

  /// The standard ease used for movement.
  static const Curve ease = Cubic(0.22, 1, 0.36, 1);

  /// Small capitals. Pass text through [caps] before using this style.
  static TextStyle label({
    Color color = ink,
    FontWeight weight = FontWeight.w500,
    double size = 11,
  }) => TextStyle(
    fontSize: size,
    height: 1.35,
    letterSpacing: size * 0.01,
    fontWeight: weight,
    color: color,
    decoration: TextDecoration.none,
  );

  /// Upper-cases text the way the web components do with CSS.
  static String caps(String text) => text.toUpperCase();
}
