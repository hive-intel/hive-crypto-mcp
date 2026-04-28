<div align="center">

# Hive Intelligence

**Institutional-grade crypto market infrastructure for AI agents.**

One MCP server. [376+ live tools](https://mcp.hiveintelligence.xyz/api/v1/tools). 10 categories. 9 data providers — [CoinGecko, DefiLlama, Moralis, GoldRush, Codex, GoPlus, Helius, Tenderly, and CCXT](#powered-by) normalized into a single agent-ready surface, so your agent gets prices, DeFi, wallets, security, and DEX flows in one request instead of nine APIs. Built for Claude, Cursor, ChatGPT, and any agent that speaks Model Context Protocol.

[![npm version](https://img.shields.io/npm/v/hive-intelligence.svg?color=blue&label=npm)](https://www.npmjs.com/package/hive-intelligence)
[![npm downloads](https://img.shields.io/npm/dw/hive-intelligence.svg?color=blue&label=downloads%2Fweek)](https://www.npmjs.com/package/hive-intelligence)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![MCP](https://img.shields.io/badge/MCP-compatible-orange.svg)](https://modelcontextprotocol.io)
[![Docs](https://img.shields.io/badge/docs-hiveintelligence.xyz-purple.svg)](https://hiveintelligence.xyz)

[**Quick Start**](#quickstart) · [**Example prompts**](#example-prompts) · [**Tool catalog**](#tool-catalog) · [**FAQ**](#faq) · [**Get an API key**](https://hiveintelligence.xyz/dashboard/keys)

</div>

> ⚡ **New here?** [Try the Free Demo](https://hiveintelligence.xyz/dashboard/keys) (10K credits/month, no card required) · [See install guides](https://hiveintelligence.xyz/install) · [Run a test prompt](#example-prompts)

---

## What is Hive Intelligence?

Hive Intelligence is a managed MCP server that gives AI agents structured, runtime access to live cryptocurrency market data, DeFi activity, wallet positions, token security signals, DEX flows, NFT analytics, prediction markets, and on-chain network data. One API key, one tool surface, nine upstream providers normalized into a single agent-ready schema.

Stop stitching CoinGecko + DefiLlama + Moralis + GoPlus + half a dozen others. Point your agent at Hive once, get every crypto answer it needs.

**Used by:** AI agents in Claude Desktop, Cursor, ChatGPT Desktop, Claude Code, Windsurf, VS Code (Copilot Chat), Gemini CLI, and any client that speaks MCP or REST.

## Powered by

Nine production data providers, normalized into one tool surface:

```
CoinGecko · DefiLlama · Moralis · GoldRush · Codex · GoPlus · Helius · Tenderly · CCXT
```

| Provider | Coverage |
|----------|----------|
| **CoinGecko** | Market data, prices, OHLCV, exchanges, NFT collections |
| **DefiLlama** | TVL, yield pools, protocol metrics, bridges, treasuries |
| **Moralis** | Wallet analytics, NFT data, token transfers, EVM coverage |
| **GoldRush** (Covalent) | Multi-chain wallet activity, transaction history, 100+ chains |
| **Codex** (Defined.fi) | DEX pair OHLCV, prediction markets (Polymarket) |
| **GoPlus** | Token security, honeypot detection, contract risk, malicious-address reputation |
| **Helius** | Solana RPC, DAS, compressed NFTs, priority fees |
| **Tenderly** | EVM transaction simulation, contract decode, debugging |
| **CCXT** | Centralized exchange data, order books, derivatives, funding rates |

## Quickstart

The fastest way to use Hive is `npx`. No install required.

```bash
HIVE_API_KEY=hive_live_... npx -y -p hive-intelligence hive market price --ids bitcoin --vs usd
```

Get an API key at [hiveintelligence.xyz/dashboard/keys](https://hiveintelligence.xyz/dashboard/keys). The free **Demo** plan ships with 10,000 monthly credits and access to every tool — no credit card required.

### What you get

```
hive-intelligence    →  MCP stdio server. Plug into Claude Desktop, Cursor, VS Code, etc.
hive                  →  CLI. Run any tool from your terminal or scripts.
```

`hive-intelligence` is a stdio transport. Running it directly opens a JSON-RPC channel and waits for an MCP client. It is **not** an interactive command. For terminal use, use the `hive` CLI.

### Install globally (optional)

```bash
npm install -g hive-intelligence
```

After this, both `hive-intelligence` and `hive` are on your `PATH`.

## Connect to your AI client

Drop Hive into any MCP-compatible client. Replace `hive_live_...` with your API key.

### Claude Desktop

`~/Library/Application Support/Claude/claude_desktop_config.json` (macOS) or `%APPDATA%\Claude\claude_desktop_config.json` (Windows):

```json
{
  "mcpServers": {
    "hive": {
      "command": "npx",
      "args": ["-y", "hive-intelligence"],
      "env": { "HIVE_API_KEY": "hive_live_..." }
    }
  }
}
```

### Cursor

`~/.cursor/mcp.json` (global) or `.cursor/mcp.json` (project):

```json
{
  "mcpServers": {
    "hive": {
      "command": "npx",
      "args": ["-y", "hive-intelligence"],
      "env": { "HIVE_API_KEY": "hive_live_..." }
    }
  }
}
```

### VS Code (GitHub Copilot Chat)

`.vscode/mcp.json`:

```json
{
  "servers": {
    "hive": {
      "type": "stdio",
      "command": "npx",
      "args": ["-y", "hive-intelligence"],
      "env": { "HIVE_API_KEY": "hive_live_..." }
    }
  }
}
```

### Claude Code

```bash
claude mcp add hive -e HIVE_API_KEY=hive_live_... -- npx -y hive-intelligence
```

### Windsurf

`~/.codeium/windsurf/mcp_config.json`:

```json
{
  "mcpServers": {
    "hive": {
      "command": "npx",
      "args": ["-y", "hive-intelligence"],
      "env": { "HIVE_API_KEY": "hive_live_..." }
    }
  }
}
```

### Gemini CLI

`~/.gemini/settings.json`:

```json
{
  "mcpServers": {
    "hive": {
      "command": "npx",
      "args": ["-y", "hive-intelligence"],
      "env": { "HIVE_API_KEY": "hive_live_..." }
    }
  }
}
```

### Remote MCP (HTTP)

For clients that support Streamable HTTP transport (skips the local Node process entirely):

```
URL:     https://mcp.hiveintelligence.xyz/mcp
Headers: Authorization: Bearer hive_live_...
```

Full setup guides: [hiveintelligence.xyz/install](https://hiveintelligence.xyz/install)

## Example prompts

Once Hive is connected, talk to your AI client in plain English. Every prompt below maps to a real tool call you don't have to write.

**Market data**

```
What's the price of BTC, ETH, and SOL right now in USD?
Show me the top 10 coins by market cap with 24h change.
What's the OHLCV for ETH/USD over the last 30 days?
Which coins gained the most this week?
What are the current funding rates for BTC perps across exchanges?
```

**DeFi**

```
What's the current TVL of Aave?
List the top 20 yield pools above 10% APY on Ethereum.
Compare Uniswap and PancakeSwap fee revenue this month.
Show me protocol TVL rankings for Solana.
Which bridges have the highest weekly volume?
```

**Wallets and portfolios**

```
Show me the portfolio of vitalik.eth across all chains.
What tokens does this wallet hold? 0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045
Show DeFi positions for this address on Arbitrum.
What was this wallet's PnL over the last 30 days?
List recent NFT trades from this wallet.
```

**Token security**

```
Is this token a honeypot? 0x...
Run a rugpull check on $PEPE.
Show me the top holders of this token and how concentrated they are.
What approvals does this wallet have? Are any risky?
Simulate this transaction before I sign it: <tx hash or calldata>
```

**On-chain DEX**

```
What are the trending pairs on Uniswap V3 right now?
Show me top trades on Solana DEXes in the last hour.
What's the liquidity profile of this pool? <pool address>
Find pairs that whales are accumulating today.
```

**NFT analytics**

```
What's the floor price of CryptoPunks? Show 24h trend.
Compare Bored Apes and Pudgy Penguins on volume.
Show me the trait floor for this collection.
List recent compressed NFT mints on Solana.
```

**Prediction markets**

```
What are the most-traded events on Polymarket this week?
Show me the top traders on Polymarket by P&L.
What's the implied probability of this market right now?
Trace this trader's position history.
```

**Network infrastructure**

```
What are current gas prices on Ethereum, Arbitrum, and Base?
Show me Solana priority fees right now.
List supported chains and their RPC status.
```

## Tool catalog

376+ tools across 10 categories. Every tool is callable directly via `hive tools call <name>` or through the MCP `tools/call` method.

| # | Category | Tools | What's inside |
|---|----------|-------|---------------|
| 1 | **Market Data and Price** | 70+ | Prices, OHLCV, market caps, derivatives, funding rates, stablecoins, gainers/losers, exchange tickers |
| 2 | **On-Chain DEX & Pool Analytics** | 58+ | DEX pools, liquidity, trending pairs, swap history, bridges, GoldRush XY=K analytics |
| 3 | **Portfolio & Wallet** | 49+ | Balances, PnL, DeFi positions, swap history, NFT holdings, multi-chain history |
| 4 | **Token & Contract Data** | 44+ | Token metadata, holders, top traders, ENS resolution, treasury tracking, transfers |
| 5 | **DeFi Protocol Analytics** | 21+ | TVL, fees, yield farming, chain metrics, treasuries, emissions |
| 6 | **NFT Analytics** | 41+ | Collection data, floors, market charts, NFT pools, trait metadata, sales |
| 7 | **Security & Risk Analysis** | 37+ | Honeypot detection, rugpull checks, approval risk, Tenderly simulation, gas estimation |
| 8 | **Network & Infrastructure** | 20+ | Chain health, blocks, gas prices, supported networks, event logs |
| 9 | **Search & Discovery** | 10+ | Cross-provider search, trending coins, categories, token discovery |
| 10 | **Prediction Markets** | 19+ | Polymarket events, traders, outcome prices, trade history, market stats |

Live category endpoints (for clients that want a smaller scoped tool surface):

```
https://mcp.hiveintelligence.xyz/hive_market_data/mcp
https://mcp.hiveintelligence.xyz/hive_onchain_dex/mcp
https://mcp.hiveintelligence.xyz/hive_portfolio_wallet/mcp
https://mcp.hiveintelligence.xyz/hive_token_contract/mcp
https://mcp.hiveintelligence.xyz/hive_defi_protocol/mcp
https://mcp.hiveintelligence.xyz/hive_nft_analytics/mcp
https://mcp.hiveintelligence.xyz/hive_security_risk/mcp
https://mcp.hiveintelligence.xyz/hive_network_infrastructure/mcp
https://mcp.hiveintelligence.xyz/hive_search_discovery/mcp
https://mcp.hiveintelligence.xyz/hive_prediction_markets/mcp
```

Full live tool list: `https://mcp.hiveintelligence.xyz/api/v1/tools` (requires API key) or [hiveintelligence.xyz/tools/live-catalog](https://hiveintelligence.xyz/tools/live-catalog).

## Why Hive over a single-provider MCP?

| | Hive | CoinGecko MCP | Moralis MCP | DefiLlama MCP | GoPlus only |
|---|---|---|---|---|---|
| Providers normalized | **9** | 1 | 1 | 1 | 1 |
| Categories | **10** | 2 | 3 | 1 | 1 |
| Total tools | **376+** | ~50 | ~60 | ~15 | ~20 |
| Market data | ✓ | ✓ | partial | – | – |
| DeFi TVL + yields | ✓ | – | – | ✓ | – |
| Wallet portfolio | ✓ | – | ✓ | – | – |
| Pre-signing security | **✓** | – | – | – | ✓ |
| DEX pool analytics | ✓ | – | partial | – | – |
| Prediction markets | **✓** | – | – | – | – |
| Solana depth (DAS) | ✓ | – | – | – | – |
| Managed (no ops) | ✓ | ✓ | partial | varies | varies |

Single-provider MCPs win on niche depth. Hive wins when the agent needs **broad crypto context in one request** — prices + DeFi + wallet + security + DEX in a single conversation, without the user (or the agent) figuring out which tool lives in which provider.

## CLI

The `hive` CLI is a thin terminal client over the same Hive API. Set `HIVE_API_KEY` (or `hive auth login` once) and you're done.

```bash
# Crypto prices
hive market price --ids bitcoin,ethereum,solana --vs usd

# Top 20 coins by market cap
hive market top --vs usd --limit 20

# DeFi protocol TVL
hive defi tvl --protocol aave

# Token security scan
hive security scan --token 0x...

# Wallet portfolio across chains
hive portfolio balance --address 0x...

# Polymarket event stats
hive prediction markets --event "us-presidential-election-2028"

# Search across all 376+ tools
hive tools search "funding rate"

# Run any tool by name
hive tools call get_price --args '{"ids":"bitcoin","vs_currencies":"usd"}'
```

### CLI domains

| Domain | What's there |
|--------|--------------|
| `market` | Crypto prices, charts, rankings, stablecoins, gas |
| `defi` | DeFi protocol TVL, fees, yields, bridges |
| `dex` | DEX pools, trending pairs, trades, volume |
| `portfolio` | Wallet balances, DeFi positions, NFTs |
| `security` | Token security scans, approvals, simulations |
| `wallet` | On-chain balances, transfers, transactions |
| `nft` | NFT collections, markets, trends |
| `prediction` | Prediction markets, events, traders, outcomes |
| `exchange` | CEX tickers, orderbooks, trades, funding rates |
| `network` | Chains, gas prices, blocks |
| `search` | Search tokens and pools |

Run `hive <domain> --help` to see commands within a domain. Run `hive tools list` for the full 376+ tool catalog.

### CLI flags

```
--json          Force JSON envelope output
--pretty        Force human-readable output
--fields <list> Comma-separated fields to include
--jq <expr>     Filter JSON output (jq-like syntax)
--csv           Output as CSV
--timeout <ms>  Request timeout (default: 30000)
--no-retry      Disable automatic retry
-q, --quiet     Suppress non-data output
-v, --verbose   Show debug info
```

### Auth and profiles

```bash
hive auth login            # Save API key once
hive auth whoami           # Show current profile
hive auth profiles         # List all profiles
hive auth switch prod      # Switch profiles
hive doctor                # Check connectivity
```

### Shell completion

```bash
# Bash
eval "$(hive completion bash)"

# Zsh
eval "$(hive completion zsh)"

# Fish
hive completion fish > ~/.config/fish/completions/hive.fish

# Auto-install
hive completion bash --install
```

### Aliases

```bash
hive alias set btc 'market price --ids bitcoin --vs usd'
hive btc
```

## Pricing

| Plan | Monthly credits | Rate limit | API keys | Price |
|------|-----------------|------------|----------|-------|
| **Demo** | 10,000 | 30 req/min | 1 | Free |
| **Analyst** | 500,000 | 500 req/min | 10 | $129/mo |
| **Pro** | 2,000,000 | 1,000 req/min | 25 | $499/mo |
| **Enterprise** | Custom | 3,000 req/min | 100 | Custom |

One credit = one tool call, regardless of upstream provider or response size. Discovery calls (`tools/list`, `GET /api/v1/tools`) are free.

Full pricing: [hiveintelligence.xyz/pricing](https://hiveintelligence.xyz/pricing)

Machine-readable pricing for AI agents: [hiveintelligence.xyz/pricing.md](https://hiveintelligence.xyz/pricing.md)

## Configuration

| Variable | Description |
|----------|-------------|
| `HIVE_API_KEY` | **Required.** API key — or run `hive auth login` |
| `HIVE_API_URL` | Custom base URL (default: `https://mcp.hiveintelligence.xyz`) |
| `API_EXECUTE_ENDPOINT` | Override execute endpoint (advanced) |

## FAQ

**What is Hive Intelligence?**
A managed MCP server, REST API, and CLI that gives AI agents structured access to live crypto market data, DeFi activity, wallet positions, token security signals, DEX flows, NFTs, prediction markets, and on-chain network data through one normalized tool surface.

**What does an API key cost?**
Free Demo plan with 10,000 monthly credits — no credit card required. Paid plans start at $129/month for 500K credits. Get a key at [hiveintelligence.xyz/dashboard/keys](https://hiveintelligence.xyz/dashboard/keys).

**Why doesn't `npx -y hive-intelligence` show subcommands?**
`hive-intelligence` is the MCP stdio server bin — it opens a JSON-RPC transport and waits for an MCP client. For interactive terminal use, use the `hive` CLI: `npx -y -p hive-intelligence hive --help`.

**Which AI clients support MCP?**
Claude Desktop, Claude Code, Claude Mobile, ChatGPT Desktop, Cursor, Windsurf, VS Code (via Copilot Chat), Gemini CLI, and any client implementing the [Model Context Protocol](https://modelcontextprotocol.io). Setup guides for each: [hiveintelligence.xyz/install](https://hiveintelligence.xyz/install).

**Can I use the remote HTTP endpoint instead of stdio?**
Yes. Point your MCP client at `https://mcp.hiveintelligence.xyz/mcp` with `Authorization: Bearer <key>`. Skips the local Node process entirely. Recommended for ChatGPT Desktop, Cursor (cloud), and any HTTP-MCP-aware client.

**What chains are supported?**
EVM (Ethereum, Arbitrum, Optimism, Base, Polygon, BNB Chain, Avalanche, and 90+ more), Solana with full Helius DAS coverage including compressed NFTs, Bitcoin, and others depending on the provider mix per category.

**Is the source code open?**
This package (the CLI and stdio MCP server bin) is MIT-licensed and open source. The managed backend that serves `mcp.hiveintelligence.xyz` is operated as a service.

**How does Hive prevent hallucinated answers?**
Every tool call returns explicit error envelopes with provider attribution and timestamps. Security tools (`get_token_security`, `detect_rugpull`) wrap GoPlus and return structured risk flags. Time-series tools accept point-in-time params (`at`, `block_number`) so agents can answer historical questions without drifting to "latest."

**Hive vs CoinGecko MCP / Moralis MCP / DefiLlama MCP?**
Hive normalizes nine providers into one tool surface (376+ tools) covering market data, DeFi, wallets, security, DEX, NFTs, prediction markets, and network infrastructure. Single-provider MCPs go deeper inside their provider's data; Hive goes broader so agents can answer cross-domain questions in one request.

## Documentation

- **Quick Start** — [hiveintelligence.xyz/quick-start](https://hiveintelligence.xyz/quick-start)
- **API Reference** — [hiveintelligence.xyz/api-integration](https://hiveintelligence.xyz/api-integration)
- **All Install Guides** — [hiveintelligence.xyz/install](https://hiveintelligence.xyz/install)
- **CLI Reference** — [hiveintelligence.xyz/cli](https://hiveintelligence.xyz/cli)
- **Tool Catalog** — [hiveintelligence.xyz/tools/live-catalog](https://hiveintelligence.xyz/tools/live-catalog)
- **Use Cases** — [hiveintelligence.xyz/use-cases](https://hiveintelligence.xyz/use-cases)
- **What is MCP for crypto?** — [hiveintelligence.xyz/glossary/mcp-crypto](https://hiveintelligence.xyz/glossary/mcp-crypto)

## Development

```bash
# Install dependencies
npm install

# Build
npm run build

# Test with the MCP inspector
npm run inspector

# Run the MCP server locally
npm start
```

## Support

- **GitHub Issues** — [github.com/hive-intel/hive-crypto-mcp/issues](https://github.com/hive-intel/hive-crypto-mcp/issues)
- **Email** — [support@hiveintelligence.xyz](mailto:support@hiveintelligence.xyz)
- **Telegram** — [t.me/HiveIntelligence](https://t.me/HiveIntelligence)
- **Twitter / X** — [@Hive_Intel](https://x.com/Hive_Intel)

## License

MIT © Hive Intelligence
