const express = require('express');
const { executeCustomTransaction, checkGasEstimate } = require("../../controllers/customTransaction");
const auth = require('../../middlewares/auth');
const clientUserMatch = require('../../middlewares/transactionAuth');
let { sendResponse } = require('../../services/commonResponse');
let { logRequest } = require('../../middlewares/requestLogger');

const router = express.Router();

/* GET listing. */

router.get('/', logRequest, (req, res) => {
    sendResponse(res, 200, null, "Welcome to custom transaction Service");
});

/* POST listing. */

router.post('/execute', logRequest, auth, clientUserMatch, executeCustomTransaction);
router.post('/getGasEstimate', logRequest, checkGasEstimate);


module.exports = router;