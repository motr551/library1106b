console.log('- app.js library1106b');

var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index.js');
var usersRouter = require('./routes/users.js');
//Import routes for "catalog" area of site
var catalogRouter = require('./routes/catalog.js');

// Hide secret data with nconf
var fs    = require('fs') 
var nconf = require('nconf');
 
// nconf.argv().env().file({ file: 'config.json' });
nconf.argv()
   .env()
   .file({ file: './config/config.json' });

console.log('nconf.get: ' + nconf.get("DB_USER"));
console.log('nconf.get: ' + nconf.get("DB_PASSWORD"));


var app = express();

//Set up mongoose connection
var mongoose = require('mongoose');
// var dev_db_url = 'mongodb+srv://motrll:mo2389ll@cluster0-m27o8.mongodb.net/local_library?retryWrites=true';
var dev_db_url = nconf.get("DB_URI");
var mongoDB = process.env.MONGODB_URI || dev_db_url;

mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true })

mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// add the middleware libraries into the request handling chain
app.use(logger('dev'));

app.use(express.json());
app.use(express.urlencoded( { extended: false }) );

app.use(cookieParser());

app.use(express.static(path.join(__dirname, 'public')));

// routes to use
app.use('/', require('./routes/index.js'));
app.use('/users', require('./routes/users.js')); //Currently NOT used
// Add catalog routes to middleware chain.
app.use('/catalog', require('./routes/catalog.js')); 

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;

console.log('app.js library1106b');



