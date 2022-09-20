const jwt = require("jsonwebtoken");
const Models = require('../models');
let { sendResponse } = require('../services/commonResponse');
let { responseStatusCodes, responseStatusMessages } = require('../constants/responses.json');


const { Client } = Models;

const verifyToken = async (req, res, next) => {
  if (!(req.body) || !(req.body.email) || (!(req.headers["x-access-token"]) && !(req.headers["authorization"])))
    return sendResponse(res, responseStatusCodes.BadRequest, null, responseStatusMessages.AuthBadRequest);
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
      return sendResponse(res, responseStatusCodes.NotFound, null, responseStatusMessages.ClientNotFound);

  } catch (error) {
    return sendResponse(res, responseStatusCodes.InternalServerError, null, responseStatusMessages.InternalServerError);

  }
  try {
    const decoded = jwt.verify(token, clientData.key);
    req.client = decoded;
    if (clientEmail == decoded.email) {
      return next();
    } else {
      return sendResponse(res, responseStatusCodes.Unauthorized, null, responseStatusMessages.Unauthorized);
    }
  } catch (err) {
    return sendResponse(res, responseStatusCodes.Unauthorized, null, responseStatusMessages.Unauthorized);

  }
};

module.exports = verifyToken;