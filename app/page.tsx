"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Sparkles, Gift } from "lucide-react"
import { validateClaimCode } from "@/lib/memo-api"
import { WalletSelect } from "@/components/account/wallet-select"
import { ChainSelect } from "@/components/chain/chain-select"
// import { WalletSelect } from "@/components/account/wallet-select";

export default function ClaimPage() {
  const [claimCode, setClaimCode] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  const handleClaim = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!claimCode.trim()) return

    setIsLoading(true)
    setError("")

    try {
      // Validate the claim code using the new API
      const isValid = await validateClaimCode(claimCode)
      
      if (isValid) {
        // Store the claim code and redirect to details page
        localStorage.setItem("memoClaimCode", claimCode)
        router.push("/memo-details")
      } else {
        setError("Invalid claim code. Please check and try again.")
      }
    } catch (err) {
      setError("Failed to validate claim code. Please try again.")
      console.error("Claim validation error:", err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <nav className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center">
                <span className="text-white font-bold text-sm">M</span>
              </div>
              <span className="font-semibold text-lg">MEMO</span>
            </div>
            <div className="hidden md:flex items-center space-x-6">
              <a href="#" className="text-gray-600 hover:text-gray-900">
                About
              </a>
              <a href="#" className="text-gray-600 hover:text-gray-900">
                Issuers
              </a>
              <a href="#" className="text-gray-600 hover:text-gray-900">
                Collectors
              </a>
              <ChainSelect />
              <WalletSelect />
              <Button className="bg-purple-600 hover:bg-purple-700">Make a MEMO</Button>
            </div>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <h1 className="text-6xl md:text-8xl font-bold mb-8">
            <span className="bg-gradient-to-r from-purple-600 via-purple-500 to-blue-500 bg-clip-text text-transparent">
              MEMO IS FOR
            </span>
            <br />
            <span className="bg-gradient-to-r from-purple-600 via-purple-500 to-blue-500 bg-clip-text text-transparent">
              MEMORIES
            </span>
          </h1>
        </div>

        {/* Claim Form */}
        <div className="max-w-md mx-auto mb-16">
          <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm">
            <CardHeader className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center">
                <Gift className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-2xl">Claim Your MEMO</CardTitle>
              <CardDescription>Enter your claim code to receive your Memory token</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleClaim} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="claimCode">Claim Code</Label>
                  <Input
                    id="claimCode"
                    type="text"
                    placeholder="Enter your claim code"
                    value={claimCode}
                    onChange={(e) => setClaimCode(e.target.value)}
                    className="text-center text-lg font-mono"
                    required
                  />
                  {error && (
                    <p className="text-sm text-red-600 text-center">{error}</p>
                  )}
                </div>
                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                  disabled={isLoading || !claimCode.trim()}
                >
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      Claiming...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 mr-2" />
                      Claim MEMO
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Stats */}
        <div className="flex justify-center items-center space-x-8 text-center">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-5 h-5 text-purple-500" />
            <div>
              <div className="text-2xl font-bold text-gray-900">10+</div>
              <div className="text-sm text-gray-600">People love MEMO</div>
            </div>
            <Sparkles className="w-5 h-5 text-purple-500" />
          </div>
        </div>
      </main>
    </div>
  )
}
