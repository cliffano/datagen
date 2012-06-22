var bag = require('bagofholding'),
  dateFormat = require('dateformat'),
  fs = require('fs'),
  nonsense = require('Nonsense');

/**
 * class Worker
 * - workerId (Number): an ID unique to this worker
 **/
function Worker(workerId) {
  this.workerId = workerId;
}

/** internal
 * Worker#_templateFunctions -> Object
 *
 * Template functions to be used in template evaluation as parameters.
 **/
Worker.prototype._templateFunctions = function () {

  var ns = new nonsense();

  function integer(min, max, cb) {
    var value;
    // template: {integer(min, max)}
    if (min && max && cb) {
      value = ns.integerInRange(min, max);
    // template: {integer()}
    } else {
      cb = min;
      value = ns.integer();
    }
    cb(value);
  }
  function float(min, max, cb) {
    var value;
    // template: {float(min, max)}
    if (min && max && cb) {
      value = ns.realInRange(min, max);
    // template: {float()}
    } else {
      cb = min;
      value = ns.real();
    }
    cb(value);
  }
  function date(format, min, max, cb) {

    function _timestamp(year) {
      return new Date(year, 0, 1).getTime();
    }

    var value;
    // template: {date(format, min, max)}
    if (format && min && max && cb) {
      value = ns.timestamp(_timestamp(min), _timestamp(max));
    // template: {date(min, max)}
    } else if (format && min && max) {
      cb = max;
      value = ns.timestamp(_timestamp(format), _timestamp(min));
      format = 'isoDateTime';
    // template: {date(format)}
    } else if (format && min) {
      cb = min;
      value = ns.timestamp(_timestamp(1970), _timestamp(2020));
    // template: {date()}
    } else {
      cb = format;
      format = 'isoDateTime';
      value = ns.timestamp(_timestamp(1970), _timestamp(2020));
    }
    cb(dateFormat(new Date(value), format));
  }
  // template: {select(arg1, arg2, ..., argN)}
  function select() {
    var args = Array.prototype.slice.call(arguments);
    args[args.length - 1](ns.pick(args.slice(0, args.length - 1)));
  }
  function word(num, cb) {
    var value;
    // template: {word(num)}
    if (num && cb) {
      value = ns.words(num);
    // template: {word()}
    } else {
      cb = num;
      value = ns.word();
    }
    cb(value);
  }
  function firstName(cb) {
    cb(ns.firstName());
  }
  function lastName(cb) {
    cb(ns.lastName());
  }

  return {
    integer: integer,
    float: float,
    date: date,
    select: select,
    word: word,
    first_name: firstName,
    last_name: lastName
  };

};

/**
 * Worker#write(templates, genId, numSegments, outFile, cb)
 * - templates (Object): data file templates in the format of { header: '', segment: '', footer: '' }
 * - genId (Number): an ID unique to the current data generation, used by all worker processes
 * - numSegments (Number): how many segments in a data file
 * - outFile (String): the data file name, to be postfixed with worker ID
 * - cb (Function): standard cb(err, result) callback
 *
 * Write a data file consisting of header, segment x numSegments, and footer templates.
 * File is being streamed so it can handle large content.
 * Thanks to Max Ogden's fs stream backpressure example https://gist.github.com/2516455
 **/
Worker.prototype.write = function (templates, genId, numSegments, outFile, cb) {

  var stream = fs.createWriteStream(outFile + this.workerId, { flags: 'w', encoding: 'utf-8' }),
    segmentId = 0,
    segmentTemplate = bag.text.compile(templates.segment),
    params = this._templateFunctions(),
    status;

  params.gen_id = genId;
  params.worker_id = this.workerId;

  function write() {
    if (segmentId === numSegments) {
      stream.end(bag.text.apply(templates.footer, params));
    } else {
      if (segmentId === 0) {
        stream.write(bag.text.apply(templates.header, params));
      }
      params.segment_id = ++segmentId;
      status = stream.write(bag.text.applyPrecompiled(segmentTemplate, params));
      if(status) {
        write();
      }
    }
  }

  stream.on('error', function (err) {
    console.error('Error: %s', err.message);
  });
  stream.on('close', function () {
    cb();
  });
  stream.on('open', write);
  stream.on('drain', write);
};

module.exports = Worker;

/**
 * process#on(message, cb)
 * - message (Object): message object from the master process
 * - cb (Function): callback function
 *
 * Create a worker and tell it to write a data file.
 **/
process.on('message', function (message) {
  console.log('Starting worker ' + message.workerId);
  new Worker(message.workerId).write(
    message.templates,
    message.genId,
    message.numSegments,
    message.outFile,
    function () {
      console.log('Finishing worker ' + message.workerId);
      process.exit(1);
    }
  );
});