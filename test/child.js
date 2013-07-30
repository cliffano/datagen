var buster = require('buster'),
  child = require('../lib/child'),
  Worker = require('../lib/worker');

buster.testCase('child - worker', {
  setUp: function () {
    this.mockConsole = this.mock(console);
  },
  'should log start finish messages and trigger worker write': function (done) {
    this.mockConsole.expects('log').once().withExactArgs('Starting worker 123');
    this.mockConsole.expects('log').once().withExactArgs('Finishing worker 123');
    this.stub(Worker.prototype, 'write', function (templates, genId, numSegments, outFile, cb) {
      assert.equals(templates.header, 'someheader');
      assert.equals(templates.segment, 'somesegment');
      assert.equals(templates.footer, 'somefooter');
      assert.equals(genId, 333);
      assert.equals(numSegments, 100000);
      assert.equals(outFile, 'someoutfile');
      cb();
    });
    var message = {
      workerId: 123,
      templates: { header: 'someheader', segment: 'somesegment', footer: 'somefooter' },
      genId: 333,
      numSegments: 100000,
      outFile: 'someoutfile'
    };
    child(message, done);
  }
});