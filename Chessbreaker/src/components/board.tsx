// src/components/Board.tsx

import React from 'react'
import { useChessGame } from '../hooks/useChess'
import { Square } from './Square'
import { EndGameModal } from './EndGameModal'

export function Board() {
  const {
    board,
    currentPlayer,
    selectedSquare,
    winner,
    handleSquareClick,
    handleRestart
  } = useChessGame()

  const currentPlayerLabel = currentPlayer === 'WHITE' ? 'BLANC' : 'NOIR'

  return (
    <div className="board-container">
      <h2>Au tour de : {currentPlayerLabel}</h2>
      {/* Affiche le plateau */}
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
      {/* Affiche un pop-up si la partie est gagnée */}
      {winner && (
        <EndGameModal
          winner={winner}
          onRestart={handleRestart}
        />
      )}
    </div>
  )
}
