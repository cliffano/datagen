var bag = require('bagofholding'),
  DataGen = require('./datagen');

function _init() {
  new DataGen().init(bag.cli.exit);
}

function _generate(args) {
  new DataGen().generate(args.genId, parseInt(args.numSegments, 10), parseInt(args.numWorkers, 10), args.outFile, bag.cli.exit);
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