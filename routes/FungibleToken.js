const express = require('express');
const contractFunction = require('../controller/contractMethods')
const router = express.Router();

/* GET users listing. */

router.get('/', function (req, res,) {
    res.status(201).json({ message: "Welcome to Fungible Token Service" });
});
router.get('/balanceof/:address',contractFunction.tokenBalanceOf);

/* POST users listing. */
router.post('/transfer',contractFunction.transfer);
router.post('/minttoken',contractFunction.userMint);
router.post('/burntoken',contractFunction.burn);


module.exports = router;