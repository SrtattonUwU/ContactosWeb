'use strict'

var express = require('express');
var userController = require('../controllers/users')
var routes = express.Router();
var token = require('../helpers/auth');

routes.post('/api/register', userController.createUser);
routes.post('/api/login', userController.loginUser);
routes.put('/api/user/edit/:_id', token.validateToken, userController.editUser);
routes.delete('/api/user/delete/:_id', token.validateToken, userController.deleteUser);

module.exports = routes;
