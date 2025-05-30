"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertTriangle, Wifi } from "lucide-react"

interface NetworkWarningProps {
  onSwitchNetwork: () => void
  isLoading?: boolean
}

export function NetworkWarning({ onSwitchNetwork, isLoading = false }: NetworkWarningProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="max-w-md w-full border-red-200 bg-red-50">
        <CardHeader className="text-center pb-2">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
            <AlertTriangle className="h-6 w-6 text-red-600" />
          </div>
          <CardTitle className="text-red-800">Wrong Network Detected</CardTitle>
          <CardDescription className="text-red-700">
            This dApp only works on the Sepolia Test Network
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert className="border-red-200 bg-red-50">
            <Wifi className="h-4 w-4 text-red-600" />
            <AlertTitle className="text-red-800">Network Required</AlertTitle>
            <AlertDescription className="text-red-700">
              Please switch to <strong>Sepolia Test Network</strong> to use the Gacha Pet Investment dApp.
            </AlertDescription>
          </Alert>

          <div className="space-y-2">
            <h4 className="font-semibold text-red-800">Network Details:</h4>
            <div className="text-sm text-red-700 space-y-1">
              <div>• <strong>Network Name:</strong> Sepolia Test Network</div>
              <div>• <strong>Chain ID:</strong> 11155111</div>
              <div>• <strong>Currency:</strong> ETH</div>
              <div>• <strong>Explorer:</strong> sepolia.etherscan.io</div>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <Button 
              onClick={onSwitchNetwork} 
              disabled={isLoading}
              className="w-full bg-red-600 hover:bg-red-700 text-white"
              size="lg"
            >
              {isLoading ? "Switching..." : "Switch to Sepolia Network"}
            </Button>
            
            <div className="text-center">
              <p className="text-xs text-red-600">
                MetaMask will prompt you to switch or add the network
              </p>
            </div>
          </div>

          <Alert className="border-yellow-200 bg-yellow-50">
            <AlertTriangle className="h-4 w-4 text-yellow-600" />
            <AlertDescription className="text-yellow-800 text-xs">
              <strong>Need Sepolia ETH?</strong> Get free test ETH from{" "}
              <a 
                href="https://sepoliafaucet.com/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="underline hover:no-underline"
              >
                Sepolia Faucet
              </a>
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>
  )
} 