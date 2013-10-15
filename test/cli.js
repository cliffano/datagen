var bag = require('bagofcli'),
  buster = require('buster-node'),
  cli = require('../lib/cli'),
  DataGen = new require('../lib/datagen'),
  referee = require('referee'),
  assert = referee.assert;

buster.testCase('cli - exec', {
  'should contain commands with actions': function (done) {
    var mockCommand = function (base, actions) {
      assert.defined(base);
      assert.defined(actions.commands.init.action);
      assert.defined(actions.commands.gen.action);
      done();
    };
    this.stub(bag, 'command', mockCommand);
    cli.exec();
  }
});

buster.testCase('cli - init', {
  setUp: function () {
    this.mockConsole = this.mock(console);
    this.mockProcess = this.mock(process);
    this.stub(bag, 'command', function (base, actions) {
      actions.commands.init.action();
    });
  },
  'should log template files creation and call DataGen init': function () {
    this.mockConsole.expects('log').once().withExactArgs('Creating example template files: header, segment, footer');
    this.mockProcess.expects('exit').once().withExactArgs(0);
    this.stub(DataGen.prototype, 'init', function (cb) {
      cb(null, []);
    });
    cli.exec();
  }
});

buster.testCase('cli - gen', {
  setUp: function () {
    this.mockProcess = this.mock(process);
  },
  'should call DataGen generate': function () {
    this.stub(bag, 'command', function (base, actions) {
      actions.commands.gen.action({ genId: 3, numSegments: 500, numWorkers: 8, maxConcurrentWorkers: 3, outFile: 'someoutfile' });
    });
    this.mockProcess.expects('exit').once().withExactArgs(0);
    this.stub(DataGen.prototype, 'generate', function (opts, cb) {
      assert.equals(opts.genId, 3);
      assert.equals(opts.numSegments, 500);
      assert.equals(opts.numWorkers, 8);
      assert.equals(opts.maxConcurrentWorkers, 3);
      assert.equals(opts.outFile, 'someoutfile');
      cb(null, []);
    });
    cli.exec();
  },
  'should handle no argument': function () {
    this.stub(bag, 'command', function (base, actions) {
      actions.commands.gen.action({});
    });
    this.mockProcess.expects('exit').once().withExactArgs(0);
    this.stub(DataGen.prototype, 'generate', function (opts, cb) {
      assert.equals(opts.genId, undefined);
      assert.equals(opts.numSegments, undefined);
      assert.equals(opts.numWorkers, undefined);
      assert.equals(opts.maxConcurrentWorkers, undefined);
      assert.equals(opts.outFile, undefined);
      cb(null, []);
    });
    cli.exec();
  }
});
