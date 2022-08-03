const bip39 = require('bip39');
const HDWallet = require('ethereum-hdwallet')
function newMnemonicGenerator() {
    const mnemonic = bip39.generateMnemonic();
    return mnemonic;

}

function createHDwallet(newMnemonic) {
    const hdwallet = HDWallet.fromMnemonic(newMnemonic)
    return hdwallet;

}

function fetchPrivateKey(mnemonicPhase) {
    const hdwallet = HDWallet.fromMnemonic(mnemonicPhase);
    const PRIVATE_KEY = hdwallet.derive(`m/44'/60'/0'/0/0`).getPrivateKey().toString('hex');
    `0x${hdwallet.derive(`m/44'/60'/0'/0/0`).getAddress().toString('hex')}`;
    return PRIVATE_KEY;

}

function fetchPublicKey(mnemonicPhase) {

    const hdwallet = HDWallet.fromMnemonic(mnemonicPhase);
    const PUBLIC_KEY = `0x${hdwallet.derive(`m/44'/60'/0'/0/0`).getAddress().toString('hex')}`;
    return PUBLIC_KEY;
}


module.exports = {
    newMnemonicGenerator,
    createHDwallet,
    fetchPrivateKey,
    fetchPublicKey
}