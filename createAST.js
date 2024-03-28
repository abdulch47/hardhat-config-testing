const { ethers } = require('ethers');
const { abi } = require('./artifacts/contracts/astFactory.sol/ASTTokenFactory.json');

const yaml = require('js-yaml');
const fs = require('fs');



const network = 'https://mumbai.polygonscan.com/tx/';
async function createASTToken(name, symbol, totalSupply, ratio, lockedPercentage, aatPercentage) {
    try {
        // Read YAML config file
        const config = await yaml.load(fs.readFileSync('./config.yaml', 'utf8'));

        const JsonRpcProvider = config.jsonRpcProvider;

        const provider = new ethers.providers.JsonRpcProvider(JsonRpcProvider);
        const privateKey = config.ownerPrivateKey; //owner private key here
        const wallet = new ethers.Wallet(privateKey, provider);

        const contractAddress = config.factoryAddress; //put AST token factory address here
        const contract = new ethers.Contract(contractAddress, abi, wallet);

        const tx = await contract.createASTToken(name, symbol, totalSupply, ratio, lockedPercentage, aatPercentage);

        // Wait for the transaction to be mined
        await tx.wait();
        console.log('AST Token created succesfully with tx hash link:', network + tx.hash);

        // Call the getASTs function to retrieve the latest AST token address
        const asts = await contract.getASTs();
        const latestASTAddress = asts[asts.length - 1];
        console.log('AST Token address:', latestASTAddress);
        // Update config object with new AST token address
        return latestASTAddress;
    } catch (error) {
        console.error('Error creating AST token:', error);
    }
}
module.exports = createASTToken;