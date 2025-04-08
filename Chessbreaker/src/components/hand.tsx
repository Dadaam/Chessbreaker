// components/Hand.tsx
import { useState } from "react";
import { Card } from "../game/types";
import CardButton from "./CardButton";
import { getRandomCard } from "../utils/cardUtils";
import React from 'react';

// components/Hand.tsx
// components/Hand.tsx
export default function Hand() {
    const [hand, setHand] = useState<Card[]>(() => {
        const initialHand = [getRandomCard(), getRandomCard(), getRandomCard()];
        console.log("Main initiale :", initialHand.map(c => c.variantes));
        return initialHand;
      });
      
      const playCard = (index: number) => {
        console.log(`Carte jouée : ${hand[index].name}`);
        const newCard = getRandomCard();
        console.log(`Nouvelle carte piochée : ${newCard.name} - ${newCard.variantes}`);
        const newHand = [...hand];
        newHand[index] = newCard;
        setHand(newHand);
      };
      
  
    return (
      <div className="hand-wrapper">
        {hand.map((card, idx) => (
          <CardButton key={card.id + idx} card={card} onPlay={() => playCard(idx)} />
        ))}
      </div>
    );
  }