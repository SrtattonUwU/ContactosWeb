'use strict'

var User = require('../models/users');
var token = require('../helpers/auth');
var bcrypt = require('bcryptjs');
var salt = bcrypt.genSaltSync(15);

function createUser(req, resp) {
    var userRequestBody = req.body;
    var newUser = new User();

    newUser.name = userRequestBody.name;
    newUser.lastName = userRequestBody.lastName;
    newUser.email = userRequestBody.email;
    newUser.password = bcrypt.hashSync(userRequestBody.password, salt);
    newUser.role = 'User';

    if (
        newUser.name === null || newUser.name.trim() === ''
        ||newUser.lastName === null || newUser.lastName.trim() === ''
        || newUser.email === null || newUser.email.trim() === ''
        || newUser.password === null || newUser.password.trim() === ''
        || newUser.role === null || newUser.role.trim() === ''
    ) {
        resp.status(400).send({'message': 'One or more required variables were not sent'});
    }

    newUser.save().then(
        (savedUser) => {
            resp.status(200).send({'message': 'User created successfully', 'user': savedUser});
        },
        err => {
            resp.status(500).send({'message': 'An error ocurred while creating the user', 'error': err});
        }
    );
}

function loginUser(req, resp) {
    var userRequestBody = req.body;

    User.findOne({'email': userRequestBody.email}).then(
        (userFound) => {
            if (userFound == null) {
                resp.status(403).send({'message': 'User not found'});
            }
            else if(bcrypt.compareSync(userRequestBody.password, userFound.password)){
                resp.status(200).send({'message': 'Login Success', 'token': token.generateToken(userFound)});
            }
            else{
                resp.status(403).send({'message': 'Invalid Login'});
            }
        },
        err => {
            resp.status(500).send({'message': 'An error ocurred while validating the user', 'error': err});
        }
    );
}

function editUser(req, resp) {
    var userToEdit = req.params._id;
    var newUserToEdit = req.body;

    var user = new User();

    user._id = userToEdit;
    user.name = newUserToEdit.name;
    user.lastName = newUserToEdit.lastName;
    user.email = newUserToEdit.email;
    user.password = bcrypt.hashSync(newUserToEdit.password, salt);
    user.role = 'User';

    User.findByIdAndUpdate(user._id, user, {new : true}).then(
        (editedUser) => {
            resp.status(200).send({'message': 'User edited successfully', 'User': editedUser});
        },
        (err) => {
            resp.status(500).send({'message': 'Something happened while editing the user', 'error': err});
        }
    );
}

function deleteUser(req, resp) {
    var userToDelete = req.params._id;

    User.findByIdAndDelete(userToDelete).then(
        (deletedUser) => {
            resp.status(200).send({'message': 'User deleted successfully', 'User': deletedUser});
        },
        (err) => {
            resp.status(500).send({'message': 'Something happened while deleting the user', 'error': err});
        }
    );
}

module.exports = {
    createUser, loginUser, editUser, deleteUser
}
