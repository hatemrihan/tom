import 'dart:math' as math;

import 'package:flutter/material.dart';

import 'tom_style.dart';

/// A sound switch pared down to a few moving bars and one word. It keeps no
/// audio of its own: play or pause your sound in [onChanged].
class MusicToggle extends StatefulWidget {
  const MusicToggle({
    super.key,
    this.initialOn = false,
    this.onChanged,
    this.bars = 4,
    this.onLabel = 'Sound on',
    this.offLabel = 'Sound off',
    this.color = Tom.ink,
    this.offColor = Tom.faint,
  });

  final bool initialOn;
  final ValueChanged<bool>? onChanged;
  final int bars;
  final String onLabel;
  final String offLabel;
  final Color color;
  final Color offColor;

  @override
  State<MusicToggle> createState() => _MusicToggleState();
}

class _MusicToggleState extends State<MusicToggle>
    with SingleTickerProviderStateMixin {
  late bool _on = widget.initialOn;
  late final AnimationController _beat = AnimationController(
    vsync: this,
    duration: const Duration(milliseconds: 1100),
  );

  @override
  void initState() {
    super.initState();
    if (_on) _beat.repeat();
  }

  void _toggle() {
    setState(() => _on = !_on);
    _on ? _beat.repeat() : _beat.stop();
    widget.onChanged?.call(_on);
  }

  @override
  void dispose() {
    _beat.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final color = _on ? widget.color : widget.offColor;
    return Semantics(
      button: true,
      toggled: _on,
      label: _on ? widget.onLabel : widget.offLabel,
      child: MouseRegion(
        cursor: SystemMouseCursors.click,
        child: GestureDetector(
          behavior: HitTestBehavior.opaque,
          onTap: _toggle,
          child: Row(
            mainAxisSize: MainAxisSize.min,
            children: [
              SizedBox(
                height: 11,
                child: AnimatedBuilder(
                  animation: _beat,
                  builder: (context, _) => Row(
                    mainAxisSize: MainAxisSize.min,
                    crossAxisAlignment: CrossAxisAlignment.center,
                    children: [
                      for (var i = 0; i < widget.bars; i++)
                        Padding(
                          padding: EdgeInsets.only(left: i == 0 ? 0 : 2),
                          child: AnimatedContainer(
                            duration: const Duration(milliseconds: 180),
                            width: 2,
                            // Each bar follows the same wave, a little out of step with its neighbour.
                            height: _on
                                ? 3 +
                                      8 *
                                          (0.5 +
                                              0.5 *
                                                  math.sin(
                                                    (_beat.value + i * 0.23) *
                                                        2 *
                                                        math.pi,
                                                  ))
                                : 2,
                            color: color,
                          ),
                        ),
                    ],
                  ),
                ),
              ),
              const SizedBox(width: 8),
              Text(
                Tom.caps(_on ? widget.onLabel : widget.offLabel),
                style: Tom.label(color: color),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
