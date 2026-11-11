import 'package:flutter/material.dart';

import 'scroll_linked.dart';
import 'tom_style.dart';

/// Each line hides behind a solid box that slides off as the block scrolls
/// into view, line after line. Place it inside any scroll view.
class BoxRevealText extends StatelessWidget {
  const BoxRevealText({
    super.key,
    required this.lines,
    this.style,
    this.boxColor = Tom.ink,
    this.alignment = CrossAxisAlignment.start,
  });

  final List<String> lines;
  final TextStyle? style;
  final Color boxColor;

  /// [CrossAxisAlignment.center] centres each line in the full-width block.
  final CrossAxisAlignment alignment;

  @override
  Widget build(BuildContext context) {
    final style =
        this.style ??
        const TextStyle(
          fontSize: 40,
          height: 1.15,
          fontWeight: FontWeight.w600,
          letterSpacing: -1.6,
          color: Tom.ink,
        );
    return Semantics(
      label: lines.join(' '),
      child: ExcludeSemantics(
        child: ScrollLinked(
          builder: (context, metrics) {
            final progress = metrics?.reveal() ?? 0;
            return SizedBox(
              width: double.infinity,
              child: Column(
                crossAxisAlignment: alignment,
                children: [
                  for (var i = 0; i < lines.length; i++)
                    Padding(
                      padding: const EdgeInsets.symmetric(vertical: 2),
                      child: _Line(
                        text: lines[i],
                        style: style,
                        boxColor: boxColor,
                        amount: _share(progress, i, lines.length),
                      ),
                    ),
                ],
              ),
            );
          },
        ),
      ),
    );
  }

  /// Lines take turns: each gets an equal share of the scroll, overlapping the next a little.
  static double _share(double progress, int index, int total) {
    final start = index / total * 0.8;
    final end = (start + 1.2 / total).clamp(0.0, 1.0);
    return ((progress - start) / (end - start)).clamp(0.0, 1.0);
  }
}

class _Line extends StatelessWidget {
  const _Line({
    required this.text,
    required this.style,
    required this.boxColor,
    required this.amount,
  });

  final String text;
  final TextStyle style;
  final Color boxColor;
  final double amount;

  @override
  Widget build(BuildContext context) {
    return ClipRect(
      child: Stack(
        children: [
          Opacity(
            opacity: amount > 0.02 ? 1 : 0,
            child: Text(text, style: style),
          ),
          Positioned.fill(
            child: FractionalTranslation(
              translation: Offset(amount * 1.01, 0),
              child: ColoredBox(color: boxColor),
            ),
          ),
        ],
      ),
    );
  }
}
