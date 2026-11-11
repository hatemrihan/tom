import 'package:flutter/material.dart';
import 'package:flutter/rendering.dart';

import 'tom_style.dart';

/// A paragraph whose words light up one by one as it scrolls up the screen:
/// reading progress made visible. Place it inside any scroll view.
///
/// The reveal starts as the paragraph enters at the bottom and is complete
/// once its centre reaches the middle of the scroll view.
class TextRevealScroll extends StatefulWidget {
  const TextRevealScroll({
    super.key,
    required this.text,
    this.style,
    this.textAlign = TextAlign.start,
    this.dimOpacity = 0.12,
  });

  final String text;
  final TextStyle? style;
  final TextAlign textAlign;

  /// Opacity of words that have not been reached yet.
  final double dimOpacity;

  @override
  State<TextRevealScroll> createState() => _TextRevealScrollState();
}

class _TextRevealScrollState extends State<TextRevealScroll> {
  ScrollPosition? _position;
  double _progress = 0;

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    final next = Scrollable.maybeOf(context)?.position;
    if (next == _position) return;
    _position?.removeListener(_measure);
    _position = next?..addListener(_measure);
    WidgetsBinding.instance.addPostFrameCallback((_) => _measure());
  }

  /// Where the paragraph is inside the scroll view, as 0 (just entering) to 1 (centred).
  ///
  /// Worked out from the scroll offset rather than from where the paragraph is
  /// painted: scroll listeners run before layout, so painted positions are a frame old.
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
    final top = viewport.getOffsetToReveal(box, 0).offset - position.pixels;
    final height = position.viewportDimension;
    final start = height * 0.9; // paragraph top here: nothing revealed
    final end =
        height * 0.5 - box.size.height / 2; // paragraph centred: all revealed
    final next = start == end
        ? 1.0
        : ((start - top) / (start - end)).clamp(0.0, 1.0);
    if ((next - _progress).abs() > 0.001) setState(() => _progress = next);
  }

  @override
  void dispose() {
    _position?.removeListener(_measure);
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final style =
        widget.style ??
        const TextStyle(
          fontSize: 24,
          height: 1.25,
          fontWeight: FontWeight.w500,
          letterSpacing: -0.4,
          color: Tom.ink,
        );
    final words = widget.text.split(RegExp(r'\s+'));
    final color = style.color ?? Tom.ink;

    return Semantics(
      label: widget.text,
      child: ExcludeSemantics(
        child: Text.rich(
          textAlign: widget.textAlign,
          TextSpan(
            style: style,
            children: [
              for (var i = 0; i < words.length; i++)
                TextSpan(
                  text: i == words.length - 1 ? words[i] : '${words[i]} ',
                  style: TextStyle(
                    // Each word fades in over its own slice of the scroll.
                    color: color.withValues(
                      alpha:
                          widget.dimOpacity +
                          (1 - widget.dimOpacity) *
                              ((_progress * words.length) - i).clamp(0.0, 1.0),
                    ),
                  ),
                ),
            ],
          ),
        ),
      ),
    );
  }
}
