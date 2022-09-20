const Models = require('../../models');
const Request_Log = Models.Request_Log;

const createRequestLog = async (log) => {
    try {
		let createdLog = await Request_Log.create(log);
		let newLog =  createdLog.dataValues;
		console.log(newLog);
		return createdLog;
	} catch (error) {
		console.log(error);
		return 

	}
}

module.exports = {
	createRequestLog
}
