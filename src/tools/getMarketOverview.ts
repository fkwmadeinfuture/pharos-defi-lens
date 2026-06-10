import { z } from "zod";
import { getMarketOverview } from "../services/coingecko.js";

export const getMarketOverviewSchema = z.object({});

export async function handleGetMarketOverview() {
  const overview = await getMarketOverview();

  const sentiment =
    overview.market_cap_change_percentage_24h > 2
      ? "Bullish"
      : overview.market_cap_change_percentage_24h < -2
        ? "Bearish"
        : "Neutral";

  return {
    success: true,
    market_overview: {
      total_market_cap: `$${(overview.total_market_cap_usd / 1e12).toFixed(2)}T`,
      total_volume_24h: `$${(overview.total_volume_24h_usd / 1e9).toFixed(2)}B`,
      btc_dominance: `${overview.btc_dominance.toFixed(1)}%`,
      eth_dominance: `${overview.eth_dominance.toFixed(1)}%`,
      active_cryptocurrencies: overview.active_cryptocurrencies.toLocaleString(),
      market_cap_change_24h: `${overview.market_cap_change_percentage_24h.toFixed(2)}%`,
      market_sentiment: sentiment,
    },
    source: "CoinGecko Global",
  };
}
