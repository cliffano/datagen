var bag = require('bagofcli'),
  DataGen = require('./datagen');

function _init() {
  console.log('Creating example template files: header, segment, footer');
  new DataGen().init(bag.exit);
}

function _generate(args) {
  new DataGen().generate({
    genId: args.genId,
    numSegments: (args.numSegments) ? parseInt(args.numSegments, 10) : undefined,
    numWorkers: (args.numWorkers) ? parseInt(args.numWorkers, 10) : undefined,
    maxConcurrentWorkers: (args.maxConcurrentWorkers) ? parseInt(args.maxConcurrentWorkers, 10) : undefined,
    outFile: args.outFile
  }, bag.exit);
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

  bag.command(__dirname, actions);
}

exports.exec = exec;