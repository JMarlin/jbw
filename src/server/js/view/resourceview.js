//RES: The server for jobbook resources (client code/images/etc.)
function ResourceView() {

    function res404(res) {

        res.writeHead(404, {'Content-Type': 'text/plain'});
        //res.write("404");
        res.end();
    }

    //TODO: Probably a better async way of doing this
    function serveStatic(res, path, type) { 

	console.log('Opening requested file');

	var stream = null;
	try {
		stream = fs.createReadStream(path);
	} catch(e) {
		res404();
		console.log("opening failed.");
		return;
	}

	console.log('Writing file data');

	res.writeHead(200, {"Content-Type": type});
	try {
		stream.pipe(res);
	} catch(e) {
		res.end();
		console.log("streaming failed.");
		return;
	}
    }

    this.display = function(res, args, postData) {

	if(args === null || args.length != 2 || args[0] === '') {
		res404(res);
		return;
	}

	switch(args[0]) {
	    case "css":
		console.log('serving CSS');
		serveStatic(res ,"./res/" + args[1], "text/css");
		break;

	    case "js":
		console.log('serving JS');
		serveStatic(res ,"./res/" + args[1], "text/javascript");
		break;

	    case "images":
		console.log('serving image');
		serveStatic(res ,"./res/images/" + args[1], "image/png"); //Should really do smarter handling of image type, we will probably want gif spinners in the future
		break;

	    default:
		res404();
		break;
	}
    };
}
