DataGen [![Build Status](https://secure.travis-ci.org/cliffano/datagen.png?branch=master)](http://travis-ci.org/cliffano/datagen) [![Dependencies Status](https://david-dm.org/cliffano/datagen.png)](http://david-dm.org/cliffano/datagen) [![Published Version](https://badge.fury.io/js/datagen.png)](http://badge.fury.io/js/datagen)
-------
<img align="right" src="https://raw.github.com/cliffano/datagen/master/avatar.jpg" alt="Avatar"/>

DataGen is a multi-process test data files generator.

This is handy when you want to generate large test data files (e.g. XMLs, JSONs, CSVs, etc), over multiple processes, utilising available CPU cores on your machine. It's also very easy to generate random numbers, dates, and strings as test data. You only need to create template files, no scripting involved.

Installation
------------

    npm install -g datagen 

Usage
-----

Create example header, segment, and footer template files:

    datagen init

Generate 8 data files containing 1 million segments in each file, written to data1 ... data8 output files, running over 8 processes, each process is used to generate 1 file:

    datagen gen -s 1000000 -w 8 -o data

Limit the number of worker processes that can run concurrently to just 3:

    datagen gen -s 1000000 -w 8 -m 3

Templates
---------

DataGen uses three template files: header, segment, and footer. These templates are simple text files which are used to construct a data file in this format:

    header
    segment 1
    segment 2
    ...
    segment N (number of segments)
    footer

Example header:
    
    <?xml version="1.0" encoding="UTF-8"?>
    <data>

Example segment:

    <segment>
      <id>{gen_id}-{worker_id}-{segment_id}</id>
      <name>{first_name()} {last_name()}</name>
      <dob>{date('dd-mm-yyyy')}</dob>
    </segment>

Example footer:
	
    </data>

The above templates will generate an XML like this:

    <?xml version="1.0" encoding="UTF-8"?>
    <data>
    <segment>
      <id>1-1-1</id>
      <name>Niels Bryant</name>
      <dob>12-08-1992</dob>
    </segment>
    <segment>
      <id>1-1-2</id>
      <name>John Bohr</name>
      <dob>01-11-1970</dob>
    </segment>
    ...
    </data>

Curly brackets in templates (e.g. JSON format) need to be escaped with double brackets:

    {{ "id": "{gen_id}-{worker_id}-{segment_id}", "name": "{first_name()} {last_name()}", "dob": "{date('dd-mm-yyyy')}" }}

Templates can contain the following parameters:

<table>
<tr><td>{gen_id}</td><td>Unique to each datagen execution. Default value is master process PID, can be overridden via -i flag.</td></tr>
<tr><td>{worker_id}</td><td>Unique to each worker. Value from 1 to number of workers.</td></tr>
<tr><td>{segment_id}</td><td>Unique to each segment within the generated data file, repeated in each file. Value from 1 to number of segments. Not available in header and footer templates.</td></tr>
<tr><td>{integer()}</td><td>Random integer.</td></tr>
<tr><td>{integer(100, 200)}</td><td>Random integer between 100 and 200.</td></tr>
<tr><td>{float()}</td><td>random float.</td></tr>
<tr><td>{float(1.23, 5.67)}</td><td>Random float between 1.23 and 5.67 .</td></tr>
<tr><td>{date()}</td><td>random date between 1970 and 2020 in ISO format.</td></tr>
<tr><td>{date('yyyy-mm-dd')}</td><td>Random date between 1970 and 2020 in yyyy-mm-dd format.<br/>Check out <a href="http://github.com/felixge/node-dateformat">felixge/node-dateformat</a> for more date formats.</td></tr>
<tr><td>{date(2000, 2010)}</td><td>Random date between 2000 and 2010 in ISO format.</td></tr>
<tr><td>{date('yyyy-mm-dd', 2000, 2010)}</td><td>Random date between 2000 and 2010 in yyyy-mm-dd format.</td></tr>
<tr><td>{select('apple', 'orange', ..., 'kiwi')}</td><td>Select one item from the arguments. You can have as many arguments as you want.</td></tr>
<tr><td>{word()}</td><td>Random word from Lorem Ipsum.</td></tr>
<tr><td>{word(3)}</td><td>Random 3 words from Lorem Ipsum.</td></tr>
<tr><td>{first_name()}</td><td>Random first name.</td></tr>
<tr><td>{last_name()}</td><td>Random last name.</td></tr>
<tr><td>{email()}</td><td>Random email address.</td></tr>
<tr><td>{phone()}</td><td>Random phone number. Default format #### ####.</td></tr>
<tr><td>{phone('(###) ####-####')}</td><td>Random phone number with a custom format. Each '#' will be replaced by a random number.</td></tr>
</table>

Colophon
--------

* [DataGen Workers Optimisation](http://blog.cliffano.com/2013/08/03/datagen-workers-optimisation/)
* [DataGen: Generate Large Test Data Files – Like A Boss](http://blog.cliffano.com/2012/07/08/datagen-generate-large-test-data-files-like-a-boss/)
