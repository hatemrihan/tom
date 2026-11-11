import 'dart:ui' show PathMetric;

import 'package:flutter/material.dart';

import 'tom_style.dart';

/// A signature that draws itself, stroke by stroke, at a constant pen speed:
/// longer strokes take proportionally longer.
class Signature extends StatefulWidget {
  const Signature({
    super.key,
    this.strokes,
    this.viewBox = const Size(216, 90),
    this.duration = const Duration(milliseconds: 2400),
    this.strokeWidth = 2.4,
    this.color = Tom.ink,
    this.height = 96,
    this.semanticLabel = 'Signature',
  });

  /// The pen strokes, in drawing order, in [viewBox] coordinates.
  /// Defaults to a hand-drawn "Tom".
  final List<Path>? strokes;
  final Size viewBox;
  final Duration duration;
  final double strokeWidth;
  final Color color;
  final double height;
  final String semanticLabel;

  /// A hand-drawn "Tom".
  static List<Path> tom() => [
    Path()
      ..moveTo(12, 24)
      ..cubicTo(28, 20, 44, 20, 60, 22)
      ..moveTo(36, 22)
      ..cubicTo(35, 40, 36, 58, 34, 76),
    Path()
      ..moveTo(84, 52)
      ..cubicTo(72, 50, 66, 62, 72, 70)
      ..cubicTo(80, 78, 94, 70, 90, 58)
      ..cubicTo(88, 52, 84, 50, 80, 54),
    Path()
      ..moveTo(104, 72)
      ..cubicTo(106, 62, 106, 54, 108, 50)
      ..cubicTo(112, 46, 118, 50, 118, 60)
      ..lineTo(118, 72)
      ..moveTo(118, 58)
      ..cubicTo(122, 48, 132, 46, 134, 56)
      ..lineTo(136, 72)
      ..cubicTo(142, 78, 176, 74, 206, 60),
  ];

  @override
  State<Signature> createState() => _SignatureState();
}

class _SignatureState extends State<Signature>
    with SingleTickerProviderStateMixin {
  late final AnimationController _pen = AnimationController(
    vsync: this,
    duration: widget.duration,
  )..forward();
  late final List<PathMetric> _metrics = [
    for (final stroke in widget.strokes ?? Signature.tom())
      ...stroke.computeMetrics(),
  ];

  /// Draw it again from the start.
  void replay() => _pen.forward(from: 0);

  @override
  void dispose() {
    _pen.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Semantics(
      image: true,
      label: widget.semanticLabel,
      child: SizedBox(
        height: widget.height,
        width: widget.height * widget.viewBox.width / widget.viewBox.height,
        child: CustomPaint(
          painter: _Ink(
            metrics: _metrics,
            progress: _pen,
            viewBox: widget.viewBox,
            color: widget.color,
            strokeWidth: widget.strokeWidth,
          ),
        ),
      ),
    );
  }
}

class _Ink extends CustomPainter {
  _Ink({
    required this.metrics,
    required this.progress,
    required this.viewBox,
    required this.color,
    required this.strokeWidth,
  }) : super(repaint: progress);

  final List<PathMetric> metrics;
  final Animation<double> progress;
  final Size viewBox;
  final Color color;
  final double strokeWidth;

  @override
  void paint(Canvas canvas, Size size) {
    canvas.scale(size.width / viewBox.width, size.height / viewBox.height);
    final paint = Paint()
      ..color = color
      ..style = PaintingStyle.stroke
      ..strokeWidth = strokeWidth
      ..strokeCap = StrokeCap.round
      ..strokeJoin = StrokeJoin.round;

    final total = metrics.fold<double>(0, (sum, m) => sum + m.length);
    var remaining = total * Curves.easeInOut.transform(progress.value);
    for (final metric in metrics) {
      if (remaining <= 0) break;
      canvas.drawPath(
        metric.extractPath(0, remaining.clamp(0, metric.length).toDouble()),
        paint,
      );
      remaining -= metric.length;
    }
  }

  @override
  bool shouldRepaint(_Ink old) =>
      old.color != color ||
      old.strokeWidth != strokeWidth ||
      old.metrics != metrics;
}
