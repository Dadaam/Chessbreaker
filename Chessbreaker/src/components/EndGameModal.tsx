// src/components/EndGameModal.tsx

import React from 'react'
import { Color } from '../game/types'

interface EndGameModalProps {
  winner: Color
  onRestart: () => void
}

export function EndGameModal({ winner, onRestart }: EndGameModalProps) {
  // On convertit en français
  const winnerLabel = winner === 'WHITE' ? 'BLANC' : 'NOIR'

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Échec et Mat !</h2>
        <p>Le joueur {winnerLabel} remporte la partie.</p>
        <button onClick={onRestart}>Rejouer</button>
      </div>
    </div>
  )
}
