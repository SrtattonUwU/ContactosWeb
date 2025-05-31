'use strict'

var express = require('express');
var bodyParser = require('body-parser');
var routesUser = require('./routes/users');
var routesContact = require('./routes/contacts');

var cors = require('cors');
var application = express();

application.use(cors());
application.use(bodyParser.json());
application.use(bodyParser.urlencoded({'extended': false}));
application.use(routesUser);
application.use(routesContact);

module.exports = application;