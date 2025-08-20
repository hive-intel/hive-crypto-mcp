# Hive MCP Tool Registry - Complete Crypto MCP Tools Documentation

## Overview

The Hive MCP provides 120+ specialized tools organized into 9 major categories for comprehensive cryptocurrency, DeFi, and blockchain data access. Each tool is designed for optimal AI integration through the Model Context Protocol.

## Tool Categories

### 1. Market Data & Price Analytics (31 tools)

Tools for real-time and historical cryptocurrency prices, market caps, trading volumes, OHLC data, global market statistics, and comprehensive price analytics.

**Key Tools:**
- `simple_price_browser` - Get current prices for cryptocurrencies
- `coins_market_data_browser` - Comprehensive market data with volume, market cap
- `range_coins_market_chart_browser` - Historical price charts for any timeframe
- `range_coins_ohlc_browser` - OHLC candlestick data for technical analysis
- `gainers_losers_browser` - Top gaining and losing cryptocurrencies
- `global_browser` - Global cryptocurrency market statistics
- `stablecoins_list` - All stablecoin data and analytics
- `coin_tickers_data` - Real-time ticker data from exchanges
- `global_market_cap_chart` - Historical global market cap trends
- `companies_crypto_treasury` - Corporate Bitcoin/crypto holdings

### 2. On-Chain DEX & Pool Analytics (38 tools)

Comprehensive tools for analyzing decentralized exchange pools, liquidity data, trading pairs, and on-chain trading metrics.

**Key Tools:**
- `networks_onchain_pools_browser` - All liquidity pools on any network
- `pools_networks_onchain_info_browser` - Detailed pool information
- `networks_onchain_trending_pools_browser` - Trending and hot pools
- `networks_onchain_new_pools_browser` - Newly deployed pools
- `pools_networks_onchain_trades_browser` - Real-time pool trades
- `timeframe_pools_networks_onchain_ohlcv_browser` - Pool OHLCV data
- `networks_onchain_dexes_browser` - DEX rankings and statistics
- `pools_onchain_megafilter_browser` - Advanced pool filtering
- `search_onchain_pools_browser` - Search pools by token or name
- `retrieve_liquidity_information` - Liquidity depth and reserves

### 3. Portfolio & Wallet Analytics (14 tools)

Track wallet balances, transaction history, portfolio positions across protocols and chains.

**Key Tools:**
- `user_total_balance` - Total portfolio value across chains
- `user_token_balances` - Individual token balances
- `user_history` - Transaction and balance history
- `get_user_protocol` - DeFi protocol positions
- `fetch_wallet_balances` - Multi-chain wallet balances
- `wallet_detailed_stats` - Comprehensive wallet analytics
- `wallet_chart_data` - Portfolio performance charts
- `wallets_search_filter` - Find and filter wallets
- `wallet_nft_collections_data` - NFT holdings in wallet
- `get_token_balance` - Specific token balance check

### 4. Token & Contract Intelligence (14 tools)

Detailed token and contract analysis including metadata, holders, and security information.

**Key Tools:**
- `address_networks_onchain_tokens_browser` - Token information by address
- `tokens_networks_onchain_info_browser` - Comprehensive token data
- `tokens_networks_onchain_top_holders_browser` - Top token holders
- `tokens_networks_onchain_holders_chart_browser` - Holder distribution over time
- `retrieve_token_details` - Detailed token metadata
- `search_tokens_by_criteria` - Advanced token search
- `list_newest_token_contracts` - Recently deployed tokens
- `get_token_transactions` - Token transfer history
- `token_lifecycle_events` - Mints, burns, and other events
- `fetch_coin_metadata` - Project info, links, social media

### 5. DeFi Protocol Analytics (17 tools)

Track TVL, protocol metrics, yields, and comprehensive DeFi ecosystem statistics.

**Key Tools:**
- `protocol_list` - All DeFi protocols with TVL
- `protocol_info` - Detailed protocol information
- `protocol_tvl_current` - Current TVL by protocol
- `defi_protocol_details` - Comprehensive protocol analytics
- `protocol_fees_data` - Revenue and fee analytics
- `chain_tvl_history` - TVL trends by blockchain
- `yield_pools_list` - All yield farming opportunities
- `yield_pool_details` - Specific pool APY and risks
- `global_defi_data` - Overall DeFi market statistics
- `protocol_fees_overview` - Fee comparison across protocols

### 6. NFT Market Analytics (30 tools)

Comprehensive NFT ecosystem analysis including collections, market data, and trading analytics.

**Key Tools:**
- `list_nfts_browser` - All NFT collections with data
- `id_nfts_browser` - Specific collection details
- `nfts_market_chart_browser` - NFT market trends
- `nft_collection_pool_stats` - Collection liquidity pools
- `nft_collection_detailed_stats` - Floor price, volume, holders
- `nft_collection_events` - Sales, transfers, mints
- `nft_collection_holders` - Holder distribution analysis
- `nfts_search_advanced` - Advanced NFT search filters
- `explore_nft_collections` - Discover trending collections
- `track_nft_market_trends` - Market-wide NFT analytics

### 7. Security & Risk Analysis (1 tool)

Security verification and risk assessment for tokens and contracts.

**Key Tools:**
- `get_token_security` - Comprehensive security audit including:
  - Honeypot detection
  - Contract verification status
  - Liquidity lock check
  - Owner privileges analysis
  - Transaction tax detection
  - Blacklist functionality check
  - Mint function analysis
  - Trading restrictions detection

### 8. Network & Infrastructure (11 tools)

Blockchain network information, gas prices, and infrastructure metrics.

**Key Tools:**
- `onchain_networks_browser` - All supported blockchain networks
- `list_blockchain_networks` - Network list with details
- `check_network_health` - Network status and health
- `fetch_network_metrics` - TPS, block time, validators
- `get_gas_prices` - Current gas prices by network
- `asset_platforms_browser` - Asset platform information
- `get_mempool_data` - Pending transactions analysis
- `exchange_system_status` - Exchange API status
- `exchange_markets_browser` - Available trading pairs
- `monitor_system_updates` - Platform updates and changes

### 9. Search & Discovery (9 tools)

Search functionality for tokens, trending analysis, and discovery features.

**Key Tools:**
- `search_browser` - Universal search across crypto assets
- `search_trending_browser` - Trending searches and topics
- `coins_categories_browser` - Browse by category (DeFi, Gaming, etc.)
- `coins_list_browser` - Complete cryptocurrency list
- `new_coins_list_browser` - Recently listed tokens
- `exchanges_list_simple` - All supported exchanges
- `derivatives_exchanges_list` - Derivatives platforms
- `event_labels_list` - Market event categories
- `coins_categories_market_data` - Category performance metrics

### 10. Social Media & Sentiment Analytics (16 tools)

Social media metrics, sentiment analysis, and influencer tracking for crypto assets.

**Key Tools:**
- `discover_topic_influencers` - Find crypto influencers by topic
- `fetch_topic_news_articles` - Latest news by crypto topic
- `analyze_topic_social_posts` - Social media sentiment analysis
- `retrieve_topic_metrics` - Social engagement metrics
- `list_trending_topics` - Trending crypto topics
- `rank_social_influencers` - Top crypto influencers ranking
- `fetch_creator_profile` - Influencer profile data
- `track_creator_performance` - Content performance metrics
- `retrieve_post_analytics` - Individual post engagement
- `monitor_post_engagement` - Real-time engagement tracking

## Tool Usage Examples

### Example 1: Get Bitcoin Price
```json
{
  "tool": "simple_price_browser",
  "arguments": {
    "ids": "bitcoin",
    "vs_currencies": "usd"
  }
}
```

### Example 2: Find High-Yield Pools
```json
{
  "tool": "yield_pools_list",
  "arguments": {
    "min_apy": 20,
    "chain": "ethereum"
  }
}
```

### Example 3: Check Token Security
```json
{
  "tool": "get_token_security",
  "arguments": {
    "chain": "ethereum",
    "address": "0x..."
  }
}
```

### Example 4: Track NFT Collection
```json
{
  "tool": "nft_collection_detailed_stats",
  "arguments": {
    "collection": "boredapeyachtclub"
  }
}
```

### Example 5: Analyze DEX Pool
```json
{
  "tool": "pools_networks_onchain_info_browser",
  "arguments": {
    "network": "ethereum",
    "pool_address": "0x..."
  }
}
```

## Advanced Tool Features

### Real-Time Data
- All price and market data updates in real-time
- Live DEX trading data with sub-second latency
- Instant security checks and risk scoring
- Real-time wallet balance tracking

### Historical Analysis
- Historical price data back to 2013
- OHLCV data for any timeframe
- TVL history for all protocols
- Transaction history and patterns

### Cross-Chain Support
- 50+ blockchain networks supported
- Unified data across all chains
- Cross-chain portfolio tracking
- Multi-chain DEX aggregation

### AI Optimization
- Structured JSON responses
- Natural language descriptions
- Context-aware parameters
- Batch operation support

## Tool Response Format

All tools return structured JSON responses optimized for AI processing:

```json
{
  "success": true,
  "data": {
    // Tool-specific data structure
  },
  "metadata": {
    "timestamp": "2024-01-01T00:00:00Z",
    "source": "data_provider",
    "chain": "ethereum"
  }
}
```

## Rate Limits & Performance

- **Free Tier**: 100 requests per minute
- **Pro Tier**: 1000 requests per minute
- **Enterprise**: Unlimited with SLA
- **Response Time**: <500ms average
- **Uptime**: 99.9% availability

## Integration Best Practices

### For Trading Bots
1. Use `simple_price_browser` for price feeds
2. Monitor `pools_networks_onchain_trades_browser` for DEX activity
3. Check `get_token_security` before trading new tokens
4. Track `wallet_detailed_stats` for whale movements

### For Portfolio Management
1. Aggregate with `user_total_balance`
2. Track positions with `get_user_protocol`
3. Monitor yields with `yield_pool_details`
4. Analyze performance with `wallet_chart_data`

### For Research & Analysis
1. Start with `search_browser` for discovery
2. Deep dive with token-specific tools
3. Compare with `protocol_list` for context
4. Verify with `get_token_security`

## Supported Data Providers

The Hive MCP aggregates data from multiple trusted sources:

- **CoinGecko** - Market data and prices
- **DefiLlama** - DeFi protocol metrics
- **DEX Aggregators** - Real-time DEX data
- **Direct Chain Access** - On-chain verification
- **NFT Marketplaces** - NFT market data
- **Security Providers** - Token audits

## Future Tool Additions

### Coming Soon
- Options trading analytics
- Cross-chain bridge monitoring
- DAO governance tracking
- Prediction market data
- Social sentiment scoring
- MEV analytics tools

### In Development
- AI-powered trade signals
- Automated strategy backtesting
- Custom alert configurations
- Advanced technical indicators
- Portfolio optimization tools
- Risk management suite

## Support & Documentation

- **API Documentation**: https://hiveintelligence.xyz/docs/api
- **Tool Examples**: https://hiveintelligence.xyz/examples
- **Integration Guides**: https://hiveintelligence.xyz/guides
- **Support**: support@hiveintelligence.xyz

---

This comprehensive tool registry provides access to the entire cryptocurrency ecosystem through a single MCP endpoint. Each tool is optimized for AI integration, enabling sophisticated crypto analysis and automation through natural language interfaces.