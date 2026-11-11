import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

import 'tom_style.dart';

class ColorListItem {
  const ColorListItem({
    required this.title,
    required this.tag,
    required this.color,
    this.meta,
    this.image,
    this.onTap,
  });

  final String title;
  final String tag;
  final String? meta;

  /// Background colour while this item is in focus.
  final Color color;
  final ImageProvider? image;
  final VoidCallback? onTap;
}

/// An endless list of large titles. Whichever row crosses the focus line
/// turns solid, the whole surface tints to that item's colour, and its
/// picture swaps in on the right. It loops forever in both directions.
class ScrollColorList extends StatefulWidget {
  const ScrollColorList({
    super.key,
    required this.items,
    this.focus = 0.5,
    this.rowHeight = 56,
    this.haptics = true,
    this.onChanged,
  });

  final List<ColorListItem> items;

  /// Where the focus line sits, as a fraction of the height.
  final double focus;
  final double rowHeight;

  /// A light tick each time the focused item changes.
  final bool haptics;
  final ValueChanged<int>? onChanged;

  @override
  State<ScrollColorList> createState() => _ScrollColorListState();
}

class _ScrollColorListState extends State<ScrollColorList> {
  /// Start far from zero so there is room to scroll up as well as down.
  static const _origin = 10000;
  late final ScrollController _controller = ScrollController(
    initialScrollOffset: _origin * widget.rowHeight,
  );
  int _row = _origin;
  double _height = 0;

  int get _active => _row % widget.items.length;

  @override
  void initState() {
    super.initState();
    _controller.addListener(_read);
  }

  void _read() {
    // The row whose middle is nearest the focus line.
    final row =
        ((_controller.offset + _height * widget.focus) / widget.rowHeight - 0.5)
            .round();
    if (row == _row) return;
    setState(() => _row = row);
    if (widget.haptics) HapticFeedback.selectionClick();
    widget.onChanged?.call(_active);
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final current = widget.items[_active];

    return LayoutBuilder(
      builder: (context, box) {
        if (_height != box.maxHeight) {
          _height = box.maxHeight;
          WidgetsBinding.instance.addPostFrameCallback(
            (_) => _controller.hasClients ? _read() : null,
          );
        }
        final wide = box.maxWidth >= 520;

        return AnimatedContainer(
          duration: const Duration(milliseconds: 500),
          curve: Tom.ease,
          color: current.color,
          child: Stack(
            children: [
              ListView.builder(
                controller: _controller,
                itemExtent: widget.rowHeight,
                padding: EdgeInsets.only(
                  left: 24,
                  right: wide ? box.maxWidth * 0.42 : 24,
                ),
                itemBuilder: (context, index) {
                  final item = widget.items[index % widget.items.length];
                  final on = index == _row;
                  return Semantics(
                    button: item.onTap != null,
                    selected: on,
                    child: GestureDetector(
                      behavior: HitTestBehavior.opaque,
                      onTap: () => on
                          ? item.onTap?.call()
                          : _controller.animateTo(
                              index * widget.rowHeight -
                                  _height * widget.focus +
                                  widget.rowHeight / 2,
                              duration: const Duration(milliseconds: 400),
                              curve: Tom.ease,
                            ),
                      child: Row(
                        children: [
                          Flexible(
                            child: AnimatedDefaultTextStyle(
                              duration: const Duration(milliseconds: 300),
                              style: TextStyle(
                                fontSize: widget.rowHeight * 0.72,
                                height: 1.2,
                                letterSpacing: widget.rowHeight * -0.025,
                                fontWeight: FontWeight.w500,
                                color: Tom.ink.withValues(alpha: on ? 1 : 0.2),
                                decoration: TextDecoration.none,
                              ),
                              child: Text(
                                item.title,
                                maxLines: 1,
                                softWrap: false,
                                overflow: TextOverflow.fade,
                              ),
                            ),
                          ),
                          const SizedBox(width: 16),
                          AnimatedOpacity(
                            duration: const Duration(milliseconds: 300),
                            opacity: on ? 1 : 0,
                            child: Text(
                              Tom.caps(
                                [
                                  item.tag,
                                  item.meta,
                                ].whereType<String>().join('  '),
                              ),
                              style: Tom.label(),
                              maxLines: 1,
                              softWrap: false,
                            ),
                          ),
                        ],
                      ),
                    ),
                  );
                },
              ),
              // The whole picture, uncropped, on the right.
              if (wide && current.image != null)
                Positioned(
                  top: 24,
                  bottom: 24,
                  right: 24,
                  width: box.maxWidth * 0.36,
                  child: IgnorePointer(
                    child: AnimatedSwitcher(
                      duration: const Duration(milliseconds: 450),
                      child: ClipRRect(
                        key: ValueKey(_active),
                        borderRadius: BorderRadius.circular(12),
                        child: Image(
                          image: current.image!,
                          fit: BoxFit.contain,
                          alignment: Alignment.centerRight,
                          semanticLabel: current.title,
                        ),
                      ),
                    ),
                  ),
                ),
            ],
          ),
        );
      },
    );
  }
}
