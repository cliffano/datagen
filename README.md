DataGen [![http://travis-ci.org/cliffano/datagen](https://secure.travis-ci.org/cliffano/datagen.png?branch=master)](http://travis-ci.org/cliffano/datagen)
-------

Multi-process test data files generator.

This is handy when you want to generate large test data files (e.g. XMLs, JSONs, CSVs, etc), over multiple processes, utilising available CPU cores on your machine. It's also very easy to generate random numbers, dates, and strings as test data.

Installation
------------

    npm install -g datagen 

Usage
-----

Create example header, segment, and footer template files:

    datagen config

Generate 8 data files containing 1 million segments in each file, written to data1 ... data8 output files, running over 8 processes, each process is used to generate 1 file:

    datagen gen -s 1000000 -w 8 -o data

Templates
---------

DataGen uses three template files: header, segment, and footer. These templates are simple text files which are used to construct a data file in this format:

    header
    segment 1
    segment 2
    ...
    segment N (number of segments)
    footer

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
<tr><td>{date('yyyy-mm-dd')</td><td>Random date between 1970 and 2020 in yyyy-mm-dd format.<br/>Check out <a href="http://github.com/felixge/node-dateformat">felixge/node-dateformat</a> for more date formats.</td></tr>
<tr><td>{date(2000, 2010)}</td><td>Random date between 2000 and 2010 in ISO format.</td></tr>
<tr><td>{date('yyyy-mm-dd', 2000, 2010)}</td><td>Random date between 2000 and 2010 in yyyy-mm-dd format.</td></tr>
<tr><td>{select('apple', 'orange', ..., 'kiwi')}</td><td>Select one item from the arguments. You can have as many arguments as you want.</td></tr>
<tr><td>{word()}</td><td>Random word from Lorem Ipsum.</td></tr>
<tr><td>{word(3)}</td><td>Random 3 words from Lorem Ipsum.</td></tr>
<tr><td>{first_name()}</td><td>Random first name.</td></tr>
<tr><td>{last_name()}</td><td>Random last name.</td></tr>
</table>
