
function router() {

    var that = this;
    
    function final404(response) {
	    console.log("404: Page not found.");
	    response.writeHead(200, {'Content-Type': 'text/plain'});
	    response.write('This is the index page.');
	    response.end();
    }

    //Use the router's return value to determine whether or not to fire the 404 page
    this.route = function(pathname, res, postData) {

        var rootModule,
	    handler   = null,
	    pageFound = true,
	    args = pathname.substr(pathname.indexOf("/") + 1);
	    
	args = args.substr(args.indexOf("/") + 1);
	args = args.split("/");
	rootModule = pathname.split("/")[1];
	console.log("About to route a request for \"" + rootModule + "\"");
	
	//We need to update this to work with the new structure
	//I'm thinking we should make a file that defines an
	//object which just acts as a hashmap between view names 
	//and all installed view 'classes' and then we just
	//index into that object to see if the requested view
	//exists
	if(rootModule === '' || rootModule === null) {
	
            try {
		
                handler = require("./views/home");
            } catch(e) {
			 
                pageFound = false;
                console.log("Home module not defined");
            }	
	} else {
            
	    try {
	   
                handler = require("./views/" + rootModule);
            } catch(e) {
        
	        pageFound = false;
		console.log("Could not find a module for " + rootModule);
            }	
	}

	if(handler !== null)	
            try {
		
                handler.display(res, args, postData);
            } catch(e) {
		
                pageFound = false;
                console.log("Module " + rootModule + " does not have a display method!\n error: " + e);
	    }

        if(!pageFound) {

            try {
		
                handler = require('./views/404');
            } catch(e) {
	        
		handler = null;
		final404(res);
            }
		    
            if(handler !== null){
		
		try {
		    
		    handler.display(res, args, postData);
		} catch(e) {
		
		    final404(res);
	        }
	    }
	}

    }
}
