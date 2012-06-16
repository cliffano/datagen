var bag = require('bagofholding'),
  _jscov = require('../lib/datagen'),
  sandbox = require('sandboxed-module'),
  should = require('should'),
  checks, mocks,
  datagen;

describe('datagen', function () {

  function create(checks, mocks) {
    return sandbox.require('../lib/datagen', {
      requires: mocks.requires,
      globals: {
        console: bag.mock.console(checks),
        process: bag.mock.process(checks, mocks)
      },
      locals: {
        __dirname: '/somedir/datagen/lib'
      }
    });
  }

  beforeEach(function () {
    checks = {};
    mocks = {};
  });

  describe('config', function () {

    it('should copy sample template files to current directory when config is called', function (done) {
      mocks.requires = {
        'ncp': {
          ncp: function (source, target, cb) {
            checks.ncp_ncp_source = source;
            checks.ncp_ncp_target = target;
            cb();
          }
        }
      };
      datagen = new (create(checks, mocks))();
      datagen.config(function () {
        done();
      }); 
      checks.ncp_ncp_source.should.equal('/somedir/datagen/examples');
      checks.ncp_ncp_target.should.equal('.');
      checks.console_log_messages.length.should.equal(1);
      checks.console_log_messages[0].should.equal('Creating sample configuration files: header, segment, footer');
    });
  });

  describe('generate', function () {

    beforeEach(function () {
      mocks.process_pid = 56789;
      mocks.fs_readFileSync_header = 'header template';
      mocks.fs_readFileSync_segment = 'segment template';
      mocks.fs_readFileSync_footer = 'footer template';
      mocks.requires = {
        child_process: bag.mock.childProcess(checks, mocks),
        fs: bag.mock.fs(checks, mocks)
      };
    });

    it('should send default message properties when none is specified', function () {
      datagen = new (create(checks, mocks))();
      datagen.generate();

      // only 1 worker by default
      checks.child_process_fork_sends.length.should.equal(1);

      checks.child_process_fork_sends[0].workerId.should.equal(0);
      checks.child_process_fork_sends[0].genId.should.equal('56789');
      checks.child_process_fork_sends[0].numSegments.should.equal(1);
      checks.child_process_fork_sends[0].outFile.should.equal('data');
    });

    it('should send specified message properties when they are specified', function () {
      datagen = new (create(checks, mocks))();
      datagen.generate('12345', 10000, 8, 'somedatafile');

      // one message for each worker
      checks.child_process_fork_sends.length.should.equal(8);

      checks.child_process_fork_sends[0].workerId.should.equal(0);
      checks.child_process_fork_sends[0].genId.should.equal('12345');
      checks.child_process_fork_sends[0].numSegments.should.equal(10000);
      checks.child_process_fork_sends[0].outFile.should.equal('somedatafile');
    });

    it('should include templates when message is sent', function () {
      datagen = new (create(checks, mocks))();
      datagen.generate();
      checks.child_process_fork_sends[0].templates.header.should.equal('header template');
      checks.child_process_fork_sends[0].templates.segment.should.equal('segment template');
      checks.child_process_fork_sends[0].templates.footer.should.equal('footer template');
    });
  });
});
 