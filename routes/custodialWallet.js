const express = require('express');
const walletCreate = require("../controller/userAccountCreate");
const auth=require('../services/auth');
let {sendResponse} = require('../services/commonResponse');

const router = express.Router();

/* GET users listing. */

router.get('/', function (req, res,) {
    sendResponse(res, 200, null, "Welcome to Custodial Wallet Service" );
});

/* POST users listing. */

router.post('/create',auth,walletCreate);


module.exports = router;