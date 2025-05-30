"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Wallet, ExternalLink } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface WalletConnectProps {
  onConnect: (address: string, balance: string) => void
  onDisconnect: () => void
  isConnected: boolean
  address?: string
  balance?: string
}

export function WalletConnect({ onConnect, onDisconnect, isConnected, address, balance }: WalletConnectProps) {
  const [isConnecting, setIsConnecting] = useState(false)
  const { toast } = useToast()

  const connectWallet = async () => {
    setIsConnecting(true)

    try {
      if (typeof window !== "undefined" && window.ethereum) {
        // Request account access
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        })

        if (accounts.length > 0) {
          // Get balance
          const balance = await window.ethereum.request({
            method: "eth_getBalance",
            params: [accounts[0], "latest"],
          })

          // Convert balance from wei to ETH
          const ethBalance = (Number.parseInt(balance, 16) / Math.pow(10, 18)).toFixed(4)

          onConnect(accounts[0], ethBalance)

          toast({
            title: "Wallet Connected",
            description: `Connected to ${accounts[0].slice(0, 6)}...${accounts[0].slice(-4)}`,
          })
        }
      } else {
        toast({
          title: "MetaMask Not Found",
          description: "Please install MetaMask to use this dApp",
          variant: "destructive",
        })
      }
    } catch (error: any) {
      console.error("Failed to connect wallet:", error)
      toast({
        title: "Connection Failed",
        description: error.message || "Failed to connect wallet",
        variant: "destructive",
      })
    } finally {
      setIsConnecting(false)
    }
  }

  const handleDisconnect = () => {
    onDisconnect()
    toast({
      title: "Wallet Disconnected",
      description: "Your wallet has been disconnected",
    })
  }

  if (isConnected && address) {
    return (
      <div className="flex items-center gap-4">
        <div className="text-right">
          <p className="text-sm text-gray-600">
            {address.slice(0, 6)}...{address.slice(-4)}
          </p>
          <p className="font-bold">{balance} ETH</p>
        </div>
        <Button variant="outline" onClick={handleDisconnect} className="flex items-center gap-2">
          <ExternalLink className="w-4 h-4" />
          Disconnect
        </Button>
      </div>
    )
  }

  return (
    <Button onClick={connectWallet} disabled={isConnecting} className="flex items-center gap-2">
      <Wallet className="w-4 h-4" />
      {isConnecting ? "Connecting..." : "Connect Wallet"}
    </Button>
  )
}
