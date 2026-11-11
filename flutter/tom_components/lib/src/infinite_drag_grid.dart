import 'package:flutter/material.dart';
import 'package:flutter/physics.dart';

/// An endless plane of tiles you can drag in any direction, with momentum.
/// Tiles wrap around, so it never runs out.
class InfiniteDragGrid extends StatefulWidget {
  const InfiniteDragGrid({
    super.key,
    required this.itemCount,
    required this.itemBuilder,
    this.cell = 140,
    this.gap = 16,
    this.columns = 4,
  });

  final int itemCount;
  final Widget Function(BuildContext context, int index) itemBuilder;

  /// Tile size.
  final double cell;
  final double gap;

  /// Columns in one repeating block.
  final int columns;

  @override
  State<InfiniteDragGrid> createState() => _InfiniteDragGridState();
}

class _InfiniteDragGridState extends State<InfiniteDragGrid>
    with TickerProviderStateMixin {
  late final AnimationController _x = AnimationController.unbounded(vsync: this)
    ..addListener(_changed);
  late final AnimationController _y = AnimationController.unbounded(vsync: this)
    ..addListener(_changed);

  void _changed() => setState(() {});

  void _fling(Velocity velocity) {
    // Friction carries the plane on after the finger lifts.
    _x.animateWith(
      FrictionSimulation(0.02, _x.value, velocity.pixelsPerSecond.dx),
    );
    _y.animateWith(
      FrictionSimulation(0.02, _y.value, velocity.pixelsPerSecond.dy),
    );
  }

  @override
  void dispose() {
    _x.dispose();
    _y.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final step = widget.cell + widget.gap;
    final rows = (widget.itemCount / widget.columns).ceil();

    return Semantics(
      label: 'Image grid. Drag to move around.',
      child: MouseRegion(
        cursor: SystemMouseCursors.grab,
        child: GestureDetector(
          behavior: HitTestBehavior.opaque,
          onPanDown: (_) {
            _x.stop();
            _y.stop();
          },
          onPanUpdate: (d) {
            _x.value += d.delta.dx;
            _y.value += d.delta.dy;
          },
          onPanEnd: (d) => _fling(d.velocity),
          child: ClipRect(
            child: LayoutBuilder(
              builder: (context, box) {
                // Which column and row sit at the top-left corner, and how far they are scrolled.
                final firstCol = (-_x.value / step).floor();
                final firstRow = (-_y.value / step).floor();
                final offsetX = _x.value + firstCol * step;
                final offsetY = _y.value + firstRow * step;
                final visibleCols = (box.maxWidth / step).ceil() + 1;
                final visibleRows = (box.maxHeight / step).ceil() + 1;

                return Stack(
                  children: [
                    for (var r = 0; r < visibleRows; r++)
                      for (var c = 0; c < visibleCols; c++)
                        Positioned(
                          left: offsetX + c * step,
                          top: offsetY + r * step,
                          width: widget.cell,
                          height: widget.cell,
                          child: widget.itemBuilder(
                            context,
                            // Wrap the plane's coordinates back into the list.
                            (((firstRow + r) % rows + rows) %
                                        rows *
                                        widget.columns +
                                    ((firstCol + c) % widget.columns +
                                            widget.columns) %
                                        widget.columns) %
                                widget.itemCount,
                          ),
                        ),
                  ],
                );
              },
            ),
          ),
        ),
      ),
    );
  }
}
