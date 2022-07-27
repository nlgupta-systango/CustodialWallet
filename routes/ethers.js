const express = require('express');
const {sendEth,checkBalance} = require("../controller/ethersController");
const auth=require('../services/auth');
const userAuth=require('../services/transactionAuth');
const router = express.Router();

/* GET users listing. */

router.get('/', function (req, res,) {
    res.status(201).json({ message: "Welcome to ethers Service" });
});

/* POST users listing. */

router.post('/transfer',auth,userAuth,sendEth);
router.get('/balance/:address',checkBalance)


module.exports = router;