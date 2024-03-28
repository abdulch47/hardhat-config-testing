/** @type import('hardhat/config').HardhatUserConfig */
require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-etherscan");
const yaml = require('js-yaml');
const fs = require('fs');

// Read YAML config file
const config = yaml.load(fs.readFileSync('./config.yaml', 'utf8'));

const ALCHEMY_API_KEY = config.AlchemyApiKey;
const MUMBAI_PRIVATE_KEY = config.ownerPrivateKey; //owner private key
module.exports = {
  solidity: "0.8.19",
  defaultNetwork: "polygon_mumbai",
  networks:{
    polygon_mumbai:{
      url:`https://polygon-mumbai.g.alchemy.com/v2/${ALCHEMY_API_KEY}`,
      accounts: [`${MUMBAI_PRIVATE_KEY}`],
    }
  },
  paths: {
    tests: "./tests",
},
  etherscan:{
   apiKey: "YH572V2C142GFJGUJICCAJ7EQ5TZKYN46P"
  }
};
// module.exports = {
//   solidity: "0.8.19",
//   networks: {
//         hardhat: {
//             accounts: {
//                 count: 100,
//                 // accountsBalance: 10000000000000000000000, // default value is 10000ETH in wei
//             },
//         },
//     },
// };
