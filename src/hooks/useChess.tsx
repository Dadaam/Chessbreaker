import { allCards } from '../cards'

function drawCard(): Card {
  // TODO : gérer le tirage pondéré
  return allCards[Math.floor(Math.random() * allCards.length)]
}
