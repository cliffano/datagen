var _ = require('underscore'),
  bag = require('bagofholding'),
  fs = require('fs'),
  p = require('path'),
  datagen = require('./datagen');

/**
 * cli#exec
 * 
 * Execute datagen using header, segment, and footer files in the current directory.
 **/
function exec() {

  function _init() {
    new datagen().init(bag.cli.exit);
  }

  function _generate(args) {
    new datagen().generate(args.genId, args.numSegments, args.numWorkers, args.outFile, bag.cli.exit);
  }

  var commands = {
    init: {
      desc: 'Create example template files',
      action: _init
    },
    gen: {
      desc: 'Generate data file',
      options: [
        { arg: '-i, --gen-id <genId>', desc: 'An ID unique to the current data generation, used by all worker processes  | defaut: datagen process PID' },
        { arg: '-s, --num-segments <numSegments>', desc: 'How many segments in a data file | default: 1', action: parseInt },
        { arg: '-w, --num-workers <numWorkers>', desc: 'How many worker processes, each worker creates a data file | default: 1', action: parseInt },
        { arg: '-o, --out-file <outFile>', desc: 'Generated data file name, postfixed with worker ID | default: \'data\'' }
      ],
      action: _generate
    }
  };

  bag.cli.parse(commands, __dirname);
}

exports.exec = exec;