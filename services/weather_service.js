let request = require('request');
let cacheProvider = require('./utils/cache_provider');
const CACHE_DURATION = 600;
const CACHE_KEY = 'CACHE_KEY';

exports.CacheableRequest = function(cb,params) {
    cacheProvider.instance().get(CACHE_KEY, function(err, value) {
        if (err) console.error(err);
        if (value == undefined) {

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




            request.get('/api/v1/news.json', function(err, response, body) {
                let res = JSON.parse(res.body);

                cacheProvider.instance().set(CACHE_KEY, res, CACHE_DURATION, function(err, success) {
                    if (!err && success) {
                        cb(res);
                    }
                });
            });
        } else {
            cb(value);
        }
    });
}
