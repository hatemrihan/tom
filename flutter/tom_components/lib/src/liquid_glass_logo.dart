import 'dart:ui' show ImageFilter;

import 'package:flutter/material.dart';

import 'tom_style.dart';

/// A logo reveal: a droplet falls and splashes into a glass tile around the
/// logo, ripples spread out, then the glass and waves dissolve, leaving the
/// plain logo at its normal size.
class LiquidGlassLogo extends StatefulWidget {
  const LiquidGlassLogo({
    super.key,
    required this.child,
    this.duration = const Duration(milliseconds: 3200),
    this.size = 168,
    this.onComplete,
  });

  /// Your logo: an image, an icon, text.
  final Widget child;

  /// Total length of the intro.
  final Duration duration;

  /// Size of the glass tile.
  final double size;
  final VoidCallback? onComplete;

  @override
  State<LiquidGlassLogo> createState() => LiquidGlassLogoState();
}

class LiquidGlassLogoState extends State<LiquidGlassLogo>
    with SingleTickerProviderStateMixin {
  late final AnimationController _t =
      AnimationController(vsync: this, duration: widget.duration)
        ..forward().whenComplete(() {
          if (mounted) widget.onComplete?.call();
        });

  /// Play the intro again.
  void replay() => _t.forward(from: 0);

  /// A slice of the timeline as its own 0 to 1 animation.
  Animation<double> _part(double from, double to, [Curve curve = Tom.ease]) =>
      CurvedAnimation(
        parent: _t,
        curve: Interval(from, to, curve: curve),
      );

  @override
  void dispose() {
    _t.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final size = widget.size;
    final drop = _part(0, 0.18, Curves.easeIn);
    final tileIn = _part(0.16, 0.36, Curves.easeOutBack);
    final ripple = _part(0.2, 0.75, Curves.easeOut);
    final dissolve = _part(0.7, 1, Curves.easeInOut);
    final logoIn = _part(0.2, 0.4);

    return SizedBox.square(
      dimension: size * 1.6,
      child: AnimatedBuilder(
        animation: _t,
        builder: (context, _) => Stack(
          alignment: Alignment.center,
          clipBehavior: Clip.none,
          children: [
            // Ripples spreading from the splash.
            for (var i = 0; i < 3; i++)
              Builder(
                builder: (context) {
                  final v = ((ripple.value * 1.4) - i * 0.2).clamp(0.0, 1.0);
                  return Opacity(
                    opacity:
                        (v == 0 ? 0 : (1 - v) * 0.5) * (1 - dissolve.value),
                    child: Container(
                      width: size * (0.9 + v * 0.7),
                      height: size * (0.9 + v * 0.7),
                      decoration: BoxDecoration(
                        borderRadius: BorderRadius.circular(
                          size * 0.3 * (1 + v),
                        ),
                        border: Border.all(
                          color: Tom.ink.withValues(alpha: 0.35),
                        ),
                      ),
                    ),
                  );
                },
              ),
            // The glass tile.
            Opacity(
              opacity: tileIn.value.clamp(0.0, 1.0) * (1 - dissolve.value),
              child: Transform.scale(
                scale: 0.4 + 0.6 * tileIn.value,
                child: ClipRRect(
                  borderRadius: BorderRadius.circular(size * 0.28),
                  child: BackdropFilter(
                    filter: ImageFilter.blur(sigmaX: 14, sigmaY: 14),
                    child: Container(
                      width: size,
                      height: size,
                      decoration: BoxDecoration(
                        borderRadius: BorderRadius.circular(size * 0.28),
                        gradient: const LinearGradient(
                          begin: Alignment.topLeft,
                          end: Alignment.bottomRight,
                          colors: [Color(0x99FFFFFF), Color(0x26FFFFFF)],
                        ),
                        border: Border.all(color: const Color(0x80FFFFFF)),
                        boxShadow: const [
                          BoxShadow(
                            color: Color(0x26000000),
                            blurRadius: 40,
                            offset: Offset(0, 20),
                            spreadRadius: -18,
                          ),
                        ],
                      ),
                    ),
                  ),
                ),
              ),
            ),
            // The logo: slightly magnified behind the glass, settling to normal as it dissolves.
            Opacity(
              opacity: logoIn.value,
              child: Transform.scale(
                scale: 0.8 + 0.28 * logoIn.value - 0.08 * dissolve.value,
                child: widget.child,
              ),
            ),
            // The droplet.
            if (drop.value < 1)
              Positioned(
                top: size * 1.6 / 2 * drop.value - 7,
                child: Opacity(
                  opacity: drop.value < 0.9 ? 1 : (1 - drop.value) * 10,
                  child: Container(
                    width: 10,
                    height: 14,
                    decoration: BoxDecoration(
                      color: Tom.ink.withValues(alpha: 0.75),
                      borderRadius: BorderRadius.circular(7),
                    ),
                  ),
                ),
              ),
          ],
        ),
      ),
    );
  }
}
