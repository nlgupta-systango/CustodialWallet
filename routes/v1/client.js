const express = require('express');

const client = require("../../controller/client");
let {sendResponse} = require('../../services/commonResponse');

const router = express.Router();

/* GET listing. */

router.get('/', function (req, res,) {
    sendResponse(res, 200, null, "Welcome to Client Service" );
});

/* POST listing. */

router.post('/register',client);


module.exports = router;