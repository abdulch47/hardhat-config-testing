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

const contractAddress = ''; // put AST token factory address here
const contract = new ethers.Contract(contractAddress, abi, wallet);


async function burnAATTokens() {
    try {
        const amountToBurn = ethers.utils.parseUnits('500000000', 18);  // Replace with the amount you want to burn with token decimals
        const astTokenAddress = '';  // Replace with the actual AST token address here

        // Call burnAAT function
        const burnTx = await contract.burnAAT(amountToBurn, astTokenAddress);
        await burnTx.wait();

        console.log('AAT tokens burned successfully with tx hash:', burnTx.hash);
    } catch (error) {
        console.error('Error burning AAT tokens:', error);
    }
}

burnAATTokens();
