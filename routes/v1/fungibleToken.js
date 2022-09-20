const express = require('express');
const contractFunction = require('../../controllers/contractMethods')
const auth = require('../../middlewares/auth');
const clientUserMatch = require('../../middlewares/transactionAuth');
let { sendResponse } = require('../../services/commonResponse');
let { logRequest } = require('../../middlewares/requestLogger');

const router = express.Router();

/* GET listing. */
router.get('/', logRequest, (req, res) => {
    sendResponse(res, 200, null, "Welcome to Fungible Token Service");

});
router.get('/balanceOf/:address', logRequest, contractFunction.tokenBalanceOf);
router.get('/name', logRequest, contractFunction.tokenName);
router.get('/totalSupply', logRequest, contractFunction.totalSupply);
router.get('/symbol', logRequest, contractFunction.tokenSymbol);
router.get('/price', logRequest, contractFunction.tokenPrice);

/* POST  listing. */
router.post('/transfer', logRequest, auth, clientUserMatch, contractFunction.transfer);
router.post('/mint', logRequest, auth, clientUserMatch, contractFunction.userMint);
router.post('/burn', logRequest, auth, clientUserMatch, contractFunction.burn);
router.post('/approve', logRequest, auth, clientUserMatch, contractFunction.approve);
// router.post('/transferFrom',auth,clientUserMatch,contractFunction.transferFrom);



module.exports = router;