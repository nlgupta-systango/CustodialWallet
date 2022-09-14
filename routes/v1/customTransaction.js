const express = require('express');
const { executeCustomTransaction, checkGasEstimate } = require("../../controller/customTransaction");
const auth = require('../../services/auth');
const clientUserMatch = require('../../services/transactionAuth');
let { sendResponse } = require('../../services/commonResponse');

const router = express.Router();

/* GET listing. */

router.get('/', function (req, res,) {
    sendResponse(res, 200, null, "Welcome to custom transaction Service");
});

/* POST listing. */

router.post('/execute', auth, clientUserMatch, executeCustomTransaction);
router.post('/getGasEstimate', checkGasEstimate);


module.exports = router;