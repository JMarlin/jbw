//This code is in global scope and is therefore essentially
//the entry point for our application

var router   = new Router(),
cpuCount = require('os').cpus().length;

//cluster is a global lib
if(cluster.isMaster) {

   for(i = 0; i < cpuCount; i++)
	   cluster.fork();

   cluster.on('exit', function(worker, code, signal) {
	   // Restart the worker
	   var deadWorker = worker;
	   var newWorker = cluster.fork();

	   // Note the process IDs
	   var newPID = newWorker.process.pid;
	   var oldPID = deadWorker.process.pid;

	   // Log the event
	   console.log('worker '+oldPID+' died.');
	   console.log('worker '+newPID+' born.');
   });
} else {

     //http is a global lib
     http.createServer(function(req, res) {

     var postData = "",
         pathname = url.parse(req.url).pathname;

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

process.on('uncaughtException', function(err) {
console.error((new Date()).toUTCString() + ' uncaughtException:', err.message);
console.error(err.stack);
process.exit(1);
});


