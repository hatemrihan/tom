import 'package:flutter/material.dart';

import 'tom_style.dart';

class IndexProject {
  const IndexProject({
    required this.name,
    required this.image,
    this.meta,
    this.onTap,
  });

  final String name;
  final ImageProvider image;

  /// One quiet line under the preview: a year, a field, a client.
  final String? meta;
  final VoidCallback? onTap;
}

/// A minimal index: every name on one line, and one framed preview above
/// that wipes to whichever name you point at or tap.
class ProjectIndex extends StatefulWidget {
  const ProjectIndex({
    super.key,
    required this.projects,
    this.initialIndex = 0,
    this.previewWidth = 192,
    this.color = Tom.ink,
  });

  final List<IndexProject> projects;
  final int initialIndex;
  final double previewWidth;
  final Color color;

  @override
  State<ProjectIndex> createState() => _ProjectIndexState();
}

class _ProjectIndexState extends State<ProjectIndex> {
  late int _active = widget.initialIndex;

  void _select(int i) {
    if (i != _active) setState(() => _active = i);
  }

  @override
  Widget build(BuildContext context) {
    final current = widget.projects[_active];

    return Column(
      mainAxisSize: MainAxisSize.min,
      children: [
        ClipRRect(
          borderRadius: BorderRadius.circular(8),
          child: SizedBox(
            width: widget.previewWidth,
            height: widget.previewWidth * 5 / 4,
            child: AnimatedSwitcher(
              duration: const Duration(milliseconds: 500),
              switchInCurve: const Cubic(0.76, 0, 0.24, 1),
              // The new image wipes down over the old one, which stays put underneath.
              transitionBuilder: (child, animation) =>
                  child.key == ValueKey(_active)
                  ? ClipRect(clipper: _Wipe(animation), child: child)
                  : child,
              layoutBuilder: (current, previous) => Stack(
                fit: StackFit.expand,
                children: [...previous, ?current],
              ),
              child: Image(
                key: ValueKey(_active),
                image: current.image,
                fit: BoxFit.cover,
                alignment: const Alignment(0, -0.6),
                semanticLabel: current.name,
              ),
            ),
          ),
        ),
        const SizedBox(height: 24),
        Semantics(
          liveRegion: true,
          child: Text(
            Tom.caps(current.meta ?? ''),
            style: Tom.label(
              color: widget.color.withValues(alpha: 0.5),
              weight: FontWeight.w400,
            ),
          ),
        ),
        const SizedBox(height: 24),
        Wrap(
          alignment: WrapAlignment.center,
          spacing: 24,
          runSpacing: 8,
          children: [
            for (var i = 0; i < widget.projects.length; i++)
              Semantics(
                button: true,
                selected: i == _active,
                child: MouseRegion(
                  onEnter: (_) => _select(i),
                  cursor: SystemMouseCursors.click,
                  child: GestureDetector(
                    behavior: HitTestBehavior.opaque,
                    onTap: () {
                      // First tap selects; tapping the selected name opens it.
                      if (i == _active) widget.projects[i].onTap?.call();
                      _select(i);
                    },
                    child: AnimatedOpacity(
                      duration: const Duration(milliseconds: 300),
                      opacity: i == _active ? 1 : 0.4,
                      child: Text(
                        Tom.caps(widget.projects[i].name),
                        style: Tom.label(color: widget.color).copyWith(
                          decoration: i == _active
                              ? TextDecoration.underline
                              : TextDecoration.none,
                          decorationColor: widget.color,
                        ),
                      ),
                    ),
                  ),
                ),
              ),
          ],
        ),
      ],
    );
  }
}

class _Wipe extends CustomClipper<Rect> {
  _Wipe(this.animation) : super(reclip: animation);
  final Animation<double> animation;

  @override
  Rect getClip(Size size) =>
      Rect.fromLTWH(0, 0, size.width, size.height * animation.value);

  @override
  bool shouldReclip(_Wipe old) => true;
}
