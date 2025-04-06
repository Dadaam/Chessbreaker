// src/components/Piece.tsx

import React from 'react'
import { Piece } from '../game/types'

// Import statique des images :
import whitePawn from '../assets/pieces/white-pawn.svg'
import whiteRook from '../assets/pieces/white-rook.svg'
import whiteKnight from '../assets/pieces/white-knight.svg'
import whiteBishop from '../assets/pieces/white-bishop.svg'
import whiteQueen from '../assets/pieces/white-queen.svg'
import whiteKing from '../assets/pieces/white-king.svg'

import blackPawn from '../assets/pieces/black-pawn.svg'
import blackRook from '../assets/pieces/black-rook.svg'
import blackKnight from '../assets/pieces/black-knight.svg'
import blackBishop from '../assets/pieces/black-bishop.svg'
import blackQueen from '../assets/pieces/black-queen.svg'
import blackKing from '../assets/pieces/black-king.svg'

interface PieceProps {
  piece: Piece
}

export function PieceComp({ piece }: PieceProps) {
  let pieceImg = ''

  // Sélectionne l’image selon la pièce et la couleur
  if (piece.color === 'WHITE') {
    switch (piece.type) {
      case 'P':
        pieceImg = whitePawn
        break
      case 'R':
        pieceImg = whiteRook
        break
      case 'N':
        pieceImg = whiteKnight
        break
      case 'B':
        pieceImg = whiteBishop
        break
      case 'Q':
        pieceImg = whiteQueen
        break
      case 'K':
        pieceImg = whiteKing
        break
    }
  } else {
    // Pièce noire
    switch (piece.type) {
      case 'P':
        pieceImg = blackPawn
        break
      case 'R':
        pieceImg = blackRook
        break
      case 'N':
        pieceImg = blackKnight
        break
      case 'B':
        pieceImg = blackBishop
        break
      case 'Q':
        pieceImg = blackQueen
        break
      case 'K':
        pieceImg = blackKing
        break
    }
  }

  return (
    <img
      src={pieceImg}
      alt={`Pièce ${piece.type} ${piece.color}`}
      style={{ width: '40px', height: '40px' }}
    />
  )
}
