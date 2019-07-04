var express = require('express');
var router = express.Router();
var request = require('request');

//http://api.openweathermap.org/data/2.5/forecast/daily?q=Kiev&mode=json&units=me0tric&cnt=3&apikey=94b7c9a9908d65670675b7edd72079fc
//https://samples.openweathermap.org/data/2.5/forecast?q=M%C3%BCnchen,DE&appid=b6907d289e10d714a6e88b30761fae22
router.post('/weather/:periodicity/:city', function (rec, res, next) {
    console.log(rec.params);

    request({
        uri: 'http://api.openweathermap.org/data/2.5/forecast/daily?apikey=94b7c9a9908d65670675b7edd72079fc',
        /*oauth: {api_key: '6905d081cada6be5c5bf13982d3279cd'},*/
        qs: {

            q: rec.params.city,
            mode:'json',
            units:'metric',
            cnt:3
            //query: 'World of Warcraft: Legion'
        }
    }).pipe(res);

});


module.exports = router;
