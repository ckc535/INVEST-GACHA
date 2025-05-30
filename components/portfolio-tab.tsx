"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { CONTRACT_CONFIG, TOKEN_CONFIG } from "@/lib/constants"

interface PortfolioTabProps {
  totalInvested: number
  totalEarned: number
  unclaimedRewards: number
  totalPortfolioValue: number
}

export function PortfolioTab({
  totalInvested,
  totalEarned,
  unclaimedRewards,
  totalPortfolioValue,
}: PortfolioTabProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">💰 My Portfolio</h2>
        <p className="text-gray-600">Overview of your investments and earnings from the gacha game contract</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Total Invested</CardTitle>
            <CardDescription>Total {TOKEN_CONFIG.investmentSymbol} invested in gacha game</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">{totalInvested.toFixed(6)} {TOKEN_CONFIG.investmentSymbol}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Total Earned</CardTitle>
            <CardDescription>Total {TOKEN_CONFIG.rewardSymbol} earned and claimed</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">{totalEarned.toFixed(6)} {TOKEN_CONFIG.rewardSymbol}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Unclaimed Rewards</CardTitle>
            <CardDescription>Available {TOKEN_CONFIG.rewardSymbol} to claim from contract</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-yellow-600">{unclaimedRewards.toFixed(6)} {TOKEN_CONFIG.rewardSymbol}</div>
          </CardContent>
        </Card>

        <Card className="col-span-1 md:col-span-2 lg:col-span-3">
          <CardHeader>
            <CardTitle>Total Portfolio Value</CardTitle>
            <CardDescription>Combined value of your investments and rewards ({TOKEN_CONFIG.investmentSymbol} + {TOKEN_CONFIG.rewardSymbol})</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-600">
              {totalInvested.toFixed(6)} {TOKEN_CONFIG.investmentSymbol} + {(totalEarned + unclaimedRewards).toFixed(6)} {TOKEN_CONFIG.rewardSymbol}
            </div>
            {totalPortfolioValue > 0 && (
              <>
                <Progress value={(totalInvested / totalPortfolioValue) * 100} className="mt-4" />
                <p className="text-sm text-gray-500 mt-2">
                  Invested: {((totalInvested / totalPortfolioValue) * 100).toFixed(1)}% | Earned + Unclaimed:{" "}
                  {(((totalEarned + unclaimedRewards) / totalPortfolioValue) * 100).toFixed(1)}%
                </p>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Contract Information */}
      <Card>
        <CardHeader>
          <CardTitle>Gacha Game Contract Information</CardTitle>
          <CardDescription>Details about the single smart contract powering this dApp</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
            <h4 className="font-semibold text-blue-800 mb-2">🎲 Gacha Game Contract</h4>
            <p className="text-sm text-blue-700 mb-3">
              All-in-one contract that handles investments, NFT generation, reward calculation, and claiming
            </p>
            <p className="text-xs text-blue-600 font-mono bg-white p-2 rounded border">
              {CONTRACT_CONFIG.gachaGameContract}
            </p>

            <div className="mt-4 grid grid-cols-2 gap-4">
              <div>
                <h5 className="font-medium text-blue-800">Contract Functions:</h5>
                <ul className="text-sm text-blue-700 mt-1 space-y-1">
                  <li>• invest() - Invest {TOKEN_CONFIG.investmentSymbol} and get random pets</li>
                  <li>• getUserNFTs() - Get user's pet NFTs</li>
                  <li>• calculateRewards() - Calculate current {TOKEN_CONFIG.rewardSymbol} rewards</li>
                  <li>• claimRewards() - Claim accumulated {TOKEN_CONFIG.rewardSymbol} rewards</li>
                </ul>
              </div>
              <div>
                <h5 className="font-medium text-blue-800">Features:</h5>
                <ul className="text-sm text-blue-700 mt-1 space-y-1">
                  <li>• Random pet generation with tiers</li>
                  <li>• Level-based ROI system (Tier I-V)</li>
                  <li>• Automatic {TOKEN_CONFIG.rewardSymbol} reward tracking</li>
                  <li>• NFT ownership management</li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 