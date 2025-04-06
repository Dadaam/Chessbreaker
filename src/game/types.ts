export interface Card {
    name: string
    dropRate: string // ou number (à voir selon si tu préfères "2%" ou 0.02)
    description: string
    duration: number | null
    stackable: boolean
    cost: number
  }
  