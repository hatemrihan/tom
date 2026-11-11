import 'package:flutter/material.dart';

import 'tom_qr.dart';
import 'tom_style.dart';

class TicketDetail {
  const TicketDetail(this.label, this.value);

  final String label;
  final String value;
}

/// A tall event ticket kept plain: one coloured panel with a large date, the
/// facts in small capitals, a perforation, and a stub with a real QR code.
class EventTicket extends StatelessWidget {
  const EventTicket({
    super.key,
    required this.title,
    required this.day,
    required this.month,
    required this.number,
    required this.qr,
    this.kicker,
    this.details = const [],
    this.color = Tom.blue,
    this.onColor = Tom.paper,
    this.paper = const Color(0xFFF6F4EE),
    this.width = 220,
  });

  /// Small line above the date: the series, the organiser.
  final String? kicker;
  final String title;

  /// The big figure in the coloured panel, usually the day of the month.
  final String day;

  /// Under the figure: month and year, or a weekday.
  final String month;

  /// Labelled facts, two per row: day, doors, venue, seat.
  final List<TicketDetail> details;
  final String number;

  /// What the QR code opens or contains.
  final String qr;
  final Color color;

  /// Text colour on the panel.
  final Color onColor;
  final Color paper;
  final double width;

  static const _stone = Color(0xFF1C1917);
  static const _stub = 112.0;

  @override
  Widget build(BuildContext context) {
    final small = Tom.label(color: _stone, size: 10);
    final quiet = Tom.label(
      color: const Color(0xFF78716C),
      weight: FontWeight.w400,
      size: 10,
    );

    return Semantics(
      label: 'Ticket, $title, $day $month',
      child: SizedBox(
        width: width,
        child: ClipPath(
          clipper: const _Notched(_stub),
          child: ColoredBox(
            color: paper,
            child: Column(
              mainAxisSize: MainAxisSize.min,
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                // The coloured panel: the date, large.
                Padding(
                  padding: const EdgeInsets.all(8),
                  child: AspectRatio(
                    aspectRatio: 1,
                    child: Container(
                      decoration: BoxDecoration(
                        color: color,
                        borderRadius: BorderRadius.circular(6),
                      ),
                      padding: const EdgeInsets.all(12),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Row(
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            children: [
                              Flexible(
                                child: Text(
                                  Tom.caps(kicker ?? ''),
                                  style: Tom.label(color: onColor, size: 10),
                                  maxLines: 1,
                                  overflow: TextOverflow.ellipsis,
                                ),
                              ),
                              const SizedBox(width: 8),
                              Text(
                                'ADMIT ONE',
                                style: Tom.label(
                                  color: onColor.withValues(alpha: 0.7),
                                  weight: FontWeight.w400,
                                  size: 10,
                                ),
                              ),
                            ],
                          ),
                          Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                day,
                                style: TextStyle(
                                  fontSize: 84,
                                  height: 0.8,
                                  letterSpacing: -5,
                                  fontWeight: FontWeight.w500,
                                  color: onColor,
                                  decoration: TextDecoration.none,
                                ),
                              ),
                              const SizedBox(height: 8),
                              Text(
                                Tom.caps(month),
                                style: Tom.label(color: onColor, size: 10),
                              ),
                            ],
                          ),
                        ],
                      ),
                    ),
                  ),
                ),
                Padding(
                  padding: const EdgeInsets.fromLTRB(16, 8, 16, 16),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        Tom.caps(title),
                        style: Tom.label(
                          color: _stone,
                          size: 13,
                        ).copyWith(height: 1.2),
                      ),
                      const SizedBox(height: 16),
                      Wrap(
                        runSpacing: 10,
                        children: [
                          for (final d in details)
                            SizedBox(
                              width: (width - 32) / 2,
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Text(Tom.caps(d.label), style: quiet),
                                  Text(Tom.caps(d.value), style: small),
                                ],
                              ),
                            ),
                        ],
                      ),
                    ],
                  ),
                ),
                const Padding(
                  padding: EdgeInsets.symmetric(horizontal: 16),
                  child: _Perforation(),
                ),
                SizedBox(
                  height: _stub,
                  child: Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 16),
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Expanded(
                          child: FittedBox(
                            fit: BoxFit.scaleDown,
                            alignment: Alignment.centerLeft,
                            child: Column(
                              mainAxisAlignment: MainAxisAlignment.center,
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text('NO.', style: quiet),
                                Text(
                                  number,
                                  style: small.copyWith(
                                    fontFeatures: const [
                                      FontFeature.tabularFigures(),
                                    ],
                                  ),
                                ),
                                const SizedBox(height: 8),
                                Text('SCAN AT THE DOOR', style: quiet),
                              ],
                            ),
                          ),
                        ),
                        const SizedBox(width: 12),
                        TomQr(data: qr, size: 72, color: _stone),
                      ],
                    ),
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}

class _Perforation extends StatelessWidget {
  const _Perforation();

  @override
  Widget build(BuildContext context) =>
      SizedBox(height: 1, child: CustomPaint(painter: _Dashes()));
}

class _Dashes extends CustomPainter {
  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint()..color = const Color(0xFFD6D3D1);
    for (var x = 0.0; x < size.width; x += 6) {
      canvas.drawRect(Rect.fromLTWH(x, 0, 3, 1), paint);
    }
  }

  @override
  bool shouldRepaint(_Dashes old) => false;
}

/// Rounded corners, and a round bite out of each edge where the stub tears off.
class _Notched extends CustomClipper<Path> {
  const _Notched(this.stub);
  final double stub;

  @override
  Path getClip(Size size) {
    final shape = Path()
      ..addRRect(
        RRect.fromRectAndRadius(Offset.zero & size, const Radius.circular(10)),
      );
    final y = size.height - stub;
    final bites = Path()
      ..addOval(Rect.fromCircle(center: Offset(0, y), radius: 7))
      ..addOval(Rect.fromCircle(center: Offset(size.width, y), radius: 7));
    return Path.combine(PathOperation.difference, shape, bites);
  }

  @override
  bool shouldReclip(_Notched old) => old.stub != stub;
}
