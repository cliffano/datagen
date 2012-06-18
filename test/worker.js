var bag = require('bagofholding'),
  sandbox = require('sandboxed-module'),
  should = require('should'),
  checks, mocks,
  worker;

describe('worker', function () {

  function create(checks, mocks) {
    return sandbox.require('../lib/worker', {
      requires: {
        fs: bag.mock.fs(checks, mocks)
      },
      globals: {
        console: bag.mock.console(checks, mocks),
        process: bag.mock.process(checks, mocks)
      }
    });
  }

  beforeEach(function () {
    checks = {};
    mocks = {};

    mocks.fs_createWriteStream = bag.mock.stream(checks, mocks);
  });

  describe('write', function () {

    beforeEach(function () {
      checks.worker_write__count = 0;
    });

    it('should log error message when an error event is emitted', function () {
      mocks.stream_on_error = [ new Error('someerror') ];
      worker = new (create(checks, mocks))(3);
      worker.write({
        header: 'header template',
        segment: 'segment template',
        footer: 'footer template'
      }, '12345', 1, 'somedatafile', function () {
        checks.worker_write__count++;
      });
      checks.worker_write__count.should.equal(0);
      checks.console_error_messages.length.should.equal(1);
      checks.console_error_messages[0].should.equal('Error: someerror');
    });

    it('should call callback when a close event is emitted', function () {
      mocks.stream_on_close = [];
      worker = new (create(checks, mocks))(3);
      worker.write({
        header: 'header template',
        segment: 'segment template',
        footer: 'footer template'
      }, '12345', 1, 'somedatafile', function () {
        checks.worker_write__count++;
      });
      checks.worker_write__count.should.equal(1);
    });

    it('should write header, segments, and footer to the stream when write is called', function () {
      worker = new (create(checks, mocks))(3);
      worker.write({
        header: 'header template',
        segment: 'segment template',
        footer: 'footer template'
      }, '12345', 2, 'somedatafile', function () {
        checks.worker_write__count++;
      });
      checks.worker_write__count.should.equal(0);
      checks.stream_write_strings.length.should.equal(3);
      checks.stream_write_strings[0].should.equal('header template');
      checks.stream_write_strings[1].should.equal('segment template');
      checks.stream_write_strings[2].should.equal('segment template');
      checks.stream_end_string.should.equal('footer template');
    });

    it('should apply params to template when write is called', function () {
      worker = new (create(checks, mocks))(333);
      worker.write({
        header: 'header template {worker_id}',
        segment: 'segment template {segment_id}',
        footer: 'footer template'
      }, '12345', 2, 'somedatafile', function () {
        checks.worker_write__count++;
      });
      checks.worker_write__count.should.equal(0);
      checks.stream_write_strings.length.should.equal(3);
      checks.stream_write_strings[0].should.equal('header template 333');
      checks.stream_write_strings[1].should.equal('segment template 1');
      checks.stream_write_strings[2].should.equal('segment template 2');
      checks.stream_end_string.should.equal('footer template');
    });
  });

  describe('onmessage', function () {

    beforeEach(function () {
      mocks.stream_on_close = [];
      mocks.process_on_message = [{
        workerId: '888',
        templates: {
          header: 'header template',
          segment: 'segment template',
          footer: 'footer template'
        },
        genId: '12345',
        numSegments: 3,
        outFile: 'somedatafile'
      }];
      sandbox.load('../lib/worker', {
        requires: {
          fs: bag.mock.fs(checks, mocks)
        },
        globals: {
          console: bag.mock.console(checks, mocks),
          process: bag.mock.process(checks, mocks)
        }
      });
    });

    it('should create a worker and call write', function () {
      checks.fs_createWriteStream_path.should.equal('somedatafile888');
      checks.fs_createWriteStream_opts.flags.should.equal('w');
      checks.fs_createWriteStream_opts.encoding.should.equal('utf-8');
    });

    it('should log start and finish messages', function () {
      checks.console_log_messages.length.should.equal(2);
      checks.console_log_messages[0].should.equal('Starting worker 888');
      checks.console_log_messages[1].should.equal('Finishing worker 888');
    });

    it('should write header, segments, and footer into stream', function () {
      checks.stream_write_strings.length.should.equal(4);
      checks.stream_write_strings[0].should.equal('header template');
      checks.stream_write_strings[1].should.equal('segment template');
      checks.stream_write_strings[2].should.equal('segment template');
      checks.stream_write_strings[3].should.equal('segment template');
      checks.stream_end__count.should.equal(1);
      checks.stream_end_string.should.equal('footer template');
    });
  });
});
 