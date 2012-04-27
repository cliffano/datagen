var childProcess = require('child_process'),
  Reader = require('./reader').Reader,
  worker = require('./worker'),
  p = require('path');

function DataGen(numSegments, numWorkers, outFile) {

  var templateFiles = ['header', 'segment', 'footer'];

  numSegments = numSegments || 1;
  numWorkers = numWorkers || 1;
  outFile = outFile || 'out';
  
  function run(runId, cb) {
    
    var templates = new Reader(templateFiles).templates(),
      workers = [];

    runId = runId || process.pid;

    // prepare all workers
    for (var i = 0; i < numWorkers; i += 1) {
      workers.push(childProcess.fork(p.join(__dirname, 'worker.js')));
    }

    // run all workers    
    for (var j = 0, ln = workers.length; j < ln; j += 1) {
      workers[j].send({
        workerId: j,
        templates: templates,
        numSegments: numSegments,
        params: { run_id: runId, worker_id: j },
        outFile: outFile + j
      });
    }
  }

  return {
    run: run
  };
}

exports.DataGen = DataGen;