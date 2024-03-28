const { ethers } = require('ethers');
const { uniswapv2 } = require('./abi/router.json');
const { abi } = require('./artifacts/contracts/aat.sol/ERC20.json');

const yaml = require('js-yaml');
const fs = require('fs');


const network = 'https://mumbai.polygonscan.com/tx/';
async function approveAndAddLiquidity() {
    try {
        // Read YAML config file
        const config = await yaml.load(fs.readFileSync('./config.yaml', 'utf8'));

        const JsonRpcProvider = config.jsonRpcProvider;

        const provider = new ethers.providers.JsonRpcProvider(JsonRpcProvider);
        const privateKey = config.ownerPrivateKey; //owner private key here
        const wallet = new ethers.Wallet(privateKey, provider);

        const contractAddress = config.routerAddress; //mumbai router address
        const routerContract = new ethers.Contract(contractAddress, uniswapv2, wallet);

        const tokenAAddress = config.aatTokenAddress; // Address of the AAT token
        const tokenBAddress = config.usdtAddress; // Address of USDT or another token
        const amountADesired = ethers.utils.parseUnits(config.amountTokenA, 18); // Put Amount of AAT tokens you want to provide with decimals of that token
        const amountBDesired = ethers.utils.parseUnits(config.amountTokenB, 6); // Put Amount of USDT or another token you want to provide with decimals of that token
        const amountAMin = ethers.utils.parseUnits('0', 18); // Minimum amount of AAT tokens you expect to receive
        const amountBMin = ethers.utils.parseUnits('0', 6); // Minimum amount of USDT or another token you expect to receive
        const to = wallet.address; // Your address or another recipient's address
        const deadline = Math.floor(Date.now() / 1000) + 60 * 10; // Deadline for the transaction (10 minutes from now)
        const aatContract = new ethers.Contract(tokenAAddress, abi, wallet);
        const usdtContract = new ethers.Contract(tokenBAddress, abi, wallet);
        // Approve spending AAT tokens by the router contract
        const approveAAT = await aatContract.approve(contractAddress, amountADesired);
        await approveAAT.wait();
        console.log("AAT Approval txn hash:", approveAAT.hash);

        // Approve spending USDT tokens by the router contract
        const approveUSDT = await usdtContract.approve(contractAddress, amountBDesired);
        await approveUSDT.wait();
        console.log("USDT Approval txn hash:", approveUSDT.hash);

        // Add liquidity after approval
        const tx = await routerContract.addLiquidity(
            tokenAAddress,
            tokenBAddress,
            amountADesired,
            amountBDesired,
            amountAMin,
            amountBMin,
            to,
            deadline
        );

        // Wait for the transaction to be mined
        await tx.wait();
        console.log('Adding Liquidity Transaction Hash Link:', network + tx.hash);
        config.addLiquidityTransactionLink = network + tx.hash;

        // Update YAML file
        await fs.writeFileSync('./config.yaml', yaml.dump(config), 'utf8');
    } catch (error) {
        console.error('Error adding liquidity:', error);
    }
}

module.exports = approveAndAddLiquidity;

