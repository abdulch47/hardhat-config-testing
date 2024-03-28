const { ethers } = require('ethers');
const { uniFactory } = require('./abi/uniFactory.json');
const yaml = require('js-yaml');
const fs = require('fs');


const network = 'https://mumbai.polygonscan.com/tx/';

async function createPair() {
    try {
        // Read YAML config file
        const config = await yaml.load(fs.readFileSync('./config.yaml', 'utf8'));

        const JsonRpcProvider = config.jsonRpcProvider;

        const provider = new ethers.providers.JsonRpcProvider(JsonRpcProvider);
        const privateKey = config.ownerPrivateKey; //owner private key here
        const wallet = new ethers.Wallet(privateKey, provider);

        const contractAddress = config.mumbaiFactoryAddress; // Mumbai router factory address
        const factoryContract = new ethers.Contract(contractAddress, uniFactory, wallet);
        const aatToken = config.aatTokenAddress; // AAT token address
        const usdtToken = config.usdtAddress; // USDT or other token address

        // Create a pair of the AAT token with USDT 
        const pairTx = await factoryContract.createPair(aatToken, usdtToken);
        await pairTx.wait();
        const txLink = network + pairTx.hash;
        console.log("Creating pair Transaction link:", txLink);

        // Update config object with transaction link
        config.creatingPairTransactionLink = txLink;

        // Retrieve the address of the newly created pair
        const pairAddress = await factoryContract.getPair(aatToken, usdtToken);
        console.log("Successfully created a pair with address:", pairAddress);

        // Update config object with new pair address
        config.pairAddress = pairAddress;

        // Write updated config back to YAML file
        await fs.writeFileSync('./config.yaml', yaml.dump(config), 'utf8');
    } catch (error) {
        console.log("Error while creating pair:", error);
    }
}

module.exports = createPair;
