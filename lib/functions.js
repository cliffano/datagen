var dateFormat = require('dateformat'),
  faker = require('Faker'),
  Nonsense = require('Nonsense'),
  ns = new Nonsense();

/**
 * Template function to generate a random integer.
 *
 * @param {Number} min: minimum integer
 * @param {Number} max: maximum integer
 * @param {Function} cb: jazz cb(data) callback
 */
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

/**
 * Template function to generate a random float.
 *
 * @param {Number} min: minimum float
 * @param {Number} max: maximum float
 * @param {Function} cb: jazz cb(data) callback
 */
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

/**
 * Template function to generate a random date.
 *
 * @param {String} format: date format (felixge/node-dateformat)
 * @param {Number} min: minimum year
 * @param {Number} max: maximum year
 * @param {Function} cb: jazz cb(data) callback
 */
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

/**
 * Template function to select an item out of the arguments.
 * Last argument must be the callback.
 *
 * @param {Function} cb: jazz cb(data) callback
 */
function select() {
  // template: {select(arg1, arg2, ..., argN)}
  var args = Array.prototype.slice.call(arguments);
  args[args.length - 1](ns.pick(args.slice(0, args.length - 1)));
}

/**
 * Template function to generate random word(s) from Lorem Ipsum.
 *
 * @param {Number} num: how many random words to generate
 * @param {Function} cb: jazz cb(data) callback
 */
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

/**
 * Template function to generate a random first name.
 *
 * @param {Function} cb: jazz cb(data) callback
 */
function firstName(cb) {
  cb(ns.firstName());
}

/**
 * Template function to generate a random last name.
 *
 * @param {Function} cb: jazz cb(data) callback
 */
function lastName(cb) {
  cb(ns.lastName());
}

/**
 * Template function to generate a random email.
 *
 * @param {Function} cb: jazz cb(data) callback
 */
function email(cb) {
  cb(faker.Internet.email());
}

/**
 * Template function to generate a random phone.
 *
 * @param {String} format: phone number format, e.g. #### #### will generate 8 digit numbers separated with a space
 * @param {Function} cb: jazz cb(data) callback
 */
function phone(format, cb) {
  // template: {phone(format)}
  if (format && cb) {
  // template: {phone()}
  } else {
    cb = format;
    format = '#### ####';
  }
  // replace with faker.PhoneNumber.phoneNumberFormat(format) if Faker.js > 0.1.3 has been published
  function _phone() {
    var value = '';
    for (var i = 0, ln = format.length; i < ln; i += 1) {
      value += (format.charAt(i) === '#') ? Math.floor(Math.random() * 9) : format.charAt(i);
    }
    return value;
  }
  cb(_phone());
}

module.exports = {
  integer: integer,
  float: float,
  date: date,
  select: select,
  word: word,
  first_name: firstName,
  last_name: lastName,
  email: email,
  phone: phone
};