const Web3 = require('web3');
const Provider = require('@truffle/hdwallet-provider');
const MyContract = require('../../../constants/contractABIs/erc20Contract.json');
const { fromWei, toWei } = require("web3-utils");
const dotenv = require('dotenv');
dotenv.config({ path: '../../.env' });
const address = process.env.CONTRACT_ADDRESS;
const END_POINT = process.env.INFURA_URL;
const web3 = new Web3(process.env.INFURA_URL);

const contractInteract = async (privateKey) => {
    let web3 = null;
    if (privateKey) {
        const provider = new Provider(privateKey, END_POINT);
        web3 = new Web3(provider);
    } else {
        web3 = new Web3(END_POINT);

    }
    const myContract = new web3.eth.Contract(
        MyContract.abi,
        address
        //   MyContract.networks[networkId].address
    );

    return myContract;
}

async function transferFunction(fromAddress, toAddress, privateKey, amount) {
    let myContract = await contractInteract(privateKey);
    let receipt = await myContract.methods.transfer(toAddress, amount).send({
        from: fromAddress
    });
    return receipt.transactionHash;
}

async function approveFunction(fromAddress, toAddress, privateKey, amount) {
    let myContract = await contractInteract(privateKey);
    let receipt = await myContract.methods.approve(toAddress, amount).send({
        from: fromAddress
    });
    return receipt.transactionHash;
}

// async function transferFromFunction(approvedAddress,fromAddress,toAddress,privateKey,amount){
//     let myContract=await contractInteract(privateKey);
//     let txHash= await myContract.methods.transferFrom(fromAddress,toAddress,amount).send({
//         from:approvedAddress
//     });
//     return txHash;
// }

async function burnFunction(fromAddress, privateKey, amount) {
    let receipt = null;
    let myContract = await contractInteract(privateKey);
    receipt = await myContract.methods.burn(amount).send({
        from: fromAddress
    });
    return receipt.transactionHash;
}

async function balanceOfFunction(toAddress, privateKey = null) {
    let myContract = await contractInteract(privateKey);
    let balance = await myContract.methods.balanceOf(toAddress).call();
    return balance;
}

async function totalSupply(privateKey) {
    let myContract = await contractInteract(privateKey);
    let totalSupply = await myContract.methods.totalSupply().call();
    return totalSupply;
}

async function mintFunction(fromAddress, toAddress, privateKey, amount) {
    let receipt = null;
    let myContract = await contractInteract(privateKey);
    receipt = await myContract.methods.mint(toAddress, amount).send({
        from: fromAddress
    })
    return receipt.transactionHash;
}

async function nativeBalance(userAddress) {
    let balance = await web3.eth.getBalance(userAddress);
    let ethBalance = fromWei(balance, 'ether');
    return ethBalance;


}

async function totalSupply(privateKey = null) {
    let myContract = await contractInteract(privateKey);
    let totalSupply = await myContract.methods.totalSupply().call();
    return totalSupply;
}
async function getTokenName(privateKey = null) {
    let myContract = await contractInteract(privateKey);
    let name = await myContract.methods.name().call();
    return name;

}

async function getSymbol(privateKey = null) {
    let myContract = await contractInteract(privateKey);
    let symbolName = await myContract.methods.symbol().call();
    return symbolName;

}

module.exports = {
    contractInteract,
    mintFunction,
    approveFunction,
    transferFunction,
    // transferFromFunction,
    burnFunction,
    balanceOfFunction,
    totalSupply,
    getTokenName,
    nativeBalance,
    getSymbol


}


