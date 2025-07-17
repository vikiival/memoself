"use client"

import type React from "react"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Upload, X, CalendarIcon, ImageIcon, Plus, Eye } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import Image from "next/image"

export default function CreateMEMOPage() {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    startDate: undefined as Date | undefined,
    endDate: undefined as Date | undefined,
    amount: "",
    secretCode: "",
  })

  const [uploadedImage, setUploadedImage] = useState<string | null>(null)
  const [isDragOver, setIsDragOver] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleInputChange = (field: string, value: string | Date | undefined) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)

    const files = Array.from(e.dataTransfer.files)
    const imageFile = files.find((file) => file.type.startsWith("image/"))

    if (imageFile) {
      handleImageUpload(imageFile)
    }
  }

  const handleImageUpload = (file: File) => {
    if (file.size > 5 * 1024 * 1024) {
      // 5MB limit
      setErrors((prev) => ({ ...prev, image: "Image size must be less than 5MB" }))
      return
    }

    const reader = new FileReader()
    reader.onload = (e) => {
      setUploadedImage(e.target?.result as string)
      setErrors((prev) => ({ ...prev, image: "" }))
    }
    reader.readAsDataURL(file)
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleImageUpload(file)
    }
  }

  const removeImage = () => {
    setUploadedImage(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) newErrors.name = "Name is required"
    if (!formData.description.trim()) newErrors.description = "Description is required"
    if (!formData.startDate) newErrors.startDate = "Start date is required"
    if (!formData.endDate) newErrors.endDate = "End date is required"
    if (!formData.amount || Number.parseInt(formData.amount) < 1) newErrors.amount = "Amount must be at least 1"
    if (!formData.secretCode.trim()) newErrors.secretCode = "Secret code is required"
    if (!uploadedImage) newErrors.image = "Image is required"

    if (formData.startDate && formData.endDate && formData.startDate >= formData.endDate) {
      newErrors.endDate = "End date must be after start date"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsLoading(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // In a real app, you would send the data to your backend
    console.log("Creating MEMO with data:", formData, uploadedImage)

    setIsLoading(false)

    // Redirect to success or preview page
    router.push("/")
  }

  const handlePreview = () => {
    if (!validateForm()) return
    // In a real app, you might open a modal or navigate to a preview page
    alert("Preview functionality would show how the MEMO will look to claimers")
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
            <Button variant="ghost" onClick={() => router.push("/")} className="flex items-center space-x-2">
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Home</span>
            </Button>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Create New MEMO</h1>
            <p className="text-xl text-gray-600">Design a memorable token for your event attendees</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid md:grid-cols-2 gap-8">
              {/* Image Upload Section */}
              <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <ImageIcon className="w-5 h-5" />
                    <span>MEMO Image</span>
                  </CardTitle>
                  <CardDescription>Upload an image that represents your event</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {!uploadedImage ? (
                      <div
                        className={cn(
                          "border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer",
                          isDragOver
                            ? "border-purple-500 bg-purple-50"
                            : "border-gray-300 hover:border-purple-400 hover:bg-purple-50/50",
                          errors.image && "border-red-500 bg-red-50",
                        )}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                        <p className="text-lg font-semibold text-gray-700 mb-2">
                          Drop your image here, or click to browse
                        </p>
                        <p className="text-sm text-gray-500">Supports PNG, JPG, GIF up to 5MB</p>
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          onChange={handleFileSelect}
                          className="hidden"
                        />
                      </div>
                    ) : (
                      <div className="relative">
                        <div className="relative w-full h-64 rounded-lg overflow-hidden">
                          <Image
                            src={uploadedImage || "/placeholder.svg"}
                            alt="Uploaded MEMO image"
                            fill
                            className="object-cover"
                          />
                        </div>
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          className="absolute top-2 right-2"
                          onClick={removeImage}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    )}
                    {errors.image && <p className="text-sm text-red-500">{errors.image}</p>}
                  </div>
                </CardContent>
              </Card>

              {/* Form Fields Section */}
              <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle>Event Details</CardTitle>
                  <CardDescription>Provide information about your event</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Name Field */}
                  <div className="space-y-2">
                    <Label htmlFor="name">Event Name *</Label>
                    <Input
                      id="name"
                      type="text"
                      placeholder="e.g., Web3 Conference 2024"
                      value={formData.name}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                      className={errors.name ? "border-red-500" : ""}
                    />
                    {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
                  </div>

                  {/* Description Field */}
                  <div className="space-y-2">
                    <Label htmlFor="description">Description *</Label>
                    <Textarea
                      id="description"
                      placeholder="Describe your event and what this MEMO represents..."
                      value={formData.description}
                      onChange={(e) => handleInputChange("description", e.target.value)}
                      className={cn("min-h-[100px]", errors.description && "border-red-500")}
                    />
                    {errors.description && <p className="text-sm text-red-500">{errors.description}</p>}
                  </div>

                  {/* Date Fields */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Start Date *</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !formData.startDate && "text-muted-foreground",
                              errors.startDate && "border-red-500",
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {formData.startDate ? format(formData.startDate, "PPP") : "Pick a date"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={formData.startDate}
                            onSelect={(date) => handleInputChange("startDate", date)}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      {errors.startDate && <p className="text-sm text-red-500">{errors.startDate}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label>End Date *</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !formData.endDate && "text-muted-foreground",
                              errors.endDate && "border-red-500",
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {formData.endDate ? format(formData.endDate, "PPP") : "Pick a date"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={formData.endDate}
                            onSelect={(date) => handleInputChange("endDate", date)}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      {errors.endDate && <p className="text-sm text-red-500">{errors.endDate}</p>}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Bottom Section */}
            <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>MEMO Configuration</CardTitle>
                <CardDescription>Set up the claiming parameters for your MEMO</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Amount Field */}
                  <div className="space-y-2">
                    <Label htmlFor="amount">Number of MEMOs *</Label>
                    <Input
                      id="amount"
                      type="number"
                      min="1"
                      placeholder="e.g., 1000"
                      value={formData.amount}
                      onChange={(e) => handleInputChange("amount", e.target.value)}
                      className={errors.amount ? "border-red-500" : ""}
                    />
                    {errors.amount && <p className="text-sm text-red-500">{errors.amount}</p>}
                    <p className="text-sm text-gray-500">Total number of MEMOs that can be claimed</p>
                  </div>

                  {/* Secret Code Field */}
                  <div className="space-y-2">
                    <Label htmlFor="secretCode">Secret Claim Code *</Label>
                    <Input
                      id="secretCode"
                      type="text"
                      placeholder="e.g., WEB3CONF2024"
                      value={formData.secretCode}
                      onChange={(e) => handleInputChange("secretCode", e.target.value)}
                      className={cn("font-mono", errors.secretCode && "border-red-500")}
                    />
                    {errors.secretCode && <p className="text-sm text-red-500">{errors.secretCode}</p>}
                    <p className="text-sm text-gray-500">Attendees will use this code to claim their MEMO</p>
                  </div>
                </div>

                {/* Summary */}
                {formData.name && formData.amount && (
                  <div className="mt-6 p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg">
                    <h4 className="font-semibold mb-2">Summary</h4>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="secondary">{formData.name}</Badge>
                      <Badge variant="secondary">{formData.amount} MEMOs</Badge>
                      {formData.startDate && (
                        <Badge variant="secondary">Starts {format(formData.startDate, "MMM dd")}</Badge>
                      )}
                      {formData.endDate && <Badge variant="secondary">Ends {format(formData.endDate, "MMM dd")}</Badge>}
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex space-x-4 mt-8">
                  <Button type="button" variant="outline" onClick={handlePreview} className="flex-1 bg-transparent">
                    <Eye className="w-4 h-4 mr-2" />
                    Preview
                  </Button>
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                  >
                    {isLoading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                        Creating...
                      </>
                    ) : (
                      <>
                        <Plus className="w-4 h-4 mr-2" />
                        Create MEMO
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </form>
        </div>
      </main>
    </div>
  )
}
