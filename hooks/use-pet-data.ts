"use client"

import { useState, useEffect } from "react"
import { useToast } from "@/hooks/use-toast"
import { useContract } from "@/hooks/use-contract"
import { UserPet } from "@/lib/types"
import { PET_TYPES, LEVEL_CONFIG, MOODS } from "@/lib/constants"

export function usePetData() {
  const [userPets, setUserPets] = useState<UserPet[]>([])
  const [totalInvested, setTotalInvested] = useState(0)
  const [totalEarned, setTotalEarned] = useState(0)
  const [unclaimedRewards, setUnclaimedRewards] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  const { getUserTokenIds, getNFTRewardInfo } = useContract()

  // Helper function to create pet object from contract data
  const createPetFromContractData = (tokenId: number, nftInfo: any): UserPet => {
    // Random pet type
    const petType = PET_TYPES[Math.floor(Math.random() * PET_TYPES.length)]

    // Get level from NFT info
    const level = nftInfo.level || 1

    // Get ROI from NFT info or use default mapping
    const roi = nftInfo.roi / 100 || LEVEL_CONFIG[level as keyof typeof LEVEL_CONFIG].dailyROI

    const config = LEVEL_CONFIG[level as keyof typeof LEVEL_CONFIG]

    return {
      id: tokenId,
      name: `${config.name} ${petType.name}`,
      emoji: petType.emoji,
      level,
      investmentAmount: nftInfo.investedAmount,
      purchaseDate: new Date(nftInfo.lastClaimTime * 1000 || Date.now()),
      dailyROI: roi,
      totalEarned: 0,
      tokenId,
      // Animation properties
      x: Math.random() * 80 + 10,
      y: Math.random() * 60 + 20,
      targetX: Math.random() * 80 + 10,
      targetY: Math.random() * 60 + 20,
      direction: Math.random() > 0.5 ? "right" : "left",
      mood: MOODS[Math.floor(Math.random() * 4)],
    }
  }

  // Load user's NFTs from the gacha game contract
  const loadUserNFTs = async (address: string) => {
    setIsLoading(true)
    try {
      console.log("Loading user NFTs from gacha contract for address:", address)

      const tokenIds = await getUserTokenIds(address)
      console.log("Token IDs from contract:", tokenIds)

      if (tokenIds.length === 0) {
        console.log("No NFTs found for this user")
        setUserPets([])
        return
      }

      // For each token ID, get the NFT info
      const pets: UserPet[] = []

      for (const tokenId of tokenIds) {
        const nftInfo = await getNFTRewardInfo(Number(tokenId))
        if (nftInfo) {
          console.log(`Parsed NFT info for token ${tokenId}:`, nftInfo)
          const pet = createPetFromContractData(Number(tokenId), nftInfo)
          pets.push(pet)
        }
      }

      console.log("Loaded pets:", pets)
      setUserPets(pets)
    } catch (error) {
      console.error("Failed to load user NFTs:", error)
      toast({
        title: "Failed to Load NFTs",
        description: "There was an error loading your NFTs. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Load user's investment and reward data
  const loadUserRewards = async () => {
    try {
      console.log("Loading investment and reward data from pets")

      // Calculate total invested from user's pets
      let totalInvestedAmount = 0
      let totalUnclaimedRewards = 0

      // Sum up investment amounts from all pets
      userPets.forEach((pet) => {
        totalInvestedAmount += pet.investmentAmount

        // Calculate unclaimed rewards for this pet
        const daysSincePurchase = (Date.now() - pet.purchaseDate.getTime()) / (1000 * 60 * 60 * 24)
        const dailyEarnings = pet.investmentAmount * (pet.dailyROI / 100)
        const totalPetEarnings = dailyEarnings * daysSincePurchase
        totalUnclaimedRewards += totalPetEarnings
      })

      setTotalInvested(totalInvestedAmount)
      setUnclaimedRewards(totalUnclaimedRewards)

      // For total earned, we would need to track claimed rewards from contract events
      // For now, we'll just set it to 0
      setTotalEarned(0)
    } catch (error) {
      console.error("Failed to load user rewards:", error)
    }
  }

  // Pet animation system
  useEffect(() => {
    if (userPets.length === 0) return

    const animationInterval = setInterval(() => {
      setUserPets((prevPets) =>
        prevPets.map((pet) => {
          // Move towards target
          const dx = pet.targetX - pet.x
          const dy = pet.targetY - pet.y
          const distance = Math.sqrt(dx * dx + dy * dy)

          if (distance < 2) {
            // Reached target, set new target
            return {
              ...pet,
              targetX: Math.random() * 80 + 10,
              targetY: Math.random() * 60 + 20,
              direction: Math.random() > 0.5 ? "right" : "left",
              mood: Math.random() > 0.8 ? MOODS[Math.floor(Math.random() * 4)] : pet.mood,
            }
          } else {
            // Move towards target
            const speed = 0.5
            const moveX = (dx / distance) * speed
            const moveY = (dy / distance) * speed

            return {
              ...pet,
              x: pet.x + moveX,
              y: pet.y + moveY,
              direction: moveX > 0 ? "right" : "left",
            }
          }
        }),
      )
    }, 100) // Update every 100ms for smooth animation

    return () => clearInterval(animationInterval)
  }, [userPets.length])

  // Calculate rewards in real-time
  useEffect(() => {
    if (userPets.length === 0) return

    const interval = setInterval(() => {
      let totalUnclaimed = 0

      userPets.forEach((pet) => {
        const daysSincePurchase = (Date.now() - pet.purchaseDate.getTime()) / (1000 * 60 * 60 * 24)
        const dailyEarnings = pet.investmentAmount * (pet.dailyROI / 100)
        const totalPetEarnings = dailyEarnings * daysSincePurchase
        totalUnclaimed += totalPetEarnings - pet.totalEarned
      })

      setUnclaimedRewards(totalUnclaimed)
    }, 1000)

    return () => clearInterval(interval)
  }, [userPets])

  // Load user data
  const loadUserData = async (address: string) => {
    try {
      console.log("Loading user data from gacha game contract for address:", address)

      // Load user's NFTs from gacha game contract first
      await loadUserNFTs(address)

      // Then load user's investment and reward data based on the NFTs
      setTimeout(() => {
        loadUserRewards()
      }, 500)
    } catch (error) {
      console.error("Failed to load user data:", error)
    }
  }

  const calculatePetCurrentEarnings = (pet: UserPet) => {
    const daysSincePurchase = (Date.now() - pet.purchaseDate.getTime()) / (1000 * 60 * 60 * 24)
    const dailyEarnings = pet.investmentAmount * (pet.dailyROI / 100)
    return dailyEarnings * daysSincePurchase
  }

  const totalPortfolioValue = totalInvested + totalEarned + unclaimedRewards

  return {
    userPets,
    totalInvested,
    totalEarned,
    unclaimedRewards,
    totalPortfolioValue,
    isLoading,
    loadUserData,
    loadUserNFTs,
    calculatePetCurrentEarnings,
  }
} 