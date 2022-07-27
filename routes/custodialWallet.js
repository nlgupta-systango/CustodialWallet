const express = require('express');
const walletCreate = require("../controller/userAccountCreate");
const auth=require('../services/auth');
const router = express.Router();

/* GET users listing. */

router.get('/', function (req, res,) {
    res.status(201).json({ message: "Welcome to Custodial Wallet Service" });
});

/* POST users listing. */

router.post('/createwallet',auth,walletCreate);


module.exports = router;