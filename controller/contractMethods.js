
const Models = require('./../models');
const HDWallet = require('../services/HDwalletUtility');
const {custodialDecryption}=require('../services/encryptDecrypt');
const SC_function=require('../services/ContractInteraction/SCinteraction');
const dotenv = require('dotenv');
dotenv.config();
const User = Models.UserCustodialWallets;


const balanceOf = async (req, res) => {
    let getUserData = req.user;
    const user = await User.findOne({ where: { email: getUserData.email } });
    let encrpytedMnemonic=user.mnemonic;
    let decryptedMnemonic=custodialDecryption(encrpytedMnemonic);

    
    if (user) {
        let fromAddress = HDWallet.fetchPublicKey(decryptedMnemonic);
        let toAddress = req.body.toAddress;
        let privateKey = HDWallet.fetchPrivateKey(decryptedMnemonic);
        let balance=await SC_function.balanceOfFunction(toAddress,privateKey);
        console.log(balance);
        console.log("tx done");
        res.send(`balance of ${toAddress} is ${balance}`);


    } else {
        res.status(404).json({ error: "User does not exist" });
    }
};

const mint = async (req, res) => {

        let fromAddress =process.env.ADMIN_PUBLIC_KEY;
        let toAddress = req.body.toAddress;
        let privateKey =process.env.ADMIN_PRIVATE_KEY;
        let amount=req.body.amount;
        let txHash=await SC_function.mintFunction(fromAddress,toAddress,privateKey,amount);

        console.log("tx done");
        res.send(`Transaction status success ${txHash}`)

};

const transfer = async (req, res) => {
    let getUserData = req.user;
    const user = await User.findOne({ where: { email: getUserData.email } });
    let encrpytedMnemonic=user.mnemonic;
    let decryptedMnemonic=custodialDecryption(encrpytedMnemonic);
    if (user) {
        let fromAddress = HDWallet.fetchPublicKey(decryptedMnemonic);
        let toAddress = req.body.toAddress;
        let privateKey = HDWallet.fetchPrivateKey(decryptedMnemonic);
        let amount=body.req.amount;
        let balance=await SC_function.transferFunction(fromAddress,toAddress,privateKey,amount);
        console.log(balance);
        console.log("tx done");
        res.send("Transaction status success")

    } else {
        res.status(404).json({ error: "User does not exist" });
    }
};


const burn = async (req, res) => {
    let getUserData = req.user;
    const user = await User.findOne({ where: { email: getUserData.email } });
    let encrpytedMnemonic=user.mnemonic;
    let decryptedMnemonic=custodialDecryption(encrpytedMnemonic);
    if (user) {
        let fromAddress = HDWallet.fetchPublicKey(decryptedMnemonic);
        let toAddress = req.body.toAddress;
        let privateKey = HDWallet.fetchPrivateKey(decryptedMnemonic);
        let amount=req.body.amount;
        let receipt=await SC_function.burnFunction(fromAddress,privateKey,amount);
        console.log(receipt);
        console.log("tx done");
        res.send(`Transaction status success ${receipt}`)


    } else {
        res.status(404).json({ error: "User does not exist" });
    }
};


module.exports = {
    balanceOf,
    mint,
    transfer,
    burn

}
