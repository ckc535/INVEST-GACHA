"use client"

import { useState, useEffect } from "react"
import { Wallet, Home, Dice6, TrendingUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { useWallet } from "@/hooks/use-wallet"
import { useContract } from "@/hooks/use-contract"
import { usePetData } from "@/hooks/use-pet-data"
import { PetHouse } from "@/components/pet-house"
import { InvestmentTab } from "@/components/investment-tab"
import { PortfolioTab } from "@/components/portfolio-tab"
import { NetworkWarning } from "@/components/network-warning"
import { CONTRACT_CONFIG } from "@/lib/constants"

export default function NFTPetInvestmentGame() {
  const [isGenerating, setIsGenerating] = useState(false)
  const [activeTab, setActiveTab] = useState("house")
  const [isSwitchingNetwork, setIsSwitchingNetwork] = useState(false)
  const { toast } = useToast()

  // Custom hooks
  const { 
    wallet, 
    connectWallet, 
    disconnectWallet, 
    updateBalance, 
    isLoading: walletLoading,
    isWrongNetwork,
    switchToSepolia,
  } = useWallet()
  const { investAndGeneratePets, claimRewardForPet } = useContract()
  const {
    userPets,
    totalInvested,
    totalEarned,
    unclaimedRewards,
    totalPortfolioValue,
    isLoading: petsLoading,
    loadUserData,
    loadUserNFTs,
    calculatePetCurrentEarnings,
  } = usePetData()

  // Load user data when wallet connects
  useEffect(() => {
    if (wallet.connected && wallet.address && !isWrongNetwork) {
      loadUserData(wallet.address)
    }
  }, [wallet.connected, wallet.address, isWrongNetwork])

  const handleSwitchNetwork = async () => {
    setIsSwitchingNetwork(true)
    try {
      await switchToSepolia()
    } finally {
      setIsSwitchingNetwork(false)
    }
  }

  const handleInvest = async (quantity: number, amountPerNFT: number): Promise<boolean> => {
    // Check network before allowing investment
    if (isWrongNetwork) {
      toast({
        title: "Wrong Network",
        description: "Please switch to Sepolia network first",
        variant: "destructive",
      })
      return false
    }

    const totalCost = amountPerNFT * quantity

    if (totalCost > Number.parseFloat(wallet.balance)) {
      toast({
        title: "Insufficient Balance",
        description: `You need ${totalCost.toFixed(3)} ETH but only have ${wallet.balance} ETH`,
        variant: "destructive",
      })
      return false
    }

    setIsGenerating(true)
    try {
      const success = await investAndGeneratePets(quantity, amountPerNFT)
      if (success) {
        // Reload user data and update balance
        await loadUserData(wallet.address)
        await updateBalance()
        return true
      }
      return false
    } finally {
      setIsGenerating(false)
    }
  }

  const handleClaimReward = async (tokenId: number) => {
    // Check network before allowing claims
    if (isWrongNetwork) {
      toast({
        title: "Wrong Network",
        description: "Please switch to Sepolia network first",
        variant: "destructive",
      })
      return
    }

    const success = await claimRewardForPet(tokenId)
    if (success) {
      // Reload user data after claiming
      await loadUserData(wallet.address)
    }
  }

  const handleClaimAllRewards = async () => {
    // Check network before allowing claims
    if (isWrongNetwork) {
      toast({
        title: "Wrong Network",
        description: "Please switch to Sepolia network first",
        variant: "destructive",
      })
      return
    }

    try {
      // TODO: Implement claim all rewards logic from the contract
      console.log("Claiming all rewards...")
      toast({
        title: "Claiming All Rewards",
        description: "Feature coming soon!",
      })
    } catch (error: any) {
      console.error("Claim all failed:", error)
      toast({
        title: "Claim All Failed",
        description: error.message || "Failed to claim all rewards. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleSwitchToInvest = () => {
    setActiveTab("invest")
  }

  const handleReloadPets = () => {
    if (wallet.connected && wallet.address && !isWrongNetwork) {
      loadUserNFTs(wallet.address)
    }
  }

  return (
    <>
      {/* Network Warning Modal - Shows when connected but on wrong network */}
      {wallet.connected && isWrongNetwork && (
        <NetworkWarning 
          onSwitchNetwork={handleSwitchNetwork}
          isLoading={isSwitchingNetwork}
        />
      )}

      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-4xl font-bold text-gray-900">🎲 Gacha Pet Investment dApp</h1>
              <p className="text-gray-600 mt-2">
                Invest ETH in the gacha game contract to get random pets with ROI!
                <span className="ml-2 text-blue-600 font-medium">Sepolia Network Only</span>
              </p>
            </div>

            {/* Configuration Warning */}
            {!CONTRACT_CONFIG.gachaGameContract && (
              <Card className="mb-6 border-red-200 bg-red-50">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <div className="text-red-600">⚠️</div>
                    <div>
                      <h3 className="font-semibold text-red-800">Contract Configuration Required</h3>
                      <p className="text-sm text-red-700 mt-1">
                        Please create a .env file with NEXT_PUBLIC_CONTRACT_ADDRESS
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            <div className="flex items-center gap-4">
              {wallet.connected && (
                <div className="text-right">
                  <p className="text-sm text-gray-600">Balance</p>
                  <p className="font-bold">{wallet.balance} ETH</p>
                  {isWrongNetwork && (
                    <p className="text-xs text-red-600">⚠️ Wrong Network</p>
                  )}
                </div>
              )}

              <Button
                onClick={wallet.connected ? disconnectWallet : connectWallet}
                disabled={walletLoading}
                className="flex items-center gap-2"
                variant={wallet.connected ? "outline" : "default"}
              >
                <Wallet className="w-4 h-4" />
                {wallet.connected ? `${wallet.address.slice(0, 6)}...${wallet.address.slice(-4)}` : "Connect Wallet"}
              </Button>
            </div>
          </div>

          {!wallet.connected ? (
            <Card className="text-center py-12">
              <CardContent>
                <Wallet className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                <h2 className="text-2xl font-bold mb-2">Connect Your Wallet</h2>
                <p className="text-gray-600 mb-6">
                  Connect your wallet to start investing in the gacha game contract
                  <br />
                  <span className="text-blue-600 font-medium">Requires Sepolia Test Network</span>
                </p>
                <Button onClick={connectWallet} disabled={walletLoading} size="lg">
                  Connect Wallet
                </Button>
              </CardContent>
            </Card>
          ) : (
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="house" className="flex items-center gap-2" disabled={isWrongNetwork}>
                  <Home className="w-4 h-4" />
                  Pet House ({userPets.length})
                </TabsTrigger>
                <TabsTrigger value="invest" className="flex items-center gap-2" disabled={isWrongNetwork}>
                  <Dice6 className="w-4 h-4" />
                  Gacha Investment
                </TabsTrigger>
                <TabsTrigger value="portfolio" className="flex items-center gap-2" disabled={isWrongNetwork}>
                  <TrendingUp className="w-4 h-4" />
                  Portfolio
                </TabsTrigger>
              </TabsList>

              <TabsContent value="house" className="space-y-6">
                <PetHouse
                  userPets={userPets}
                  unclaimedRewards={unclaimedRewards}
                  onClaimAllRewards={handleClaimAllRewards}
                  onReloadPets={handleReloadPets}
                  onClaimReward={handleClaimReward}
                  calculatePetCurrentEarnings={calculatePetCurrentEarnings}
                  isLoading={petsLoading}
                  onSwitchToInvest={handleSwitchToInvest}
                />
              </TabsContent>

              <TabsContent value="invest" className="space-y-6">
                <InvestmentTab
                  walletBalance={wallet.balance}
                  onInvest={handleInvest}
                  isGenerating={isGenerating}
                />
              </TabsContent>

              <TabsContent value="portfolio" className="space-y-6">
                <PortfolioTab
                  totalInvested={totalInvested}
                  totalEarned={totalEarned}
                  unclaimedRewards={unclaimedRewards}
                  totalPortfolioValue={totalPortfolioValue}
                />
              </TabsContent>
            </Tabs>
          )}
        </div>
      </div>
    </>
  )
}
