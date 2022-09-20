const express = require('express');
const walletCreate = require("../../controllers/userAccountCreate");
const auth = require('../../middlewares/auth');
let { sendResponse } = require('../../services/commonResponse');
let { logRequest } = require('../../middlewares/requestLogger');

const router = express.Router();

/* GET users listing. */

router.get('/', logRequest, (req, res) => {
    sendResponse(res, 200, null, "Welcome to Custodial Wallet Service");
});

/* POST users listing. */

router.post('/create', logRequest, auth, walletCreate);


module.exports = router;