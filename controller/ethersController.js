
const Models = require('../models');
const {sendEthers} = require('../services/etherTransfer');
const HDWallet = require('../services/HDwalletUtility');
const { custodialDecryption } = require('../services/encryptDecrypt');
const {nativeBalance}=require('../services/ContractInteraction/SCinteraction');
const dotenv = require('dotenv');
dotenv.config();
const User = Models.UserCustodialWallets;
const sendEth = async (req, res) => {
    let userAddress = req.body.fromAddress;
    let ethersToTransfer = req.body.ethers;
    let toAddress = req.body.toAddress;
    console.log(`${userAddress} ${ethersToTransfer} ${toAddress}`);
    if (userAddress && ethersToTransfer && toAddress) {

        const user = await User.findOne({ where: { userAddress: userAddress } });
        let encrpytedMnemonic = user.mnemonic;
        let decryptedMnemonic = custodialDecryption(encrpytedMnemonic);


        if (user) {
            let fromAddress = HDWallet.fetchPublicKey(decryptedMnemonic);
            let privateKey = HDWallet.fetchPrivateKey(decryptedMnemonic);
            let ethAmount = ethersToTransfer;
            let txHash = await sendEthers(fromAddress, toAddress, privateKey, ethAmount);
            console.log("tx done");
            res.status(201).json({ message: `transaction success with Tx hash ${txHash}` });

        } else {
            res.status(404).json({ error: "User does not exist" });
        }
    } else {
        res.status(404).json({ error: "Body is missing please provide fromAddess,toAddress and ethers" });
    }


};

const checkBalance = async (req, res) => {
    let publickey=req.params.address;
    let ethBalance=await nativeBalance(publickey);
    res.status(201).json({
        message:`balance of ${publickey} is ${ethBalance}`
    });
    

}


module.exports ={ 
    sendEth,
    checkBalance

};