// src/hooks/useChessGame.ts

import { useState } from 'react'
import { Color, SquareData, Piece, Move } from '../game/types'
import { isMoveLegal } from '../game/rules'

export function useChessGame() {
  const [board, setBoard] = useState<SquareData[][]>(initializeBoard())
  const [currentPlayer, setCurrentPlayer] = useState<Color>('WHITE')
  const [selectedSquare, setSelectedSquare] = useState<{x: number, y: number} | null>(null)

  function handleSquareClick(x: number, y: number) {
    // Reste inchangé, comme avant...
    if (!selectedSquare) {
      // Sélection d'une pièce
      const clickedSquare = board[y][x]
      if (clickedSquare.piece?.color === currentPlayer) {
        setSelectedSquare({ x, y })
      }
    } else {
      // Déplacement
      const from = selectedSquare
      const piece = board[from.y][from.x].piece
      if (piece) {
        const move: Move = { from, to: { x, y }, piece }
        if (isMoveLegal(board, move)) {
          const newBoard = makeMove(board, move)
          setBoard(newBoard)
          setCurrentPlayer(currentPlayer === 'WHITE' ? 'BLACK' : 'WHITE')
        }
      }
      setSelectedSquare(null)
    }
  }

  return {
    board,
    currentPlayer,
    selectedSquare,
    handleSquareClick,
  }
}

function initializeBoard(): SquareData[][] {
  const emptyRow = (y: number) =>
    Array(8).fill(null).map((_, x) => ({
      piece: null as Piece | null,
      x,
      y
    }))

  const blank = Array.from({ length: 8 }, (_, y) => emptyRow(y))

  // Rangée 0 (Noir)
  blank[0][0].piece = { type: 'R', color: 'BLACK' }
  blank[0][1].piece = { type: 'N', color: 'BLACK' }
  blank[0][2].piece = { type: 'B', color: 'BLACK' }
  blank[0][3].piece = { type: 'Q', color: 'BLACK' }
  blank[0][4].piece = { type: 'K', color: 'BLACK' }
  blank[0][5].piece = { type: 'B', color: 'BLACK' }
  blank[0][6].piece = { type: 'N', color: 'BLACK' }
  blank[0][7].piece = { type: 'R', color: 'BLACK' }

  // Rangée 1 (pions Noirs)
  for (let x = 0; x < 8; x++) {
    blank[1][x].piece = { type: 'P', color: 'BLACK' }
  }

  // Rangée 6 (pions Blancs)
  for (let x = 0; x < 8; x++) {
    blank[6][x].piece = { type: 'P', color: 'WHITE' }
  }

  // Rangée 7 (Blanc)
  blank[7][0].piece = { type: 'R', color: 'WHITE' }
  blank[7][1].piece = { type: 'N', color: 'WHITE' }
  blank[7][2].piece = { type: 'B', color: 'WHITE' }
  blank[7][3].piece = { type: 'Q', color: 'WHITE' }
  blank[7][4].piece = { type: 'K', color: 'WHITE' }
  blank[7][5].piece = { type: 'B', color: 'WHITE' }
  blank[7][6].piece = { type: 'N', color: 'WHITE' }
  blank[7][7].piece = { type: 'R', color: 'WHITE' }

  return blank
}

function makeMove(board: SquareData[][], move: Move): SquareData[][] {
  const newBoard = board.map(row => row.map(cell => ({ ...cell })))
  newBoard[move.from.y][move.from.x].piece = null
  newBoard[move.to.y][move.to.x].piece = move.piece
  return newBoard
}
