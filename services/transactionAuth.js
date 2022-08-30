const jwt = require("jsonwebtoken");
const Models = require('../models');
const User = Models.UserCustodialWallet;
const Client = Models.ClientTable;
let { sendResponse } = require('./commonResponse');



const verifyClient = async (req, res, next) => {
    const token = req.headers["x-access-token"];
    let clientEmail = req.body.email;
    let fromAddress = req.body.fromAddress;
    if (!fromAddress) 
    return sendResponse(res, 400, null, "fromAddress missing from  Body" );
    try {        
        let userData = await User.findOne({ where: { userAddress: fromAddress } });
        // let clientData = await Client.findOne({ where: { email: clientEmail } });
        if (clientEmail == userData.email) {
            return next();
        } else {
            return sendResponse(res, 403, null, "This wallet was not created by provided client" );
        }

    } catch (error) {
        console.log(error)
        return sendResponse(res, 403, null, "Unauthorized request, This wallet was not created by provided client");
                
    }

};

module.exports = verifyClient;