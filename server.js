var express = require('express');
var path = require('path');
const { expressLogger } = require('./utils/logger');
var cookieParser = require('cookie-parser');
var indexRouter = require('./routes/index');

var app = express();
app.use(expressLogger);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);

module.exports = app;
