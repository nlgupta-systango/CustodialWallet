
const Models = require('./../models');
const HDWallet = require('../services/HDwalletUtility');
const { custodialDecryption, getMnemonicFromDB } = require('../services/encryptDecrypt');
const SC_function = require('../services/ContractInteraction/SCinteraction');
const sendEthers = require('../services/etherTransfer');
const dotenv = require('dotenv');
dotenv.config({ path: '../.env' });
const User = Models.UserCustodialWallets;

const tokenBalanceOf = async (req, res) => {
    let toAddress = req.params.address;
    if (toAddress) {
        try {
            let balance = await SC_function.balanceOfFunction(toAddress);
            res.status(201).json(`balance of ${toAddress} is ${balance}`);
            
        } catch (error) {
            res.status(404).json({ error: `something went wrong : ${error}` });
            
        }

    } else {
        res.status(404).json({ error: "please provide address" });
    }
};

const tokenName = async (req, res) => {
        try {
            let name = await SC_function.getTokenName();
            res.status(201).json(`token name is ${name}`);
            
        } catch (error) {
            res.status(404).json({ error: `something went wrong : ${error}` });
            
        }
};

const totalSupply = async (req, res) => {
    try {
        let tokenTotal = await SC_function.totalSupply();
        res.status(201).json(`token totalSupply is ${tokenTotal}`);
        
    } catch (error) {
        res.status(404).json({ error: `something went wrong : ${error}` });
        
    }
};

const tokenSymbol = async (req, res) => {
    try {
        let symbol = await SC_function.getSymbol();
        res.status(201).json(`token symbol is ${symbol}`);
        
    } catch (error) {
        res.status(404).json({ error: `something went wrong : ${error}` });
        
    }
};

const tokenPrice = async (req, res) => {
        let price = process.env.TOKEN_PRICE;
        res.status(201).json(` TOKEN PRICE is ${price}`);
};


const mint = async (req, res) => {

    let fromAddress = process.env.ADMIN_PUBLIC_KEY;
    let toAddress = req.body.toAddress;
    let privateKey = process.env.ADMIN_PRIVATE_KEY;
    let amount = req.body.amount;
    if (!toAddress || !amount) return res.status(404).json({ error: "toAddress or amount is missing" });
    try {
        let txHash = await SC_function.mintFunction(fromAddress, toAddress, privateKey, amount);
        console.log("tx done");
        res.status(201).json({ message: `Transaction status success ${txHash}` });
        
    } catch (error) {
        res.status(404).json({ error: `something went wrong : ${error}`});

        
    }

};

const transfer = async (req, res) => {
    let fromAddress = req.body.fromAddress;
    let amount = req.body.amount;
    if (!fromAddress || !amount) return res.status(404).json({ error: "fromAddress or amount is missing" });

    let decryptedMnemonic = await getMnemonicFromDB(fromAddress);
    if (decryptedMnemonic) {
        try {
        let fromAddress = HDWallet.fetchPublicKey(decryptedMnemonic);
        let toAddress = req.body.toAddress;
        let privateKey = HDWallet.fetchPrivateKey(decryptedMnemonic);
            
            let txHash = await SC_function.transferFunction(fromAddress, toAddress, privateKey, amount);
    
            res.status(201).json({ message: `${amount} token transfered to ${toAddress} and transaction hash is ${txHash.transactionHash}` });
        } catch (error) {
            res.status(404).json({ error: `something went wrong : ${error}`});

        }

    } else {
        res.status(404).json({ error: "User does not exist" });
    }
};


const burn = async (req, res) => {
    let fromAddress = req.body.fromAddress;
    let amount = req.body.amount;
    if (!fromAddress || !amount) return res.status(404).json({ error: "fromAddress or amount is missing" });
  
    let decryptedMnemonic = await getMnemonicFromDB(fromAddress);
    if (decryptedMnemonic) {
        try {
            let fromAddress = HDWallet.fetchPublicKey(decryptedMnemonic);
        let privateKey = HDWallet.fetchPrivateKey(decryptedMnemonic);
        let receipt = await SC_function.burnFunction(fromAddress, privateKey, amount);
        console.log(receipt);
        console.log("tx done");
        res.status(404).json({ message: `${amount} tokens burned from ${fromAddress} and Tx=${receipt}` });     
        } catch (error) {
            res.status(404).json({ error: `something went wrong : ${error}`});
    
        }
        
    } else {
        res.status(404).json({ error: "User does not exist" });
    }
};

const mintInternal = async (toAddress, amount) => {

    let fromAddress = process.env.ADMIN_PUBLIC_KEY;
    let privateKey = process.env.ADMIN_PRIVATE_KEY;
    try {
        let txHash = await SC_function.mintFunction(fromAddress, toAddress, privateKey, amount);
        return txHash;
        
    } catch (error) {
        res.status(404).json({ error: `something went wrong : ${error}`});
        
    }


};
const userMint = async (req, res) => {
    let fromAddress = req.body.fromAddress;
    let noOfToken = req.body.tokenAmount;
    if (!fromAddress || !noOfToken) return res.status(404).json({ error: "fromAddress or tokenAmount is missing" });
    let decryptedMnemonic=null;
    try {
         decryptedMnemonic = await getMnemonicFromDB(fromAddress);
        
    } catch (error) {
        res.status(404).json({ error: `something went wrong : ${error}`});
        
    }
    if (decryptedMnemonic) {

        let fromAddress = HDWallet.fetchPublicKey(decryptedMnemonic);
        let toAddress = process.env.ADMIN_PUBLIC_KEY;
        let privateKey = HDWallet.fetchPrivateKey(decryptedMnemonic);
        let tokenPrice = parseFloat(process.env.TOKEN_PRICE);
        let requiredEther = tokenPrice * noOfToken;
        let userBal =null;
        try {
             userBal = await SC_function.nativeBalance(fromAddress);
        } catch (error) {
            res.status(404).json({ error: `something went wrong : ${error}`});

        }
        let sentTx = null;
        let mintTx = null;
        if (userBal > requiredEther) {
            try {
                console.log(`user bal=${userBal} and req ether= ${requiredEther}`);
                sentTx = await sendEthers(fromAddress, toAddress, privateKey, requiredEther);
                mintTx = await mintInternal(fromAddress, noOfToken);
                res.status(201).json({ message: `Transaction success , send Tx=${sentTx} amd mint token Tx=${mintTx}` });
            } catch(error) {
                res.status(404).json({ error: `something went wrong : ${error}` });
            }

        } else {
            res.status(404).json({ error: `insufficient ether ,required ether is ${requiredEther} and ${fromAddress} has only ${userBal}` });
        }



    } else {
        res.status(404).json({ error: "User does not exist" });
    }
}




module.exports = {
    tokenBalanceOf,
    mint,
    transfer,
    burn,
    userMint,
    tokenName,
    totalSupply,
    tokenSymbol,
    tokenPrice

}
