const CryptoJS = require('crypto-js');
const dotenv=require('dotenv');
dotenv.config();
const AES_KEY=process.env.AES_KEY;

const custodialEncryption=(txt)=>{
  var encrypted = CryptoJS.AES.encrypt(txt, AES_KEY); 
  finalCipher=CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(encrypted));
  return finalCipher;

}

const custodialDecryption=(cipher)=>{
  decryptedCipher=CryptoJS.enc.Base64.parse(cipher).toString(CryptoJS.enc.Utf8);
  var decryptedTxt = CryptoJS.AES.decrypt(decryptedCipher, AES_KEY);
  return decryptedTxt.toString(CryptoJS.enc.Utf8);

}

module.exports={
    custodialEncryption,
    custodialDecryption
}
