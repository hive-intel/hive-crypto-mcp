# Hive Intelligence

MCP server and CLI for cryptocurrency, Web3, and financial market analytics. Access **389 tools** across **14 categories** from your AI assistant or terminal.

## Install

```bash
npm install -g hive-intelligence
```

This gives you two commands:

| Command | Purpose |
|---------|---------|
| `hive-intelligence` | MCP stdio server for AI clients (Claude Desktop, Cursor, VS Code, etc.) |
| `hive` | CLI tool for terminal usage |

## API Key

An API key is required. Get one at [hiveintelligence.xyz](https://hiveintelligence.xyz) and set it as an environment variable:

```bash
export HIVE_API_KEY="hive_live_..."
```

Or use the CLI login:

```bash
hive auth login
```

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
      "args": ["-y", "hive-intelligence"],
      "env": {
        "HIVE_API_KEY": "hive_live_..."
      }
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
      "args": ["-y", "hive-intelligence"],
      "env": {
        "HIVE_API_KEY": "hive_live_..."
      }
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
      "args": ["-y", "hive-intelligence"],
      "env": {
        "HIVE_API_KEY": "hive_live_..."
      }
    }
  }
}
```

### Claude Code

```bash
claude mcp add hive-intelligence -e HIVE_API_KEY=hive_live_... -- npx -y hive-intelligence
```

### Remote MCP Server

For clients that support HTTP transport:

```
URL: https://mcp.hiveintelligence.xyz/mcp
Headers: { "Authorization": "Bearer hive_live_..." }
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
| `macro` | Economic calendar, market status, country data |
| `prediction` | Prediction markets, events, traders, outcomes |
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

## Analytics Categories (389 Tools)

| # | Category | Tools | Description |
|---|----------|-------|-------------|
| 1 | Market Data & Price | 70 | Real-time/historical prices, OHLCV, market caps, stablecoins, derivatives, funding rates |
| 2 | On-Chain DEX & Pool | 58 | DEX pools, liquidity, trending pairs, volume, bridges, GoldRush XY=K analytics |
| 3 | Portfolio & Wallet | 50 | Wallet balances, PnL, DeFi positions, swap history, Moralis & GoldRush intelligence |
| 4 | Token & Contract | 44 | Token metadata, holders, Moralis analytics, ENS resolution, treasury tracking |
| 5 | DeFi Protocol | 21 | TVL data, protocol fees, yield farming, chain metrics, treasuries |
| 6 | NFT Analytics | 41 | Collection data, market charts, liquidity pools, GoldRush NFT metadata & traits |
| 7 | Security & Risk | 37 | Token security, honeypot detection, Tenderly simulation, gas estimation |
| 8 | Network & Infrastructure | 20 | Network health, block data, chain statuses, event logs |
| 9 | Search & Discovery | 10 | Coin search, trending analysis, categories, token discovery |
| 10 | Stocks & Equities | 8 | Real-time quotes, candles, company profiles, recommendations |
| 11 | Forex & Commodities | 4 | Forex rates, commodity prices (gold, silver, platinum) |
| 12 | Economic Indicators | 3 | Economic calendar, market status, country data |
| 13 | Alternative Data | 5 | Insider trading, sentiment scores, earnings/IPO calendar |
| 14 | Prediction Markets | 19 | Polymarket/Kalshi events, trader stats, outcome prices, trade history |

## Data Providers

CoinGecko, DefiLlama, GeckoTerminal, Codex (Defined.fi), Moralis, GoPlus, GoldRush (Covalent), Tenderly, CCXT, Finnhub

## Environment Variables

| Variable | Description |
|----------|-------------|
| `HIVE_API_KEY` | **Required.** API key (or use `hive auth login`) |
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
