const Models = require('../models');
const { generateApiKey } = require('generate-api-key');
const jwtToken=require('../services/client_Services/keyGenetator');
const client = Models.ClientTable;

const clientRegister= async(req, res, next)=>{
    let clientName=req.body.name;
    let clientEmail= req.body.email;
    if (!clientName || !clientEmail) return res.status(404).json({ error: "Body is missing" });

    let clientUsr = {
      name :clientName ,
      email :clientEmail,
      key:  generateApiKey()
    
  
    };
    
    console.log(clientUsr);
    created_user = await client.create(clientUsr);
    clientToken=await jwtToken(req.body.email);
    res.status(201).json(`${created_user}  and client Token is ${clientToken}`);
  };

module.exports = clientRegister;