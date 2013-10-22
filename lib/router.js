var dataFormat = require('dateformat'),
    fs = require('fs'),
    uuid = require('node-uuid'),
    LogReporter = require('./log_reporter'),
    CacheHelper = require('./cache_helper'),
    Path = require('path'),
    logReporter = {},
    cacheHelper = {};

var GENERAL_TEMPLATE_PATH =
      Path.normalize(__dirname + '/../template/general.ejs'),
    DIFF_TEMPLATE_PATH =
      Path.normalize(__dirname + '/../template/diff.ejs');

/**
 * Router is used to handle the requests from the clients.
 *
 * @class Router
 */
function Router() {
  cacheHelper = new CacheHelper();
}

Router.prototype = {
  /**
   * Build HTML files contain screenshot images and
   * save they in the server.
   *
   * @param {Object} data a JSON format object
   *                      contains creenshot images and info.
   * @param {String} path save the file in specificed path.
   * @param {String} [_filename] specificed filename to save.
   * @return {String} specificed filename to save.
   */
  screenshot: function(data, path, mode, _filename) {
    var GENERAL_LOG_PATH = path + '/general',
        DIFF_LOG_PATH = path + '/diff',
        REPORT_KEY = dataFormat(new Date(), 'yyyy-mm-dd-HH-MM-ss-') + uuid.v1();

    this._checkFolder(path);
    this._checkFolder(GENERAL_LOG_PATH);
    this._checkFolder(DIFF_LOG_PATH);

    GENERAL_LOG_PATH += '/' + REPORT_KEY;
    this._checkFolder(GENERAL_LOG_PATH);

    var filename;
    if (!_filename) {
      filename = 'report.html';
    } else {
      filename = _filename;
    }

    switch (mode) {
      case 'diff': {
        if (cacheHelper.getData().length == 0) {
          cacheHelper.setVersionA(DIFF_LOG_PATH, REPORT_KEY);
          cacheHelper.storeVersionA(data.screenshots);
        } else {
          cacheHelper.setVersionB(REPORT_KEY);
          cacheHelper.storeVersionB(data.screenshots);

          cacheHelper.PNGlize();
          cacheHelper.compare();

          logReporter = new LogReporter(DIFF_TEMPLATE_PATH);
          logReporter.save(cacheHelper, cacheHelper.getPath(), filename);
        }
      }
      default: {
        logReporter = new LogReporter(GENERAL_TEMPLATE_PATH);
        logReporter.save(data, GENERAL_LOG_PATH, filename);
        break;
      }
    }
    return filename;
  },

  /**
   * Check the folder is existed, or generate folder
   * @param {String} path folder path
   *
   */
  _checkFolder: function(path) {
    if (!fs.existsSync(path)) {
      fs.mkdirSync(path);
    }
  }
};
module.exports = new Router();
