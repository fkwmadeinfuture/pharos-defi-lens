import { z } from "zod";
import { getTokenPrice } from "../services/coingecko.js";

export const getTokenPriceSchema = z.object({
  query: z
    .string()
    .describe("Token name or ticker symbol to search for (e.g., 'bitcoin', 'eth', 'solana')"),
});

export async function handleGetTokenPrice(args: z.infer<typeof getTokenPriceSchema>) {
  const results = await getTokenPrice(args.query);

  if (results.length === 0) {
    return {
      success: false,
      message: `No tokens found matching "${args.query}". Try a different name or ticker.`,
    };
  }

  return {
    success: true,
    query: args.query,
    results: results.map((token) => ({
      name: token.name,
      symbol: token.symbol.toUpperCase(),
      price_usd: `$${token.current_price?.toLocaleString() ?? "N/A"}`,
      price_change_24h: `${token.price_change_percentage_24h?.toFixed(2) ?? "N/A"}%`,
      market_cap: `$${token.market_cap?.toLocaleString() ?? "N/A"}`,
      volume_24h: `$${token.total_volume?.toLocaleString() ?? "N/A"}`,
      market_cap_rank: token.market_cap_rank ?? "N/A",
    })),
  };
}
