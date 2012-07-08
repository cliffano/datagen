var bag = require('bagofholding'),
  sandbox = require('sandboxed-module'),
  should = require('should'),
  checks, mocks,
  cli;

describe('cli', function () {

  function create(checks, mocks) {
    return sandbox.require('../lib/cli', {
      requires: {
        bagofholding: {
          cli: {
            exit: bag.cli.exit,
            parse: function (commands, dir) {
              checks.bag_parse_commands = commands;
              checks.bag_parse_dir = dir;
            }
          }
        },
        './datagen': function () {
          return {
            init: function (exit) {
              checks.datagen_init_exit = exit;
            },
            generate: function (genId, numSegments, numWorkers, outFile, exit) {
              checks.datagen_generate_genId = genId;
              checks.datagen_generate_numSegments = numSegments;
              checks.datagen_generate_numWorkers = numWorkers;
              checks.datagen_generate_outFile = outFile;
              checks.datagen_generate_exit = exit;
            }
          };
        }
      },
      globals: {}
    });
  }

  beforeEach(function () {
    checks = {};
    mocks = {};
    cli = create(checks, mocks);
    cli.exec();
  });

  describe('exec', function () {

    it('should contain init command and delegate to datagen init when exec is called', function () {
      checks.bag_parse_commands.init.desc.should.equal('Create example template files');
      checks.bag_parse_commands.init.action();
      checks.datagen_init_exit.should.be.a('function');
    });

    it('should contain generate command and delegate to datagen generate when exec is called', function () {

      checks.bag_parse_commands.gen.desc.should.equal('Generate data file');
      checks.bag_parse_commands.gen.options.length.should.equal(4);
      checks.bag_parse_commands.gen.action({
        genId: '12345',
        numSegments: 10000,
        numWorkers: 8,
        outFile: 'somedatafile'
      });
      checks.datagen_generate_genId.should.equal('12345');
      checks.datagen_generate_numSegments.should.equal(10000);
      checks.datagen_generate_numWorkers.should.equal(8);
      checks.datagen_generate_outFile.should.equal('somedatafile');
      checks.datagen_generate_exit.should.be.a('function');

      checks.bag_parse_commands.gen.options[0].arg.should.equal('-i, --gen-id <genId>');
      checks.bag_parse_commands.gen.options[0].desc.should.equal('An ID unique to the current data generation, used by all worker processes  | defaut: datagen process PID');
      should.not.exist(checks.bag_parse_commands.gen.options[0].action);
      checks.bag_parse_commands.gen.options[1].arg.should.equal('-s, --num-segments <numSegments>');
      checks.bag_parse_commands.gen.options[1].desc.should.equal('How many segments in a data file | default: 1');
      (typeof checks.bag_parse_commands.gen.options[1].action).should.equal('function');
      checks.bag_parse_commands.gen.options[2].arg.should.equal('-w, --num-workers <numWorkers>');
      checks.bag_parse_commands.gen.options[2].desc.should.equal('How many worker processes, each worker creates a data file | default: 1');
      (typeof checks.bag_parse_commands.gen.options[2].action).should.equal('function');
      checks.bag_parse_commands.gen.options[3].arg.should.equal('-o, --out-file <outFile>');
      checks.bag_parse_commands.gen.options[3].desc.should.equal('Generated data file name, postfixed with worker ID | default: \'data\'');
      should.not.exist(checks.bag_parse_commands.gen.options[3].action);
      
    });
  });
});
 