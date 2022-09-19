const Models = require('../../models');
const User = Models.Request_Log;

const createRequestLog = async () => {
    try {
		let createdClient = await Client.create(clientUsr);
		let newClient =  createdClient.dataValues;
        next()
	} catch (error) {
		console.log(error);
		return sendResponse(res, responseStatusCodes.InternalServerError, null, responseStatusMessages.InternalServerError);

	}
}

