const express = require('express');
const { sendEth, checkBalance } = require("../../controllers/ethers");
const auth = require('../../middlewares/auth');
const clientUserMatch = require('../../middlewares/transactionAuth');
let { sendResponse } = require('../../services/commonResponse');
let { logRequest } = require('../../middlewares/requestLogger');

const router = express.Router();

/* GET listing. */

router.get('/', logRequest, (req, res) => {
    sendResponse(res, 200, null, "Welcome to ethers Service");
});

/* POST listing. */

router.post('/transfer', logRequest, auth, clientUserMatch, sendEth);
router.get('/balance/:walletAddress', logRequest, checkBalance);


module.exports = router;