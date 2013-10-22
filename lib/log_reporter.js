var fs = require('fs'),
    ejs = require('ejs'),
    EventEmitter = require('events').EventEmitter;

/**
 * LogReporter is used to generate the HTML format report
 * with screenshots info.
 *
 * The JSON format of the "data" param is:
 * {
 *   screenshots: [
 *     { description: 'the first one', image: 'data:image/png;base64,' },
 *     { description: 'the second one', image: 'data:image/png;base64,' }
 *   ]
 * }
 *
 * @class LogReporter
 * @param {String} template the path of template file.
 */
function LogReporter(template) {
  if (!template) {
    throw { message: 'No param template.' };
  }

  this._template = '';
  this._eventEmitter = new EventEmitter();
  fs.readFile(template,
              'utf8',
              function(error, data) {
                this._eventEmitter.emit('templateLoaded', data);
                this._template = data;
              }.bind(this));
}

LogReporter.prototype = {
  /**
   * Save the HTML data as a file.
   *
   * @param {Object} data a JSON format object
   *                      contains creenshot images and info.
   * @param {String} path save the file in specificed path.
   * @param {String} filename specificed filename to save.
   */
  save: function(data, path, filename) {
    if (!path || !filename) {
      throw { message: 'No param path, filename.' };
    }

    if (this._template !== '') {
      this._saveHtmlWithTemplate(this._template, data,
                                 path, filename);
    } else {
      this._eventEmitter.on('templateLoaded', function(template) {
        this._saveHtmlWithTemplate(template, data,
                                   path, filename);
      }.bind(this));
    }
  },

  /**
   * Save the data as HTML file with template.
   *
   * @param {String} template template contain.
   * @param {Object} data a JSON format object
   *                      contains creenshot images and info.
   * @param {String} path save the file in specificed path.
   * @param {String} filename specificed filename to save.
   */
  _saveHtmlWithTemplate: function(template, data, path, filename) {
    var filePath = path + '/' + filename,
        html = ejs.render(template, data);

    fs.exists(path, function(exists) {
      if (exists) {
        fs.writeFile(filePath, html);
      } else {
        fs.mkdir(path, function() {
          fs.writeFile(filePath, html);
        });
      }
    });
  }
};

module.exports = LogReporter;
