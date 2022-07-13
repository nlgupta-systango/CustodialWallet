const Models = require('./../models');
const bcrypt = require("bcrypt");
const {custodialEncryption,custodialDecryption}=require('../services/encryptDecrypt');
const createAccount=require('../services/accountGenerate');
const User = Models.CustodialWallet;

const register= async(req, res, next)=>{

    const salt = await bcrypt.genSalt(10);
    let newAccount=await createAccount();
    var usr = {
      Name : req.body.name,
      email : req.body.email,
      password : await bcrypt.hash(req.body.password, salt),
      publicKey: newAccount.address,
      privateKey:  custodialEncryption(newAccount.privateKey),
  
    };

    created_user = await User.create(usr);
    res.status(201).json(created_user);
  };

module.exports = register;