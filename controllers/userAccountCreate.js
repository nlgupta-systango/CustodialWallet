const Models = require('../models');
const { custodialEncryption } = require('../services/encryptDecrypt');
let { sendResponse } = require('../services/commonResponse');
const HDWallet = require('../services/hdWallet');
let { responseStatusCodes, responseStatusMessages } = require('../constants/responses.json');


const User = Models.User_Custodial_Wallet;

const createAccount = async (req, res, next) => {

  let newMnemonic = HDWallet.newMnemonicGenerator();
  let accountFlag = HDWallet.createHDwallet(newMnemonic)
  if(!(req.body) || !(req.body.email))
    return sendResponse(res, responseStatusCodes.BadRequest, null, responseStatusMessages.CreateWalletBadRequest);
  if (accountFlag) {
    let usr = {
      userAddress: HDWallet.fetchPublicKey(newMnemonic),
      mnemonic: custodialEncryption(newMnemonic),
      email: req.body.email,
      clientId: req.client.id
    };
    console.log("Private key of ", HDWallet.fetchPublicKey(newMnemonic), " : ", HDWallet.fetchPrivateKey(newMnemonic))
    try {
      let createdUser = await User.create(usr);
      return sendResponse(res, responseStatusCodes.OK, { createdUser }, responseStatusMessages.OK);

    } catch (error) {
      return sendResponse(res, responseStatusCodes.InternalServerError, null, responseStatusMessages.InternalServerError);

    }
  } else {
    return sendResponse(res, responseStatusCodes.InternalServerError, null, responseStatusMessages.InternalServerError);
  }
};

module.exports = createAccount;