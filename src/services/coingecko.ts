import { COINGECKO_BASE_URL, coingeckoHeaders } from "../config.js";
import type { TokenPrice, TrendingToken, MarketOverview } from "../types.js";

async function fetchCoinGecko(path: string): Promise<any> {
  const url = `${COINGECKO_BASE_URL}${path}`;
  const headers = {
    ...coingeckoHeaders(),
    "User-Agent": "pharos-defi-lens/1.0.0",
  };
  const response = await fetch(url, { headers });
  if (!response.ok) {
    throw new Error(`CoinGecko API error: ${response.status} ${response.statusText}`);
  }
  return response.json();
}

export async function getTokenPrice(query: string): Promise<TokenPrice[]> {
  const searchResult = await fetchCoinGecko(`/search?query=${encodeURIComponent(query)}`);
  const coins = searchResult.coins?.slice(0, 5) ?? [];

  if (coins.length === 0) {
    return [];
  }

  const ids = coins.map((c: any) => c.id).join(",");
  const data = await fetchCoinGecko(
    `/coins/markets?vs_currency=usd&ids=${ids}&order=market_cap_desc&sparkline=false`
  );

  return data.map((coin: any) => ({
    id: coin.id,
    symbol: coin.symbol,
    name: coin.name,
    current_price: coin.current_price,
    market_cap: coin.market_cap,
    total_volume: coin.total_volume,
    price_change_percentage_24h: coin.price_change_percentage_24h,
    market_cap_rank: coin.market_cap_rank,
  }));
}

export async function getTrendingTokens(): Promise<TrendingToken[]> {
  const data = await fetchCoinGecko("/search/trending");
  return (data.coins ?? []).map((item: any) => ({
    name: item.item.name,
    symbol: item.item.symbol,
    market_cap_rank: item.item.market_cap_rank,
    price_btc: item.item.price_btc,
    score: item.item.score,
  }));
}

export async function getTopGainers(
  duration: string = "24h"
): Promise<any[]> {
  const validDurations = ["1h", "24h", "7d", "14d", "30d", "60d", "1y"];
  const dur = validDurations.includes(duration) ? duration : "24h";

  try {
    const data = await fetchCoinGecko(
      `/coins/markets?vs_currency=usd&order=percent_change_${dur}_desc&per_page=10&page=1&sparkline=false`
    );
    return data.map((coin: any) => ({
      id: coin.id,
      symbol: coin.symbol,
      name: coin.name,
      current_price: coin.current_price,
      price_change_percentage_24h: coin.price_change_percentage_24h,
      market_cap: coin.market_cap,
      market_cap_rank: coin.market_cap_rank,
    }));
  } catch {
    const data = await fetchCoinGecko(
      `/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false`
    );
    const sorted = data.sort(
      (a: any, b: any) =>
        (b.price_change_percentage_24h ?? 0) - (a.price_change_percentage_24h ?? 0)
    );
    const gainers = sorted.slice(0, 10);
    const losers = sorted.slice(-10).reverse();
    return [...gainers, ...losers].map((coin: any) => ({
      id: coin.id,
      symbol: coin.symbol,
      name: coin.name,
      current_price: coin.current_price,
      price_change_percentage_24h: coin.price_change_percentage_24h,
      market_cap: coin.market_cap,
      market_cap_rank: coin.market_cap_rank,
    }));
  }
}

export async function getMarketOverview(): Promise<MarketOverview> {
  const data = await fetchCoinGecko("/global");
  const d = data.data;
  return {
    total_market_cap_usd: d.total_market_cap?.usd ?? 0,
    total_volume_24h_usd: d.total_volume?.usd ?? 0,
    btc_dominance: d.market_cap_percentage?.btc ?? 0,
    eth_dominance: d.market_cap_percentage?.eth ?? 0,
    active_cryptocurrencies: d.active_cryptocurrencies ?? 0,
    market_cap_change_percentage_24h: d.market_cap_change_percentage_24h_usd ?? 0,
  };
}
