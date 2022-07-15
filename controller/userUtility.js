
const Models = require('./../models');
const HDWallet = require('../services/HDwalletUtility');
const {custodialDecryption}=require('../services/encryptDecrypt');
const dotenv = require('dotenv');
dotenv.config();
const User = Models.UserCustodialWallets;

const getPrivateKey = async (req, res, next) => {
    let getUserData = req.user;
    const user = await User.findOne({ where: { email: getUserData.email } });
    let encrpytedMnemonic=user.mnemonic;
    let decryptedMnemonic=custodialDecryption(encrpytedMnemonic);
    if (user) {
        // let fromAddress = HDWallet.fetchPublicKey(decryptedMnemonic);
        // let toAddress = req.body.toAddress;
        let privateKey = HDWallet.fetchPrivateKey(decryptedMnemonic);
        // let ethAmount = req.body.ethers;
       // await sendEthers(fromAddress, toAddress, privateKey, ethAmount);
       // console.log("tx done");
        res.send(privateKey)


    } else {
        res.status(404).json({ error: "User does not exist" });
    }
    return next();

};
const getPublicKey = async (req, res, next) => {
    let getUserData = req.user;
    const user = await User.findOne({ where: { email: getUserData.email } });
    let encrpytedMnemonic=user.mnemonic;
    let decryptedMnemonic=custodialDecryption(encrpytedMnemonic);
    if (user) {
        // let fromAddress = HDWallet.fetchPublicKey(decryptedMnemonic);
        // let toAddress = req.body.toAddress;
        let publicKey =HDWallet.fetchPublicKey(decryptedMnemonic);
        // let ethAmount = req.body.ethers;
       // await sendEthers(fromAddress, toAddress, privateKey, ethAmount);
       // console.log("tx done");
        res.send(publicKey)


    } else {
        res.status(404).json({ error: "User does not exist" });
    }
    return next();

};





module.exports = {
    getPrivateKey,
    getPublicKey

};