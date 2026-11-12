import 'package:flutter/material.dart';

import 'tom_style.dart';

/// An animated number. Each digit is a vertical reel that rolls to its new
/// value; separators and symbols simply appear.
class NumberFlow extends StatelessWidget {
  const NumberFlow({
    super.key,
    required this.value,
    this.prefix = '',
    this.suffix = '',
    this.fractionDigits = 0,
    this.groupSeparator = ',',
    this.style,
    this.duration = const Duration(milliseconds: 600),
  });

  final num value;
  final String prefix;
  final String suffix;
  final int fractionDigits;

  /// Put between thousands. Use an empty string for none.
  final String groupSeparator;
  final TextStyle? style;
  final Duration duration;

  /// "1234.5" becomes "1,234.50" with two fraction digits.
  String get _formatted {
    final fixed = value.abs().toStringAsFixed(fractionDigits);
    final parts = fixed.split('.');
    final whole = parts[0].replaceAllMapped(
      RegExp(r'\B(?=(\d{3})+(?!\d))'),
      (_) => groupSeparator,
    );
    final sign = value < 0 ? '-' : '';
    return '$sign$prefix$whole${parts.length > 1 ? '.${parts[1]}' : ''}$suffix';
  }

  @override
  Widget build(BuildContext context) {
    final text = _formatted;
    final style =
        (this.style ??
                const TextStyle(
                  fontSize: 56,
                  fontWeight: FontWeight.w500,
                  letterSpacing: -2,
                  color: Tom.ink,
                  height: 1.15,
                ))
            .copyWith(
              fontFeatures: const [FontFeature.tabularFigures()],
              decoration: TextDecoration.none,
            );
    final chars = text.characters.toList();

    return Semantics(
      label: text,
      child: ExcludeSemantics(
        child: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            for (var i = 0; i < chars.length; i++)
              // Keyed from the right so the ones and tens columns stay put as the number grows.
              KeyedSubtree(
                key: ValueKey('${chars.length - i}'),
                child: int.tryParse(chars[i]) == null
                    ? Text(chars[i], style: style)
                    : _Reel(
                        digit: int.parse(chars[i]),
                        style: style,
                        duration: duration,
                      ),
              ),
          ],
        ),
      ),
    );
  }
}

class _Reel extends StatelessWidget {
  const _Reel({
    required this.digit,
    required this.style,
    required this.duration,
  });

  final int digit;
  final TextStyle style;
  final Duration duration;

  @override
  Widget build(BuildContext context) {
    final line = (style.fontSize ?? 14) * (style.height ?? 1.15);
    // Tabular figures share one width; measure it so the reel has a fixed box.
    final measure = TextPainter(
      // Measured in the font the digits are drawn in, so the columns sit tight.
      text: TextSpan(
        text: '0',
        style: DefaultTextStyle.of(context).style.merge(style),
      ),
      textDirection: TextDirection.ltr,
    )..layout();
    final width = measure.width;
    measure.dispose();
    return SizedBox(
      height: line,
      width: width,
      child: ClipRect(
        child: TweenAnimationBuilder<double>(
          tween: Tween(end: digit.toDouble()),
          duration: duration,
          curve: Tom.ease,
          builder: (context, position, child) => OverflowBox(
            alignment: Alignment.topCenter,
            minHeight: line * 10,
            maxHeight: line * 10,
            child: Transform.translate(
              offset: Offset(0, -position * line),
              child: child,
            ),
          ),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              for (var d = 0; d < 10; d++)
                SizedBox(
                  height: line,
                  child: Text('$d', style: style),
                ),
            ],
          ),
        ),
      ),
    );
  }
}
