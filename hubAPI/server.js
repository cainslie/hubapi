//npm modules
var express = require('express');
var mongoose = require('mongoose');

//my modules
var api = require('./api.js');

openDB = function () {
    mongoose.connect('mongodb://localhost:27018/IoT');
    var db = mongoose.connection;
    
    db.on('error', console.error.bind(console, 'connection error:'));
    db.once('open', console.log.bind(console, 'DB Connection established.'));
};


openDB();

api.listen(1111);