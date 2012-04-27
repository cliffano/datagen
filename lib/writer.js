var _ = require('underscore'),
  fs = require('fs');

function Writer() {
  
  function gen(data, numSegments, params, outFile, cb) {
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

    stream.write(data.header);

    while (segmentId++ < numSegments) {
      segment = data.segment;
      params.segment_id = segmentId;
      _.keys(params).forEach(function (param) {
        segment = segment.replace(new RegExp('{' + param + '}', 'g'), params[param]);
      });
      stream.write(segment);
    }

    stream.end(data.footer);
  }

  return {
    gen: gen
  };
}

exports.Writer = Writer;