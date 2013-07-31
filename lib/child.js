var Worker = require('./worker');

/**
 * Create a worker and tell it to write a data file.
 *
 * @param {Object} message: message object from the master process
 * @param {Function} cb: callback function
 */
function worker(message, cb) {
  console.log('Start worker ' + message.workerId);
  new Worker(message.workerId).write(
    message.templates,
    message.genId,
    message.numSegments,
    message.outFile,
    function () {
      console.log('Finish worker ' + message.workerId);
      cb();
    }
  );
}

module.exports = worker;
