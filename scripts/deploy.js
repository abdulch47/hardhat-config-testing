const yaml = require('js-yaml');
const fs = require('fs');
const { ethers } = require('hardhat');
// const { ethers } = require('ethers');
// Read YAML config file
const config = yaml.load(fs.readFileSync('./config.yaml', 'utf8'));

const poolWalletAddress = config.poolWalletAddress;
const assetLockedWallet = config.assetLockedWallet;

async function main() {  
  // Deploy AST Token Factory
  const factoryAddress = await deployASTTokenFactory();
  
  // Deploy AAT token with the AST Token Factory address as an argument
  const aatAddress = await deployAATToken(factoryAddress);

  // Update config object with new addresses
  config.factoryAddress = factoryAddress;
  config.aatTokenAddress = aatAddress;

  // Write updated config back to YAML file
  await fs.writeFileSync('./config.yaml', yaml.dump(config));

}

async function deployASTTokenFactory() {
  // Get the contract factory for AST Token Factory
  const astTokenFactory = await ethers.getContractFactory("ASTTokenFactory");

  // Deploy the contract
  const myTokenFactory = await astTokenFactory.deploy(poolWalletAddress, assetLockedWallet); // add a pool wallet and asset locked wallet here
  await myTokenFactory.deployTransaction.wait();
  console.log("AST Token Factory Contract Address:", myTokenFactory.address);

  return myTokenFactory.address;
}

async function deployAATToken(factoryAddress) {
  // Get the contract factory for AAT Token
  const aatToken = await ethers.getContractFactory("AAT");

  // Deploy the contract with the AST Token Factory address as an argument
  const myToken = await aatToken.deploy(factoryAddress); 
  await myToken.deployTransaction.wait();
  console.log("AAT Token Contract Address:", myToken.address);

  return myToken.address;
}

module.exports = main;
