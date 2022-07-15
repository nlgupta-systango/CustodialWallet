var express = require('express');
const login=require('../controller/login');
const userRegister = require("../controller/registration");
const sendEth=require('../controller/sendEthers');
const userUtility=require('../controller/userUtility');
var router = express.Router();
const dotenv = require('dotenv');
const auth = require('../services/auth');
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
////////////////////////////////////
router.get('/publickey',auth,userUtility.getPublicKey);
router.get('/privatekey',auth,userUtility.getPrivateKey);

module.exports = router;