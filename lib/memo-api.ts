import type { Memo, APIError } from "./types";

/**
 * Fetches memo data by claim code
 * @param code - The claim code to fetch memo data for
 * @returns Promise that resolves to memo data or throws an error
 */
export async function fetchMemoByCode(code: string): Promise<Memo> {
  const response = await fetch(`/api/memo?code=${encodeURIComponent(code)}`);
  
  if (!response.ok) {
    const errorData: APIError = await response.json();
    throw new Error(errorData.error || `Failed to fetch memo: ${response.statusText}`);
  }
  
  return response.json();
}

/**
 * Validates if a claim code exists and returns basic info
 * @param code - The claim code to validate
 * @returns Promise that resolves to boolean indicating if the code is valid
 */
export async function validateClaimCode(code: string): Promise<boolean> {
  try {
    await fetchMemoByCode(code);
    return true;
  } catch {
    return false;
  }
}
