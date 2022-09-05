const Models = require('../models');
const { custodialEncryption } = require('../services/encryptDecrypt');
let { sendResponse } = require('../services/commonResponse');
const HDWallet = require('../services/hdWallet');

const User = Models.UserCustodialWallet;

const createAccount = async (req, res, next) => {

  let newMnemonic = HDWallet.newMnemonicGenerator();
  let accountFlag = HDWallet.createHDwallet(newMnemonic)
  if(!(req.body) || !(req.body.email))
  return sendResponse(res, 400, null, "Email missing from request body");
  if (accountFlag) {
    let usr = {
      userAddress: HDWallet.fetchPublicKey(newMnemonic),
      mnemonic: custodialEncryption(newMnemonic),
      email: req.body.email,
      clientId: req.client.id
    };
    console.log(req);
    console.log("=========",req.client);
    try {
      let createdUser = await User.create(usr);
      return sendResponse(res, 200, { createdUser }, `Successfully created User!`);

    } catch (error) {
      console.log(error);
      return sendResponse(res, 500, null, "Something went wrong while creating user");

    }
  } else {
    console.log(error);
    return sendResponse(res, 500, null, "Something went wrong while creating account");
  }
};

module.exports = createAccount;