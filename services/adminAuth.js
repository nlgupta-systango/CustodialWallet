const dotenv=require('dotenv');
dotenv.config();


const verifyAdim= (req, res, next) => {
  //const token =req.headers["x-access-token"];
    let email=req.body.email;
    let password=req.body.password;
    if(email==process.env.ADMIN_EMAIL && password==process.env.ADMIN_PASS){
       return next();
    }else{
        return res.status(401).send("Invalid admin credential");
    }

};

module.exports = verifyAdim;