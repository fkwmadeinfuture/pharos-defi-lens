export interface TokenPrice {
  id: string;
  symbol: string;
  name: string;
  current_price: number;
  market_cap: number;
  total_volume: number;
  price_change_percentage_24h: number;
  market_cap_rank: number;
}

export interface TrendingToken {
  name: string;
  symbol: string;
  market_cap_rank: number;
  price_btc: number;
  score: number;
}

export interface ProtocolTvl {
  name: string;
  tvl: number;
  change_1h: number;
  change_1d: number;
  change_7d: number;
  category: string;
  chains: string[];
}

export interface MarketOverview {
  total_market_cap_usd: number;
  total_volume_24h_usd: number;
  btc_dominance: number;
  eth_dominance: number;
  active_cryptocurrencies: number;
  market_cap_change_percentage_24h: number;
}

export interface WalletBalance {
  address: string;
  native_balance: string;
  native_balance_formatted: string;
  tokens: TokenBalance[];
}

export interface TokenBalance {
  symbol: string;
  name: string;
  balance: string;
  decimals: number;
}
