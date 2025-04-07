// src/game/rules.ts

import { Piece, PieceType, Color, SquareData, Move } from './types'

/**
 * Renvoie `true` si le coup proposé est légal selon les règles complètes.
 * @param board L'état actuel de l'échiquier.
 * @param move Le coup à vérifier.
 * @param lastMove Le dernier coup joué (pour gérer l'en passant).
 */
export function isMoveLegal(board: SquareData[][], move: Move, lastMove: Move | null = null): boolean {
  // Vérification de la légalité du déplacement de la pièce selon son type
  const { piece } = move
  let legal = false

  switch (piece.type) {
    case 'P':
      legal = isPawnMoveLegal(board, move, lastMove)
      break
    case 'R':
      legal = isRookMoveLegal(board, move)
      break
    case 'N':
      legal = isKnightMoveLegal(board, move)
      break
    case 'B':
      legal = isBishopMoveLegal(board, move)
      break
    case 'Q':
      legal = isQueenMoveLegal(board, move)
      break
    case 'K':
      legal = isKingMoveLegal(board, move)
      break
    default:
      legal = false
  }

  // Simulation du coup pour s'assurer que le roi n'est pas exposé à l'échec
  if (legal && !wouldKingBeInCheck(board, move)) {
    return true
  }
  return false
}

/*=======================*
 * Fonctions utilitaires *
 *=======================*/

// Vérifie que le chemin entre deux cases est libre (hors case destination)
function isPathClear(board: SquareData[][], from: { x: number, y: number }, to: { x: number, y: number }): boolean {
  const deltaX = to.x - from.x
  const deltaY = to.y - from.y
  const stepX = deltaX === 0 ? 0 : deltaX / Math.abs(deltaX)
  const stepY = deltaY === 0 ? 0 : deltaY / Math.abs(deltaY)

  let currentX = from.x + stepX
  let currentY = from.y + stepY

  while (currentX !== to.x || currentY !== to.y) {
    if (board[currentY][currentX].piece !== null) {
      return false
    }
    currentX += stepX
    currentY += stepY
  }
  return true
}

function oppositeColor(color: Color): Color {
  return color === 'WHITE' ? 'BLACK' : 'WHITE'
}

// Crée une copie profonde de l'échiquier et simule le coup
function simulateMove(board: SquareData[][], move: Move): SquareData[][] {
  const newBoard = board.map(row => row.map(square => ({ ...square, piece: square.piece ? { ...square.piece } : null })))

  // Gestion particulière pour l'en passant : retirer le pion capturé
  if (move.piece.type === 'P' && Math.abs(move.to.x - move.from.x) === 1 && !newBoard[move.to.y][move.to.x].piece) {
    // La capture en passant : le pion ennemi se trouve sur la même ligne de départ
    const pawnRow = move.from.y
    newBoard[pawnRow][move.to.x].piece = null
  }

  // Déplacement de la pièce
  newBoard[move.to.y][move.to.x].piece = { ...move.piece, hasMoved: true }
  newBoard[move.from.y][move.from.x].piece = null

  // Gestion du roque : déplacer également la tour
  if (move.piece.type === 'K' && Math.abs(move.to.x - move.from.x) === 2) {
    if (move.to.x > move.from.x) {
      // Roque côté roi
      const rookFromX = board[move.from.y][7].piece ? 7 : -1
      const rookToX = move.to.x - 1
      if (rookFromX !== -1) {
        newBoard[move.from.y][rookToX].piece = { ...newBoard[move.from.y][rookFromX].piece!, hasMoved: true }
        newBoard[move.from.y][rookFromX].piece = null
      }
    } else {
      // Roque côté dame
      const rookFromX = board[move.from.y][0].piece ? 0 : -1
      const rookToX = move.to.x + 1
      if (rookFromX !== -1) {
        newBoard[move.from.y][rookToX].piece = { ...newBoard[move.from.y][rookFromX].piece!, hasMoved: true }
        newBoard[move.from.y][rookFromX].piece = null
      }
    }
  }

  return newBoard
}

// Recherche la position du roi de la couleur donnée
function findKing(board: SquareData[][], color: Color): { x: number, y: number } | null {
  for (let y = 0; y < board.length; y++) {
    for (let x = 0; x < board[y].length; x++) {
      const piece = board[y][x].piece
      if (piece && piece.type === 'K' && piece.color === color) {
        return { x, y }
      }
    }
  }
  return null
}

// Vérifie si, après avoir joué le coup, le roi du joueur est en échec
function wouldKingBeInCheck(board: SquareData[][], move: Move): boolean {
  const newBoard = simulateMove(board, move)
  const kingPos = findKing(newBoard, move.piece.color)
  if (!kingPos) return true
  return isSquareAttacked(newBoard, kingPos, oppositeColor(move.piece.color))
}

export function isInCheck(board: SquareData[][], player: Color): boolean {
  const kingPos = findKing(board, player)
  if (!kingPos) return true
  return isSquareAttacked(board, kingPos, oppositeColor(player))
}

export function isCheckmate(board: SquareData[][], player: Color): boolean {
  // Si le roi n'est même pas en échec, ce n'est pas un mat
  if (!isInCheck(board, player)) {
    return false
  }

  // Parcours de toutes les pièces du joueur
  for (let y = 0; y < 8; y++) {
    for (let x = 0; x < 8; x++) {
      const square = board[y][x]
      const piece = square.piece
      if (piece && piece.color === player) {
        // On teste tous les mouvements possibles de cette pièce
        for (let ty = 0; ty < 8; ty++) {
          for (let tx = 0; tx < 8; tx++) {
            const move: Move = {
              from: { x, y },
              to: { x: tx, y: ty },
              piece
            }
            if (isMoveLegal(board, move)) {
              // Simule le déplacement
              const newBoard = simulateMove(board, move)
              if (!isInCheck(newBoard, player)) {
                // Il existe un coup qui évite l’échec → pas mat
                return false
              }
            }
          }
        }
      }
    }
  }

  // Aucune sortie d'échec trouvée
  return true
}

/**
 * Vérifie si une case est attaquée par une pièce de la couleur indiquée.
 */
function isSquareAttacked(board: SquareData[][], square: { x: number, y: number }, attackerColor: Color): boolean {
  for (let y = 0; y < board.length; y++) {
    for (let x = 0; x < board[y].length; x++) {
      const attacker = board[y][x].piece
      if (attacker && attacker.color === attackerColor) {
        if (canAttack({ x, y }, square, attacker, board)) {
          return true
        }
      }
    }
  }
  return false
}

/**
 * Détermine si une pièce située en `from` peut attaquer la case `to`.
 * Pour les pions, seuls les mouvements de capture sont pris en compte.
 */
function canAttack(from: { x: number, y: number }, to: { x: number, y: number }, piece: Piece, board: SquareData[][]): boolean {
  const deltaX = to.x - from.x
  const deltaY = to.y - from.y

  switch (piece.type) {
    case 'P':
      const attackDir = piece.color === 'WHITE' ? -1 : 1
      return (deltaY === attackDir && Math.abs(deltaX) === 1)
    case 'N':
      return (Math.abs(deltaX) === 2 && Math.abs(deltaY) === 1) || (Math.abs(deltaX) === 1 && Math.abs(deltaY) === 2)
    case 'B':
      if (Math.abs(deltaX) !== Math.abs(deltaY)) return false
      return isPathClear(board, from, to)
    case 'R':
      if (deltaX !== 0 && deltaY !== 0) return false
      return isPathClear(board, from, to)
    case 'Q':
      if (deltaX === 0 || deltaY === 0 || Math.abs(deltaX) === Math.abs(deltaY)) {
        return isPathClear(board, from, to)
      }
      return false
    case 'K':
      return Math.abs(deltaX) <= 1 && Math.abs(deltaY) <= 1
    default:
      return false
  }
}

/*============================*
 * Fonctions spécifiques aux pièces
 *============================*/

// Pion
function isPawnMoveLegal(board: SquareData[][], move: Move, lastMove: Move | null): boolean {
  const direction = move.piece.color === 'WHITE' ? -1 : 1
  const startRow = move.piece.color === 'WHITE' ? 6 : 1
  const promotionRow = move.piece.color === 'WHITE' ? 0 : 7
  const deltaX = move.to.x - move.from.x
  const deltaY = move.to.y - move.from.y
  const target = board[move.to.y][move.to.x]

  // Avance d'une case
  if (deltaY === direction && deltaX === 0) {
    if (target.piece !== null) return false
    // Promotion (on autorise ici même le coup sans préciser la pièce, à gérer ensuite)
    return true
  }

  // Avance de deux cases depuis la position initiale
  if (move.from.y === startRow && deltaY === 2 * direction && deltaX === 0) {
    const intermediate = board[move.from.y + direction][move.from.x]
    if (intermediate.piece !== null || target.piece !== null) return false
    return true
  }

  // Prise en diagonale
  if (deltaY === direction && Math.abs(deltaX) === 1) {
    // Capture classique
    if (target.piece !== null && target.piece.color !== move.piece.color) return true
    // En passant
    if (target.piece === null && lastMove && lastMove.piece.type === 'P') {
      // Le pion adverse doit avoir effectué un double pas et se trouver adjacent
      const lastFromY = lastMove.from.y
      const lastToY = lastMove.to.y
      if (Math.abs(lastToY - lastFromY) === 2 && lastMove.to.x === move.to.x && lastMove.to.y === move.from.y) {
        return true
      }
    }
  }

  return false
}

// Tour
function isRookMoveLegal(board: SquareData[][], move: Move): boolean {
  const deltaX = move.to.x - move.from.x
  const deltaY = move.to.y - move.from.y

  if (deltaX !== 0 && deltaY !== 0) return false
  if (!isPathClear(board, move.from, move.to)) return false

  const target = board[move.to.y][move.to.x]
  return target.piece === null || target.piece.color !== move.piece.color
}

// Cavalier
function isKnightMoveLegal(board: SquareData[][], move: Move): boolean {
  const deltaX = Math.abs(move.to.x - move.from.x)
  const deltaY = Math.abs(move.to.y - move.from.y)
  if (!((deltaX === 2 && deltaY === 1) || (deltaX === 1 && deltaY === 2))) return false

  const target = board[move.to.y][move.to.x]
  return target.piece === null || target.piece.color !== move.piece.color
}

// Fou
function isBishopMoveLegal(board: SquareData[][], move: Move): boolean {
  const deltaX = Math.abs(move.to.x - move.from.x)
  const deltaY = Math.abs(move.to.y - move.from.y)
  if (deltaX !== deltaY) return false
  if (!isPathClear(board, move.from, move.to)) return false

  const target = board[move.to.y][move.to.x]
  return target.piece === null || target.piece.color !== move.piece.color
}

// Dame
function isQueenMoveLegal(board: SquareData[][], move: Move): boolean {
  const deltaX = Math.abs(move.to.x - move.from.x)
  const deltaY = Math.abs(move.to.y - move.from.y)
  if (!(deltaX === 0 || deltaY === 0 || deltaX === deltaY)) return false
  if (!isPathClear(board, move.from, move.to)) return false

  const target = board[move.to.y][move.to.x]
  return target.piece === null || target.piece.color !== move.piece.color
}

// Roi
function isKingMoveLegal(board: SquareData[][], move: Move): boolean {
  const deltaX = move.to.x - move.from.x
  const deltaY = move.to.y - move.from.y
  const absDeltaX = Math.abs(deltaX)
  const absDeltaY = Math.abs(deltaY)
  const target = board[move.to.y][move.to.x]

  // Roque
  if (absDeltaX === 2 && absDeltaY === 0) {
    // Le roi ne doit pas avoir bougé
    if (move.piece.hasMoved) return false
    const kingRow = move.from.y
    if (deltaX > 0) {
      // Roque côté roi
      const rookSquare = board[kingRow][7]
      if (!rookSquare.piece || rookSquare.piece.type !== 'R' || rookSquare.piece.color !== move.piece.color || rookSquare.piece.hasMoved) {
        return false
      }
      // Cases entre le roi et la tour
      for (let x = move.from.x + 1; x < 7; x++) {
        if (board[kingRow][x].piece !== null) return false
      }
      // Le roi ne doit pas passer par ou finir sur une case attaquée
      if (isSquareAttacked(board, { x: move.from.x, y: kingRow }, oppositeColor(move.piece.color)) ||
          isSquareAttacked(board, { x: move.from.x + 1, y: kingRow }, oppositeColor(move.piece.color)) ||
          isSquareAttacked(board, { x: move.to.x, y: kingRow }, oppositeColor(move.piece.color))) {
        return false
      }
      return true
    } else {
      // Roque côté dame
      const rookSquare = board[kingRow][0]
      if (!rookSquare.piece || rookSquare.piece.type !== 'R' || rookSquare.piece.color !== move.piece.color || rookSquare.piece.hasMoved) {
        return false
      }
      for (let x = move.from.x - 1; x > 0; x--) {
        if (board[kingRow][x].piece !== null) return false
      }
      if (isSquareAttacked(board, { x: move.from.x, y: kingRow }, oppositeColor(move.piece.color)) ||
          isSquareAttacked(board, { x: move.from.x - 1, y: kingRow }, oppositeColor(move.piece.color)) ||
          isSquareAttacked(board, { x: move.to.x, y: kingRow }, oppositeColor(move.piece.color))) {
        return false
      }
      return true
    }
  }

  // Déplacement normal d'une case
  if (absDeltaX > 1 || absDeltaY > 1) return false

  if (target.piece && target.piece.color === move.piece.color) return false

  // Le roi ne peut pas se déplacer sur une case attaquée
  // Simulation du coup pour vérifier que le roi n'est pas exposé
  const testMove = { ...move, piece: { ...move.piece } }
  return !wouldKingBeInCheck(board, testMove)
}
