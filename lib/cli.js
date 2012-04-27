var cly = require('cly'),
  DataGen = require('./datagen').DataGen,
  p = require('path');

function exec() {
  
  var dataGenDir = __dirname,
    commands = {
      init: {
        callback: function (args) {
          console.log('Creating DataGen configuration files');
          cly.copyDir(p.join(dataGenDir, '../examples'), '.', cly.exit);
        }
      },
      run: {
        options: {
          runId: {
            string: '-r run_id',
            help: 'An ID unique the execution of this command. Default: master process PID'
          },
          numSegments: {
            string: '-s num_segments',
            help: 'How many segments in a data file. Default: 1'
          },
          numWorkers: {
            string: '-w num_workers',
            help: 'How many worker processes, each worker creates a data file. Default: 1'
          },
          outFile: {
            string: '-o output_file',
            help: 'Output file name, which will be appended with worker ID. Default: \'out\''
          }
        },
        callback: function (args) {
          new DataGen(
            args.numSegments,
            args.numWorkers,
            args.outFile
          ).run(args.runId, cly.exit);
        }
      }
    };

  cly.parse(dataGenDir, 'datagen', commands);
}

exports.exec = exec;