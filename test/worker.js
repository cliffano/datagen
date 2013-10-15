var buster = require('buster-node'),
  fs = require('fs'),
  referee = require('referee'),
  Worker = require('../lib/worker'),
  assert = referee.assert;

buster.testCase('worker - write', {
  setUp: function () {
    this.mockConsole = this.mock(console);
    this.mockFs = this.mock(fs);
  },
  'should log error message when an error event is emitted': function () {
    var mockStream = {
      on: function (event, cb) {
        if (event === 'error') {
          cb(new Error('some error'));
        }
      }
    };
    this.mockFs.expects('createWriteStream').withExactArgs('someoutfile123', { flags: 'w', encoding: 'utf-8' }).returns(mockStream);
    this.mockConsole.expects('error').withExactArgs('Error: %s', 'some error');
    worker = new Worker(123);
    worker.write({
        header: 'header template',
        segment: 'segment template',
        footer: 'footer template'
      },
      '12345', 1, 'someoutfile');
  },
  'should call callback when a close event is emitted': function (done) {
    var mockStream = {
      on: function (event, cb) {
        if (event === 'close') {
          cb();
        }
      }
    };
    this.mockFs.expects('createWriteStream').withExactArgs('someoutfile123', { flags: 'w', encoding: 'utf-8' }).returns(mockStream);
    worker = new Worker(123);
    worker.write({
        header: 'header template',
        segment: 'segment template',
        footer: 'footer template'
      },
      '12345', 1, 'someoutfile',
      done);
  },
  'should write header, segments, and footer to the stream when write is called': function (done) {
    var writeData = [];
    var mockStream = {
      on: function (event, cb) {
        if (event === 'open') {
          cb();
        }
      },
      write: function (data) {
        writeData.push(data);
        return true;
      },
      end: function (data) {
        assert.equals(data, 'footer template');
        
        assert.equals(writeData, [
          'header template',
          'segment template',
          'segment template'
        ]);

        done();
      }
    };
    this.mockFs.expects('createWriteStream').withExactArgs('someoutfile123', { flags: 'w', encoding: 'utf-8' }).returns(mockStream);
    worker = new Worker(123);
    worker.write({
        header: 'header template',
        segment: 'segment template',
        footer: 'footer template'
      },
      '12345', 2, 'someoutfile');
  },
  'should apply params to template when write is called': function (done) {
    var writeData = [],
      writeCount = 0;
    var mockStream = {
      on: function (event, cb) {
        if (event === 'open' || event === 'drain') {
          cb();
        }
      },
      write: function (data) {
        writeData.push(data);
        // first write is header as part of open event, return false but unused
        // second write is first segment as part of open event, return false and not trigger subsequent write
        // third write is second segment as part of drain event, return true to trigger next write which ends the stream
        return (++writeCount === 2);
      },
      end: function (data) {
        assert.equals(data, 'footer template');
        
        assert.equals(writeData, [
          'header template 123',
          'segment template 1',
          'segment template 2'
        ]);

        done();
      }
    };
    this.mockFs.expects('createWriteStream').withExactArgs('someoutfile123', { flags: 'w', encoding: 'utf-8' }).returns(mockStream);
    worker = new Worker(123);
    worker.write({
        header: 'header template {worker_id}',
        segment: 'segment template {segment_id}',
        footer: 'footer template'
      },
      '12345', 2, 'someoutfile');
  }
});
