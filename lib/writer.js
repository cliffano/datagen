var _ = require('underscore'),
  fs = require('fs');

function Writer() {
  
  function gen(templates, numSegments, params, outFile, cb) {
    var stream = fs.createWriteStream(outFile,
        { flags: 'w', encoding: 'utf-8' }),
      segmentId = 0,
      segment;

    stream.on('error', function (err) {
      console.error('Error: ' + err);
    });

    stream.on('close', function () {
      cb();
    });

    stream.write(templates.header);

    while (segmentId++ < numSegments) {
      segment = templates.segment;
      params.segment_id = segmentId;
      
      function _apply(param) {
        segment = segment.replace(new RegExp('{' + param + '}', 'g'), params[param]);
      }
      
      _.keys(params).forEach(_apply);
      stream.write(segment);
    }

    stream.end(templates.footer);
  }

  return {
    gen: gen
  };
}

exports.Writer = Writer;