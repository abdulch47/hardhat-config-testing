const { ethers } = require('ethers');
const { abi } = require('./artifacts/contracts/aat.sol/AAT.json');

const yaml = require('js-yaml');
const fs = require('fs');


const network = 'https://mumbai.polygonscan.com/tx/';

async function transfer() {
    try {
        // Read YAML config file
        const config = await yaml.load(fs.readFileSync('./config.yaml', 'utf8'));

        const JsonRpcProvider = config.jsonRpcProvider;

        const provider = new ethers.providers.JsonRpcProvider(JsonRpcProvider);
        const privateKey = config.ownerPrivateKey; //owner private key here
        const wallet = new ethers.Wallet(privateKey, provider);

        const contractAddress = config.aatTokenAddress; // Put AAT token address here
        const aatContract = new ethers.Contract(contractAddress, abi, wallet);

        const userAddresses = config.userAddresses; //user addresses
        for (const userAddress of userAddresses) {
            const{address, key} = userAddress;
            // Transfer tokens
            const transferTx = await aatContract.transfer(address, ethers.utils.parseUnits('1000', 18)); //put amount tokens with decimals here
            await transferTx.wait();

            console.log(`Transfer successful for user: ${address}`);
            console.log("Tokens transfer transaction hash link:", network + transferTx.hash);
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

module.exports = transfer;