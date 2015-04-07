var iotSensor = require('./models.js').iotSensor;
var mongoose = require('mongoose');

exports.saveData = function (sensor) {
    sensor.save(function (err, data) {
        if (err) console.log(err);
        else {
            console.log('Saved : ', data);
        }
    })
};

exports.findForKey = function (res, key, rowcount) {
    iotSensor.find({ 'apiKey' : key }, function (err, data) {
        if (err) {
            res.send(err);
        } else {
            res.setHeader('Content-Type', 'application/json');
            res.send(JSON.stringify(data, null, 4));
        }
    }
    ).sort({ 'timestamp': -1 }).limit(rowcount)
};
