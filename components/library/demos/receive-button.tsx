"use client";

import { ReceiveButton } from "../receive-button/receive-button";

export default function ReceiveButtonDemo() {
  return (
    <div className="flex h-[400px] items-center">
      <ReceiveButton address="tomm.one/pay/hatem" label="Receive" />
    </div>
  );
}
