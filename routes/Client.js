const express = require('express');
const client = require("../controller/clientContoller");
const router = express.Router();

/* GET users listing. */

router.get('/', function (req, res,) {
    res.status(201).json({ message: "Welcome to Client Service" });
});

/* POST users listing. */

router.post('/registration',client);


module.exports = router;