/**
 * HttpHelper is a helper to handle the HTTP requests.
 *
 * @param {Object} request the HTTP request.
 * @param {Object} response the HTTP response.
 */
function HttpHelper(request, response) {
  this.request = request;
  this.response = response;
}

HttpHelper.prototype = {
  /**
   * Handles the post request with the request data.
   *
   * @param {Function} callback executes with the data.
   */
  postHandler: function(callback) {
    var requestData = '';

    this.response.writeHead(200, {
      'Content-Type': 'application/json'
    });

    this.request.on('data', function(data) {
      requestData += data;
    });

    this.request.on('end', function() {
      var jsonData = JSON.parse(decodeURI(requestData));
      if (typeof(callback) === 'function') {
        callback(undefined, jsonData);
      }
    });

    this.request.on('error', function(error) {
      if (typeof(callback) === 'function') {
        callback(error);
      }
    });
  },

  /**
   * Responses messages to the request.
   *
   * The message format is:
   * {
   *   result: 'success',
   *   message: 'It is OK.'
   * }
   *
   * @param {String} result "success" or "fail" string.
   * @param {String} [message] the info we would like to response.
   */
  responseMessage: function(result, message) {
    var json = {};
    if (result) {
      json.result = result;
    }
    if (message) {
      json.message = message;
    }
    this.response.end(JSON.stringify(json, null, 2));
  }
};

module.exports = HttpHelper;
