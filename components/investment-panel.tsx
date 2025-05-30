"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Dice6, TrendingUp } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface InvestmentPanelProps {
  onInvest: (amount: number) => Promise<void>
  walletBalance: string
  isGenerating: boolean
}

export function InvestmentPanel({ onInvest, walletBalance, isGenerating }: InvestmentPanelProps) {
  const [amount, setAmount] = useState("")
  const { toast } = useToast()

  const handleInvest = async () => {
    const investmentAmount = Number.parseFloat(amount)

    if (!investmentAmount || investmentAmount <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid investment amount",
        variant: "destructive",
      })
      return
    }

    if (investmentAmount > Number.parseFloat(walletBalance)) {
      toast({
        title: "Insufficient Balance",
        description: "You don't have enough ETH for this investment",
        variant: "destructive",
      })
      return
    }

    await onInvest(investmentAmount)
    setAmount("")
  }

  const suggestedAmounts = ["0.1", "0.5", "1.0", "2.0"]

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Dice6 className="w-5 h-5" />
          Investment Generator
        </CardTitle>
        <CardDescription>Invest ETH to generate a random pet with level-based ROI</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="investment">Investment Amount (ETH)</Label>
          <Input
            id="investment"
            type="number"
            step="0.001"
            placeholder="Enter amount..."
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            disabled={isGenerating}
          />
          <p className="text-sm text-gray-500 mt-1">Available: {walletBalance} ETH</p>
        </div>

        <div>
          <Label>Quick Select</Label>
          <div className="grid grid-cols-4 gap-2 mt-2">
            {suggestedAmounts.map((suggestedAmount) => (
              <Button
                key={suggestedAmount}
                variant="outline"
                size="sm"
                onClick={() => setAmount(suggestedAmount)}
                disabled={isGenerating}
              >
                {suggestedAmount}
              </Button>
            ))}
          </div>
        </div>

        <Button onClick={handleInvest} disabled={isGenerating || !amount} className="w-full" size="lg">
          {isGenerating ? "Generating Pet..." : "Invest & Generate Pet"}
        </Button>

        {isGenerating && (
          <div className="space-y-2">
            <p className="text-sm text-gray-600 text-center">Contract is generating your random pet...</p>
            <Progress value={66} className="w-full" />
          </div>
        )}

        <div className="p-3 bg-blue-50 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 text-blue-600" />
            <span className="font-medium text-blue-800">Expected Returns</span>
          </div>
          <div className="text-sm text-blue-700 space-y-1">
            <p>• Level 1-2: 0.5-0.8% daily ROI</p>
            <p>• Level 3-4: 1.2-1.8% daily ROI</p>
            <p>• Level 5: 2.5% daily ROI (rare!)</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
