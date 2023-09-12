var bip39 = require('bip39');
const ethers = require('ethers');

const mnemonic = bip39.generateMnemonic();
console.log(mnemonic);

let mnemonicWallet = ethers.Wallet.fromMnemonic(mnemonic);
console.log(mnemonicWallet.privateKey);
