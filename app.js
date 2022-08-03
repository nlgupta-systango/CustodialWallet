const createError = require('http-errors');
const express = require('express');
const path = require('path');
const logger = require('morgan');
const dotenv = require('dotenv');
const indexRouter = require('./routes/index');

dotenv.config();
const app = express();
PORT = process.env.PORT;

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  console.log(err);
  res.json({message:`something went wromg, might be invalid route`});
});


app.listen(PORT, () => {
  console.log(`connect at ${PORT}`);
})
module.exports = app;
