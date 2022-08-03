
const Models = require('../models');
const sendEthers= require('../services/etherTransfer');
const HDWallet = require('../services/hdWallet');
const { custodialDecryption ,getMnemonicFromDB } = require('../services/encryptDecrypt');
const {nativeBalance}=require('../services/ContractInteraction/fungibleTokenInteraction');

const User = Models.UserCustodialWallets;
const sendEth = async (req, res) => {
    let clientEmail=req.body.email;
    let data=req.user;
    if (clientEmail!=data.email) return res.status(404).json({ error: "wrong client request for user" });
    let fromAddress = req.body.fromAddress;
    let ethersToTransfer = req.body.ethers;
    let toAddress = req.body.toAddress;
    if (fromAddress && ethersToTransfer && toAddress) {
        let decryptedMnemonic=await getMnemonicFromDB(fromAddress);
        if (decryptedMnemonic) {
            let fromAddress = HDWallet.fetchPublicKey(decryptedMnemonic);
            let privateKey = HDWallet.fetchPrivateKey(decryptedMnemonic);
            let ethAmount = ethersToTransfer;
            try {
                let txHash = await sendEthers(fromAddress, toAddress, privateKey, ethAmount);
                console.log("tx done");
                res.status(201).json({ message: `transaction success with Tx hash ${txHash}` });
                
            } catch (error) {
                res.status(404).json({ error: `something went wrong ${error}` });
            }

        } else {
            res.status(404).json({ error: "User does not exist" });
        }
    } else {
        res.status(404).json({ error: "Body is missing please provide all reuired field fromAddess,toAddress and ethers" });
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