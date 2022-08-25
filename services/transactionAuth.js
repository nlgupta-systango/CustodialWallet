const jwt = require("jsonwebtoken");
const Models = require('../models');
const User = Models.UserCustodialWallets;
const Client = Models.ClientTable;


const verifyClient = async (req, res, next) => {
    const token = req.headers["x-access-token"];
    let clientEmail = req.body.email;
    let fromAddress = req.body.fromAddress;
    if (!fromAddress) 
    return sendResponse(res, 400, null, "fromAddress missing from  Body" );
    try {        
        let userData = await User.findOne({ where: { userAddress: fromAddress } });
        console.log(userData);
        // let clientData = await Client.findOne({ where: { email: clientEmail } });
        if (clientEmail == userData.email) {
            return next();
        } else {
            return sendResponse(res, 403, null, "This wallet was not created by provided client" );
        }

    } catch (error) {
        return sendResponse(res, 500, null, "Something went wrong");
                
    }

};

module.exports = verifyClient;