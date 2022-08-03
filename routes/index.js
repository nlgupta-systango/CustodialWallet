let express = require('express');

let walletRouter = require('./custodialWallet');
let ethersRouter = require('./ethers');
let fungibleTokenRouter = require('./fungibleToken');
let clientRouter = require('./client');

let router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  res.status(201).json({message:"Welcome to Custodial Wallet application"});
});


router.use('/custodialwallet', walletRouter);
router.use('/ethers', ethersRouter);
router.use('/fungibletoken', fungibleTokenRouter);
router.use('/client', clientRouter);

module.exports = router;
