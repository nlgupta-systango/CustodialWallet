const express = require('express');

const client = require("../../controllers/client");
let {sendResponse} = require('../../services/commonResponse');
let { logRequest } = require('../../middlewares/requestLogger');

const router = express.Router();

/* GET listing. */

router.get('/', logRequest, (req, res) => {
    sendResponse(res, 200, null, "Welcome to Client Service" );
});

/* POST listing. */

router.post('/register',logRequest, client);


module.exports = router;