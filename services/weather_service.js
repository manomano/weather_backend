let request = require('request');
let cacheProvider = require('../utils/cache_provider');
const CACHE_DURATION = 600;
const CACHE_KEY = 'CACHE_KEY';

function generateResponse(object){

    if(!object){
        return {};
    }

    console.log(object);
    //return object;
    function leadingZero(n) {
        if(n<10){
            return '0' + n.toString()
        }
        return n.toString();
    }

    function dateFormat(num,delimiter) {
        const d = new Date(num)
        const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov']
        return d.getDate() + delimiter + months[d.getMonth()] + delimiter + d.getFullYear();
    }

    function getWindDirectionStr(deg) {

        if(deg<=90){
            if(deg==0){
                return 'North';
            }
            return 'Northeast'
        }

        if(deg>90 && deg<=180){
            if(deg==180){
                return 'East';
            }
            return 'Southeast'
        }

        if(deg>180 && deg<=270){
            if(deg==270){
                return 'West';
            }
            return 'Southwest'
        }

        if(deg==360){
            return 'North'
        }
        return "Northwest"

    }

    let arr = [];
    for (let i = 0; i < 3; i++) {
        arr.push({
            "date": dateFormat(object.list[i].dt * 1000, ' '),
            "summary": object.list[i].weather[0].description,
            "temp": { "day": object.list[0].temp.day, "night": object.list[i].temp.night },
            "wind": { "direction": getWindDirectionStr(object.list[i].deg), "speed": object.list[i].speed}
        });
    }


    return {
        "location": {
            "name": object.city.name,
            "country": object.city.country
        },
        "forecast":arr
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
                const parsedData = JSON.parse(body)
                if(parsedData.cod && parsedData.cod==404){
                    cb(parsedData);
                    return;
                }
                let res = generateResponse(parsedData);
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
