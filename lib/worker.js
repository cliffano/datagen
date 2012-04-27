var Writer = require('./writer').Writer;

process.on('message', function (message) {
  console.log('Start worker ' + message.workerId);
  new Writer().gen(
    message.templates,
    message.numSegments,
    message.params,
    message.outFile,
    function () {
      console.log('Finish worker ' + message.workerId);
      process.exit(1);
    }
  );
});