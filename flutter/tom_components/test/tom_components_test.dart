import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:tomm/tomm.dart';

/// Puts a widget on screen the way an app would.
Widget host(Widget child) => MaterialApp(
  home: Scaffold(body: Center(child: child)),
);

void main() {
  group('HoldToConfirm', () {
    testWidgets('confirms only after a full hold', (tester) async {
      var confirmed = 0;
      await tester.pumpWidget(
        host(
          HoldToConfirm(label: 'Hold to delete', onConfirm: () => confirmed++),
        ),
      );

      // A short press drains back and does nothing.
      final short = await tester.startGesture(
        tester.getCenter(find.byType(HoldToConfirm)),
      );
      await tester.pump(const Duration(milliseconds: 400));
      await short.up();
      await tester.pumpAndSettle();
      expect(confirmed, 0);

      // A full hold confirms once.
      final long = await tester.startGesture(
        tester.getCenter(find.byType(HoldToConfirm)),
      );
      await tester.pump();
      await tester.pump(const Duration(milliseconds: 1300));
      await long.up();
      await tester.pumpAndSettle();
      expect(confirmed, 1);
      expect(find.text('CONFIRMED'), findsWidgets);
    });
  });

  group('MusicToggle', () {
    testWidgets('flips and reports its state', (tester) async {
      bool? last;
      await tester.pumpWidget(host(MusicToggle(onChanged: (on) => last = on)));
      expect(find.text('SOUND OFF'), findsOneWidget);

      await tester.tap(find.byType(MusicToggle));
      await tester.pump(const Duration(milliseconds: 200));
      expect(last, isTrue);
      expect(find.text('SOUND ON'), findsOneWidget);

      await tester.tap(find.byType(MusicToggle));
      await tester.pump(const Duration(milliseconds: 200));
      expect(last, isFalse);
    });
  });

  group('NumberFlow', () {
    testWidgets('formats with prefix and thousands separators', (tester) async {
      await tester.pumpWidget(
        host(const NumberFlow(value: 1250, prefix: r'$')),
      );
      await tester.pumpAndSettle();
      expect(find.bySemanticsLabel(r'$1,250'), findsOneWidget);

      await tester.pumpWidget(
        host(const NumberFlow(value: 1234567.5, fractionDigits: 2)),
      );
      await tester.pumpAndSettle();
      expect(find.bySemanticsLabel('1,234,567.50'), findsOneWidget);
      expect(tester.takeException(), isNull);
    });
  });

  group('SegmentTags', () {
    testWidgets('renders a tile per segment and reports taps', (tester) async {
      var taps = 0;
      await tester.pumpWidget(
        host(
          SegmentTags(
            mark: const Icon(Icons.pets),
            segments: [
              Segment.label('Research\nGrants', onTap: () => taps++),
              const Segment.label('More\nInformation'),
            ],
          ),
        ),
      );
      expect(find.text('Research\nGrants'), findsOneWidget);
      await tester.tap(find.text('Research\nGrants'));
      expect(taps, 1);
    });
  });

  group('KnockoutBracket', () {
    test('works out the winner, including penalties', () {
      expect(
        const BracketMatch(
          BracketTeam('A', score: 2),
          BracketTeam('B', score: 1),
        ).winner,
        0,
      );
      expect(
        const BracketMatch(
          BracketTeam('A', score: 3, pens: 2),
          BracketTeam('B', score: 3, pens: 4),
        ).winner,
        1,
      );
      expect(const BracketMatch(BracketTeam('A'), null).winner, -1);
    });

    testWidgets('lays out every round', (tester) async {
      await tester.pumpWidget(
        host(
          const KnockoutBracket(
            rounds: [
              BracketRound('Semi-finals', [
                BracketMatch(
                  BracketTeam('Croatia', score: 0),
                  BracketTeam('Argentina', score: 3),
                  note: '13 Dec',
                ),
                BracketMatch(
                  BracketTeam('Morocco', score: 0),
                  BracketTeam('France', score: 2),
                  note: '14 Dec',
                ),
              ]),
              BracketRound('Final', [
                BracketMatch(
                  BracketTeam('Argentina', score: 3, pens: 4),
                  BracketTeam('France', score: 3, pens: 2),
                ),
              ]),
            ],
          ),
        ),
      );
      expect(find.text('SEMI-FINALS'), findsOneWidget);
      expect(find.text('ARGENTINA'), findsNWidgets(2));
      expect(find.text('3 (4)'), findsOneWidget);
      expect(tester.takeException(), isNull);
    });
  });

  group('DynamicIsland', () {
    testWidgets('morphs between views', (tester) async {
      await tester.pumpWidget(host(DynamicIsland(view: IslandView.idle())));
      expect(tester.getSize(find.byType(DynamicIsland)).width, 96);

      await tester.pumpWidget(
        host(
          DynamicIsland(
            view: IslandView.notice('Version 1.2 is live', '26 components'),
          ),
        ),
      );
      await tester.pumpAndSettle();
      expect(tester.getSize(find.byType(DynamicIsland)).width, 280);
      expect(find.text('VERSION 1.2 IS LIVE'), findsOneWidget);
      expect(tester.takeException(), isNull);
    });
  });

  group('Signature', () {
    testWidgets('draws to completion', (tester) async {
      await tester.pumpWidget(host(const Signature()));
      await tester.pumpAndSettle();
      expect(find.bySemanticsLabel('Signature'), findsOneWidget);
      expect(tester.takeException(), isNull);
    });
  });

  group('TextRevealScroll', () {
    testWidgets('reveals as it scrolls into the middle', (tester) async {
      await tester.pumpWidget(
        host(
          ListView(
            children: const [
              SizedBox(
                height: 560,
              ), // just inside the 600px test screen, so it starts unrevealed
              TextRevealScroll(
                text: 'You must not fool yourself, and you are the easiest person to fool.',
              ),
              SizedBox(height: 900),
            ],
          ),
        ),
      );
      await tester.pumpAndSettle();

      double firstWordAlpha() {
        final rich = tester.widget<RichText>(
          find.descendant(
            of: find.byType(TextRevealScroll),
            matching: find.byType(RichText),
          ),
        );
        final first = (rich.text as TextSpan).children!.first as TextSpan;
        // Colours are nested: the outer span carries the style, the word its own colour.
        return ((first.children?.first as TextSpan?) ?? first).style!.color!.a;
      }

      final before = firstWordAlpha();
      await tester.drag(find.byType(ListView), const Offset(0, -320));
      await tester.pumpAndSettle();
      expect(firstWordAlpha(), greaterThan(before));
    });
  });
}
