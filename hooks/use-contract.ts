"use client"

import { ethers } from "ethers"
import { useToast } from "@/hooks/use-toast"
import { CONTRACT_CONFIG, GACHA_GAME_ABI } from "@/lib/constants"

export function useContract() {
  const { toast } = useToast()

  const getProvider = () => {
    if (typeof window !== "undefined" && window.ethereum) {
      return new ethers.BrowserProvider(window.ethereum)
    }
    return null
  }

  const getSigner = async () => {
    const provider = getProvider()
    if (provider) {
      return await provider.getSigner()
    }
    return null
  }

  const getContract = async (withSigner = false) => {
    try {
      if (withSigner) {
        const signer = await getSigner()
        if (signer) {
          return new ethers.Contract(CONTRACT_CONFIG.gachaGameContract, GACHA_GAME_ABI, signer)
        }
      } else {
        const provider = getProvider()
        if (provider) {
          return new ethers.Contract(CONTRACT_CONFIG.gachaGameContract, GACHA_GAME_ABI, provider)
        }
      }
      return null
    } catch (error) {
      console.error("Error creating contract instance:", error)
      return null
    }
  }

  const investAndGeneratePets = async (quantity: number, amountPerNFT: number) => {
    // Validate contract address first
    if (!CONTRACT_CONFIG.gachaGameContract || CONTRACT_CONFIG.gachaGameContract === "") {
      toast({
        title: "Contract Not Configured",
        description: "Please add your deployed contract address to CONTRACT_CONFIG.gachaGameContract",
        variant: "destructive",
      })
      return false
    }

    const totalCost = amountPerNFT * quantity

    try {
      // Get contract with signer for transactions
      const contract = await getContract(true)
      if (!contract) {
        throw new Error("Could not create contract instance with signer")
      }

      // Convert amounts to Wei
      const amountPerNFTWei = ethers.parseEther(amountPerNFT.toString())
      const totalValueWei = ethers.parseEther(totalCost.toString())

      console.log("Calling invest function with:", {
        numberOfNFTs: quantity,
        investedAmountPerNFT: amountPerNFT + " ETH",
        amountPerNFTWei: amountPerNFTWei.toString(),
        totalValue: totalCost + " ETH",
        totalValueWei: totalValueWei.toString(),
        contractAddress: CONTRACT_CONFIG.gachaGameContract,
      })

      // Call the invest function
      const tx = await contract.invest(quantity, amountPerNFTWei, {
        value: totalValueWei,
        gasLimit: 1000000, // Set a reasonable gas limit
      })

      toast({
        title: "Investment Transaction Sent",
        description: `Calling invest(${quantity}, ${amountPerNFT} ETH) on gacha contract...`,
      })

      console.log("Transaction sent:", tx.hash)

      // Wait for transaction confirmation
      const receipt = await tx.wait()
      console.log("Transaction confirmed:", receipt)

      toast({
        title: "Investment Successful!",
        description: `Successfully invested ${totalCost.toFixed(3)} ETH for ${quantity} NFTs`,
      })

      return true
    } catch (error: any) {
      console.error("Investment transaction failed:", error)

      let errorMessage = "Failed to call invest function"

      if (error.code === "ACTION_REJECTED") {
        errorMessage = "Transaction rejected by user"
      } else if (error.code === "INSUFFICIENT_FUNDS") {
        errorMessage = "Insufficient funds for gas"
      } else if (error.code === "UNPREDICTABLE_GAS_LIMIT") {
        errorMessage = "Contract execution would fail"
      } else if (error.reason) {
        errorMessage = error.reason
      } else if (error.message) {
        errorMessage = error.message
      }

      toast({
        title: "Investment Failed",
        description: errorMessage,
        variant: "destructive",
      })
      return false
    }
  }

  const claimRewardForPet = async (tokenId: number) => {
    if (!CONTRACT_CONFIG.gachaGameContract || CONTRACT_CONFIG.gachaGameContract === "") {
      toast({
        title: "Contract Not Configured",
        description: "Please add your deployed contract address to CONTRACT_CONFIG.gachaGameContract",
        variant: "destructive",
      })
      return false
    }

    try {
      // Get contract with signer for transactions
      const contract = await getContract(true)
      if (!contract) {
        throw new Error("Could not create contract instance with signer")
      }

      console.log("Calling claimReward function for token:", tokenId)

      // Call the claimReward function
      const tx = await contract.claimReward(tokenId, {
        gasLimit: 200000, // Set a reasonable gas limit
      })

      toast({
        title: "Claim Transaction Sent",
        description: `Claiming rewards for NFT #${tokenId}...`,
      })

      console.log("Claim transaction sent:", tx.hash)

      // Wait for transaction confirmation
      const receipt = await tx.wait()
      console.log("Claim transaction confirmed:", receipt)

      toast({
        title: "Rewards Claimed!",
        description: `Successfully claimed rewards for NFT #${tokenId}`,
      })

      return true
    } catch (error: any) {
      console.error("Claim failed:", error)

      let errorMessage = "Failed to claim rewards"

      if (error.code === "ACTION_REJECTED") {
        errorMessage = "Transaction rejected by user"
      } else if (error.reason) {
        errorMessage = error.reason
      } else if (error.message) {
        errorMessage = error.message
      }

      toast({
        title: "Claim Failed",
        description: errorMessage,
        variant: "destructive",
      })
      return false
    }
  }

  const getUserTokenIds = async (address: string) => {
    try {
      const contract = await getContract(false)
      if (!contract) {
        console.error("Could not create contract instance")
        return []
      }

      const tokenIds = await contract.getUserTokenIds(address)
      console.log("Token IDs from contract:", tokenIds)
      return tokenIds
    } catch (error) {
      console.error("Failed to get user token IDs:", error)
      return []
    }
  }

  const getNFTRewardInfo = async (tokenId: number) => {
    try {
      const contract = await getContract(false)
      if (!contract) {
        console.error("Could not create contract instance")
        return null
      }

      const nftInfo = await contract.getNFTRewardInfo(tokenId)
      console.log(`NFT info for token ${tokenId}:`, nftInfo)

      return {
        investedAmount: Number.parseFloat(ethers.formatEther(nftInfo[0])), // investedAmount
        lastClaimTime: Number(nftInfo[1]), // lastClaimTime
        level: Number(nftInfo[2]), // level
        roi: Number(nftInfo[3]), // roi
        baseURI: nftInfo[4], // baseURI
      }
    } catch (error) {
      console.error(`Error loading NFT ${tokenId}:`, error)
      return null
    }
  }

  return {
    getContract,
    investAndGeneratePets,
    claimRewardForPet,
    getUserTokenIds,
    getNFTRewardInfo,
  }
} 