
import { $purify as purify, $obtain as obtain } from "@kodadot1/minipfs";
import { NextRequest, NextResponse } from "next/server";
import type { MemoDTO, Metadata, Memo } from "@/lib/types";


export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');

    if (!code) {
      return NextResponse.json(
        { error: "Code parameter is required" },
        { status: 400 }
      );
    }

    // Get API URL from environment variable
    const apiUrl = process.env.API_URL;
    if (!apiUrl) {
      return NextResponse.json(
        { error: "API URL not configured" },
        { status: 500 }
      );
    }

    // Fetch raw data from the API
    let rawData: MemoDTO;
    try {
      const response = await fetch(`${apiUrl}/poaps/${code}`);
      if (!response.ok) {
        if (response.status === 404) {
          return NextResponse.json(
            { error: "Memo not found" },
            { status: 404 }
          );
        }
        throw new Error(`API request failed: ${response.statusText}`);
      }
      rawData = await response.json();
    } catch (error) {
      console.error('Error fetching memo data:', error);
      return NextResponse.json(
        { error: "An unknown error has occurred" },
        { status: 500 }
      );
    }

    if (!rawData || !rawData.id) {
      return NextResponse.json(
        { error: "Memo not found" },
        { status: 404 }
      );
    }

    // Purify the image URL
    const imageUrls = purify(rawData.image);
    const image = imageUrls[0];
    if (!image) {
      return NextResponse.json(
        { error: "Image not found" },
        { status: 500 }
      );
    }

    // Fetch metadata
    const meta = await obtain<Metadata>(rawData.mint);
    if (!meta) {
      return NextResponse.json(
        { error: "Metadata not found" },
        { status: 500 }
      );
    }

    // Construct the memo object
    const memo: Memo = {
      id: rawData.id,
      chain: rawData.chain,
      collection: rawData.collection,
      name: rawData.name,
      description: meta.description,
      image,
      mint: rawData.mint,
      createdAt: rawData.created_at,
      expiresAt: rawData.expires_at,
    };

    return NextResponse.json(memo);
  } catch (error) {
    console.error('Unexpected error in /api/code:', error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
