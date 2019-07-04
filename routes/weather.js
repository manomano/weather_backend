var express = require('express');
var router = express.Router();
var request = require('request');
const weatherService = require('../services/weather_service');

//http://api.openweathermap.org/data/2.5/forecast/daily?q=Kiev&mode=json&units=me0tric&cnt=3&apikey=94b7c9a9908d65670675b7edd72079fc
//https://samples.openweathermap.org/data/2.5/forecast?q=M%C3%BCnchen,DE&appid=b6907d289e10d714a6e88b30761fae22
router.post('/weather/:periodicity/:city', function (rec, res, next) {
    console.log(rec.params);

    weatherService.CacheableRequest(function(results) {
        res.send(results);
    }, rec.params);

});


module.exports = router;
