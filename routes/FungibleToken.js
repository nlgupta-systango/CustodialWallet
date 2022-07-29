const express = require('express');
const contractFunction = require('../controller/contractMethods')
const auth=require('../services/auth');
const userAuth=require('../services/transactionAuth');
const router = express.Router();

/* GET users listing. */

router.get('/', function (req, res,) {
    res.status(201).json({ message: "Welcome to Fungible Token Service" });
});
router.get('/balanceof/:address',contractFunction.tokenBalanceOf);
router.get('/name',contractFunction.tokenName);
router.get('/totalSupply',contractFunction.totalSupply);
router.get('/symbol',contractFunction.tokenSymbol);
router.get('/price',contractFunction.tokenPrice);

/* POST users listing. */
router.post('/transfer',auth,userAuth,contractFunction.transfer);
router.post('/mint',auth,userAuth,contractFunction.userMint);
router.post('/burn',auth,userAuth,contractFunction.burn);
router.post('/approve',auth,userAuth,contractFunction.approve);
// router.post('/transferFrom',auth,userAuth,contractFunction.transferFrom);



module.exports = router;