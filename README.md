# Hive Intelligence MCP Server

A Model Context Protocol (MCP) server providing comprehensive cryptocurrency and Web3 analytics through intelligent tool orchestration.

## Overview

Hive Intelligence MCP Server enables AI assistants to access a wide range of cryptocurrency, DeFi, and Web3 analytics through a unified MCP interface. The server provides both dynamic and category-specific access to over 200+ specialized tools covering market data, on-chain analytics, portfolio tracking, security analysis, and more.


### 📊 **Analytics Categories**

- **Market Data & Price**
- **On-Chain DEX & Pool**
- **Portfolio & Wallet**
- **Token & Contract**
- **DeFi Protocol**
- **NFT Analytics**
- **Security & Risk**
- **Network & Infrastructure**
- **Search & Discovery**
- **Social & Sentiment**

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

## remote mcp server
checkout the guide to use the hive's remote mcp server
https://hiveintelligence.xyz/crypto-mcp
