import {supportedTools} from './mcp/allToolList'

export let ToolRegistry = [
  {
    "category": "Market Data and Price",
    "name": "get_market_and_price_endpoints",
    "description": "Endpoints to retrieve real-time and historical cryptocurrency prices, market caps, trading volumes, OHLC data, global market statistics, supported currencies, basic market performance metrics across different timeframes and asset platforms, stablecoin market analytics, stablecoin price tracking, comprehensive stablecoin market cap data across multiple chains, social sentiment-enhanced market metrics including Galaxy Score™ and AltRank™ rankings, centralized exchange (CEX) trading data including real-time tickers, order books, recent trades, candlestick charts, best bid/ask prices, CEX exchange metadata and volume charts, derivatives pricing (index, mark, and premium), perpetual futures funding rates, leverage tiers, options trading analytics, and available trading markets/currencies across major exchanges. Provider guide: Use coingecko/lunarcrush tools for market-wide price data and sentiment. Use ccxt_ tools for CEX trading data. Use goldrush_ tools for on-chain token price history and gas prices across 100+ chains.",
    "tools": [
      "get_coins_index",
      "get_coins_market_data",
      "get_coin_history",
      "get_coin_market_chart_range",
      "get_coin_ohlc_range",
      "get_price",
      "get_gainers_losers",
      "get_contract_coin",
      "get_contract_market_chart",
      "get_contract_market_chart_range",
      "get_token_price_by_contract",
      "get_global_stats",
      "get_supported_currencies",
      "get_token_price",
      "get_price_chart",
      "get_token_sparklines",
      "get_token_chart_urls",
      "get_coin_tickers",
      "get_coin_historical_chart",
      "get_btc_exchange_rates",
      "get_global_market_cap_chart",
      "get_coin_ohlc",
      "get_circulating_supply_chart",
      "get_circulating_supply_chart_range",
      "get_total_supply_chart",
      "get_total_supply_chart_range",
      "get_stablecoins",
      "get_stablecoin_chains",
      "get_stablecoin_charts_global",
      "get_stablecoin_charts_by_chain",
      "get_stablecoin_prices",
      "stablecoin_data_by_id",
      "get_current_prices",
      "get_historical_prices",
      "get_batch_historical_prices",
      "get_price_percentage_change",
      "get_first_prices",
      "get_crypto_market_metrics",
      "get_coin_performance",
      "get_supported_stocks",
      "get_stock_analytics",
      "get_ticker",
      "get_tickers",
      "get_orderbook",
      "get_recent_trades",
      "get_ohlcv",
      "get_best_bid_ask",
      "get_l2_orderbook",
      "get_index_ohlcv",
      "get_mark_ohlcv",
      "get_premium_index_ohlcv",
      "get_funding_rate",
      "get_funding_rate_history",
      "get_funding_rates",
      "get_trading_fees",
      "get_open_interest",
      "get_open_interest_history",
      "get_long_short_ratio",
      "get_liquidations",
      "get_borrow_rates",
      "get_debank_token_price_history",
      "get_stablecoin_dominance",
      "get_leverage_tiers",
      // GoldRush market/price tools
      "goldrush_get_historical_token_prices",
      "goldrush_get_gas_prices",
      "goldrush_get_pool_spot_prices",
      // CEX exchange data (moved from On-Chain DEX — these are centralized exchange tools)
      "get_exchanges",
      "get_exchange",
      "get_exchange_tickers",
      "get_exchange_volume_chart",
      "get_exchange_volume_chart_range",
      "get_derivatives_tickers",
      "get_derivatives_exchanges",
      "get_derivatives_exchange",
      "filter_exchanges",
      // Options/derivatives market data (moved from On-Chain DEX)
      "get_options_overview",
      "get_options_by_chain",
      "get_options_protocol",
      // CEX infrastructure (moved from Network & Infrastructure — these return market/trading data)
      "get_exchange_markets",
      "get_exchange_currencies"
    ]
  },
  {
    "category": "On-Chain DEX & Pool Analytics",
    "name": "get_onchain_dex_pool_endpoints",
    "description": "Endpoints for analyzing on-chain decentralized exchange pools, liquidity data, trading pairs, DEX rankings, pool filtering, trending pools, OHLCV data for pools/tokens, trading volume analysis, comprehensive on-chain trading metrics across multiple networks and DEXs, real-time DEX trading analytics, advanced token trading intelligence with DEXScreener-style metrics, trader statistics (makers, buyers, sellers), aggregated trading data by tokens, volume breakdowns, trading activity analysis, DEX volume analytics across protocols and chains, and cross-chain bridge analytics.",
    "tools": [
      "get_onchain_categories",
      "get_pools_by_category",
      "get_new_pools",
      "get_new_pools_by_network",
      "get_trending_pools",
      "get_trending_pools_by_network",
      "get_dexes",
      "get_pools_by_dex",
      "get_pools",
      "get_pools_by_address",
      "get_pool_info",
      "get_pool_ohlcv",
      "get_pool_trades",
      "get_token_ohlcv",
      "get_token_pools",
      "get_token_trades",
      "get_onchain_token_top_traders",
      "filter_pools",
      "search_trending_pools",
      "search_pools",
      "get_onchain_token_price",
      "get_token_transactions",
      "get_pair_stats",
      "get_pairs_stats",
      "filter_pairs",
      "get_pair_info",
      "get_token_pairs",
      "get_token_pairs_metadata",
      "get_liquidity_info",
      "get_liquidity_locks",
      "get_network_trending_pools",
      "get_multi_pools",
      "get_network_dexes",
      "get_pair_chart_metadata",
      "get_token_liquidity_metadata",
      "get_latest_pairs",
      "get_detailed_stats",
      "get_token_chart_data",
      "get_dex_volumes",
      "get_dex_volume",
      "get_dex_volumes_by_chain",
      "defillama_get_bridges",
      "defillama_get_bridge_by_id",
      "defillama_get_bridge_volume"
    ]
  },
  {
    "category": "Portfolio & Wallet",
    "name": "get_portfolio_wallet_endpoints",
    "description": "Endpoints for tracking user wallet balances, transaction history, portfolio positions across protocols and chains, net asset calculations, token holdings analysis, comprehensive wallet activity monitoring, real-time balance tracking, balance update history over time, multi-token portfolio analysis, balance changes with transaction context, financial auditing capabilities for individual users and addresses, wallet filtering and discovery, and NFT holdings tracking. Provider guide: Use debank_ tools for EVM wallet portfolios, DeFi positions, and protocol-level analytics. Use goldrush_ tools for Bitcoin wallets, historical balance snapshots at specific blocks, 100+ chain coverage, and decoded transaction logs.",
    "tools": [
      "get_wallet_history",
      "get_wallet_balance",
      "get_wallet_token_balances",
      "get_wallet_protocol_positions",
      "get_wallet_defi_positions",
      "get_wallet_defi_positions_all_chains",
      "get_wallet_balances",
      "get_wallet_token_events",
      "filter_wallets",
      "filter_token_wallets",
      "get_wallet_stats",
      "get_wallet_chart",
      "get_wallet_nft_collections",
      "get_wallet_nft_assets",
      "filter_network_wallets",
      "get_wallet_active_chains",
      "get_wallet_chain_balance",
      "get_portfolio_history",
      "get_chain_portfolio_history",
      "get_all_chain_history",
      // GoldRush wallet/portfolio tools
      "goldrush_get_token_balances",
      "goldrush_get_historical_balances",
      "goldrush_get_native_balance",
      "goldrush_get_erc20_transfers",
      "goldrush_get_portfolio_history",
      "goldrush_get_multichain_balances",
      "goldrush_get_multichain_transactions",
      "goldrush_get_cross_chain_activity",
      "goldrush_get_bitcoin_balance",
      "goldrush_get_bitcoin_hd_balances",
      "goldrush_get_bitcoin_balance_history",
      "goldrush_get_bitcoin_transactions",
      "goldrush_get_transaction",
      "goldrush_get_transaction_summary",
      "goldrush_get_transactions_earliest",
      "goldrush_get_transactions_latest",
      "goldrush_get_transactions_paginated",
      "goldrush_get_transactions_time_buckets"
    ]
  },
  {
    "category": "Token & Contract data",
    "name": "get_token_contract_endpoints",
    "description": "Endpoints for detailed token and contract analysis including token metadata, holder distributions, contract information, token filtering and discovery, holder rankings, comprehensive token intelligence across multiple networks, advanced transaction analysis and forensics, detailed transaction data (hash, sender, recipient, value, gas costs), internal transactions with signatures, transaction status validation, address tracking capabilities for security analysis and investigation, token lifecycle events, trader analytics, and project metadata including websites and social media links. Provider guide: Use codex_ tools for on-chain DEX token analytics and pair data. Use coingecko tools for market metadata. Use goldrush_ tools for token holder lists across 100+ chains.",
    "tools": [
      "get_tokens_by_address",
      "get_token_info",
      "get_token_top_holders",
      "get_token_holders_chart",
      "get_token_details",
      "get_tokens",
      "filter_tokens",
      "get_token_holders",
      "get_top_holders_percentage",
      "get_new_tokens",
      "get_multi_tokens",
      "get_recently_updated_tokens",
      "get_token_lifecycle_events",
      "get_token_top_traders",
      "get_coin_metadata",
      "list_top_tokens",
      "get_debank_token_info",
      "get_tokens_by_ids",
      "get_debank_top_holders",
      "get_companies_treasury",
      "get_entities_list",
      "get_treasury_by_entity",
      "get_treasury_holding_chart",
      "get_treasury_transaction_history",
      "get_token_lists",
      "explain_transaction",
      // GoldRush token tools
      "goldrush_get_token_holders"
    ]
  },
  {
    "category": "DeFi Protocol Analytics",
    "name": "get_defi_protocol_endpoints",
    "description": "Endpoints for comprehensive DeFi protocol analysis including Total Value Locked (TVL) data, protocol listings, chain-specific TVL metrics, historical TVL tracking across all chains, protocol fee analysis, yield farming analytics with APY data, detailed protocol information, comprehensive DeFi ecosystem statistics, blockchain network TVL tracking, yield pool management and historical charts, and protocol fee structures across different DeFi platforms.",
    "tools": [
      "get_protocol_info",
      "get_protocols",
      "get_global_defi",
      "get_defi_protocols",
      "get_defi_protocol",
      "get_protocol_tvl",
      "get_protocol_fees",
      "get_chains",
      "get_chain_tvl_history",
      "get_chains_tvl_history",
      "get_yield_pools",
      "get_yield_pool_chart",
      "get_fees_overview",
      "get_chain_fees",
      "get_protocol_fee_summary",
      "defillama_get_treasuries",
      "defillama_get_treasury",
      "defillama_get_raises",
      "defillama_get_emissions",
      "get_defi_oracles",
      "get_defi_forks",
      "get_defi_categories",
      "get_defi_entities"
    ]
  },
  {
    "category": "NFT Analytics",
    "name": "get_nft_analytics_endpoints",
    "description": "Endpoints for comprehensive NFT ecosystem analysis including collection data, market analytics, user NFT holdings, collection floor prices, trading volumes, historical NFT market data, NFT liquidity pools and AMM marketplaces (like Sudoswap), NFT DeFi analytics, Prime ecosystem pools, Parallel trading card game assets, NFT pool management, collection holder analysis, advanced NFT search and filtering, contract metadata, cross-chain NFT analytics, social sentiment tracking for NFT collections, and time series market trend analysis. Provider guide: Use codex_ tools for NFT collection analytics, pools, and trading. Use goldrush_ tools for NFT balance lookups and ownership verification across 100+ chains.",
    "tools": [
      "get_nft",
      "get_nfts",
      "get_nft_market_chart",
      "get_nft_tickers",
      "get_nft_by_contract",
      "get_nft_markets",
      "get_nft_contract_market_chart",
      "get_wallet_nfts",
      "get_wallet_all_nfts",
      "get_nft_collection",
      "get_nft_pool",
      "get_nft_pool_events",
      "get_nft_pool_stats",
      "get_nft_collections_by_exchange",
      "get_nft_pools_by_collection",
      "get_nft_pools_by_owner",
      "filter_nft_collections",
      "filter_nft_pool_collections",
      "search_nfts",
      "filter_nft_pools",
      "get_nft_collection_assets",
      "get_nft_collection_stats",
      "get_nft_collection_events",
      "get_nft_contracts",
      "filter_parallel_assets",
      "get_parallel_card_changes",
      "get_prime_pool_assets",
      "get_prime_pool_events",
      "get_prime_pools",
      "get_nft_holders",
      "get_prime_holders",
      "get_nft_collections",
      "get_nft_collection_analysis",
      "get_nft_market_trends",
      // GoldRush NFT tools
      "goldrush_get_nft_balances",
      "goldrush_check_nft_ownership",
      "goldrush_check_nft_token_ownership"
    ]
  },
  {
    "category": "Security & Risk Analysis",
    "name": "get_security_risk_endpoints",
    "description": "Comprehensive security endpoints for token security analysis, NFT authenticity verification, honeypot detection, malicious address identification, phishing site detection, contract approval risks, dApp security assessment, ABI data decoding, and comprehensive security metrics to protect users from scams, rugpulls, and malicious contracts. Provider guide: Use goplus_ tools for threat detection (honeypots, scams, phishing, rugpulls). Use goldrush_ tools for token approval auditing across 100+ chains.",
    "tools": [
      "get_token_security",
      "get_nft_security",
      "check_malicious_address",
      "check_approval_security",
      "get_wallet_approvals",
      "check_dapp_security",
      "check_phishing_site",
      "decode_abi",
      "defillama_get_hacks",
      "get_wallet_token_approvals",
      "simulate_transaction",
      "get_wallet_nft_approvals",
      "simulate_evm_transaction",
      "simulate_solana_transaction",
      "detect_rugpull",
      "get_token_lock_info",
      "get_solana_token_security",
      "get_sui_token_security",
      "check_approval_security_v2",
      // GoldRush security tools
      "goldrush_get_token_approvals"
    ]
  },
  {
    "category": "Network & Infrastructure",
    "name": "get_network_infrastructure_endpoints",
    "description": "Endpoints for blockchain network information, network health monitoring, gas price tracking, network statistics, asset platform data, infrastructure metrics across different blockchain networks, real-time mempool monitoring, pending transaction analysis, transaction status simulation, MEV detection and protection, gas fee optimization, arbitrage opportunity identification, comprehensive blockchain activity monitoring, community-contributed insights and annotations, data platform system updates monitoring, centralized exchange (CEX) infrastructure including system status monitoring, server time synchronization, available trading markets/pairs browsing, and supported currencies listing across major exchanges. Provider guide: Use codex/coingecko tools for network lists and stats. Use goldrush_ tools for block data, decoded event logs, chain statuses, and address resolution across 100+ chains.",
    "tools": [
      "get_networks",
      "get_networks_list",
      "get_network_status",
      "get_network_stats",
      "get_gas_prices",
      "get_asset_platforms",
      "get_community_notes",
      "get_system_changes",
      "get_exchange_status",
      "get_exchange_time",
      "get_supported_chains",
      "get_chain_details",
      "get_block_by_timestamp",
      "get_goplus_supported_chains",
      // GoldRush network tools
      "goldrush_get_chains",
      "goldrush_get_chain_statuses",
      "goldrush_get_block",
      "goldrush_get_block_heights",
      "goldrush_get_logs",
      "goldrush_get_logs_by_topic",
      "goldrush_get_logs_by_contract",
      "goldrush_resolve_address",
      "goldrush_get_block_transactions",
      "goldrush_get_block_transactions_paginated"
    ]
  },
  {
    "category": "Search & Discovery",
    "name": "get_search_discovery_endpoints",
    "description": "Endpoints for cryptocurrency search functionality, trending analysis, coin categorization, token discovery, new coin listings, comprehensive search capabilities across coins, categories, and markets, event categorization and labeling systems.",
    "tools": [
      "search_all",
      "get_trending",
      "get_categories",
      "get_coins_list",
      "get_new_coins",
      "get_categories_market_data",
      "get_exchanges_list",
      "get_derivatives_exchanges_list",
      "get_event_labels",
      "search_tokens"
    ]
  },
  {
    "category": "Social Media & Sentiment Analytics",
    "name": "get_social_sentiment_endpoints",
    "description": "Endpoints for social media analytics, sentiment analysis, influencer tracking, social engagement metrics, trending topics analysis, news aggregation, creator analytics, post engagement tracking, social dominance metrics, Galaxy Score™, AltRank™, and comprehensive social sentiment indicators across crypto assets, stocks, and NFTs. Includes real-time social monitoring, influencer identification, content virality analysis, and social trend detection.",
    "tools": [
      "get_topic_creators",
      "get_topic_news",
      "get_topic_posts",
      "get_topic_metrics",
      "get_trending_topics",
      "get_category_info",
      "get_category_topics",
      "get_category_posts",
      "get_category_news",
      "get_category_creators",
      "get_categories_list",
      "get_creators_list",
      "get_creator_profile",
      "get_creator_metrics",
      "get_creator_posts",
      "get_post_details",
      "get_post_metrics"
    ]
  },
  {
    "category": "Stocks & Equities",
    "name": "get_stocks_equities_endpoints",
    "description": "Endpoints for stock market data including real-time quotes, historical OHLCV candles, company profiles, basic financial metrics (P/E, EPS, market cap), analyst recommendations and price targets, symbol search, and market news. Provider guide: Use finnhub_ tools for real-time US stock quotes, historical price data, analyst consensus, company profiles, and financial news.",
    "tools": [
      "finnhub_get_stock_quote",
      "finnhub_get_stock_candles",
      "finnhub_get_company_profile",
      "finnhub_get_basic_financials",
      "finnhub_get_stock_recommendations",
      "finnhub_get_price_target",
      "finnhub_search_symbol",
      "finnhub_get_market_news"
    ]
  },
  {
    "category": "Forex & Commodities",
    "name": "get_forex_commodities_endpoints",
    "description": "Endpoints for foreign exchange rates, currency pair historical candles, available forex symbols, and commodity price data (gold, silver, platinum). Provider guide: Use finnhub_ tools for real-time forex rates, currency pair OHLCV data, and commodity prices via XAU/XAG/XPT pairs.",
    "tools": [
      "finnhub_get_forex_candles",
      "finnhub_get_forex_symbols",
      "finnhub_get_forex_rates",
      "finnhub_get_commodity_candles"
    ]
  },
  {
    "category": "Economic Indicators",
    "name": "get_economic_indicators_endpoints",
    "description": "Endpoints for US macroeconomic data including GDP, CPI inflation, federal funds rate, treasury yields, unemployment rate, S&P 500 index, economic event calendar, and 800,000+ FRED time series. Provider guide: Use fred_ tools for economic time series data (GDP, CPI, rates, yields, unemployment). Use finnhub_ tools for economic event calendars, market open/close status, and country data.",
    "tools": [
      "fred_get_series_observations",
      "fred_search_series",
      "fred_get_series_info",
      "fred_get_releases",
      "fred_get_gdp",
      "fred_get_inflation",
      "fred_get_fed_rate",
      "fred_get_treasury_10y",
      "fred_get_unemployment",
      "fred_get_sp500",
      "finnhub_get_economic_calendar",
      "finnhub_get_market_status",
      "finnhub_get_country_list"
    ]
  },
  {
    "category": "Alternative Data",
    "name": "get_alternative_data_endpoints",
    "description": "Endpoints for alternative financial data including insider (executive) trading transactions, insider sentiment scores, company-specific news, earnings calendar, and IPO calendar. Provider guide: Use finnhub_ tools for SEC-filed insider buy/sell data, insider sentiment (MSPR), upcoming earnings reports, IPO schedules, and company news.",
    "tools": [
      "finnhub_get_insider_transactions",
      "finnhub_get_insider_sentiment",
      "finnhub_get_company_news",
      "finnhub_get_earnings_calendar",
      "finnhub_get_ipo_calendar"
    ]
  },
]

// function that takes category name, and returns list of tools in that category return {}

export function getAllToolsInCategory(category: string){
  let categoryUsed = ToolRegistry.find(tool => tool.category === category);
  if(!categoryUsed){
    return []
  }
  const allWrappedTools = supportedTools
  // return all the tools from wrapped tools that are in the category (name match)
  let toolsInCategory = [];
  for (const tool of categoryUsed.tools){
    const wrappedTool = allWrappedTools.find(wrappedTool => wrappedTool.name === tool);
    if(wrappedTool){
      toolsInCategory.push(wrappedTool);
    }
    else console.log(`Tool ${tool} not found in wrapped tools`);
  }
  return toolsInCategory;
}

// get total tools in tool registry
function getTotalToolsInToolRegistry(){
  let totalTools = 0;
  for(const category of ToolRegistry){
    totalTools += category.tools.length;
  }
  return totalTools;
}

// Dictionary mapping category index to endpoint paths
export const CategoryEndpoints: { [key: number]: string } = {
  0: "/hive_market_data/mcp",           // Market Data and Price
  1: "/hive_onchain_dex/mcp",          // On-Chain DEX & Pool Analytics
  2: "/hive_portfolio_wallet/mcp",      // Portfolio & Wallet
  3: "/hive_token_contract/mcp",        // Token & Contract data
  4: "/hive_defi_protocol/mcp",         // DeFi Protocol Analytics
  5: "/hive_nft_analytics/mcp",         // NFT Analytics
  6: "/hive_security_risk/mcp",         // Security & Risk Analysis
  7: "/hive_network_infrastructure/mcp", // Network & Infrastructure
  8: "/hive_search_discovery/mcp",      // Search & Discovery
  9: "/hive_social_sentiment/mcp",      // Social Media & Sentiment Analytics
  10: "/hive_stocks_equities/mcp",      // Stocks & Equities
  11: "/hive_forex_commodities/mcp",    // Forex & Commodities
  12: "/hive_economic_indicators/mcp",  // Economic Indicators
  13: "/hive_alternative_data/mcp",     // Alternative Data
};

export function getToolByCategory(category:number){
  // return list tools and call tool
  const toolNameList = ToolRegistry[category].tools

  const tools = [];
  for(const toolName of toolNameList){
    const tool = supportedTools.find(tool => tool.name === toolName);
    if(tool){
      tools.push({tool});
    }
  }
  return tools;
}
