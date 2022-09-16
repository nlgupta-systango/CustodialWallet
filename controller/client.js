const Models = require('../models');
const { generateApiKey } = require('generate-api-key');
const jwtToken = require('../services/client_Services/keyGenetator');
let { sendResponse } = require('../services/commonResponse');
let { responseStatusCodes, responseStatusMessages } = require('../constants/responses.json');

const { Client } = Models;

const clientRegister = async (req, res, next) => {
	if (!(req.body) || !(req.body.name) || !(req.body.email))
		return sendResponse(res, responseStatusCodes.BadRequest, null, responseStatusMessages.ClientRegisterBadRequest);
	let clientName = req.body.name;
	let clientEmail = req.body.email;
	try {
		let clientUsr = {
			name: clientName,
			email: clientEmail,
			key: generateApiKey()
		};
		let createdClient = await Client.create(clientUsr);
		let newClient =  createdClient.dataValues;
		delete newClient.key;
		let clientToken = await jwtToken(clientEmail);
		return sendResponse(res, responseStatusCodes.OK, { newClient, clientToken }, responseStatusMessages.OK);
		
	} catch (error) {
		console.log(error);
		return sendResponse(res, responseStatusCodes.InternalServerError, null, responseStatusMessages.InternalServerError);

	}

};

module.exports = clientRegister;