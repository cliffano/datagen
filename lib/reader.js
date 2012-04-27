var fs = require('fs');

function Reader(templates) {

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

  function data() {
    var data = {};
    templates.forEach(function (template) {
      data[template] = _read(template);
    });
    return data;
  }
  
  return {
    data: data
  };
}

exports.Reader = Reader;