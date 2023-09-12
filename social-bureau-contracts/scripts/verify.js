const { ethers } = require('hardhat');
const { getChainId } = require('hardhat');
const fs = require('fs');
const path = require('path');

async function main() {
  const chainId = await getChainId();
  const network = hre.network.name

  //const deployedContracts = require(`../deployments/${network}`);
  const directoryPath = `./deployments/${network}`;
  fs.readdir(directoryPath, (error, files) => {
    if (error) {
      console.error(error);
      return;
    }

    files.filter(file => path.extname(file) === '.json').forEach(async (file) => {
      const filePath = path.join(directoryPath, file);
      const fileContent = fs.readFileSync(filePath, 'utf-8');
      const data = JSON.parse(fileContent);
      try {
        console.log(`Verifying contract at address: ${data.address}`);
        await ethers.provider.getCode(data.address);


        if(data.storageLayout){
          if(data.storageLayout.storage.length > 0){
            await hre.run('verify:verify', {
              address: data.address,
              contract: data.storageLayout.storage[0].contract,
              constructorArguments: data.args
            });
          }else{
            await hre.run('verify:verify', {
              address: data.address,
              constructorArguments: data.args
            });
          }

        }else{
          await hre.run('verify:verify', {
            address: data.address,
            constructorArguments: data.args
          });
        }
      } catch (e) {
        console.error(`Failed to verify contract at address: ${data.address}`);
        console.error(e);
      }
    });
  });


}

main().catch(error => {
  console.error(error);
  process.exit(1);
});
