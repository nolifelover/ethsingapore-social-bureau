// This is a script for deploying your contracts. You can adapt it to deploy
// yours, or create new ones.
const {ethers, upgrades} = require("hardhat");
const { BN, balance, ether, expectRevert, time } = require('@openzeppelin/test-helpers');
const { BigNumber }= require('ethers');

async function main() {

  const [deployer, devWallet, alice, bob] = await ethers.getSigners();
  console.log("Deploying the contracts with the account:", await deployer.getAddress() );



}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
