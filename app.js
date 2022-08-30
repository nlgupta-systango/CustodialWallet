const createError = require('http-errors');
const express = require('express');
const path = require('path');
const logger = require('morgan');
const dotenv = require('dotenv');
const swaggerUiExpress = require('swagger-ui-express');
const indexRouter = require('./routes/v1/index');
let { sendResponse } = require('./services/commonResponse');
let swaggerDocument = require('./swagger.json');

dotenv.config();
const app = express();
PORT = process.env.PORT;

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/v1/api-docs', swaggerUiExpress.serve, swaggerUiExpress.setup(swaggerDocument));

app.use('/v1', indexRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  console.log(err);
  sendResponse(res, err.status || 500, null, "Something went wrong, might be invalid route");
});

app.listen(PORT, () => {
  console.log(`connect at ${PORT}`);
})
module.exports = app;
