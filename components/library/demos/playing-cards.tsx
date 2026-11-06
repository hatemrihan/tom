"use client";

import { CardHand } from "../playing-cards/playing-cards";

export default function PlayingCardsDemo() {
  return (
    <CardHand
      cards={[
        { rank: "7", suit: "clubs" },
        { rank: "10", suit: "diamonds" },
        { rank: "Q", suit: "hearts" },
        { rank: "K", suit: "spades" },
        { rank: "A", suit: "spades" },
      ]}
    />
  );
}
