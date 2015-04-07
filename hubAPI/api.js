var express = require('express');
var uuid = require('uuid');
var cookieParser = require('cookie-parser');
var iotSensor = require('./models.js').iotSensor;
var apiVersion = require('./models.js').apiVersion;
var dbtools = require('./dbtools.js');

var app = express();
app.use(cookieParser());

app.get('/', function (req, res) {
    var key = '';
    if (req.cookies.apikey) {
        var cookie_ = req.cookies.apikey;
        key = cookie_;
        //console.log(cookie_);
    } else {
        var apiKey = uuid.v4();
        key = apiKey;
        res.setHeader('Set-Cookie', 'test=value');
        res.cookie('apikey', key, { maxAge: 9999999, httpOnly: false });
        var cookie_ = req.cookies.apikey
        //console.log(cookie_);
    }
    res.send(cookie_);
});

app.get('/clear', function (req, res) {
    res.clearCookie('apikey');
    res.send('cookie cleared')
});

app.get('/api/readall/:slug',
    function (req, res) {
    console.log(req.params.slug);
    dbtools.findForKey(res, req.params.slug);
});

app.get('/api/readlast/:slug',
    function (req, res) {
    dbtools.findForKey(res, req.params.slug, 1);
    //next()
});

app.get('/api/readlast/:count/:slug',
    function (req, res) {
    dbtools.findForKey(res, req.params.slug, req.params.count);
});

app.get('/api/version',
    function (req, res) {
    var version = new apiVersion;
    version.version = '0.0.0.1';
    //console.log(version)
    res.send(JSON.stringify(version, null, 4));
});

app.get('/api/schema',
    function (req, res) {
    //build models for everything
    //send all models out
    //res.setHeader(200, { 'Content-Type': 'application/json' });
    //console.log(iotSensor.schema.toJSON);
    res.send(iotSensor.toJSON);
});

app.get('/c', function (req, response) {
    response.setHeader('Content-Type', 'text/html; charset=UTF-8');
    response.setHeader('Transfer-Encoding', 'chunked');
    var html =
 '<!DOCTYPE html>' +
        '<html lang="en">' +
            '<head>' +
                '<meta charset="utf-8">' +
                '<title>Chunked transfer encoding test</title>' +
            '</head>' +
            '<body>';
    
    response.write(html);
    
    html = '<h1>Chunked transfer encoding test</h1>'
    
    response.write(html);
    
    // Now imitate a long request which lasts 5 seconds.
    setTimeout(function () {
        html = '<h5>This is a chunked response after 5 seconds. The server should not close the stream before all chunks are sent to a client.</h5>'
        
        response.write(html);
        
        // since this is the last chunk, close the stream.
        html =
            '</body>' +
                '</html';
        
        response.end(html);
 
    }, 5000);
    
    // this is another chunk of data sent to a client after 2 seconds before the
    // 5-second chunk is sent.
    setTimeout(function () {
        html = '<h5>This is a chunked response after 2 seconds. Should be displayed before 5-second chunk arrives.</h5>'
        
        response.write(html);
 
    }, 2000);
});

app.get('/api/create/:slug',
    function (req, res) {
    var sensor = new iotSensor;
    
    var s = 'Your API key is: ' + req.params.slug + ' <BR> ';
    for (var param in req.query) {
        sensor.apiKey = req.params.slug;
        sensor.deviceID = 11;//****************
        sensor.timestamp = Date();
        sensor.sensorData.push({ key : param, value : req.query[param] });
        s = s + 
            'Parameter: ' + param + ' - ' +
            'Value: ' + req.query[param] + ' <BR> ';
    }
    dbtools.saveData(sensor);
    res.json('[{result : ok}]');
});

module.exports = app;