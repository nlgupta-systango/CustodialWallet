
const Models = require('./../models');
const HDWallet = require('../services/hdWallet');
const { custodialDecryption, getMnemonicFromDB } = require('../services/encryptDecrypt');
const SC_function = require('../services/ContractInteraction/fungibleTokenInteraction');
const sendEthers = require('../services/etherTransfer');
let { sendResponse } = require('../services/commonResponse');

const dotenv = require('dotenv');
dotenv.config({ path: '../.env' });
// const User = Models.User_Custodial_Wallet;

const tokenBalanceOf = async (req, res) => {
    if (!req.params || !req.params.address)
        return sendResponse(res, 400, null, "Wallet address missing from request params");

    let walletAddress = req.params.address;
    try {
        let fungibleTokenBalance = await SC_function.balanceOfFunction(walletAddress);
        return sendResponse(res, 200, { walletAddress, fungibleTokenBalance }, "Successfully fetched balance for wallet address");

    } catch (error) {
        return sendResponse(res, 500, null, "Something went wrong");

    }
};

const tokenName = async (req, res) => {
    try {
        let fungibleTokenName = await SC_function.getTokenName();
        return sendResponse(res, 200, { fungibleTokenName }, "Successfully fetched name of fungible token");

    } catch (error) {
        return sendResponse(res, 500, null, "Something went wrong");

    }
};

const totalSupply = async (req, res) => {
    try {
        let fumgibleTokenTotalSupply = await SC_function.totalSupply();
        return sendResponse(res, 200, { fumgibleTokenTotalSupply }, "Successfully fetched total supply of fungible token");

    } catch (error) {
        return sendResponse(res, 500, null, "Something went wrong");

    }
};

const tokenSymbol = async (req, res) => {
    try {
        let fungibleTokenSymbol = await SC_function.getSymbol();
        return sendResponse(res, 200, { fungibleTokenSymbol }, "Successfully fetched symbol of fungible token");

    } catch (error) {
        return sendResponse(res, 500, null, "Something went wrong");

    }
};

const tokenPrice = async (req, res) => {
    let fungibleTokenPrice = process.env.TOKEN_PRICE;
    return sendResponse(res, 200, { fungibleTokenPrice }, "Successfully fetched price of fungible token");
};

const mint = async (req, res) => {
    let fromAddress = process.env.ADMIN_PUBLIC_KEY;
    let privateKey = process.env.ADMIN_PRIVATE_KEY;
    let toAddress = req.body.toAddress;
    let amount = req.body.amount;
    if (!(req.body) || !(req.body.toAddress) || !(req.body.amount))
        return sendResponse(res, 400, null, "Wallet address or amount missing from request boody");
    try {
        let mintTransactionHash = await SC_function.mintFunction(fromAddress, toAddress, privateKey, amount);
        console.log("tx done");
        return sendResponse(res, 200, { fromAddress, toAddress, amount, mintTransactionHash }, "Successfully minted fungible token");

    } catch (error) {
        return sendResponse(res, 500, null, "Something went wrong");

    }
};

const transfer = async (req, res) => {

    if (!(req.body) || !(req.body.fromAddress) || !(req.body.toAddress) || !(req.body.amount))
        return sendResponse(res, 400, null, "fromAddress, toAddress or amount is missing from request body");
    let fromAddress = req.body.fromAddress;
    let amount = req.body.amount;
    let toAddress = req.body.toAddress;
    let decryptedMnemonic = await getMnemonicFromDB(fromAddress);
    if (decryptedMnemonic) {
        try {
            let fromAddress = HDWallet.fetchPublicKey(decryptedMnemonic);
            let privateKey = HDWallet.fetchPrivateKey(decryptedMnemonic);
            let fungibleTokenTransferTransactionHash = await SC_function.transferFunction(fromAddress, toAddress, privateKey, amount);
            return sendResponse(res, 200, { fromAddress, toAddress, amount, fungibleTokenTransferTransactionHash }, "Successfully transferred fungible token");

        } catch (error) {
            return sendResponse(res, 500, null, "Something went wrong");

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
        return sendResponse(res, 400, null, "fromAddress, spenderAddress or amount is missing from request body");
    let fromAddress = req.body.fromAddress;
    let spenderAddress = req.body.spenderAddress;
    let amount = req.body.amount;
    let decryptedMnemonic = await getMnemonicFromDB(fromAddress);
    if (decryptedMnemonic) {
        try {
            let fromAddress = HDWallet.fetchPublicKey(decryptedMnemonic);
            let privateKey = HDWallet.fetchPrivateKey(decryptedMnemonic);
            let fungibleTokenApproveTransactionHash = await SC_function.approveFunction(fromAddress, spenderAddress, privateKey, amount);
            return sendResponse(res, 200, { fromAddress, spenderAddress, amount, fungibleTokenApproveTransactionHash }, "Successfully approved fungible token");

        } catch (error) {
            return sendResponse(res, 500, null, "Something went wrong");

        }

    } else {
        res.status(404).json({ error: "User does not exist" });
    }
};

const burn = async (req, res) => {

    if (!(req.body) || !(req.body.fromAddress) || !(req.body.amount))
        return sendResponse(res, 400, null, "fromAddress or amount is missing from request body");
    let fromAddress = req.body.fromAddress;
    let amount = req.body.amount;
    let decryptedMnemonic = await getMnemonicFromDB(fromAddress);
    if (decryptedMnemonic) {
        try {
            let fromAddress = HDWallet.fetchPublicKey(decryptedMnemonic);
            let privateKey = HDWallet.fetchPrivateKey(decryptedMnemonic);
            let fungibleTokenBurnTransactionHash = await SC_function.burnFunction(fromAddress, privateKey, amount);
            console.log("tx done");
            return sendResponse(res, 200, { fromAddress, amount, fungibleTokenBurnTransactionHash }, "Successfully burned fungible token");

        } catch (error) {
            return sendResponse(res, 500, null, "Something went wrong");

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
        return sendResponse(res, 500, null, "Something went wrong");

    }

};

const userMint = async (req, res) => {
    let fromAddress = req.body.fromAddress;
    let amount = req.body.amount;
    if (!(req.body) || !(req.body.fromAddress) || !(req.body.amount))
        return sendResponse(res, 400, null, "fromAddress or amount is missing from request body");
    let decryptedMnemonic = null;
    try {
        decryptedMnemonic = await getMnemonicFromDB(fromAddress);

    } catch (error) {
        return sendResponse(res, 500, null, "Something went wrong while decrypting mnemonic");

    }
    if (decryptedMnemonic) {

        let fromAddress = HDWallet.fetchPublicKey(decryptedMnemonic);
        let privateKey = HDWallet.fetchPrivateKey(decryptedMnemonic);
        let toAddress = process.env.ADMIN_PUBLIC_KEY;
        let tokenPrice = parseFloat(process.env.TOKEN_PRICE);
        let requiredEther = tokenPrice * amount;
        let userBal = null;
        try {
            userBal = await SC_function.nativeBalance(fromAddress);
        } catch (error) {
            return sendResponse(res, 500, null, "Something went wrong while fetching ether balance");

        }
        let etherTransferTransactionHash = null;
        let fungibleTokenMintTransactionHash = null;
        if (userBal > requiredEther) {
            try {
                console.log(`user bal=${userBal} and req ether= ${requiredEther}`);
                etherTransferTransactionHash = await sendEthers(fromAddress, toAddress, privateKey, requiredEther);
                fungibleTokenMintTransactionHash = await mintInternal(fromAddress, amount);
                return sendResponse(res, 200, { fromAddress, amount, etherTransferTransactionHash, fungibleTokenMintTransactionHash }, "Successfully minted fungible token");

            } catch (error) {
                return sendResponse(res, 500, null, "Something went wrong during transactions");
            }

        } else {
            return sendResponse(res, 500, null, "Insufficient ether balance");
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
