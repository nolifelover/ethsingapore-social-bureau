const { expect } = require('chai');
const { BN, balance, ether, expectRevert, time } = require('@openzeppelin/test-helpers');
const { BigNumber } = require('ethers');
const { ethers, upgrades } = require('hardhat');

describe('Default', function () {
  let Contract;
  let contract;

  let Token;
  let token;

  let owner;
  let manager;
  let alice;
  let bob;
  let _provider;

  const ROLE_MANAGER = ethers.utils.id('MANAGER_ROLE');
  const ROLE_MINTER = ethers.utils.id('MINTER_ROLE');
  const DEFAULT_ADMIN_ROLE = '0x0000000000000000000000000000000000000000000000000000000000000000';
  const ONE_ETH = BigNumber.from(ether('1').toString());
  const TO_STAKE = BigNumber.from(ether('50').toString());
  const HUNDRED_ETH = BigNumber.from(ether('100').toString());

  before(async function () {
    [owner, feeCollector, manager, alice, bob, ...addrs] = await ethers.getSigners();

    Token = await ethers.getContractFactory('JUTC');
    token = await Token.deploy();
    await token.deployed();

    Contract = await ethers.getContractFactory('SocialBureauCoreV1');
    contract = await Contract.deploy(token.address);
    await contract.deployed();

    _provider = await contract.provider;

    // add token minter role to core
    console.log(ROLE_MINTER);
    await token.grantRole(ROLE_MINTER, contract.address);
  });

  describe('Deploy', function () {
    it('Should have correct default config / token address', async function () {
      expect(await contract.tokenAddress()).equals(token.address);
    });
  });

  describe('Operation', function () {
    it('Should faucet correctly', async function () {
      expect(await token.balanceOf(alice.address)).equals(0);
      await contract.connect(alice).faucet();
      expect(await token.balanceOf(alice.address)).equals(TO_STAKE);
    });

    it('Should check is staked correctly', async function () {
      expect(await (contract.isStaked(alice.address))).equals(false);
    });

    it('Should stake correctly', async function () {
      expect(await token.balanceOf(alice.address)).equals(TO_STAKE);
      await token.connect(alice).approve(contract.address, TO_STAKE);
      await contract.connect(alice).stake();
      expect(await token.balanceOf(alice.address)).equals(0);
    });

    it('Should check is staked correctly', async function () {
      expect(await (contract.isStaked(alice.address))).equals(true);
    });

    it('Should check is inspector correctly', async function () {
      expect(await (contract.isInspector(alice.address))).equals(true);
    });

    it('Should bob zap correctly', async function () {
      expect(await token.balanceOf(bob.address)).equals(0);
      await contract.connect(bob).zap();
      expect(await token.balanceOf(bob.address)).equals(0);
    });

    it('Should check bob is inspector correctly', async function () {
      expect(await (contract.isInspector(bob.address))).equals(true);
    });

    it('Should core has balance correctly', async function () {
      expect(await token.balanceOf(contract.address)).equals(HUNDRED_ETH);
    });

    it('Should alice and bob can unstake correctly', async function () {
      expect(await token.balanceOf(bob.address)).equals(0);
      await contract.connect(bob).unstake();
      expect(await token.balanceOf(bob.address)).equals(TO_STAKE);

      expect(await token.balanceOf(alice.address)).equals(0);
      await contract.connect(alice).unstake();
      expect(await token.balanceOf(alice.address)).equals(TO_STAKE);

      expect(await token.balanceOf(contract.address)).equals(0);
    });

    it('Should bob stake correctly', async function () {
      expect(await token.balanceOf(bob.address)).equals(TO_STAKE);
      await token.connect(bob).approve(contract.address, TO_STAKE);
      await contract.connect(bob).stake();
      expect(await token.balanceOf(bob.address)).equals(0);
      expect(await (contract.isInspector(bob.address))).equals(true);
    });

    it('Should bob is slash correctly', async function () {

      expect(await (contract.isInspector(bob.address))).equals(true);
      await contract.slash(bob.address);
      expect(await (contract.isInspector(bob.address))).equals(false);
    });

    it('Should bob unstake will revert correctly', async function () {
      await expect(contract.connect(bob).unstake()).to.be.revertedWith(`you don't have minimum staked`);
    });

  });
});
