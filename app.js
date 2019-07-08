var createError = require('http-errors');
var express = require('express');
var cors = require('cors')

var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var weatherRouter = require('./routes/weather')
let cacheProvider = require('./utils/cache_provider');
var app = express();
app.use(cors());

app.options('*', cors())
cacheProvider.start(function(err) {
  if (err) console.error(err);
});


app.all('*', function(req, res,next) {


  var responseSettings = {
    "AccessControlAllowOrigin": '*',//req.headers.origin,
    "AccessControlAllowHeaders": "Content-Type,X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5,  Date, X-Api-Version, X-File-Name",
    "AccessControlAllowMethods": "POST, GET, PUT, DELETE, OPTIONS",
    "AccessControlAllowCredentials": true
  };

  /**
   * Headers
   */
  res.header("Access-Control-Allow-Credentials", responseSettings.AccessControlAllowCredentials);
  res.header("Access-Control-Allow-Origin",  responseSettings.AccessControlAllowOrigin);
  res.header("Access-Control-Allow-Headers", (req.headers['access-control-request-headers']) ? req.headers['access-control-request-headers'] : "x-requested-with");
  res.header("Access-Control-Allow-Methods", (req.headers['access-control-request-method']) ? req.headers['access-control-request-method'] : responseSettings.AccessControlAllowMethods);

  if ('OPTIONS' == req.method) {
    res.send(200);
  }
  else {
    next();
  }


});


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//
// app.use(function(req, res, next) {
//   res.header("Access-Control-Allow-Origin", "*");
//   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//   next();
// });


app.use('/', indexRouter);
app.use('/users', usersRouter);

app.use('/api', weatherRouter);

// catch 404 and forward to error handler
// app.use(function(req, res, next) {
//   next(createError(404));
//
// });
//
// // error handler
// app.use(function(err, req, res, next) {
//   // set locals, only providing error in development
//   res.locals.message = err.message;
//   res.locals.error = req.app.get('env') === 'development' ? err : {};
//
//   // render the error page
//   //res.status(err.status || 500);
//   res.status(err.status || 500).json(err);
//  // res.render('error');
// });


app.use((err, req, res, next) => { // eslint-disable-line no-unused-vars
  logger.error(err);
  res.status(err.status || 500).send(err.message);
});
app.use('*', (req, res) => {
  res.status(404);
  res.send('URL cannot found');
});


module.exports = app;
