const jwt = require("jsonwebtoken");
const Models = require('../models');
const User = Models.UserCustodialWallets;
const Client = Models.ClientTable;


const verifyUser = async (req, res, next) => {
    const token = req.headers["x-access-token"];
    let clientEmail = req.body.email;
    let fromAddress = req.body.fromAddress;
    if (!fromAddress) return res.status(404).json({ error: "fromAddress not found in Body" });
    try {
        
        let userData = await User.findOne({ where: { userAddress: fromAddress } });
        console.log(userData);
        let clientData = await Client.findOne({ where: { email: clientEmail } });
        const decoded = jwt.verify(token, clientData.key);
        if (clientEmail == userData.email) {
            return next();
        } else {
            res.status(404).json("wrong user request for provided client");
        }
    } catch (error) {
        res.status(404).json({ error: `something went wrong : ${error}` });
        
    }

};

module.exports = verifyUser;