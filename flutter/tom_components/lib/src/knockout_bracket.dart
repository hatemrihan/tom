import 'package:flutter/material.dart';

import 'tom_style.dart';

class BracketTeam {
  const BracketTeam(this.name, {this.score, this.pens});

  final String name;
  final int? score;

  /// Penalty shoot-out score, shown in brackets after the score.
  final int? pens;
}

class BracketMatch {
  const BracketMatch(this.home, this.away, {this.note});

  /// Null while the team isn't known yet.
  final BracketTeam? home;
  final BracketTeam? away;

  /// Small line above the match: a date, a venue.
  final String? note;

  /// 0 or 1 for the winning side, -1 if undecided.
  int get winner {
    final a = home, b = away;
    if (a?.score == null || b?.score == null) return -1;
    if (a!.score != b!.score) return a.score! > b.score! ? 0 : 1;
    if (a.pens != null && b.pens != null && a.pens != b.pens) {
      return a.pens! > b.pens! ? 0 : 1;
    }
    return -1;
  }
}

class BracketRound {
  const BracketRound(this.title, this.matches);

  final String title;
  final List<BracketMatch> matches;
}

/// A tournament bracket drawn like a fixture list: names, scores and thin
/// rules joining each pair to the next round. No boxes, no badges.
class KnockoutBracket extends StatelessWidget {
  const KnockoutBracket({
    super.key,
    required this.rounds,
    this.height = 340,
    this.columnWidth = 176,
    this.gap = 40,
    this.placeholder = 'To be decided',
  });

  /// Rounds from first to final. Each has half the matches of the one before.
  final List<BracketRound> rounds;
  final double height;
  final double columnWidth;
  final double gap;
  final String placeholder;

  @override
  Widget build(BuildContext context) {
    return SingleChildScrollView(
      scrollDirection: Axis.horizontal,
      child: SizedBox(
        height: height,
        child: Row(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            for (var r = 0; r < rounds.length; r++)
              Padding(
                padding: EdgeInsets.only(left: r == 0 ? 0 : gap),
                child: SizedBox(
                  width: columnWidth,
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.stretch,
                    children: [
                      Text(
                        Tom.caps(rounds[r].title),
                        style: Tom.label(
                          color: Tom.faint,
                          weight: FontWeight.w400,
                        ),
                      ),
                      const SizedBox(height: 16),
                      for (var i = 0; i < rounds[r].matches.length; i++)
                        Expanded(
                          child: CustomPaint(
                            // Rules: out to the right, up or down to its pair, and in from the left.
                            painter: _Rules(
                              first: r == 0,
                              last: r == rounds.length - 1,
                              upper: i.isEven,
                              gap: gap,
                            ),
                            child: Align(
                              alignment: Alignment.centerLeft,
                              child: _Match(
                                match: rounds[r].matches[i],
                                placeholder: placeholder,
                              ),
                            ),
                          ),
                        ),
                    ],
                  ),
                ),
              ),
          ],
        ),
      ),
    );
  }
}

class _Match extends StatelessWidget {
  const _Match({required this.match, required this.placeholder});

  final BracketMatch match;
  final String placeholder;

  @override
  Widget build(BuildContext context) {
    final winner = match.winner;

    Widget row(BracketTeam? team, int side) {
      final lost = team != null && winner != -1 && winner != side;
      final style = team == null
          ? Tom.label(color: Tom.rule, weight: FontWeight.w400)
          : Tom.label(
              color: lost ? Tom.faint : Tom.ink,
              weight: lost ? FontWeight.w400 : FontWeight.w500,
            );
      return Row(
        children: [
          Expanded(
            child: Text(
              Tom.caps(team?.name ?? placeholder),
              style: style,
              overflow: TextOverflow.ellipsis,
            ),
          ),
          if (team?.score != null)
            Text(
              '${team!.score}${team.pens != null ? ' (${team.pens})' : ''}',
              style: style.copyWith(
                fontFeatures: const [FontFeature.tabularFigures()],
              ),
            ),
        ],
      );
    }

    return Column(
      mainAxisSize: MainAxisSize.min,
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: [
        if (match.note != null)
          Text(
            Tom.caps(match.note!),
            style: Tom.label(color: Tom.faint, weight: FontWeight.w400),
          ),
        row(match.home, 0),
        row(match.away, 1),
      ],
    );
  }
}

class _Rules extends CustomPainter {
  const _Rules({
    required this.first,
    required this.last,
    required this.upper,
    required this.gap,
  });

  final bool first;
  final bool last;
  final bool upper;
  final double gap;

  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint()
      ..color = Tom.rule
      ..strokeWidth = 1;
    final mid = size.height / 2;
    final half = gap / 2;
    if (!last) {
      final x = size.width + half;
      canvas.drawLine(Offset(x - 12, mid), Offset(x, mid), paint);
      canvas.drawLine(
        Offset(x, mid),
        Offset(x, upper ? size.height : 0),
        paint,
      );
    }
    if (!first) {
      canvas.drawLine(Offset(-half, mid), Offset(-half + 12, mid), paint);
    }
  }

  @override
  bool shouldRepaint(_Rules old) =>
      old.first != first ||
      old.last != last ||
      old.upper != upper ||
      old.gap != gap;
}
