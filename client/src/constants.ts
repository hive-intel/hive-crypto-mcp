export const HIVE_DEFAULT_MCP_URL = "https://mcp.hiveintelligence.xyz/mcp";

export const HIVE_CORE_TOOL_NAMES = [
  "search_tools",
  "get_api_endpoint_schema",
  "invoke_api_endpoint",
] as const;

export const HIVE_CATEGORY_TOOL_NAMES = [
  "get_market_and_price_endpoints",
  "get_onchain_dex_pool_endpoints",
  "get_portfolio_wallet_endpoints",
  "get_token_contract_endpoints",
  "get_defi_protocol_endpoints",
  "get_nft_analytics_endpoints",
  "get_security_risk_endpoints",
  "get_network_infrastructure_endpoints",
  "get_search_discovery_endpoints",
  "get_prediction_markets_endpoints",
] as const;

export const HIVE_REMOVED_CATEGORY_TOOL_NAMES = [
  "get_stocks_equities_endpoints",
  "get_forex_commodities_endpoints",
  "get_economic_indicators_endpoints",
  "get_alternative_data_endpoints",
  "get_social_sentiment_endpoints",
] as const;

export const HIVE_COMPACT_METADATA_RESOURCE_URIS = [
  "hive://toolsets",
  "hive://providers",
  "hive://categories",
  "hive://status",
] as const;

export const HIVE_METADATA_RESOURCE_URIS = [
  ...HIVE_COMPACT_METADATA_RESOURCE_URIS,
  "hive://tools",
  "hive://task-canaries",
  "hive://skills",
] as const;

export const HIVE_PROVIDER_NAMES = [
  "CoinGecko",
  "DeFiLlama",
  "Alchemy",
  "Helius",
  "Moralis",
  "GoPlus",
  "CCXT",
  "Tenderly",
  "Codex",
] as const;

export type HiveCoreToolName = (typeof HIVE_CORE_TOOL_NAMES)[number];
export type HiveCategoryToolName = (typeof HIVE_CATEGORY_TOOL_NAMES)[number];
export type HiveRemovedCategoryToolName =
  (typeof HIVE_REMOVED_CATEGORY_TOOL_NAMES)[number];
export type HiveMetadataResourceUri =
  (typeof HIVE_METADATA_RESOURCE_URIS)[number];
