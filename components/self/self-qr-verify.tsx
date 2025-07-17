"use client";

import React, { useEffect, useMemo } from "react";
import { countries, SelfApp, SelfAppBuilder, SelfQRcodeWrapper } from "@selfxyz/qrcode";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Copy, ExternalLink, Shield, CheckCircle } from "lucide-react";
import { useState } from "react";
import { getUniversalLink } from "@selfxyz/common"

interface SelfQRVerifyProps {
  onSuccess?: () => void;
  onError?: (error: string) => void;
  className?: string;
}

export function SelfQRVerify({ onSuccess, onError, className }: SelfQRVerifyProps) {
  const [isVerified, setIsVerified] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [selfApp, setSelfApp] = useState<SelfApp | null>(null);
  const [universalLink, setUniversalLink] = useState("");
  const [userId, setUserId] = useState("0x0000000000000000000000000000000000000000");
  const excludedCountries = useMemo(() => [countries.NORTH_KOREA], []);

  useEffect(() => {
    try {
      const app = new SelfAppBuilder({
        version: 2,
        appName: process.env.NEXT_PUBLIC_SELF_APP_NAME || "Self Workshop",
        scope: process.env.NEXT_PUBLIC_SELF_SCOPE || "self-workshop",
        endpoint: `${process.env.NEXT_PUBLIC_SELF_ENDPOINT}`,
        logoBase64:
          "https://i.postimg.cc/mrmVf9hm/self.png", // url of a png image, base64 is accepted but not recommended
        userId: undefined,
        endpointType: "staging_https",
        userIdType: "hex", // use 'hex' for ethereum address or 'uuid' for uuidv4
        userDefinedData: "Hello from Memo",
        disclosures: {

        // // what you want to verify from users' identity
          minimumAge: 18,
          // ofac: false,
          // excludedCountries: [countries.BELGIUM],

        // //what you want users to reveal
          // name: false,
          // issuing_state: true,
          nationality: true,
          // date_of_birth: true,
          // passport_number: false,
          // gender: true,
          // expiry_date: false,
        }
      }).build();

      setSelfApp(app);
      setUniversalLink(getUniversalLink(app));
    } catch (error) {
      console.error("Failed to initialize Self app:", error);
    }
  }, []);

  const displayToast = (message: string) => {
    setToastMessage(message);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleSuccessfulVerification = () => {
    setIsVerified(true);
    displayToast("Identity verified successfully!");
    if (onSuccess) {
      setTimeout(() => {
        onSuccess();
      }, 1500);
    }
  };

  const handleError = () => {
    const errorMessage = "Failed to verify identity. Please try again.";
    displayToast(errorMessage);
    if (onError) {
      onError(errorMessage);
    }
  };

  const handleCopyLink = () => {
    if (!universalLink) return;

    navigator.clipboard
      .writeText(universalLink)
      .then(() => {
        setLinkCopied(true);
        displayToast("Universal link copied to clipboard!");
        setTimeout(() => setLinkCopied(false), 2000);
      })
      .catch((err) => {
        console.error("Failed to copy text: ", err);
        displayToast("Failed to copy link");
      });
  };

  const handleOpenApp = () => {
        if (!universalLink) return;

    window.open(universalLink, "_blank");
    displayToast("Opening Self App...");
  };

  // if (error) {
  //   return (
  //     <Card className={`max-w-md mx-auto ${className}`}>
  //       <CardHeader className="text-center">
  //         <CardTitle className="text-red-600">Verification Error</CardTitle>
  //         <CardDescription>{error}</CardDescription>
  //       </CardHeader>
  //     </Card>
  //   );
  // }

  return (
    <div className={`max-w-md mx-auto ${className}`}>
      <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm">
        <CardHeader className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center">
            {isVerified ? (
              <CheckCircle className="w-8 h-8 text-white" />
            ) : (
              <Shield className="w-8 h-8 text-white" />
            )}
          </div>
          <CardTitle className="text-2xl">
            {isVerified ? "Identity Verified!" : "Verify Your Identity"}
          </CardTitle>
          <CardDescription>
            {isVerified
              ? "Your identity has been successfully verified"
              : "Scan the QR code with the Self Protocol app to verify your identity and claim your MEMO"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {!isVerified && (
            <>
              {/* QR Code */}
              <div className="flex justify-center">
                { selfApp ? (
                  <SelfQRcodeWrapper
                    selfApp={selfApp}
                    onSuccess={handleSuccessfulVerification}
                    onError={handleError}
                  />
                ) : (
                  <div className="w-[256px] h-[256px] bg-gray-200 flex items-center justify-center rounded-lg">
                    <p className="text-gray-500 text-sm">Failed to load QR Code</p>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-2">
                <Button
                  onClick={handleCopyLink}
                  disabled={!universalLink}
                  variant="outline"
                  className="flex-1"
                >
                  <Copy className="w-4 h-4 mr-2" />
                  {linkCopied ? "Copied!" : "Copy Link"}
                </Button>

                <Button
                  onClick={handleOpenApp}
                  disabled={!universalLink}
                  className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Open Self App
                </Button>
              </div>
            </>
          )}

          {/* User Address */}
          <div className="space-y-2">
            <div className="flex items-center justify-center gap-2">
              <span className="text-gray-500 text-xs uppercase tracking-wide">
                {isVerified ? "Verified Address" : "User Address"}
              </span>
              {isVerified && <CheckCircle className="w-4 h-4 text-green-500" />}
            </div>
            <div className="bg-gray-100 rounded-md px-3 py-2 text-center break-all text-sm font-mono text-gray-800 border border-gray-200">
              {userId !== "0x0000000000000000000000000000000000000000" ? (
                userId
              ) : (
                <span className="text-gray-400">Not connected</span>
              )}
            </div>
          </div>

          {/* Instructions */}
          {!isVerified && (
            <div className="text-center text-sm text-gray-600 space-y-2">
              <p>Don't have the Self app?</p>
              <div className="flex justify-center gap-4">
                <a
                  href="https://apps.apple.com/app/self-protocol/id6443896588"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 underline"
                >
                  Download for iOS
                </a>
                <a
                  href="https://play.google.com/store/apps/details?id=com.selfxyz.app"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 underline"
                >
                  Download for Android
                </a>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Toast notification */}
      {showToast && (
        <div className="fixed bottom-4 right-4 bg-gray-800 text-white py-3 px-4 rounded-lg shadow-lg animate-fade-in text-sm z-50">
          {toastMessage}
        </div>
      )}
    </div>
  );
}

