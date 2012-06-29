var _ = require('underscore'),
  bag = require('bagofholding'),
  sandbox = require('sandboxed-module'),
  should = require('should'),
  checks, mocks,
  functions;

describe('functions', function () {

  function create(checks, mocks) {
    return sandbox.require('../lib/functions', {
      requires: mocks ? mocks.requires : {},
      globals: {}
    });
  }

  beforeEach(function () {
    checks = {};
    mocks = {};
    functions = require('../lib/functions');
  });

  describe('integer', function () {

    it('should evaluate integer function when it has no argument', function (done) {
      functions.integer(function (data) {
        checks.data = data;
        done();
      });
      (_.isNaN(checks.data)).should.equal(false);
      checks.data.should.not.match(/.+\..+/);
    });

    it('should evaluate ranged integer function when it has min max arguments', function (done) {
      functions.integer(100, 200, function (data) {
        checks.data = data;
        done();
      });
      (_.isNaN(checks.data)).should.equal(false);
      checks.data.should.not.match(/.+\..+/);
      checks.data.should.be.within(100, 200);
    });

    it('should evaluate identical integer function when it has identical min max arguments', function (done) {
      functions.integer(100, 100, function (data) {
        checks.data = data;
        done();
      });
      (_.isNaN(checks.data)).should.equal(false);
      checks.data.should.not.match(/.+\..+/);
      checks.data.should.equal(100);
    });
  });

  describe('float', function () {

    it('should evaluate float function when it has no argument', function (done) {
      functions.float(function (data) {
        checks.data = data;
        done();
      });
      (_.isNaN(checks.data)).should.equal(false);
      checks.data.should.match(/.+\..+/);
    });

    it('should evaluate ranged float function when it has min max arguments', function (done) {
      functions.float(100.0, 200.0, function (data) {
        checks.data = data;
        done();
      });
      (_.isNaN(checks.data)).should.equal(false);
      checks.data.should.match(/.+\..+/);
      checks.data.should.be.within(100.0, 200.0);
    });

    it('should evaluate identical float function when it has identical min max arguments', function (done) {
      functions.float(567.89, 567.89, function (data) {
        checks.data = data;
        done();
      });
      checks.data.should.match(/.+\..+/);
      checks.data.should.equal(567.89);
    });
  });

  describe('date', function () {

    it('should evaluate date function with ISO format when it has no argument', function (done) {
      functions.date(function (data) {
        checks.data = data;
        done();
      });
      checks.data.should.match(/[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}:[0-9]{2}/);
    });

    it('should evaluate date function with custom format when it has format argument', function (done) {
      functions.date('yyyy/mm/dd', function (data) {
        checks.data = data;
        done();
      });
      checks.data.should.match(/[0-9]{4}\/[0-9]{2}\/[0-9]{2}/);
    });

    it('should evaluate date function with default format and ranged date when it has min max arguments and no format argument', function (done) {
      functions.date(1998, 2000, function (data) {
        checks.data = data;
        done();
      });
      checks.data.should.match(/[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}:[0-9]{2}/);
      parseInt(checks.data.match(/^[0-9]{4}/), 10).should.be.within(1998, 1999);
    });

    it('should evaluate date function with custom format and ranged date when it has min max format arguments', function (done) {
      functions.date('yyyy/mm/dd', 1998, 2000, function (data) {
        checks.data = data;
        done();
      });
      checks.data.should.match(/[0-9]{4}\/[0-9]{2}\/[0-9]{2}/);
      parseInt(checks.data.match(/^[0-9]{4}/), 10).should.be.within(1998, 1999);
    });
  });

  describe('select', function () {

    it('should evaluate select function when it has arguments', function (done) {
      functions.select('aaa', 'bbb', 'ccc', function (data) {
        checks.data = data;
        done();
      });
      ['aaa','bbb','ccc'].indexOf(checks.data).should.be.within(0, 2);
    });

    it('should evaluate identical select function when it has only 1 argument', function (done) {
      functions.select('aaa', function (data) {
        checks.data = data;
        done();
      });
      ['aaa'].indexOf(checks.data).should.equal(0);
    });

    it('should evaluate to empty when select function has no argument', function (done) {
      functions.select(function (data) {
        checks.data = data;
        done();
      });
      ['aaa','bbb','ccc'].indexOf(checks.data).should.equal(-1);
    });
  });

  describe('word', function () {

    it('should evaluate a single word when word function has no argument', function (done) {
      functions.word(function (data) {
        checks.data = data;
        done();
      });
      (_.isString(checks.data)).should.equal(true);
      checks.data.should.match(/[a-zA-Z]+/);
    });

    it('should evaluate multiple words when word function has an argument', function (done) {
      functions.word(5, function (data) {
        checks.data = data;
        done();
      });
      function _check(word) {
        (_.isString(word)).should.equal(true);
        word.should.match(/[a-zA-Z]+/);
      }
      var words = checks.data.split(' ');
      words.length.should.equal(5);
      words.forEach(_check);
    });
  });

  describe('firstName', function () {

    it('should evaluate first name function', function (done) {
      functions.first_name(function (data) {
        checks.data = data;
        done();
      });
      (_.isString(checks.data)).should.equal(true);
      (checks.data.match(/[a-zA-Z]+/) !== null).should.equal(true);
    });
  });

  describe('lastName', function () {

    it('should evaluate last name function', function (done) {
      functions.last_name(function (data) {
        checks.data = data;
        done();
      });
      (_.isString(checks.data)).should.equal(true);
      checks.data.should.match(/[a-zA-Z]+/);
    });
  });

  describe('email', function () {

    it('should evaluate email function', function (done) {
      functions.email(function (data) {
        checks.data = data;
        done();
      });
      (_.isString(checks.data)).should.equal(true);
      checks.data.should.match(/[a-zA-Z]+/);
    });
  });

  describe('phone', function () {

    it('should evaluate phone function with default format when format is not specified', function (done) {
      functions.phone(function (data) {
        checks.data = data;
        done();
      });
      (_.isString(checks.data)).should.equal(true);
      checks.data.should.match(/[0-9]{4} [0-9]{4}/);
    });

    it('should evaluate phone function with custom format when format is specified', function (done) {
      functions.phone('(###) ########', function (data) {
        checks.data = data;
        done();
      });
      (_.isString(checks.data)).should.equal(true);
      checks.data.should.match(/\([0-9]{3}\) [0-9]{8}/);
    });
  });
});
 