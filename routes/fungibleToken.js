const express = require('express');
const contractFunction = require('../controller/contractMethods')
const auth = require('../services/auth');
const clientUserMatch = require('../services/transactionAuth');
let { sendResponse } = require('../services/commonResponse');

const router = express.Router();

/* GET listing. */
router.get('/', function (req, res,) {
    sendResponse(res, 200, null, "Welcome to Fungible Token Service");

});
router.get('/balanceOf/:address', contractFunction.tokenBalanceOf);
router.get('/name', contractFunction.tokenName);
router.get('/totalSupply', contractFunction.totalSupply);
router.get('/symbol', contractFunction.tokenSymbol);
router.get('/price', contractFunction.tokenPrice);

/* POST  listing. */
router.post('/transfer', auth, clientUserMatch, contractFunction.transfer);
router.post('/mint', auth, clientUserMatch, contractFunction.userMint);
router.post('/burn', auth, clientUserMatch, contractFunction.burn);
router.post('/approve', auth, clientUserMatch, contractFunction.approve);
// router.post('/transferFrom',auth,clientUserMatch,contractFunction.transferFrom);



module.exports = router;