const ethers = require('ethers');

let mnemonic = 'alcohol paper similar family display almost hope trip erosion exit barrel claw';

let mnemonicWallet = ethers.Wallet.fromMnemonic(mnemonic, 'm/44\'/60\'/0\'/0/0');
console.log(mnemonicWallet.privateKey);
console.log(mnemonicWallet.getAddress());

mnemonicWallet = ethers.Wallet.fromMnemonic(mnemonic, 'm/44\'/60\'/0\'/0/1');
console.log(mnemonicWallet.privateKey);
console.log(mnemonicWallet.getAddress());

mnemonicWallet = ethers.Wallet.fromMnemonic(mnemonic, 'm/44\'/60\'/0\'/0/2');
console.log(mnemonicWallet.privateKey);
console.log(mnemonicWallet.getAddress());

mnemonicWallet = ethers.Wallet.fromMnemonic(mnemonic, 'm/44\'/60\'/0\'/0/3');
console.log(mnemonicWallet.privateKey);
console.log(mnemonicWallet.getAddress());

mnemonicWallet = ethers.Wallet.fromMnemonic(mnemonic, 'm/44\'/60\'/0\'/0/4');
console.log(mnemonicWallet.privateKey);
console.log(mnemonicWallet.getAddress());
mnemonicWallet = ethers.Wallet.fromMnemonic(mnemonic, 'm/44\'/60\'/0\'/0/5');
console.log(mnemonicWallet.privateKey);
console.log(mnemonicWallet.getAddress());
