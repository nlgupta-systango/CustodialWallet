
const Models = require('./../models');
const sendEthers = require('../services/etherTransfer');
const HDWallet = require('../services/HDwalletUtility');
const {custodialDecryption}=require('../services/encryptDecrypt');
const dotenv = require('dotenv');
dotenv.config();
const User = Models.UserCustodialWallets;
const sendEth = async (req, res) => {
    let getUserData = req.user;
    const user = await User.findOne({ where: { email: getUserData.email } });
    let encrpytedMnemonic=user.mnemonic;
    let decryptedMnemonic=custodialDecryption(encrpytedMnemonic);

    
    if (user) {
        let fromAddress = HDWallet.fetchPublicKey(decryptedMnemonic);
        let toAddress = req.body.toAddress;
        let privateKey = HDWallet.fetchPrivateKey(decryptedMnemonic);
        let ethAmount = req.body.ethers;
        await sendEthers(fromAddress, toAddress, privateKey, ethAmount);
        console.log("tx done");
        res.send("Transaction status success")


    } else {
        res.status(404).json({ error: "User does not exist" });
    }
  

};



module.exports = sendEth;