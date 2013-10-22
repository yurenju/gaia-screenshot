var fs = require('fs'),
    execSync = require('exec-sync');

/**
 * ImageHelper is a toolkit to pocess images by library IMAGEMAGICK
 *
 */
function ImageHelper() { }

ImageHelper.prototype = {

  /**
   * Conver base64 information to PNG file.
   * @param {String} source text of base64 information
   * @param {String} path resource path
   * @param {String} filename
   * @return {String} path to PNG file.
   *
   */
  base64ToPNG: function(source, path, filename) {
    var TEXT_PATH = path + '/txt',
        FULL_TEXT_PATH = TEXT_PATH + '/' + filename + '_base64.txt',
        FULL_PNG_PATH = path + '/' + filename + '.png',
        RELATIVE_PNG_PATH = 'resource' + '/' + filename + '.png';

    if (!fs.existsSync(TEXT_PATH)) {
      fs.mkdirSync(TEXT_PATH);
    }

    fs.writeFileSync(FULL_TEXT_PATH, source);

    try {

      /* !!! IMAGEMAGICK ESSENTIAL !!! */
      execSync(['convert', 'inline:' + FULL_TEXT_PATH,
        FULL_PNG_PATH].join(' '));

      return RELATIVE_PNG_PATH;
    } catch (err) {
      return null;
    }
  },

  /**
   * Compare two image and generate diff result PNG image
   * @param {String} source_a image A source path
   * @param {String} source_b image B source path
   * @param {String} path resource path
   * @param {String} filename
   * @return {String} path to diff PNG file.
   *
   */
  compare: function(source_a, source_b, path, filename) {
    var RELATIVE_PNG_PATH = 'resource' + '/' + filename + '.png';

    try {

      /* !!! IMAGEMAGICK ESSENTIAL !!! */
      execSync([['cd', path].join(' '),
                ['compare', source_a, source_b,
                  RELATIVE_PNG_PATH].join(' ')].join(' && '));

      return RELATIVE_PNG_PATH;
    } catch (err) {
      return null;
    }
  }
};

module.exports = ImageHelper;
