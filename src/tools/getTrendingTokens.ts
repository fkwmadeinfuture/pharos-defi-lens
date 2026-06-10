import { z } from "zod";
import { getTrendingTokens } from "../services/coingecko.js";

export const getTrendingTokensSchema = z.object({});

export async function handleGetTrendingTokens() {
  const tokens = await getTrendingTokens();

  return {
    success: true,
    trending_tokens: tokens.map((token, index) => ({
      rank: index + 1,
      name: token.name,
      symbol: token.symbol.toUpperCase(),
      market_cap_rank: token.market_cap_rank ?? "N/A",
      price_btc: token.price_btc,
    })),
    total: tokens.length,
    source: "CoinGecko Trending",
  };
}
