var _ = require('underscore'),
  ncp = require('ncp'),
  p = require('path');

/**
 * class DataGen
 **/
function DataGen() {
}

/**
 * DataGen#config(cb)
 * - cb (Function): standard cb(err, result) callback
 *
 * Create sample header, segment, footer configuration files in current directory.
 **/
DataGen.prototype.config = function (cb) {
  console.log('Creating sample configuration files: header, segment, footer');
  ncp.ncp(p.join(__dirname, '../examples'), '.', cb);
};

DataGen.prototype.generate = function (genId, numSegments, numWorkers, outFile) {

  genId = genId || process.pid;
  numSegments = numSegments || 1;
  numWorkers = numWorkers || 1;
  outFile = outFile || 'data';

};

module.exports = DataGen;

/*
}; childProcess = require('child_process'),
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
*/