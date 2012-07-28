var _ = require('underscore'),
  childProcess = require('child_process'),
  fs = require('fs'),
  ncp = require('ncp'),
  p = require('path');

/**
 * class DataGen
 */
function DataGen() {
}

/**
 * Create example header, segment, footer template files in current directory.
 *
 * @param {Function} cb: standard cb(err, result) callback
 */
DataGen.prototype.init = function (cb) {
  console.log('Creating example template files: header, segment, footer');
  ncp.ncp(p.join(__dirname, '../examples'), '.', cb);
};

/**
 * Spawn worker processes which will then generate the data file.
 *
 * @param {Number} genId: an ID unique to the current data generation, used by all worker processes
 * @param {Number} numSegments: how many segments in a data file
 * @param {Number} numWorkers: how many worker processes to spawn, each worker creates a data file
 * @param {String} outFile: the data file name, to be postfixed with worker ID
 */
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