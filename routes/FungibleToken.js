const express = require('express');
const contractFunction = require('../controller/contractMethods')
const auth=require('../services/auth');
const userAuth=require('../services/transactionAuth');
const router = express.Router();

/* GET users listing. */

router.get('/', function (req, res,) {
    res.status(201).json({ message: "Welcome to Fungible Token Service" });
});
router.get('/balanceof/:address',contractFunction.tokenBalanceOf);

/* POST users listing. */
router.post('/transfer',auth,userAuth,contractFunction.transfer);
router.post('/minttoken',auth,userAuth,contractFunction.userMint);
router.post('/burntoken',auth,userAuth,contractFunction.burn);


module.exports = router;