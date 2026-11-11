import 'dart:async';
import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:http/http.dart' as http;

import 'tom_style.dart';

/// Live rates and the day they are for.
class RatesSnapshot {
  const RatesSnapshot(this.rates, this.date);

  /// Units of each currency per 1 EUR.
  final Map<String, double> rates;
  final String date;
}

/// A currency converter on live rates: type an amount, read the result, flip
/// the pair. Two numbers, two pickers and one line of small print.
class SwapConverter extends StatefulWidget {
  const SwapConverter({
    super.key,
    this.from = 'USD',
    this.to = 'EUR',
    this.currencies,
    this.loadRates,
    this.refresh = const Duration(hours: 1),
    this.fallback = const {
      'EUR': 1,
      'USD': 1.12,
      'GBP': 0.84,
      'EGP': 55,
      'SAR': 4.2,
      'AED': 4.1,
      'JPY': 177,
      'CHF': 0.92,
      'CAD': 1.59,
      'AUD': 1.62,
      'CNY': 7.48,
      'INR': 105,
      'TRY': 56,
    },
    this.width = 288,
  });

  final String from;
  final String to;

  /// Currency codes offered. Leave out to offer the common ones the rates cover.
  final List<String>? currencies;

  /// Where live rates come from. Defaults to the open fawazahmed0
  /// currency-api on jsDelivr: updated daily, free and without a key.
  final Future<RatesSnapshot> Function()? loadRates;
  final Duration refresh;

  /// Rates used until the first response, and if the request fails.
  final Map<String, double> fallback;
  final double width;

  /// Shown first; everything else follows in alphabetical order.
  static const pinned = [
    'USD',
    'EUR',
    'GBP',
    'EGP',
    'SAR',
    'AED',
    'JPY',
    'CHF',
    'CAD',
    'AUD',
    'CNY',
    'INR',
    'TRY',
  ];

  static Future<RatesSnapshot> defaultRates() async {
    final response = await http
        .get(
          Uri.parse(
            'https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/eur.min.json',
          ),
        )
        .timeout(const Duration(seconds: 10));
    if (response.statusCode != 200) {
      throw http.ClientException(
        'Rates request failed: ${response.statusCode}',
      );
    }
    final json = jsonDecode(response.body) as Map<String, dynamic>;
    final raw = json['eur'] as Map<String, dynamic>;
    return RatesSnapshot({
      'EUR': 1,
      // Three-letter codes only: the feed also carries metals and crypto with longer names.
      for (final e in raw.entries)
        if (e.key.length == 3 && e.value is num && (e.value as num) > 0)
          e.key.toUpperCase(): (e.value as num).toDouble(),
    }, json['date'] as String? ?? '');
  }

  @override
  State<SwapConverter> createState() => _SwapConverterState();
}

class _SwapConverterState extends State<SwapConverter> {
  late String _from = widget.from;
  late String _to = widget.to;
  final _amount = TextEditingController(text: '100');
  RatesSnapshot? _live;
  bool _failed = false;
  int _turns = 0;
  Timer? _timer;

  @override
  void initState() {
    super.initState();
    _load();
    _timer = Timer.periodic(widget.refresh, (_) => _load());
  }

  Future<void> _load() async {
    try {
      final snapshot = await (widget.loadRates ?? SwapConverter.defaultRates)();
      if (!mounted) return;
      setState(() {
        _live = snapshot;
        _failed = false;
      });
    } catch (_) {
      if (mounted) setState(() => _failed = true);
    }
  }

  @override
  void dispose() {
    _timer?.cancel();
    _amount.dispose();
    super.dispose();
  }

  String _format(double n, [int digits = 2]) {
    final fixed = n.toStringAsFixed(digits).replaceFirst(RegExp(r'\.?0+$'), '');
    final parts = fixed.split('.');
    final whole = parts[0].replaceAllMapped(
      RegExp(r'\B(?=(\d{3})+(?!\d))'),
      (_) => ',',
    );
    return parts.length > 1 ? '$whole.${parts[1]}' : whole;
  }

  @override
  Widget build(BuildContext context) {
    final rates = _live?.rates ?? widget.fallback;
    final rate = (rates[_to] ?? 1) / (rates[_from] ?? 1);
    final value = double.tryParse(_amount.text) ?? 0;
    final codes =
        widget.currencies ??
        [
          ...SwapConverter.pinned.where(rates.containsKey),
          ...(rates.keys
              .where((c) => !SwapConverter.pinned.contains(c))
              .toList()
            ..sort()),
        ];
    const figure = TextStyle(
      fontSize: 48,
      height: 1,
      letterSpacing: -2,
      fontWeight: FontWeight.w500,
      color: Tom.ink,
      fontFeatures: [FontFeature.tabularFigures()],
      decoration: TextDecoration.none,
    );
    final quiet = Tom.label(color: Tom.muted, weight: FontWeight.w400);

    Widget picker(String code, ValueChanged<String> onChanged, String label) =>
        Semantics(
          label: label,
          child: DropdownButtonHideUnderline(
            child: DropdownButton<String>(
              value: codes.contains(code) ? code : null,
              isDense: true,
              icon: const SizedBox.shrink(),
              style: Tom.label(color: Tom.muted),
              items: [
                for (final c in codes)
                  DropdownMenuItem(value: c, child: Text(c)),
              ],
              onChanged: (c) => c == null ? null : onChanged(c),
            ),
          ),
        );

    return Material(
      type: MaterialType.transparency,
      child: SizedBox(
        width: widget.width,
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            Container(
              decoration: const BoxDecoration(
                border: Border(bottom: BorderSide(color: Color(0xFFE5E5E5))),
              ),
              padding: const EdgeInsets.only(bottom: 12),
              child: Row(
                crossAxisAlignment: CrossAxisAlignment.end,
                children: [
                  Expanded(
                    child: Semantics(
                      label: 'Amount in $_from',
                      child: EditableText(
                        controller: _amount,
                        focusNode: _focus,
                        style: figure,
                        cursorColor: Tom.ink,
                        backgroundCursorColor: Tom.rule,
                        keyboardType: const TextInputType.numberWithOptions(
                          decimal: true,
                        ),
                        inputFormatters: [
                          FilteringTextInputFormatter.allow(
                            RegExp(r'^\d{0,9}\.?\d{0,4}'),
                          ),
                        ],
                        onChanged: (_) => setState(() {}),
                      ),
                    ),
                  ),
                  picker(
                    _from,
                    (c) => setState(() => _from = c),
                    'From currency',
                  ),
                ],
              ),
            ),
            const SizedBox(height: 12),
            Row(
              crossAxisAlignment: CrossAxisAlignment.end,
              children: [
                Expanded(
                  child: Text(
                    _format(value * rate),
                    style: figure,
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                  ),
                ),
                picker(_to, (c) => setState(() => _to = c), 'To currency'),
              ],
            ),
            const SizedBox(height: 20),
            Row(
              children: [
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text('1 $_from = ${_format(rate, 4)} $_to', style: quiet),
                      Semantics(
                        liveRegion: true,
                        child: Text(
                          _live != null
                              ? 'LIVE RATE, ${_live!.date}'
                              : (_failed
                                    ? 'OFFLINE, SHOWING SAVED RATES'
                                    : 'FETCHING RATES…'),
                          style: quiet,
                        ),
                      ),
                    ],
                  ),
                ),
                Semantics(
                  button: true,
                  label: 'Swap currencies',
                  child: MouseRegion(
                    cursor: SystemMouseCursors.click,
                    child: GestureDetector(
                      onTap: () => setState(() {
                        final was = _from;
                        _from = _to;
                        _to = was;
                        _turns++;
                      }),
                      child: AnimatedRotation(
                        turns: _turns / 2,
                        duration: const Duration(milliseconds: 450),
                        curve: Curves.easeOutBack,
                        child: Container(
                          width: 32,
                          height: 32,
                          decoration: BoxDecoration(
                            shape: BoxShape.circle,
                            border: Border.all(color: Tom.rule),
                          ),
                          child: const Icon(
                            Icons.swap_vert,
                            size: 16,
                            color: Tom.ink,
                          ),
                        ),
                      ),
                    ),
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }

  final _focus = FocusNode();
}
