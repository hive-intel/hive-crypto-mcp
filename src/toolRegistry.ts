import {supportedTools} from './mcp/allToolList'

export let ToolRegistry = [
  {
    "category": "Market Data and Price",
    "name": "get_market_and_price_endpoints",
    "description": "Endpoints to retrieve real-time and historical cryptocurrency prices, market caps, trading volumes, OHLC data, global market statistics, supported currencies, basic market performance metrics across different timeframes and asset platforms, stablecoin market analytics, stablecoin price tracking, comprehensive stablecoin market cap data across multiple chains, centralized exchange (CEX) trading data including real-time tickers, order books, recent trades, candlestick charts, best bid/ask prices, CEX exchange metadata and volume charts, derivatives pricing (index, mark, and premium), perpetual futures funding rates, leverage tiers, options trading analytics, and available trading markets/currencies across major exchanges. Provider guide: Use coingecko tools for market-wide price data. Use ccxt_ tools for CEX trading data. Use goldrush_ tools for on-chain token price history and gas prices across 100+ chains.",
    "tools": [
      "get_coins_index",
      "get_coins_market_data",
      "get_coin_history",
      "get_coin_market_chart_range",
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
      "get_stablecoin_dominance",
      "get_leverage_tiers",
      // GoldRush market/price tools
      "goldrush_get_historical_token_prices",
      "goldrush_get_gas_prices",
      "goldrush_get_pool_spot_prices",
      // CEX exchange data
      "get_exchanges",
      "get_exchange",
      "get_exchange_tickers",
      "get_exchange_volume_chart",
      "get_exchange_volume_chart_range",
      "get_derivatives_tickers",
      "get_derivatives_exchanges",
      "get_derivatives_exchange",
      "filter_exchanges",
      // Options/derivatives market data
      "get_options_overview",
      "get_options_by_chain",
      "get_options_protocol",
      // CEX infrastructure
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
      "defillama_get_bridge_volume",
      // GoldRush XY=K DEX analytics tools
      "goldrush_get_xyk_pools",
      "goldrush_get_xyk_pool",
      "goldrush_get_xyk_pools_for_token",
      "goldrush_get_xyk_pools_for_wallet",
      "goldrush_get_xyk_address_balances",
      "goldrush_get_xyk_tokens",
      "goldrush_get_xyk_token",
      "goldrush_get_xyk_supported_dexes",
      "goldrush_get_xyk_dex_for_pool",
      "goldrush_get_xyk_txns_for_account",
      "goldrush_get_xyk_txns_for_token",
      "goldrush_get_xyk_txns_for_pool",
      "goldrush_get_xyk_txns_for_dex",
      "goldrush_get_xyk_ecosystem",
      "goldrush_get_xyk_health"
    ]
  },
  {
    "category": "Portfolio & Wallet",
    "name": "get_portfolio_wallet_endpoints",
    "description": "Endpoints for tracking user wallet balances, transaction history, portfolio positions across protocols and chains, net asset calculations, token holdings analysis, comprehensive wallet activity monitoring, real-time balance tracking, balance update history over time, multi-token portfolio analysis, balance changes with transaction context, financial auditing capabilities for individual users and addresses, wallet filtering and discovery, NFT holdings tracking, wallet PnL, DeFi positions, swap history, and wallet insight metrics. Provider guide: Use moralis_ tools for wallet intelligence (PnL, DeFi positions, swap history, net worth, approvals, active chains, wallet insights). Use goldrush_ tools for Bitcoin wallets, historical balance snapshots at specific blocks, 100+ chain coverage, and decoded transaction logs.",
    "tools": [
      "get_wallet_balances",
      "get_wallet_token_events",
      "filter_wallets",
      "filter_token_wallets",
      "get_wallet_stats",
      "get_wallet_chart",
      "get_wallet_nft_collections",
      "get_wallet_nft_assets",
      "filter_network_wallets",
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
      "goldrush_get_transactions_time_buckets",
      // Moralis wallet intelligence tools
      "moralis_get_wallet_history",
      "moralis_get_wallet_token_balances",
      "moralis_get_wallet_net_worth",
      "moralis_get_wallet_profitability",
      "moralis_get_wallet_profitability_summary",
      "moralis_get_wallet_defi_positions",
      "moralis_get_wallet_defi_summary",
      "moralis_get_wallet_approvals",
      "moralis_get_wallet_swaps",
      "moralis_get_wallet_active_chains",
      "moralis_get_wallet_stats",
      "moralis_get_wallet_nfts",
      "moralis_get_wallet_insight",
      "moralis_get_native_balance",
      "moralis_get_wallet_token_transfers",
      // Moralis Solana wallet tools
      "moralis_get_sol_balance",
      "moralis_get_sol_token_balances",
      "moralis_get_sol_portfolio",
      "moralis_get_sol_swaps",
      // Moralis PumpFun tools
      "moralis_get_pumpfun_new_tokens",
      "moralis_get_pumpfun_bonding_tokens",
      "moralis_get_pumpfun_graduated_tokens"
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
      "list_top_tokens",
      "get_companies_treasury",
      "get_entities_list",
      "get_treasury_by_entity",
      "get_treasury_holding_chart",
      "get_treasury_transaction_history",
      // GoldRush token tools
      "goldrush_get_token_holders",
      // Moralis token tools
      "moralis_get_token_price",
      "moralis_get_token_metadata",
      "moralis_get_token_holders",
      "moralis_get_token_transfers",
      "moralis_get_token_pairs",
      "moralis_get_token_top_traders",
      "moralis_get_token_score",
      "moralis_search_tokens",
      "moralis_get_trending_tokens",
      "moralis_resolve_ens_domain",
      "moralis_resolve_address",
      "moralis_get_token_price_batch",
      "moralis_get_token_analytics",
      "moralis_get_token_holder_stats",
      "moralis_get_pair_ohlcv",
      "moralis_get_pair_stats",
      "moralis_get_pair_snipers",
      "moralis_filter_tokens",
      "moralis_get_top_gainers",
      "moralis_get_top_losers",
      "moralis_get_transaction",
      "moralis_get_decoded_transaction",
      "moralis_get_sol_token_price"
    ]
  },
  {
    "category": "DeFi Protocol Analytics",
    "name": "get_defi_protocol_endpoints",
    "description": "Endpoints for comprehensive DeFi protocol analysis including Total Value Locked (TVL) data, protocol listings, chain-specific TVL metrics, historical TVL tracking across all chains, protocol fee analysis, yield farming analytics with APY data, detailed protocol information, comprehensive DeFi ecosystem statistics, blockchain network TVL tracking, yield pool management and historical charts, and protocol fee structures across different DeFi platforms.",
    "tools": [
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
      // GoldRush NFT tools
      "goldrush_get_nft_balances",
      "goldrush_check_nft_ownership",
      "goldrush_check_nft_token_ownership",
      "goldrush_get_nft_metadata",
      "goldrush_get_nft_token_ids",
      "goldrush_get_nft_transactions",
      "goldrush_get_nft_traits",
      "goldrush_get_nft_trait_values",
      "goldrush_get_nft_traits_summary",
      "goldrush_get_nft_floor_price",
      "goldrush_get_nft_volume",
      "goldrush_get_nft_sale_count",
      "goldrush_get_chain_collections"
    ]
  },
  {
    "category": "Security & Risk Analysis",
    "name": "get_security_risk_endpoints",
    "description": "Comprehensive security endpoints for token security analysis, NFT authenticity verification, honeypot detection, malicious address identification, phishing site detection, contract approval risks, dApp security assessment, ABI data decoding, EVM transaction simulation, gas estimation, calldata decoding, and comprehensive security metrics to protect users from scams, rugpulls, and malicious contracts. Provider guide: Use goplus_ tools for threat detection (honeypots, scams, phishing, rugpulls). Use goldrush_ tools for token approval auditing across 100+ chains. Use tenderly_ tools for transaction simulation, gas estimation, and calldata decoding across 100+ EVM chains.",
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
      "simulate_evm_transaction",
      "simulate_solana_transaction",
      "detect_rugpull",
      "get_token_lock_info",
      "get_solana_token_security",
      "get_sui_token_security",
      "check_approval_security_v2",
      // GoldRush security tools
      "goldrush_get_token_approvals",
      "goldrush_get_nft_approvals",
      // Tenderly simulation & security tools
      "tenderly_simulate_transaction",
      "tenderly_simulate_bundle",
      "tenderly_estimate_gas",
      "tenderly_get_supported_networks",
      "tenderly_decode_calldata",
      "tenderly_trace_transaction",
      "tenderly_gas_price",
      "tenderly_suggest_gas_fee",
      "tenderly_decode_input",
      "tenderly_decode_error",
      "tenderly_get_contract_abi",
      "tenderly_decode_event",
      "tenderly_get_storage_changes",
      "tenderly_get_transactions_range",
      "tenderly_function_signatures",
      "tenderly_error_signatures",
      "tenderly_event_signature",
      "tenderly_share_simulation",
      "tenderly_get_block_number"
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
      "get_asset_platforms",
      "get_community_notes",
      "get_exchange_status",
      "get_exchange_time",
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
    "category": "Prediction Markets",
    "name": "get_prediction_markets_endpoints",
    "description": "Endpoints for prediction market data including event/market/trader stats, outcome prices, trade history, bar charts, token holders, and filtering. Provider: Codex covering Polymarket and Kalshi.",
    "tools": [
      "codex_prediction_market_stats",
      "codex_prediction_event_stats",
      "codex_prediction_trader_stats",
      "codex_prediction_trader_markets",
      "codex_prediction_trader_bars",
      "codex_prediction_market_bars",
      "codex_prediction_event_bars",
      "codex_prediction_event_top_markets",
      "codex_prediction_trades",
      "codex_prediction_markets",
      "codex_prediction_traders",
      "codex_prediction_token_holders",
      "codex_filter_prediction_events",
      "codex_prediction_categories",
      "codex_filter_prediction_markets",
      "codex_filter_prediction_trader_markets",
      "codex_filter_prediction_traders",
      "codex_prediction_market_price",
      "codex_prediction_trader_holdings"
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

// Dictionary mapping category index to endpoint paths.
// Indices match ToolRegistry array positions. Backend canonical source:
// hive-mcp2/src/toolRegistry.ts. The pure-crypto migration in 2026-04
// removed Stocks/Forex/Economic/Alternative-Data categories; Prediction
// Markets moved from slot 13 to slot 9.
export const CategoryEndpoints: { [key: number]: string } = {
  0: "/hive_market_data/mcp",            // Market Data and Price
  1: "/hive_onchain_dex/mcp",            // On-Chain DEX & Pool Analytics
  2: "/hive_portfolio_wallet/mcp",       // Portfolio & Wallet
  3: "/hive_token_contract/mcp",         // Token & Contract data
  4: "/hive_defi_protocol/mcp",          // DeFi Protocol Analytics
  5: "/hive_nft_analytics/mcp",          // NFT Analytics
  6: "/hive_security_risk/mcp",          // Security & Risk Analysis
  7: "/hive_network_infrastructure/mcp", // Network & Infrastructure
  8: "/hive_search_discovery/mcp",       // Search & Discovery
  9: "/hive_prediction_markets/mcp",     // Prediction Markets
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
