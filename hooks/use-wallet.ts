"use client"

import { useState, useEffect } from "react"
import { ethers } from "ethers"
import { useToast } from "@/hooks/use-toast"
import { WalletState } from "@/lib/types"
import { CONTRACT_CONFIG } from "@/lib/constants"

export function useWallet() {
  const [wallet, setWallet] = useState<WalletState>({
    connected: false,
    address: "",
    balance: "0",
  })
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const getProvider = () => {
    if (typeof window !== "undefined" && window.ethereum) {
      return new ethers.BrowserProvider(window.ethereum)
    }
    return null
  }

  const connectWallet = async () => {
    setIsLoading(true)
    try {
      // Check if MetaMask is installed
      if (typeof window === "undefined" || !window.ethereum) {
        toast({
          title: "MetaMask Not Found",
          description: "Please install MetaMask browser extension to use this dApp",
          variant: "destructive",
        })
        setIsLoading(false)
        return
      }

      // Check if MetaMask is accessible
      if (!window.ethereum.isMetaMask) {
        toast({
          title: "MetaMask Required",
          description: "Please use MetaMask wallet to connect",
          variant: "destructive",
        })
        setIsLoading(false)
        return
      }

      // Request account access
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      })

      if (!accounts || accounts.length === 0) {
        toast({
          title: "No Accounts Found",
          description: "Please make sure you have accounts in your MetaMask wallet",
          variant: "destructive",
        })
        setIsLoading(false)
        return
      }

      // Get current network
      const chainId = await window.ethereum.request({ method: "eth_chainId" })
      const currentChainId = Number.parseInt(chainId, 16)

      console.log("Connected to chain:", currentChainId)
      console.log("Expected chain:", CONTRACT_CONFIG.chainId)

      // Get balance using ethers
      const provider = getProvider()
      if (provider) {
        const balance = await provider.getBalance(accounts[0])
        const ethBalance = ethers.formatEther(balance)

        setWallet({
          connected: true,
          address: accounts[0],
          balance: Number.parseFloat(ethBalance).toFixed(4),
        })

        toast({
          title: "Wallet Connected Successfully!",
          description: `Connected to ${accounts[0].slice(0, 6)}...${accounts[0].slice(-4)}`,
        })

        // Listen for account changes
        window.ethereum.on("accountsChanged", (accounts: string[]) => {
          if (accounts.length === 0) {
            disconnectWallet()
          } else {
            // Reload with new account
            window.location.reload()
          }
        })

        // Listen for network changes
        window.ethereum.on("chainChanged", (chainId: string) => {
          // Reload the page when network changes
          window.location.reload()
        })

        return true
      }
    } catch (error: any) {
      console.error("Failed to connect wallet:", error)

      let errorMessage = "Failed to connect wallet"

      if (error.code === 4001) {
        errorMessage = "Connection rejected by user"
      } else if (error.code === -32002) {
        errorMessage = "Connection request already pending. Please check MetaMask."
      } else if (error.message) {
        errorMessage = error.message
      }

      toast({
        title: "Connection Failed",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
    return false
  }

  const disconnectWallet = () => {
    setWallet({ connected: false, address: "", balance: "0" })
    toast({
      title: "Wallet Disconnected",
      description: "Wallet has been disconnected",
    })
  }

  const updateBalance = async () => {
    if (wallet.connected && wallet.address) {
      const provider = getProvider()
      if (provider) {
        const newBalance = await provider.getBalance(wallet.address)
        const ethBalance = ethers.formatEther(newBalance)
        setWallet((prev) => ({ ...prev, balance: Number.parseFloat(ethBalance).toFixed(4) }))
      }
    }
  }

  return {
    wallet,
    connectWallet,
    disconnectWallet,
    updateBalance,
    isLoading,
    getProvider,
  }
} 