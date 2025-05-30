"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Home } from "lucide-react"
import { UserPet } from "@/lib/types"
import { LEVEL_CONFIG, MOOD_EMOJIS, TOKEN_CONFIG } from "@/lib/constants"
import { getTierFromLevel, getRarityFromLevel } from "@/lib/utils"
import { PetCard } from "./pet-card"

interface PetHouseProps {
  userPets: UserPet[]
  unclaimedRewards: number
  onClaimAllRewards: () => void
  onReloadPets: () => void
  onClaimReward: (tokenId: number) => void
  calculatePetCurrentEarnings: (pet: UserPet) => number
  isLoading: boolean
  onSwitchToInvest: () => void
}

export function PetHouse({
  userPets,
  unclaimedRewards,
  onClaimAllRewards,
  onReloadPets,
  onClaimReward,
  calculatePetCurrentEarnings,
  isLoading,
  onSwitchToInvest,
}: PetHouseProps) {
  const getMoodEmoji = (mood: string) => {
    return MOOD_EMOJIS[mood as keyof typeof MOOD_EMOJIS] || MOOD_EMOJIS.happy
  }

  const getLevelConfig = (level: number) => {
    return LEVEL_CONFIG[level as keyof typeof LEVEL_CONFIG]
  }

  if (userPets.length === 0) {
    return (
      <Card className="text-center py-12">
        <CardContent>
          <Home className="w-16 h-16 mx-auto mb-4 text-gray-400" />
          <h3 className="text-xl font-bold mb-2">No pets yet</h3>
          <p className="text-gray-600 mb-6">
            Make your first investment in the gacha game to get random pets!
          </p>
          <Button onClick={onSwitchToInvest}>Start Investing</Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header with actions */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <h2 className="text-2xl font-bold">🏠 My Pet House</h2>
          <Button 
            onClick={onReloadPets} 
            disabled={isLoading}
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="animate-spin"><path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/><path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16"/><path d="M16 21h5v-5"/></svg>
            Reload
          </Button>
        </div>
        {unclaimedRewards > 0 && (
          <Button onClick={onClaimAllRewards} disabled={isLoading} size="lg">
            Claim {unclaimedRewards.toFixed(6)} {TOKEN_CONFIG.rewardSymbol}
          </Button>
        )}
      </div>

      {/* Animated Pet House */}
      <Card className="relative overflow-hidden">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            🏠 Live Pet House
            <Badge variant="secondary" className="ml-2">
              {userPets.length} pets living here
            </Badge>
          </CardTitle>
          <CardDescription>Watch your gacha pets move around and live their virtual lives!</CardDescription>
        </CardHeader>
        <CardContent>
          <div
            className="relative w-full h-96 bg-gradient-to-b from-sky-200 to-green-200 rounded-lg border-4 border-brown-600 overflow-hidden"
            style={{
              backgroundImage: `
                radial-gradient(circle at 20% 80%, rgba(255,255,255,0.3) 10%, transparent 10%),
                radial-gradient(circle at 80% 20%, rgba(255,255,255,0.3) 8%, transparent 8%),
                radial-gradient(circle at 40% 40%, rgba(255,255,255,0.2) 6%, transparent 6%)
              `,
            }}
          >
            {/* House decorations */}
            <div className="absolute bottom-4 left-4 text-4xl">🌳</div>
            <div className="absolute bottom-4 right-4 text-3xl">🌸</div>
            <div className="absolute top-4 left-1/2 transform -translate-x-1/2 text-2xl">☀️</div>
            <div className="absolute bottom-8 left-1/3 text-2xl">🏠</div>
            <div className="absolute bottom-12 right-1/3 text-xl">🌿</div>

            {/* Animated Pets */}
            {userPets.map((pet) => {
              const config = getLevelConfig(pet.level)
              const tier = getTierFromLevel(pet.level)
              const rarity = getRarityFromLevel(pet.level)
              return (
                <div
                  key={pet.id}
                  className="absolute transition-all duration-100 ease-linear cursor-pointer group"
                  style={{
                    left: `${pet.x}%`,
                    top: `${pet.y}%`,
                    transform: pet.direction === "left" ? "scaleX(-1)" : "scaleX(1)",
                  }}
                  title={`${pet.name} - Tier ${tier} - Level ${pet.level} - ${pet.mood}`}
                >
                  <div className="relative">
                    <div className="text-3xl hover:scale-110 transition-transform">{pet.emoji}</div>
                    <div className="absolute -top-1 -right-1 text-xs">{getMoodEmoji(pet.mood)}</div>
                    <div
                      className={`absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 rounded-full ${config.color}`}
                    ></div>

                    {/* Pet info tooltip with enhanced tier display */}
                    <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-75 text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                      <div className="font-semibold">{pet.name}</div>
                      <div className="text-yellow-300 font-medium">
                        Tier {tier} - {rarity}
                      </div>
                      <div>
                        Level {pet.level} • {pet.mood}
                      </div>
                      <div>{pet.dailyROI}% daily ROI</div>
                      <div>Token ID: #{pet.tokenId}</div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Pet Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {userPets.map((pet) => {
          const currentEarnings = calculatePetCurrentEarnings(pet)
          return (
            <PetCard
              key={pet.id}
              pet={pet}
              currentEarnings={currentEarnings}
              onClaimReward={onClaimReward}
              isLoading={isLoading}
            />
          )
        })}
      </div>
    </div>
  )
} 