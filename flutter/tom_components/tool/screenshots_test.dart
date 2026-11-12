// Draws the screenshots shown on pub.dev from the real widgets.
//
//   flutter test tool/screenshots_test.dart --update-goldens
//
// It is kept out of test/ so the normal test run never depends on pixels.
import 'dart:io';

import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:tomm/tomm.dart';

const _stone = Color(0xFFF5F5F4);
final _shot = GlobalKey();

Future<void> _loadFonts() async {
  final dir =
      '${Platform.environment['FLUTTER_ROOT']}/bin/cache/artifacts/material_fonts';
  Future<ByteData> read(String name) async =>
      ByteData.sublistView(await File('$dir/$name').readAsBytes());
  final roboto = FontLoader('Roboto');
  for (final f in ['Regular', 'Medium', 'Bold', 'Black', 'Light']) {
    roboto.addFont(read('Roboto-$f.ttf'));
  }
  await roboto.load();
  final icons = FontLoader('MaterialIcons')
    ..addFont(read('MaterialIcons-Regular.otf'));
  await icons.load();
  // The slip and the receipt are set in a typewriter face.
  final mono = FontLoader('monospace');
  for (final f in ['Courier New.ttf', 'Courier New Bold.ttf']) {
    mono.addFont(
      File('/System/Library/Fonts/Supplemental/$f')
          .readAsBytes()
          .then(ByteData.sublistView),
    );
  }
  await mono.load();
}

Widget _frame(String title, Widget child) => MaterialApp(
  debugShowCheckedModeBanner: false,
  theme: ThemeData(fontFamily: 'Roboto', scaffoldBackgroundColor: _stone),
  home: RepaintBoundary(
    key: _shot,
    child: Scaffold(
      body: Stack(
        children: [
          Center(child: child),
          Positioned(
            left: 32,
            top: 28,
            child: Text(
              Tom.caps('tomm'),
              style: Tom.label(size: 13, weight: FontWeight.w700),
            ),
          ),
          Positioned(
            right: 32,
            top: 28,
            child: Text(
              Tom.caps(title),
              style: Tom.label(size: 13, color: Tom.muted),
            ),
          ),
          Positioned(
            left: 32,
            bottom: 28,
            child: Text(
              Tom.caps('flutter pub add tomm'),
              style: Tom.label(size: 13, color: Tom.muted),
            ),
          ),
        ],
      ),
    ),
  ),
);

Future<void> _save(WidgetTester tester, String name) async {
  await expectLater(
    find.byKey(_shot),
    matchesGoldenFile('../screenshots/$name.png'),
  );
  await tester.pumpWidget(const SizedBox());
  await tester.pump(const Duration(seconds: 5));
  debugDisableShadows = true;
}

void main() {
  setUpAll(_loadFonts);

  Future<void> size(WidgetTester tester) async {
    debugDisableShadows = false;
    tester.view.physicalSize = const Size(2400, 1500);
    tester.view.devicePixelRatio = 2;
    addTearDown(tester.view.reset);
  }

  testWidgets('tickets', (tester) async {
    await size(tester);
    await tester.pumpWidget(
      _frame(
        'Tickets with real QR codes',
        const Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            AdmissionTicket(
              venue: 'Museum\nof Small Interfaces',
              number: '000 114 351',
              date: '11-11-26',
              kind: 'General ticket',
              time: '14.00 to 16.00',
              qr: 'https://tomm.one',
              logo: Icon(Icons.pets),
            ),
            SizedBox(width: 72),
            EventTicket(
              kicker: 'Evening talks',
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
          ],
        ),
      ),
    );
    await tester.pump(const Duration(seconds: 2));
    await _save(tester, 'tickets');
  });

  testWidgets('controls', (tester) async {
    await size(tester);
    await tester.pumpWidget(
      _frame(
        'Hold to confirm, music toggle, number flow',
        Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            const NumberFlow(
              value: 12480,
              prefix: r'$',
              style: TextStyle(
                fontSize: 96,
                fontWeight: FontWeight.w700,
                color: Tom.ink,
              ),
            ),
            const SizedBox(height: 64),
            Row(
              mainAxisSize: MainAxisSize.min,
              children: [
                HoldToConfirm(label: 'Hold to delete', onConfirm: () {}),
                const SizedBox(width: 64),
                const MusicToggle(initialOn: true),
              ],
            ),
          ],
        ),
      ),
    );
    await tester.pump(const Duration(seconds: 1));
    final hold = await tester.startGesture(
      tester.getCenter(find.byType(HoldToConfirm)),
    );
    await tester.pump();
    await tester.pump(const Duration(milliseconds: 700));
    await expectLater(
      find.byKey(_shot),
      matchesGoldenFile('../screenshots/controls.png'),
    );
    await hold.up();
    await tester.pumpWidget(const SizedBox());
    await tester.pump(const Duration(seconds: 5));
    debugDisableShadows = true;
  });

  testWidgets('converter', (tester) async {
    await size(tester);
    await tester.pumpWidget(
      _frame(
        'Swap converter with live rates',
        SwapConverter(
          loadRates: () async => const RatesSnapshot({
            'EUR': 1,
            'USD': 1.12,
            'GBP': 0.84,
            'EGP': 55,
            'JPY': 177,
          }, '2026-11-12'),
        ),
      ),
    );
    await tester.pumpAndSettle();
    await _save(tester, 'converter');
  });

  testWidgets('bracket', (tester) async {
    await size(tester);
    await tester.pumpWidget(
      _frame(
        'Knockout bracket',
        const KnockoutBracket(
          rounds: [
            BracketRound('Quarter-finals', [
              BracketMatch(
                BracketTeam('Croatia', score: 1, pens: 4),
                BracketTeam('Brazil', score: 1, pens: 2),
              ),
              BracketMatch(
                BracketTeam('Netherlands', score: 2, pens: 3),
                BracketTeam('Argentina', score: 2, pens: 4),
              ),
              BracketMatch(
                BracketTeam('Morocco', score: 1),
                BracketTeam('Portugal', score: 0),
              ),
              BracketMatch(
                BracketTeam('England', score: 1),
                BracketTeam('France', score: 2),
              ),
            ]),
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
    await tester.pump(const Duration(seconds: 2));
    await _save(tester, 'bracket');
  });
}
