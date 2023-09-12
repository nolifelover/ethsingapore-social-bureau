const {BigNumber} = require('ethers');
const {BN, balance, ether, expectRevert, time} = require('@openzeppelin/test-helpers');
const contractName = 'SocialBureauCoreV1';

module.exports = async function ({ethers, network, getNamedAccounts, deployments}) {
  const {provider} = ethers;
  const {deploy} = deployments;
  const {deployer} = await getNamedAccounts();

  const balance = await provider.getBalance(deployer);
  console.log(`Remaining balance is: ${balance}`);

  const chainId = network.config.chainId;
  const jutc = await ethers.getContract('JUTC')
  console.log(`jutc address : ${jutc.address}`)
  const contract = await deploy(contractName, {
    from: deployer,
    args: [jutc.address],
    log: true,
    deterministicDeployment: false,
  });
  const ROLE_MINTER = ethers.utils.id('MINTER_ROLE');
  await jutc.grantRole(ROLE_MINTER, contract.address);
  console.log(`Contract ${contractName} was deployed at address ${contract.address}`);
};

module.exports.tags = [contractName];
module.exports.dependencies = ['JUTC'];
