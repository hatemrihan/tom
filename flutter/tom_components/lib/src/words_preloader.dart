import 'dart:math' as math;

import 'package:flutter/material.dart';

import 'tom_style.dart';

/// A preloader that says a few words, one at a time, then lifts away with a
/// bowed lower edge to reveal the page underneath.
class WordsPreloader extends StatefulWidget {
  const WordsPreloader({
    super.key,
    required this.child,
    this.words = const [
      'Hello',
      'أهلاً',
      'Bonjour',
      'Ciao',
      'Hola',
      'こんにちは',
      'Hallo',
      'Olá',
    ],
    this.label = 'Loading',
    this.count = true,
    this.color = const Color(0xFFE7E2D9),
    this.onColor = const Color(0xFF1C1917),
    this.size = 56,
    this.first = const Duration(milliseconds: 1000),
    this.pace = const Duration(milliseconds: 180),
    this.hold = const Duration(milliseconds: 500),
    this.lift = const Duration(milliseconds: 900),
    this.curve = 0.3,
    this.onComplete,
  });

  /// The page underneath.
  final Widget child;

  /// Shown one after another. The first fades in, the rest cut.
  final List<String> words;

  /// Small line at the bottom left.
  final String label;

  /// Show where it is in the list, such as 03/08.
  final bool count;

  /// Colour of the cover.
  final Color color;

  /// Colour of what is written on the cover.
  final Color onColor;

  /// Size of the word.
  final double size;

  /// How long the first word stays.
  final Duration first;

  /// How long each word after it stays.
  final Duration pace;

  /// How long the last word stays before the cover lifts.
  final Duration hold;

  /// How long the lift takes.
  final Duration lift;

  /// How far the lower edge bows while it lifts, from 0 (flat) to 1.
  final double curve;
  final VoidCallback? onComplete;

  @override
  State<WordsPreloader> createState() => WordsPreloaderState();
}

class WordsPreloaderState extends State<WordsPreloader>
    with SingleTickerProviderStateMixin {
  late final AnimationController _clock = AnimationController(
    vsync: this,
    duration: _total,
  );
  bool _done = false;

  int get _length => math.max(1, widget.words.length);

  /// When word [i] appears.
  Duration _start(int i) =>
      i == 0 ? Duration.zero : widget.first + widget.pace * (i - 1);

  Duration get _liftAt =>
      _length > 1 ? _start(_length - 1) + widget.hold : widget.first;

  Duration get _total => _liftAt + widget.lift;

  /// How far below its place the page waits before it settles.
  static const double _rise = 48;

  /// How far through the lift it is, from 0 to 1, eased.
  double get _lifted {
    final t = _clock.value * _total.inMicroseconds;
    final p = ((t - _liftAt.inMicroseconds) / widget.lift.inMicroseconds).clamp(
      0.0,
      1.0,
    );
    return Curves.easeInOutQuart.transform(p);
  }

  @override
  void initState() {
    super.initState();
    _run();
  }

  /// Play the whole sequence again.
  void replay() {
    setState(() => _done = false);
    _run();
  }

  Future<void> _run() async {
    _clock.duration = _total;
    await _clock.forward(from: 0).orCancel.catchError((_) {});
    if (!mounted) return;
    setState(() => _done = true);
    widget.onComplete?.call();
  }

  @override
  void dispose() {
    _clock.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final still = MediaQuery.disableAnimationsOf(context);
    return Stack(
      fit: StackFit.passthrough,
      children: [
        // The page settles upward as the cover leaves. It keeps its place in
        // the tree throughout, so nothing in it is rebuilt when the cover goes.
        ClipRect(
          clipBehavior: _done ? Clip.none : Clip.hardEdge,
          child: AnimatedBuilder(
            animation: _clock,
            child: widget.child,
            builder: (context, child) => Transform.translate(
              offset: Offset(0, _done || still ? 0 : (1 - _lifted) * _rise),
              child: child,
            ),
          ),
        ),
        if (!_done)
          Positioned.fill(
            child: Semantics(
              label: widget.label,
              liveRegion: true,
              child: ClipRect(
                child: AnimatedBuilder(
                  animation: _clock,
                  builder: (context, _) => _cover(still),
                ),
              ),
            ),
          ),
      ],
    );
  }

  /// Every frame is worked out from one number: the time.
  Widget _cover(bool still) {
    final t = _clock.value * _total.inMicroseconds;
    var index = 0;
    for (var i = 0; i < _length; i++) {
      if (t >= _start(i).inMicroseconds) index = i;
    }
    final p = ((t - _liftAt.inMicroseconds) / widget.lift.inMicroseconds).clamp(
      0.0,
      1.0,
    );
    final e = _lifted;
    final fadeIn = index == 0
        ? (t / (widget.first.inMicroseconds * 0.45)).clamp(0.0, 1.0)
        : 1.0;
    final word = widget.words.isEmpty ? '' : widget.words[index];

    final written = Stack(
      fit: StackFit.expand,
      children: [
        Center(
          child: Padding(
            padding: const EdgeInsets.symmetric(horizontal: 24),
            child: Text(
              word,
              textAlign: TextAlign.center,
              style: TextStyle(
                fontSize: widget.size,
                height: 1,
                fontWeight: FontWeight.w500,
                letterSpacing: widget.size * -0.03,
                color: widget.onColor.withValues(alpha: fadeIn),
                decoration: TextDecoration.none,
              ),
            ),
          ),
        ),
        Positioned(
          left: 20,
          right: 20,
          bottom: 16,
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            crossAxisAlignment: CrossAxisAlignment.end,
            children: [
              Text(
                Tom.caps(widget.label),
                style: Tom.label(color: widget.onColor.withValues(alpha: 0.5)),
              ),
              if (widget.count)
                Text.rich(
                  TextSpan(
                    text: '${index + 1}'.padLeft(2, '0'),
                    children: [
                      TextSpan(
                        text: '/${'$_length'.padLeft(2, '0')}',
                        style: TextStyle(
                          color: widget.onColor.withValues(alpha: 0.5),
                        ),
                      ),
                    ],
                  ),
                  style: Tom.label(color: widget.onColor).copyWith(
                    fontFeatures: const [FontFeature.tabularFigures()],
                  ),
                ),
            ],
          ),
        ),
      ],
    );

    // With animations turned off the cover fades instead of moving.
    if (still) {
      return Opacity(
        opacity: 1 - e,
        child: ColoredBox(color: widget.color, child: written),
      );
    }

    return CustomPaint(
      painter: _CoverPainter(
        edge: 1 - e,
        bow: widget.curve * math.sin(math.pi * p),
        color: widget.color,
      ),
      // What is written on the cover rides up with it.
      child: FractionalTranslation(translation: Offset(0, -e), child: written),
    );
  }
}

/// The cover is one shape: a rectangle whose lower edge rises and bows.
class _CoverPainter extends CustomPainter {
  const _CoverPainter({
    required this.edge,
    required this.bow,
    required this.color,
  });

  /// Where the lower edge is, from 1 (bottom) to 0 (gone).
  final double edge;

  /// How far the middle of the edge hangs below its ends.
  final double bow;
  final Color color;

  @override
  void paint(Canvas canvas, Size size) {
    final y = edge * size.height;
    final path = Path()
      ..moveTo(0, 0)
      ..lineTo(size.width, 0)
      ..lineTo(size.width, y)
      ..quadraticBezierTo(size.width / 2, y + bow * size.height, 0, y)
      ..close();
    canvas.drawPath(path, Paint()..color = color);
  }

  @override
  bool shouldRepaint(_CoverPainter old) =>
      old.edge != edge || old.bow != bow || old.color != color;
}
