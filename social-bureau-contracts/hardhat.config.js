require('@nomiclabs/hardhat-waffle');
require('hardhat-gas-reporter');
require('@nomiclabs/hardhat-web3');
require('./tasks/faucet');
require('./tasks/accounts');
require('dotenv/config');
require('@openzeppelin/hardhat-upgrades');
require('@primitivefi/hardhat-dodoc');
require('hardhat-deploy');
require('hardhat-deploy-ethers');


const accounts = {
  mnemonic: process.env.MNEMONIC || 'test test test test test test test test test test test junk',
};

// If you are using MetaMask, be sure to change the chainId to 1337
module.exports = {
  namedAccounts: {
    deployer: {
      default: 0,
    },
    dev: {
      default: 1,
    },
  },
  gasReporter: {
    currency: 'USD',
    enabled: true,
    excludeContracts: [],
    src: './contracts',
  },
  contractSizer: {
    alphaSort: false,
    runOnCompile: true,
    disambiguatePaths: false,
  },
  dodoc: {
    runOnCompile: false,
    include: [], // default
    exclude: ['contracts/tests', 'contracts/shared', 'console'],
    outputDir: 'docs', // default
    templatePath: 'doc-template.sqrl',
    debugMode: false, // default
    keepFileStructure: true, // default
    freshOutput: true, // default
  },
  solidity: {
    compilers: [
      {
        version: '0.8.9',
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
      {
        version: '0.8.6',
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
      {
        version: '0.7.1',
      },
      {
        version: '0.4.16',
      },
      {
        version: '0.6.6',
      },
      {
        version: '0.8.14',
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
      {
        version: '0.8.0',
      },
    ],
    overrides: {
      'contracts/prototypes/LinkToken.sol': {
        version: '0.4.16',
      },
      'contracts/core/LinkToken.sol': {
        version: '0.4.16',
      },
      'contracts/prototypes/BlockhashStore.sol': {
        version: '0.6.6',
      },
      'contracts/prototypes/MockPriceFeed.sol': {
        version: '0.8.14',
      },
      'contracts/tokens/KDEV.sol': {
        version: '0.8.0',
      },
      'contracts/prototypes/VRFCoordinatorV2.sol': {
        version: '0.8.6',
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
      'contracts/core/VRFCoordinatorV2.sol': {
        version: '0.8.6',
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
    },
  },
  networks: {
    hardhat: {
      chainId: 31337,
      accounts: { mnemonic: 'test test test test test test test test test test test junk' },
      mining: {
        //auto: false,
        //interval: 1000
      },
    },
    localhost: {
      accounts: { mnemonic: 'test test test test test test test test test test test junk' },
      mining: {
        //auto: false,
        //interval: 1000
      },
    },
    bkc: {
      accounts,
      url: 'https://rpc.bitkubchain.io',
      chainId: 96,
    },
    bkc_testnet: {
      accounts,
      url: 'https://rpc-testnet.bitkubchain.io',
      chainId: 25925,
    },
    bkc_testnet_posa: {
      accounts,
      url: 'https://bkc-posa.bitkubchain.io',
      chainId: 25926,
    },
    polygon_testnet: {
      accounts,
      url: 'https://rpc-mumbai.maticvigil.com/',
      chainId: 80001,
    },
    goerli: {
      accounts,
      url: 'https://eth-goerli.public.blastapi.io',
      chainId: 5,
    },
    goerli: {
      accounts,
      url: 'https://eth-goerli.public.blastapi.io',
      chainId: 5,
    },
    taiko: {
      url: 'https://rpc.test.taiko.xyz',
      accounts: accounts,
      chainId: 167005,
    },
  },
  etherscan: {
    apiKey: {
      bkc: 'main',
      bkc_testnet: 'test',
      goerli: 'KBZ53MKPP551QTVDYSV8S961FEUC96F8QW',
      taiko: 'taiko'
    },
    customChains: [
      {
        network: 'bkc_testnet',
        chainId: 25925,
        urls: {
          apiURL: 'https://testnet.bkcscan.com/api',
          browserURL: 'https://testnet.bkcscan.com/'
        }
      },
      {
        network: 'bkc',
        chainId: 96,
        urls: {
          apiURL: 'https://www.bkcscan.com/api',
          browserURL: 'https:///www.bkcscan.com/'
        }
      },
      {
        network: 'taiko',
        chainId: 167005,
        urls: {
          apiURL: 'https://explorer.test.taiko.xyz/api',
          browserURL: 'https://explorer.test.taiko.xyz'
        }
      }
    ]
  }
};
