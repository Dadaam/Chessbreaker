// src/components/Board.tsx

import React from 'react'
import { useChessGame } from '../hooks/useChess'
import { Square } from './Square'

export function Board() {
  const { board, currentPlayer, selectedSquare, handleSquareClick } = useChessGame()

  // On transforme la valeur interne ('WHITE'|'BLACK') en français
  const currentPlayerLabel = currentPlayer === 'WHITE' ? 'BLANC' : 'NOIR'

  return (
    <div className="board-container">
      <h2>Au tour de : {currentPlayerLabel}</h2>
      <div className="chess-board">
        {board.flat().map((square) => (
          <Square
            key={`${square.x}-${square.y}`}
            data={square}
            isSelected={
              selectedSquare?.x === square.x && selectedSquare?.y === square.y
            }
            onClick={() => handleSquareClick(square.x, square.y)}
          />
        ))}
      </div>
    </div>
  )
}
