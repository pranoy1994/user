const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

var api = require('./api/index');

var app = express();

mongoose.connect('localhost/user');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/api', api);

module.exports = app;
