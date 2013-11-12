var request = require('request');
var username = "algorify";
var password = "Algorify9980@";
var auth = 'Basic ' + new Buffer(username + ':' + password).toString('base64');

var gitHubApi = {};

gitHubApi.setupHook = function(){
  //*************************************
  // Change hook to detect pull request
  //*************************************
  var url = "https://api.github.com/repos/algorify/jsalgo/hooks";
  var hookCallBack = "http://algorify.herokuapp.com/";
  var postBody = {
    "name": "web",
    "active": true,
    "events": ["pull_request"],
    "config": {
      "url": hookCallBack
    }
  };

  request.post(
      {
          url : url,
          headers : {
              "Authorization" : auth
          },
          body: JSON.stringify(postBody)
      },
      function (error, res, body) {
        console.log('STATUS: ' + res.statusCode);
        console.log('HEADERS: ' + JSON.stringify(res.headers));
        res.setEncoding('utf8');
        console.log('*****change hook BODY reply: ' + body);
      }
  );
}

module.exports = gitHubApi;
