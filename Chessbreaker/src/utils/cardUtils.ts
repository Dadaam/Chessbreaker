import rawCards from "../cards/cards.json";
import { Card } from "../game/types";

const colorToEmoji = {
  green: "🟢",
  blue: "🔵",
  yellow: "🟡",
  red: "🔴"
};

const weightedCardPool: { card: Card; weight: number }[] = [];

rawCards.cards.forEach((baseCard: any) => {
  const dropRates = baseCard.DropRate;

  for (const color in dropRates) {
    const weight = dropRates[color];
    const variantes = colorToEmoji[color];

    if (weight > 0 && variantes) {
      // On clone la carte et on lui applique la variante et un nouvel ID
      const variantCard: Card = {
        ...baseCard,
        id: crypto.randomUUID(),
        variantes,
      };
      weightedCardPool.push({ card: variantCard, weight });
    }
  }
});

export function getRandomCard(): Card {
  const totalWeight = weightedCardPool.reduce((sum, entry) => sum + entry.weight, 0);
  const rand = Math.random() * totalWeight;
  let cumulative = 0;

  for (const { card, weight } of weightedCardPool) {
    cumulative += weight;
    if (rand <= cumulative) return card;
  }

  // fallback par sécurité
  return weightedCardPool[0].card;
}
