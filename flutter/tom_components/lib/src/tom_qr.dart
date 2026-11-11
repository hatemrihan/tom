import 'package:flutter/widgets.dart';
import 'package:qr/qr.dart';

/// A real, scannable QR code painted in one colour.
class TomQr extends StatelessWidget {
  const TomQr({
    super.key,
    required this.data,
    this.size = 44,
    this.color = const Color(0xFF171717),
  });

  /// What the code opens or contains.
  final String data;
  final double size;
  final Color color;

  @override
  Widget build(BuildContext context) {
    return Semantics(
      image: true,
      label: 'QR code',
      child: SizedBox.square(
        dimension: size,
        child: CustomPaint(
          painter: _QrPainter(
            QrImage(QrCode(payload: QrPayload.fromString(data))),
            color,
          ),
        ),
      ),
    );
  }
}

class _QrPainter extends CustomPainter {
  const _QrPainter(this.image, this.color);

  final QrImage image;
  final Color color;

  @override
  void paint(Canvas canvas, Size size) {
    final n = image.moduleCount;
    final cell = size.width / n;
    final paint = Paint()
      ..color = color
      ..isAntiAlias = false;
    for (var row = 0; row < n; row++) {
      for (var col = 0; col < n; col++) {
        // A hair of overlap closes the gaps between cells at fractional sizes.
        if (image.isDark(row, col)) {
          canvas.drawRect(
            Rect.fromLTWH(col * cell, row * cell, cell + 0.3, cell + 0.3),
            paint,
          );
        }
      }
    }
  }

  @override
  bool shouldRepaint(_QrPainter old) =>
      old.image != image || old.color != color;
}

/// Bars derived from a number, for the look of a barcode. Decorative: it is
/// not a scannable symbology.
class TomBars extends StatelessWidget {
  const TomBars({
    super.key,
    required this.value,
    this.count = 34,
    this.height = 28,
    this.color = const Color(0xFF171717),
  });

  final String value;
  final int count;
  final double height;
  final Color color;

  /// A small, stable hash of the value and the bar's position.
  static int _width(String value, int i) {
    var h = 2166136261;
    for (final unit in '$value:$i'.codeUnits) {
      h = ((h ^ unit) * 16777619) & 0xFFFFFFFF;
    }
    return 1 + h % 3;
  }

  @override
  Widget build(BuildContext context) {
    return ExcludeSemantics(
      child: SizedBox(
        height: height,
        child: Row(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            for (var i = 0; i < count; i++)
              Padding(
                padding: EdgeInsets.only(left: i == 0 ? 0 : 2),
                child: SizedBox(
                  width: _width(value, i).toDouble(),
                  child: ColoredBox(color: color),
                ),
              ),
          ],
        ),
      ),
    );
  }
}
