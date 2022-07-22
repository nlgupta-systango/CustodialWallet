
const Models = require('./../models');
const HDWallet = require('../services/HDwalletUtility');
const { custodialDecryption } = require('../services/encryptDecrypt');

const User = Models.UserCustodialWallets;


// just for testing ,will remove
const getPrivateKey = async (req, res, next) => {
    let getUserData = req.user;
    const user = await User.findOne({ where: { email: getUserData.email } });
    let encrpytedMnemonic = user.mnemonic;
    let decryptedMnemonic = custodialDecryption(encrpytedMnemonic);
    if (user) {

        let privateKey = HDWallet.fetchPrivateKey(decryptedMnemonic);

        res.send(privateKey)


    } else {
        res.status(404).json({ error: "User does not exist" });
    }
    return next();

};
const getPublicKey = async (req, res, next) => {
    let getUserData = req.user;
    const user = await User.findOne({ where: { email: getUserData.email } });
    let encrpytedMnemonic = user.mnemonic;
    let decryptedMnemonic = custodialDecryption(encrpytedMnemonic);
    if (user) {

        let publicKey = HDWallet.fetchPublicKey(decryptedMnemonic);
        res.send(publicKey)


    } else {
        res.status(404).json({ error: "User does not exist" });
    }
    return next();

};





module.exports = {
    getPrivateKey,
    getPublicKey

};