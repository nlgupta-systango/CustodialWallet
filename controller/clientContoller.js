const Models = require('./../models');
const { generateApiKey } = require('generate-api-key');
const {custodialEncryption,custodialDecryption}=require('../services/encryptDecrypt');
const jwtToken=require('../services/client_Services/keyGenetator');
const client = Models.ClientTable;

const clientRegister= async(req, res, next)=>{
    var clientUsr = {
      name : req.body.name,
      email : req.body.email,
      key:  generateApiKey()
      //custodialEncryption(newAccount.privateKey)
  
    };
    
    console.log(clientUsr);
    created_user = await client.create(clientUsr);
    clientToken=await jwtToken(req.body.email);
    res.status(201).json(`${created_user}  and client Token is ${clientToken}`);
  };

module.exports = clientRegister;