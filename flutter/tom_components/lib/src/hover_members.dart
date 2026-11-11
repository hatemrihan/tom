import 'package:flutter/material.dart';

import 'tom_style.dart';

class Member {
  const Member({required this.name, required this.image, this.role});

  final String name;
  final ImageProvider image;
  final String? role;
}

/// A row of small portraits. The one you point at (or press) grows, its
/// neighbours lean in, and the caption underneath swaps to that person.
class HoverMembers extends StatefulWidget {
  const HoverMembers({
    super.key,
    required this.members,
    required this.title,
    this.size = 36,
    this.color = Tom.ink,
  });

  final List<Member> members;

  /// Shown while nobody is selected.
  final String title;

  /// Portrait size at rest.
  final double size;
  final Color color;

  @override
  State<HoverMembers> createState() => _HoverMembersState();
}

class _HoverMembersState extends State<HoverMembers> {
  int? _hover;

  void _set(int? i) {
    if (i != _hover) setState(() => _hover = i);
  }

  @override
  Widget build(BuildContext context) {
    final current = _hover == null ? null : widget.members[_hover!];

    return Column(
      mainAxisSize: MainAxisSize.min,
      children: [
        MouseRegion(
          onExit: (_) => _set(null),
          child: SizedBox(
            height: widget.size * 2,
            child: Row(
              mainAxisSize: MainAxisSize.min,
              crossAxisAlignment: CrossAxisAlignment.end,
              children: [
                for (var i = 0; i < widget.members.length; i++)
                  Padding(
                    padding: EdgeInsets.only(left: i == 0 ? 0 : 6),
                    child: Semantics(
                      button: true,
                      label: [
                        widget.members[i].name,
                        widget.members[i].role,
                      ].whereType<String>().join(', '),
                      child: MouseRegion(
                        onEnter: (_) => _set(i),
                        cursor: SystemMouseCursors.click,
                        child: GestureDetector(
                          // On touch screens a tap selects, a second tap clears.
                          onTap: () => _set(_hover == i ? null : i),
                          child: AnimatedContainer(
                            duration: const Duration(milliseconds: 200),
                            curve: Curves.easeOut,
                            width: widget.size * _scale(i),
                            height: widget.size * _scale(i),
                            clipBehavior: Clip.antiAlias,
                            decoration: BoxDecoration(
                              color: const Color(0xFFE5E5E5),
                              borderRadius: BorderRadius.circular(6),
                            ),
                            child: Image(
                              image: widget.members[i].image,
                              fit: BoxFit.cover,
                              alignment: const Alignment(0, -0.6),
                              excludeFromSemantics: true,
                            ),
                          ),
                        ),
                      ),
                    ),
                  ),
              ],
            ),
          ),
        ),
        const SizedBox(height: 20),
        Semantics(
          liveRegion: true,
          child: Column(
            children: [
              Text(
                Tom.caps(current?.name ?? widget.title),
                style: Tom.label(color: widget.color),
              ),
              Text(
                Tom.caps(
                  current != null
                      ? (current.role ?? '')
                      : '${widget.members.length} people',
                ),
                style: Tom.label(
                  color: widget.color.withValues(alpha: 0.5),
                  weight: FontWeight.w400,
                ),
              ),
            ],
          ),
        ),
      ],
    );
  }

  double _scale(int i) {
    final hover = _hover;
    if (hover == null) return 1;
    final distance = (hover - i).abs();
    return distance == 0 ? 2 : (distance == 1 ? 1.35 : 1);
  }
}
