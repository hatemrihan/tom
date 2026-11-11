import 'package:flutter/material.dart';

import 'tom_qr.dart';
import 'tom_style.dart';

class ReceiptItem {
  const ReceiptItem(this.label, this.price, {this.qty = 1});

  final String label;

  /// Unit price.
  final double price;
  final int qty;
}

/// A card payment that ends the way a real one does: the reader shows it is
/// processing, says "approved", and a paper receipt feeds out of the slot
/// with the shop, the items, the tax, the card and an authorisation code.
class ReceiptPrinter extends StatefulWidget {
  const ReceiptPrinter({
    super.key,
    this.merchant = 'Corner Coffee',
    this.merchantLines = const [
      '14 Mill Lane, Cambridge CB2 1RX',
      'VAT no. GB 123 4567 89',
    ],
    this.items = const [
      ReceiptItem('Flat white', 3.4, qty: 2),
      ReceiptItem('Almond croissant', 3.2),
      ReceiptItem('Sparkling water', 2.1),
    ],
    this.taxRate = 0.2,
    this.taxLabel = 'VAT',
    this.currencySymbol = '£',
    this.paymentMethod = 'Visa contactless',
    this.last4 = '4242',
    this.footer = 'Thank you. See you tomorrow.',
    this.processingTime = const Duration(milliseconds: 2200),
    this.width = 260,
    this.onApproved,
  });

  final String merchant;
  final List<String> merchantLines;
  final List<ReceiptItem> items;

  /// Tax added on top of the items, e.g. 0.2 for 20%.
  final double taxRate;
  final String taxLabel;
  final String currencySymbol;
  final String paymentMethod;
  final String? last4;
  final String footer;

  /// Time spent "processing" before the receipt prints.
  final Duration processingTime;
  final double width;
  final VoidCallback? onApproved;

  @override
  State<ReceiptPrinter> createState() => _ReceiptPrinterState();
}

class _ReceiptPrinterState extends State<ReceiptPrinter>
    with TickerProviderStateMixin {
  late final AnimationController _processing = AnimationController(
    vsync: this,
    duration: widget.processingTime,
  );
  late final AnimationController _paper = AnimationController(
    vsync: this,
    duration: const Duration(milliseconds: 1800),
  );
  DateTime? _paidAt;

  @override
  void initState() {
    super.initState();
    _processing.forward().whenComplete(() {
      if (!mounted) return;
      setState(() => _paidAt = DateTime.now());
      widget.onApproved?.call();
      _paper.forward();
    });
  }

  @override
  void dispose() {
    _processing.dispose();
    _paper.dispose();
    super.dispose();
  }

  String _money(double n) => '${widget.currencySymbol}${n.toStringAsFixed(2)}';

  /// Stable numbers derived from the contents.
  int get _seed {
    var h = 2166136261;
    for (final unit
        in '${widget.merchant}${widget.items.map((i) => i.label).join()}'
            .codeUnits) {
      h = ((h ^ unit) * 16777619) & 0xFFFFFFFF;
    }
    return h;
  }

  @override
  Widget build(BuildContext context) {
    final subtotal = widget.items.fold<double>(
      0,
      (sum, i) => sum + i.price * i.qty,
    );
    final tax = subtotal * widget.taxRate;
    final total = subtotal + tax;
    final approved = _paidAt != null;
    final paid = _paidAt;
    String two(int n) => n.toString().padLeft(2, '0');
    final stamp = paid == null
        ? ''
        : '${two(paid.day)}/${two(paid.month)}/${paid.year}  ${two(paid.hour)}:${two(paid.minute)}';
    final receiptNo = (_seed % 1000000).toString().padLeft(6, '0');
    final auth = ((_seed * 31) & 0xFFFFFF)
        .toRadixString(16)
        .toUpperCase()
        .padLeft(6, '0');

    const mono = TextStyle(
      fontFamily: 'monospace',
      fontFamilyFallback: ['Menlo', 'Courier New', 'Courier'],
      fontSize: 10,
      height: 1.5,
      color: Color(0xFF525252),
      decoration: TextDecoration.none,
    );
    final strong = mono.copyWith(color: Tom.ink, fontWeight: FontWeight.w600);
    Widget row(String a, String b, [TextStyle style = mono]) => Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Flexible(child: Text(a.toUpperCase(), style: style)),
        Text(b.toUpperCase(), style: style),
      ],
    );
    const rule = Padding(
      padding: EdgeInsets.symmetric(vertical: 10),
      child: _Dashed(),
    );

    final receipt = ClipPath(
      clipper: const _Torn(),
      child: Container(
        color: Tom.paper,
        padding: const EdgeInsets.fromLTRB(16, 20, 16, 24),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            Text(
              widget.merchant.toUpperCase(),
              style: strong,
              textAlign: TextAlign.center,
            ),
            for (final line in widget.merchantLines)
              Text(
                line.toUpperCase(),
                style: mono.copyWith(fontSize: 9),
                textAlign: TextAlign.center,
              ),
            rule,
            row('Receipt $receiptNo', stamp),
            rule,
            for (final item in widget.items)
              row('${item.qty} × ${item.label}', _money(item.price * item.qty)),
            rule,
            row('Subtotal', _money(subtotal)),
            row(
              '${widget.taxLabel} ${(widget.taxRate * 100).round()}%',
              _money(tax),
            ),
            const SizedBox(height: 4),
            row('Total', _money(total), strong.copyWith(fontSize: 12)),
            rule,
            row(
              widget.paymentMethod,
              widget.last4 == null ? '' : '•••• ${widget.last4}',
            ),
            row('Auth code', auth),
            const SizedBox(height: 16),
            Center(
              child: TomBars(
                value: '$_seed',
                count: 46,
                height: 28,
                color: Tom.ink,
              ),
            ),
            const SizedBox(height: 12),
            Text(
              widget.footer.toUpperCase(),
              style: mono.copyWith(fontSize: 9),
              textAlign: TextAlign.center,
            ),
          ],
        ),
      ),
    );

    return SizedBox(
      width: widget.width,
      child: Column(
        mainAxisSize: MainAxisSize.min,
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          // Reader: amount, a live status, and the slot filling while the payment is processed.
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(_money(total), style: Tom.label()),
              const SizedBox(width: 12),
              Flexible(
                child: FittedBox(
                  fit: BoxFit.scaleDown,
                  alignment: Alignment.centerRight,
                  child: Semantics(
                    liveRegion: true,
                    child: Row(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        if (approved)
                          const Icon(Icons.check, size: 12, color: Tom.ink)
                        else
                          const SizedBox.square(
                            dimension: 10,
                            child: CircularProgressIndicator(
                              strokeWidth: 1.2,
                              color: Tom.ink,
                            ),
                          ),
                        const SizedBox(width: 6),
                        Text(
                          approved ? 'APPROVED' : 'PROCESSING PAYMENT',
                          style: Tom.label(weight: FontWeight.w400),
                        ),
                      ],
                    ),
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 8),
          ClipRRect(
            borderRadius: BorderRadius.circular(3),
            child: AnimatedBuilder(
              animation: _processing,
              builder: (context, _) => LinearProgressIndicator(
                value: _processing.value,
                minHeight: 6,
                backgroundColor: const Color(0xFFE5E5E5),
                color: Tom.ink,
              ),
            ),
          ),
          // Paper: slides down out of the slot.
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 8),
            child: ClipRect(
              child: AnimatedBuilder(
                animation: _paper,
                builder: (context, child) => Align(
                  alignment: Alignment.bottomCenter,
                  heightFactor: const Cubic(
                    0.3,
                    0,
                    0.2,
                    1,
                  ).transform(_paper.value),
                  child: child,
                ),
                child: receipt,
              ),
            ),
          ),
        ],
      ),
    );
  }
}

class _Dashed extends StatelessWidget {
  const _Dashed();

  @override
  Widget build(BuildContext context) =>
      SizedBox(height: 1, child: CustomPaint(painter: _DashPainter()));
}

class _DashPainter extends CustomPainter {
  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint()..color = const Color(0xFFD4D4D4);
    for (var x = 0.0; x < size.width; x += 5) {
      canvas.drawRect(Rect.fromLTWH(x, 0, 3, 1), paint);
    }
  }

  @override
  bool shouldRepaint(_DashPainter old) => false;
}

/// A zig-zag torn edge along the bottom.
class _Torn extends CustomClipper<Path> {
  const _Torn();

  @override
  Path getClip(Size size) {
    final path = Path()
      ..moveTo(0, 0)
      ..lineTo(size.width, 0)
      ..lineTo(size.width, size.height);
    const tooth = 10.0;
    for (var x = size.width; x > 0; x -= tooth) {
      path
        ..lineTo(x - tooth / 2, size.height - 4)
        ..lineTo((x - tooth).clamp(0.0, size.width), size.height);
    }
    return path..close();
  }

  @override
  bool shouldReclip(_Torn old) => false;
}
