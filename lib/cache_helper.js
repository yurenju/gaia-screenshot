var fs = require('fs'),
    ImageHelper = require('./image_helper');

/**
 * CacheHelper is used to cache information
 * in order to compare 2 version of screenshots
 *
 * The JSON format of element in the "data" array is:
 * {
 *   description: 'image description',
 *   image_a: 'file path of first version screenshot',
 *   image_b: 'file path of second version screenshot',
 *   image_diff:  'file path of diff result',
 * }
 *
 */
function CacheHelper() {
  this.data = [];
  this.path = '';
  this.version_a = '';
  this.version_b = '';

  imageHelper = new ImageHelper();
}

CacheHelper.prototype = {
  /**
   * Retrieve data array
   * @return {Array} data array
   *
   */
  getData: function() {
    return this.data;
  },

  /**
   * Retrieve report path
   * @return {String} report path
   *
   */
  getPath: function() {
    return this.path;
  },

  /**
   * Set report path by unique key
   * @param {String} path DIFF_PATH
   * @param {String} key unique key of screenshots version A
   *
   */
  setVersionA: function(path, key) {
    this.version_a = key;
    this.path = path + '/' + key + '_with_';
  },

  /**
   * Set report path by unique key
   * @param {String} key unique key of screenshots version B
   *
   */
  setVersionB: function(key) {
    this.version_b = key;
    this.path += key;
    this._checkFolder(this.path);
  },

  /**
   * Store screenshots version A
   * @param {Array} screenshots screenshots array form post
   *
   */
  storeVersionA: function(screenshots) {
    for (var i = 0; i < screenshots.length; i++) {
      this._push({
        description: screenshots[i].description,
        image_a: screenshots[i].image
      });
    }
  },

  /**
   * Store screenshots version B
   * @param {Array} screenshots screenshots array form post
   *
   */
  storeVersionB: function(screenshots) {
    for (var i = 0; i < screenshots.length; i++) {
      var object = this._findByDescription(screenshots[i].description);
      object.image_b = screenshots[i].image;
    }
  },

  /**
   * Convert all base64 encoding screenshots images to PNG format
   *
   */
  PNGlize: function() {
    var RESOURCE_PATH = this.path + '/resource';
    this._checkFolder(RESOURCE_PATH);

    for (var i = 0; i < this.data.length; i++) {
      if (this.data[i].image_a)
        this.data[i].image_a =
          imageHelper.base64ToPNG(this.data[i].image_a,
            RESOURCE_PATH, i + '_a');
      if (this.data[i].image_b)
        this.data[i].image_b =
          imageHelper.base64ToPNG(this.data[i].image_b,
            RESOURCE_PATH, i + '_b');
    }
  },

  /**
   * Compare all screenshots with 2 version and generate diff result
   *
   */
  compare: function() {
    for (var i = 0; i < this.data.length; i++) {
      if (this.data[i].image_a && this.data[i].image_b)
        this.data[i].image_diff =
          imageHelper.compare(this.data[i].image_a,
            this.data[i].image_b, this.path, i + '_diff');
    }
  },

  /**
   * Find screenshot by description in 'data' array
   * @param {String} description description of screenshot
   * @return {Object} screenshot object
   *
   */
  _findByDescription: function(description) {
    for (var i = 0; i < this.data.length; i++) {
      if (this.data[i].description == description)
        return this.data[i];
    }
    return null;
  },

  /**
   * Push screenshot object into 'data' array
   * @param {Object} object screenshot object
   *
   */
  _push: function(object) {
    this.data.push(object);
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

module.exports = CacheHelper;
