import 'package:flutter/material.dart';

class SlipContact {
  const SlipContact(this.label, this.value);

  final String label;
  final String value;
}

class SlipPlace {
  const SlipPlace(this.city, this.lines);

  final String city;
  final List<String> lines;
}

/// A printed result slip: tinted paper cut with side tabs, everything set in
/// small monospaced capitals on a loose grid, stamped with the real date and
/// time it was printed.
class ResultSlip extends StatelessWidget {
  const ResultSlip({
    super.key,
    required this.title,
    required this.about,
    required this.disclaimer,
    required this.wordmark,
    this.figure,
    this.contacts = const [],
    this.places = const [],
    this.stamp = 'Duplicate copy',
    this.credit,
    this.footer,
    this.printedAt,
    this.color = const Color(0xFFDFE6F7),
    this.ink = const Color(0xFF22327A),
    this.width = 760,
  });

  /// Big title, one entry per line.
  final List<String> title;
  final String about;

  /// Picture in the dark window.
  final Widget? figure;
  final List<SlipContact> contacts;
  final List<SlipPlace> places;

  /// Boxed small print, top right.
  final String disclaimer;
  final String stamp;

  /// Tall wordmark, bottom right.
  final String wordmark;
  final String? credit;
  final String? footer;

  /// Printed date and time. Defaults to now.
  final DateTime? printedAt;
  final Color color;
  final Color ink;
  final double width;

  static String _two(int n) => n.toString().padLeft(2, '0');

  @override
  Widget build(BuildContext context) {
    final now = printedAt ?? DateTime.now();
    final date = '${_two(now.day)}/${_two(now.month)}/${now.year}';
    final time = '${_two(now.hour)}:${_two(now.minute)}';
    final mono = TextStyle(
      fontFamily: 'monospace',
      fontFamilyFallback: const ['Menlo', 'Courier New', 'Courier'],
      fontSize: 8.5,
      height: 1.45,
      letterSpacing: 0.35,
      fontWeight: FontWeight.w500,
      color: ink,
      decoration: TextDecoration.none,
    );
    String up(String s) => s.toUpperCase();

    return SizedBox(
      width: width,
      child: ClipPath(
        clipper: const _Tabs(),
        child: Container(
          color: color,
          padding: const EdgeInsets.fromLTRB(22, 16, 22, 16),
          child: DefaultTextStyle(
            style: mono,
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                IntrinsicHeight(
                  child: Row(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Expanded(
                        flex: 125,
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            for (final line in title)
                              Text(
                                up(line),
                                style: mono.copyWith(
                                  fontSize: 22,
                                  height: 1.05,
                                  letterSpacing: 0.4,
                                ),
                                maxLines: 1,
                                softWrap: false,
                              ),
                            const SizedBox(height: 12),
                            Text(up(about)),
                          ],
                        ),
                      ),
                      const SizedBox(width: 20),
                      Expanded(
                        flex: 85,
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Container(
                              height: 88,
                              color: ink,
                              alignment: Alignment.center,
                              child: figure == null
                                  ? null
                                  : IconTheme(
                                      data: IconThemeData(
                                        color: color,
                                        size: 56,
                                      ),
                                      child: figure!,
                                    ),
                            ),
                            const SizedBox(height: 12),
                            for (final c in contacts)
                              Row(
                                children: [
                                  SizedBox(width: 48, child: Text(up(c.label))),
                                  Expanded(
                                    child: Text(
                                      up(c.value),
                                      maxLines: 1,
                                      overflow: TextOverflow.ellipsis,
                                    ),
                                  ),
                                ],
                              ),
                          ],
                        ),
                      ),
                      const SizedBox(width: 20),
                      Expanded(
                        flex: 125,
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.stretch,
                          children: [
                            Container(
                              decoration: BoxDecoration(
                                border: Border.all(color: ink),
                                borderRadius: BorderRadius.circular(3),
                              ),
                              padding: const EdgeInsets.symmetric(
                                horizontal: 8,
                                vertical: 6,
                              ),
                              child: Column(
                                children: [
                                  const Text('· DISCLAIMER ·'),
                                  const SizedBox(height: 4),
                                  Text(
                                    up(disclaimer),
                                    textAlign: TextAlign.justify,
                                  ),
                                ],
                              ),
                            ),
                            const SizedBox(height: 6),
                            Text(
                              up(stamp),
                              textAlign: TextAlign.center,
                              style: mono.copyWith(
                                fontSize: 13,
                                letterSpacing: 0.8,
                              ),
                            ),
                            const SizedBox(height: 10),
                            const Text('THIS SLIP\nIS PRINTED ON'),
                            const SizedBox(height: 8),
                            Row(
                              mainAxisAlignment: MainAxisAlignment.spaceBetween,
                              children: [
                                Text('DATE  $date'),
                                Text('TIME  $time'),
                              ],
                            ),
                            const SizedBox(height: 12),
                            const Text('THANK YOU AND HAVE A NICE DAY'),
                          ],
                        ),
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: 32),
                Row(
                  crossAxisAlignment: CrossAxisAlignment.end,
                  children: [
                    for (final p in places)
                      Expanded(
                        flex: 105,
                        child: Padding(
                          padding: const EdgeInsets.only(right: 20),
                          child: Text(
                            up('◎  ${p.city}\n${p.lines.join('\n')}'),
                          ),
                        ),
                      ),
                    Expanded(
                      flex: 125,
                      child: Row(
                        crossAxisAlignment: CrossAxisAlignment.end,
                        children: [
                          // A light, condensed wordmark, stretched tall.
                          Transform.scale(
                            scaleY: 1.5,
                            alignment: Alignment.bottomLeft,
                            child: Text(
                              up(wordmark),
                              style: mono.copyWith(
                                fontSize: 44,
                                height: 0.8,
                                letterSpacing: -1.8,
                                fontWeight: FontWeight.w300,
                              ),
                            ),
                          ),
                          const SizedBox(width: 12),
                          Expanded(
                            child: Text(
                              up(
                                [credit, footer].whereType<String>().join('\n'),
                              ),
                              textAlign: TextAlign.justify,
                            ),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}

/// The outline: a slip with tabs cut into the left and right edges.
class _Tabs extends CustomClipper<Path> {
  const _Tabs();

  @override
  Path getClip(Size size) {
    final w = size.width, h = size.height, t = w * 0.012;
    return Path()
      ..moveTo(0, 0)
      ..lineTo(w, 0)
      ..lineTo(w, h * 0.05)
      ..lineTo(w - t, h * 0.07)
      ..lineTo(w - t, h * 0.33)
      ..lineTo(w, h * 0.35)
      ..lineTo(w, h * 0.68)
      ..lineTo(w - t, h * 0.70)
      ..lineTo(w - t, h)
      ..lineTo(0, h)
      ..lineTo(0, h * 0.71)
      ..lineTo(t, h * 0.69)
      ..lineTo(t, h * 0.12)
      ..lineTo(0, h * 0.10)
      ..close();
  }

  @override
  bool shouldReclip(_Tabs old) => false;
}
