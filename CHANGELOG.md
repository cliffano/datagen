### 0.0.10-pre
* Change test lib to buster-node + referee
* Set min node engine to >= v0.10.0

### 0.0.9
* Add max concurrent workers option to gen command
* Concurrently running workers are limited to available CPUs by default
* Fix max call stack size exceeded error when segment file does not exist or is empty

### 0.0.8
* Fix hang after writing first segment
* Display help when no command is specified

### 0.0.7
* Header and footer template files are now optional
* Require min node engine support 0.8.0

### 0.0.6
* Replace config command with init command

### 0.0.5
* Add template functions: email and phone

### 0.0.4
* Set max node engine to < 0.9.0

### 0.0.3
* Worker write no longer streams non-stop, better handling of fs backpressure
* Worker ID and segment ID starts from 1 instead of 0

### 0.0.2
* Rename run command to gen
* Replace -r run ID with -i gen ID
* Change default out file name from 'out' to 'data'
* Add template functions: integer, float, date, select, word, first_name, and last_name

### 0.0.1
* Initial version 
