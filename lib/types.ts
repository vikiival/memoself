// API Response Types
export type MemoDTO = {
  id: string;
  chain: string;
  collection: string;
  name: string;
  image: string;
  mint: string;
  created_at: string;
  expires_at: string;
};

export type Metadata = {
  name: string;
  image: string;
  banner: string;
  kind: string;
  description: string;
  external_url: string;
  type: string;
};

export type Memo = {
  id: string;
  chain: string;
  collection: string;
  name: string;
  description: string;
  image: string;
  mint: string;
  createdAt: string;
  expiresAt: string;
};

// API Error Response
export type APIError = {
  error: string;
};
