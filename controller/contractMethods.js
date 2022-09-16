
const Models = require('./../models');
const HDWallet = require('../services/hdWallet');
const { custodialDecryption, getMnemonicFromDB } = require('../services/encryptDecrypt');
const SC_function = require('../services/blockchain/contractInteraction/fungibleTokenInteraction');
const {sendEthers, getEtherBalance} = require('../services/blockchain/etherTransfer');
let { sendResponse } = require('../services/commonResponse');
let { responseStatusCodes, responseStatusMessages } = require('../constants/responses.json');

const dotenv = require('dotenv');
dotenv.config({ path: '../.env' });

const tokenBalanceOf = async (req, res) => {
    if (!req.params || !req.params.address)
        return sendResponse(res, responseStatusCodes.BadRequest, null, "Wallet address missing from request params");

    let walletAddress = req.params.address;
    try {
        let fungibleTokenBalance = await SC_function.balanceOfFunction(walletAddress);
        return sendResponse(res, responseStatusCodes.OK, { walletAddress, fungibleTokenBalance }, responseStatusMessages.OK);

    } catch (error) {
        return sendResponse(res, responseStatusCodes.InternalServerError, null, responseStatusMessages.InternalServerError);

    }
};

const tokenName = async (req, res) => {
    try {
        let fungibleTokenName = await SC_function.getTokenName();
        return sendResponse(res, responseStatusCodes.OK, { fungibleTokenName }, responseStatusMessages.OK);

    } catch (error) {
        return sendResponse(res, responseStatusCodes.InternalServerError, null, responseStatusMessages.InternalServerError);

    }
};

const totalSupply = async (req, res) => {
    try {
        let fumgibleTokenTotalSupply = await SC_function.totalSupply();
        return sendResponse(res, responseStatusCodes.OK, { fumgibleTokenTotalSupply }, responseStatusMessages.OK);

    } catch (error) {
        return sendResponse(res, responseStatusCodes.InternalServerError, null, responseStatusMessages.InternalServerError);

    }
};

const tokenSymbol = async (req, res) => {
    try {
        let fungibleTokenSymbol = await SC_function.getSymbol();
        return sendResponse(res, responseStatusCodes.OK, { fungibleTokenSymbol }, responseStatusMessages.OK);

    } catch (error) {
        return sendResponse(res, responseStatusCodes.InternalServerError, null, responseStatusMessages.InternalServerError);

    }
};

const tokenPrice = async (req, res) => {
    let fungibleTokenPrice = process.env.TOKEN_PRICE;
    return sendResponse(res, responseStatusCodes.OK, { fungibleTokenPrice }, responseStatusMessages.OK);
};

const mint = async (req, res) => {
    let fromAddress = process.env.ADMIN_PUBLIC_KEY;
    let privateKey = process.env.ADMIN_PRIVATE_KEY;
    let toAddress = req.body.toAddress;
    let amount = req.body.amount;
    if (!(req.body) || !(req.body.toAddress) || !(req.body.amount))
        return sendResponse(res, responseStatusCodes.BadRequest, null, "Wallet address or amount missing from request boody");
    try {
        let mintTransactionHash = await SC_function.mintFunction(fromAddress, toAddress, privateKey, amount);
        console.log("tx done");
        return sendResponse(res, responseStatusCodes.OK, { fromAddress, toAddress, amount, mintTransactionHash }, responseStatusMessages.OK);

    } catch (error) {
        return sendResponse(res, responseStatusCodes.InternalServerError, null, responseStatusMessages.InternalServerError);

    }
};

const transfer = async (req, res) => {

    if (!(req.body) || !(req.body.fromAddress) || !(req.body.toAddress) || !(req.body.amount))
        return sendResponse(res, responseStatusCodes.BadRequest, null, "fromAddress, toAddress or amount is missing from request body");
    let fromAddress = req.body.fromAddress;
    let amount = req.body.amount;
    let toAddress = req.body.toAddress;
    let decryptedMnemonic = await getMnemonicFromDB(fromAddress);
    if (decryptedMnemonic) {
        try {
            let fromAddress = HDWallet.fetchPublicKey(decryptedMnemonic);
            let privateKey = HDWallet.fetchPrivateKey(decryptedMnemonic);
            let fungibleTokenTransferTransactionHash = await SC_function.transferFunction(fromAddress, toAddress, privateKey, amount);
            return sendResponse(res, responseStatusCodes.OK, { fromAddress, toAddress, amount, fungibleTokenTransferTransactionHash }, responseStatusMessages.OK);

        } catch (error) {
            return sendResponse(res, responseStatusCodes.InternalServerError, null, responseStatusMessages.InternalServerError);

        }

    } else {
        res.status(404).json({ error: "User does not exist" });
    }
};


// const transferFrom = async (req, res) => {
//     let fromAddress = req.body.fromAddress;
//     let approvedAddress=req.body.approvedAddress;
//     let amount = req.body.amount;
//     if (!fromAddress || !amount || !approvedAddress) return res.status(404).json({ error: "fromAddress,approvedAddress or amount is missing" });

//     let decryptedMnemonic = await getMnemonicFromDB(approvedAddress);
//     if (decryptedMnemonic) {
//         try {
//         let fromAddress = HDWallet.fetchPublicKey(decryptedMnemonic);
//         let toAddress = req.body.toAddress;
//         let privateKey = HDWallet.fetchPrivateKey(decryptedMnemonic);

//             let txHash = await SC_function.transferFromFunction(approvedAddress,fromAddress, toAddress, privateKey, amount);

//             res.status(201).json({ message: `${amount} token transfered to ${toAddress} and transaction hash is ${txHash.transactionHash}` });
//         } catch (error) {
//             res.status(404).json({ error: `something went wrong : ${error}`});

//         }

//     } else {
//         res.status(404).json({ error: "User does not exist" });
//     }
// };


const approve = async (req, res) => {

    if (!(req.body) || !(req.body.fromAddress) || !(req.body.spenderAddress) || !(req.body.amount))
        return sendResponse(res, responseStatusCodes.BadRequest, null, responseStatusMessages.FTApproveBadRequest);
    let fromAddress = req.body.fromAddress;
    let spenderAddress = req.body.spenderAddress;
    let amount = req.body.amount;
    let decryptedMnemonic = await getMnemonicFromDB(fromAddress);
    if (decryptedMnemonic) {
        try {
            let fromAddress = HDWallet.fetchPublicKey(decryptedMnemonic);
            let privateKey = HDWallet.fetchPrivateKey(decryptedMnemonic);
            let fungibleTokenApproveTransactionHash = await SC_function.approveFunction(fromAddress, spenderAddress, privateKey, amount);
            return sendResponse(res, responseStatusCodes.OK, { fromAddress, spenderAddress, amount, fungibleTokenApproveTransactionHash }, responseStatusMessages.OK);

        } catch (error) {
            return sendResponse(res, responseStatusCodes.InternalServerError, null, responseStatusMessages.InternalServerError);

        }

    } else {
        res.status(404).json({ error: "User does not exist" });
    }
};

const burn = async (req, res) => {
    if (!(req.body) || !(req.body.fromAddress) || !(req.body.amount))
        return sendResponse(res, responseStatusCodes.BadRequest, null, responseStatusMessages.FTUserMintBurnBadRequest);
    let fromAddress = req.body.fromAddress;
    let amount = req.body.amount;
    let decryptedMnemonic = await getMnemonicFromDB(fromAddress);
    if (decryptedMnemonic) {
        try {
            let fromAddress = HDWallet.fetchPublicKey(decryptedMnemonic);
            let privateKey = HDWallet.fetchPrivateKey(decryptedMnemonic);
            let fungibleTokenBurnTransactionHash = await SC_function.burnFunction(fromAddress, privateKey, amount);
            console.log("tx done");
            return sendResponse(res, responseStatusCodes.OK, { fromAddress, amount, fungibleTokenBurnTransactionHash }, responseStatusMessages.OK);

        } catch (error) {
            return sendResponse(res, responseStatusCodes.InternalServerError, null, responseStatusMessages.InternalServerError);

        }

    } else {
        return sendResponse(res, 404, null, "User not found");
    }
};

const mintInternal = async (toAddress, amount) => {

    let fromAddress = process.env.ADMIN_PUBLIC_KEY;
    let privateKey = process.env.ADMIN_PRIVATE_KEY;
    try {
        let txHash = await SC_function.mintFunction(fromAddress, toAddress, privateKey, amount);
        return txHash;

    } catch (error) {
        return sendResponse(res, responseStatusCodes.InternalServerError, null, responseStatusMessages.InternalServerError);

    }

};

const userMint = async (req, res) => {
    let fromAddress = req.body.fromAddress;
    let amount = req.body.amount;
    if (!(req.body) || !(req.body.fromAddress) || !(req.body.amount))
        return sendResponse(res, responseStatusCodes.BadRequest, null, responseStatusMessages.FTUserMintBurnBadRequest);
    let decryptedMnemonic = null;
    try {
        decryptedMnemonic = await getMnemonicFromDB(fromAddress);

    } catch (error) {
        return sendResponse(res, responseStatusCodes.InternalServerError, null, responseStatusMessages.InternalServerError);

    }
    if (decryptedMnemonic) {

        let fromAddress = HDWallet.fetchPublicKey(decryptedMnemonic);
        let privateKey = HDWallet.fetchPrivateKey(decryptedMnemonic);
        let toAddress = process.env.ADMIN_PUBLIC_KEY;
        let tokenPrice = parseFloat(process.env.TOKEN_PRICE);
        let requiredEther = tokenPrice * amount;
        let userBal = null;
        try {
            userBal = await getEtherBalance(fromAddress);
        } catch (error) {
            return sendResponse(res, responseStatusCodes.InternalServerError, null, responseStatusMessages.GetEthBalanceException);
        }
        let etherTransferTransactionHash = null;
        let fungibleTokenMintTransactionHash = null;
        if (userBal > requiredEther) {
            try {
                console.log(`user bal=${userBal} and req ether= ${requiredEther}`);
                etherTransferTransactionHash = await sendEthers(fromAddress, toAddress, privateKey, requiredEther);
                fungibleTokenMintTransactionHash = await mintInternal(fromAddress, amount);
                return sendResponse(res, responseStatusCodes.OK, { fromAddress, amount, etherTransferTransactionHash, fungibleTokenMintTransactionHash }, responseStatusMessages.OK);

            } catch (error) {
                return sendResponse(res, responseStatusCodes.InternalServerError, null, responseStatusMessages.SendTxException);
            }

        } else {
            return sendResponse(res, responseStatusCodes.InternalServerError, null, responseStatusMessages.InsufficientEthBalance);
        }

    } else {
        return sendResponse(res, 404, null, "User not found");
    }
}


module.exports = {
    tokenBalanceOf,
    mint,
    approve,
    transfer,
    // transferFrom,
    burn,
    userMint,
    tokenName,
    totalSupply,
    tokenSymbol,
    tokenPrice

}
