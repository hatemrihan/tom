"use client";

import { ReceiptPrinter } from "../receipt-printer/receipt-printer";

export default function ReceiptPrinterDemo() {
  return (
    <ReceiptPrinter
      merchant={{ name: "Corner Coffee", lines: ["14 Mill Lane, Cambridge CB2 1RX", "VAT no. GB 123 4567 89"] }}
      items={[
        { label: "Flat white", price: 3.4, qty: 2 },
        { label: "Almond croissant", price: 3.2 },
        { label: "Sparkling water", price: 2.1 },
      ]}
      taxRate={0.2}
      currency="GBP"
      payment={{ method: "Visa contactless", last4: "4242" }}
    />
  );
}
