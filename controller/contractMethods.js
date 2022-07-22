
const Models = require('./../models');
const HDWallet = require('../services/HDwalletUtility');
const { custodialDecryption } = require('../services/encryptDecrypt');
const SC_function = require('../services/ContractInteraction/SCinteraction');
const sendEthers = require('../services/etherTransfer');
const dotenv = require('dotenv');
dotenv.config({ path: '../.env' });
const User = Models.UserCustodialWallets;

const tokenBalanceOf = async (req, res) => {
    let toAddress = req.params.address;
    if (toAddress) {

        let balance = await SC_function.balanceOfFunction(toAddress);
        res.status(201).json(`balance of ${toAddress} is ${balance}`);


    } else {
        res.status(404).json({ error: "please provide address" });
    }
};

const balanceOf = async (req, res) => {
    let getUserData = req.user;
    const user = await User.findOne({ where: { email: getUserData.email } });
    let encrpytedMnemonic = user.mnemonic;
    let decryptedMnemonic = custodialDecryption(encrpytedMnemonic);


    if (user) {
        let fromAddress = HDWallet.fetchPublicKey(decryptedMnemonic);
        let toAddress = req.body.toAddress;
        let privateKey = HDWallet.fetchPrivateKey(decryptedMnemonic);
        let balance = await SC_function.balanceOfFunction(toAddress, privateKey);

        res.status(201).json(`balance of ${toAddress} is ${balance}`);


    } else {
        res.status(404).json({ error: "User does not exist" });
    }
};

const mint = async (req, res) => {

    let fromAddress = process.env.ADMIN_PUBLIC_KEY;
    let toAddress = req.body.toAddress;
    let privateKey = process.env.ADMIN_PRIVATE_KEY;
    let amount = req.body.amount;
    let txHash = await SC_function.mintFunction(fromAddress, toAddress, privateKey, amount);

    console.log("tx done");
    res.send(`Transaction status success ${txHash}`)

};

const transfer = async (req, res) => {
    let fromAddress = req.body.fromAddress;
    if (!fromAddress) return res.status(404).json({ error: "fromAddress not found in Body" });
    const user = await User.findOne({ where: { userAddress: fromAddress } });
    let encrpytedMnemonic = user.mnemonic;
    let decryptedMnemonic = custodialDecryption(encrpytedMnemonic);
    if (user) {
        let fromAddress = HDWallet.fetchPublicKey(decryptedMnemonic);
        let toAddress = req.body.toAddress;
        let privateKey = HDWallet.fetchPrivateKey(decryptedMnemonic);
        let amount = req.body.amount;
        let txHash = await SC_function.transferFunction(fromAddress, toAddress, privateKey, amount);

        res.status(201).json({ message: `${amount} token transfered to ${toAddress} and transaction hash is ${txHash.transactionHash}` });

    } else {
        res.status(404).json({ error: "User does not exist" });
    }
};


const burn = async (req, res) => {
    let fromAddress = req.body.fromAddress;
    if (!fromAddress) return res.status(404).json({ error: "fromAddress not found in Body" });
    const user = await User.findOne({ where: { userAddress: fromAddress } });
    let encrpytedMnemonic = user.mnemonic;
    let decryptedMnemonic = custodialDecryption(encrpytedMnemonic);
    if (user) {
        let fromAddress = HDWallet.fetchPublicKey(decryptedMnemonic);
        let toAddress = req.body.toAddress;
        let privateKey = HDWallet.fetchPrivateKey(decryptedMnemonic);
        let amount = req.body.amount;
        let receipt = await SC_function.burnFunction(fromAddress, privateKey, amount);
        console.log(receipt);
        console.log("tx done");
        res.status(404).json({ message: `${amount} tokens burned from ${fromAddress} and Tx=${receipt}` });

    } else {
        res.status(404).json({ error: "User does not exist" });
    }
};

const mintInternal = async (toAddress, amount) => {

    let fromAddress = process.env.ADMIN_PUBLIC_KEY;
    let privateKey = process.env.ADMIN_PRIVATE_KEY;
    let txHash = await SC_function.mintFunction(fromAddress, toAddress, privateKey, amount);
    return txHash;


};
const userMint = async (req, res) => {
    let fromAddress = req.body.fromAddress;
    if (!fromAddress) return res.status(404).json({ error: "fromAddress not found in Body" });
    const user = await User.findOne({ where: { userAddress: fromAddress } });
    let encrpytedMnemonic = user.mnemonic;
    let decryptedMnemonic = custodialDecryption(encrpytedMnemonic);

    if (user) {

        let fromAddress = HDWallet.fetchPublicKey(decryptedMnemonic);
        let toAddress = process.env.ADMIN_PUBLIC_KEY;
        let privateKey = HDWallet.fetchPrivateKey(decryptedMnemonic);
        let tokenPrice = parseFloat(process.env.TOKEN_PRICE);
        let noOfToken = req.body.tokenAmount;
        let requiredEther = tokenPrice * noOfToken;
        let userBal = await SC_function.nativeBalance(fromAddress);
        let sentTx = null;
        let mintTx = null;
        if (userBal > requiredEther) {
            try {
                console.log(`user bal=${userBal} and req ether= ${requiredEther}`);
                sentTx = await sendEthers(fromAddress, toAddress, privateKey, requiredEther);
                mintTx = await mintInternal(fromAddress, noOfToken);
            } catch {
                res.status(404).json({ error: "some thing went wrong in ether send or token minting" });
            }

        } else {
            res.status(404).json({ error: "insufficient ether" });
        }
        res.status(201).json({ message: `Transaction success , send Tx=${sentTx} amd mint token Tx=${mintTx}` });


    } else {
        res.status(404).json({ error: "User does not exist" });
    }



}


module.exports = {
    tokenBalanceOf,
    balanceOf,
    mint,
    transfer,
    burn,
    userMint

}
