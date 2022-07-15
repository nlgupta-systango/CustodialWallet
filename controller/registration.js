const Models = require('./../models');
const bcrypt = require("bcrypt");
const { custodialEncryption, custodialDecryption } = require('../services/encryptDecrypt');
// const createAccount=require('../services/accountGenerate');
const HDWallet = require('../services/HDwalletUtility');

const User = Models.UserCustodialWallets;

const register = async (req, res, next) => {

  const salt = await bcrypt.genSalt(10);
  let newMnemonic = HDWallet.newMnemonicGenerator();
  let accountFlag = HDWallet.createHDwallet(newMnemonic)

  if (accountFlag) {
    var usr = {
      Name: req.body.Name,
      email: req.body.email,
      password: await bcrypt.hash(req.body.password, salt),
      mnemonic: custodialEncryption(newMnemonic),

    };
    try{
      created_user = await User.create(usr);
      res.status(201).json(created_user);
  
    }catch{
      console.log("-------------Invalid entry-----------");
    }
    
  }else{
    console.log("account is not created");
  }

};

module.exports = register;