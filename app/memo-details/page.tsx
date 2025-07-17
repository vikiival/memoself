"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Calendar, MapPin, Users, Wallet, ArrowRight, Shield } from "lucide-react"
import Image from "next/image"
import { SelfQRVerify } from "@/components/self/self-qr-verify"
import { fetchMemoByCode } from "@/lib/memo-api"
import type { Memo } from "@/lib/types"

export default function MEMODetailsPage() {
  const [claimCode, setClaimCode] = useState("")
  const [walletAddress, setWalletAddress] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [isVerified, setIsVerified] = useState(false)
  const [currentStep, setCurrentStep] = useState(1) // 1: Verification, 2: Details, 3: Complete
  const [memo, setMemo] = useState<Memo | null>(null)
  const [memoLoading, setMemoLoading] = useState(true)
  const [memoError, setMemoError] = useState("")
  const router = useRouter()

  useEffect(() => {
    setMounted(true)
    const code = localStorage.getItem("memoClaimCode")
    if (!code) {
      router.push("/")
      return
    }
    setClaimCode(code)
    
    // Fetch memo data
    const loadMemoData = async () => {
      try {
        setMemoLoading(true)
        const memoData = await fetchMemoByCode(code)
        setMemo(memoData)
      } catch (error) {
        console.error("Failed to load memo data:", error)
        setMemoError("Failed to load memo details. Please try again.")
      } finally {
        setMemoLoading(false)
      }
    }
    
    loadMemoData()
  }, [router])

  const handleClaim = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!walletAddress.trim()) return

    setIsLoading(true)

    // Simulate minting process
    await new Promise((resolve) => setTimeout(resolve, 3000))

    // Store the wallet address and redirect to success
    localStorage.setItem("memoWalletAddress", walletAddress)
    setCurrentStep(3)
    router.push("/claim-success")
  }

  const handleVerificationSuccess = () => {
    setIsVerified(true)
    setCurrentStep(2)
  }

  const handleVerificationError = (error: string) => {
    console.error("Verification error:", error)
  }

  const isValidAddress = (address: string) => {
    // Basic Ethereum address validation
    return /^0x[a-fA-F0-9]{40}$/.test(address)
  }

  if (!mounted) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <nav className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center">
                <span className="text-white font-bold text-sm">P</span>
              </div>
              <span className="font-semibold text-lg">MEMO</span>
            </div>
            <Button variant="ghost" onClick={() => router.push("/")} className="flex items-center space-x-2">
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </Button>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          {/* Progress Indicator */}
          <div className="flex items-center justify-center mb-12">
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-white text-sm font-semibold">
                  ✓
                </div>
                <span className="ml-2 text-sm text-gray-600">Code Verified</span>
              </div>
              <div className="w-12 h-0.5 bg-purple-300"></div>
              <div className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-semibold ${
                  currentStep >= 1 ? 'bg-purple-500' : 'bg-gray-300'
                }`}>
                  {isVerified ? '✓' : '1'}
                </div>
                <span className={`ml-2 text-sm ${currentStep >= 1 ? 'font-semibold text-purple-600' : 'text-gray-500'}`}>
                  Identity Verification
                </span>
              </div>
              <div className={`w-12 h-0.5 ${currentStep >= 2 ? 'bg-purple-300' : 'bg-gray-300'}`}></div>
              <div className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                  currentStep >= 2 ? 'bg-purple-500 text-white' : 'bg-gray-300 text-gray-600'
                }`}>
                  2
                </div>
                <span className={`ml-2 text-sm ${currentStep >= 2 ? 'font-semibold text-purple-600' : 'text-gray-500'}`}>
                  MEMO Details
                </span>
              </div>
              <div className={`w-12 h-0.5 ${currentStep >= 3 ? 'bg-purple-300' : 'bg-gray-300'}`}></div>
              <div className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                  currentStep >= 3 ? 'bg-green-500 text-white' : 'bg-gray-300 text-gray-600'
                }`}>
                  {currentStep >= 3 ? '✓' : '3'}
                </div>
                <span className={`ml-2 text-sm ${currentStep >= 3 ? 'font-semibold text-green-600' : 'text-gray-500'}`}>
                  Complete
                </span>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* MEMO Details Card */}
            <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm">
              <CardHeader className="text-center">
                {memoLoading ? (
                  <div className="space-y-4">
                    <div className="w-40 h-40 mx-auto bg-gray-200 rounded-full animate-pulse"></div>
                    <div className="h-6 bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-4 bg-gray-200 rounded animate-pulse w-2/3 mx-auto"></div>
                  </div>
                ) : memoError ? (
                  <div className="text-center text-red-600">
                    <p>{memoError}</p>
                  </div>
                ) : memo ? (
                  <>
                    <div className="relative w-40 h-40 mx-auto mb-4">
                      <Image
                        src={memo.image || "/placeholder.svg?height=400&width=400"}
                        alt={memo.name}
                        fill
                        className="rounded-full object-cover border-4 border-purple-200"
                      />
                      <div className="absolute -top-2 -right-2">
                        <Badge className="bg-blue-500 hover:bg-blue-600">Available</Badge>
                      </div>
                    </div>
                    <CardTitle className="text-2xl">{memo.name}</CardTitle>
                    <CardDescription>{memo.description}</CardDescription>
                  </>
                ) : null}
              </CardHeader>
              <CardContent className="space-y-4">
                {memo && !memoLoading && !memoError && (
                  <>
                    <div className="grid grid-cols-1 gap-3 text-sm">
                      <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                        <Calendar className="w-5 h-5 text-purple-500" />
                        <div>
                          <div className="font-semibold">Created</div>
                          <div className="text-gray-600">
                            {new Date(memo.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                        <MapPin className="w-5 h-5 text-purple-500" />
                        <div>
                          <div className="font-semibold">Chain</div>
                          <div className="text-gray-600 capitalize">{memo.chain}</div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                        <Users className="w-5 h-5 text-purple-500" />
                        <div>
                          <div className="font-semibold">Collection</div>
                          <div className="text-gray-600">{memo.collection}</div>
                        </div>
                      </div>
                      {memo.expiresAt && (
                        <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                          <Calendar className="w-5 h-5 text-red-500" />
                          <div>
                            <div className="font-semibold">Expires</div>
                            <div className="text-gray-600">
                              {new Date(memo.expiresAt).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </>
                )}

                <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-4">
                  <h3 className="font-semibold mb-2">Event Description</h3>
                  <p className="text-sm text-gray-600">
                    Join us for the premier Web3 conference featuring industry leaders, innovative projects, and
                    networking opportunities. This MEMO commemorates your participation in shaping the future of
                    decentralized technology.
                  </p>
                </div>

                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="text-xs text-gray-500 mb-1">Your Claim Code</div>
                  <div className="font-mono text-sm font-semibold">{claimCode}</div>
                </div>
              </CardContent>
            </Card>

            {/* Verification/Wallet Input Card */}
            {!isVerified ? (
              <div className="space-y-6">
                <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm">
                  <CardHeader className="text-center">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center">
                      <Shield className="w-8 h-8 text-white" />
                    </div>
                    <CardTitle className="text-2xl">Identity Verification Required</CardTitle>
                    <CardDescription>
                      Verify your identity to proceed with claiming your MEMO token
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
                      <h4 className="font-semibold text-amber-900 mb-2">Why verify?</h4>
                      <ul className="text-sm text-amber-800 space-y-1">
                        <li>• Prevents fraudulent claims</li>
                        <li>• Ensures fair distribution</li>
                        <li>• Complies with event policies</li>
                        <li>• Verifies minimum age requirement (18+)</li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>
                
                <SelfQRVerify 
                  onSuccess={handleVerificationSuccess}
                  onError={handleVerificationError}
                />
              </div>
            ) : (
              <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm">
                <CardHeader className="text-center">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center">
                    <Wallet className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle className="text-2xl">Enter Wallet Address</CardTitle>
                  <CardDescription>Provide your Ethereum wallet address to receive your MEMO token</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleClaim} className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="walletAddress">Ethereum Wallet Address</Label>
                      <Input
                        id="walletAddress"
                        type="text"
                        placeholder="0x..."
                        value={walletAddress}
                        onChange={(e) => setWalletAddress(e.target.value)}
                        className="font-mono text-sm"
                        required
                      />
                      {walletAddress && !isValidAddress(walletAddress) && (
                        <p className="text-sm text-red-500">Please enter a valid Ethereum address</p>
                      )}
                      {walletAddress && isValidAddress(walletAddress) && (
                        <p className="text-sm text-green-600 flex items-center">
                          <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                          Valid address format
                        </p>
                      )}
                    </div>

                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <h4 className="font-semibold text-blue-900 mb-2">Important Notes:</h4>
                      <ul className="text-sm text-blue-800 space-y-1">
                        <li>• Make sure you control this wallet address</li>
                        <li>• MEMO will be minted directly to this address</li>
                        <li>• This action cannot be undone</li>
                        <li>• Gas fees are covered by the event organizer</li>
                      </ul>
                    </div>

                    <Button
                      type="submit"
                      className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                      disabled={isLoading || !walletAddress.trim() || !isValidAddress(walletAddress)}
                    >
                      {isLoading ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                          Minting MEMO...
                        </>
                      ) : (
                        <>
                          Mint MEMO
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
