var dateFormat = require('dateformat'),
  faker = require('Faker'),
  nonsense = require('Nonsense'),
  ns = new nonsense();

/**
 * functions#integer 
 * - min (Number): minimum integer
 * - max (Number): maximum integer
 * - cb (Function): jazz cb(data) callback
 *
 * Template function to generate a random integer.
 **/
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
 * functions#float 
 * - min (Number): minimum float
 * - max (Number): maximum float
 * - cb (Function): jazz cb(data) callback
 *
 * Template function to generate a random float.
 **/
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
 * functions#date
 * - format (String): date format (felixge/node-dateformat)
 * - min (Number): minimum year
 * - max (Number): maximum year
 * - cb (Function): jazz cb(data) callback
 *
 * Template function to generate a random date.
 **/
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
 * functions#select
 * - cb (Function): jazz cb(data) callback
 *
 * Template function to select an item out of the arguments.
 * Last argument must be the callback.
 **/
function select() {
  // template: {select(arg1, arg2, ..., argN)}
  var args = Array.prototype.slice.call(arguments);
  args[args.length - 1](ns.pick(args.slice(0, args.length - 1)));
}

/**
 * functions#word
 * - num (Number): how many random words to generate
 * - cb (Function): jazz cb(data) callback
 *
 * Template function to generate random word(s) from Lorem Ipsum.
 **/
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
 * functions#firstName
 * - cb (Function): jazz cb(data) callback
 *
 * Template function to generate a random first name.
 **/
function firstName(cb) {
  cb(ns.firstName());
}

/**
 * functions#lastName
 * - cb (Function): jazz cb(data) callback
 *
 * Template function to generate a random last name.
 **/
function lastName(cb) {
  cb(ns.lastName());
}

/**
 * functions#email
 * - cb (Function): jazz cb(data) callback
 *
 * Template function to generate a random email.
 **/
function email(cb) {
  cb(faker.Internet.email());
}

/**
 * functions#phone
 * - format (String): phone number format, e.g. #### #### will generate 8 digit numbers separated with a space
 * - cb (Function): jazz cb(data) callback
 *
 * Template function to generate a random phone.
 **/
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