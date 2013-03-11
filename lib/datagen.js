/*jshint esnext: true */
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
  ncp.ncp(p.join(__dirname, '../examples'), '.', cb);
};

/**
 * Spawn worker processes which will then generate the data file.
 *
 * @param {Object} opts: optionals:
 * - genId: an ID unique to the current data generation, used by all worker processes
 * - numSegments: how many segments in a data file
 * - numWorkers: how many worker processes to spawn, each worker creates a data file
 * - outFile: the data file name, to be postfixed with worker ID
 */
DataGen.prototype.generate = function (opts) {

  const SINGLE = 1;
  opts = opts || {};
  opts.numWorkers = opts.numWorkers || SINGLE;

  var templates = {};
  ['header', 'segment', 'footer'].forEach(function (file) {
    templates[file] = (fs.existsSync(file)) ? fs.readFileSync(file).toString() : '';
  });

  for (var i = 0; i < opts.numWorkers; i += 1) {
    var worker = childProcess.fork(p.join(__dirname, 'worker.js'));
    worker.send({
      workerId: i + 1,
      templates: templates,
      genId: opts.genId || process.pid.toString(),
      numSegments: opts.numSegments || SINGLE,
      outFile: opts.outFile || 'data'
    });
  }
};

module.exports = DataGen;