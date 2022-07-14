
const Models = require('./../models');
const sendEthers = require('../services/etherTransfer');
const dotenv = require('dotenv');
dotenv.config();
const User = Models.CustodialWallet;
const sendEth = async (req, res, next) => {
    let getUserData = req.user;
    const user = await User.findOne({ where: { email: getUserData.email } });
    if (user) {
        let fromAddress = user.publicKey;
        let toAddress = req.body.toAddress;
        let encrpytedPrivatekey = user.privateKey;
        let ethAmount = req.body.ethers;
        await sendEthers(fromAddress, toAddress, encrpytedPrivatekey, ethAmount);
        console.log("tx done");
        res.send("Transaction status success")


    } else {
        res.status(404).json({ error: "User does not exist" });
    }
    return next();

};



module.exports = sendEth;