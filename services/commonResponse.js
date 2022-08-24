const sendResponse = (res, status, data, message) => {
    return res.status(status).json({status, data, message});
}

module.exports = {
    sendResponse
}