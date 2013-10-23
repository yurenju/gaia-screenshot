var fs = require('fs'),
    ImageHelper = require('./image_helper');

/**
 * CacheHelper is used to cache information
 * in order to compare 2 version of screenshots
 *
 * The JSON format of element in the "screenshots" array is:
 * {
 *   description: 'image description',
 *   image_a: 'file path of first version screenshot',
 *   image_b: 'file path of second version screenshot',
 *   image_diff:  'file path of diff result',
 * }
 *
 */
function CacheHelper() {
  this.screenshots = [];
  this.path = '';
  this.version_a = '';
  this.version_b = '';

  imageHelper = new ImageHelper();
}

CacheHelper.prototype = {
  /**
   * Retrieve screenshots array
   * @return {Array} screenshots array
   *
   */
  getScreenshots: function() {
    return this.screenshots;
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
   * Set report base path
   * @param {String} path DIFF_PATH
   *
   */
  setBasePath: function(path) {
    this.path = path;
  },

  /**
   * Set report path by unique key
   * @param {String} path DIFF_PATH
   * @param {String} key unique key of screenshots version A
   *
   */
  setVersionA: function(key) {
    this.version_a = key;
    this.path += '/' + key + '_with_';
  },

  /**
   * Set report path by unique key
   * @param {String} key unique key of screenshots version B
   *
   */
  setVersionB: function(key) {
    this.version_b = key;
    this.path += key;
  },

  /**
   * Store screenshots version A
   * @param {Array} screenshots screenshots array form post
   *
   */
  storeVersionA: function(data) {
    for (var i = 0; i < data.screenshots.length; i++) {
      this._push({
        description: data.screenshots[i].description,
        image_a: data.screenshots[i].image,
        image_b: null,
        image_diff: null
      });
    }
  },

  /**
   * Store screenshots version B
   * @param {Array} screenshots screenshots array form post
   *
   */
  storeVersionB: function(data) {
    for (var i = 0; i < data.screenshots.length; i++) {
      var object = this._findByDescription(data.screenshots[i].description);
      object.image_b = data.screenshots[i].image;
    }
  },

  /**
   * Convert all base64 encoding screenshots images to PNG format
   *
   */
  PNGlize: function() {
    for (var i = 0; i < this.screenshots.length; i++) {
      if (this.screenshots[i].image_a)
        this.screenshots[i].image_a =
          imageHelper.base64ToPNG(this.screenshots[i].image_a,
            this.path, i + '_a');
      if (this.screenshots[i].image_b)
        this.screenshots[i].image_b =
          imageHelper.base64ToPNG(this.screenshots[i].image_b,
            this.path, i + '_b');
    }
  },

  /**
   * Compare all screenshots with 2 version and generate diff result
   *
   */
  compare: function() {
    for (var i = 0; i < this.screenshots.length; i++) {
      if (this.screenshots[i].image_a && this.screenshots[i].image_b)
        this.screenshots[i].image_diff =
          imageHelper.compare(this.screenshots[i].image_a,
            this.screenshots[i].image_b, this.path, i + '_diff');
    }
  },

  /**
   * Find screenshot by description in 'screenshots' array
   * @param {String} description description of screenshot
   * @return {Object} screenshot object
   *
   */
  _findByDescription: function(description) {
    for (var i = 0; i < this.screenshots.length; i++) {
      if (this.screenshots[i].description == description)
        return this.screenshots[i];
    }
    return null;
  },

  /**
   * Push screenshot object into 'screenshots' array
   * @param {Object} screenshot object
   *
   */
  _push: function(screenshot) {
    this.screenshots.push(screenshot);
  }
};

module.exports = CacheHelper;
