const { ethers } = require('ethers');
const { uniswapv2 } = require('./abi/router.json');
const { abi } = require('./artifacts/contracts/aat.sol/ERC20.json');
const yaml = require('js-yaml');
const fs = require('fs');


const network = 'https://mumbai.polygonscan.com/tx/';


async function swapTokens() {
    try {// Read YAML config file
        const config = await yaml.load(fs.readFileSync('./config.yaml', 'utf8'));
        
        const JsonRpcProvider = config.jsonRpcProvider;
        
        const provider = new ethers.providers.JsonRpcProvider(JsonRpcProvider);
        const contractAddress = config.routerAddress; // mumbai router address
        
        const aatAddress = config.aatTokenAddress; // Put Address of the AAT token
        const usdt = config.usdtAddress; // Put usdt token address
        
        const amountIn = ethers.utils.parseUnits('10', 18); // Put Amount of USDT tokens to swap with decimals of the token
        const amountOutMin = 0; // Minimum amount of USDT tokens expected to receive
        const path = [aatAddress, usdt]; // AAT to usdt
        
        const users = config.userAddresses;

        // Swap tokens for each user
        for (const user of users) {

            const { address, key } = user;

            // Create wallet for the user
            const wallet = new ethers.Wallet(key, provider);
            const routerContract = new ethers.Contract(contractAddress, uniswapv2, wallet);

            // Approve spending AAT tokens by the router contract
            const aatContract = new ethers.Contract(aatAddress, abi, wallet);
            const approveAAT = await aatContract.approve(contractAddress, amountIn);
            await approveAAT.wait();
            console.log("AAT approval tx:", approveAAT.hash);

            // Execute the swap
            const tx = await routerContract.swapExactTokensForTokens(
                amountIn,
                amountOutMin,
                path,
                user.address,
                Math.floor(Date.now() / 1000) + 60 * 10 // Deadline for the transaction (10 minutes from now)
            );

            // Wait for the transaction to be mined
            await tx.wait();
            console.log(`Swap successful for user ${user.address}`);
            console.log("Swapping transaction hash link:", network + tx.hash);
        }
    } catch (error) {
        console.error(error);
    }
}
module.exports = swapTokens;

