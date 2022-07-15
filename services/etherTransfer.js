const Web3 = require('web3');

const dotenv=require('dotenv');
dotenv.config();
const web3 = new Web3(process.env.INFURA_URL);

// Create transaction
const sendEthers = async (fromAddress,toAddress,privateKey,ethers) => {
   console.log(
      `Attempting to make transaction from ${fromAddress} to ${toAddress}`
   );
  

   const createTransaction = await web3.eth.accounts.signTransaction(
      {
         from: fromAddress,
         to: toAddress,
         value: web3.utils.toWei(ethers, 'ether'),
        gas: '21000',
      },
      privateKey
   );


   // Deploy transaction
   const createReceipt = await web3.eth.sendSignedTransaction(
      createTransaction.rawTransaction
   );
   
   console.log(
      `Transaction successful with hash: ${createReceipt.transactionHash}`
   );
   return createReceipt.transactionHash;

};

// deploy();
    
module.exports = sendEthers;