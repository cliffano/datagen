var buster = require('buster'),
  childProcess = require('child_process'),
  DataGen = require('../lib/datagen'),
  fs = require('fs'),
  ncp = require('ncp');

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
    this.mockChildProcess = this.mock(childProcess);
    this.mockFs = this.mock(fs);
  },
  'should send default message properties when none is specified': function (done) {
    this.mockFs.expects('existsSync').once().withExactArgs('header').returns(true);
    this.mockFs.expects('existsSync').once().withExactArgs('segment').returns(true);
    this.mockFs.expects('existsSync').once().withExactArgs('footer').returns(true);
    this.mockFs.expects('readFileSync').once().withExactArgs('header').returns('header template');
    this.mockFs.expects('readFileSync').once().withExactArgs('segment').returns('segment template');
    this.mockFs.expects('readFileSync').once().withExactArgs('footer').returns('footer template');
    this.stub(process, 'pid', 12345);

    var mockWorker = {
      send: function (opts) {
        assert.equals(opts.workerId, 1);
        assert.equals(opts.templates.header, 'header template');
        assert.equals(opts.templates.segment, 'segment template');
        assert.equals(opts.templates.footer, 'footer template');
        assert.equals(opts.genId, '12345');
        assert.equals(opts.numSegments, 1);
        assert.equals(opts.outFile, 'data');
        done();
      }
    };
    this.mockChildProcess.expects('fork').once().returns(mockWorker);

    var datagen = new DataGen();
    datagen.generate();
  },
  'should send specified message properties when they are provided': function (done) {
    this.mockFs.expects('existsSync').once().withExactArgs('header').returns(true);
    this.mockFs.expects('existsSync').once().withExactArgs('segment').returns(true);
    this.mockFs.expects('existsSync').once().withExactArgs('footer').returns(true);
    this.mockFs.expects('readFileSync').once().withExactArgs('header').returns('header template');
    this.mockFs.expects('readFileSync').once().withExactArgs('segment').returns('segment template');
    this.mockFs.expects('readFileSync').once().withExactArgs('footer').returns('footer template');
    this.stub(process, 'pid', 12345);

    var mockWorker = {
      send: function (opts) {
        assert.isTrue(opts.workerId === 1 || opts.workerId === 2);
        assert.equals(opts.templates.header, 'header template');
        assert.equals(opts.templates.segment, 'segment template');
        assert.equals(opts.templates.footer, 'footer template');
        assert.equals(opts.genId, 'somegenid');
        assert.equals(opts.numSegments, 3);
        assert.equals(opts.outFile, 'someoutfile');
        if (opts.workerId === 2) {
          done();
        }
      }
    };
    this.mockChildProcess.expects('fork').twice().returns(mockWorker);

    var datagen = new DataGen();
    datagen.generate({ genId: 'somegenid', numSegments: 3, numWorkers: 2, outFile: 'someoutfile' });
  },
  'should default to empty string when any of the template file does not exist': function (done) {
    this.mockFs.expects('existsSync').once().withExactArgs('header').returns(false);
    this.mockFs.expects('existsSync').once().withExactArgs('segment').returns(false);
    this.mockFs.expects('existsSync').once().withExactArgs('footer').returns(false);  
    this.stub(process, 'pid', 12345);

    var mockWorker = {
      send: function (opts) {
        assert.equals(opts.templates.header, '');
        assert.equals(opts.templates.segment, '');
        assert.equals(opts.templates.footer, '');
        done();
      }
    };
    this.mockChildProcess.expects('fork').once().returns(mockWorker);

    var datagen = new DataGen();
    datagen.generate();
  }
});