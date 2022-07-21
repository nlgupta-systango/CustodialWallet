const express = require('express');
const walletCreate = require("../controller/registration");
const contractFunction = require('../controller/contractMethods')
const router = express.Router();
const dotenv = require('dotenv');
dotenv.config();
/* GET users listing. */

router.get('/', function (req, res,) {
    res.status(201).json({ message: "Welcome to Custodial Wallet Service" });
});

/* POST users listing. */

router.post('/createwallet',walletCreate);


module.exports = router;