var Path = require('path'),
    fs = require('fs'),
    express = require('express'),
    router = require('./router'),
    HttpHelper = require('./http_helper');

var MODE = process.argv[2],
    GAIA_PATH = process.argv[3],
    LOG_PATH = Path.normalize(GAIA_PATH + '/../logs'),
    DEFAULT_SERVER_PORT = 3000;

var app = express(),
    port = process.env.PORT ?
           process.env.PORT : DEFAULT_SERVER_PORT;

// The router to handle the HTTP requests.
app.post('/sendScreenshot', function(request, response) {
  var httpHelper = new HttpHelper(request, response);

  httpHelper.postHandler(function(error, data) {
    var filename = '';
    if (error) {
      httpHelper.responseMessage('fail', error);
      return;
    }
    filename = router.screenshot(data, LOG_PATH, MODE);
    httpHelper.responseMessage('success', filename);
  });
});

app.listen(3000, function() {
  console.log('Local server is running.');
  console.log('Screenshot Report will be generated in:' + LOG_PATH);
});
