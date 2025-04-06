// src/components/Square.tsx

import React from 'react'
import { SquareData } from '../game/types'
import { PieceComp } from './Piece'

interface SquareProps {
  data: SquareData
  isSelected: boolean
  onClick: () => void
}

export function Square({ data, isSelected, onClick }: SquareProps) {
  const { x, y, piece } = data

  // Définit la classe 'white' ou 'black' en fonction de la parité
  const squareColorClass = (x + y) % 2 === 0 ? 'white' : 'black'
  
  // Ajoute 'selected' si c'est la case sélectionnée
  const selectedClass = isSelected ? 'selected' : ''

  return (
    <div
      className={`square ${squareColorClass} ${selectedClass}`}
      onClick={onClick}
    >
      {piece && (
        <PieceComp piece={piece} />
      )}
    </div>
  )
}
