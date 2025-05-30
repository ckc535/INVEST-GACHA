"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Dice6 } from "lucide-react"
import { LEVEL_CONFIG, CONTRACT_CONFIG } from "@/lib/constants"

interface InvestmentTabProps {
  walletBalance: string
  onInvest: (quantity: number, amountPerNFT: number) => Promise<boolean>
  isGenerating: boolean
}

export function InvestmentTab({ walletBalance, onInvest, isGenerating }: InvestmentTabProps) {
  const [investmentAmount, setInvestmentAmount] = useState("")
  const [petAmount, setPetAmount] = useState("1")

  const handleInvest = async () => {
    const amount = Number.parseFloat(investmentAmount)
    const quantity = Number.parseInt(petAmount)

    if (!amount || amount <= 0 || !quantity || quantity <= 0) {
      return
    }

    const success = await onInvest(quantity, amount)
    if (success) {
      setInvestmentAmount("")
      setPetAmount("1")
    }
  }

  const totalCost = Number.parseFloat(investmentAmount || "0") * Number.parseInt(petAmount || "1")

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Investment Panel */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Dice6 className="w-5 h-5" />
            Gacha Game Investment
          </CardTitle>
          <CardDescription>Invest ETH in the gacha game contract to get random pet NFTs</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="investment">Investment per Pet (ETH)</Label>
              <Input
                id="investment"
                type="number"
                step="0.001"
                placeholder="0.1"
                value={investmentAmount}
                onChange={(e) => setInvestmentAmount(e.target.value)}
                disabled={isGenerating}
              />
            </div>
            <div>
              <Label htmlFor="amount">Amount of Pets</Label>
              <Input
                id="amount"
                type="number"
                min="1"
                max="10"
                placeholder="1"
                value={petAmount}
                onChange={(e) => setPetAmount(e.target.value)}
                disabled={isGenerating}
              />
            </div>
          </div>

          {/* Quick Select Buttons */}
          <div>
            <Label>Quick Select Investment</Label>
            <div className="grid grid-cols-4 gap-2 mt-2">
              {["0.1", "0.5", "1.0", "2.0"].map((amount) => (
                <Button
                  key={amount}
                  variant="outline"
                  size="sm"
                  onClick={() => setInvestmentAmount(amount)}
                  disabled={isGenerating}
                >
                  {amount}
                </Button>
              ))}
            </div>
          </div>

          <div>
            <Label>Quick Select Amount</Label>
            <div className="grid grid-cols-5 gap-2 mt-2">
              {["1", "3", "5", "7", "10"].map((amount) => (
                <Button
                  key={amount}
                  variant="outline"
                  size="sm"
                  onClick={() => setPetAmount(amount)}
                  disabled={isGenerating}
                >
                  {amount}
                </Button>
              ))}
            </div>
          </div>

          {/* Total Cost Display */}
          {investmentAmount && petAmount && (
            <div className="p-4 bg-blue-50 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="font-medium">Total Cost:</span>
                <span className="text-2xl font-bold text-blue-600">
                  {totalCost.toFixed(3)} ETH
                </span>
              </div>
              <div className="flex justify-between items-center text-sm text-gray-600 mt-1">
                <span>
                  {petAmount} pets × {investmentAmount} ETH each
                </span>
                <span>Balance: {walletBalance} ETH</span>
              </div>
            </div>
          )}

          <Button
            onClick={handleInvest}
            disabled={isGenerating || !investmentAmount || !petAmount || totalCost > Number.parseFloat(walletBalance)}
            className="w-full"
            size="lg"
          >
            {isGenerating ? `Generating ${petAmount} Pet(s)...` : `Invest & Generate ${petAmount} Pet(s)`}
          </Button>

          {isGenerating && (
            <div className="space-y-2">
              <p className="text-sm text-gray-600 text-center">
                Sending transaction to gacha game contract...
              </p>
              <Progress value={66} className="w-full" />
            </div>
          )}

          {/* Contract Info */}
          <div
            className={`p-3 rounded-lg ${CONTRACT_CONFIG.gachaGameContract ? "bg-green-50" : "bg-red-50"}`}
          >
            <p className={`text-sm ${CONTRACT_CONFIG.gachaGameContract ? "text-green-800" : "text-red-800"}`}>
              <strong>Gacha Game Contract:</strong> {CONTRACT_CONFIG.gachaGameContract || "⚠️ NOT CONFIGURED"}
            </p>
            <p className={`text-sm ${CONTRACT_CONFIG.gachaGameContract ? "text-green-800" : "text-red-800"}`}>
              <strong>Network:</strong> Chain ID {CONTRACT_CONFIG.chainId}
            </p>
            {CONTRACT_CONFIG.gachaGameContract ? (
              <p className="text-sm text-green-700 mt-2">✅ Contract configured and ready for transactions</p>
            ) : (
              <p className="text-sm text-red-700 mt-2">
                ❌ Please add your deployed contract address to enable transactions
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Level Information */}
      <Card>
        <CardHeader>
          <CardTitle>Pet Levels & ROI Rates</CardTitle>
          <CardDescription>Higher levels have better daily ROI rates</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {Object.entries(LEVEL_CONFIG).map(([level, config]) => (
              <div key={level} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Badge className={config.color}>Level {level}</Badge>
                  <span className="font-medium">{config.name}</span>
                </div>
                <span className="text-green-600 font-bold">{config.dailyROI}% Daily ROI</span>
              </div>
            ))}
          </div>

          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>How the Gacha System Works:</strong>
            </p>
            <ul className="text-sm text-blue-700 mt-2 space-y-1">
              <li>• Single contract handles everything</li>
              <li>• Random pet generation on-chain</li>
              <li>• Automatic reward calculation</li>
              <li>• Claim rewards anytime</li>
              <li>• NFT ownership tracked in contract</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 