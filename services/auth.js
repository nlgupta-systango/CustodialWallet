const jwt = require("jsonwebtoken");
const Models = require('../models');
const Client = Models.ClientTable;

const verifyToken =async (req, res, next) => {
  const token = req.headers["x-access-token"];
  let clientEmail = req.body.email;
  let clientData = await Client.findOne({ where: { email: clientEmail } });
  if (!token) {
    return res.status(403).send("A token is required for authentication");
  }
  try {
    const decoded = jwt.verify(token, clientData.key);
    req.user = decoded;
  } catch (err) {
    return res.status(401).send("Invalid Token");
  }
  return next();
};

module.exports = verifyToken;