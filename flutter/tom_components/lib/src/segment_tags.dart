import 'package:flutter/material.dart';

/// One tile in a [SegmentTags] label: either text or a picture.
class Segment {
  /// A text tile. Use "\n" for a second line.
  const Segment.label(String this.label, {this.onTap}) : image = null;

  /// A picture tile.
  const Segment.image(ImageProvider this.image, {this.onTap}) : label = null;

  final String? label;
  final ImageProvider? image;
  final VoidCallback? onTap;
}

/// A label built from soft-cornered tiles that sit shoulder to shoulder: a
/// square mark, then one tile per label, then optionally a picture.
/// Everything scales from [size], the tile height.
class SegmentTags extends StatelessWidget {
  const SegmentTags({
    super.key,
    required this.segments,
    this.mark,
    this.color = const Color(0xFFA9A9AD),
    this.ink = const Color(0xFFECECEE),
    this.size = 72,
  });

  final List<Segment> segments;

  /// Shown in the first tile: a logo, an icon, a letter.
  final Widget? mark;
  final Color color;
  final Color ink;
  final double size;

  @override
  Widget build(BuildContext context) {
    final radius = BorderRadius.circular(size * 0.26);
    final style = TextStyle(
      fontSize: size * 0.36,
      height: 0.95,
      letterSpacing: size * 0.36 * -0.03,
      fontWeight: FontWeight.w600,
      color: ink,
      decoration: TextDecoration.none,
    );

    Widget tile({
      required Widget child,
      double? width,
      EdgeInsets padding = EdgeInsets.zero,
      VoidCallback? onTap,
    }) {
      final box = ClipRRect(
        borderRadius: radius,
        child: Container(
          height: size,
          width: width,
          padding: padding,
          color: color,
          alignment: Alignment.centerLeft,
          child: child,
        ),
      );
      if (onTap == null) return box;
      return MouseRegion(
        cursor: SystemMouseCursors.click,
        child: GestureDetector(onTap: onTap, child: box),
      );
    }

    return Wrap(
      spacing: 1,
      runSpacing: 1,
      children: [
        if (mark != null)
          tile(
            width: size * 1.18,
            child: Center(
              child: SizedBox.square(
                dimension: size * 0.52,
                child: IconTheme(
                  data: IconThemeData(color: ink, size: size * 0.52),
                  child: FittedBox(child: mark),
                ),
              ),
            ),
          ),
        for (final segment in segments)
          if (segment.image != null)
            tile(
              width: size * 1.75,
              onTap: segment.onTap,
              child: Image(
                image: segment.image!,
                fit: BoxFit.cover,
                width: size * 1.75,
                height: size,
              ),
            )
          else
            tile(
              padding: EdgeInsets.symmetric(horizontal: size * 0.22),
              onTap: segment.onTap,
              child: Text(segment.label!, style: style),
            ),
      ],
    );
  }
}
