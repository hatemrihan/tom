import 'dart:async';

import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

import 'tom_style.dart';

/// A deliberate destructive action: the button fills while it is held and
/// drains back if released early. Works with touch, mouse and keyboard
/// (hold Space or Enter).
class HoldToConfirm extends StatefulWidget {
  const HoldToConfirm({
    super.key,
    required this.label,
    required this.onConfirm,
    this.confirmedLabel = 'Confirmed',
    this.holdDuration = const Duration(milliseconds: 1200),
    this.resetAfter,
    this.color = Tom.danger,
    this.enabled = true,
  });

  final String label;
  final VoidCallback onConfirm;
  final String confirmedLabel;

  /// How long the button must be held.
  final Duration holdDuration;

  /// Return to the resting state this long after confirming. Null keeps it confirmed.
  final Duration? resetAfter;
  final Color color;
  final bool enabled;

  @override
  State<HoldToConfirm> createState() => _HoldToConfirmState();
}

class _HoldToConfirmState extends State<HoldToConfirm>
    with SingleTickerProviderStateMixin {
  late final AnimationController _fill = AnimationController(
    vsync: this,
    duration: widget.holdDuration,
    reverseDuration: const Duration(milliseconds: 300),
  )..addStatusListener(_onStatus);
  bool _confirmed = false;
  Timer? _reset;

  void _onStatus(AnimationStatus status) {
    if (status != AnimationStatus.completed || _confirmed) return;
    setState(() => _confirmed = true);
    HapticFeedback.mediumImpact();
    widget.onConfirm();
    final after = widget.resetAfter;
    if (after != null) {
      _reset = Timer(after, () {
        if (!mounted) return;
        setState(() => _confirmed = false);
        _fill.value = 0;
      });
    }
  }

  void _press() {
    if (widget.enabled && !_confirmed) _fill.forward();
  }

  void _release() {
    if (!_confirmed) _fill.reverse();
  }

  KeyEventResult _onKey(FocusNode node, KeyEvent event) {
    final key = event.logicalKey;
    if (key != LogicalKeyboardKey.space && key != LogicalKeyboardKey.enter) {
      return KeyEventResult.ignored;
    }
    if (event is KeyDownEvent) _press();
    if (event is KeyUpEvent) _release();
    return KeyEventResult.handled;
  }

  @override
  void dispose() {
    _reset?.cancel();
    _fill.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final color = widget.color;
    final text = Tom.caps(_confirmed ? widget.confirmedLabel : widget.label);

    Widget face(Color background, Color foreground) => Container(
      height: 36,
      constraints: const BoxConstraints(minWidth: 160),
      padding: const EdgeInsets.symmetric(horizontal: 16),
      alignment: Alignment.center,
      color: background,
      child: Text(text, style: Tom.label(color: foreground)),
    );

    return Semantics(
      button: true,
      enabled: widget.enabled,
      label: widget.label,
      hint: 'Press and hold to confirm',
      child: Focus(
        onKeyEvent: _onKey,
        child: MouseRegion(
          cursor: widget.enabled
              ? SystemMouseCursors.click
              : SystemMouseCursors.basic,
          child: GestureDetector(
            onTapDown: (_) => _press(),
            onTapUp: (_) => _release(),
            onTapCancel: _release,
            child: Opacity(
              opacity: widget.enabled ? 1 : 0.5,
              child: DecoratedBox(
                decoration: ShapeDecoration(
                  shape: StadiumBorder(
                    side: BorderSide(color: color.withValues(alpha: 0.3)),
                  ),
                ),
                child: ClipPath(
                  clipper: const ShapeBorderClipper(shape: StadiumBorder()),
                  child: AnimatedBuilder(
                    animation: _fill,
                    builder: (context, _) => Stack(
                      children: [
                        face(color.withValues(alpha: 0.06), color),
                        // The filled copy, revealed from the left as the hold progresses.
                        Positioned.fill(
                          child: ClipRect(
                            clipper: _LeftClipper(_confirmed ? 1 : _fill.value),
                            child: face(color, Tom.paper),
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
              ),
            ),
          ),
        ),
      ),
    );
  }
}

class _LeftClipper extends CustomClipper<Rect> {
  const _LeftClipper(this.fraction);
  final double fraction;

  @override
  Rect getClip(Size size) =>
      Rect.fromLTWH(0, 0, size.width * fraction, size.height);

  @override
  bool shouldReclip(_LeftClipper old) => old.fraction != fraction;
}
