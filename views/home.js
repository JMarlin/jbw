//var querystring = require('querystring');
var jbw_security = require('../jbw/jbw_security');	//security object for user authentication
var jbw_page = require('../jbw/jbw_page');			//page object, wraps child object in page header and footer
var jbw_client = require('../jbw/jbw_client');
var jbw_menu = require('../jbw/widgets/jbw_menu');

function display(res, args, postData) {

	jbw_page.wrap(res, function(endDraw) {	//Stick an HTTP header on our core data

	    jbw_menu.display(res, function() {

					if(jbw_security.checkCredentials(res)) {

							jbw_client.insertCSS(res);
			        jbw_client.insertScripts(res);
			        res.write('<div class="jbw_workpane"></div>');
	        }

					endDraw();
	    });
	});
}

exports.display = display;
