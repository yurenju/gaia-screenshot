var fs = require('fs'),
    execSync = require('exec-sync');

/**
 * ImageHelper is a toolkit to pocess images by library IMAGEMAGICK
 * Return PNG PATH is RELATIVE PATH form html <img> using.
 *
 */
function ImageHelper() { }

ImageHelper.prototype = {

  /**
   * Conver base64 information to PNG file.
   * @param {String} source_base64 text of base64 information
   * @param {String} path report path
   * @param {String} filename
   * @return {String} path to PNG file.
   *
   */
  base64ToPNG: function(source_base64, path, filename) {
    var RESOURCE_PATH = path + '/resource',
        TEXT_PATH = RESOURCE_PATH + '/txt',
        FULL_TEXT_PATH = TEXT_PATH + '/' + filename + '_base64.txt',
        FULL_PNG_PATH = RESOURCE_PATH + '/' + filename + '.png',
        RELATIVE_PNG_PATH = 'resource' + '/' + filename + '.png';

    this._checkFolder(RESOURCE_PATH);
    this._checkFolder(TEXT_PATH);

    fs.writeFileSync(FULL_TEXT_PATH, source_base64);

    /* !!! IMAGEMAGICK ESSENTIAL !!! */
    execSync(['convert', 'inline:' + FULL_TEXT_PATH,
      FULL_PNG_PATH].join(' '));

    return RELATIVE_PNG_PATH;
  },

  /**
   * Compare two image and generate diff result PNG image
   * @param {String} source_a image A source path
   * @param {String} source_b image B source path
   * @param {String} path report path
   * @param {String} filename
   * @return {String} path to diff PNG file.
   *
   */
  compare: function(source_path_a, source_path_b, path, filename) {
    var RELATIVE_PNG_PATH = 'resource' + '/' + filename + '.png';

    /* !!! IMAGEMAGICK ESSENTIAL !!! */
    execSync([['cd', path].join(' '),
              ['compare', source_path_a, source_path_b,
                RELATIVE_PNG_PATH].join(' ')].join(' && '));

    return RELATIVE_PNG_PATH;
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

module.exports = ImageHelper;
