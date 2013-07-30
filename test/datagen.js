var buster = require('buster'),
  DataGen = require('../lib/datagen'),
  fs = require('fs'),
  ncp = require('ncp'),
  workerFarm = require('worker-farm');

buster.testCase('datagen - init', {
  'should delegate to ncp ncp when initialising the project': function (done) {
    this.stub(ncp, 'ncp', function (source, dest, cb) {
      assert.isTrue(source.match(/.+\/datagen\/examples$/).length === 1);
      assert.equals(dest, '.');
      cb();
    });
    var datagen = new DataGen();
    datagen.init(function (err, result) {
      done();
    });
  }
});

buster.testCase('datagen - generate', {
  setUp: function () {
    this.mockFs = this.mock(fs);
    this.stub(process, 'pid', 12345);
  },
  'should send default message properties when none is specified': function (done) {
    this.mockFs.expects('existsSync').once().withExactArgs('header').returns(true);
    this.mockFs.expects('existsSync').once().withExactArgs('segment').returns(true);
    this.mockFs.expects('existsSync').once().withExactArgs('footer').returns(true);
    this.mockFs.expects('readFileSync').once().withExactArgs('header').returns('header template');
    this.mockFs.expects('readFileSync').once().withExactArgs('segment').returns('segment template');
    this.mockFs.expects('readFileSync').once().withExactArgs('footer').returns('footer template');

    var mockWorker = function (message, cb) {
      assert.equals(message.workerId, 1);
      assert.equals(message.templates.header, 'header template');
      assert.equals(message.templates.segment, 'segment template');
      assert.equals(message.templates.footer, 'footer template');
      assert.equals(message.genId, '12345');
      assert.equals(message.numSegments, 1);
      assert.equals(message.outFile, 'data');
      cb();
    };
    var mockWorkerFarm = function (opts, child) {
      assert.equals(opts, {});
      return mockWorker;
    };
    mockWorkerFarm.end = function (worker) {
      assert.isTrue(worker !== undefined);
      done();
    };
    var datagen = new DataGen();
    datagen.generate({ workerFarm: mockWorkerFarm });
  },
  'should send specified message properties when they are provided': function (done) {
    this.mockFs.expects('existsSync').once().withExactArgs('header').returns(true);
    this.mockFs.expects('existsSync').once().withExactArgs('segment').returns(true);
    this.mockFs.expects('existsSync').once().withExactArgs('footer').returns(true);
    this.mockFs.expects('readFileSync').once().withExactArgs('header').returns('header template');
    this.mockFs.expects('readFileSync').once().withExactArgs('segment').returns('segment template');
    this.mockFs.expects('readFileSync').once().withExactArgs('footer').returns('footer template');

    var mockWorker = function (message, cb) {
      assert.isTrue(message.workerId <= 2);
      assert.equals(message.templates.header, 'header template');
      assert.equals(message.templates.segment, 'segment template');
      assert.equals(message.templates.footer, 'footer template');
      assert.equals(message.genId, 'somegenid');
      assert.equals(message.numSegments, 3);
      assert.equals(message.outFile, 'someoutfile');
      cb();
    };
    var mockWorkerFarm = function (opts, child) {
      assert.equals(opts.maxConcurrentWorkers, 123);
      return mockWorker;
    };
    var endCount = 0;
    mockWorkerFarm.end = function (worker) {
      endCount++;
      assert.isTrue(worker !== undefined);
      if (endCount === 2) {
        done();
      }
    };
    var datagen = new DataGen();
    datagen.generate({ workerFarm: mockWorkerFarm, maxWorkers: 123, genId: 'somegenid', numSegments: 3, numWorkers: 2, outFile: 'someoutfile' });
  },
  'should default to empty string when any of the template file does not exist': function (done) {
    this.mockFs.expects('existsSync').once().withExactArgs('header').returns(false);
    this.mockFs.expects('existsSync').once().withExactArgs('segment').returns(false);
    this.mockFs.expects('existsSync').once().withExactArgs('footer').returns(false);  

    var mockWorker = function (message, cb) {
      assert.isTrue(message.workerId <= 2);
      assert.equals(message.templates.header, '');
      assert.equals(message.templates.segment, '');
      assert.equals(message.templates.footer, '');
      assert.equals(message.genId, 'somegenid');
      assert.equals(message.numSegments, 3);
      assert.equals(message.outFile, 'someoutfile');
      cb();
    };
    var mockWorkerFarm = function (opts, child) {
      assert.equals(opts, {});
      return mockWorker;
    };
    var endCount = 0;
    mockWorkerFarm.end = function (worker) {
      endCount++;
      assert.isTrue(worker !== undefined);
      if (endCount === 2) {
        done();
      }
    };
    var datagen = new DataGen();
    datagen.generate({ workerFarm: mockWorkerFarm, genId: 'somegenid', numSegments: 3, numWorkers: 2, outFile: 'someoutfile' });
  }
});