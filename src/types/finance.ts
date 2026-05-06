export interface BullishPoint {
  title: string;
  detail: string;
}

export interface BearishPoint {
  title: string;
  detail: string;
}

export interface FinanceReport {
  id: string;
  ticker: string;
  companyName?: string;
  title: string;
  summary: string;
  bullishPoints: BullishPoint[];
  bearishPoints: BearishPoint[];
  risks: string[];
  createdAt: string;
}

export interface WatchlistTicker {
  symbol: string;
  addedAt: string;
}
