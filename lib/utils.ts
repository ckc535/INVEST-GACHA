import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { MOOD_EMOJIS, LEVEL_CONFIG } from "./constants"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Utility functions for the pet game
export const getMoodEmoji = (mood: string) => {
  return MOOD_EMOJIS[mood as keyof typeof MOOD_EMOJIS] || MOOD_EMOJIS.happy
}

export const getLevelConfig = (level: number) => {
  return LEVEL_CONFIG[level as keyof typeof LEVEL_CONFIG]
}

// Calculate tier from level (since level comes from blockchain)
export const getTierFromLevel = (level: number): string => {
  return `${level}`
}

// Calculate rarity from level (since level comes from blockchain)
export const getRarityFromLevel = (level: number): string => {
  const rarityMap: Record<number, string> = {
    1: "Common",
    2: "Uncommon",
    3: "Rare", 
    4: "Epic",
    5: "Legendary"
  }
  return rarityMap[level] || "Unknown"
}

export const calculatePetEarnings = (investmentAmount: number, dailyROI: number, daysSincePurchase: number) => {
  const dailyEarnings = investmentAmount * (dailyROI / 100)
  return dailyEarnings * daysSincePurchase
}

export const formatEthAddress = (address: string) => {
  if (!address) return ""
  return `${address.slice(0, 6)}...${address.slice(-4)}`
}

export const formatEthAmount = (amount: number, decimals: number = 6) => {
  return amount.toFixed(decimals)
}
