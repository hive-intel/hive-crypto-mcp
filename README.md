# Hive Intelligence MCP Server

A Model Context Protocol (MCP) server providing comprehensive cryptocurrency, Web3, and financial market analytics through intelligent tool orchestration.

## Overview

Hive Intelligence MCP Server enables AI assistants to access a wide range of cryptocurrency, DeFi, Web3, equities, forex, and macroeconomic analytics through a unified MCP interface. The server provides both dynamic and category-specific access to **351 specialized tools** across **14 analytics categories**, powered by data from CoinGecko, LunarCrush, DefiLlama, GeckoTerminal, Codex, DeBank, GoPlus, GoldRush, CCXT, Finnhub, FRED, and more.

### Analytics Categories

| # | Category | Tools | Description |
|---|----------|-------|-------------|
| 1 | **Market Data & Price** | 83 | Real-time/historical prices, OHLCV, market caps, stablecoins, CEX trading data, derivatives, funding rates, options |
| 2 | **On-Chain DEX & Pool** | 44 | DEX pools, liquidity, trending pairs, OHLCV, trader stats, volume analytics, cross-chain bridges |
| 3 | **Portfolio & Wallet** | 38 | Wallet balances, transaction history, DeFi positions, multi-chain portfolio tracking, Bitcoin wallets |
| 4 | **Token & Contract** | 27 | Token metadata, holder distributions, contract analysis, treasury tracking, transaction forensics |
| 5 | **DeFi Protocol** | 23 | TVL data, protocol fees, yield farming, chain metrics, treasuries, raises, emissions |
| 6 | **NFT Analytics** | 37 | Collection data, market charts, liquidity pools, holder analysis, cross-chain NFT tracking |
| 7 | **Security & Risk** | 20 | Token security, honeypot detection, phishing detection, rugpull analysis, approval auditing |
| 8 | **Network & Infrastructure** | 24 | Network health, gas prices, block data, event logs, chain statuses, address resolution |
| 9 | **Search & Discovery** | 10 | Coin search, trending analysis, categories, token discovery, exchange listings |
| 10 | **Social & Sentiment** | 17 | Social analytics, influencer tracking, news aggregation, Galaxy Score, AltRank |
| 11 | **Stocks & Equities** | 8 | Real-time quotes, historical candles, company profiles, analyst recommendations |
| 12 | **Forex & Commodities** | 4 | Forex rates, currency pair candles, commodity prices (gold, silver, platinum) |
| 13 | **Economic Indicators** | 13 | GDP, CPI, fed rate, treasury yields, unemployment, S&P 500, FRED time series |
| 14 | **Alternative Data** | 5 | Insider trading, sentiment scores, earnings calendar, IPO calendar |

### Data Providers

- **CoinGecko** - Market data, coin metadata, exchanges, NFTs, derivatives
- **LunarCrush** - Social sentiment, Galaxy Score, AltRank, influencer tracking
- **DefiLlama** - TVL, protocol fees, yields, stablecoins, bridges, treasuries, hacks
- **GeckoTerminal** - On-chain DEX pools, OHLCV, trades, trending pairs
- **Codex** - Token pairs, liquidity, trader analytics, chart data, wallet filtering
- **DeBank** - EVM wallet portfolios, DeFi positions, protocol analytics, token info
- **GoPlus** - Token/NFT security, honeypot detection, phishing, rugpull analysis
- **GoldRush (Covalent)** - 100+ chain coverage, token balances, transactions, NFTs, Bitcoin
- **CCXT** - CEX trading data, order books, OHLCV, funding rates, derivatives
- **Finnhub** - Stock quotes, company profiles, forex, commodities, insider trading
- **FRED** - 800,000+ economic time series, GDP, CPI, interest rates

## Hosted deployment

A hosted deployment is available on [Fronteir AI](https://fronteir.ai/mcp/hive-intel-hive-crypto-mcp).

## Installation

```bash
# Install dependencies
npm install

# Build the server
npm run build

# Start the server
npm start
```

### MCP Client Configuration

Add to your MCP client configuration:

```json
{
  "mcpServers": {
    "hive": {
      "command": "npx",
      "args": ["-y", "mcp-hive"]
    }
  }
}
```

## Usage

### Claude Desktop Configuration

Add to your Claude Desktop configuration file:

**Windows**: `%APPDATA%\Claude\claude_desktop_config.json`
**macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`

```json
{
  "mcpServers": {
    "hive-mcp": {
      "command": "npx",
      "args": ["-y", "mcp-hive"]
    }
  }
}
```

## Development

### Building

```bash
# Development build
npm run build

# Production build with executable permissions
npm run prepare
```

### Testing

```bash
# Use MCP inspector for testing
npm run inspector
```
---

## Remote MCP Server
Checkout the guide to use Hive's remote MCP server:
https://hiveintelligence.xyz/crypto-mcp
