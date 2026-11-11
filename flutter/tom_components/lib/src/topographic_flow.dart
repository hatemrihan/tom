import 'package:flutter/material.dart';

import 'tom_style.dart';

/// Animated contour lines, like a living topographic map. The lines are
/// traced with marching squares over slowly drifting noise.
class TopographicFlow extends StatefulWidget {
  const TopographicFlow({
    super.key,
    this.levels = 9,
    this.resolution = 14,
    this.scale = 160,
    this.speed = 1,
    this.seed = 7,
    this.color = Tom.faint,
    this.strokeWidth = 1,
  });

  /// Number of contour levels.
  final int levels;

  /// Grid cell size in logical pixels (smaller is smoother and heavier).
  final double resolution;

  /// Noise zoom: larger values give bigger landforms.
  final double scale;

  /// Animation speed. 0 holds it still.
  final double speed;
  final int seed;
  final Color color;
  final double strokeWidth;

  @override
  State<TopographicFlow> createState() => _TopographicFlowState();
}

class _TopographicFlowState extends State<TopographicFlow>
    with SingleTickerProviderStateMixin {
  late final AnimationController _clock = AnimationController(
    vsync: this,
    duration: const Duration(seconds: 600),
  );

  @override
  void initState() {
    super.initState();
    if (widget.speed > 0) _clock.repeat();
  }

  @override
  void dispose() {
    _clock.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return ExcludeSemantics(
      child: RepaintBoundary(
        child: CustomPaint(
          size: Size.infinite,
          painter: _Contours(time: _clock, widget: widget),
        ),
      ),
    );
  }
}

class _Contours extends CustomPainter {
  _Contours({required this.time, required this.widget}) : super(repaint: time);

  final Animation<double> time;
  final TopographicFlow widget;

  /// A repeatable pseudo-random value in 0..1 for a lattice point.
  double _hash(int x, int y, int z) {
    var h =
        (x * 374761393 +
            y * 668265263 +
            z * 2147483647 +
            widget.seed * 1274126177) &
        0x7FFFFFFF;
    h = ((h ^ (h >> 13)) * 1274126177) & 0x7FFFFFFF;
    return ((h ^ (h >> 16)) & 0xFFFF) / 0xFFFF;
  }

  static double _smooth(double t) => t * t * (3 - 2 * t);

  /// Smooth 3D value noise.
  double _noise(double x, double y, double z) {
    final xi = x.floor(), yi = y.floor(), zi = z.floor();
    final u = _smooth(x - xi), v = _smooth(y - yi), w = _smooth(z - zi);
    double lerp(double a, double b, double t) => a + (b - a) * t;
    double plane(int k) => lerp(
      lerp(_hash(xi, yi, k), _hash(xi + 1, yi, k), u),
      lerp(_hash(xi, yi + 1, k), _hash(xi + 1, yi + 1, k), u),
      v,
    );
    return lerp(plane(zi), plane(zi + 1), w);
  }

  /// Two octaves: broad landforms with a little detail on top.
  double _height(double x, double y, double z) =>
      _noise(x, y, z) * 0.7 + _noise(x * 2.1, y * 2.1, z * 1.3) * 0.3;

  @override
  void paint(Canvas canvas, Size size) {
    if (size.isEmpty) return;
    final cell = widget.resolution;
    final cols = (size.width / cell).ceil() + 1;
    final rows = (size.height / cell).ceil() + 1;
    final z = time.value * 600 * 0.03 * widget.speed;

    final field = List.generate(
      rows + 1,
      (r) => List.generate(
        cols + 1,
        (c) => _height(c * cell / widget.scale, r * cell / widget.scale, z),
      ),
    );
    final paint = Paint()
      ..color = widget.color
      ..style = PaintingStyle.stroke
      ..strokeWidth = widget.strokeWidth
      ..strokeCap = StrokeCap.round;
    final path = Path();

    // Where a contour crosses the edge between two corners.
    double cross(double a, double b, double level) =>
        (a == b) ? 0.5 : ((level - a) / (b - a)).clamp(0.0, 1.0);

    for (var l = 1; l <= widget.levels; l++) {
      final level = l / (widget.levels + 1);
      for (var r = 0; r < rows; r++) {
        for (var c = 0; c < cols; c++) {
          final tl = field[r][c],
              tr = field[r][c + 1],
              br = field[r + 1][c + 1],
              bl = field[r + 1][c];
          final kind =
              (tl > level ? 8 : 0) |
              (tr > level ? 4 : 0) |
              (br > level ? 2 : 0) |
              (bl > level ? 1 : 0);
          if (kind == 0 || kind == 15) continue;
          final x = c * cell, y = r * cell;
          final top = Offset(x + cross(tl, tr, level) * cell, y);
          final right = Offset(x + cell, y + cross(tr, br, level) * cell);
          final bottom = Offset(x + cross(bl, br, level) * cell, y + cell);
          final left = Offset(x, y + cross(tl, bl, level) * cell);
          void line(Offset a, Offset b) => path
            ..moveTo(a.dx, a.dy)
            ..lineTo(b.dx, b.dy);
          switch (kind) {
            case 1 || 14:
              line(left, bottom);
            case 2 || 13:
              line(bottom, right);
            case 3 || 12:
              line(left, right);
            case 4 || 11:
              line(top, right);
            case 6 || 9:
              line(top, bottom);
            case 7 || 8:
              line(left, top);
            case 5:
              line(left, top);
              line(bottom, right);
            case 10:
              line(left, bottom);
              line(top, right);
          }
        }
      }
    }
    canvas.drawPath(path, paint);
  }

  @override
  bool shouldRepaint(_Contours old) => old.widget != widget;
}
