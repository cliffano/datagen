DataGen [![http://travis-ci.org/cliffano/datagen](https://secure.travis-ci.org/cliffano/datagen.png?branch=master)](http://travis-ci.org/cliffano/datagen)
-----------

Multi-process data file generator.

This is handy when you want to generate large test data file (e.g. XMLs, JSONs), over multiple processes, utilising the available CPU cores on your machine.

Installation
------------

    npm install -g datagen 

Usage
-----

Create example header, segment, and footer template files:

    datagen config

Generate data files containing 1 million segments, over 8 processes, written to data0 ... data7 files:

    datagen gen -s 1000000 -w 8 -o data

Templates
---------

DataGen uses three template files: header, segment, and footer. These templates are simple text files which will be used to construct a data file in this format:

    header
    segment 0
    segment 1
    ...
    segment N (number of segments - 1)
    footer

Templates can contain the following parameters:

<table>
<tr><td>gen_id</td><td>Unique to each datagen execution. Default value is master process PID, can be overridden via -i flag.</td></tr>
<tr><td>worker_id</td><td>Unique to each worker. Value from 0 to number of workers - 1.</td></tr>
<tr><td>segment_id</td><td>Unique to each segment within the generated data file, repeated in each file. Value from 0 to number of segments - 1. Not available in header and footer templates.</td></tr>
</table>