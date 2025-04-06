// src/game/types.ts
export type Color = 'WHITE' | 'BLACK'

export type PieceType = 'P' | 'R' | 'N' | 'B' | 'Q' | 'K'
// P=Pawn, R=Rook, N=Knight, B=Bishop, Q=Queen, K=King

export interface Piece {
  type: PieceType
  color: Color
  hasMoved: boolean // utilisé pour les mouvements spéciaux
}

export interface SquareData {
  piece: Piece | null
  x: number
  y: number
}

export interface Move {
  from: { x: number; y: number }
  to: { x: number; y: number }
  piece: Piece
}

export interface Card {
    name: string
    dropRate: string // ou number (à voir selon si tu préfères "2%" ou 0.02)
    description: string
    duration: number | null
    stackable: boolean
    cost: number
  }
  
  