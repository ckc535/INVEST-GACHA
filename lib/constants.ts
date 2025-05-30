import { PetType, LevelConfig, ContractConfig } from './types'

// Token configuration from environment variables
export const TOKEN_CONFIG = {
  symbol: process.env.NEXT_PUBLIC_REWARD_TOKEN || "GRT",
  name: "The Graph",
  decimals: parseInt(process.env.NEXT_PUBLIC_TOKEN_DECIMALS || "18"),
  investmentSymbol: process.env.NEXT_PUBLIC_INVESTMENT_TOKEN || "ETH", // What users invest with
  rewardSymbol: process.env.NEXT_PUBLIC_REWARD_TOKEN || "GRT", // What users claim as rewards
}

// Pet types with different levels and ROI rates
export const PET_TYPES: PetType[] = [
  { name: "Cat", emoji: "🐱" },
  { name: "Dog", emoji: "🐕" },
  { name: "Rabbit", emoji: "🐰" },
  { name: "Bird", emoji: "🐦" },
  { name: "Fish", emoji: "🐠" },
  { name: "Hamster", emoji: "🐹" },
  { name: "Turtle", emoji: "🐢" },
  { name: "Fox", emoji: "🦊" },
]

// Level configurations with ROI rates (daily percentage)
export const LEVEL_CONFIG: Record<number, LevelConfig> = {
  1: { name: "Common", color: "bg-gray-500", dailyROI: 0.5 }, // 0.5% daily
  2: { name: "Uncommon", color: "bg-green-500", dailyROI: 0.8 }, // 0.8% daily
  3: { name: "Rare", color: "bg-blue-500", dailyROI: 1.2 }, // 1.2% daily
  4: { name: "Epic", color: "bg-purple-500", dailyROI: 1.8 }, // 1.8% daily
  5: { name: "Legendary", color: "bg-yellow-500", dailyROI: 2.5 }, // 2.5% daily
}

// Contract configuration from environment variables
export const CONTRACT_CONFIG: ContractConfig = {
  gachaGameContract: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || "", // Read from .env file
  chainId: parseInt(process.env.NEXT_PUBLIC_CHAIN_ID || "11155111"), // Read from .env file
}

// Network configuration
export const NETWORK_CONFIG = {
  name: process.env.NEXT_PUBLIC_NETWORK_NAME || "Sepolia",
  rpcUrl: process.env.NEXT_PUBLIC_RPC_URL || "",
}

// Gacha Game Contract ABI - Updated with correct function signatures
export const GACHA_GAME_ABI = [
  // Investment function
  "function invest(uint256 numberOfNFTs, uint256 investedAmountPerNFT) external payable returns (uint256 requestId)",

  // User data functions
  "function getUserTokenIds(address user) external view returns (uint256[] memory)",
  "function getNFTRewardInfo(uint256 tokenId) external view returns (uint256 investedAmount, uint256 lastClaimTime, uint256 level, uint256 roi, string memory baseURI)",

  // Reward functions
  "function calculateReward(address user, uint256 tokenId) external view returns (uint256)",
  "function claimReward(uint256 tokenId) external",
  "function getNextClaimTime(uint256 tokenId) external view returns (uint256)",

  // Contract info functions
  "function getRewardTokenBalance() external view returns (uint256)",
  "function totalRewards(address user) external view returns (uint256)",

  // Constants
  "function CLAIM_INTERVAL() external view returns (uint256)",
  "function MAX_LEVEL() external view returns (uint256)",
  "function MIN_INVESTMENT_PER_NFT() external view returns (uint256)",
  "function SECONDS_PER_DAY() external view returns (uint256)",

  // Events
  "event InvestmentMade(address indexed user, uint256 amount, uint256 numberOfNFTs)",
  "event RewardClaimed(address indexed user, uint256 tokenId, uint256 amount)",
]

export const MOOD_EMOJIS = {
  happy: "😊",
  sleepy: "😴",
  playful: "🎾",
  hungry: "🍖",
} as const

export const MOODS = ["happy", "sleepy", "playful", "hungry"] as const 