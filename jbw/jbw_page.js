function wrap(res, bodyCode) {

		res.writeHead(200, {'Content-Type': 'text/html'});
	  res.write('<html>\n\t<head>\n\t\t<title>JobBook</title>\n\t</head>\n\t<body onload="jbw_start();">\n');

		bodyCode(function() {

		    res.write('\n\t</body>\n</html>');
	      res.end();
    }); //Do whatever processing and page generation the actual page needs
}

exports.wrap = wrap
