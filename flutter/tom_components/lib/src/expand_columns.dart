import 'package:flutter/material.dart';

import 'tom_style.dart';

class ColumnItem {
  const ColumnItem({
    required this.title,
    required this.image,
    this.meta,
    this.alignment = const Alignment(0, -0.6),
  });

  final String title;
  final ImageProvider image;

  /// Small second label, shown only while the item is open: a year, a role.
  final String? meta;

  /// Which part of the image to keep when it is cropped.
  final Alignment alignment;
}

/// A row of thin columns with sideways labels. The one you point at or tap
/// opens to show its image; a small button shows the image whole.
class ExpandColumns extends StatefulWidget {
  const ExpandColumns({
    super.key,
    required this.items,
    this.initialIndex = 0,
    this.height = 360,
    this.zoom = true,
    this.color = Tom.ink,
    this.onChanged,
  });

  final List<ColumnItem> items;
  final int initialIndex;

  /// Height of the row. The open image keeps a 4:5 shape.
  final double height;

  /// Show the button that opens the whole, uncropped image.
  final bool zoom;
  final Color color;
  final ValueChanged<int>? onChanged;

  @override
  State<ExpandColumns> createState() => _ExpandColumnsState();
}

class _ExpandColumnsState extends State<ExpandColumns> {
  static const double _strip = 36;
  late int _active = widget.initialIndex;

  void _open(int i) {
    if (i == _active) return;
    setState(() => _active = i);
    widget.onChanged?.call(i);
  }

  void _view(ColumnItem item) {
    showDialog<void>(
      context: context,
      barrierColor: const Color(0xD9000000),
      builder: (context) => GestureDetector(
        onTap: () => Navigator.of(context).pop(),
        child: Padding(
          padding: const EdgeInsets.all(24),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Flexible(
                child: ClipRRect(
                  borderRadius: BorderRadius.circular(8),
                  child: Image(image: item.image, fit: BoxFit.contain),
                ),
              ),
              const SizedBox(height: 12),
              Text(
                Tom.caps(
                  '${item.title}${item.meta != null ? ', ${item.meta}' : ''}  ·  Tap to close',
                ),
                style: Tom.label(color: Tom.paper),
              ),
            ],
          ),
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final imageWidth = (widget.height - 16) * 0.8;
    final rule = widget.color.withValues(alpha: 0.15);

    return SingleChildScrollView(
      scrollDirection: Axis.horizontal,
      child: SizedBox(
        height: widget.height,
        child: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            for (var i = 0; i < widget.items.length; i++)
              MouseRegion(
                onEnter: (_) => _open(i),
                cursor: SystemMouseCursors.click,
                child: GestureDetector(
                  behavior: HitTestBehavior.opaque,
                  onTap: () => _open(i),
                  child: AnimatedContainer(
                    duration: const Duration(milliseconds: 700),
                    curve: Tom.ease,
                    width: i == _active ? _strip + imageWidth + 8 : _strip,
                    decoration: BoxDecoration(
                      border: Border(
                        left: BorderSide(color: rule),
                        right: i == widget.items.length - 1
                            ? BorderSide(color: rule)
                            : BorderSide.none,
                      ),
                    ),
                    clipBehavior: Clip.hardEdge,
                    child: OverflowBox(
                      alignment: Alignment.centerLeft,
                      minWidth: _strip + imageWidth + 8,
                      maxWidth: _strip + imageWidth + 8,
                      child: Row(
                        children: [
                          SizedBox(
                            width: _strip,
                            child: _Label(
                              item: widget.items[i],
                              active: i == _active,
                              color: widget.color,
                            ),
                          ),
                          Padding(
                            padding: const EdgeInsets.fromLTRB(0, 8, 8, 8),
                            child: AnimatedOpacity(
                              duration: const Duration(milliseconds: 500),
                              opacity: i == _active ? 1 : 0,
                              child: ClipRRect(
                                borderRadius: BorderRadius.circular(8),
                                child: Stack(
                                  children: [
                                    Image(
                                      image: widget.items[i].image,
                                      width: imageWidth,
                                      height: widget.height - 16,
                                      fit: BoxFit.cover,
                                      alignment: widget.items[i].alignment,
                                      semanticLabel: widget.items[i].title,
                                    ),
                                    if (widget.zoom && i == _active)
                                      Positioned(
                                        right: 8,
                                        bottom: 8,
                                        child: GestureDetector(
                                          onTap: () => _view(widget.items[i]),
                                          child: Container(
                                            padding: const EdgeInsets.symmetric(
                                              horizontal: 10,
                                              vertical: 6,
                                            ),
                                            decoration: const ShapeDecoration(
                                              color: Color(0xE6FFFFFF),
                                              shape: StadiumBorder(),
                                            ),
                                            child: Text(
                                              'VIEW ↗',
                                              style: Tom.label(),
                                            ),
                                          ),
                                        ),
                                      ),
                                  ],
                                ),
                              ),
                            ),
                          ),
                        ],
                      ),
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

/// The sideways strip: the name reads bottom to top, the meta sits at the top.
class _Label extends StatelessWidget {
  const _Label({required this.item, required this.active, required this.color});

  final ColumnItem item;
  final bool active;
  final Color color;

  @override
  Widget build(BuildContext context) {
    return AnimatedOpacity(
      duration: const Duration(milliseconds: 300),
      opacity: active ? 1 : 0.4,
      child: Padding(
        padding: const EdgeInsets.symmetric(vertical: 8),
        child: RotatedBox(
          quarterTurns: 3,
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                Tom.caps(item.title),
                style: Tom.label(color: color),
                maxLines: 1,
                softWrap: false,
              ),
              if (item.meta != null)
                AnimatedOpacity(
                  duration: const Duration(milliseconds: 500),
                  opacity: active ? 1 : 0,
                  child: Text(
                    Tom.caps(item.meta!),
                    style: Tom.label(color: color, weight: FontWeight.w400),
                  ),
                ),
            ],
          ),
        ),
      ),
    );
  }
}
