const Models = require('./../models');
const { generateApiKey } = require('generate-api-key');
const {custodialEncryption,custodialDecryption}=require('../services/encryptDecrypt');
const jwtToken=require('../services/client_Services/keyGenetator');
const client = Models.ClientTable;

const clientRegister= async(req, res, next)=>{
    let clientName=req.body.name;
    let clientEmail= req.body.email;
    if (!clientName || !clientEmail) return res.status(404).json({ error: "Body is missing" });

    var clientUsr = {
      name :clientName ,
      email :clientEmail,
      key:  generateApiKey()
      //custodialEncryption(newAccount.privateKey)
  
    };
    
    console.log(clientUsr);
    created_user = await client.create(clientUsr);
    clientToken=await jwtToken(req.body.email);
    res.status(201).json(`${created_user}  and client Token is ${clientToken}`);
  };

module.exports = clientRegister;