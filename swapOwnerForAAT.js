const { ethers } = require('ethers');
const { uniswapv2 } = require('./abi/router.json');
const { abi } = require('./artifacts/contracts/aat.sol/ERC20.json');

const provider = new ethers.providers.JsonRpcProvider('https://polygon-mumbai.g.alchemy.com/v2/dI0KUb7ExII5YEn9vl5-IL0tVN2YCl1f');

const contractAddress = '0x8954AfA98594b838bda56FE4C12a09D7739D179b'; //mumbai router address

const aatAddress = ''; // Put Address of the AAT token here
const usdtAddress = ''; // Put USDT token address here

const amountIn = ethers.utils.parseUnits('500000', 6); // Put Amount of usdt tokens to swap with decimals here
const amountOutMin = 0; // Minimum amount of USDT tokens expected to receive
const path = [usdtAddress, aatAddress]; // USDT To AAT
const assetOwner = '';// Put asset owner address here
const ownerKey = '';//Put asset private key here

async function swapTokens() {
    try {
            // Create wallet for the user
            const wallet = new ethers.Wallet(ownerKey, provider);
            const routerContract = new ethers.Contract(contractAddress, uniswapv2, wallet);

            // Approve spending USDT tokens by the router contract
            const usdtContract = new ethers.Contract(usdtAddress, abi, wallet);
            const approveUSDT = await usdtContract.approve(aatAddress, amountIn);
            await approveUSDT.wait();
            console.log("USDT approval tx:", approveUSDT.hash);
            
            // Execute the swap
            const tx = await routerContract.swapExactTokensForTokens(
                amountIn,
                amountOutMin,
                path,
                assetOwner,
                Math.floor(Date.now() / 1000) + 60 * 10 // Deadline for the transaction (10 minutes from now)
            );

            // Wait for the transaction to be mined
            await tx.wait();
            console.log(`Swap successful for user ${assetOwner}. Transaction hash:`, tx.hash);
    } catch (error) {
        console.error(error);
    }
}
swapTokens();

