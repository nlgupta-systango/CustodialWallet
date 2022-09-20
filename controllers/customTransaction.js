
const Models = require('../models');
const { sendCustomTransaction } = require('../services/blockchain/etherTransfer');
const HDWallet = require('../services/hdWallet');
const { custodialDecryption, getMnemonicFromDB } = require('../services/encryptDecrypt');
const { getEtherBalance, getGasEstimate } = require('../services/blockchain/etherTransfer');
let { sendResponse } = require('../services/commonResponse');
let { responseStatusCodes, responseStatusMessages } = require('../constants/responses.json');


const executeCustomTransaction = async (req, res) => {
    if (!(req.body) || !(req.body.email) || !(req.body.fromAddress) || !(req.body.amount) || !(req.body.toAddress) || !(req.body.encodedTxData))
        return sendResponse(res, responseStatusCodes.BadRequest, null, responseStatusMessages.CustomTxBadRequest);
    let fromAddress = req.body.fromAddress;
    let amount = req.body.amount;
    let toAddress = req.body.toAddress;
    let encodedTxData = req.body.encodedTxData;
    let decryptedMnemonic = await getMnemonicFromDB(fromAddress);
    if (decryptedMnemonic) {
        let fromAddress = HDWallet.fetchPublicKey(decryptedMnemonic);
        let privateKey = HDWallet.fetchPrivateKey(decryptedMnemonic);
        try {
            let transactionHash = await sendCustomTransaction(fromAddress, toAddress, privateKey, amount, encodedTxData);
            console.log("tx done");
            return sendResponse(res, responseStatusCodes.OK, { fromAddress, toAddress, amount, transactionHash },responseStatusMessages.OK);

        } catch (error) {
            console.log(error);
            return sendResponse(res, responseStatusCodes.InternalServerError, null, responseStatusMessages.InternalServerError);
        }

    } else {
        return sendResponse(res, responseStatusCodes.NotFound, null, responseStatusMessages.NotFound);
    }

};

const checkGasEstimate = async (req, res) => {
    if (!(req.body) || !(req.body.fromAddress) || !(req.body.amount) || !(req.body.toAddress) || !(req.body.encodedTxData))
        return sendResponse(res, responseStatusCodes.BadRequest, null, responseStatusMessages.CustomTxBadRequest);
    let fromAddress = req.body.fromAddress;
    let amount = req.body.amount;
    let toAddress = req.body.toAddress;
    let encodedTxData = req.body.encodedTxData;    
    let gasEstimate = (await getGasEstimate(fromAddress, toAddress, amount, encodedTxData)).toString();
    return sendResponse(res, responseStatusCodes.OK, { gasEstimate }, responseStatusMessages.OK);

}

module.exports = {
    executeCustomTransaction,
    checkGasEstimate
};