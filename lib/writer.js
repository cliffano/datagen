var _ = require('underscore'),
  fs = require('fs');

function Writer() {
  
  function gen(templates, numSegments, params, outFile, cb) {
    var stream = fs.createWriteStream(outFile,
        { flags: 'w', encoding: 'utf-8' }),
      segmentId = 0;

    stream.on('error', function (err) {
      console.error('Error: ' + err);
    });

    stream.on('close', function () {
      cb();
    });

    function _apply(text, params) {
      _.keys(params).forEach(function (param) {
        text = text.replace(new RegExp('{' + param + '}', 'g'), params[param]);
      });
      return text;
    }

    stream.write(_apply(templates.header, params));

    while (segmentId++ < numSegments) {
      var segmentParams = _.clone(params);
      segmentParams.segment_id = segmentId;
      stream.write(_apply(templates.segment, segmentParams));
    }

    stream.end(_apply(templates.footer, params));
  }

  return {
    gen: gen
  };
}

exports.Writer = Writer;