# Social Bureau contracts

This project is for social bureau project, to create, test and deploy contracts to block chain

## Deployed on Goerli

| name               | contract address                             |
|--------------------|----------------------------------------------|
| JUTC Token         | `0xeF6ddE8B6AcB3876740F8A163620183Cf7cb539f` |
| SocialBureauCoreV1 | `0x3067A9Cb3E324B6cc161ef24bc870516DD167eAE` |

## Prerequisite

Create `.env` file using template from `.env.example` and change the `MNEMONIC` key.

## Deployment

The deployment details is located in deployments directory, and deploy script is located in deploy directory.

## Commands

Install package

```shell
npm install
```

Compile contracts

```shell
npx hardhat compile
```

Deploy to testnet

```shell
npx hardhat deploy --network goerli
```

Verify contracts on goerli

```shell
npm run verify:goerli
```
