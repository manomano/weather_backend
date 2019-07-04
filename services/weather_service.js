let request = require('request');
let cacheProvider = require('../utils/cache_provider');
const CACHE_DURATION = 600;
const CACHE_KEY = 'CACHE_KEY';

function generateResponse(object){

    function leadingZero(n) {
        if(n<10){
            return '0' + n.toString()
        }
        return n.toString();
    }

    function dateFormat(num,delimiter) {
        const d = new Date(num)
        return leadingZero(d.getDay()) + delimiter + leadingZero(d.getMonth()) + delimiter + d.getFullYear();
    }


    return {
        "location": {
            "name": object.city.name,
            "country": object.city.country
        },
        "forecast":[
            {
                "date": dateFormat(object.list[0].dt * 1000, '-'),
                "summary": object.list[0].weather.description,
                "temp": { "day": object.list[0].temp.day, "night": object.list[0].temp.night },
                "wind": { "direction": "Northwest", "speed": "Light breeze"}
            },
            {
                "date": dateFormat(object.list[1].dt * 1000, '-'),
                "summary": object.list[1].weather.description,
                "temp": { "day": object.list[1].temp.day, "night": object.list[1].temp.night },
                "wind": { "direction": "Northwest", "speed": "Light breeze"}
            },
            {
                "date": dateFormat(object.list[2].dt * 1000, '-'),
                "summary": object.list[2].weather.description,
                "temp": { "day": object.list[2].temp.day, "night": object.list[2].temp.night },
                "wind": { "direction": "Northwest", "speed": "Light breeze"}
            }
        ]
    }

}





exports.CacheableRequest = function(cb,params) {
    cacheProvider.instance().get(params.city, function(err, value) {
        if (err) console.error(err);
        if (value == undefined) {

            request({
                uri: 'http://api.openweathermap.org/data/2.5/forecast/daily?apikey=94b7c9a9908d65670675b7edd72079fc',
                qs: {
                    q: params.city,
                    mode:'json',
                    units:'metric',
                    cnt:3
                }
            },function (err, response, body) {
                let res = generateResponse(JSON.parse(body));
                cacheProvider.instance().set(params.city, res, CACHE_DURATION, function(err, success) {
                    if (!err && success) {
                        cb(res);
                    }
                });
            })//.pipe(res);




            /*request.get('/api/v1/news.json', function(err, response, body) {
                let res = JSON.parse(res.body);

                cacheProvider.instance().set(CACHE_KEY, res, CACHE_DURATION, function(err, success) {
                    if (!err && success) {
                        cb(res);
                    }
                });
            });*/
        } else {
            cb(value);
        }
    });
}
