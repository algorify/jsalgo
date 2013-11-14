/**
 * Module dependencies.
 */

var express = require('express');
var http = require('http');
var path = require('path');
var config = require('./config/config.js');
var router = require('./config/routes.js');
var mongoose = require('mongoose');
var util = require('util');
var passport = require("passport")
var port = process.env.PORT || 5000;
var app = express();
var fs = require('fs');
var flash = require("connect-flash");
var gitHubApi = require('./util/gitHubApi.js');

////////////////////////////////////////
//Database initialization
////////////////////////////////////////

var uristring =
process.env.MONGOLAB_URI ||
process.env.MONGOHQ_URL ||
'mongodb://localhost/HelloMongoose';

mongoose.connect(uristring, function(err, res){
  if (err) {
  console.log ('ERROR connecting to: ' + uristring + '. ' + err);
  } else {
  console.log ('Succeeded connected to: ' + uristring);
  }
});

var models_dir = __dirname + '/models';
fs.readdirSync(models_dir).forEach(function (file) {
  if(file[0] === '.') return; 
  require(models_dir+'/'+ file);
});

////////////////////////////
//App Configuration
////////////////////////////
var app = express();

require('./config/passport')(passport, config);

app.configure(function () {
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.cookieParser());
  app.use(express.bodyParser());
  app.use(express.session({ secret: 'keyboard cat' }));
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(express.methodOverride());
  app.use(flash());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

app.use(function(err, req, res, next){
  console.log("ERROR:",err);
  res.status(err.status || 500);
  res.render('500', { error: err });
});

app.use(function(req, res, next){
  res.status(404);
  if (req.accepts('html')) {
    res.render('404', { url: req.url });
    return;
  }
  if (req.accepts('json')) {
    res.send({ error: 'Not found' });
    return;
  }
  res.type('txt').send('Not found');
});

router(app, passport);
//**************************
// Setup github api
//**************************
gitHubApi.setupHook();

//**************************
// Start Server
//**************************
http.createServer(app).listen(port, function(){
  console.log('Express server listening on port ' + port);
});

//////////////////////////////////////////
// setup github
//////////////////////////////////////////
// var username = "woonketwong";
// var password = "guytall9980";
// var auth = 'Basic ' + new Buffer(username + ':' + password).toString('base64');
// var request = require('request');
// var url = "https://api.github.com/repos/woonketwong/CCare/hooks";
// console.log("auth:", auth);

// request(
//     {
//         url : url,
//         headers : {
//             "Authorization" : auth
//         }
//     },
//     function (error, res, body) {
//       console.log('STATUS: ' + res.statusCode);
//       console.log('HEADERS: ' + JSON.stringify(res.headers));
//       res.setEncoding('utf8');
//       console.log('*****BODY: ' + body);
//     }
// );

//****************************************

// var http = require('http');
// var fs = require('fs');
// var url = "http://img87.imageshack.us/img87/5673/rotatetrans.png";
// var file = fs.createWriteStream("testing.png");
// var request = http.get(url, function(response) {
//   response.pipe(file);
// });

//****************************************
// Working (download a particular committed file)!!
// //*****************************************
// var username = "algorify";
// var password = "Algorify9980@";
// var auth = 'Basic ' + new Buffer(username + ':' + password).toString('base64');
// var url = "https://github.com/algorify/jsalgo/raw/22406743e96b911ae7ac61cda0c39ed049f53928/testing.js";
// console.log("auth:", auth);

// request(
//     {
//         url : url,
//         headers : {
//             "Authorization" : auth
//         }
//     },
//     function (error, res, body) {
//       console.log('STATUS: ' + res.statusCode);
//       console.log('HEADERS: ' + JSON.stringify(res.headers));
//       res.setEncoding('utf8');
//       console.log('*****BODY: ' + body);
//     }
// ).pipe(fs.createWriteStream("testing.js"));
