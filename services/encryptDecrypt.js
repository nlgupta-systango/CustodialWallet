const CryptoJS = require('crypto-js');
const Models = require('./../models');
const dotenv = require('dotenv');
dotenv.config();
const AES_KEY = process.env.AES_KEY;
const User = Models.User_Custodial_Wallet;

const custodialEncryption = (txt) => {
  let encrypted = CryptoJS.AES.encrypt(txt, AES_KEY);
  finalCipher = CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(encrypted));
  return finalCipher;

}

const custodialDecryption = (cipher) => {
  decryptedCipher = CryptoJS.enc.Base64.parse(cipher).toString(CryptoJS.enc.Utf8);
  let decryptedTxt = CryptoJS.AES.decrypt(decryptedCipher, AES_KEY);
  return decryptedTxt.toString(CryptoJS.enc.Utf8);

}

const getMnemonicFromDB = async (userAddress) => {
  let fromAddress = userAddress;
  if (!fromAddress) 
    return;
  const user = await User.findOne({ where: { userAddress: fromAddress } });
  if (!user) 
    return;
  let encrpytedMnemonic = user.mnemonic;
  let decryptedMnemonic = custodialDecryption(encrpytedMnemonic);
  return decryptedMnemonic;

}

module.exports = {
  custodialEncryption,
  custodialDecryption,
  getMnemonicFromDB
}
