"use client";

import { useState, useEffect, useMemo } from "react";
import { countries, getUniversalLink } from "@selfxyz/core";
import { SelfAppBuilder, type SelfApp } from "@selfxyz/qrcode";

interface UseSelfOptions {
  appName?: string;
  scope?: string;
  endpoint?: string;
  logoBase64?: string;
  userDefinedData?: string;
  disclosures?: {
    minimumAge?: number;
    ofac?: boolean;
    excludedCountries?: any[];
    name?: boolean;
    issuing_state?: boolean;
    nationality?: boolean;
    date_of_birth?: boolean;
    passport_number?: boolean;
    gender?: boolean;
    expiry_date?: boolean;
  };
}

interface UseSelfReturn {
  selfApp: SelfApp | null;
  universalLink: string;
  userId: string;
  setUserId: (userId: string) => void;
  isLoading: boolean;
  error: string | null;
  copyToClipboard: () => Promise<void>;
  openSelfApp: () => void;
  linkCopied: boolean;
}

export function useSelf(options: UseSelfOptions = {}): UseSelfReturn {
  const [selfApp, setSelfApp] = useState<SelfApp | null>(null);
  const [universalLink, setUniversalLink] = useState("");
  const [userId, setUserId] = useState("0x0000000000000000000000000000000000000000");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [linkCopied, setLinkCopied] = useState(false);

  // Default options
  const defaultOptions: UseSelfOptions = {
    appName: "MEMO Identity Verification",
    scope: "memo-verification",
    endpoint: process.env.NEXT_PUBLIC_SELF_ENDPOINT || "https://api.self.inc",
    logoBase64: "https://i.postimg.cc/mrmVf9hm/self.png",
    userDefinedData: "MEMO Protocol Verification",
    disclosures: {
      minimumAge: 18,
      ofac: false,
      excludedCountries: [countries.NORTH_KOREA],
      nationality: true,
      gender: true,
    },
  };

  const finalOptions = { ...defaultOptions, ...options };

  // Use useMemo to cache the excluded countries array
  const excludedCountries = useMemo(() => 
    finalOptions.disclosures?.excludedCountries || [], 
    [finalOptions.disclosures?.excludedCountries]
  );

  // Initialize Self app
  useEffect(() => {
    setIsLoading(true);
    setError(null);

    try {
      const app = new SelfAppBuilder({
        version: 2,
        appName: finalOptions.appName!,
        scope: finalOptions.scope!,
        endpoint: finalOptions.endpoint!,
        logoBase64: finalOptions.logoBase64!,
        userId: userId,
        endpointType: "staging_https",
        userIdType: "hex", // use 'hex' for ethereum address or 'uuid' for uuidv4
        userDefinedData: finalOptions.userDefinedData!,
        disclosures: {
          minimumAge: finalOptions.disclosures?.minimumAge || 18,
          ofac: finalOptions.disclosures?.ofac || false,
          excludedCountries: excludedCountries,
          name: finalOptions.disclosures?.name || false,
          issuing_state: finalOptions.disclosures?.issuing_state || false,
          nationality: finalOptions.disclosures?.nationality || true,
          date_of_birth: finalOptions.disclosures?.date_of_birth || false,
          passport_number: finalOptions.disclosures?.passport_number || false,
          gender: finalOptions.disclosures?.gender || true,
          expiry_date: finalOptions.disclosures?.expiry_date || false,
        }
      }).build();

      setSelfApp(app);
      setUniversalLink(getUniversalLink(app));
      setIsLoading(false);
    } catch (err) {
      console.error("Failed to initialize Self app:", err);
      setError(err instanceof Error ? err.message : "Failed to initialize Self app");
      setIsLoading(false);
    }
  }, [userId, excludedCountries, finalOptions]);

  const copyToClipboard = async (): Promise<void> => {
    if (!universalLink) return;

    try {
      await navigator.clipboard.writeText(universalLink);
      setLinkCopied(true);
      setTimeout(() => setLinkCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
      throw new Error("Failed to copy link");
    }
  };

  const openSelfApp = (): void => {
    if (!universalLink) return;
    window.open(universalLink, "_blank");
  };

  return {
    selfApp,
    universalLink,
    userId,
    setUserId,
    isLoading,
    error,
    copyToClipboard,
    openSelfApp,
    linkCopied,
  };
}
