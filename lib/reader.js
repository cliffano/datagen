var fs = require('fs');

function Reader(templateFiles) {

  function _read(file) {
    var data;
    try {
      fs.stat(file);
      data = fs.readFileSync(file).toString();
    } catch (err) {
      console.warn('Ignoring ' + file + ' due to ' + err.message);
    }
    return data;
  }

  function templates() {
    var data = {};
    templateFiles.forEach(function (templateFile) {
      data[templateFile] = _read(templateFile);
    });
    return data;
  }
  
  return {
    templates: templates
  };
}

exports.Reader = Reader;