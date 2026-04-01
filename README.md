# Hive Intelligence

MCP server and CLI for cryptocurrency, Web3, and financial market analytics. Access **351 tools** across **14 categories** from your AI assistant or terminal.

## Install

```bash
npm install -g hive-intelligence
```

This gives you two commands:

| Command | Purpose |
|---------|---------|
| `hive-intelligence` | MCP stdio server for AI clients (Claude Desktop, Cursor, VS Code, etc.) |
| `hive` | CLI tool for terminal usage |

## MCP Server Setup

### Claude Desktop

Add to your config file:

- **macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
- **Windows**: `%APPDATA%\Claude\claude_desktop_config.json`

```json
{
  "mcpServers": {
    "hive": {
      "command": "npx",
      "args": ["-y", "hive-intelligence"]
    }
  }
}
```

### Cursor

Add to `.cursor/mcp.json`:

```json
{
  "mcpServers": {
    "hive": {
      "command": "npx",
      "args": ["-y", "hive-intelligence"]
    }
  }
}
```

### VS Code

Add to `.vscode/mcp.json`:

```json
{
  "servers": {
    "hive": {
      "type": "stdio",
      "command": "npx",
      "args": ["-y", "hive-intelligence"]
    }
  }
}
```

### Claude Code

```bash
claude mcp add hive-intelligence -- npx -y hive-intelligence
```

### Remote MCP Server

For clients that support HTTP transport:

```
https://mcp.hiveintelligence.xyz/mcp
```

More details: https://hiveintelligence.xyz/crypto-mcp

## CLI Usage

The `hive` CLI is a lightweight client that talks to the Hive API. No API keys needed to get started.

```bash
# Get Bitcoin price
hive market price --ids bitcoin --vs usd

# Top coins by market cap
hive market top --vs usd --limit 10

# DeFi protocol TVL
hive defi tvl --protocol aave

# Stock quote
hive stocks quote --symbol AAPL

# Search across all tools
hive tools search "price"

# Run any tool by name
hive tools call get_price --args '{"ids": "ethereum", "vs_currencies": "usd"}'
```

### CLI Commands

| Domain | Description |
|--------|-------------|
| `market` | Crypto prices, charts, rankings, stablecoins, gas |
| `defi` | DeFi protocol TVL, fees, yields, bridges |
| `portfolio` | Wallet balances, DeFi positions, NFTs |
| `security` | Token security scans, approvals, simulations |
| `stocks` | Stock quotes, candles, financials, analyst ratings |
| `macro` | GDP, CPI, rates, employment, economic calendar |
| `social` | Sentiment, influencers, trending topics |
| `exchange` | CEX tickers, orderbooks, trades, funding rates |
| `dex` | DEX pools, trending pairs, trades, volume |
| `wallet` | On-chain balances, transfers, transactions |
| `nft` | NFT collections, markets, trends |
| `network` | Chains, gas prices, blocks |
| `search` | Search tokens and pools |
| `altdata` | Insider trades, earnings, IPOs |

### CLI Options

```
--json          Force JSON output
--pretty        Force human-readable output
--fields <list> Comma-separated fields to include
--jq <expr>     Filter JSON output (jq-like syntax)
--csv           Output as CSV
--timeout <ms>  Request timeout (default: 30000)
--no-retry      Disable automatic retry
-q, --quiet     Suppress non-data output
-v, --verbose   Show debug info
```

### Authentication and Profiles

```bash
# Log in with API key
hive auth login

# Check connectivity
hive doctor

# Show current profile
hive auth whoami

# Manage multiple profiles
hive auth profiles
hive auth switch production
```

### Shell Completion

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

## Analytics Categories (351 Tools)

| # | Category | Tools | Description |
|---|----------|-------|-------------|
| 1 | Market Data & Price | 83 | Real-time/historical prices, OHLCV, market caps, stablecoins, derivatives, funding rates |
| 2 | On-Chain DEX & Pool | 44 | DEX pools, liquidity, trending pairs, trader stats, volume, bridges |
| 3 | Portfolio & Wallet | 38 | Wallet balances, transaction history, DeFi positions, multi-chain tracking |
| 4 | Token & Contract | 27 | Token metadata, holder distributions, contract analysis, treasury tracking |
| 5 | DeFi Protocol | 23 | TVL data, protocol fees, yield farming, chain metrics, treasuries |
| 6 | NFT Analytics | 37 | Collection data, market charts, liquidity pools, holder analysis |
| 7 | Security & Risk | 20 | Token security, honeypot detection, phishing, rugpull analysis |
| 8 | Network & Infrastructure | 24 | Network health, gas prices, block data, chain statuses |
| 9 | Search & Discovery | 10 | Coin search, trending analysis, categories, token discovery |
| 10 | Social & Sentiment | 17 | Social analytics, influencer tracking, news, Galaxy Score, AltRank |
| 11 | Stocks & Equities | 8 | Real-time quotes, candles, company profiles, recommendations |
| 12 | Forex & Commodities | 4 | Forex rates, commodity prices (gold, silver, platinum) |
| 13 | Economic Indicators | 13 | GDP, CPI, fed rate, treasury yields, unemployment, S&P 500 |
| 14 | Alternative Data | 5 | Insider trading, sentiment scores, earnings/IPO calendar |

## Data Providers

CoinGecko, LunarCrush, DefiLlama, GeckoTerminal, Codex, DeBank, GoPlus, GoldRush (Covalent), CCXT, Finnhub, FRED

## Environment Variables

| Variable | Description |
|----------|-------------|
| `HIVE_API_KEY` | API key (or use `hive auth login`) |
| `HIVE_API_URL` | Custom server URL (default: `https://mcp.hiveintelligence.xyz`) |
| `API_EXECUTE_ENDPOINT` | Override MCP server backend URL |

## Development

```bash
# Install dependencies
npm install

# Build
npm run build

# Test with MCP inspector
npm run inspector

# Start MCP server locally
npm start
```

## License

MIT
