var _ = require('underscore'),
  childProcess = require('child_process'),
  fs = require('fs'),
  ncp = require('ncp'),
  p = require('path');

/**
 * class DataGen
 **/
function DataGen() {
}

/**
 * DataGen#init(cb)
 * - cb (Function): standard cb(err, result) callback
 *
 * Create example header, segment, footer template files in current directory.
 **/
DataGen.prototype.init = function (cb) {
  console.log('Creating example template files: header, segment, footer');
  ncp.ncp(p.join(__dirname, '../examples'), '.', cb);
};

/**
 * DataGen#generate(genId, numSegments, numWorkers, outFile)
 * - genId (Number): an ID unique to the current data generation, used by all worker processes
 * - numSegments (Number): how many segments in a data file
 * - numWorkers (Number): how many worker processes to spawn, each worker creates a data file
 * - outFile (String): the data file name, to be postfixed with worker ID
 *
 * Spawn worker processes which will then generate the data file.
 **/
DataGen.prototype.generate = function (genId, numSegments, numWorkers, outFile) {

  genId = genId || process.pid.toString();
  numSegments = numSegments || 1;
  numWorkers = numWorkers || 1;
  outFile = outFile || 'data';

  var templates = {};
  ['header', 'segment', 'footer'].forEach(function (file) {
    templates[file] = fs.readFileSync(file).toString();
  });

  for (var i = 0; i < numWorkers; i += 1) {
    var worker = childProcess.fork(p.join(__dirname, 'worker.js'));
    worker.send({
      workerId: i + 1,
      templates: templates,
      genId: genId,
      numSegments: numSegments,
      outFile: outFile
    });
  }
};

module.exports = DataGen;