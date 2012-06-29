var _ = require('underscore'),
  bag = require('bagofholding'),
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

  describe('_templateFunctions', function () {

    function _write(template) {
      mocks.stream_write_status = true;
      mocks.stream_on_open = [];
      worker = new (create(checks, mocks))(333);
      worker.write({
        header: template,
        segment: template,
        footer: template
      }, '12345', 100, 'somedatafile', function () {
        checks.worker_write__count++;
      });

      checks.strings = checks.stream_write_strings.concat(checks.stream_end_string);
      checks.strings.length.should.be.above(0);
    }

    it('should evaluate integer function when it has no argument', function () {
      _write('{integer()}');
      for (var i = 0, ln = checks.strings.length; i < ln; i += 1) {
        (_.isNaN(checks.strings[i])).should.equal(false);
        checks.strings[i].should.not.match(/.+\..+/);
      }
    });

    it('should evaluate ranged integer function when it has min max arguments', function () {
      _write('{integer(100, 200)}');
      for (var i = 0, ln = checks.strings.length; i < ln; i += 1) {
        (_.isNaN(checks.strings[i])).should.equal(false);
        checks.strings[i].should.not.match(/.+\..+/);
        parseInt(checks.strings[i], 10).should.be.within(100, 200);
      }
    });

    it('should evaluate identical integer function when it has identical min max arguments', function () {
      _write('{integer(100, 100)}');
      for (var i = 0, ln = checks.strings.length; i < ln; i += 1) {
        (_.isNaN(checks.strings[i])).should.equal(false);
        checks.strings[i].should.not.match(/.+\..+/);
        parseInt(checks.strings[i], 10).should.equal(100);
      }
    });

    it('should evaluate float function when it has no argument', function () {
      _write('{float()}');
      for (var i = 0, ln = checks.strings.length; i < ln; i += 1) {
        (_.isNaN(checks.strings[i])).should.equal(false);
        checks.strings[i].should.match(/.+\..+/);
      }
    });

    it('should evaluate ranged float function when it has min max arguments', function () {
      _write('{float(100.0, 200.0)}');
      for (var i = 0, ln = checks.strings.length; i < ln; i += 1) {
        (_.isNaN(checks.strings[i])).should.equal(false);
        checks.strings[i].should.match(/.+\..+/);
        parseFloat(checks.strings[i], 10).should.be.within(100.0, 200.0);
      }
    });

    it('should evaluate identical float function when it has identical min max arguments', function () {
      _write('{float(567.89, 567.89)}');
      for (var i = 0, ln = checks.strings.length; i < ln; i += 1) {
        checks.strings[i].should.match(/.+\..+/);
        (checks.strings[i].match(/.+\..+/) !== null).should.equal(true);
        parseFloat(checks.strings[i]).should.equal(567.89);
      }
    });

    it('should evaluate date function with ISO format when it has no argument', function () {
      _write('{date()}');
      for (var i = 0, ln = checks.strings.length; i < ln; i += 1) {
        checks.strings[i].should.match(/[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}:[0-9]{2}/);
      }
    });

    it('should evaluate date function with custom format when it has format argument', function () {
      _write('{date(\'yyyy/mm/dd\')}');
      for (var i = 0, ln = checks.strings.length; i < ln; i += 1) {
        checks.strings[i].should.match(/[0-9]{4}\/[0-9]{2}\/[0-9]{2}/);
      }
    });

    it('should evaluate date function with default format and ranged date when it has min max arguments and no format argument', function () {
      _write('{date(1998, 2000)}');
      for (var i = 0, ln = checks.strings.length; i < ln; i += 1) {
        checks.strings[i].should.match(/[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}:[0-9]{2}/);
        parseInt(checks.strings[i].match(/^[0-9]{4}/), 10).should.be.within(1998, 1999);
      }
    });

    it('should evaluate date function with custom format and ranged date when it has min max format arguments', function () {
      _write('{date(\'yyyy/mm/dd\', 1998, 2000)}');
      for (var i = 0, ln = checks.strings.length; i < ln; i += 1) {
        checks.strings[i].should.match(/[0-9]{4}\/[0-9]{2}\/[0-9]{2}/);
        parseInt(checks.strings[i].match(/^[0-9]{4}/), 10).should.be.within(1998, 1999);
      }
    });

    it('should evaluate select function when it has arguments', function () {
      _write('{select(\'aaa\',\'bbb\',\'ccc\')}');
      for (var i = 0, ln = checks.strings.length; i < ln; i += 1) {
        ['aaa','bbb','ccc'].indexOf(checks.strings[i]).should.be.within(0, 2);
      }
    });

    it('should evaluate identical select function when it has only 1 argument', function () {
      _write('{select(\'aaa\')}');
      for (var i = 0, ln = checks.strings.length; i < ln; i += 1) {
        ['aaa'].indexOf(checks.strings[i]).should.equal(0);
      }
    });

    it('should evaluate to empty when select function has no argument', function () {
      _write('{select()}');
      for (var i = 0, ln = checks.strings.length; i < ln; i += 1) {
        ['aaa','bbb','ccc'].indexOf(checks.strings[i]).should.equal(-1);
      }
    });

    it('should evaluate a single word when word function has no argument', function () {
      _write('{word()}');
      for (var i = 0, ln = checks.strings.length; i < ln; i += 1) {
        (_.isString(checks.strings[i])).should.equal(true);
        (checks.strings[i].match(/[a-zA-Z]+/) !== null).should.equal(true);
      }
    });

    it('should evaluate multiple words when word function has an argument', function () {
      _write('{word(5)}');
      function _check(word) {
        (_.isString(word)).should.equal(true);
        (word.match(/[a-zA-Z]+/) !== null).should.equal(true);
      }
      for (var i = 0, ln = checks.strings.length; i < ln; i += 1) {
        var words = checks.strings[i].split(' ');
        words.length.should.equal(5);
        words.forEach(_check);
      }
    });

    it('should evaluate first name function', function () {
      _write('{first_name()}');
      for (var i = 0, ln = checks.strings.length; i < ln; i += 1) {
        (_.isString(checks.strings[i])).should.equal(true);
        (checks.strings[i].match(/[a-zA-Z]+/) !== null).should.equal(true);
      }
    });

    it('should evaluate last name function', function () {
      _write('{last_name()}');
      for (var i = 0, ln = checks.strings.length; i < ln; i += 1) {
        (_.isString(checks.strings[i])).should.equal(true);
        (checks.strings[i].match(/[a-zA-Z]+/) !== null).should.equal(true);
      }
    });
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
      mocks.stream_write_status = true;
      mocks.stream_on_open = [];
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
      mocks.stream_write_status = true;
      mocks.stream_on_open = [];
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

    it('should evaluate function in template when it contains functions', function () {
      mocks.stream_write_status = true;
      mocks.stream_on_open = [];
      worker = new (create(checks, mocks))(333);
      worker.write({
        header: '{first_name()} {last_name()}{email()}{phone()}{phone(\'#######\')}',
        segment: '{integer()}{integer(10, 20)}{float()}{float(10.0, 20.0)}{date()}{date(\'yyyy-mm-dd\')}{select()}{select(\'foo\', \'bar\')}',
        footer: '{word()} {word(10)}'
      }, '12345', 2, 'somedatafile', function () {
        checks.worker_write__count++;
      });
      checks.worker_write__count.should.equal(0);
      checks.stream_write_strings.length.should.equal(3);
      checks.stream_write_strings.forEach(function (string) {
        (_.isEmpty(string)).should.equal(false);
      });
      (_.isEmpty(checks.stream_end_string)).should.equal(false);
    });

  });

  describe('onmessage', function () {

    beforeEach(function () {
      mocks.stream_write_status = true;
      mocks.stream_on_open = [];
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
 
