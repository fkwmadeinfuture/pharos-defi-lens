---
name: pharos-defi-lens
description: DeFi Price Intelligence Agent Skill — multi-source crypto market data aggregator for Pharos Network
version: 1.0.0
tags:
  - defi
  - pharos
  - price
  - blockchain
  - mcp
  - agent-skill
author: pharos-defi-lens
---

# Pharos DeFi Lens

An MCP-based Agent Skill that provides comprehensive DeFi market intelligence by aggregating data from CoinGecko, DeFiLlama, and Pharos on-chain sources.

## Capabilities

This skill enables AI agents to:

1. **Look up token prices** — Query real-time price, market cap, volume, and 24h change for any cryptocurrency
2. **Track trending tokens** — See which tokens are currently trending by search popularity
3. **Identify market movers** — Find top gainers and losers in the last 24 hours
4. **Analyze DeFi protocols** — Query TVL data for any DeFi protocol or see top protocols
5. **Check Pharos wallets** — Query native PHAR balance for any address on Pharos Testnet
6. **Monitor market conditions** — Get a global market overview with sentiment indicators

## Use Cases

- **Portfolio Research**: Help users research tokens before investing
- **Market Monitoring**: Keep track of market trends and significant price movements
- **DeFi Analysis**: Compare DeFi protocols by TVL and growth metrics
- **Wallet Tracking**: Monitor Pharos Testnet wallet balances
- **Trading Signals**: Identify trending tokens and top gainers for trading opportunities

## Integration

This skill runs as an MCP Server and can be connected to any MCP-compatible AI agent (Claude Desktop, Claude Code, or custom agents).

```bash
npx tsx src/index.ts
```
