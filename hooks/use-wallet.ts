"use client"

import { useState, useEffect } from "react"
import { ethers } from "ethers"
import { useToast } from "@/hooks/use-toast"
import { WalletState } from "@/lib/types"
import { CONTRACT_CONFIG, NETWORK_CONFIG } from "@/lib/constants"

export function useWallet() {
  const [wallet, setWallet] = useState<WalletState>({
    connected: false,
    address: "",
    balance: "0",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [isWrongNetwork, setIsWrongNetwork] = useState(false)
  const { toast } = useToast()

  const getProvider = () => {
    if (typeof window !== "undefined" && window.ethereum) {
      return new ethers.BrowserProvider(window.ethereum)
    }
    return null
  }

  // Check if user is on correct network
  const checkNetwork = async () => {
    if (typeof window !== "undefined" && window.ethereum) {
      try {
        const chainId = await window.ethereum.request({ method: "eth_chainId" })
        const currentChainId = Number.parseInt(chainId, 16)
        const isCorrectNetwork = currentChainId === CONTRACT_CONFIG.chainId
        setIsWrongNetwork(!isCorrectNetwork)
        return isCorrectNetwork
      } catch (error) {
        console.error("Error checking network:", error)
        return false
      }
    }
    return false
  }

  // Switch to Sepolia network
  const switchToSepolia = async () => {
    if (typeof window === "undefined" || !window.ethereum) {
      toast({
        title: "MetaMask Required",
        description: "Please install MetaMask to switch networks",
        variant: "destructive",
      })
      return false
    }

    try {
      // First try to switch to Sepolia
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: `0x${CONTRACT_CONFIG.chainId.toString(16)}` }], // Convert to hex
      })
      
      setIsWrongNetwork(false)
      toast({
        title: "Network Switched",
        description: "Successfully switched to Sepolia network",
      })
      return true
    } catch (switchError: any) {
      // If network doesn't exist, add it
      if (switchError.code === 4902) {
        try {
          await window.ethereum.request({
            method: "wallet_addEthereumChain",
            params: [
              {
                chainId: `0x${CONTRACT_CONFIG.chainId.toString(16)}`,
                chainName: "Sepolia Test Network",
                nativeCurrency: {
                  name: "Sepolia ETH",
                  symbol: "ETH",
                  decimals: 18,
                },
                rpcUrls: ["https://sepolia.infura.io/v3/"],
                blockExplorerUrls: ["https://sepolia.etherscan.io/"],
              },
            ],
          })
          
          setIsWrongNetwork(false)
          toast({
            title: "Network Added",
            description: "Sepolia network added and switched successfully",
          })
          return true
        } catch (addError) {
          console.error("Error adding network:", addError)
          toast({
            title: "Failed to Add Network",
            description: "Could not add Sepolia network. Please add it manually.",
            variant: "destructive",
          })
          return false
        }
      } else {
        console.error("Error switching network:", switchError)
        toast({
          title: "Network Switch Failed",
          description: "Could not switch to Sepolia network. Please switch manually.",
          variant: "destructive",
        })
        return false
      }
    }
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

      // Check network after connecting
      const isCorrectNetwork = await checkNetwork()
      
      if (!isCorrectNetwork) {
        toast({
          title: "Wrong Network",
          description: "Please switch to Sepolia network to use this dApp",
          variant: "destructive",
        })
        // Don't return early - still connect but show warning
      }

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
          // Check if new network is correct
          const newChainId = Number.parseInt(chainId, 16)
          const isCorrect = newChainId === CONTRACT_CONFIG.chainId
          setIsWrongNetwork(!isCorrect)
          
          if (isCorrect) {
            toast({
              title: "Network Changed",
              description: "Connected to Sepolia network",
            })
            // Reload the page when switching to correct network
            window.location.reload()
          } else {
            toast({
              title: "Wrong Network",
              description: "Please switch back to Sepolia network",
              variant: "destructive",
            })
          }
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
    setIsWrongNetwork(false)
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

  // Check network on component mount
  useEffect(() => {
    if (wallet.connected) {
      checkNetwork()
    }
  }, [wallet.connected])

  return {
    wallet,
    connectWallet,
    disconnectWallet,
    updateBalance,
    isLoading,
    isWrongNetwork,
    switchToSepolia,
    checkNetwork,
    getProvider,
  }
} 