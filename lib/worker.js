var bag = require('bagofholding'),
  fs = require('fs');

/**
 * class Worker
 * - workerId (Number): an ID unique to this worker
 **/
function Worker(workerId) {
  this.workerId = workerId;
}

/**
 * Worker#write(templates, genId, numSegments, outFile, cb)
 * - templates (Object): data file templates in the format of { header: '', segment: '', footer: '' }
 * - genId (Number): an ID unique to the current data generation, used by all worker processes
 * - numSegments (Number): how many segments in a data file
 * - outFile (String): the data file name, to be postfixed with worker ID
 * - cb (Function): standard cb(err, result) callback
 *
 * Write a data file consisting of header, segment x numSegments, and footer templates.
 * File is being streamed so it can handle large content.
 **/
Worker.prototype.write = function (templates, genId, numSegments, outFile, cb) {

  var stream = fs.createWriteStream(outFile + this.workerId, { flags: 'w', encoding: 'utf-8' }),
    segmentId = 0,
    params = {
      gen_id: genId,
      worker_id: this.workerId
    };

  stream.on('error', function (err) {
    console.error('Error: ' + err);
  });

  stream.on('close', function () {
    cb();
  });

  stream.write(bag.text.apply(templates.header, params));

  while (segmentId++ < numSegments) {
    params.segment_id = segmentId;
    stream.write(bag.text.apply(templates.segment, params));
  }

  stream.end(bag.text.apply(templates.footer, params));
};

module.exports = Worker;

/**
 * process#on(message, cb)
 * - message (Object): message object from the master process
 * - cb (Function): callback function
 *
 * Create a worker and tell it to write a data file.
 **/
process.on('message', function (message) {
  console.log('Starting worker ' + message.workerId);
  new Worker(message.workerId).write(
    message.templates,
    message.genId,
    message.numSegments,
    message.outFile,
    function () {
      console.log('Finishing worker ' + message.workerId);
      process.exit(1);
    }
  );
});