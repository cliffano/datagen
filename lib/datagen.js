var childProcess = require('child_process'),
  Reader = require('./reader').Reader,
  worker = require('./worker'),
  p = require('path');

function DataGen(numSegments, numWorkers, outFile) {

  var templates = ['header', 'segment', 'footer'],
    numSegments = numSegments || 1,
    numWorkers = numWorkers || 1,
    outFile = outFile || 'out';
  
  function run(runId, cb) {
    
    var runId = runId || process.pid,
      data = new Reader(templates).data(),
      workers = [];

    // prepare all workers
    for (var i = 0; i < numWorkers; i += 1) {
      workers.push(childProcess.fork(p.join(__dirname, 'worker.js')));
    }

    // run all workers    
    for (var i = 0, ln = workers.length; i < ln; i += 1) {
      workers[i].send({
        workerId: i,
        data: data,
        numSegments: numSegments,
        params: { run_id: runId, worker_id: i },
        outFile: outFile + i
      });
    }
  }

  return {
    run: run
  };
}

exports.DataGen = DataGen;