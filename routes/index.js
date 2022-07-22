let express = require('express');
let usersRouter = require('./users');
let walletRouter = require('./custodialWallet');
let ethersRouter = require('./ethers');
let fungibleToken = require('./FungibleToken');

let router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.use('/users', usersRouter);
router.use('/custodialwallet', walletRouter);
router.use('/ethers', ethersRouter);
router.use('/fungibletoken', fungibleToken);

module.exports = router;
