import 'package:flutter/material.dart';

import 'tom_qr.dart';
import 'tom_style.dart';

/// A museum-style admission ticket: a paper body with a coloured strip, and a
/// dark stub with a serrated edge that leans away while pressed or hovered,
/// as if about to be torn off.
class AdmissionTicket extends StatefulWidget {
  const AdmissionTicket({
    super.key,
    required this.venue,
    required this.number,
    required this.date,
    required this.kind,
    required this.time,
    required this.qr,
    this.logo,
    this.accent = Tom.blue,
    this.onAccent = Tom.paper,
    this.paper = const Color(0xFFF6F4EE),
    this.width = 540,
  });

  /// Venue name under the logo (use "\n" for a second line).
  final String venue;

  /// Ticket number. Also drawn as the barcode.
  final String number;
  final String date;

  /// Ticket type, e.g. "General ticket".
  final String kind;
  final String time;

  /// What the QR codes open or contain.
  final String qr;
  final Widget? logo;
  final Color accent;

  /// Text colour on the strip.
  final Color onAccent;
  final Color paper;
  final double width;

  @override
  State<AdmissionTicket> createState() => _AdmissionTicketState();
}

class _AdmissionTicketState extends State<AdmissionTicket> {
  static const _stone = Color(0xFF1C1917);
  bool _lean = false;

  @override
  Widget build(BuildContext context) {
    final label = Tom.label(color: _stone);

    final body = ClipRRect(
      borderRadius: const BorderRadius.horizontal(
        left: Radius.circular(8),
        right: Radius.circular(3),
      ),
      child: ColoredBox(
        color: widget.paper,
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            Expanded(
              child: Padding(
                padding: const EdgeInsets.all(20),
                child: Row(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          if (widget.logo != null)
                            Padding(
                              padding: const EdgeInsets.only(bottom: 12),
                              child: SizedBox(
                                height: 44,
                                child: FittedBox(child: widget.logo),
                              ),
                            ),
                          Text(Tom.caps(widget.venue), style: label),
                        ],
                      ),
                    ),
                    Align(
                      alignment: Alignment.bottomRight,
                      child: Column(
                        mainAxisSize: MainAxisSize.min,
                        crossAxisAlignment: CrossAxisAlignment.end,
                        children: [
                          Container(
                            width: 96,
                            height: 10,
                            color: widget.accent,
                          ),
                          const SizedBox(height: 6),
                          FittedBox(
                            fit: BoxFit.scaleDown,
                            child: Text(
                              'NO. ${widget.number}',
                              style: label.copyWith(
                                fontFeatures: const [
                                  FontFeature.tabularFigures(),
                                ],
                              ),
                            ),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              ),
            ),
            Container(
              color: widget.accent,
              padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 12),
              child: Row(
                children: [
                  TomQr(data: widget.qr, size: 40, color: widget.onAccent),
                  const SizedBox(width: 20),
                  Expanded(
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        for (final t in [widget.date, widget.kind, widget.time])
                          Flexible(
                            child: Text(
                              Tom.caps(t),
                              style: Tom.label(color: widget.onAccent),
                              maxLines: 1,
                              overflow: TextOverflow.ellipsis,
                            ),
                          ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );

    final stub = ClipPath(
      clipper: const _Serrated(),
      child: Container(
        width: 170,
        color: _stone,
        padding: const EdgeInsets.fromLTRB(20, 16, 16, 16),
        child: Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Column(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                TomQr(data: widget.qr, size: 40, color: Tom.paper),
                TomBars(
                  value: widget.number,
                  count: 11,
                  height: 80,
                  color: Tom.paper,
                ),
              ],
            ),
            Flexible(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                crossAxisAlignment: CrossAxisAlignment.end,
                children: [
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.end,
                    children: [
                      Container(width: 48, height: 6, color: widget.accent),
                      const SizedBox(height: 4),
                      FittedBox(
                        fit: BoxFit.scaleDown,
                        child: Text(
                          widget.number,
                          style: Tom.label(color: Tom.paper, size: 9),
                        ),
                      ),
                    ],
                  ),
                  RotatedBox(
                    quarterTurns: 3,
                    child: Text(
                      Tom.caps(
                        '${widget.date}\n${widget.kind}\n${widget.time}',
                      ),
                      style: Tom.label(
                        color: Tom.paper,
                        size: 10,
                      ).copyWith(height: 1.6),
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );

    return Semantics(
      label:
          'Ticket, ${widget.venue.replaceAll('\n', ' ')}, ${widget.kind}, ${widget.date}, ${widget.time}',
      child: MouseRegion(
        onEnter: (_) => setState(() => _lean = true),
        onExit: (_) => setState(() => _lean = false),
        child: GestureDetector(
          onTapDown: (_) => setState(() => _lean = true),
          onTapUp: (_) => setState(() => _lean = false),
          onTapCancel: () => setState(() => _lean = false),
          child: SizedBox(
            width: widget.width,
            height: widget.width * 0.42,
            child: Row(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                Expanded(child: body),
                AnimatedSlide(
                  duration: const Duration(milliseconds: 500),
                  curve: Tom.ease,
                  offset: Offset(_lean ? 0.035 : 0, 0),
                  child: AnimatedRotation(
                    duration: const Duration(milliseconds: 500),
                    curve: Tom.ease,
                    turns: _lean ? 0.004 : 0,
                    alignment: Alignment.bottomLeft,
                    child: stub,
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

/// A rounded right side and small half-circle bites down the left edge.
class _Serrated extends CustomClipper<Path> {
  const _Serrated();

  @override
  Path getClip(Size size) {
    final shape = Path()
      ..addRRect(
        RRect.fromRectAndCorners(
          Offset.zero & size,
          topRight: const Radius.circular(8),
          bottomRight: const Radius.circular(8),
        ),
      );
    final bites = Path();
    for (var y = 6.0; y < size.height; y += 12) {
      bites.addOval(Rect.fromCircle(center: Offset(0, y), radius: 3.5));
    }
    return Path.combine(PathOperation.difference, shape, bites);
  }

  @override
  bool shouldReclip(_Serrated old) => false;
}
