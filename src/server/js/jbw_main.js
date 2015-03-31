var cluster = require('cluster');
var http = require('http');
var url = require('url');
var router = require('./router.js');

var cpuCount = require('os').cpus().length;

if(cluster.isMaster) {

	for(var i = 0; i < cpuCount; i++)
		cluster.fork();

	cluster.on('exit', function(worker, code, signal) {
		// Restart the worker
		var deadWorker = worker
		var worker = cluster.fork();

		// Note the process IDs
		var newPID = worker.process.pid;
		var oldPID = deadWorker.process.pid;

		// Log the event
		console.log('worker '+oldPID+' died.');
		console.log('worker '+newPID+' born.');
	});

} else {

	http.createServer(function(req, res) {

      var postData = "";
	  var pathname = url.parse(req.url).pathname;

	  console.log('Request for "' + pathname + '" received.');

	  req.setEncoding("utf8");

	  req.addListener("data", function(postDataChunk) {
		postData += postDataChunk;
		console.log("Received POST data '" + postDataChunk + "'");
	  });

	  req.addListener("end", function() {
		router.route(pathname, res, postData);
	  });

	}).listen(8888);
	console.log('Server has started.');

}

process.on('uncaughtException', function (err) {
  console.error((new Date).toUTCString() + ' uncaughtException:', err.message)
  console.error(err.stack)
  process.exit(1)
});
