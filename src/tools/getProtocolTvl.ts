import { z } from "zod";
import { getProtocolTvl, getTopProtocols } from "../services/defillama.js";

export const getProtocolTvlSchema = z.object({
  protocol: z
    .string()
    .optional()
    .describe(
      "Protocol name to query (e.g., 'aave', 'uniswap', 'lido'). Leave empty to get top protocols by TVL."
    ),
});

export async function handleGetProtocolTvl(args: z.infer<typeof getProtocolTvlSchema>) {
  if (!args.protocol) {
    const topProtocols = await getTopProtocols(10);
    return {
      success: true,
      type: "top_protocols",
      protocols: topProtocols.map((p, index) => ({
        rank: index + 1,
        name: p.name,
        tvl: `$${(p.tvl / 1e9).toFixed(2)}B`,
        change_1d: `${p.change_1d?.toFixed(2) ?? "N/A"}%`,
        change_7d: `${p.change_7d?.toFixed(2) ?? "N/A"}%`,
        category: p.category,
        chains: p.chains.slice(0, 5).join(", "),
      })),
      source: "DeFiLlama",
    };
  }

  const protocol = await getProtocolTvl(args.protocol);

  if (!protocol) {
    return {
      success: false,
      message: `Protocol "${args.protocol}" not found. Try a different name (e.g., 'aave', 'uniswap', 'lido').`,
    };
  }

  return {
    success: true,
    type: "single_protocol",
    protocol: {
      name: protocol.name,
      tvl: `$${(protocol.tvl / 1e9).toFixed(2)}B`,
      change_1h: `${protocol.change_1h?.toFixed(2) ?? "N/A"}%`,
      change_1d: `${protocol.change_1d?.toFixed(2) ?? "N/A"}%`,
      change_7d: `${protocol.change_7d?.toFixed(2) ?? "N/A"}%`,
      category: protocol.category,
      chains: protocol.chains.join(", "),
    },
    source: "DeFiLlama",
  };
}
