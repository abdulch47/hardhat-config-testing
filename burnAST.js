const { ethers } = require('ethers');
const { abi } = require('./artifacts/contracts/astFactory.sol/ASTTokenFactory.json');
const yaml = require('js-yaml');
const fs = require('fs');

// Read YAML config file
const config = yaml.load(fs.readFileSync('./config.yaml', 'utf8'));

const JsonRpcProvider = config.jsonRpcProvider;

const provider = new ethers.providers.JsonRpcProvider(JsonRpcProvider);
const privateKey = config.ownerPrivateKey; //owner private key here
const wallet = new ethers.Wallet(privateKey, provider);

const contractAddress = config.factoryAddress; // Put AST token Factory here
const contract = new ethers.Contract(contractAddress, abi, wallet);


async function burnAstToken(astTokenAddress) {
    try {

        // Call burnAstToken function
        const burnTx = await contract.burnAstToken(astTokenAddress);
        await burnTx.wait();

        console.log('AST tokens burned successfully with tx hash:', burnTx.hash);
    } catch (error) {
        console.error('Error burning AST tokens:', error);
    }
}

burnAstToken();
