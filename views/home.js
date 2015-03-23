var jbw_sessions = require('../jbw/session.js'),
    jbw_client   = require('../jbw/jbw_client');


exports.display = function(res, args, postData) {

    res.writeHead(200, {'Content-Type': 'text/html'});
	  res.write('<html>\n\t<head>\n\t\t<title>JobBook</title>\n\t</head>\n\t<body onload="jbw_start();">\n');
		res.write("\t\t<div class='banner'>\n\t\t\t<img src='res/images/banner.png' />\n\t\t</div>\n");
		jbw_client.insertCSS(res);
		jbw_client.insertScripts(res);
		res.write('\t\t<div class="jbw_workpane"></div>\n');
		res.write('\t</body>\n</html>');
		res.end();
};
