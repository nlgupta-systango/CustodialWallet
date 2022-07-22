const express = require('express');
const walletCreate = require("../controller/registration");
const router = express.Router();

/* GET users listing. */

router.get('/', function (req, res,) {
    res.status(201).json({ message: "Welcome to Custodial Wallet Service" });
});

/* POST users listing. */

router.post('/createwallet',walletCreate);


module.exports = router;