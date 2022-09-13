let express = require('express');

let walletRouter = require('./custodialWallet');
let ethersRouter = require('./ethers');
let fungibleTokenRouter = require('./fungibleToken');
let clientRouter = require('./client');
let customTransactionRouter = require('./customTransaction');
let { sendResponse } = require('../../services/commonResponse');

let router = express.Router();

/* GET Application  */
router.get('/', function (req, res, next) {
	sendResponse(res, 200, null, "Welcome to Custodial Wallet application");
});

router.use('/custodialWallet', walletRouter);
router.use('/ethers', ethersRouter);
router.use('/fungibleToken', fungibleTokenRouter);
router.use('/customTransaction', customTransactionRouter);
router.use('/client', clientRouter);

module.exports = router;
