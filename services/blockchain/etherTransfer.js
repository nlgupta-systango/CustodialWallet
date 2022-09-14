const Web3 = require('web3');
const { fromWei, toWei } = require("web3-utils");
const dotenv = require('dotenv');
dotenv.config();
const web3 = new Web3(process.env.INFURA_URL);

// Create transaction
const sendTransaction = async (fromAddress, toAddress, privateKey, amount = 0, data = null) => {
   let sendWei = await Web3.utils.toWei(amount.toString(), 'ether');
   console.log(`Attempting to make transaction from ${fromAddress} to ${toAddress}`);
   let currentGasEstimate = await getGasEstimate(fromAddress, toAddress, sendWei, data);
   let rawTx = {
      from: fromAddress,
      to: toAddress,
      value: sendWei,
      data: data,
      gas: currentGasEstimate
   };
   const createTransaction = await web3.eth.accounts.signTransaction(
      rawTx,
      privateKey
   );
   // Deploy transaction
   const createReceipt = await web3.eth.sendSignedTransaction(
      createTransaction.rawTransaction
   );
   console.log(`Transaction successful with hash: ${createReceipt.transactionHash}`);
   return createReceipt.transactionHash;

};

const sendEthers = async (fromAddress, toAddress, privateKey, ethers) => {
   //Calling transaction
   const transactionHash = await sendTransaction(
      fromAddress, toAddress, privateKey, ethers
   );
   console.log(`Transaction successful with hash: ${transactionHash}`);
   return transactionHash;

};

const sendCustomTransaction = async (fromAddress, toAddress, privateKey, ethers, data) => {
   //Calling transaction
   const transactionHash = await sendTransaction(
      fromAddress, toAddress, privateKey, ethers, data
   );
   return transactionHash;

};

const getEtherBalance = async (userAddress) => {
   let balance = await web3.eth.getBalance(userAddress);
   let ethBalance = fromWei(balance, 'ether');
   return ethBalance;

}

const getGasEstimate = async (fromAddress, toAddress, amount = 0, data = null) => {
   let rawTx = {
      from: fromAddress,
      to: toAddress,
      value: amount,
      data: data
   };
   let gasEstimate = await web3.eth.estimateGas(rawTx);
   // gasEstimate = fromWei(gasEstimate.toString(), 'ether').toString();
   return gasEstimate;

}
// const sendEthers = async (fromAddress, toAddress, privateKey, ethers) => {
//    let sendWei = await Web3.utils.toWei(ethers.toString(), 'ether');
//    console.log(`Attempting to make transaction from ${fromAddress} to ${toAddress}`);
//    let currentGasEstimate = await contract.methods.setName(newName).estimateGas({from: signer.address});
//    const createTransaction = await web3.eth.accounts.signTransaction(
//       {
//          from: fromAddress,
//          to: toAddress,
//          value: sendWei,
//          gas: '21000',
//       },
//       privateKey
//    );
//    // Deploy transaction
//    const createReceipt = await web3.eth.sendSignedTransaction(
//       createTransaction.rawTransaction
//    );
//    console.log(
//       `Transaction successful with hash: ${createReceipt.transactionHash}`
//    );
//    return createReceipt.transactionHash;

// };


module.exports = {
   sendEthers,
   sendCustomTransaction,
   getEtherBalance,
   getGasEstimate
};
