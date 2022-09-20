let { sendResponse } = require('../services/commonResponse');
let {responseStatusCodes, responseStatusMessages} = require('../constants/responses.json');
let {createRequestLog} = require('../services/database/dbLogging');

const logRequest = async (req, res, next) => {  
      let log = {
        ipAddress: req.ip,
        requestMethod: req.method,
        requestUrl: req.originalUrl,
        requestBody: JSON.stringify(req.body),
        requestParam: JSON.stringify(req.params)
      }
      const createdLog = await createRequestLog(log);
      console.log(log);
      if( log )
        next()
      else
        return sendResponse(res, responseStatusCodes.InternalServerError, null, responseStatusMessages.InternalServerError);
}

module.exports = {
    logRequest
}