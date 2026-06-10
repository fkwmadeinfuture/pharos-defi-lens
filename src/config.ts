import { defineChain } from "viem";

export const pharosTestnet = defineChain({
  id: 688689,
  name: "Pharos Atlantic Testnet",
  nativeCurrency: {
    name: "PHAR",
    symbol: "PHAR",
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: [process.env.PHAROS_RPC_URL || "https://atlantic.dplabs-internal.com"],
    },
  },
  blockExplorers: {
    default: {
      name: "PharosScan",
      url: "https://atlantic.pharosscan.xyz",
    },
  },
});

export const COINGECKO_BASE_URL = process.env.COINGECKO_API_KEY
  ? "https://pro-api.coingecko.com/api/v3"
  : "https://api.coingecko.com/api/v3";

export const DEFILLAMA_BASE_URL = "https://api.llama.fi";

export function coingeckoHeaders(): Record<string, string> {
  const headers: Record<string, string> = {
    accept: "application/json",
  };
  if (process.env.COINGECKO_API_KEY) {
    headers["x-cg-pro-api-key"] = process.env.COINGECKO_API_KEY;
  }
  return headers;
}
