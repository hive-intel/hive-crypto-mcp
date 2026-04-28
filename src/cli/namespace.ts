interface SubCommand {
  name: string;
  description: string;
  tool: string;
  args?: Record<
    string,
    { flag: string; description: string; required?: boolean }
  >;
}

interface DomainCommand {
  name: string;
  description: string;
  commands: SubCommand[];
}

export type { SubCommand, DomainCommand };

export const NAMESPACE: DomainCommand[] = [
  {
    name: "market",
    description: "Crypto market data — prices, charts, rankings, stablecoins",
    commands: [
      {
        name: "price",
        description: "Get token price",
        tool: "get_price",
        args: {
          ids: {
            flag: "--ids <tokens>",
            description: "Token IDs (comma-separated)",
            required: true,
          },
          vs_currencies: {
            flag: "--vs <currencies>",
            description: "Target currencies",
            required: true,
          },
        },
      },
      {
        name: "top",
        description: "Top coins by market cap",
        tool: "get_coins_market_data",
        args: {
          vs_currency: {
            flag: "--vs <currency>",
            description: "Quote currency",
            required: true,
          },
          per_page: { flag: "--limit <n>", description: "Number of results" },
        },
      },
      { name: "trending", description: "Trending coins", tool: "get_trending" },
      {
        name: "global",
        description: "Global market stats",
        tool: "get_global_stats",
      },
      {
        name: "ohlc",
        description: "OHLC candle data",
        tool: "get_coin_ohlc",
        args: {
          id: { flag: "--id <coin>", description: "Coin ID", required: true },
          vs_currency: {
            flag: "--vs <currency>",
            description: "Quote currency (default: usd)",
          },
          days: { flag: "--days <n>", description: "Number of days" },
        },
      },
      {
        name: "chart",
        description: "Price chart data",
        tool: "get_coin_market_chart_range",
        args: {
          id: { flag: "--id <coin>", description: "Coin ID", required: true },
          vs_currency: {
            flag: "--vs <currency>",
            description: "Quote currency (default: usd)",
          },
          from: {
            flag: "--from <timestamp>",
            description: "Start UNIX timestamp",
            required: true,
          },
          to: {
            flag: "--to <timestamp>",
            description: "End UNIX timestamp",
            required: true,
          },
        },
      },
      {
        name: "gainers",
        description: "Top gainers and losers",
        tool: "get_gainers_losers",
        args: {
          vs_currency: {
            flag: "--vs <currency>",
            description: "Quote currency (default: usd)",
          },
        },
      },
      {
        name: "gas",
        description: "Gas prices by chain",
        tool: "goldrush_get_gas_prices",
        args: {
          chainName: {
            flag: "--chain <name>",
            description: "Chain name",
            required: true,
          },
        },
      },
    ],
  },
  {
    name: "defi",
    description: "DeFi protocol analytics — TVL, fees, yields, bridges",
    commands: [
      {
        name: "tvl",
        description: "Protocol TVL",
        tool: "get_protocol_tvl",
        args: {
          protocol: {
            flag: "--protocol <name>",
            description: "Protocol slug",
            required: true,
          },
        },
      },
      {
        name: "protocols",
        description: "All DeFi protocols",
        tool: "get_defi_protocols",
      },
      {
        name: "fees",
        description: "Protocol fee data",
        tool: "get_protocol_fees",
        args: {
          protocol: {
            flag: "--protocol <name>",
            description: "Protocol slug",
            required: true,
          },
        },
      },
      {
        name: "yields",
        description: "Yield farming pools",
        tool: "get_yield_pools",
      },
      { name: "chains", description: "Chain TVL rankings", tool: "get_chains" },
      {
        name: "bridges",
        description: "Cross-chain bridges",
        tool: "defillama_get_bridges",
      },
    ],
  },
  {
    name: "portfolio",
    description: "Wallet portfolios — balances, DeFi positions, NFTs, history",
    commands: [
      {
        name: "balance",
        description: "Wallet total balance",
        tool: "get_wallet_balances",
        args: {
          id: {
            flag: "--address <addr>",
            description: "Wallet address",
            required: true,
          },
        },
      },
      {
        name: "tokens",
        description: "Token holdings",
        tool: "goldrush_get_token_balances",
        args: {
          id: {
            flag: "--address <addr>",
            description: "Wallet address",
            required: true,
          },
        },
      },
      {
        name: "positions",
        description: "DeFi positions",
        tool: "moralis_get_wallet_defi_positions",
        args: {
          id: {
            flag: "--address <addr>",
            description: "Wallet address",
            required: true,
          },
        },
      },
      {
        name: "nfts",
        description: "NFT holdings",
        tool: "get_wallet_nft_collections",
        args: {
          id: {
            flag: "--address <addr>",
            description: "Wallet address",
            required: true,
          },
        },
      },
      {
        name: "history",
        description: "Portfolio value history",
        tool: "goldrush_get_portfolio_history",
        args: {
          walletAddress: {
            flag: "--address <addr>",
            description: "Wallet address",
            required: true,
          },
          chainName: {
            flag: "--chain <name>",
            description: "Chain name",
            required: true,
          },
        },
      },
    ],
  },
  {
    name: "security",
    description: "Token and contract security — scans, approvals, simulations",
    commands: [
      {
        name: "scan",
        description: "Token security analysis",
        tool: "get_token_security",
        args: {
          chain_id: {
            flag: "--chain <id>",
            description: "Chain ID (1=ETH, 56=BSC)",
            required: true,
          },
          contract_addresses: {
            flag: "--address <addr>",
            description: "Token contract",
            required: true,
          },
        },
      },
      {
        name: "approve",
        description: "Audit token approvals",
        tool: "check_approval_security",
        args: {
          chain_id: {
            flag: "--chain <id>",
            description: "Chain ID",
            required: true,
          },
          contract_addresses: {
            flag: "--address <addr>",
            description: "Contract address",
            required: true,
          },
        },
      },
      {
        name: "simulate",
        description: "Simulate a transaction",
        tool: "simulate_evm_transaction",
        args: {
          chain_id: {
            flag: "--chain <id>",
            description: "Chain ID (1=ETH)",
            required: true,
          },
          from: {
            flag: "--from <addr>",
            description: "Sender address",
            required: true,
          },
          to: {
            flag: "--to <addr>",
            description: "Contract/recipient address",
            required: true,
          },
          data: {
            flag: "--data <hex>",
            description: "Transaction calldata (hex)",
          },
          value: { flag: "--value <wei>", description: "Value in wei" },
        },
      },
      {
        name: "rugpull",
        description: "Detect rug pull indicators",
        tool: "detect_rugpull",
        args: {
          chain_id: {
            flag: "--chain <id>",
            description: "Chain ID",
            required: true,
          },
          contract_addresses: {
            flag: "--address <addr>",
            description: "Contract",
            required: true,
          },
        },
      },
      {
        name: "hacks",
        description: "Recent DeFi hacks",
        tool: "defillama_get_hacks",
      },
    ],
  },
  {
    name: "prediction",
    description:
      "Prediction markets — events, traders, outcomes (Polymarket, Kalshi)",
    commands: [
      {
        name: "categories",
        description: "Prediction market categories",
        tool: "codex_prediction_categories",
      },
      {
        name: "events",
        description: "Filter prediction events",
        tool: "codex_filter_prediction_events",
        args: {
          phrase: {
            flag: "--query <text>",
            description: "Search phrase",
            required: false,
          },
        },
      },
      {
        name: "markets",
        description: "Filter prediction markets",
        tool: "codex_filter_prediction_markets",
        args: {
          phrase: {
            flag: "--query <text>",
            description: "Search phrase",
            required: false,
          },
        },
      },
      {
        name: "traders",
        description: "Top prediction market traders",
        tool: "codex_filter_prediction_traders",
      },
    ],
  },
  {
    name: "exchange",
    description:
      "Centralized exchange data — tickers, orderbooks, trades, funding",
    commands: [
      {
        name: "ticker",
        description: "Exchange ticker",
        tool: "get_ticker",
        args: {
          exchange: {
            flag: "--exchange <name>",
            description: "Exchange (binance, coinbase)",
            required: true,
          },
          symbol: {
            flag: "--symbol <pair>",
            description: "Trading pair (BTC/USDT)",
            required: true,
          },
        },
      },
      {
        name: "orderbook",
        description: "Order book depth",
        tool: "get_orderbook",
        args: {
          exchange: {
            flag: "--exchange <name>",
            description: "Exchange",
            required: true,
          },
          symbol: {
            flag: "--symbol <pair>",
            description: "Trading pair",
            required: true,
          },
        },
      },
      {
        name: "trades",
        description: "Recent trades",
        tool: "get_recent_trades",
        args: {
          exchange: {
            flag: "--exchange <name>",
            description: "Exchange",
            required: true,
          },
          symbol: {
            flag: "--symbol <pair>",
            description: "Trading pair",
            required: true,
          },
        },
      },
      {
        name: "funding",
        description: "Perpetual funding rates",
        tool: "get_funding_rate",
        args: {
          exchange: {
            flag: "--exchange <name>",
            description: "Exchange (binance, bybit)",
            required: true,
          },
          symbol: {
            flag: "--symbol <pair>",
            description: "Futures pair (e.g. BTC/USDT:USDT)",
            required: true,
          },
        },
      },
      {
        name: "list",
        description: "List all exchanges",
        tool: "get_exchanges",
      },
    ],
  },
  {
    name: "dex",
    description: "DEX analytics — pools, trending pairs, trades, volume",
    commands: [
      {
        name: "trending",
        description: "Trending DEX pools",
        tool: "get_trending_pools",
      },
      {
        name: "pools",
        description: "Pool search and filter",
        tool: "get_pools",
        args: {
          network: {
            flag: "--network <name>",
            description: "Network (eth, bsc, solana)",
            required: true,
          },
          page: { flag: "--page <n>", description: "Page number" },
        },
      },
      {
        name: "trades",
        description: "Token trading activity",
        tool: "get_token_trades",
        args: {
          network: {
            flag: "--network <name>",
            description: "Network (eth, bsc, solana)",
          },
          pool_address: { flag: "--pool <addr>", description: "Pool address" },
        },
      },
      {
        name: "volume",
        description: "DEX volume rankings",
        tool: "get_dex_volumes",
      },
      {
        name: "pairs",
        description: "Token trading pairs",
        tool: "get_token_pools",
        args: {
          network: {
            flag: "--network <name>",
            description: "Network",
            required: true,
          },
          token_address: {
            flag: "--token <addr>",
            description: "Token address",
            required: true,
          },
        },
      },
    ],
  },
  {
    name: "wallet",
    description:
      "On-chain wallet data — balances, transfers, transactions, approvals",
    commands: [
      {
        name: "balances",
        description: "Token balances across chains",
        tool: "goldrush_get_multichain_balances",
        args: {
          walletAddress: {
            flag: "--address <addr>",
            description: "Wallet address",
            required: true,
          },
        },
      },
      {
        name: "transfers",
        description: "ERC-20 transfers",
        tool: "goldrush_get_erc20_transfers",
        args: {
          walletAddress: {
            flag: "--address <addr>",
            description: "Wallet address",
            required: true,
          },
          chainName: {
            flag: "--chain <name>",
            description: "Chain name",
            required: true,
          },
        },
      },
      {
        name: "transactions",
        description: "Recent transactions",
        tool: "goldrush_get_transactions_latest",
        args: {
          walletAddress: {
            flag: "--address <addr>",
            description: "Wallet address",
            required: true,
          },
          chainName: {
            flag: "--chain <name>",
            description: "Chain name",
            required: true,
          },
        },
      },
      {
        name: "approvals",
        description: "Token approval audit",
        tool: "goldrush_get_token_approvals",
        args: {
          walletAddress: {
            flag: "--address <addr>",
            description: "Wallet address",
            required: true,
          },
          chainName: {
            flag: "--chain <name>",
            description: "Chain name",
            required: true,
          },
        },
      },
    ],
  },
  {
    name: "nft",
    description: "NFT analytics — collections, markets, trends, holders",
    commands: [
      {
        name: "trending",
        description: "Trending NFT collections",
        tool: "get_nft_market_trends",
      },
      {
        name: "collection",
        description: "Collection details",
        tool: "get_nft_collection",
        args: {
          slug: { flag: "--slug <name>", description: "Collection slug" },
        },
      },
      {
        name: "markets",
        description: "NFT marketplace data",
        tool: "get_nft_markets",
      },
      {
        name: "search",
        description: "Search NFT collections",
        tool: "search_nfts",
        args: {
          query: {
            flag: "--query <text>",
            description: "Search term",
            required: true,
          },
        },
      },
    ],
  },
  {
    name: "network",
    description:
      "Blockchain infrastructure — chains, gas, blocks, transactions",
    commands: [
      {
        name: "chains",
        description: "List supported chains",
        tool: "goldrush_get_chains",
      },
      {
        name: "gas",
        description: "Gas prices",
        tool: "goldrush_get_gas_prices",
        args: {
          chainName: {
            flag: "--chain <name>",
            description: "Chain name",
            required: true,
          },
        },
      },
      {
        name: "block",
        description: "Block data",
        tool: "goldrush_get_block",
        args: {
          chainName: {
            flag: "--chain <name>",
            description: "Chain name",
            required: true,
          },
          blockHeight: {
            flag: "--height <n>",
            description: "Block height",
            required: true,
          },
        },
      },
      {
        name: "resolve",
        description: "Resolve ENS/DNS name",
        tool: "goldrush_resolve_address",
        args: {
          chainName: {
            flag: "--chain <name>",
            description: "Chain name",
            required: true,
          },
          walletAddress: {
            flag: "--address <addr>",
            description: "Address or ENS name",
            required: true,
          },
        },
      },
    ],
  },
  {
    name: "search",
    description: "Search across all data",
    commands: [
      {
        name: "tokens",
        description: "Search tokens",
        tool: "search_all",
        args: {
          query: {
            flag: "--query <text>",
            description: "Search term",
            required: true,
          },
        },
      },
      {
        name: "pools",
        description: "Search DEX pools",
        tool: "search_pools",
        args: {
          query: {
            flag: "--query <text>",
            description: "Search term",
            required: true,
          },
        },
      },
    ],
  },
];

export function resolveCommand(
  domain: string,
  subcommand: string,
): SubCommand | undefined {
  const d = NAMESPACE.find((n) => n.name === domain);
  return d?.commands.find((c) => c.name === subcommand);
}

export function getAllDomainCommands(): DomainCommand[] {
  return NAMESPACE;
}
