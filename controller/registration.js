const Models = require('./../models');
const { custodialEncryption } = require('../services/encryptDecrypt');

const HDWallet = require('../services/HDwalletUtility');

const User = Models.UserCustodialWallets;

const createAccount = async (req, res, next) => {

  let newMnemonic = HDWallet.newMnemonicGenerator();
  let accountFlag = HDWallet.createHDwallet(newMnemonic)

  if (accountFlag) {
    let usr = {
      userAddress:HDWallet.fetchPublicKey(newMnemonic),
      mnemonic: custodialEncryption(newMnemonic),

    };
    try{
      created_user = await User.create(usr);
      res.status(201).json(created_user);
  
    }catch(error){
      res.status(404).json({
        error
      });
      
    }
    
  }else{
    res.status(500).json({
     error: "Account not created "
    });
  }

};

module.exports = createAccount;