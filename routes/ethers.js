const express = require('express');
const {sendEth,checkBalance} = require("../controller/ethersController");
const contractFunction = require('../controller/contractMethods')
const router = express.Router();
const dotenv = require('dotenv');
dotenv.config();
/* GET users listing. */

router.get('/', function (req, res,) {
    res.status(201).json({ message: "Welcome to ethers Service" });
});

/* POST users listing. */

router.post('/transfer',sendEth);
router.get('/balance/:address',checkBalance)


module.exports = router;