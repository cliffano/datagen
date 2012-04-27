DataGen [![http://travis-ci.org/cliffano/datagen](https://secure.travis-ci.org/cliffano/datagen.png?branch=master)](http://travis-ci.org/cliffano/datagen)
-----------

Multi-process data file generator.

Installation
------------

    npm install -g datagen 

Usage
-----

Create template files example:

    datagen init

Generate data files containing 1 million segments, over 8 processes, written to data0 ... data7 files:

    datagen run -s 1000000 -w 8 -o data

Templates
---------

DataGen uses 3 template files: header, segment, and footer. They are simple text files which will be constructed into a data file in this format:

header
segment 0
segment 1
...
segment num_segments - 1
footer

Each template can contain the following parameters:

<table>
<tr><td>run_id</td><td>Unique to each program execution. Default value is master process PID, can be overridden via -r flag.</td></tr>
<tr><td>worker_id</td><td>Unique to each worker. Value from 0 to number of workers - 1.</td></tr>
<tr><td>segment_id</td><td>Unique to each segment within a file, repeated in each file. Value from 0 to number of segments - 1. Not available in header and footer templates.</td></tr>
</table>

Colophon
--------

Follow [@cliffano](http://twitter.com/cliffano) on Twitter.
 