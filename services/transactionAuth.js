const Models = require('../models');
const User = Models.User_Custodial_Wallet;
const { Client }= Models;
let { sendResponse } = require('./commonResponse');


const verifyClient = async (req, res, next) => {
    let clientEmail = req.body.email;
    let fromAddress = req.body.fromAddress;
    if (!fromAddress) 
    return sendResponse(res, 400, null, "fromAddress missing from  Body" );
    try {        
        let userData = await User.findOne({ where: { userAddress: fromAddress } });
        let clientData = await Client.findOne({ where: { email: clientEmail } });
        if (clientData.id == userData.clientId) {
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