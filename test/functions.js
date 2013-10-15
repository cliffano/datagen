var _ = require('lodash'),
  buster = require('buster-node'),
  functions = require('../lib/functions'),
  referee = require('referee'),
  assert = referee.assert;

buster.testCase('functions - integer', {
  'should evaluate integer function when it has no argument': function (done) {
    functions.integer(function (data) {
      assert.isNumber(data);
      assert.isTrue(!data.toString().match(/.+\..+/));
      done();
    });
  },
  'should evaluate ranged integer function when it has min max arguments': function (done) {
    functions.integer(100, 200, function (data) {
      assert.isNumber(data);
      assert.isTrue(!data.toString().match(/.+\..+/));
      assert.isTrue(data >= 100);
      assert.isTrue(data <= 200);
      done();
    });
  },
  'should evaluate identical integer function when it has identical min max arguments': function (done) {
    functions.integer(100, 100, function (data) {
      assert.isNumber(data);
      assert.isTrue(!data.toString().match(/.+\..+/));
      assert.equals(data, 100);
      done();
    });
  }
});

buster.testCase('functions - float', {
  'should evaluate float function when it has no argument': function (done) {
    functions.float(function (data) {
      assert.isNumber(data);
      assert.isTrue(data.toString().match(/.+\..+/).length > 0);
      done();
    });
  },
  'should evaluate ranged float function when it has min max arguments': function (done) {
    functions.float(100.0, 200.0, function (data) {
      assert.isNumber(data);
      assert.isTrue(data.toString().match(/.+\..+/).length > 0);
      assert.isTrue(data >= 100.0);
      assert.isTrue(data <= 200.0);
      done();
    });
  },
  'should evaluate identical float function when it has identical min max arguments': function (done) {
    functions.float(567.89, 567.89, function (data) {
      assert.isNumber(data);
      assert.isTrue(data.toString().match(/.+\..+/).length > 0);
      assert.equals(data, 567.89);
      done();
    });
  }
});

buster.testCase('functions - date', {
  'should evaluate date function with ISO format when it has no argument': function (done) {
    functions.date(function (data) {
      assert.isTrue(data.match(/[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}:[0-9]{2}/).length > 0);
      done();
    });
  },
  'should evaluate date function with custom format when it has format argument': function (done) {
    functions.date('yyyy/mm/dd', function (data) {
      assert.isTrue(data.match(/[0-9]{4}\/[0-9]{2}\/[0-9]{2}/).length > 0);
      done();
    });
  },
  'should evaluate date function with default format and ranged date when it has min max arguments and no format argument': function (done) {
    functions.date(1998, 2000, function (data) {
      assert.isTrue(data.match(/[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}:[0-9]{2}/).length > 0);
      var year = parseInt(data.match(/^[0-9]{4}/), 10);
      assert.isTrue(year >= 1998 && year <= 1999);
      done();
    });
  },
  'should evaluate date function with custom format and ranged date when it has min max format arguments': function (done) {
    functions.date('yyyy/mm/dd', 1998, 2000, function (data) {
      assert.isTrue(data.match(/[0-9]{4}\/[0-9]{2}\/[0-9]{2}/).length > 0);
      var year = parseInt(data.match(/^[0-9]{4}/), 10);
      assert.isTrue(year >= 1998 && year <= 1999);
      done();
    });
  }
});

buster.testCase('functions - select', {
  'should evaluate select function when it has arguments': function (done) {
    functions.select('aaa', 'bbb', 'ccc', function (data) {
      var pos = ['aaa','bbb','ccc'].indexOf(data);
      assert.isTrue(pos >= 0 && pos <= 2);
      done();
    });
  },
  'should evaluate identical select function when it has only 1 argument': function (done) {
    functions.select('aaa', function (data) {
      var pos = ['aaa'].indexOf(data);
      assert.equals(pos, 0);
      done();
    });
  },
  'should evaluate to empty when select function has no argument': function (done) {
    functions.select(function (data) {
      var pos = ['aaa','bbb','ccc'].indexOf(data);
      assert.equals(pos, -1);
      done();
    });
  }
});

buster.testCase('functions - word', {
  'should evaluate a single word when word function has no argument': function (done) {
    functions.word(function (data) {
      assert.isString(data);
      assert.isTrue(data.match(/[a-zA-Z]+/).length > 0);
      done();
    });
  },
  'should evaluate multiple words when word function has an argument': function (done) {
    functions.word(5, function (data) {
      var words = data.split(' ');
      assert.equals(words.length, 5);
      words.forEach(function (word) {
        assert.isString(word);
        assert.isTrue(word.match(/[a-zA-Z]+/).length > 0);
      });
      done();
    });    
  }
});

buster.testCase('functions - firstName', {

  'should evaluate first name function': function (done) {
    functions.first_name(function (data) {
      assert.isString(data);
      assert.isTrue(data.toString().match(/[a-zA-Z]+/).length > 0);
      done();
    });
  }
});

buster.testCase('functions - lastName', {
  'should evaluate last name function': function (done) {
    functions.last_name(function (data) {
      assert.isString(data);
      assert.isTrue(data.toString().match(/[a-zA-Z]+/).length > 0);
      done();
    });
  }
});

buster.testCase('functions - email', {
  'should evaluate email function': function (done) {
    functions.email(function (data) {
      assert.isString(data);
      assert.isTrue(data.toString().match(/[a-zA-Z]+/).length > 0);
      done();
    });
  }
});

buster.testCase('functions - phone', {
  'should evaluate phone function with default format when format is not specified': function (done) {
    functions.phone(function (data) {
      assert.isString(data);
      assert.isTrue(data.toString().match(/[0-9]{4} [0-9]{4}/).length > 0);
      done();
    });
  },
  'should evaluate phone function with custom format when format is specified': function (done) {
    functions.phone('(###) ########', function (data) {
      assert.isString(data);
      assert.isTrue(data.toString().match(/\([0-9]{3}\) [0-9]{8}/).length > 0);
      done();
    });
  }
});
