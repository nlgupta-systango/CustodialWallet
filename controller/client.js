const Models = require('../models');
const { generateApiKey } = require('generate-api-key');
const jwtToken = require('../services/client_Services/keyGenetator');
let { sendResponse } = require('../services/commonResponse');

const client = Models.ClientTable;

const clientRegister = async (req, res, next) => {
	if (!(req.body) || !(req.body.name) || !(req.body.email))
		return sendResponse(res, 400, null, "Name or email missing from request body");
	let clientName = req.body.name;
	let clientEmail = req.body.email;
	try {
		let clientUsr = {
			name: clientName,
			email: clientEmail,
			key: generateApiKey()
		};
	
		let createdClient = await client.create(clientUsr);
		let newClient =  createdClient.dataValues;
		delete newClient.key;
		let clientToken = await jwtToken(clientEmail);
		return sendResponse(res, 200, { newClient, clientToken }, `Successfully created client!`);
		
	} catch (error) {
		console.log(error);
		return sendResponse(res, 500, null, "Something went wrong");

	}

};

module.exports = clientRegister;