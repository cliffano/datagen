var bag = require('bagofholding'),
  sandbox = require('sandboxed-module'),
  should = require('should'),
  checks, mocks,
  worker;

describe('worker', function () {

  function create(checks, mocks) {
    return sandbox.require('../lib/worker', {
      requires: mocks ? mocks.requires : {},
      globals: {}
    });
  }

  beforeEach(function () {
    checks = {};
    mocks = {};
  });

  describe('bar', function () {

    it('should worker when bar', function (done) {
    });
  });
});
 