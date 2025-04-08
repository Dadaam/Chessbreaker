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
  id: string;
  name: string;
  description: string;
  type: 'action' | 'passive';
  DropRate: Record<string, number>;
  SubdropRate?: Record<string, number>;
  variantes: string;
  duration: number | null;
  stackable: boolean;
  penalty: number;
}

  