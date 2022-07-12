var express = require('express');
const login=require('../controller/login');
const userRegister = require("../controller/registration");
var router = express.Router();
const dotenv = require('dotenv');
dotenv.config();
/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});
router.post('/userRegistration',userRegister);
router.post("/userLogin",login);
module.exports = router;