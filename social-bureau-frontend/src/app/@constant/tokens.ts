import { Token } from "../@model/token";
import { CHAIN_IDS } from "./chains";

export const WRAPPED_NATIVE_CURRENCY = {
  [CHAIN_IDS.ETH_GOERLI_TESTNET]: new Token(
    CHAIN_IDS.ETH_GOERLI_TESTNET,
    "0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6",
    18,
    "WETH",
    "Wrapped Ether",
    true
  ),
};

export const MAIN_USD_CURRENCY = {
  [CHAIN_IDS.ETH_GOERLI_TESTNET]: new Token(
    CHAIN_IDS.ETH_GOERLI_TESTNET,
    "0x07865c6E87B9F70255377e024ace6630C1Eaa37F",
    18,
    "USDC",
    "USD Coin"
  ),
};
