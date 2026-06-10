import { z } from "zod";
import { getTopGainers } from "../services/coingecko.js";

export const getTopGainersLosersSchema = z.object({
  limit: z
    .number()
    .min(1)
    .max(20)
    .default(10)
    .describe("Number of tokens to return (max 20)"),
});

export async function handleGetTopGainersLosers(
  args: z.infer<typeof getTopGainersLosersSchema>
) {
  const data = await getTopGainers("24h");
  const limit = args.limit ?? 10;

  const sorted = data.sort(
    (a: any, b: any) =>
      (b.price_change_percentage_24h ?? 0) - (a.price_change_percentage_24h ?? 0)
  );

  const gainers = sorted
    .filter((t: any) => (t.price_change_percentage_24h ?? 0) > 0)
    .slice(0, limit);
  const losers = sorted
    .filter((t: any) => (t.price_change_percentage_24h ?? 0) < 0)
    .slice(-limit)
    .reverse();

  const format = (token: any) => ({
    name: token.name,
    symbol: token.symbol.toUpperCase(),
    price_usd: `$${token.current_price?.toLocaleString() ?? "N/A"}`,
    price_change_24h: `${token.price_change_percentage_24h?.toFixed(2) ?? "N/A"}%`,
    market_cap_rank: token.market_cap_rank ?? "N/A",
  });

  return {
    success: true,
    top_gainers: gainers.map(format),
    top_losers: losers.map(format),
    source: "CoinGecko Markets (Top 100 by Market Cap)",
  };
}
