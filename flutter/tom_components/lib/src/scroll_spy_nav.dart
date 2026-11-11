import 'package:flutter/material.dart';

import 'tom_style.dart';

class SpySection {
  const SpySection({
    required this.id,
    required this.title,
    required this.child,
  });

  final String id;
  final String title;
  final Widget child;
}

/// A long-form page with a side index that follows along. A dot marks the
/// current section and a thin rule shows how far through you are. Tap an
/// entry to glide to it.
class ScrollSpyNav extends StatefulWidget {
  const ScrollSpyNav({
    super.key,
    required this.sections,
    this.title,
    this.offset = 0.25,
    this.indexWidth = 150,
    this.onChanged,
  });

  final List<SpySection> sections;
  final String? title;

  /// How far down the reading area a heading must travel before its entry
  /// becomes current: 0 is the top edge, 0.5 the middle.
  final double offset;
  final double indexWidth;
  final ValueChanged<String>? onChanged;

  @override
  State<ScrollSpyNav> createState() => _ScrollSpyNavState();
}

class _ScrollSpyNavState extends State<ScrollSpyNav> {
  final _controller = ScrollController();
  final _progress = ValueNotifier<double>(0);
  late final _keys = {for (final s in widget.sections) s.id: GlobalKey()};
  late String _active = widget.sections.first.id;

  @override
  void initState() {
    super.initState();
    _controller.addListener(_read);
  }

  /// Scroll offset at which a section's heading sits at the top of the reading area.
  double? _offsetOf(String id) {
    final box = _keys[id]?.currentContext?.findRenderObject();
    final scroller = _controller.position.context.storageContext
        .findRenderObject();
    if (box is! RenderBox || scroller is! RenderBox) return null;
    return box.localToGlobal(Offset.zero, ancestor: scroller).dy +
        _controller.offset;
  }

  void _read() {
    final position = _controller.position;
    final max = position.maxScrollExtent;
    _progress.value = max <= 0 ? 0 : (position.pixels / max).clamp(0.0, 1.0);

    // At the very end the last section wins, even if its heading never reaches the line.
    var current = widget.sections.first.id;
    if (max > 0 && position.pixels >= max - 2) {
      current = widget.sections.last.id;
    } else {
      final line = position.pixels + position.viewportDimension * widget.offset;
      for (final s in widget.sections) {
        final top = _offsetOf(s.id);
        if (top != null && top <= line) current = s.id;
      }
    }
    if (current != _active) {
      setState(() => _active = current);
      widget.onChanged?.call(current);
    }
  }

  void _goTo(String id) {
    final top = _offsetOf(id);
    if (top == null) return;
    _controller.animateTo(
      (top - 24).clamp(0.0, _controller.position.maxScrollExtent),
      duration: const Duration(milliseconds: 450),
      curve: Tom.ease,
    );
  }

  @override
  void dispose() {
    _controller.dispose();
    _progress.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Row(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: [
        SizedBox(
          width: widget.indexWidth,
          child: Padding(
            padding: const EdgeInsets.fromLTRB(20, 24, 12, 24),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                if (widget.title != null)
                  Padding(
                    padding: const EdgeInsets.only(bottom: 12),
                    child: Text(Tom.caps(widget.title!), style: Tom.label()),
                  ),
                for (final s in widget.sections)
                  _Entry(
                    title: s.title,
                    active: s.id == _active,
                    onTap: () => _goTo(s.id),
                  ),
                const Spacer(),
                ValueListenableBuilder<double>(
                  valueListenable: _progress,
                  builder: (context, value, _) => Stack(
                    children: [
                      Container(height: 1, color: Tom.rule),
                      FractionallySizedBox(
                        widthFactor: value,
                        child: Container(height: 1, color: Tom.ink),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
        ),
        Expanded(
          child: SingleChildScrollView(
            controller: _controller,
            physics: const ClampingScrollPhysics(),
            padding: const EdgeInsets.all(24),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                for (final s in widget.sections)
                  Padding(
                    key: _keys[s.id],
                    padding: const EdgeInsets.only(bottom: 40),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Semantics(
                          header: true,
                          child: Text(Tom.caps(s.title), style: Tom.label()),
                        ),
                        const SizedBox(height: 8),
                        DefaultTextStyle.merge(
                          style: const TextStyle(
                            fontSize: 14,
                            height: 1.6,
                            color: Color(0xFF525252),
                          ),
                          child: s.child,
                        ),
                      ],
                    ),
                  ),
              ],
            ),
          ),
        ),
      ],
    );
  }
}

class _Entry extends StatelessWidget {
  const _Entry({
    required this.title,
    required this.active,
    required this.onTap,
  });

  final String title;
  final bool active;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    return Semantics(
      button: true,
      selected: active,
      child: MouseRegion(
        cursor: SystemMouseCursors.click,
        child: GestureDetector(
          behavior: HitTestBehavior.opaque,
          onTap: onTap,
          child: SizedBox(
            height: 22,
            child: Row(
              children: [
                AnimatedContainer(
                  duration: const Duration(milliseconds: 200),
                  width: active ? 12 : 0,
                  alignment: Alignment.centerLeft,
                  child: active
                      ? Container(
                          width: 4,
                          height: 4,
                          decoration: const BoxDecoration(
                            color: Tom.ink,
                            shape: BoxShape.circle,
                          ),
                        )
                      : null,
                ),
                Expanded(
                  child: Text(
                    Tom.caps(title),
                    style: Tom.label(color: active ? Tom.ink : Tom.faint),
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
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
