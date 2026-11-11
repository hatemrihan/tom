import 'package:flutter/material.dart';

import 'tom_style.dart';

class ExpandItem {
  const ExpandItem({required this.image, required this.title, this.subtitle});

  final ImageProvider image;
  final String title;
  final String? subtitle;
}

/// A row (or column) of image panels; the one you point at or tap expands
/// while the others compress, and its caption fades in.
class ExpandOnHover extends StatefulWidget {
  const ExpandOnHover({
    super.key,
    required this.items,
    this.initialIndex = 0,
    this.vertical = false,
    this.height = 320,
    this.gap = 8,
    this.onChanged,
  });

  final List<ExpandItem> items;
  final int initialIndex;

  /// Lay the panels out top to bottom instead of side by side.
  final bool vertical;
  final double height;
  final double gap;
  final ValueChanged<int>? onChanged;

  @override
  State<ExpandOnHover> createState() => _ExpandOnHoverState();
}

class _ExpandOnHoverState extends State<ExpandOnHover> {
  late int _active = widget.initialIndex;

  void _open(int i) {
    if (i == _active) return;
    setState(() => _active = i);
    widget.onChanged?.call(i);
  }

  @override
  Widget build(BuildContext context) {
    final panels = [
      for (var i = 0; i < widget.items.length; i++)
        // Flex is animated as a number, so panels grow and shrink together.
        TweenAnimationBuilder<double>(
          tween: Tween(end: i == _active ? 5.0 : 1.0),
          duration: const Duration(milliseconds: 600),
          curve: Tom.ease,
          builder: (context, flex, child) =>
              Expanded(flex: (flex * 100).round(), child: child!),
          child: Padding(
            padding: EdgeInsets.only(
              left: !widget.vertical && i > 0 ? widget.gap : 0,
              top: widget.vertical && i > 0 ? widget.gap : 0,
            ),
            child: _Panel(
              item: widget.items[i],
              active: i == _active,
              onOpen: () => _open(i),
            ),
          ),
        ),
    ];

    return SizedBox(
      height: widget.height,
      child: widget.vertical
          ? Column(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: panels,
            )
          : Row(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: panels,
            ),
    );
  }
}

class _Panel extends StatelessWidget {
  const _Panel({
    required this.item,
    required this.active,
    required this.onOpen,
  });

  final ExpandItem item;
  final bool active;
  final VoidCallback onOpen;

  @override
  Widget build(BuildContext context) {
    return Semantics(
      button: true,
      selected: active,
      label: item.title,
      child: MouseRegion(
        onEnter: (_) => onOpen(),
        cursor: SystemMouseCursors.click,
        child: GestureDetector(
          onTap: onOpen,
          child: ClipRRect(
            borderRadius: BorderRadius.circular(16),
            child: Stack(
              fit: StackFit.expand,
              children: [
                Image(
                  image: item.image,
                  fit: BoxFit.cover,
                  alignment: const Alignment(0, -0.6),
                ),
                AnimatedOpacity(
                  duration: const Duration(milliseconds: 400),
                  opacity: active ? 1 : 0,
                  child: DecoratedBox(
                    decoration: const BoxDecoration(
                      gradient: LinearGradient(
                        begin: Alignment.topCenter,
                        end: Alignment.bottomCenter,
                        colors: [Color(0x00000000), Color(0x99000000)],
                        stops: [0.5, 1],
                      ),
                    ),
                    child: Align(
                      alignment: Alignment.bottomLeft,
                      child: Padding(
                        padding: const EdgeInsets.all(16),
                        child: Column(
                          mainAxisSize: MainAxisSize.min,
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              Tom.caps(item.title),
                              style: Tom.label(color: Tom.paper),
                              maxLines: 1,
                              softWrap: false,
                              overflow: TextOverflow.clip,
                            ),
                            if (item.subtitle != null)
                              Text(
                                Tom.caps(item.subtitle!),
                                style: Tom.label(
                                  color: const Color(0xB3FFFFFF),
                                  weight: FontWeight.w400,
                                ),
                                maxLines: 1,
                                softWrap: false,
                                overflow: TextOverflow.clip,
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
        ),
      ),
    );
  }
}
