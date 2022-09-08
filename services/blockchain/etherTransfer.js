const Web3 = require('web3');
const { fromWei, toWei } = require("web3-utils");
const dotenv = require('dotenv');
dotenv.config();
const web3 = new Web3(process.env.INFURA_URL);

// Create transaction
const sendTransaction = async (web3, fromAddress, toAddress, currentGasEstimate, data, amount, privateKey ) => {
   let sendWei = await Web3.utils.toWei(amount.toString(), 'ether');
   console.log(`Attempting to make transaction from ${fromAddress} to ${toAddress}`);
   let currentGasEstimate = await contract.methods.setName(newName).estimateGas({from: signer.address});
   const createTransaction = await web3.eth.accounts.signTransaction(
      {
         from: fromAddress,
         to: toAddress,
         value: sendWei,
         gas: '21000',
         data: data
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

const sendEthers = async (fromAddress, toAddress, privateKey, ethers) => {
   let sendWei = await Web3.utils.toWei(ethers.toString(), 'ether');
   console.log(`Attempting to make transaction from ${fromAddress} to ${toAddress}`);
   let currentGasEstimate = await contract.methods.setName(newName).estimateGas({from: signer.address});
   const createTransaction = await web3.eth.accounts.signTransaction(
      {
         from: fromAddress,
         to: toAddress,
         value: sendWei,
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

module.exports = sendEthers;
