"use client";

import { ReceiptPrinter } from "../receipt-printer/receipt-printer";

export default function ReceiptPrinterDemo() {
  return (
    <ReceiptPrinter
      title="Pro plan"
      subtitle="Annual subscription"
      lines={[
        { label: "Pro plan × 12", amount: 192 },
        { label: "Priority support", amount: 0 },
      ]}
      currency="GBP"
      taxRate={0.2}
    />
  );
}
