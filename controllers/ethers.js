
const Models = require('../models');
const {sendEthers} = require('../services/blockchain/etherTransfer');
const HDWallet = require('../services/hdWallet');
const { custodialDecryption, getMnemonicFromDB } = require('../services/encryptDecrypt');
const { getEtherBalance } = require('../services/blockchain/etherTransfer');
let { sendResponse } = require('../services/commonResponse');
let { responseStatusCodes, responseStatusMessages } = require('../constants/responses.json');

const User = Models.User_Custodial_Wallet;

const sendEth = async (req, res) => {
    if (!(req.body) || !(req.body.email) || !(req.body.fromAddress) || !(req.body.amount) || !(req.body.toAddress))
        return sendResponse(res, responseStatusCodes.BadRequest, null, responseStatusMessages.EtherTransferBadRequest);
    let fromAddress = req.body.fromAddress;
    let amount = req.body.amount;
    let toAddress = req.body.toAddress;
    let decryptedMnemonic = await getMnemonicFromDB(fromAddress);
    if (decryptedMnemonic) {
        let fromAddress = HDWallet.fetchPublicKey(decryptedMnemonic);
        let privateKey = HDWallet.fetchPrivateKey(decryptedMnemonic);
        try {
            let etherTransferTransactionHash = await sendEthers(fromAddress, toAddress, privateKey, amount);
            console.log("tx done");
            return sendResponse(res, responseStatusCodes.OK, { fromAddress, toAddress, amount, etherTransferTransactionHash }, responseStatusMessages.OK);

        } catch (error) {
            console.log(error);
            return sendResponse(res, responseStatusCodes.InternalServerError, null, responseStatusMessages.InternalServerError);
        }

    } else {
        return sendResponse(res, responseStatusCodes.NotFound, null, responseStatusMessages.NotFound);
    }

};

const checkBalance = async (req, res) => {
    if (!(req.params) || !(req.params.walletAddress))
        return sendResponse(res, responseStatusCodes.BadRequest, null, responseStatusMessages.GetBalanceBadRequest);
    let walletAddress = req.params.walletAddress;
    let etherBalance = await getEtherBalance(walletAddress);
    return sendResponse(res, responseStatusCodes.OK, { walletAddress, etherBalance }, responseStatusMessages.OK);

}


module.exports = {
    sendEth,
    checkBalance

};