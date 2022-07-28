const express = require('express');
const login=require('../controller/login');
const userRegister = require("../controller/userAccountCreate");
const {sendEth,checkBalance}=require('../controller/ethersController');
const userUtility=require('../controller/userUtility');
const contractFunction=require('../controller/contractMethods')
const router = express.Router();
const dotenv = require('dotenv');
const auth = require('../services/auth');
const adminAuth = require('../services/adminAuth');
dotenv.config();
/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});
router.post('/userRegistration',userRegister);
router.post("/userLogin",login);
router.get('/demo',async ()=>{
  console.log("user is login ");
})

router.get('/hello',auth,async(req,res)=>{
  console.log("hello auth new");
  auth();
  

  res.send()
})


router.post('/sendEthers',auth,sendEth);
router.post('/mintMe',auth,contractFunction.userMint);
// router.post('/balance',auth,contractFunction.balanceOf);
router.post('/transfer',auth,contractFunction.transfer);
router.post('/burn',auth,contractFunction.burn);
router.post('/adminMint',adminAuth,contractFunction.mint);
////////////////////////////////////
router.get('/publickey',auth,userUtility.getPublicKey);// just for testing, will remove
router.get('/privatekey',auth,userUtility.getPrivateKey);// just for testing, will remove

module.exports = router;