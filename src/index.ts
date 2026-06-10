import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

import { getTokenPriceSchema, handleGetTokenPrice } from "./tools/getTokenPrice.js";
import {
  getTrendingTokensSchema,
  handleGetTrendingTokens,
} from "./tools/getTrendingTokens.js";
import {
  getTopGainersLosersSchema,
  handleGetTopGainersLosers,
} from "./tools/getTopGainersLosers.js";
import { getProtocolTvlSchema, handleGetProtocolTvl } from "./tools/getProtocolTvl.js";
import {
  getWalletPortfolioSchema,
  handleGetWalletPortfolio,
} from "./tools/getWalletPortfolio.js";
import {
  getMarketOverviewSchema,
  handleGetMarketOverview,
} from "./tools/getMarketOverview.js";

const server = new McpServer({
  name: "pharos-defi-lens",
  version: "1.0.0",
});

server.tool(
  "get_token_price",
  "Look up real-time price, market cap, 24h volume, and price change for any cryptocurrency by name or ticker symbol. Data sourced from CoinGecko.",
  getTokenPriceSchema.shape,
  async (args) => {
    const result = await handleGetTokenPrice(getTokenPriceSchema.parse(args));
    return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
  }
);

server.tool(
  "get_trending_tokens",
  "Get the currently trending cryptocurrencies based on search popularity. Shows top trending tokens with their market cap rankings.",
  getTrendingTokensSchema.shape,
  async () => {
    const result = await handleGetTrendingTokens();
    return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
  }
);

server.tool(
  "get_top_gainers_losers",
  "Get the top gaining and losing cryptocurrencies by 24-hour price change from the top 100 coins by market cap.",
  getTopGainersLosersSchema.shape,
  async (args) => {
    const result = await handleGetTopGainersLosers(getTopGainersLosersSchema.parse(args));
    return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
  }
);

server.tool(
  "get_protocol_tvl",
  "Query DeFi protocol Total Value Locked (TVL) data. Provide a protocol name to get specific data, or leave empty to see the top 10 DeFi protocols by TVL. Data sourced from DeFiLlama.",
  getProtocolTvlSchema.shape,
  async (args) => {
    const result = await handleGetProtocolTvl(getProtocolTvlSchema.parse(args));
    return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
  }
);

server.tool(
  "get_wallet_portfolio",
  "Query a wallet's native PHAR token balance on Pharos Testnet. Provide an Ethereum-style address (0x...) to check the balance and get a link to the block explorer.",
  getWalletPortfolioSchema.shape,
  async (args) => {
    const result = await handleGetWalletPortfolio(getWalletPortfolioSchema.parse(args));
    return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
  }
);

server.tool(
  "get_market_overview",
  "Get a comprehensive overview of the entire crypto market including total market cap, 24h trading volume, BTC/ETH dominance, and market sentiment indicator.",
  getMarketOverviewSchema.shape,
  async () => {
    const result = await handleGetMarketOverview();
    return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
  }
);

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch((error) => {
  console.error("Failed to start MCP server:", error);
  process.exit(1);
});
