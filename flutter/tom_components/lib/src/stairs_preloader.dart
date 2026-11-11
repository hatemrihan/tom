import 'package:flutter/material.dart';

import 'tom_style.dart';

enum StairsVariant {
  /// Every panel lifts up.
  single,

  /// Alternate panels go up and down.
  double,
}

/// A preloader that counts to 100, then lifts away as a staircase of panels
/// to reveal the page underneath.
class StairsPreloader extends StatefulWidget {
  const StairsPreloader({
    super.key,
    required this.child,
    this.columns = 6,
    this.duration = const Duration(milliseconds: 1800),
    this.label = 'Loading',
    this.variant = StairsVariant.single,
    this.panelColor = const Color(0xFFE5E5E5),
    this.onPanelColor = Tom.ink,
    this.onComplete,
  });

  final Widget child;

  /// Number of panels.
  final int columns;

  /// How long the count from 0 to 100 takes.
  final Duration duration;
  final String label;
  final StairsVariant variant;
  final Color panelColor;

  /// Colour of the counter and label on the panels.
  final Color onPanelColor;
  final VoidCallback? onComplete;

  @override
  State<StairsPreloader> createState() => StairsPreloaderState();
}

class StairsPreloaderState extends State<StairsPreloader>
    with TickerProviderStateMixin {
  static const _lift = Duration(milliseconds: 550);
  static const _stagger = Duration(milliseconds: 60);

  late final AnimationController _count = AnimationController(
    vsync: this,
    duration: widget.duration,
  );
  late final AnimationController _leave = AnimationController(
    vsync: this,
    duration: _lift + _stagger * (widget.columns - 1),
  );
  bool _done = false;

  @override
  void initState() {
    super.initState();
    _run();
  }

  /// Play the whole sequence again.
  void replay() {
    setState(() => _done = false);
    _leave.value = 0;
    _run();
  }

  Future<void> _run() async {
    await _count.forward(from: 0).orCancel.catchError((_) {});
    if (!mounted) return;
    await _leave.forward(from: 0).orCancel.catchError((_) {});
    if (!mounted) return;
    setState(() => _done = true);
    widget.onComplete?.call();
  }

  @override
  void dispose() {
    _count.dispose();
    _leave.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final total = _leave.duration!.inMicroseconds;
    return Stack(
      fit: StackFit.passthrough,
      children: [
        widget.child,
        if (!_done)
          Positioned.fill(
            child: Semantics(
              label: widget.label,
              liveRegion: true,
              child: ClipRect(
                child: Stack(
                  fit: StackFit.expand,
                  children: [
                    Row(
                      crossAxisAlignment: CrossAxisAlignment.stretch,
                      children: [
                        for (var i = 0; i < widget.columns; i++)
                          Expanded(
                            child: SlideTransition(
                              // Each panel starts a beat after the one before it.
                              position:
                                  Tween(
                                    begin: Offset.zero,
                                    end: Offset(
                                      0,
                                      widget.variant == StairsVariant.double &&
                                              i.isOdd
                                          ? 1.01
                                          : -1.01,
                                    ),
                                  ).animate(
                                    CurvedAnimation(
                                      parent: _leave,
                                      curve: Interval(
                                        _stagger.inMicroseconds * i / total,
                                        (_stagger.inMicroseconds * i +
                                                _lift.inMicroseconds) /
                                            total,
                                        curve: const Cubic(0.76, 0, 0.24, 1),
                                      ),
                                    ),
                                  ),
                              child: ColoredBox(color: widget.panelColor),
                            ),
                          ),
                      ],
                    ),
                    Positioned(
                      left: 20,
                      right: 20,
                      bottom: 16,
                      child: FadeTransition(
                        opacity: Tween(begin: 1.0, end: 0.0).animate(
                          CurvedAnimation(
                            parent: _leave,
                            curve: const Interval(0, 0.25),
                          ),
                        ),
                        child: Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          crossAxisAlignment: CrossAxisAlignment.end,
                          children: [
                            Text(
                              Tom.caps(widget.label),
                              style: Tom.label(
                                color: widget.onPanelColor.withValues(
                                  alpha: 0.5,
                                ),
                              ),
                            ),
                            AnimatedBuilder(
                              animation: _count,
                              builder: (context, _) => Text(
                                (Curves.easeInOut.transform(_count.value) * 100)
                                    .round()
                                    .toString()
                                    .padLeft(3, '0'),
                                style: TextStyle(
                                  fontFamily: 'monospace',
                                  fontFamilyFallback: const [
                                    'Menlo',
                                    'Courier New',
                                  ],
                                  fontSize: 64,
                                  height: 1,
                                  fontWeight: FontWeight.w300,
                                  color: widget.onPanelColor,
                                  fontFeatures: const [
                                    FontFeature.tabularFigures(),
                                  ],
                                  decoration: TextDecoration.none,
                                ),
                              ),
                            ),
                          ],
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ),
      ],
    );
  }
}
