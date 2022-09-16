const createError = require('http-errors');
const express = require('express');
const path = require('path');
const logger = require('morgan');
const dotenv = require('dotenv');
const swaggerUiExpress = require('swagger-ui-express');
const indexRouter = require('./routes/v1/index');
let { sendResponse } = require('./services/commonResponse');
let swaggerDocument = require('./swagger.json');
let {responseStatusCodes, responseStatusMessages} = require('./constants/responses.json');

dotenv.config();
const app = express();
PORT = process.env.PORT;

app.use(logger('dev'));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/v1/api-docs', swaggerUiExpress.serve, swaggerUiExpress.setup(swaggerDocument));
app.use('/v1', indexRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  sendResponse(res, err.status || responseStatusCodes.InternalServerError, null, responseStatusMessages.InvalidRoute);
  next();
});

// app.use(function (req, res, next) {
//   // res.on('finish', () => {
//     console.log(res, "==========", res.text, res.body);
//     let log = {
//       ipAddress: req.ip,
//       requestMethod: req.method,
//       requestUrl: req.originalUrl,
//       requestBody: JSON.stringify(req.body),
//       requestParam: JSON.stringify(req.params),
//       responseStatusCode: res.statusCode,
//       responseStatusMessage: res.statusMessage,
//     }
//     // createRequestLogInDB(log);
//     console.log(log);
//   // });
// });

app.listen(PORT, () => {
  console.log(`connect at ${PORT}`);
})
module.exports = app;
