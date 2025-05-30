"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { UserPet } from "@/lib/types"
import { LEVEL_CONFIG, MOOD_EMOJIS, TOKEN_CONFIG } from "@/lib/constants"
import { getTierFromLevel, getRarityFromLevel } from "@/lib/utils"

interface PetCardProps {
  pet: UserPet
  currentEarnings: number
  onClaimReward: (tokenId: number) => void
  isLoading: boolean
}

export function PetCard({ pet, currentEarnings, onClaimReward, isLoading }: PetCardProps) {
  const config = LEVEL_CONFIG[pet.level as keyof typeof LEVEL_CONFIG]
  const daysSincePurchase = (Date.now() - pet.purchaseDate.getTime()) / (1000 * 60 * 60 * 24)
  const tier = getTierFromLevel(pet.level)
  const rarity = getRarityFromLevel(pet.level)

  const getMoodEmoji = (mood: string) => {
    return MOOD_EMOJIS[mood as keyof typeof MOOD_EMOJIS] || MOOD_EMOJIS.happy
  }

  return (
    <Card className="relative hover:shadow-lg transition-shadow">
      <CardHeader className="text-center">
        <div className="text-4xl mb-2 relative">
          {pet.emoji}
          <span className="absolute -top-1 -right-1 text-lg">{getMoodEmoji(pet.mood)}</span>
        </div>
        <CardTitle className="text-sm">{pet.name}</CardTitle>
        <div className="flex flex-col gap-1">
          <Badge className={config.color}>Level {pet.level}</Badge>
          <Badge variant="outline" className="text-xs font-semibold">
            Tier {tier} - {rarity}
          </Badge>
          <Badge variant="outline" className="text-xs">
            NFT #{pet.tokenId}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="flex justify-between text-sm">
          <span>Investment:</span>
          <span className="font-bold">{pet.investmentAmount} {TOKEN_CONFIG.investmentSymbol}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span>Daily ROI:</span>
          <span className="font-bold text-green-600">{pet.dailyROI}%</span>
        </div>
        <div className="flex justify-between text-sm">
          <span>Current Earnings:</span>
          <span className="font-bold text-blue-600">{currentEarnings.toFixed(6)} {TOKEN_CONFIG.rewardSymbol}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span>Days Held:</span>
          <span>{daysSincePurchase.toFixed(1)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span>Mood:</span>
          <span className="capitalize">
            {pet.mood} {getMoodEmoji(pet.mood)}
          </span>
        </div>

        <Button
          onClick={() => onClaimReward(pet.tokenId)}
          disabled={isLoading || currentEarnings <= 0}
          size="sm"
          className="w-full mt-2"
        >
          {currentEarnings > 0 ? `Claim ${currentEarnings.toFixed(6)} ${TOKEN_CONFIG.rewardSymbol}` : "No Rewards Yet"}
        </Button>
      </CardContent>
    </Card>
  )
} 