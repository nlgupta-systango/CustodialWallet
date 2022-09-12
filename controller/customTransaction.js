
const Models = require('../models');
const { sendCustomTransaction } = require('../services/blockchain/etherTransfer');
const HDWallet = require('../services/hdWallet');
const { custodialDecryption, getMnemonicFromDB } = require('../services/encryptDecrypt');
const { getEtherBalance } = require('../services/blockchain/etherTransfer');
let { sendResponse } = require('../services/commonResponse');


const customTransaction = async (req, res) => {
    if (!(req.body) || !(req.body.email) || !(req.body.fromAddress) || !(req.body.amount) || !(req.body.toAddress) || !(req.body.encodedTxData))
        return sendResponse(res, 400, null, "Client email, fromAddress, toAddress, amount of ethers or data missing from request body");
    let clientEmail = req.body.email;
    let data = req.client;
    if (clientEmail != data.email)
        return sendResponse(res, 400, null, "Wrong client request for user");
    let fromAddress = req.body.fromAddress;
    let amount = req.body.amount;
    let toAddress = req.body.toAddress;
    let decryptedMnemonic = await getMnemonicFromDB(fromAddress);
    if (decryptedMnemonic) {
        let fromAddress = HDWallet.fetchPublicKey(decryptedMnemonic);
        let privateKey = HDWallet.fetchPrivateKey(decryptedMnemonic);
        try {
            let transactionHash = await sendCustomTransaction(fromAddress, toAddress, privateKey, amount, encodedTxData);
            console.log("tx done");
            return sendResponse(res, 200, { fromAddress, toAddress, amount, transactionHash }, "Success!");

        } catch (error) {
            return sendResponse(res, 500, null, "Something went wrong");
        }

    } else {
        return sendResponse(res, 404, null, "User not found");
    }

};

module.exports = {
    customTransaction,
};