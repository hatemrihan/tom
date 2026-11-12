import 'package:flutter/material.dart';
import 'package:tomm/tomm.dart';

void main() => runApp(const GalleryApp());

/// A small gallery: one screen, a handful of the widgets, nothing to set up.
class GalleryApp extends StatelessWidget {
  const GalleryApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'tomm',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        scaffoldBackgroundColor: const Color(0xFFFAFAF9),
        colorScheme: ColorScheme.fromSeed(seedColor: Tom.blue),
      ),
      home: const Gallery(),
    );
  }
}

class Gallery extends StatefulWidget {
  const Gallery({super.key});

  @override
  State<Gallery> createState() => _GalleryState();
}

class _GalleryState extends State<Gallery> {
  num _total = 1250;
  String _status = 'Nothing deleted yet';

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SafeArea(
        child: ListView(
          padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 32),
          children: [
            // Press and hold. Letting go early drains it back.
            Section(
              'Hold to confirm',
              note: _status,
              child: HoldToConfirm(
                label: 'Hold to delete',
                resetAfter: const Duration(seconds: 2),
                onConfirm: () => setState(() => _status = 'Deleted'),
              ),
            ),

            // A sound switch with bars that move while it is on.
            Section(
              'Music toggle',
              child: MusicToggle(
                onChanged: (on) => debugPrint(on ? 'play' : 'pause'),
              ),
            ),

            // Digits roll to the new value whenever it changes.
            Section(
              'Number flow',
              note: 'Tap the number',
              child: GestureDetector(
                onTap: () => setState(() => _total += 349),
                child: NumberFlow(
                  value: _total,
                  prefix: r'$',
                  style: const TextStyle(
                    fontSize: 44,
                    fontWeight: FontWeight.w600,
                    color: Tom.ink,
                  ),
                ),
              ),
            ),

            // Live exchange rates, with saved ones when offline.
            const Section(
              'Swap converter',
              child: SwapConverter(from: 'USD', to: 'EUR'),
            ),

            // Tickets paint a real QR code you can scan.
            const Section(
              'Admission ticket',
              child: FittedBox(
                fit: BoxFit.scaleDown,
                child: AdmissionTicket(
                  venue: 'Museum\nof Small Interfaces',
                  number: '000 114 351',
                  date: '11-11-26',
                  kind: 'General ticket',
                  time: '14.00 to 16.00',
                  qr: 'https://tomm.one',
                  logo: Icon(Icons.pets),
                ),
              ),
            ),
            const Section(
              'Event ticket',
              child: EventTicket(
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
            ),

            // A tournament tree. Winners are worked out from the scores.
            const Section(
              'Knockout bracket',
              child: SingleChildScrollView(
                scrollDirection: Axis.horizontal,
                child: KnockoutBracket(
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
            ),

            // Words light up as the paragraph scrolls through the screen.
            const Section(
              'Text reveal on scroll',
              child: TextRevealScroll(
                text:
                    'Simple and direct. Every widget here was taken from a '
                    'real product, then cleaned up until nothing was left to remove.',
              ),
            ),
            const SizedBox(height: 320),
          ],
        ),
      ),
    );
  }
}

/// A labelled block of the gallery.
class Section extends StatelessWidget {
  const Section(this.title, {super.key, required this.child, this.note});

  final String title;
  final String? note;
  final Widget child;

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 56),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Text(Tom.caps(title), style: Tom.label()),
              const Spacer(),
              if (note != null)
                Text(Tom.caps(note!), style: Tom.label(color: Tom.faint)),
            ],
          ),
          const SizedBox(height: 8),
          const Divider(height: 1, color: Tom.rule),
          const SizedBox(height: 24),
          Center(child: child),
        ],
      ),
    );
  }
}
