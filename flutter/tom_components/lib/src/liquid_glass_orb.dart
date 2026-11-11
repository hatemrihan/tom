import 'dart:math' as math;
import 'dart:ui' show ImageFilter;

import 'package:flutter/material.dart';

enum OrbState { idle, listening, thinking, speaking }

/// An assistant orb: coloured liquid drifts and merges inside a glass
/// sphere, moving differently in each state, and swelling with [level].
class LiquidGlassOrb extends StatefulWidget {
  const LiquidGlassOrb({
    super.key,
    this.state = OrbState.idle,
    this.level = 0,
    this.size = 160,
    this.colors = const [
      Color(0xFF7C5CFF),
      Color(0xFF21D4FD),
      Color(0xFFFF5FA2),
    ],
  });

  final OrbState state;

  /// Live loudness from 0 to 1, for example from a microphone. The orb swells with it.
  final double level;
  final double size;

  /// Colours of the liquid inside the orb.
  final List<Color> colors;

  @override
  State<LiquidGlassOrb> createState() => _LiquidGlassOrbState();
}

class _LiquidGlassOrbState extends State<LiquidGlassOrb>
    with SingleTickerProviderStateMixin {
  late final AnimationController _clock = AnimationController(
    vsync: this,
    duration: const Duration(seconds: 60),
  )..repeat();

  /// How fast the liquid moves and how far it travels, per state.
  ({double speed, double reach}) get _motion => switch (widget.state) {
    OrbState.idle => (speed: 1, reach: 10),
    OrbState.listening => (speed: 1.8, reach: 16),
    OrbState.thinking => (speed: 3.6, reach: 22),
    OrbState.speaking => (speed: 2.8, reach: 18),
  };

  @override
  void dispose() {
    _clock.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final size = widget.size;
    final level = widget.level.clamp(0.0, 1.0);

    return Semantics(
      image: true,
      label: 'Assistant is ${widget.state.name}',
      child: AnimatedScale(
        scale: 1 + level * 0.16,
        duration: const Duration(milliseconds: 90),
        child: SizedBox.square(
          dimension: size,
          child: Stack(
            fit: StackFit.expand,
            children: [
              // Liquid: soft blobs, blurred together.
              ClipOval(
                child: ColoredBox(
                  color: const Color(0xFF0A0A0A),
                  child: ImageFiltered(
                    imageFilter: ImageFilter.blur(
                      sigmaX: size / 9,
                      sigmaY: size / 9,
                    ),
                    child: AnimatedBuilder(
                      animation: _clock,
                      builder: (context, _) => CustomPaint(
                        painter: _Liquid(
                          time: _clock.value * 60 * _motion.speed,
                          reach: _motion.reach * size / 160,
                          colors: widget.colors,
                        ),
                      ),
                    ),
                  ),
                ),
              ),
              // Glass: a highlight top-left, a rim, and a shadow underneath.
              IgnorePointer(
                child: DecoratedBox(
                  decoration: BoxDecoration(
                    shape: BoxShape.circle,
                    gradient: const RadialGradient(
                      center: Alignment(-0.4, -0.56),
                      radius: 0.34,
                      colors: [
                        Color(0xBFFFFFFF),
                        Color(0x26FFFFFF),
                        Color(0x00FFFFFF),
                      ],
                      stops: [0.18, 0.5, 1],
                    ),
                    border: Border.all(color: const Color(0x2EFFFFFF)),
                    boxShadow: [
                      BoxShadow(
                        color: widget.colors.first.withValues(alpha: 0.45),
                        blurRadius: 50,
                        offset: const Offset(0, 20),
                        spreadRadius: -15,
                      ),
                    ],
                  ),
                ),
              ),
              if (widget.state == OrbState.thinking)
                AnimatedBuilder(
                  animation: _clock,
                  builder: (context, _) => Transform.rotate(
                    angle: _clock.value * 60 / 1.4 * 2 * math.pi,
                    child: CustomPaint(
                      painter: _Ring(
                        widget.colors.length > 1
                            ? widget.colors[1]
                            : widget.colors.first,
                      ),
                    ),
                  ),
                ),
            ],
          ),
        ),
      ),
    );
  }
}

class _Liquid extends CustomPainter {
  const _Liquid({
    required this.time,
    required this.reach,
    required this.colors,
  });

  final double time;
  final double reach;
  final List<Color> colors;

  @override
  void paint(Canvas canvas, Size size) {
    final centre = size.center(Offset.zero);
    for (var i = 0; i < colors.length; i++) {
      final phase = i / colors.length * 2 * math.pi;
      // Each blob circles the centre at its own pace, breathing in and out.
      final angle = phase + time * (0.7 + i * 0.13);
      final offset =
          Offset(math.cos(angle), math.sin(angle * 1.3)) * reach * 1.4;
      final radius =
          size.width * 0.275 * (1 + 0.12 * math.sin(time * 0.9 + phase));
      canvas.drawCircle(
        centre + offset,
        radius,
        Paint()..color = colors[i].withValues(alpha: 0.9),
      );
    }
  }

  @override
  bool shouldRepaint(_Liquid old) => old.time != time || old.reach != reach;
}

class _Ring extends CustomPainter {
  const _Ring(this.color);
  final Color color;

  @override
  void paint(Canvas canvas, Size size) {
    final rect = (Offset.zero & size).inflate(3);
    canvas.drawArc(
      rect,
      0,
      math.pi * 0.8,
      false,
      Paint()
        ..style = PaintingStyle.stroke
        ..strokeWidth = 2
        ..strokeCap = StrokeCap.round
        ..shader = SweepGradient(
          colors: [color.withValues(alpha: 0), color],
          stops: const [0, 0.4],
        ).createShader(rect),
    );
  }

  @override
  bool shouldRepaint(_Ring old) => old.color != color;
}
