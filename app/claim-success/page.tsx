"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Download, Share2, ArrowLeft, Calendar, MapPin } from "lucide-react"
import Image from "next/image"

export default function ClaimSuccessPage() {
  const [claimCode, setClaimCode] = useState("")
  const [walletAddress, setWalletAddress] = useState("")
  const [mounted, setMounted] = useState(false)
  const router = useRouter()

  useEffect(() => {
    setMounted(true)
    const code = localStorage.getItem("memoClaimCode")
    const address = localStorage.getItem("memoWalletAddress")
    if (!code || !address) {
      router.push("/")
      return
    }
    setClaimCode(code)
    setWalletAddress(address)
  }, [router])

  if (!mounted) {
    return null
  }

  const handleDownload = () => {
    // Simulate download
    const link = document.createElement("a")
    link.href = "/placeholder.svg?height=400&width=400"
    link.download = "my-poap.png"
    link.click()
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "I just claimed my MEMO!",
          text: "Check out my new MEMO token - a digital collectible that proves I was there!",
          url: window.location.origin,
        })
      } catch (err) {
        console.log("Error sharing:", err)
      }
    } else {
      // Fallback for browsers that don't support Web Share API
      navigator.clipboard.writeText(window.location.origin)
      alert("Link copied to clipboard!")
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
                <span className="text-white font-bold text-sm">P</span>
              </div>
              <span className="font-semibold text-lg">MEMO</span>
            </div>
            <Button variant="ghost" onClick={() => router.push("/")} className="flex items-center space-x-2">
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Claim</span>
            </Button>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto">
          {/* Success Message */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-green-100 flex items-center justify-center">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Congratulations! 🎉</h1>
            <p className="text-xl text-gray-600">You've successfully claimed your MEMO token</p>
          </div>

          {/* POAP Card */}
          <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm mb-8">
            <CardHeader className="text-center">
              <div className="relative w-48 h-48 mx-auto mb-4">
                <Image
                  src="/placeholder.svg?height=400&width=400"
                  alt="MEMO Token"
                  fill
                  className="rounded-full object-cover border-4 border-purple-200"
                />
                <div className="absolute -top-2 -right-2">
                  <Badge className="bg-green-500 hover:bg-green-600">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Claimed
                  </Badge>
                </div>
              </div>
              <CardTitle className="text-2xl">Web3 Conference 2024</CardTitle>
              <CardDescription className="text-lg">Memory Protocol</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4 text-gray-500" />
                  <span>January 15, 2024</span>
                </div>
                <div className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4 text-gray-500" />
                  <span>San Francisco, CA</span>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <div className="text-sm text-gray-600 mb-1">Claim Code</div>
                <div className="font-mono text-lg font-semibold mb-3">{claimCode}</div>
                <div className="text-sm text-gray-600 mb-1">Minted to Wallet</div>
                <div className="font-mono text-sm font-semibold break-all">{walletAddress}</div>
              </div>

              <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-4">
                <h3 className="font-semibold mb-2">About this MEMO</h3>
                <p className="text-sm text-gray-600">
                  This MEMO commemorates your attendance at the Web3 Conference 2024. It's a digital collectible that
                  proves you were part of this historic event in the blockchain and decentralized technology space.
                </p>
              </div>

              <div className="flex space-x-3">
                <Button
                  onClick={handleDownload}
                  className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>
                <Button onClick={handleShare} variant="outline" className="flex-1 bg-transparent">
                  <Share2 className="w-4 h-4 mr-2" />
                  Share
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Additional Info */}
          <div className="text-center text-sm text-gray-600">
            <p>
              Your MEMO has been added to your wallet. You can view all your MEMOs at{" "}
              <a href="#" className="text-purple-600 hover:underline">
                app.memo.xyz
              </a>
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}
