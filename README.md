# MEMO Self App

A Next.js application for claiming and managing MEMO tokens with Self identity verification.

## Features

- Claim MEMO tokens using claim codes
- Self identity verification integration
- Real-time MEMO data fetching from API
- Modern UI with Tailwind CSS and shadcn/ui components

## Setup

1. **Install dependencies:**
   ```bash
   pnpm install
   ```

2. **Environment Configuration:**
   Copy `.env.example` to `.env.local` and configure your API endpoint:
   ```bash
   cp .env.example .env.local
   ```
   
   Update the following variables in `.env.local`:
   ```
   API_URL=https://your-api-endpoint.com
   NEXT_PUBLIC_SELF_SCOPE=your-self-scope
   NEXT_PUBLIC_SELF_ENDPOINT=your-self-endpoint
   ```

3. **Start the development server:**
   ```bash
   pnpm dev
   ```

## API Routes

### GET /api/code

Fetches MEMO data by claim code, replicating the functionality of the original Nuxt route.

**Query Parameters:**
- `code` (required): The claim code to fetch memo data for

**Response:**
```json
{
  "id": "string",
  "chain": "string", 
  "collection": "string",
  "name": "string",
  "description": "string",
  "image": "string",
  "mint": "string",
  "createdAt": "string",
  "expiresAt": "string"
}
```

**Error Response:**
```json
{
  "error": "Error message"
}
```

**Example Usage:**
```bash
curl "http://localhost:3000/api/code?code=YOUR_CLAIM_CODE"
```

## Architecture

- **Frontend:** Next.js 15 with React 19
- **Styling:** Tailwind CSS with shadcn/ui components
- **Identity Verification:** Self protocol integration
- **API:** Next.js API routes with TypeScript
- **State Management:** React hooks with local storage

## Key Components

- `/app/page.tsx` - Main claim page
- `/app/memo-details/page.tsx` - MEMO details and verification flow
- `/app/api/code/route.ts` - API route for fetching MEMO data
- `/lib/memo-api.ts` - Client-side API utilities
- `/lib/types.ts` - TypeScript type definitions
- `/components/self/` - Self verification components

## Development

The API route at `/api/code` replaces the original Nuxt endpoint and provides:

1. **IPFS URL handling** - Converts IPFS URLs to HTTP gateway URLs
2. **Metadata fetching** - Retrieves metadata from IPFS/HTTP sources  
3. **Error handling** - Proper HTTP status codes and error messages
4. **Type safety** - Full TypeScript support

## Testing the API

You can test the API route with a claim code:

```javascript
// Client-side usage
import { fetchMemoByCode } from '@/lib/memo-api'

try {
  const memo = await fetchMemoByCode('your-claim-code')
  console.log(memo)
} catch (error) {
  console.error('Failed to fetch memo:', error.message)
}
```

## Deployment

1. Build the application:
   ```bash
   pnpm build
   ```

2. Set environment variables in your deployment platform

3. Deploy to your preferred platform (Vercel, Netlify, etc.)
