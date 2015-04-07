var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var apiVersion = new Schema({
    version : { type: String },
    scatter : { type: String}
}, { _id : false }
);

var sData = new Schema(
    {
        key : { type: String }, 
        value : { type: String }
    }, { _id: false }
);

var iotData = new Schema(
    {
        apiKey: {type:String, required:true },
        deviceID: { type: String, required:true },
        timestamp : { type: Date, required: true },
        friendlyName : {type:String},
        sensorData: [sData]
    }, { versionKey: false }
);

var iotSensor = mongoose.model('Sensor', iotData);
var apiVersion = mongoose.model('apiData', apiVersion);

module.exports = { iotSensor : iotSensor, apiVersion : apiVersion }