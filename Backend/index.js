'use strict'

var mongoose = require('mongoose');
var application = require('./application');

mongoose.connect('mongodb://127.0.0.1:27017/contactos').then(
    () => {
        console.log("Database connection successful. Starting application");
        application.listen(6542, function(){
            console.log("Application started");
        });
    },
    err => {
        console.log("Error when connecting to database. Application not started. " + err);
    }
)