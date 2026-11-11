import 'package:flutter/material.dart';

import 'tom_style.dart';

/// An oversized, borderless input on a hairline. On submit the arrow
/// "devours" the text: the letters slide right and shrink into it, one by
/// one, then a short message takes their place.
class DevourInput extends StatefulWidget {
  const DevourInput({
    super.key,
    this.placeholder = 'you@studio.com',
    this.keyboardType = TextInputType.emailAddress,
    this.onSubmit,
    this.doneLabel = 'Thank you',
    this.style,
    this.color = Tom.ink,
  });

  final String placeholder;
  final TextInputType keyboardType;

  /// Called with the text once the letters have been swallowed.
  final Future<void> Function(String value)? onSubmit;

  /// Message shown after submitting.
  final String doneLabel;
  final TextStyle? style;
  final Color color;

  @override
  State<DevourInput> createState() => _DevourInputState();
}

class _DevourInputState extends State<DevourInput>
    with SingleTickerProviderStateMixin {
  final _text = TextEditingController();
  late final AnimationController _eat = AnimationController(
    vsync: this,
    duration: const Duration(milliseconds: 900),
  );
  String _eating = '';
  bool _done = false;

  Future<void> _submit() async {
    final value = _text.text.trim();
    if (value.isEmpty || _eat.isAnimating) return;
    FocusScope.of(context).unfocus();
    setState(() => _eating = value);
    _text.clear();
    await _eat.forward(from: 0);
    await widget.onSubmit?.call(value);
    if (!mounted) return;
    setState(() {
      _eating = '';
      _done = true;
    });
    await Future<void>.delayed(const Duration(milliseconds: 2400));
    if (mounted) setState(() => _done = false);
  }

  @override
  void dispose() {
    _text.dispose();
    _eat.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final style =
        (widget.style ??
                const TextStyle(
                  fontSize: 34,
                  height: 1.2,
                  letterSpacing: -1,
                  fontWeight: FontWeight.w400,
                ))
            .copyWith(color: widget.color, decoration: TextDecoration.none);
    final chars = _eating.characters.toList();

    return Container(
      decoration: BoxDecoration(
        border: Border(
          bottom: BorderSide(color: widget.color.withValues(alpha: 0.2)),
        ),
      ),
      padding: const EdgeInsets.only(bottom: 10),
      child: Row(
        children: [
          Expanded(
            child: Stack(
              alignment: Alignment.centerLeft,
              children: [
                // The real field, hidden while the letters are being eaten.
                Opacity(
                  opacity: _eating.isEmpty && !_done ? 1 : 0,
                  child: EditableText(
                    controller: _text,
                    focusNode: _focus,
                    style: style,
                    cursorColor: widget.color,
                    backgroundCursorColor: widget.color.withValues(alpha: 0.2),
                    keyboardType: widget.keyboardType,
                    textInputAction: TextInputAction.send,
                    onSubmitted: (_) => _submit(),
                    onChanged: (_) => setState(() {}),
                  ),
                ),
                if (_text.text.isEmpty && _eating.isEmpty && !_done)
                  IgnorePointer(
                    child: Text(
                      widget.placeholder,
                      style: style.copyWith(
                        color: widget.color.withValues(alpha: 0.3),
                      ),
                      maxLines: 1,
                      softWrap: false,
                    ),
                  ),
                if (_done)
                  Semantics(
                    liveRegion: true,
                    child: Text(widget.doneLabel, style: style),
                  ),
                if (_eating.isNotEmpty)
                  LayoutBuilder(
                    builder: (context, box) => AnimatedBuilder(
                      animation: _eat,
                      builder: (context, _) => SingleChildScrollView(
                        scrollDirection: Axis.horizontal,
                        physics: const NeverScrollableScrollPhysics(),
                        child: Row(
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            for (var i = 0; i < chars.length; i++)
                              Builder(
                                builder: (context) {
                                  // The last letter goes first; each follows a beat later.
                                  final order = chars.length - 1 - i;
                                  final start = order / chars.length * 0.6;
                                  final t = Curves.easeIn.transform(
                                    ((_eat.value - start) / 0.4).clamp(
                                      0.0,
                                      1.0,
                                    ),
                                  );
                                  return Opacity(
                                    opacity: 1 - t,
                                    child: Transform.translate(
                                      offset: Offset(t * box.maxWidth * 0.5, 0),
                                      child: Transform.scale(
                                        scale: 1 - t * 0.7,
                                        child: Text(chars[i], style: style),
                                      ),
                                    ),
                                  );
                                },
                              ),
                          ],
                        ),
                      ),
                    ),
                  ),
              ],
            ),
          ),
          const SizedBox(width: 12),
          Semantics(
            button: true,
            label: 'Submit',
            excludeSemantics: true,
            child: MouseRegion(
              cursor: SystemMouseCursors.click,
              child: GestureDetector(
                onTap: _submit,
                child: AnimatedBuilder(
                  animation: _eat,
                  // The arrow gulps as each letter arrives.
                  builder: (context, child) => Transform.scale(
                    scale:
                        1 +
                        0.18 *
                            (0.5 -
                                (_eat.value * chars.length.clamp(1, 99) % 1 -
                                        0.5)
                                    .abs()) *
                            (_eat.isAnimating ? 1 : 0),
                    child: child,
                  ),
                  child: Text('→', style: style),
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }

  final _focus = FocusNode();
}
