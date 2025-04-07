import { useState } from 'react'
import { Color, SquareData, Piece, Move } from '../game/types'
import { isMoveLegal, isCheckmate } from '../game/rules'

// Ex : isCheckmate(board, nextPlayer) → boolean
// Tu implémentes le vrai code dans `rules.ts`

export function useChessGame() {
  const [board, setBoard] = useState<SquareData[][]>(initializeBoard())
  const [currentPlayer, setCurrentPlayer] = useState<Color>('WHITE')
  const [selectedSquare, setSelectedSquare] = useState<{x: number, y: number} | null>(null)

  // Nouveau state : vainqueur
  const [winner, setWinner] = useState<Color | null>(null)

  function handleSquareClick(x: number, y: number) {
    // Si la partie est déjà terminée, on ignore les clics
    if (winner) return

    if (!selectedSquare) {
      // Sélection d'une pièce du joueur courant
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

          // On passe la main à l’autre joueur
          const nextPlayer = currentPlayer === 'WHITE' ? 'BLACK' : 'WHITE'
          setCurrentPlayer(nextPlayer)

          // Vérifier si nextPlayer est en échec et mat
          if (isCheckmate(newBoard, nextPlayer)) {
            // nextPlayer est mat => currentPlayer gagne
            setWinner(currentPlayer)
          }
        }
      }
      setSelectedSquare(null)
    }
  }

  function handleRestart() {
    setBoard(initializeBoard())
    setCurrentPlayer('WHITE')
    setWinner(null)
    setSelectedSquare(null)
  }

  return {
    board,
    currentPlayer,
    selectedSquare,
    winner,
    handleSquareClick,
    handleRestart
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
  const { from, to, piece } = move

  // Gestion du roque (le roi se déplace de deux cases horizontalement)
  if (piece.type === 'K' && Math.abs(to.x - from.x) === 2) {
    const row = from.y
    if (to.x === 6) {
      // Petit roque : tour de droite (colonne 7) → colonne 5
      newBoard[row][5].piece = newBoard[row][7].piece
      newBoard[row][7].piece = null
    } else if (to.x === 2) {
      // Grand roque : tour de gauche (colonne 0) → colonne 3
      newBoard[row][3].piece = newBoard[row][0].piece
      newBoard[row][0].piece = null
    }
  }

  newBoard[to.y][to.x].piece = piece
  newBoard[from.y][from.x].piece = null
  return newBoard
}

