'use strict'

var jwt = require('jwt-simple');
var moment = require('moment');
var {response} = require('express');
var secret = 'yIVYIvuiGOouggugybsafyiUJGuofas645'

function generateToken(user) {
    var payload = {
        sub: user._id,
        name: user.name,
        lastName: user.lastName,
        role: user.role,
        iat: moment().unix(),
        exp: moment().add('10','hours').unix()
    }

    return jwt.encode(payload, secret);
}

function validateToken(req, resp, nextStep) {
    try{
        var userToken = req.headers.authorization;
        var cleanToken = userToken.replace('Bearer ', '');
        var payload = jwt.decode(cleanToken, secret);

        req.user = {
            id: payload.sub,
            name: payload.name,
            lastName: payload.lastName,
            role: payload.role
        }

        nextStep();

    } catch(ex){
        resp.status(403).send({'message': 'Invalid token'});
    }
}

module.exports = {
    generateToken, validateToken
}