'use strict'

var express = require('express');
var contactController = require('../controllers/contacts');
var token = require('../helpers/auth');
var routes = express.Router();

routes.post('/api/contact/create', token.validateToken, contactController.createContact);
routes.put('/api/contact/edit/:_id', token.validateToken, contactController.editContact);
routes.get('/api/contact/find/:userId', token.validateToken, contactController.findContactByUserId);
routes.delete('/api/contact/delete/:_id', token.validateToken, contactController.deleteContact);

module.exports = routes;
