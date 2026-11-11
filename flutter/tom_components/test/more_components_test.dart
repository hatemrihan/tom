import 'dart:convert';
import 'dart:typed_data';

import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:tomm/tomm.dart';

Widget host(Widget child) => MaterialApp(
  home: Scaffold(body: Center(child: child)),
);

/// A one-pixel PNG, so image widgets have something real to decode without the network.
final ImageProvider pixel = MemoryImage(
  base64Decode(
    'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==',
  ),
);

void main() {
  testWidgets('BoxRevealText and HorizontalTextScroll lay out and scroll', (
    tester,
  ) async {
    await tester.pumpWidget(
      host(
        ListView(
          children: const [
            SizedBox(height: 500),
            BoxRevealText(
              lines: ['What I cannot create,', 'I do not understand.'],
              alignment: CrossAxisAlignment.center,
            ),
            HorizontalTextScroll(text: 'Design · Build · Ship'),
            SizedBox(height: 400),
          ],
        ),
      ),
    );
    await tester.pump();
    await tester.drag(find.byType(ListView), const Offset(0, -700));
    await tester.pumpAndSettle();
    await tester.drag(find.byType(ListView), const Offset(0, -900));
    await tester.pumpAndSettle();
    expect(tester.takeException(), isNull);
  });

  testWidgets('TickScrollArea jumps when the ruler is tapped', (tester) async {
    await tester.pumpWidget(
      host(
        SizedBox(
          height: 400,
          width: 500,
          child: TickScrollArea(
            child: Column(
              children: [for (var i = 0; i < 60; i++) Text('Paragraph $i')],
            ),
          ),
        ),
      ),
    );
    await tester.pumpAndSettle();
    expect(find.text('0%'), findsOneWidget);

    await tester.tap(find.byType(CustomPaint).last);
    await tester.pumpAndSettle();
    expect(find.text('0%'), findsNothing);
    expect(tester.takeException(), isNull);
  });

  testWidgets('ScrollSpyNav moves to a tapped section', (tester) async {
    final seen = <String>[];
    await tester.pumpWidget(
      host(
        SizedBox(
          height: 420,
          width: 640,
          child: ScrollSpyNav(
            title: 'How it works',
            onChanged: seen.add,
            sections: [
              for (final id in ['index', 'line', 'rule', 'edges'])
                SpySection(
                  id: id,
                  title: 'The $id',
                  child: SizedBox(height: 300, child: Text('About the $id')),
                ),
            ],
          ),
        ),
      ),
    );
    await tester.pumpAndSettle();

    await tester.tap(find.text('THE EDGES').first);
    await tester.pumpAndSettle();
    expect(seen, contains('edges'));
    expect(tester.takeException(), isNull);
  });

  testWidgets('ExpandColumns and ExpandOnHover open the tapped item', (
    tester,
  ) async {
    int? column;
    int? panel;
    await tester.pumpWidget(
      host(
        Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            ExpandColumns(
              height: 200,
              onChanged: (i) => column = i,
              items: [
                for (final n in ['Curie', 'Einstein', 'Bohr'])
                  ColumnItem(title: n, meta: '1921', image: pixel),
              ],
            ),
            SizedBox(
              width: 600,
              child: ExpandOnHover(
                height: 160,
                onChanged: (i) => panel = i,
                items: [
                  for (final n in ['Feynman', 'Dirac', 'Tesla'])
                    ExpandItem(title: n, subtitle: 'Physics', image: pixel),
                ],
              ),
            ),
          ],
        ),
      ),
    );
    await tester.pumpAndSettle();

    await tester.tap(find.text('BOHR'));
    await tester.pumpAndSettle();
    expect(column, 2);

    await tester.tap(find.bySemanticsLabel('Tesla'));
    await tester.pumpAndSettle();
    expect(panel, 2);
    expect(tester.takeException(), isNull);
  });

  testWidgets('HoverMembers and ProjectIndex swap their captions', (
    tester,
  ) async {
    await tester.pumpWidget(
      host(
        Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            HoverMembers(
              title: 'Physics',
              members: [
                Member(name: 'Feynman', role: 'QED', image: pixel),
                Member(name: 'Curie', role: 'Radioactivity', image: pixel),
              ],
            ),
            ProjectIndex(
              previewWidth: 80,
              projects: [
                IndexProject(name: 'Feynman', meta: '1965', image: pixel),
                IndexProject(name: 'Curie', meta: '1903', image: pixel),
              ],
            ),
          ],
        ),
      ),
    );
    await tester.pumpAndSettle();
    expect(find.text('PHYSICS'), findsOneWidget);
    expect(find.text('2 PEOPLE'), findsOneWidget);

    await tester.tap(find.bySemanticsLabel('Curie, Radioactivity'));
    await tester.pumpAndSettle();
    expect(find.text('RADIOACTIVITY'), findsOneWidget);

    expect(find.text('1965'), findsOneWidget);
    await tester.tap(find.text('CURIE').last);
    await tester.pumpAndSettle();
    expect(find.text('1903'), findsOneWidget);
    expect(tester.takeException(), isNull);
  });

  testWidgets('tickets and the slip render, with real QR codes', (
    tester,
  ) async {
    await tester.pumpWidget(
      host(
        SingleChildScrollView(
          child: Column(
            children: [
              const AdmissionTicket(
                venue: 'TOM Museum\nof Small Interfaces',
                number: '000 114 351',
                date: '11-11-26',
                kind: 'General ticket',
                time: '14.00 to 16.00',
                qr: 'https://tomm.one',
                logo: Icon(Icons.pets),
              ),
              const EventTicket(
                kicker: 'TOM talks',
                title: 'The grammar of motion',
                day: '19',
                month: 'November 2026',
                number: '000 114 351',
                qr: 'https://tomm.one/components/event-ticket',
                details: [
                  TicketDetail('Day', 'Thursday'),
                  TicketDetail('Doors', '19.00'),
                  TicketDetail('Venue', 'Studio 4'),
                  TicketDetail('Seat', 'B 12'),
                ],
              ),
              ResultSlip(
                title: const ['TOM component', 'result', 'slip'],
                about: 'An open-source library of components.',
                disclaimer: 'Copy one file, change anything, ship it.',
                wordmark: 'TOM',
                figure: const Icon(Icons.pets),
                contacts: const [SlipContact('X', '@hatemrihan')],
                places: const [
                  SlipPlace('Source', ['github.com/hatemrihan/tom']),
                ],
                credit: 'Built by hand.',
                printedAt: DateTime(2026, 11, 11, 14, 5),
              ),
            ],
          ),
        ),
      ),
    );
    await tester.pump();
    expect(find.byType(TomQr), findsNWidgets(3));
    expect(find.text('GENERAL TICKET'), findsOneWidget);
    expect(find.text('19'), findsOneWidget);
    expect(find.text('DATE  11/11/2026'), findsOneWidget);
    expect(find.text('TIME  14:05'), findsOneWidget);
    expect(tester.takeException(), isNull);
  });

  testWidgets('ReceiptPrinter shows processing, then approves and prints', (
    tester,
  ) async {
    var approved = false;
    await tester.pumpWidget(
      host(
        SingleChildScrollView(
          child: ReceiptPrinter(onApproved: () => approved = true),
        ),
      ),
    );
    expect(find.text('PROCESSING PAYMENT'), findsOneWidget);
    expect(find.text('£14.52'), findsWidgets); // 12.10 plus 20% VAT

    await tester.pump(const Duration(milliseconds: 2300));
    await tester.pump(const Duration(milliseconds: 1900));
    expect(approved, isTrue);
    expect(find.text('APPROVED'), findsOneWidget);
    expect(find.text('2 × FLAT WHITE'), findsOneWidget);
    expect(find.text('VAT 20%'), findsOneWidget);
    expect(tester.takeException(), isNull);
  });

  testWidgets('DrawingCursor keeps strokes and exports a PNG', (tester) async {
    Uint8List? saved;
    await tester.pumpWidget(
      host(
        SizedBox(
          width: 400,
          height: 300,
          child: DrawingCursor(onSave: (bytes) => saved = bytes),
        ),
      ),
    );
    final state = tester.state<DrawingCursorState>(find.byType(DrawingCursor));
    expect(state.isEmpty, isTrue);

    await tester.dragFrom(
      tester.getCenter(find.byType(DrawingCursor)),
      const Offset(80, 40),
    );
    await tester.pump();
    expect(state.isEmpty, isFalse);

    final bytes = await tester.runAsync(() => state.toPng());
    expect(bytes, isNotNull);
    expect(bytes!.sublist(1, 4), utf8.encode('PNG'));

    await tester.runAsync(() async {
      await tester.tap(find.text('SAVE PNG'));
      await Future<void>.delayed(const Duration(milliseconds: 200));
    });
    expect(saved, isNotNull);

    await tester.tap(find.text('CLEAR'));
    await tester.pump();
    expect(state.isEmpty, isTrue);
  });

  testWidgets('StairsPreloader counts, lifts and reports completion', (
    tester,
  ) async {
    var done = false;
    await tester.pumpWidget(
      host(
        SizedBox(
          width: 400,
          height: 300,
          child: StairsPreloader(
            onComplete: () => done = true,
            child: const Center(child: Text('Page')),
          ),
        ),
      ),
    );
    expect(find.text('LOADING'), findsOneWidget);
    await tester.pumpAndSettle(const Duration(milliseconds: 100));
    expect(done, isTrue);
    expect(find.text('LOADING'), findsNothing);
    expect(find.text('Page'), findsOneWidget);
  });

  testWidgets('DevourInput swallows the text and submits it', (tester) async {
    String? sent;
    await tester.pumpWidget(
      host(
        SizedBox(
          width: 500,
          child: DevourInput(onSubmit: (v) async => sent = v),
        ),
      ),
    );
    await tester.enterText(find.byType(EditableText), 'ada@studio.com');
    await tester.pump();
    await tester.tap(find.bySemanticsLabel('Submit'));
    await tester.pump();
    await tester.pump(const Duration(milliseconds: 1000));
    expect(sent, 'ada@studio.com');
    expect(find.text('Thank you'), findsOneWidget);
    await tester.pump(const Duration(milliseconds: 2500));
    expect(tester.takeException(), isNull);
  });

  testWidgets('SwapConverter converts with live rates and flips', (
    tester,
  ) async {
    await tester.pumpWidget(
      host(
        SwapConverter(
          loadRates: () async => const RatesSnapshot({
            'EUR': 1,
            'USD': 2,
            'EGP': 50,
          }, '2026-11-11'),
        ),
      ),
    );
    await tester.pumpAndSettle();
    expect(find.text('LIVE RATE, 2026-11-11'), findsOneWidget);
    expect(find.text('50'), findsOneWidget); // 100 USD at 2 USD per EUR
    expect(find.text('1 USD = 0.5 EUR'), findsOneWidget);

    await tester.tap(find.bySemanticsLabel('Swap currencies'));
    await tester.pumpAndSettle();
    expect(find.text('200'), findsOneWidget);
    expect(find.text('1 EUR = 2 USD'), findsOneWidget);
  });

  testWidgets('SwapConverter falls back when rates fail', (tester) async {
    await tester.pumpWidget(
      host(SwapConverter(loadRates: () async => throw Exception('offline'))),
    );
    await tester.pumpAndSettle();
    expect(find.text('OFFLINE, SHOWING SAVED RATES'), findsOneWidget);
  });

  testWidgets('InfiniteDragGrid wraps in every direction', (tester) async {
    final built = <int>{};
    await tester.pumpWidget(
      host(
        SizedBox(
          width: 500,
          height: 400,
          child: InfiniteDragGrid(
            itemCount: 8,
            itemBuilder: (context, i) {
              built.add(i);
              return ColoredBox(color: Colors.primaries[i]);
            },
          ),
        ),
      ),
    );
    await tester.drag(find.byType(InfiniteDragGrid), const Offset(900, 700));
    await tester.pump(const Duration(milliseconds: 100));
    await tester.drag(
      find.byType(InfiniteDragGrid),
      const Offset(-2500, -1800),
    );
    await tester.pumpAndSettle();
    expect(built.every((i) => i >= 0 && i < 8), isTrue);
    expect(built.length, 8);
    expect(tester.takeException(), isNull);
  });

  testWidgets(
    'LiquidGlassOrb, LiquidGlassLogo and TopographicFlow animate without error',
    (tester) async {
      var revealed = false;
      await tester.pumpWidget(
        host(
          Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              const LiquidGlassOrb(
                state: OrbState.thinking,
                level: 0.6,
                size: 80,
              ),
              LiquidGlassLogo(
                size: 80,
                onComplete: () => revealed = true,
                child: const Icon(Icons.pets),
              ),
              const SizedBox(width: 300, height: 120, child: TopographicFlow()),
            ],
          ),
        ),
      );
      for (var i = 0; i < 8; i++) {
        await tester.pump(const Duration(milliseconds: 450));
      }
      expect(revealed, isTrue);
      expect(find.bySemanticsLabel('Assistant is thinking'), findsOneWidget);
      expect(tester.takeException(), isNull);
    },
  );

  testWidgets('ScrollColorList changes focus as it scrolls', (tester) async {
    final seen = <int>[];
    await tester.pumpWidget(
      host(
        SizedBox(
          width: 700,
          height: 400,
          child: ScrollColorList(
            haptics: false,
            onChanged: seen.add,
            items: [
              for (final (i, n) in [
                'Feynman',
                'Curie',
                'Einstein',
                'Bohr',
              ].indexed)
                ColorListItem(
                  title: n,
                  tag: 'Physics',
                  meta: '19${20 + i}',
                  color: Colors.primaries[i].shade100,
                  image: pixel,
                ),
            ],
          ),
        ),
      ),
    );
    await tester.pumpAndSettle();
    await tester.drag(find.byType(ListView), const Offset(0, -130));
    await tester.pumpAndSettle();
    expect(seen, isNotEmpty);
    expect(seen.every((i) => i >= 0 && i < 4), isTrue);
    expect(tester.takeException(), isNull);
  });
}
