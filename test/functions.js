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
      parseInt(checks.data, 10).should.be.within(100, 200);
    });

    it('should evaluate identical integer function when it has identical min max arguments', function (done) {
      functions.integer(100, 100, function (data) {
        checks.data = data;
        done();
      });
      (_.isNaN(checks.data)).should.equal(false);
      checks.data.should.not.match(/.+\..+/);
      parseInt(checks.data, 10).should.equal(100);
    });
  });

  describe('float', function () {
  });

  describe('date', function () {
  });

  describe('select', function () {
  });

  describe('word', function () {
  });

  describe('firstName', function () {
  });

  describe('lastName', function () {
  });
});
 