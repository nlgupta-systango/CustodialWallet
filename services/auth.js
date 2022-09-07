const jwt = require("jsonwebtoken");
const Models = require('../models');
let { sendResponse } = require('../services/commonResponse');

const { Client } = Models;

const verifyToken = async (req, res, next) => {
  if (!(req.body) || !(req.body.email) || (!(req.headers["x-access-token"]) && !(req.headers["authorization"])))
    return sendResponse(res, 400, null, "Body or Header is missing");
  let token;
  if((req.headers["authorization"]) && req.headers["authorization"].split(' ')[0] === 'Bearer'){
    token = req.headers.authorization.split(' ')[1];
  }
  else{
    token = req.headers["x-access-token"];
  }
  // const token = req.headers["x-access-token"];
  let clientEmail = req.body.email;
  let clientData = null;
  try {
    clientData = await Client.findOne({ where: { email: clientEmail } });
    if (!clientData)
      return sendResponse(res, 404, null, "Client not found");

  } catch (error) {
    return sendResponse(res, 500, null, "Something went wrong");

  }
  try {
    const decoded = jwt.verify(token, clientData.key);
    req.client = decoded;
    if (clientEmail == decoded.email) {
      return next();
    } else {
      return sendResponse(res, 401, null, "Invalid Token for this client");
    }
  } catch (err) {
    return sendResponse(res, 401, null, "Invalid Token");

  }
};

module.exports = verifyToken;