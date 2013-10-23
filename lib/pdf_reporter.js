var PDFDocument = require('pdfkit'),
    fs = require('fs');

/**
 * PDFReporter is used to generate PDF report.
 *
 */
function PDFReporter() {}

PDFReporter.prototype = {
  /**
   * Save the General Report as a PDF file.
   *
   * @param {Object} data a JSON format object
   *                      contains screenshot images and info.
   * @param {String} path save the file in specificed path.
   * @param {String} filename specificed filename to save.
   */
  saveGeneralPDF: function(data, path, filename) {
    var doc = new PDFDocument();

    doc.text(filename, 50, 50);
    for (var i = 0; i < data.screenshots.length; i++) {
      doc.addPage();
      doc.text(data.screenshots[i].description, 50, 50);
      doc.image(path + '/' + data.screenshots[i].image,
        50, 70, { fit: [300, 300] });
      doc.text('');
    }

    this._savePDF(doc, path, filename);
  },

  /**
   * Save the Diff Report as a PDF file.
   *
   * @param {Object} data a JSON format object
   *                      contains screenshot images and info.
   * @param {String} path save the file in specificed path.
   * @param {String} filename specificed filename to save.
   */
  saveDiffPDF: function(data, path, filename) {
    var doc = new PDFDocument();

    doc.text(filename, 50, 50);
    for (var i = 0; i < data.screenshots.length; i++) {
      doc.addPage();
      doc.text(data.screenshots[i].description, 50, 50);
      doc.image(path + '/' + data.screenshots[i].image_a,
        50, 70, { fit: [300, 300] });
      doc.image(path + '/' + data.screenshots[i].image_b,
        350, 70, { fit: [300, 300] });
      doc.image(path + '/' + data.screenshots[i].image_diff,
        50, 400, { fit: [300, 300] });
      doc.text('');
    }

    this._savePDF(doc, path, filename);
  },

  /**
   * Save the data as PDF file.
   *
   * @param {Object} PDF document entity.
   * @param {String} path save the file in specificed path.
   * @param {String} filename specificed filename to save.
   */
  _savePDF: function(doc, path, filename) {
    var filePath = path + '/' + filename;

    fs.exists(path, function(exists) {
      if (exists) {
        doc.write(filePath);
      } else {
        fs.mkdir(path, function() {
          doc.write(filePath);
        });
      }
    });
  }
};

module.exports = PDFReporter;
