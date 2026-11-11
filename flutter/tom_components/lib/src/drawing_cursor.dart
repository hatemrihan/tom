import 'dart:typed_data';
import 'dart:ui' as ui;

import 'package:flutter/material.dart';
import 'package:flutter/scheduler.dart';

import 'tom_style.dart';

enum DrawingMode {
  /// Moving the pointer leaves ink that evaporates.
  trail,

  /// Press and drag to draw; the ink stays and can be saved.
  draw,
}

/// An ink layer over any content. As a trail it tapers and evaporates behind
/// the pointer; in draw mode strokes stay and can be exported as a PNG.
class DrawingCursor extends StatefulWidget {
  const DrawingCursor({
    super.key,
    this.child,
    this.mode = DrawingMode.draw,
    this.color = Tom.ink,
    this.strokeWidth = 5,
    this.fade = const Duration(milliseconds: 900),
    this.controls = true,
    this.background = Tom.paper,
    this.onSave,
  });

  final Widget? child;
  final DrawingMode mode;
  final Color color;
  final double strokeWidth;

  /// Trail mode: how long the ink stays before fading out.
  final Duration fade;

  /// Draw mode: show the Clear and Save buttons.
  final bool controls;

  /// Colour the PNG is flattened onto.
  final Color background;

  /// Receives the PNG bytes when Save is pressed. Write them to a file, share
  /// them, or upload them: saving is different on every platform.
  final ValueChanged<Uint8List>? onSave;

  @override
  State<DrawingCursor> createState() => DrawingCursorState();
}

class _Point {
  const _Point(this.position, this.time);
  final Offset position;
  final Duration time;
}

class DrawingCursorState extends State<DrawingCursor>
    with SingleTickerProviderStateMixin {
  final List<List<Offset>> _strokes = [];
  final List<_Point> _trail = [];
  final _repaint = ValueNotifier<int>(0);
  late final Ticker _ticker = createTicker(_tick);
  Duration _now = Duration.zero;
  Size _size = Size.zero;

  bool get isEmpty => _strokes.isEmpty;

  void _tick(Duration elapsed) {
    _now = elapsed;
    _trail.removeWhere((p) => elapsed - p.time > widget.fade);
    _repaint.value++;
    if (_trail.isEmpty) _ticker.stop();
  }

  /// Remove every stroke.
  void clear() => setState(_strokes.clear);

  /// The drawing as PNG bytes, flattened onto [DrawingCursor.background].
  Future<Uint8List?> toPng({double pixelRatio = 2}) async {
    if (_size.isEmpty) return null;
    final recorder = ui.PictureRecorder();
    final canvas = Canvas(recorder)..scale(pixelRatio);
    canvas.drawRect(Offset.zero & _size, Paint()..color = widget.background);
    _Ink(
      strokes: _strokes,
      trail: const [],
      now: _now,
      widget: widget,
    ).paint(canvas, _size);
    final image = await recorder.endRecording().toImage(
      (_size.width * pixelRatio).round(),
      (_size.height * pixelRatio).round(),
    );
    final data = await image.toByteData(format: ui.ImageByteFormat.png);
    image.dispose();
    return data?.buffer.asUint8List();
  }

  Future<void> _save() async {
    final bytes = await toPng();
    if (bytes != null) widget.onSave?.call(bytes);
  }

  @override
  void dispose() {
    _ticker.dispose();
    _repaint.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final drawing = widget.mode == DrawingMode.draw;
    return LayoutBuilder(
      builder: (context, box) {
        _size = box.biggest;
        return Stack(
          fit: StackFit.passthrough,
          children: [
            if (widget.child != null) widget.child!,
            Positioned.fill(
              child: MouseRegion(
                cursor: drawing
                    ? SystemMouseCursors.precise
                    : MouseCursor.defer,
                onHover: drawing
                    ? null
                    : (e) {
                        _trail.add(_Point(e.localPosition, _now));
                        if (!_ticker.isActive) _ticker.start();
                      },
                child: GestureDetector(
                  behavior: drawing
                      ? HitTestBehavior.opaque
                      : HitTestBehavior.translucent,
                  onPanStart: drawing
                      ? (d) => setState(() => _strokes.add([d.localPosition]))
                      : null,
                  onPanUpdate: drawing
                      ? (d) {
                          _strokes.last.add(d.localPosition);
                          _repaint.value++;
                        }
                      : null,
                  onTapUp: drawing
                      ? (d) => setState(() => _strokes.add([d.localPosition]))
                      : null,
                  child: RepaintBoundary(
                    child: CustomPaint(
                      painter: _Ink(
                        strokes: _strokes,
                        trail: _trail,
                        now: _now,
                        widget: widget,
                        repaint: _repaint,
                      ),
                    ),
                  ),
                ),
              ),
            ),
            if (drawing && widget.controls)
              Positioned(
                right: 12,
                bottom: 12,
                child: Row(
                  children: [
                    _Pill(
                      label: 'Clear',
                      onTap: isEmpty ? null : clear,
                      color: widget.color,
                    ),
                    const SizedBox(width: 6),
                    _Pill(
                      label: 'Save PNG',
                      onTap: isEmpty ? null : _save,
                      color: widget.color,
                    ),
                  ],
                ),
              ),
          ],
        );
      },
    );
  }
}

class _Pill extends StatelessWidget {
  const _Pill({required this.label, required this.onTap, required this.color});

  final String label;
  final VoidCallback? onTap;
  final Color color;

  @override
  Widget build(BuildContext context) {
    return Semantics(
      button: true,
      enabled: onTap != null,
      child: MouseRegion(
        cursor: onTap == null
            ? SystemMouseCursors.basic
            : SystemMouseCursors.click,
        child: GestureDetector(
          onTap: onTap,
          child: Opacity(
            opacity: onTap == null ? 0.4 : 1,
            child: Container(
              padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
              decoration: ShapeDecoration(
                color: color.withValues(alpha: 0.06),
                shape: const StadiumBorder(),
              ),
              child: Text(Tom.caps(label), style: Tom.label(color: color)),
            ),
          ),
        ),
      ),
    );
  }
}

class _Ink extends CustomPainter {
  _Ink({
    required this.strokes,
    required this.trail,
    required this.now,
    required this.widget,
    super.repaint,
  });

  final List<List<Offset>> strokes;
  final List<_Point> trail;
  final Duration now;
  final DrawingCursor widget;

  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint()
      ..color = widget.color
      ..style = PaintingStyle.stroke
      ..strokeWidth = widget.strokeWidth
      ..strokeCap = StrokeCap.round
      ..strokeJoin = StrokeJoin.round;

    for (final stroke in strokes) {
      if (stroke.length == 1) {
        canvas.drawCircle(
          stroke.first,
          widget.strokeWidth / 2,
          Paint()..color = widget.color,
        );
        continue;
      }
      final path = Path()..moveTo(stroke.first.dx, stroke.first.dy);
      for (var i = 1; i < stroke.length; i++) {
        // Curve through the midpoints so the line is smooth, not jointed.
        final mid = (stroke[i - 1] + stroke[i]) / 2;
        path.quadraticBezierTo(
          stroke[i - 1].dx,
          stroke[i - 1].dy,
          mid.dx,
          mid.dy,
        );
      }
      path.lineTo(stroke.last.dx, stroke.last.dy);
      canvas.drawPath(path, paint);
    }

    final fade = widget.fade.inMicroseconds;
    for (var i = 1; i < trail.length; i++) {
      final a = trail[i - 1], b = trail[i];
      if ((b.time - a.time).inMilliseconds > 80) {
        continue; // a pause starts a new stroke
      }
      final life = (1 - (now - b.time).inMicroseconds / fade).clamp(0.0, 1.0);
      canvas.drawLine(
        a.position,
        b.position,
        paint
          ..color = widget.color.withValues(alpha: life)
          ..strokeWidth = widget.strokeWidth * (0.3 + 0.7 * life),
      );
    }
  }

  @override
  bool shouldRepaint(_Ink old) => true;
}
