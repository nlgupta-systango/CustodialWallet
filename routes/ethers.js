const express = require('express');
const { sendEth, checkBalance } = require("../controller/ethers");
const auth = require('../services/auth');
const clientUserMatch = require('../services/transactionAuth');
let { sendResponse } = require('../services/commonResponse');

const router = express.Router();

/* GET listing. */

router.get('/', function (req, res,) {
    sendResponse(res, 200, null, "Welcome to ethers Service");
});

/* POST listing. */

router.post('/transfer', auth, clientUserMatch, sendEth);
router.get('/balance/:address', checkBalance);


module.exports = router;