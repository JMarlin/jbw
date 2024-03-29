//ClientLibs: Library for inserting client-side resources into the rendered page.
function ClientLibs() {

    this.insertCSS = function(res) {

	   res.write('\n\t\t<!-- JBW CSS -->\n');
	   res.write('\t\t<link rel="stylesheet" stype="text/css" href="res/css/jbw_css.css" />\n');
	   res.write('\t\t<link rel="stylesheet" stype="text/css" href="res/css/jquery-ui.min.css" />\n');
	   res.write('\t\t<link rel="stylesheet" stype="text/css" href="res/css/jquery-ui.structure.min.css" />\n');
	   res.write('\t\t<link rel="stylesheet" stype="text/css" href="res/css/jquery-ui.theme.min.css" />\n');
    };

    this.insertScripts = function(res) {

	   res.write('\n\t\t<!-- JBW Client Scripts -->\n');
	   res.write('\t\t<script src="//ajax.googleapis.com/ajax/libs/webfont/1.5.10/webfont.js"></script>\n');
	   res.write('\t\t<script lang="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js"></script>\n');
	   res.write('\t\t<script lang="text/javascript" src="res/js/jquery-ui.min.js"></script>\n');
	   res.write('\t\t<script lang="text/javascript" src="res/js/jbw_client.js"></script>\n');
    };
}
