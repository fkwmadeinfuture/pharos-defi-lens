# Pharos DeFi Lens

> A DeFi Price Intelligence Agent Skill for the Pharos Network — powered by MCP (Model Context Protocol)

Pharos DeFi Lens is an MCP Server that provides AI agents with comprehensive DeFi market intelligence. It aggregates data from multiple sources (CoinGecko, DeFiLlama, and Pharos on-chain data) into a unified set of tools that any MCP-compatible AI agent can use.

## Features

| Tool | Description | Data Source |
|------|-------------|-------------|
| `get_token_price` | Real-time token price lookup by name/ticker | CoinGecko |
| `get_trending_tokens` | Currently trending cryptocurrencies | CoinGecko |
| `get_top_gainers_losers` | Top gaining/losing tokens (24h) | CoinGecko |
| `get_protocol_tvl` | DeFi protocol TVL data | DeFiLlama |
| `get_wallet_portfolio` | Pharos Testnet wallet balance query | Pharos RPC |
| `get_market_overview` | Global crypto market overview | CoinGecko |

## Architecture

```
┌─────────────────────────────────────────┐
│           AI Agent (Any LLM)            │
│  "What's the price of Bitcoin?"         │
└──────────────┬──────────────────────────┘
               │ MCP Protocol (stdio)
┌──────────────▼──────────────────────────┐
│        Pharos DeFi Lens                 │
│        (MCP Server)                     │
│                                         │
│  ┌─────────┐ ┌──────────┐ ┌─────────┐  │
│  │CoinGecko│ │DeFiLlama │ │ Pharos  │  │
│  │ Service │ │ Service  │ │  RPC    │  │
│  └────┬────┘ └────┬─────┘ └────┬────┘  │
└───────┼───────────┼────────────┼────────┘
        │           │            │
   CoinGecko   DeFiLlama    Pharos
     API          API       Testnet
```

## Quick Start

### Prerequisites

- Node.js >= 20.0.0
- npm

### Installation

```bash
git clone https://github.com/YOUR_USERNAME/pharos-defi-lens.git
cd pharos-defi-lens
npm install
```

### Configuration

```bash
cp .env.example .env
# Edit .env if you have a CoinGecko Pro API key (optional)
```

### Run

```bash
npx tsx src/index.ts
```

### Use with Claude Desktop

Add to your Claude Desktop config (`~/Library/Application Support/Claude/claude_desktop_config.json` on macOS):

```json
{
  "mcpServers": {
    "pharos-defi-lens": {
      "command": "npx",
      "args": ["tsx", "/FULL/PATH/TO/pharos-defi-lens/src/index.ts"],
      "env": {
        "PHAROS_RPC_URL": "https://atlantic.dplabs-internal.com"
      }
    }
  }
}
```

### Use with Claude Code

```bash
claude mcp add pharos-defi-lens npx tsx /FULL/PATH/TO/pharos-defi-lens/src/index.ts
```

## Example Queries

Once connected to an AI agent, you can ask natural language questions like:

- "What's the current price of Ethereum?"
- "Show me the trending tokens right now"
- "Which coins gained the most in the last 24 hours?"
- "What's the TVL of Aave?"
- "Check the balance of wallet 0x1234...abcd on Pharos"
- "Give me a market overview"

## Tech Stack

- **TypeScript** — Type-safe codebase
- **MCP SDK** (`@modelcontextprotocol/sdk`) — Standard AI agent tool protocol
- **viem** — Pharos blockchain interaction
- **zod** — Input validation

## Data Sources

- **[CoinGecko](https://www.coingecko.com/)** — Token prices, trending data, market overview
- **[DeFiLlama](https://defillama.com/)** — DeFi protocol TVL data
- **[Pharos Testnet](https://testnet.pharosscan.xyz/)** — On-chain wallet balances

## Security

This skill is designed with security in mind:

- **Read-only operations only** — No private keys required, no transactions signed
- **No file system access** — Does not read or write any files
- **No shell execution** — Does not execute any shell commands
- **No sensitive data collection** — Only queries public blockchain and API data
- **Input validation** — All inputs validated with Zod schemas

## License

MIT
