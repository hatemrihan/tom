import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

import 'tom_style.dart';

/// A ruler for reading progress: a needle glides over ticks that swell as it
/// passes. Tap or drag it to jump; arrow keys move a tenth at a time.
class TickScrollbar extends StatefulWidget {
  const TickScrollbar({
    super.key,
    required this.controller,
    this.ticks = 40,
    this.color = Tom.ink,
  });

  /// The scroll view to follow and control.
  final ScrollController controller;
  final int ticks;
  final Color color;

  @override
  State<TickScrollbar> createState() => _TickScrollbarState();
}

class _TickScrollbarState extends State<TickScrollbar> {
  double _progress = 0;

  @override
  void initState() {
    super.initState();
    widget.controller.addListener(_read);
    WidgetsBinding.instance.addPostFrameCallback((_) => _read());
  }

  @override
  void didUpdateWidget(TickScrollbar old) {
    super.didUpdateWidget(old);
    if (old.controller != widget.controller) {
      old.controller.removeListener(_read);
      widget.controller.addListener(_read);
    }
  }

  void _read() {
    if (!mounted || !widget.controller.hasClients) return;
    final position = widget.controller.position;
    final max = position.maxScrollExtent;
    final next = max <= 0 ? 0.0 : (position.pixels / max).clamp(0.0, 1.0);
    if ((next - _progress).abs() > 0.001) setState(() => _progress = next);
  }

  void _jump(double fraction, {bool animate = true}) {
    if (!widget.controller.hasClients) return;
    final target =
        fraction.clamp(0.0, 1.0) * widget.controller.position.maxScrollExtent;
    if (animate) {
      widget.controller.animateTo(
        target,
        duration: const Duration(milliseconds: 350),
        curve: Tom.ease,
      );
    } else {
      widget.controller.jumpTo(target);
    }
  }

  @override
  void dispose() {
    widget.controller.removeListener(_read);
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final percent = (_progress * 100).round();
    return Row(
      children: [
        Expanded(
          child: Semantics(
            slider: true,
            label: 'Reading progress',
            value: '$percent%',
            child: Focus(
              onKeyEvent: (node, event) {
                if (event is! KeyDownEvent) return KeyEventResult.ignored;
                if (event.logicalKey == LogicalKeyboardKey.arrowRight) {
                  _jump(_progress + 0.1);
                }
                if (event.logicalKey == LogicalKeyboardKey.arrowLeft) {
                  _jump(_progress - 0.1);
                }
                return KeyEventResult.ignored;
              },
              child: LayoutBuilder(
                builder: (context, box) => MouseRegion(
                  cursor: SystemMouseCursors.click,
                  child: GestureDetector(
                    behavior: HitTestBehavior.opaque,
                    onTapUp: (d) => _jump(d.localPosition.dx / box.maxWidth),
                    onHorizontalDragUpdate: (d) => _jump(
                      d.localPosition.dx / box.maxWidth,
                      animate: false,
                    ),
                    child: SizedBox(
                      height: 20,
                      child: CustomPaint(
                        size: Size(box.maxWidth, 20),
                        painter: _Ruler(
                          progress: _progress,
                          ticks: widget.ticks,
                          color: widget.color,
                        ),
                      ),
                    ),
                  ),
                ),
              ),
            ),
          ),
        ),
        const SizedBox(width: 16),
        SizedBox(
          width: 32,
          child: Text(
            '$percent%',
            textAlign: TextAlign.right,
            style: Tom.label(
              color: widget.color.withValues(alpha: 0.6),
              weight: FontWeight.w400,
            ).copyWith(fontFeatures: const [FontFeature.tabularFigures()]),
          ),
        ),
      ],
    );
  }
}

class _Ruler extends CustomPainter {
  const _Ruler({
    required this.progress,
    required this.ticks,
    required this.color,
  });

  final double progress;
  final int ticks;
  final Color color;

  @override
  void paint(Canvas canvas, Size size) {
    final mid = size.height / 2;
    for (var i = 0; i < ticks; i++) {
      final t = i / (ticks - 1);
      final near = (1 - (t - progress).abs() * ticks * 0.3).clamp(0.0, 1.0);
      final h = 5 + near * 9 + (i % 5 == 0 ? 3 : 0);
      final x = t * size.width;
      canvas.drawLine(
        Offset(x, mid - h / 2),
        Offset(x, mid + h / 2),
        Paint()..color = color.withValues(alpha: 0.25 + near * 0.75),
      );
    }
    final x = progress * size.width;
    canvas.drawLine(
      Offset(x, 0),
      Offset(x, size.height),
      Paint()
        ..color = color
        ..strokeWidth = 2,
    );
  }

  @override
  bool shouldRepaint(_Ruler old) =>
      old.progress != progress || old.ticks != ticks || old.color != color;
}

/// A scroll area with the ruler in its own footer row, so it never sits on
/// top of the text.
class TickScrollArea extends StatefulWidget {
  const TickScrollArea({
    super.key,
    required this.child,
    this.ticks = 40,
    this.color = Tom.ink,
    this.padding = const EdgeInsets.all(24),
  });

  final Widget child;
  final int ticks;
  final Color color;
  final EdgeInsets padding;

  @override
  State<TickScrollArea> createState() => _TickScrollAreaState();
}

class _TickScrollAreaState extends State<TickScrollArea> {
  final _controller = ScrollController();

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        Expanded(
          child: SingleChildScrollView(
            controller: _controller,
            padding: widget.padding,
            child: widget.child,
          ),
        ),
        Container(
          decoration: BoxDecoration(
            border: Border(
              top: BorderSide(color: widget.color.withValues(alpha: 0.1)),
            ),
          ),
          padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 12),
          child: TickScrollbar(
            controller: _controller,
            ticks: widget.ticks,
            color: widget.color,
          ),
        ),
      ],
    );
  }
}
