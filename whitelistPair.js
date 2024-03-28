const { ethers } = require('ethers');
const { abi } = require('./artifacts/contracts/aat.sol/AAT.json');

const yaml = require('js-yaml');
const fs = require('fs');



const network = 'https://mumbai.polygonscan.com/tx/';

async function whitelistPair() {
    try {
        // Read YAML config file
        const config = await yaml.load(fs.readFileSync('./config.yaml', 'utf8'));

        const JsonRpcProvider = config.jsonRpcProvider;

        const provider = new ethers.providers.JsonRpcProvider(JsonRpcProvider);
        const privateKey = config.ownerPrivateKey; //owner private key here
        const wallet = new ethers.Wallet(privateKey, provider);

        const contractAddress = config.aatTokenAddress; // Put AAT token address here
        const aatContract = new ethers.Contract(contractAddress, abi, wallet);

        const pair = config.pairAddress;
        const router = config.routerAddress;
        // Whitelist user
        const whitelistTx = await aatContract.whitelisting(pair, true);
        await whitelistTx.wait();

        console.log(`Whitelisting successful for pair: ${pair}`);
        const pairTxLink = network + whitelistTx.hash;
        console.log("Whitelisting Transaction link:", pairTxLink);
        config.pairTransactionLink = pairTxLink;

        const whitelistTx2 = await aatContract.whitelisting(router, true);
        await whitelistTx2.wait();

        console.log(`Whitelisting successful for router: ${router}`);
        const routerTxLink = network + whitelistTx2.hash;
        console.log("Whitelisting Transaction link:", routerTxLink);
        config.routerTransactionLink = routerTxLink;

        // Update YAML file
        await fs.writeFileSync('./config.yaml', yaml.dump(config), 'utf8');
    } catch (error) {
        console.error('Error:', error);
    }
}

module.exports = whitelistPair;
