const jwt = require("jsonwebtoken");
const Models = require('../models');
let { sendResponse } = require('../services/commonResponse');

const Client = Models.ClientTable;

const verifyToken = async (req, res, next) => {
  console.log(req.body);
  if (!(req.body) || !(req.body.email) || !(req.headers["x-access-token"]))
    return sendResponse(res, 400, null, "Body or Header is missing");

  const token = req.headers["x-access-token"];
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
    req.user = decoded;
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