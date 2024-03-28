const yaml = require('js-yaml');
const fs = require('fs');
const main = require("./scripts/deploy");
const setAATToken = require('./setAAT');
const { ethers } = require('hardhat');
const createASTToken = require('./createAST');
const createPair = require('./createPair');
const whitelistPair = require('./whitelistPair');
const approveAndAddLiquidity = require('./addLiquidity');
const whitelist = require('./whitelist');
const transfer = require('./transfer');
const swapTokens = require('./swap');

async function deploy() {
  try {
    console.log("Beginning deployment...");
    const config = await yaml.load(fs.readFileSync('./config.yaml', 'utf8'));

    if (!config.factoryAddress && !config.aatTokenAddress) {
      console.log("Deployment required. Initiating deployment...");
      await main();
      await setAATToken();
      console.log("Deployment successful.");
    } else {
      console.log("Factory address and AAT token address already exist in config.yaml. Skipping deployment.");
    }
    // After deployment, proceed to create AST tokens
    await createASTs();

    // After creating AST tokens, create pair
    await createPairAddress();

    // After creating pairs, whitelist pair and router
    await whitelistPairAndRouter();

    // After whitelisting, add liquidity
    await addLiquidity();

    // whitelisting the users
    await whitelisting();
 
    //aat transfers
    await transferAAT();

    //swap aat to usdt by the users
    await swapping();
  } catch (error) {

  }

}

deploy()


async function createASTs() {
  try {
    const config = await yaml.load(fs.readFileSync('./config.yaml', 'utf8'));

    for (let i = 0; i < config.tokens.length; i++) {
      const tokenConfig = config.tokens[i];
      const { name, symbol, totalSupply, ratio, lockedPercentage, aatPercentage } = tokenConfig;

      // Create AST token with the token configuration
      const latestASTAddress = await createASTToken(name, symbol, totalSupply, ratio, lockedPercentage, aatPercentage);

      // Update config with the latest AST token address
      config[`astTokenAddress${i + 1}`] = latestASTAddress;

      console.log(`AST Token ${name} created successfully with address: ${latestASTAddress}`);
    }

    // Write updated config back to YAML file
    fs.writeFileSync('./config.yaml', yaml.dump(config));
    console.log("AST Token addresses updated in config.yaml");
  } catch (error) {
    console.error('Error creating AST tokens:', error);
  }
}

async function createPairAddress() {
  try {
    await createPair();
  }
  catch (error) {
    console.error('Error creating Pair:', error);
  }
}

async function whitelistPairAndRouter() {
  try {
    await whitelistPair();
  }
  catch (error) {
    console.error('Error Whitelisting Pair:', error);
  }
}

async function addLiquidity() {
  try {
    await approveAndAddLiquidity();
  }
  catch (error) {
    console.error('Error Adding liquidity:', error);
  }
}

async function whitelisting() {
  try {
    await whitelist();
  }
  catch (error) {
    console.error('Error Whitelisting users:', error);
  }
}

async function transferAAT() {
  try {
    await transfer();
  }
  catch (error) {
    console.error('Error transferring tokens to users:', error);
  }
}

async function swapping() {
  try {
    await swapTokens();
  }
  catch (error) {
    console.error('Error swapping tokens:', error);
  }
}

