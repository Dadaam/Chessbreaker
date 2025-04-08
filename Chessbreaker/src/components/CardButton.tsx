import { Card } from "../game/types";
import { useState } from "react";
import "./CardButton.css";
import React from 'react';

interface Props {
  card: Card;
  onPlay: () => void;
}

export default function CardButton({ card, onPlay }: Props) {
  const [confirming, setConfirming] = useState(false);

  const getColor = () => {
    switch (card.variantes) {
      case "🟢": return "rgb(126, 215, 84)";
      case "🔵": return "rgb(105, 126, 244)";
      case "🟡": return "rgb(239, 196, 79)";
      case "🔴": return "rgb(251, 67, 67)";
      default: return "gray";
    }
  };

  return (
    <div className="card-container" style={{ backgroundColor: getColor() }}>
      <h3>{card.name}</h3>
      <p>{card.description}</p>

      {confirming ? (
        <div className="confirm-buttons">
          <button onClick={() => setConfirming(false)}>✖</button>
          <button onClick={onPlay}>✔</button>
        </div>
      ) : (
        <button className="activate-btn" onClick={() => setConfirming(true)}>
          Activer ?
        </button>
      )}
    </div>
  );
}
