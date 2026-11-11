import 'dart:ui' show ImageFilter;

import 'package:flutter/material.dart';

import 'tom_style.dart';

/// One state of a [DynamicIsland]: its content and the size the pill takes.
class IslandView {
  const IslandView({
    required this.id,
    required this.child,
    required this.width,
    required this.height,
    this.radius,
  });

  /// Changing the id morphs the island.
  final String id;
  final Widget child;
  final double width;
  final double height;
  final double? radius;

  /// Resting: a short pill with a faint rule.
  static IslandView idle() => IslandView(
    id: 'idle',
    width: 96,
    height: 30,
    child: Center(
      child: Container(
        width: 20,
        height: 1,
        color: Tom.ink.withValues(alpha: 0.3),
      ),
    ),
  );

  /// One line: "Saved", "Copied to clipboard".
  static IslandView status(String text) => IslandView(
    id: 'status-$text',
    width: (text.length * 7.4 + 40).clamp(140, 360).toDouble(),
    height: 34,
    child: Center(
      child: Text(
        Tom.caps(text),
        style: Tom.label(),
        maxLines: 1,
        softWrap: false,
      ),
    ),
  );

  /// A label, a percentage and a thin bar. [value] runs from 0 to 1.
  static IslandView progress(String text, double value) => IslandView(
    id: 'progress-$text',
    width: 240,
    height: 46,
    child: Padding(
      padding: const EdgeInsets.symmetric(horizontal: 20),
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(Tom.caps(text), style: Tom.label()),
              Text(
                '${(value * 100).round()}%',
                style: Tom.label(color: Tom.muted, weight: FontWeight.w400),
              ),
            ],
          ),
          const SizedBox(height: 8),
          TweenAnimationBuilder<double>(
            tween: Tween(begin: 0, end: value.clamp(0, 1).toDouble()),
            duration: const Duration(milliseconds: 800),
            curve: Tom.ease,
            builder: (context, v, _) => Stack(
              children: [
                Container(height: 1, color: Tom.ink.withValues(alpha: 0.15)),
                FractionallySizedBox(
                  widthFactor: v,
                  child: Container(height: 1, color: Tom.ink),
                ),
              ],
            ),
          ),
        ],
      ),
    ),
  );

  /// Two lines: a headline and a quieter detail.
  static IslandView notice(String title, String detail) => IslandView(
    id: 'notice-$title',
    width: 280,
    height: 60,
    radius: 22,
    child: Padding(
      padding: const EdgeInsets.symmetric(horizontal: 20),
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            Tom.caps(title),
            style: Tom.label(),
            maxLines: 1,
            overflow: TextOverflow.ellipsis,
          ),
          Text(
            Tom.caps(detail),
            style: Tom.label(color: Tom.muted, weight: FontWeight.w400),
            maxLines: 1,
            overflow: TextOverflow.ellipsis,
          ),
        ],
      ),
    ),
  );
}

/// A small pill that springs between sizes as its content changes, with the
/// old content blurring out and the new content blurring in. Use it for the
/// small things an app says: saved, copied, publishing, live.
class DynamicIsland extends StatelessWidget {
  const DynamicIsland({
    super.key,
    required this.view,
    this.color = Tom.paper,
    this.borderColor = const Color(0xFFE5E5E5),
  });

  final IslandView view;
  final Color color;
  final Color borderColor;

  @override
  Widget build(BuildContext context) {
    final radius = view.radius ?? (view.height / 2).clamp(0, 32).toDouble();
    return AnimatedContainer(
      duration: const Duration(milliseconds: 550),
      curve: Curves.easeOutBack,
      width: view.width,
      height: view.height,
      clipBehavior: Clip.antiAlias,
      decoration: BoxDecoration(
        color: color,
        borderRadius: BorderRadius.circular(radius),
        border: Border.all(color: borderColor),
        boxShadow: const [
          BoxShadow(
            color: Color(0x2E000000),
            blurRadius: 24,
            offset: Offset(0, 8),
            spreadRadius: -12,
          ),
        ],
      ),
      child: AnimatedSwitcher(
        duration: const Duration(milliseconds: 350),
        reverseDuration: const Duration(milliseconds: 200),
        transitionBuilder: (child, animation) => AnimatedBuilder(
          animation: animation,
          builder: (context, _) {
            final blur = (1 - animation.value) * 8;
            return Opacity(
              opacity: animation.value,
              child: Transform.scale(
                scale: 0.9 + 0.1 * animation.value,
                child: ImageFiltered(
                  imageFilter: ImageFilter.blur(sigmaX: blur, sigmaY: blur),
                  child: child,
                ),
              ),
            );
          },
        ),
        // The content is laid out at its own view's size, so it doesn't reflow while the pill resizes.
        child: OverflowBox(
          key: ValueKey(view.id),
          minWidth: view.width,
          maxWidth: view.width,
          minHeight: view.height,
          maxHeight: view.height,
          child: view.child,
        ),
      ),
    );
  }
}
