'use strict'

var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var ContactSchema = Schema({
    userId: {type: mongoose.Schema.Types.ObjectId, ref: "User"},
    name: String,
    lastName: String,
    landline: String,
    celular: String,
    email: String
});

module.exports = mongoose.model('contacts', ContactSchema);