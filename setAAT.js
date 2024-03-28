const { ethers } = require('ethers');
const { abi } = require('./artifacts/contracts/astFactory.sol/ASTTokenFactory.json');
const yaml = require('js-yaml');
const fs = require('fs');



const network = 'https://mumbai.polygonscan.com/tx/';
async function setAATToken() {
    try {

        // Read YAML config file
        const config = await yaml.load(fs.readFileSync('./config.yaml', 'utf8'));

        const JsonRpcProvider = config.jsonRpcProvider;
        const provider = new ethers.providers.JsonRpcProvider(JsonRpcProvider);
        const privateKey = config.ownerPrivateKey;// owner private key 

        const wallet = new ethers.Wallet(privateKey, provider);

        const contractAddress = config.factoryAddress; //AST token factory address here
        const aatToken = config.aatTokenAddress; //AAT token address here
        const contract = new ethers.Contract(contractAddress, abi, wallet);
        const tx = await contract.setAATToken(aatToken);

        // Wait for the transaction to be mined
        await tx.wait();
        const txLink = network + tx.hash;
        console.log("Setting AAT Transaction link:", txLink);
        config.settingAATTransactionLink = txLink;
        await fs.writeFileSync('./config.yaml', yaml.dump(config), 'utf8');
    } catch (error) {
        console.error('Error setting AAT Token:', error);
    }
}
module.exports = setAATToken;

