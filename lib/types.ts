export interface UserPet {
  id: number
  name: string
  emoji: string
  level: number
  investmentAmount: number
  purchaseDate: Date
  dailyROI: number
  totalEarned: number
  tokenId: number
  // Animation properties
  x: number
  y: number
  targetX: number
  targetY: number
  direction: string
  mood: string
  
}

export interface WalletState {
  connected: boolean
  address: string
  balance: string
}

export interface ContractConfig {
  gachaGameContract: string
  chainId: number
}

export interface LevelConfig {
  name: string
  color: string
  dailyROI: number
  tier?: string
  rarity?: string
}

export interface PetType {
  name: string
  emoji: string
}

declare global {
  interface Window {
    ethereum?: {
      isMetaMask?: boolean
      request: (args: { method: string; params?: any[] }) => Promise<any>
      on: (event: string, callback: (data: any) => void) => void
      removeListener: (event: string, callback: (data: any) => void) => void
    }
  }
} 