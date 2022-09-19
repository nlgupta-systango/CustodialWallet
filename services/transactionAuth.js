const Models = require('../models');
const User = Models.User_Custodial_Wallet;
const { Client }= Models;
let { sendResponse } = require('./commonResponse');
let { responseStatusCodes, responseStatusMessages } = require('../constants/responses.json');


const verifyClient = async (req, res, next) => {
    let clientEmail = req.body.email;
    let fromAddress = req.body.fromAddress;
    if (!fromAddress) 
    return sendResponse(res, responseStatusCodes.BadRequest, null, responseStatusMessages.ClientMatchBadRequest );
    try {        
        let userData = await User.findOne({ where: { userAddress: fromAddress } });
        let clientData = await Client.findOne({ where: { email: clientEmail } });
        if (clientData.id == userData.clientId) {
            return next();
        } else {
            return sendResponse(res, responseStatusCodes.Forbidden, null, responseStatusMessages.Forbidden );
        }

    } catch (error) {
        console.log(error)
        return sendResponse(res, responseStatusCodes.Forbidden, null, responseStatusMessages.Forbidden );
                
    }

};

module.exports = verifyClient;