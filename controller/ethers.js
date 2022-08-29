
const Models = require('../models');
const sendEthers = require('../services/etherTransfer');
const HDWallet = require('../services/hdWallet');
const { custodialDecryption, getMnemonicFromDB } = require('../services/encryptDecrypt');
const { nativeBalance } = require('../services/ContractInteraction/fungibleTokenInteraction');
let { sendResponse } = require('../services/commonResponse');

const User = Models.UserCustodialWallets;
const sendEth = async (req, res) => {
    if (!(req.body) || !(req.body.email) || !(req.body.fromAddress) || !(req.body.ethersToTransfer) || !(req.body.toAddress))
        return sendResponse(res, 400, null, "Client email, fromAddress, toAddress or amount of ethers missing from request body");
    let clientEmail = req.body.email;
    let data = req.user;
    if (clientEmail != data.email)
        return sendResponse(res, 400, null, "Wrong client request for user");
    let fromAddress = req.body.fromAddress;
    let ethersToTransfer = req.body.ethersToTransfer;
    let toAddress = req.body.toAddress;
    let decryptedMnemonic = await getMnemonicFromDB(fromAddress);
    if (decryptedMnemonic) {
        let fromAddress = HDWallet.fetchPublicKey(decryptedMnemonic);
        let privateKey = HDWallet.fetchPrivateKey(decryptedMnemonic);
        try {
            let etherTransferTransactionHash = await sendEthers(fromAddress, toAddress, privateKey, ethersToTransfer);
            console.log("tx done");
            return sendResponse(res, 200, { fromAddress, toAddress, ethersToTransfer, etherTransferTransactionHash }, "Successfully transferred ethers!");

        } catch (error) {
            return sendResponse(res, 500, null, "Something went wrong");
        }

    } else {
        return sendResponse(res, 404, null, "User not found");
    }

};

const checkBalance = async (req, res) => {
    if (!(req.params) || !(req.params.walletAddress))
        return sendResponse(res, 400, null, "Address missing from request params");
    let walletAddress = req.params.walletAddress;
    let etherBalance = await nativeBalance(walletAddress);
    return sendResponse(res, 200, { walletAddress, etherBalance }, "Successfully fetched balance for wallet address");

}


module.exports = {
    sendEth,
    checkBalance

};