export const CHAIN_IDS = {
  ETH_GOERLI_TESTNET: 5,
  ETH_TAIKO_GRIMSVOTN: 167005,
};

export const SUPPORT_CHAINS = [
  {
    networkAbbr: "goerli",
    chainIdNumber: CHAIN_IDS.ETH_GOERLI_TESTNET,
    chainId: "0x" + CHAIN_IDS.ETH_GOERLI_TESTNET.toString(16),
    chainName: "Goerli Testnet",
    rpcUrls: ["https://eth-goerli.public.blastapi.io"],
    nativeCurrency: {
      name: "GoerliETH",
      symbol: "GoerliETH",
      decimals: 18,
    },
    wssUrls: ["wss://goerli.gateway.tenderly.co"],
    blockExplorerUrls: ["https://goerli.etherscan.io"],
  },
  {
    networkAbbr: "taiko-grimsvotn",
    chainIdNumber: CHAIN_IDS.ETH_TAIKO_GRIMSVOTN,
    chainId: "0x" + CHAIN_IDS.ETH_TAIKO_GRIMSVOTN.toString(16),
    chainName: "Taiko Grimsvotn L2",
    rpcUrls: ["https://rpc.test.taiko.xyz"],
    nativeCurrency: {
      name: "Ethereum",
      symbol: "ETH",
      decimals: 18,
    },
    wssUrls: ["wss://rpc.test.taiko.xyz"],
    blockExplorerUrls: ["https://explorer.test.taiko.xyz"],
  },
];
