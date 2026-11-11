import 'package:flutter/material.dart';

import 'scroll_linked.dart';
import 'tom_style.dart';

/// Vertical scroll drives a giant line of text sideways across a pinned
/// stage while it fills with ink. Place it inside a vertical scroll view.
class HorizontalTextScroll extends StatelessWidget {
  const HorizontalTextScroll({
    super.key,
    required this.text,
    this.speed = 0.5,
    this.style,
    this.color = Tom.ink,
    this.ghostColor = const Color(0xFFE5E5E5),
  });

  final String text;

  /// How fast the line travels. 1 crosses in about two screens of scrolling;
  /// 0.5 takes twice as long; 2 is twice as fast.
  final double speed;
  final TextStyle? style;

  /// Colour the letters fill with.
  final Color color;

  /// Colour of the letters before they are filled.
  final Color ghostColor;

  @override
  Widget build(BuildContext context) {
    final screens = 2 / speed.clamp(0.1, 8.0);
    final style =
        (this.style ??
                const TextStyle(
                  fontSize: 120,
                  height: 1,
                  fontWeight: FontWeight.w900,
                  letterSpacing: -6,
                ))
            .copyWith(decoration: TextDecoration.none);
    final label = Tom.caps(text);

    return ScrollLinked(
      builder: (context, metrics) {
        final viewport = metrics?.viewport ?? MediaQuery.sizeOf(context).height;
        final track = viewport * (1 + screens);
        final progress = metrics?.through ?? 0;
        // Slide the stage down by exactly what has scrolled, so it stays pinned to the top.
        final pinned = (progress * (track - viewport)).clamp(
          0.0,
          track - viewport,
        );

        return SizedBox(
          height: track,
          child: Align(
            alignment: Alignment.topLeft,
            child: Transform.translate(
              offset: Offset(0, pinned),
              child: SizedBox(
                height: viewport,
                width: double.infinity,
                child: ClipRect(
                  child: LayoutBuilder(
                    builder: (context, box) => OverflowBox(
                      alignment: Alignment.centerLeft,
                      maxWidth: double.infinity,
                      child: Semantics(
                        label: text,
                        child: ExcludeSemantics(
                          child: _Line(
                            label: label,
                            style: style,
                            color: color,
                            ghostColor: ghostColor,
                            progress: progress,
                            stageWidth: box.maxWidth,
                          ),
                        ),
                      ),
                    ),
                  ),
                ),
              ),
            ),
          ),
        );
      },
    );
  }
}

class _Line extends StatelessWidget {
  const _Line({
    required this.label,
    required this.style,
    required this.color,
    required this.ghostColor,
    required this.progress,
    required this.stageWidth,
  });

  final String label;
  final TextStyle style;
  final Color color;
  final Color ghostColor;
  final double progress;
  final double stageWidth;

  @override
  Widget build(BuildContext context) {
    final painter = TextPainter(
      text: TextSpan(text: label, style: style),
      textDirection: TextDirection.ltr,
      maxLines: 1,
    )..layout();
    final width = painter.width;
    painter.dispose();
    // From just inside the left edge to showing the end of the line.
    final x =
        stageWidth * 0.05 -
        progress * (width - stageWidth * 0.9).clamp(0.0, double.infinity);

    return Transform.translate(
      offset: Offset(x, 0),
      child: Stack(
        children: [
          Text(
            label,
            style: style.copyWith(color: ghostColor),
            maxLines: 1,
            softWrap: false,
          ),
          ClipRect(
            clipper: _Fill(progress),
            child: Text(
              label,
              style: style.copyWith(color: color),
              maxLines: 1,
              softWrap: false,
            ),
          ),
        ],
      ),
    );
  }
}

class _Fill extends CustomClipper<Rect> {
  const _Fill(this.fraction);
  final double fraction;

  @override
  Rect getClip(Size size) =>
      Rect.fromLTWH(0, 0, size.width * fraction, size.height);

  @override
  bool shouldReclip(_Fill old) => old.fraction != fraction;
}
