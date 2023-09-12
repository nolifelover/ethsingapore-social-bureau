const { expect } = require('chai');
const { BN, balance, ether, expectRevert, time } = require('@openzeppelin/test-helpers');
const { BigNumber } = require('ethers');
const { ethers, upgrades } = require('hardhat');

describe('Default', function () {
  let Sample;
  let sample;

  let owner;
  let feeCollector;
  let manager;
  let alice;
  let bob;
  let _provider;

  const ROLE_MANAGER = ethers.utils.id('MANAGER_ROLE');
  const DEFAULT_ADMIN_ROLE = '0x0000000000000000000000000000000000000000000000000000000000000000';
  const ONE_ETH = BigNumber.from(ether('1').toString());
  const TWO_ETH = BigNumber.from(ether('2').toString());
  let fee = BigNumber.from(ether('1').toString());

  before(async function () {
    [owner, feeCollector, manager, alice, bob, ...addrs] = await ethers.getSigners();

    Sample = await ethers.getContractFactory('Sample');
    sample = await Sample.deploy(fee, feeCollector.address);

    _provider = await sample.provider;
  });

  describe('Deploy', function () {
    it('Should have correct default config', async function () {

    });
  });
});
