const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const Models = require('./../models');
const dotenv = require('dotenv');
dotenv.config();
const User = Models.CustodialWallet;
const login = async (req, res, next) => {
    const user = await User.findOne({ where: { email: req.body.email } });
    if (user) {
        const password_valid = await bcrypt.compare(req.body.password, user.password);
        if (password_valid) {
            token = jwt.sign({ "id": user.id, "email": user.email, "Name": user.Name }, process.env.JWTSECRET);
            console.log("valid user Token =",token)
            user.token = token;// token save at login
            res.status(200).json({ token: token });
        } else {
            res.status(400).json({ error: "Password Incorrect" });
        }

    } else {
        res.status(404).json({ error: "User does not exist" });
    }

};



module.exports=login;