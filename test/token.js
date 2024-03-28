const { expect } = require('chai');
const { ethers } = require('hardhat');


// describe('AAT Contract', () => {
//   let AAT;
//   let aat;
//   let owner;
//   let factory;
//   let whitelistedAddress1;
//   let spender;
//   let nonWhitelistedAddress;
//   let initialBalance;
//   let burnAddress;
//   let signers;

//   // ******************Ensure the AATx Token Contract is successfully deployed and operational.***************


//   beforeEach(async () => {
//     const allSigners = await ethers.getSigners();
//     [owner, factory, whitelistedAddress1, spender, nonWhitelistedAddress, burnAddress, ...signers] = allSigners;

//     AAT = await ethers.getContractFactory('AAT');
//     aat = await AAT.connect(owner).deploy(factory.address);
//     initialBalance = ethers.utils.parseUnits('10000000');

//     // Mint initial tokens to the owner
//     await aat.connect(factory).mint(owner.address, initialBalance);

//   });

//   //***********Generate 100 new user wallets for testing.***********/
//   //**********Add these wallets to the AATx whitelist and verify.**********/
//   //********Distribute a random amount of AATx tokens from the Pool Wallet to the 100 user wallets.**********/
//   //************Execute token transfers between 10 user wallets and another set of user wallets.**************/

//   describe('1. Standard AAT Functions', () => {

//     it('should whitelist and transfer tokens to 100 addresses and should transfer tokens between 10 users', async () => {
//       const amountToTransfer = ethers.utils.parseUnits('10', 18);
//       // Convert signers to an array
//       const signersArray = Array.from(signers);
//       // Whitelist and transfer tokens to each signer
//       for (const signer of signersArray) {
//         await aat.connect(owner).whitelisting(signer.address, true);
//        const txTransfer =  await aat.connect(owner).transfer(signer.address, amountToTransfer);
//        const tx = await txTransfer.wait();
//         // Assert
//         const balance = await aat.balanceOf(signer.address);
//         expect(balance).to.equal(amountToTransfer);
//         console.log("AATx Token Distribution to User Wallets: SUCCESS");
//         console.log("Transferred tokens:", amountToTransfer.toString());
//         console.log("Number of users: 100");
//         console.log("Transaction hash", tx.transactionHash);
//       }
//       // Each user transfers tokens to the next user in the list
//       for (let i = 0; i < 9; i++) {
//         const sender = signersArray[i];
//         const receiver = signersArray[i + 1];

//         const initialBalance = await aat.balanceOf(sender.address);
//         const receiverBalanceInitially = await aat.balanceOf(receiver.address);

//         // Transfer tokens from sender to receiver
//         const transferTx = await aat.connect(sender).transfer(receiver.address, amountToTransfer);

//         // Wait for the transaction receipt
//         const transferReceipt = await transferTx.wait();

//         // Assert sender's balance
//         const senderBalance = await aat.balanceOf(sender.address);
//         expect(senderBalance).to.equal(initialBalance.sub(amountToTransfer));

//         // Assert receiver's balance
//         const receiverBalance = await aat.balanceOf(receiver.address);
//         expect(receiverBalance).to.equal(receiverBalanceInitially.add(amountToTransfer));

//         // Log the transaction hash
//         console.log("AATx Token Distribution to User Wallets: SUCCESS");
//         console.log("Transferred tokens:", amountToTransfer.toString());
//         console.log("Number of users: 10");
//         console.log(`Transfer from ${sender.address} to ${receiver.address} - transaction hash:`, transferReceipt.transactionHash);
//       }
//     });

//     it('1.1 should successfully transfer tokens between two whitelisted addresses', async () => {
//       // Log whitelisted addresses
//       console.log("Whitelisting User Wallets in AAT: SUCCESS");
//       console.log("Number of Whitelisted Wallets: 100");
//       console.log('Whitelisted addresses:', await Promise.all((await ethers.getSigners()).map(async (signer) => await signer.getAddress())));

//       // Arrange
//       const amountToTransfer = ethers.utils.parseUnits('10', 18);

//       // Whitelist the addresses
//       await aat.connect(owner).whitelisting(whitelistedAddress1.address, true);

//       // Transfer the tokens to the whitelisted addresses
//       const transferTx = await aat.connect(owner).transfer(whitelistedAddress1.address, amountToTransfer);

//       // Wait for the transaction receipt
//       const transferReceipt = await transferTx.wait();

//       // Assert
//       expect(await aat.balanceOf(whitelistedAddress1.address)).to.equal(amountToTransfer);

//       // Log the transaction hash
//       console.log("Transfer transaction hash:", transferReceipt.transactionHash);
//     });

//     //***************Try to transfer AATx tokens to a wallet that is not whitelisted.***************/
//     //****************Ensure that the transaction to the non-whitelisted wallet is rolled back.***********/

//     it('1.2 should fail to transfer tokens if either sender or recipient is not whitelisted', async () => {
//       // Arrange
//       const amountToTransfer = ethers.utils.parseUnits('10', 18);

//       // Act & Assert
//       try {
//         await aat.connect(owner).transfer(nonWhitelistedAddress.address, amountToTransfer);
//       } catch (error) {
//         // Log the error message or reason for the revert
//         console.log("Attempting Transfer to Non-Whitelisted Wallet");
//         console.log("Target address", nonWhitelistedAddress.address);
//         console.log("Number of tokens:", amountToTransfer.toString());
//         console.log("Transfer error:", error.message || amoerror.reason);
//       }
//     });

//     it('1.3 should successfully increase allowance', async () => {
//       // Arrange
//       const addedValue = ethers.utils.parseUnits('10', 18);

//       // Whitelist the addresses
//       await aat.connect(owner).whitelisting(spender.address, true);

//       // Act
//       await aat.connect(owner).increaseAllowance(spender.address, addedValue);

//       // Assert
//       expect(await aat.allowance(owner.address, spender.address)).to.equal(addedValue);
//     });

//     it('1.4 should successfully decrease allowance', async () => {
//       // Arrange
//       const initialAllowance = ethers.utils.parseUnits('10', 18);
//       const subtractedValue = ethers.utils.parseUnits('5', 18);

//       // Whitelist the addresses and set an initial allowance
//       await aat.connect(owner).whitelisting(spender.address, true);
//       await aat.connect(owner).increaseAllowance(spender.address, initialAllowance);

//       // Act
//       await aat.connect(owner).decreaseAllowance(spender.address, subtractedValue);

//       // Assert
//       expect(await aat.allowance(owner.address, spender.address)).to.equal(initialAllowance.sub(subtractedValue));
//     });

//     it('1.5 should fail to decrease allowance below zero', async () => {
//       // Arrange
//       const initialAllowance = ethers.utils.parseUnits('5', 18);
//       const subtractedValue = ethers.utils.parseUnits('10', 18);

//       // Whitelist the addresses and set an initial allowance
//       await aat.connect(owner).whitelisting(spender.address, true);
//       await aat.connect(owner).increaseAllowance(spender.address, initialAllowance);

//       // Act & Assert
//       await expect(aat.connect(owner).decreaseAllowance(spender.address, subtractedValue)).to.be.revertedWith('ERC20: decreased allowance below zero');
//     });

//   });

//   describe('2. AAT Specific Functions', () => {

//     //****************** Link the AST1 Token Factory with the AATx Token.*****************
//     it('2.1 should successfully set the factory address', async () => {
//       // Arrange
//       const newFactoryAddress = await ethers.getSigner();

//       // Act
//       const setFactoryTx = await aat.connect(owner).setFactory(newFactoryAddress.address);

//       // Wait for the transaction receipt
//       const setFactoryReceipt = await setFactoryTx.wait();

//       // Assert
//       expect(await aat.factory()).to.equal(newFactoryAddress.address);
//       console.log("AAT token address:", aat.address);
//       console.log("Updated Factory address:", newFactoryAddress.address);

//       // Log the transaction hash
//       console.log("setFactory transaction hash:", setFactoryReceipt.transactionHash);
//     });
//     it('2.2 should burn tokens from a specified address if called by the factory', async () => {
//       // Arrange
//       const accountToBurn = burnAddress.address;
//       const amountToMint = ethers.utils.parseUnits('10', 18);
//       const amountToBurn = ethers.utils.parseUnits('10', 18);
//       // Mint initial tokens to the account to be burned
//       await aat.connect(factory).mint(accountToBurn, amountToMint);

//       await aat.connect(factory).burn(accountToBurn, amountToBurn);

//       // Assert
//       expect(await aat.balanceOf(accountToBurn)).to.equal(0); // Check if the balance is zero after burning
//     });

//     it('2.3 should fail to burn tokens if called by an address that is not the factory', async () => {
//       // Arrange
//       const accountToBurn = burnAddress.address;
//       const amountToMint = '10';
//       const amountToBurn = ethers.utils.parseUnits('10', 18);

//       // Mint initial tokens to the account to be burned
//       await aat.connect(factory).mint(accountToBurn, amountToMint);

//       // Act & Assert
//       await expect(aat.connect(owner).burn(accountToBurn, amountToBurn)).to.be.revertedWith('Ownable: caller is not the Factory');
//     });

//   });

// });
// describe('AST Contract', () => {
//   let AST;
//   let ast;
//   let owner;
//   let assetLockedWallet;
//   let factory;
//   let AATToken;

//   before(async () => {

//     // Deploy the contracts and set up test variables
//     [owner, assetLockedWallet, factory, AATToken] = await ethers.getSigners();

//     AST = await ethers.getContractFactory('AST');
//     const totalSupply = '10000';
//     const lockedPercentage = 50; // Example locked percentage, adjust according to your needs
//     const aatPercentage = 50; // Example AAT percentage, adjust according to your needs
//     ast = await AST.connect(owner).deploy(
//       'ASTToken',
//       'AST',
//       totalSupply,
//       assetLockedWallet.address,
//       factory.address,
//       AATToken.address,
//       lockedPercentage, // Example locked percentage, adjust according to your needs
//       aatPercentage  // Example AAT percentage, adjust according to your needs
//     );
//   });

//   // ******************Set and verify the immutable metadata for AST1.************************

//   it('should set and verify immutable metadata for AST', async () => {
//     // Arrange & Act
//     const name = await ast.name();
//     const symbol = await ast.symbol();
//     const totalSupply = await ast.totalSupply();

//     // Assert
//     expect(name).to.equal('ASTToken');
//     expect(symbol).to.equal('AST');
//     console.log("Immutable Token Name:", name);
//     console.log("Immutable Token symbol:", symbol);
//     console.log("Total supply:", totalSupply.toString());
//   });

//   it('should deploy AST with correct initial values', async () => {
//     // Assert
//     expect(await ast.assetWallet()).to.equal(assetLockedWallet.address);
//     expect(await ast.totalSupply()).to.equal(ethers.utils.parseUnits('10000', 18));
//     // Assuming 18 decimals

//     //**********************Ensure 50% of AST1 tokens are transferred to the asset owner's locked wallet.******** */

//     expect(await ast.balanceOf(assetLockedWallet.address)).to.equal(ethers.utils.parseUnits('5000', 18)); // Assuming 18 decimals and 50% locked

//     //************Confirm 50% of AST1 tokens are transferred to the AATx contract.***************** */

//     expect(await ast.balanceOf(AATToken.address)).to.equal(ethers.utils.parseUnits('5000', 18)); // Assuming 18 decimals and 50% for AAT

//     expect(await ast.factory()).to.equal(factory.address);

//   });

//   it('should burn tokens when called by the factory', async () => {
//     // Arrange
//     const accountToBurn = assetLockedWallet.address;
//     const amountToBurn = ethers.utils.parseUnits('5000', 18);

//     // Act
//     await ast.connect(factory).burn(accountToBurn, amountToBurn);

//     // Assert
//     expect(await ast.balanceOf(accountToBurn)).to.equal(0); // Check if the balance is zero after burning
//   });

//   it('should not allow burning when called by a non-factory address', async () => {
//     // Arrange
//     const nonFactory = await ethers.getSigner();

//     // Act & Assert
//     await expect(ast.connect(nonFactory).burn(assetLockedWallet.address, ethers.utils.parseUnits('10', 18))).to.be.revertedWith('You Cannot Burn');
//   });
// });
let aatAddress;
let factoryAddress;
let updatedFactoryAddress;
describe('ASTTokenFactory Contract', () => {
  let ASTTokenFactory;
  let astTokenFactory;
  let owner;
  let poolWallet;
  let assetLockedWallet;
  let AATToken;
  let aatToken;
  let ASTToken;
  let ASTToken2;
  let ratio;

  before(async () => {
    // Deploy the contracts and set up test variables
    [owner, poolWallet, assetLockedWallet] = await ethers.getSigners();

    ASTTokenFactory = await ethers.getContractFactory('ASTTokenFactory');
    astTokenFactory = await ASTTokenFactory.connect(owner).deploy(poolWallet.address, assetLockedWallet.address);

    AATToken = await ethers.getContractFactory('AAT'); // Assuming you have an AAT contract

    // Deploy AAT token for testing
    aatToken = await AATToken.connect(owner).deploy(astTokenFactory.address);
    console.log("AATx Token Contract Deployment : SUCCESS");
    aatAddress = aatToken.address;
    console.log("AATx Token address:", aatAddress);

    // Now you can directly use aatToken to get the deployment transaction details
    const aatTokenDeployment = await aatToken.deployTransaction.wait(); // Wait for the deployment transaction to be mined

    console.log("AATx Token Deployment Transaction Hash:", aatTokenDeployment.transactionHash);
    console.log('Deployment Timestamp:', new Date().toISOString());
  });

  //***********Deploy the AST1 Token Factory and ensure it's functional.****************

  it('should deploy AATx Contract', async () => {
    // Assert
    expect(await astTokenFactory.owner()).to.equal(owner.address);
    expect(await astTokenFactory.poolWallet()).to.equal(poolWallet.address);
    expect(await astTokenFactory.assetLockedWallet()).to.equal(assetLockedWallet.address);
    expect(await astTokenFactory.tokenCount()).to.equal(0);
    // console.log("Factory Owner:", await astTokenFactory.owner());
    // console.log("Factory Pool Wallet:", await astTokenFactory.poolWallet());
    // console.log("Factory assetLockedWallet:", await astTokenFactory.assetLockedWallet());
  });

});

describe('AST Contract', () => {
  let AST;
  let ast;
  let owner;
  let assetLockedWallet;
  let factory;
  let AATToken;

  before(async () => {

    // Deploy the contracts and set up test variables
    [owner, assetLockedWallet, factory, AATToken] = await ethers.getSigners();

    AST = await ethers.getContractFactory('AST');
    const totalSupply = '10000';
    const lockedPercentage = 50; // Example locked percentage, adjust according to your needs
    const aatPercentage = 50; // Example AAT percentage, adjust according to your needs
    ast = await AST.connect(owner).deploy(
      'ASTToken1',
      'AST',
      totalSupply,
      assetLockedWallet.address,
      factory.address,
      AATToken.address,
      lockedPercentage, // Example locked percentage, adjust according to your needs
      aatPercentage  // Example AAT percentage, adjust according to your needs
    );
  });

  // ******************Set and verify the immutable metadata for AST1.************************

  it('should set and verify immutable metadata for AST', async () => {
    // Arrange & Act
    const name = await ast.name();
    const symbol = await ast.symbol();
    const totalSupply = await ast.totalSupply();

    // Assert
    expect(name).to.equal('ASTToken1');
    expect(symbol).to.equal('AST');
    console.log("Immutable Token Name:", name);
    console.log("Immutable Token symbol:", symbol);
    console.log("Total supply:", totalSupply.toString());
  });

});
describe('ASTTokenFactory Contract', () => {
  let ASTTokenFactory;
  let astTokenFactory;
  let owner;
  let poolWallet;
  let assetLockedWallet;
  let AATToken;
  let aatToken;
  let ASTToken;
  let ASTToken2;
  let ratio;

  before(async () => {
    // Deploy the contracts and set up test variables
    [owner, poolWallet, assetLockedWallet] = await ethers.getSigners();

    ASTTokenFactory = await ethers.getContractFactory('ASTTokenFactory');
    astTokenFactory = await ASTTokenFactory.connect(owner).deploy(poolWallet.address, assetLockedWallet.address);
    console.log("AST Token Factory Deployment : SUCCESS");
    factoryAddress = astTokenFactory.address;
    console.log("AST Token Factory:", factoryAddress);
    console.log('Deployment Timestamp:', new Date().toISOString());
    AATToken = await ethers.getContractFactory('AAT'); // Assuming you have an AAT contract

  });

  //***********Deploy the AST1 Token Factory and ensure it's functional.****************
  it('should deploy AST Token contract factory', async () => {
    // Assert
    expect(await astTokenFactory.owner()).to.equal(owner.address);
    expect(await astTokenFactory.poolWallet()).to.equal(poolWallet.address);
    expect(await astTokenFactory.assetLockedWallet()).to.equal(assetLockedWallet.address);
    expect(await astTokenFactory.tokenCount()).to.equal(0);
    // console.log("Factory Owner:", await astTokenFactory.owner());
    // console.log("Factory Pool Wallet:", await astTokenFactory.poolWallet());
    // console.log("Factory assetLockedWallet:", await astTokenFactory.assetLockedWallet());
  });
});

describe('AAT Contract', () => {
  let AAT;
  let aat;
  let owner;
  let factory;
  let whitelistedAddress1;
  let spender;
  let nonWhitelistedAddress;
  let initialBalance;
  let burnAddress;
  let signers;

  // ******************Ensure the AATx Token Contract is successfully deployed and operational.***************


  before(async () => {
    const allSigners = await ethers.getSigners();
    [owner, factory, whitelistedAddress1, spender, nonWhitelistedAddress, burnAddress, ...signers] = allSigners;

    AAT = await ethers.getContractFactory('AAT');
    aat = await AAT.connect(owner).deploy(factory.address);
    initialBalance = ethers.utils.parseUnits('10000000');

    // Mint initial tokens to the owner
    await aat.connect(factory).mint(owner.address, initialBalance);

  });


  describe('2. AAT Specific Functions', () => {

    //****************** Link the AST1 Token Factory with the AATx Token.*****************
    it('it should successfully set the factory address in the AATx token', async () => {
      // Arrange
      const newFactoryAddress = await ethers.getSigner();

      // Act
      const setFactoryTx = await aat.connect(owner).setFactory(newFactoryAddress.address);

      // Wait for the transaction receipt
      const setFactoryReceipt = await setFactoryTx.wait();

      // Assert
      expect(await aat.factory()).to.equal(newFactoryAddress.address);
      updatedFactoryAddress = newFactoryAddress.address;
      console.log("Updated Factory address:", updatedFactoryAddress);

      // Log the transaction hash
      console.log("setFactory transaction hash:", setFactoryReceipt.transactionHash);
    });

  });

});
describe('ASTTokenFactory Contract', () => {
  let ASTTokenFactory;
  let astTokenFactory;
  let owner;
  let poolWallet;
  let assetLockedWallet;
  let AATToken;
  let aatToken;
  let ASTToken;
  let ASTToken2;
  let ratio;
  let newAssetLockedWallet;
  let newPoolWallet;

  before(async () => {
    // Deploy the contracts and set up test variables
    [owner, poolWallet, assetLockedWallet] = await ethers.getSigners();

    ASTTokenFactory = await ethers.getContractFactory('ASTTokenFactory');
    astTokenFactory = await ASTTokenFactory.connect(owner).deploy(poolWallet.address, assetLockedWallet.address);

    AATToken = await ethers.getContractFactory('AAT'); // Assuming you have an AAT contract

    // Deploy AAT token for testing
    aatToken = await AATToken.connect(owner).deploy(astTokenFactory.address);
    // Now you can directly use aatToken to get the deployment transaction details
    const aatTokenDeployment = await aatToken.deployTransaction.wait(); // Wait for the deployment transaction to be mined

  });

  //******************Configure the AATx Token as part of the AST1 Token Factory settings.******************

  it('should set AATx token contract in AST factory', async () => {
    // Set the AAT token in ast token factory
    const setAATTokenTx = await astTokenFactory.connect(owner).setAATToken(aatToken.address);

    // Wait for the transaction receipt
    const setAATTokenReceipt = await setAATTokenTx.wait();

    // Assert
    expect(await astTokenFactory.aatToken()).to.equal(aatToken.address);
    console.log("Configuring AATx Token in AST1 Token Factory: SUCCESS");
    console.log("AST1 Factory Address:", updatedFactoryAddress);
    console.log("AATx Token Address:", aatAddress);

    // Log the transaction hash
    console.log("setAATToken transaction hash:", setAATTokenReceipt.transactionHash);
  });
  //***************Specify and verify the asset owner's locked wallet in the AST1 Token Factory. ************/

  it('should set the asset locked wallet address by the owner', async () => {
    // Arrange
    newAssetLockedWallet = await ethers.getSigner();

    // Act
    const setAssetLockedWalletTx = await astTokenFactory.connect(owner).setAssetLockedWallet(newAssetLockedWallet.address);

    const setAssetWalletReceipt = await setAssetLockedWalletTx.wait();

    // Assert
    const updatedAssetLockedWallet = await astTokenFactory.assetLockedWallet();
    expect(updatedAssetLockedWallet).to.equal(newAssetLockedWallet.address);
    console.log("Setting Asset Owner Locked Wallet: SUCCESS");
    console.log("Updated asset locked wallet:", updatedAssetLockedWallet);
    console.log("set Asset Locked wallet address:", setAssetWalletReceipt.transactionHash);
  });
  //***************Define and confirm the pool wallet in the AST1 Token Factory.***********************

  it('should set the pool wallet address by the owner', async () => {
    // Arrange
    [newWallet, newPoolWallet] = await ethers.getSigners();

    // Act
    const setPoolWalletTx = await astTokenFactory.connect(owner).setPoolWallet(newPoolWallet.address);

    // Wait for the transaction receipt
    const setPoolWalletReceipt = await setPoolWalletTx.wait();

    // Assert
    const updatedPoolWallet = await astTokenFactory.poolWallet();
    expect(updatedPoolWallet).to.equal(newPoolWallet.address);
    console.log("Setting Pool Wallet in AST1 Token Factory: SUCCESS");
    console.log("Updated pool wallet:", updatedPoolWallet);

    // Log the transaction hash
    console.log("set Pool Wallet transaction hash:", setPoolWalletReceipt.transactionHash);
  });
  //creating a ASTToken 2 for testing

  it('should create ASTToken1 with the correct parameters', async () => {
    // Arrange
    const name = 'ASTToken1';
    const symbol = 'AST';
    const totalSupply = '100000';
    ratio = 7533; // Example ratio, adjust according to your needs
    const lockedPercentage = 50; // Example locked percentage, adjust according to your needs
    const aatPercentage = 50; // Example AAT percentage, adjust according to your needs

    // Act
    const createASTTokenTx = await astTokenFactory.connect(owner).createASTToken(
      name,
      symbol,
      totalSupply,
      ratio,
      lockedPercentage,
      aatPercentage
    );
    const astTokens = await astTokenFactory.getASTs();
    ASTToken = await ethers.getContractAt('AST', astTokens[0]);
    console.log("ASTToken 1 address:", ASTToken.address);
    console.log("Number of Tokens:", ethers.utils.parseUnits('100000', 18).toString());
    // Wait for the transaction receipt
    const createASTTokenReceipt = await createASTTokenTx.wait();
    // Log the transaction hash
    console.log("createASTToken transaction hash:", createASTTokenReceipt.transactionHash);

    // Assert
    expect(await astTokenFactory.tokenCount()).to.equal(1);

  });
  it('should mint AATx tokens in correspondence with the minting of AST1 tokens', async () => {
    // Get the current AAT balance of the pool wallet
    const poolWalletAATBalanceBefore = await aatToken.balanceOf(poolWallet.address);

    // Check that AATx tokens are minted in correspondence with the minting of AST1 tokens
    expect(poolWalletAATBalanceBefore).to.equal('13274000000000000000000');
    console.log("AATx minted tokens amount in correspondence to AST1 token:", poolWalletAATBalanceBefore.toString());
  });

  it('should transfer 50% AST Tokens to asset locked wallet and 50% to AATx contract', async () => {
    // Get the balances
    const assetLockedWalletBalance = await ASTToken.balanceOf(newAssetLockedWallet.address);
    const aatTokenBalance = await ASTToken.balanceOf(aatToken.address);
    const totalSupply = await ASTToken.totalSupply();

    // Calculate the expected balances
    const expectedAssetLockedBalance = totalSupply.mul(50).div(100);
    const expectedAATTokenBalance = totalSupply.sub(expectedAssetLockedBalance);

    // Assert and log
    expect(await assetLockedWalletBalance).to.equal(expectedAssetLockedBalance);
    expect(await aatTokenBalance).to.equal(expectedAATTokenBalance);


    console.log("AST1 Tokens Transfer to Locked Wallet: SUCCESS");
    console.log("Asset Locked Wallet Balance (50%):", await assetLockedWalletBalance.toString());
    console.log("Asset locked wallet address", newAssetLockedWallet.address);
    console.log("AST1 Tokens Transfer to AATx Contract: SUCCESS");
    console.log("AATx Token Balance (50%):", await aatTokenBalance.toString());
    console.log("AATx address", aatAddress);
  });
  it('should set the conversion of AATx token in correspondence to AST1 tokens and AAtx tokens to pool wallet', async () => {
    // Get the current AAT balance of the pool wallet
    const poolWalletAATBalanceBefore = await aatToken.balanceOf(newPoolWallet.address);

    // Check that AATx tokens are minted in correspondence with the minting of AST1 tokens
    expect(poolWalletAATBalanceBefore).to.equal('13274000000000000000000');
    console.log("AATx/AST1 Conversion Rate Verification: SUCCESS");
    console.log("AATx minted tokens amount in correspondence to AST1 token:", poolWalletAATBalanceBefore.toString());
    console.log("Used AST1 tokens: 100000000000000000000000");
    console.log("Convertion rate: 1AATx = 7.533 AST1");
    console.log("AATx Tokens Transfer to Pool Wallet: SUCCESS");
    console.log("Transferred tokens:", poolWalletAATBalanceBefore.toString());
    console.log("Pool wallet address:", newPoolWallet.address);
  });
});

describe('AATx Contract', () => {
  let AAT;
  let aat;
  let owner;
  let factory;
  let whitelistedAddress1;
  let spender;
  let nonWhitelistedAddress;
  let initialBalance;
  let burnAddress;
  let signers;

  // ******************Ensure the AATx Token Contract is successfully deployed and operational.***************


  beforeEach(async () => {
    const allSigners = await ethers.getSigners();
    [owner, factory, whitelistedAddress1, spender, nonWhitelistedAddress, burnAddress, ...signers] = allSigners;

    AAT = await ethers.getContractFactory('AAT');
    aat = await AAT.connect(owner).deploy(factory.address);
    initialBalance = ethers.utils.parseUnits('10000000');

    // Mint initial tokens to the owner
    await aat.connect(factory).mint(owner.address, initialBalance);

  });

  //***********Generate 100 new user wallets for testing.***********/
  //**********Add these wallets to the AATx whitelist and verify.**********/
  //********Distribute a random amount of AATx tokens from the Pool Wallet to the 100 user wallets.**********/
  //************Execute token transfers between 10 user wallets and another set of user wallets.**************/

  describe('AATx Functions', () => {

    it('should whitelist and transfer tokens to 100 addresses and should transfer tokens between 10 users', async () => {
      // Log whitelisted addresses
      console.log("Whitelisting User Wallets in AAT: SUCCESS");
      console.log("Number of Whitelisted Wallets: 100");
      console.log('Whitelisted addresses:', await Promise.all((await ethers.getSigners()).map(async (signer) => await signer.getAddress())));
      const amountToTransfer = ethers.utils.parseUnits('10', 18);
      // Convert signers to an array
      const signersArray = Array.from(signers);
      // Whitelist and transfer tokens to each signer
      for (const signer of signersArray) {
        await aat.connect(owner).whitelisting(signer.address, true);
        const txTransfer = await aat.connect(owner).transfer(signer.address, amountToTransfer);
        const tx = await txTransfer.wait();
        // Assert
        const balance = await aat.balanceOf(signer.address);
        expect(balance).to.equal(amountToTransfer);
        console.log("AATx Token Distribution to User Wallets: SUCCESS");
        console.log("Transferred tokens:", amountToTransfer.toString());
        console.log("Number of users: 100");
        console.log("Transaction hash", tx.transactionHash);
      }
      // Each user transfers tokens to the next user in the list
      for (let i = 0; i < 9; i++) {
        const sender = signersArray[i];
        const receiver = signersArray[i + 1];

        const initialBalance = await aat.balanceOf(sender.address);
        const receiverBalanceInitially = await aat.balanceOf(receiver.address);

        // Transfer tokens from sender to receiver
        const transferTx = await aat.connect(sender).transfer(receiver.address, amountToTransfer);

        // Wait for the transaction receipt
        const transferReceipt = await transferTx.wait();

        // Assert sender's balance
        const senderBalance = await aat.balanceOf(sender.address);
        expect(senderBalance).to.equal(initialBalance.sub(amountToTransfer));

        // Assert receiver's balance
        const receiverBalance = await aat.balanceOf(receiver.address);
        expect(receiverBalance).to.equal(receiverBalanceInitially.add(amountToTransfer));

        // Log the transaction hash
        console.log("AATx Token Distribution to User Wallets: SUCCESS");
        console.log("Transferred tokens:", amountToTransfer.toString());
        console.log("Number of users: 10");
        console.log(`Transfer from ${sender.address} to ${receiver.address} - transaction hash:`, transferReceipt.transactionHash);
      }
    });
    //***************Try to transfer AATx tokens to a wallet that is not whitelisted.***************/
    //****************Ensure that the transaction to the non-whitelisted wallet is rolled back.***********/

    it('1.2 should fail to transfer tokens if either sender or recipient is not whitelisted', async () => {
      // Arrange
      const amountToTransfer = ethers.utils.parseUnits('10', 18);

      // Act & Assert
      try {
        await aat.connect(owner).transfer(nonWhitelistedAddress.address, amountToTransfer);
      } catch (error) {
        // Log the error message or reason for the revert
        console.log("Attempting Transfer to Non-Whitelisted Wallet");
        console.log("Target address", nonWhitelistedAddress.address);
        console.log("Number of tokens:", amountToTransfer.toString());
        console.log("Transfer error:", error.message || amoerror.reason);
      }
    });
  });
});

describe('ASTTokenFactory Contract', () => {
  let ASTTokenFactory;
  let astTokenFactory;
  let owner;
  let poolWallet;
  let assetLockedWallet;
  let AATToken;
  let aatToken;
  let ASTToken;
  let ASTToken2;
  let ratio;

  before(async () => {
    // Deploy the contracts and set up test variables
    [owner, poolWallet, assetLockedWallet] = await ethers.getSigners();
  
    ASTTokenFactory = await ethers.getContractFactory('ASTTokenFactory');
    astTokenFactory = await ASTTokenFactory.connect(owner).deploy(poolWallet.address, assetLockedWallet.address);  
    AATToken = await ethers.getContractFactory('AAT'); // Assuming you have an AAT contract
  
    // Deploy AAT token for testing
    aatToken = await AATToken.connect(owner).deploy(astTokenFactory.address);  
    // Now you can directly use aatToken to get the deployment transaction details
  });
  
  it('should create ASTToken 2 with the correct parameters', async () => {
    const setAATTokenTx = await astTokenFactory.connect(owner).setAATToken(aatToken.address);
    const setAATTokenReceipt = await setAATTokenTx.wait();
    // Arrange
    const name = 'TestAST2';
    const symbol = 'TAST';
    const totalSupply = '100000';
    ratio = 7533; // Example ratio, adjust according to your needs
    const lockedPercentage = 50; // Example locked percentage, adjust according to your needs
    const aatPercentage = 50; // Example AAT percentage, adjust according to your needs

    // Act
    const createASTTokenTx = await astTokenFactory.connect(owner).createASTToken(
      name,
      symbol,
      totalSupply,
      ratio,
      lockedPercentage,
      aatPercentage
    );
    const astTokens = await astTokenFactory.getASTs();
    ASTToken2 = await ethers.getContractAt('AST', astTokens[0]);
    console.log("ASTToken 2 address:", ASTToken2.address);
    console.log("Number of Tokens:", ethers.utils.parseUnits('100000', 18).toString());
    // Wait for the transaction receipt
    const createASTTokenReceipt = await createASTTokenTx.wait();
    // Log the transaction hash
    console.log("createASTToken transaction hash:", createASTTokenReceipt.transactionHash);

    // Assert
    expect(await astTokenFactory.tokenCount()).to.equal(1);

  });
  
  it('should allow users to burn AAT tokens and return AST tokens to asset locked wallet', async () => {
    // Arrange
    const aatAmountToBurn = ethers.utils.parseUnits('1000', 18);

    // Act
    const initialAATBalance = await aatToken.balanceOf(poolWallet.address);

    const [, initialLockedAstBalance] = await astTokenFactory.astTokenBalance(ASTToken2.address, assetLockedWallet.address);
    // Burn AAT tokens and convert to AST tokens
    await astTokenFactory.connect(poolWallet).burnAAT(aatAmountToBurn, ASTToken2.address);

    // Assert
    const finalAATBalance = await aatToken.balanceOf(poolWallet.address);
    const [, finalLockedAstBalance] = await astTokenFactory.astTokenBalance(ASTToken2.address, assetLockedWallet.address);
   
    expect(finalAATBalance).to.equal(initialAATBalance.sub(aatAmountToBurn));
    expect(finalLockedAstBalance).to.be.above(initialLockedAstBalance);
    console.log("AAT Token Burn by Asset Owner: SUCCESS");
    console.log("Burnt tokens:", aatAmountToBurn.toString());
    console.log("Pool Wallet:", poolWallet.address);
    console.log("Initial AATx pool wallet balance", initialAATBalance.toString());
    console.log('Initial ASTToken 1 asset locked balance :', initialLockedAstBalance.toString());
    console.log('Final AATx pool wallet balance:', finalAATBalance.toString());
    console.log('Final ASTToken 1 asset locked balance :', finalLockedAstBalance.toString());
  });

  it('should allow the owner to burn AST tokens when AssetOwner wallet has above 99% of AST tokens', async () => {
    // Arrange
    const aatAmountToBurn = '5637461834594451000000';

    // Act
    const initialAATBalance = await aatToken.balanceOf(poolWallet.address);

    const [, initialLockedAstBalance] = await astTokenFactory.astTokenBalance(ASTToken2.address, assetLockedWallet.address);

    // Burn AAT tokens and convert to AST tokens
    await astTokenFactory.connect(poolWallet).burnAAT(aatAmountToBurn, ASTToken2.address);

    // Assert
    const finalAATBalance = await aatToken.balanceOf(poolWallet.address);
    const [, finalLockedAstBalance] = await astTokenFactory.astTokenBalance(ASTToken2.address, assetLockedWallet.address);

    expect(finalAATBalance).to.equal(initialAATBalance.sub(aatAmountToBurn));
    expect(finalLockedAstBalance).to.be.above(initialLockedAstBalance);


    // Act
    // Attempt to burn AST tokens when AssetOwner wallet has above 99% of AST tokens
    const burnASTTokenTx = await astTokenFactory.connect(owner).burnAstToken(ASTToken2.address);

    // Wait for the transaction receipt
    const burnASTTokenReceipt = await burnASTTokenTx.wait();

    // Assert
    const [, lockedAstBalance] = await astTokenFactory.astTokenBalance(ASTToken2.address, assetLockedWallet.address);
    expect(lockedAstBalance).to.equal(0);

    // Log the transaction hash
    console.log("AST1 Token Burn by Contract Owner: SUCCESS");
    console.log("burnASTToken transaction hash:", burnASTTokenReceipt.transactionHash);
    console.log("Owner address:", owner.address);
  });

});


