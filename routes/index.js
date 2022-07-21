var express = require('express');
var usersRouter = require('./users');
var walletRouter = require('./custodialWallet');
var ethersRouter = require('./ethers');

var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.use('/users', usersRouter);
router.use('/custodialwallet', walletRouter);
router.use('/ethers', ethersRouter);

module.exports = router;
