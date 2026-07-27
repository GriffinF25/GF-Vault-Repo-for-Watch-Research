export type Confidence = "low" | "medium" | "medium-high" | "high";

export type LiquidityRating = "very slow" | "slow" | "average" | "liquid" | "very liquid";

export interface Comp {
  date: string;
  source: string;
  status: "sold" | "active";
  price: number;
  condition: string;
  notes: string;
  listing_url?: string;
  image_url?: string;
}

export interface PriceEstimate {
  id?: string;
  brand: string;
  model: string;
  reference: string;
  price_low: number;
  price_high: number;
  confidence: Confidence;
  liquidity_rating: LiquidityRating;
  comps: Comp[];
  sources: string[];
  fetched_at: string;
}

export interface CheckPriceInput {
  brand: string;
  model: string;
  reference: string;
  condition?: string;
  setCompleteness?: string;
  year?: string;
  notes?: string;
  forceRefresh?: boolean;
}

export type RootStackParamList = {
  Home: undefined;
  Result: { input: CheckPriceInput; estimate: PriceEstimate; cached: boolean; mock: boolean };
  SellToUs: { input: CheckPriceInput };
  Paywall: undefined;
};
