const {BigNumber} = require('ethers');
const {BN, balance, ether, expectRevert, time} = require('@openzeppelin/test-helpers');
const contractName = 'JUTC';

module.exports = async function ({ethers, network, getNamedAccounts, deployments}) {
  const {provider} = ethers;
  const {deploy} = deployments;
  const {deployer} = await getNamedAccounts();

  const balance = await provider.getBalance(deployer);
  console.log(`Remaining balance is: ${balance}`);

  const chainId = network.config.chainId;
  const contract = await deploy(contractName, {
    from: deployer,
    args: [],
    log: true,
    deterministicDeployment: false,
  });
  console.log(`Contract ${contractName} was deployed at address ${contract.address}`);
};

module.exports.tags = [contractName];
module.exports.dependencies = [];
