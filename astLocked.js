const { ethers } = require('ethers');
const { abi } = require('./artifacts/contracts/aat.sol/AAT.json');

const yaml = require('js-yaml');
const fs = require('fs');

// Read YAML config file
const config = yaml.load(fs.readFileSync('./config.yaml', 'utf8'));
const provider = new ethers.providers.JsonRpcProvider('https://polygon-mumbai.g.alchemy.com/v2/dI0KUb7ExII5YEn9vl5-IL0tVN2YCl1f');

const contractAddress = config.aatTokenAddress; // Put AAT token address here
const aatContract = new ethers.Contract(contractAddress, abi, provider);

const tokenAddress = ''; //AST token address

async function readAstTokenBalance() {
            const balance = await aatContract.astTokenBalance(tokenAddress);
            console.log(`AST Token balance in AAT ${tokenAddress}: ${balance.toString()}`);
        }

readAstTokenBalance();
