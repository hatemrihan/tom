import 'package:flutter/material.dart';
import 'package:flutter/rendering.dart';

/// Where a widget sits inside the scroll view around it.
class ScrollMetricsOf {
  const ScrollMetricsOf({
    required this.top,
    required this.height,
    required this.viewport,
  });

  /// Distance from the top of the scroll view to the top of the widget.
  final double top;

  /// The widget's own height.
  final double height;

  /// Height of the scroll view.
  final double viewport;

  /// 0 while the widget's top is at [from] (a fraction of the scroll view,
  /// 0 = top edge, 1 = bottom edge), 1 once its centre reaches [centreAt].
  double reveal({double from = 0.9, double centreAt = 0.5}) {
    final start = viewport * from;
    final end = viewport * centreAt - height / 2;
    return start == end ? 1 : ((start - top) / (start - end)).clamp(0.0, 1.0);
  }

  /// For a widget taller than the scroll view: 0 when its top reaches the
  /// top edge, 1 when its bottom reaches the bottom edge.
  double get through =>
      height <= viewport ? 0 : (-top / (height - viewport)).clamp(0.0, 1.0);
}

/// Rebuilds its child with up-to-date [ScrollMetricsOf] as the nearest
/// scroll view moves.
///
/// Positions come from the scroll offset, not from where the widget was last
/// painted, so they are never a frame behind.
class ScrollLinked extends StatefulWidget {
  const ScrollLinked({super.key, required this.builder});

  final Widget Function(BuildContext context, ScrollMetricsOf? metrics) builder;

  @override
  State<ScrollLinked> createState() => _ScrollLinkedState();
}

class _ScrollLinkedState extends State<ScrollLinked> {
  ScrollPosition? _position;
  ScrollMetricsOf? _metrics;

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    final next = Scrollable.maybeOf(context)?.position;
    if (next != _position) {
      _position?.removeListener(_measure);
      _position = next?..addListener(_measure);
    }
    WidgetsBinding.instance.addPostFrameCallback((_) => _measure());
  }

  void _measure() {
    final box = context.findRenderObject();
    final position = _position;
    if (!mounted ||
        position == null ||
        box is! RenderBox ||
        !box.hasSize ||
        !position.hasPixels) {
      return;
    }
    final viewport = RenderAbstractViewport.maybeOf(box);
    if (viewport == null) return;
    final next = ScrollMetricsOf(
      top: viewport.getOffsetToReveal(box, 0).offset - position.pixels,
      height: box.size.height,
      viewport: position.viewportDimension,
    );
    final old = _metrics;
    if (old == null ||
        (old.top - next.top).abs() > 0.1 ||
        old.height != next.height ||
        old.viewport != next.viewport) {
      setState(() => _metrics = next);
    }
  }

  @override
  void dispose() {
    _position?.removeListener(_measure);
    super.dispose();
  }

  @override
  Widget build(BuildContext context) => widget.builder(context, _metrics);
}
