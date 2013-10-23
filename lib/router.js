var dataFormat = require('dateformat'),
    fs = require('fs'),
    uuid = require('node-uuid'),
    Path = require('path'),
    LogReporter = require('./log_reporter'),
    PDFReporter = require('./pdf_reporter'),
    CacheHelper = require('./cache_helper'),
    ImageHelper = require('./image_helper'),
    general_logReporter = {},
    diff_logReporter = {},
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
  imageHelper = new ImageHelper();
  pdfReporter = new PDFReporter();
  general_logReporter = new LogReporter(GENERAL_TEMPLATE_PATH);
  diff_logReporter = new LogReporter(DIFF_TEMPLATE_PATH);
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

      // Use cacheHelper in order to generate diff.
      case 'diff': {
        if (cacheHelper.getScreenshots().length == 0) {
          cacheHelper.setBasePath(DIFF_LOG_PATH);
          cacheHelper.setVersionA(REPORT_KEY);

          cacheHelper.storeVersionA(data);
        } else {
          cacheHelper.setVersionB(REPORT_KEY);
          this._checkFolder(cacheHelper.getPath());

          cacheHelper.storeVersionB(data);

          cacheHelper.PNGlize();
          cacheHelper.compare();

          diff_logReporter.save({
            screenshots: cacheHelper.getScreenshots()
          }, cacheHelper.getPath(), filename);
        }
      }

      // Defaut generate General Report.
      default: {
        general_logReporter.save(data, GENERAL_LOG_PATH, filename);
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
