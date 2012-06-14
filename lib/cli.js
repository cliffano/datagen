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

  function _config() {
    new datagen().config(bag.cli.exit);
  }

  function _generate(args) {
    new datagen().gen(args.genId, args.numSegments, args.numWorkers, args.outFile, bag.cli.exit);
  }

  var commands = {
    config: {
      desc: 'Create sample configuration file',
      action: _config
    },
    gen: {
      desc: 'Generate data file',
      options: [
        { arg: '-i, --gen-id <genId>', desc: 'An ID unique to the current data generation, used by all worker processes  | defaut: datagen process PID' },
        { arg: '-s, --num-segments <numSegments>', desc: 'How many segments in a data file | default: 1' },
        { arg: '-w, --num-workers <numWorkers>', desc: 'How many worker processes, each worker creates a data file | default: 1' },
        { arg: '-o, --out-file <outFile>', desc: 'Generated data file name, postfixed with worker ID | default: \'data\'' }
      ],
      action: _generate
    }
  };

  bag.cli.parse(commands, __dirname);
}

exports.exec = exec;