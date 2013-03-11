var bag = require('bagofholding'),
  DataGen = require('./datagen');

function _init() {
  console.log('Creating example template files: header, segment, footer');
  new DataGen().init(bag.cli.exit);
}

function _generate(args) {
  new DataGen().generate({
    genId: args.genId,
    numSegments: (args.numSegments) ? parseInt(args.numSegments, 10) : undefined,
    numWorkers: (args.numWorkers) ? parseInt(args.numWorkers, 10) : undefined,
    outFile: args.outFile
  }, bag.cli.exit);
}

/**
 * Execute DataGen CLI.
 */
function exec() {

  var actions = {
    commands: {
      init: { action: _init },
      gen: { action: _generate }
    }
  };

  bag.cli.command(__dirname, actions);
}

exports.exec = exec;