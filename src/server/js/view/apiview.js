//TODO: Include the session manager -- this will create session objects which track object handles
//and general application state for a user's session. A session number and associated backend session
//object will be generated and automatically inserted into the rendered initial page when the application
//root is initially requested and will be culled from the collection if the server recieves an end-session
//message. To keep stale sessions from building up there will be a timer set up that increments a counter
//in each session object. If a session object exceeds a certain number of ticks, it will be culled from the
//collection. In the meantime, there will be a timer in the client side which will, every so often, send
//a keepalive command to the server. When this keepalive message is recieved, the server will reset the
//calling session's counter to zero. As well, the client will have a timeout which is reset whenever
//the user interacts with the session but, when it times out, will cause the client to cease sending
//keepalive messages to the server and thereby causing the session to time out. If a message is recieved
//from a session number which is not in the active sessions collection, a message will be sent back to
//the client causing it to pick up a new session number and revert to the login dialog.
//NOTE: A very cool extra feature would be allowing the session to be suspended to a table with an entry
//associated with the user. This way, whenever a session ends the internal state of the session can be
//stored and then unthawed the next time the user logs on meaning that a user wouldn't have to reopen
//their entire session if they walk away and everything times out.
function ApiView() {

    var sessionManager = new Session(),
	jbw_doAction   = {
            'start_session' : {
        	'routine' : jbw_startSession,
        	'secure'  : false
            }
	};


    function jbw_startSession(requestObj, retArray, returnToQueue) {

        var q = new Queue();

        q.push((function(f) {

	    JBWMenuBar(null, function(menu){

		retArray.push({
                    mode:    "builder",
                    content: menu,
                    parent:  1
                });

                console.log('complete adding menu');
                f();
            });
        }).partial());

	q.push((function(f){

            JBWLoginForm(null, function(form){
                
                retArray.push({
		    mode:    'builder',
		    content: form,
		    parent:  0
		});

                console.log('complete adding login dialog');
                f();
            });
	}).partial());

        q.push(function() {

            console.log('returning to message handling loop');
            returnToQueue();
        });

        q.execute();
    }


    function jbw_openHandle(widgetObj, session) {

    }


    function jbw_verifySession(requestObjs) {

	return false;
    }


    function jbw_sessionError(retArray, callback) {

	retArray.push({action: "alert"});
	callback();
    }


    function jbw_requestError(retArray, callback) {

	retArray.push({action: "alert"});
		    callback();
    }


    this.display = function(res, args, postData) {

	var tempObj;
	var returnObjs = [];
	var requestObjs = JSON.parse(postData);
	var q = new Queue();



	for(var i = 0; i < requestObjs.length; i++) {

	    var requestGrant = false;

	    try {
	    
		if(jbw_doAction[requestObjs[i].action].secure)
		    requestGrant = jbw_verifySession(requestObjs);
		else
		    requestGrant = true;
	    } catch(e) {
	
                q.push(jbw_requestError.partial(returnObjs));
	    }

	    if(requestGrant) {
	    
		try {
                    
		    q.push(jbw_doAction[requestObjs[i].action].routine.partial(requestObjs[i], returnObjs));
		} catch(e) {

                    q.push(jbw_requestError.partial(returnObjs));
		}
	    }else{
	    
                q.push(jbw_sessionError.partial(returnObjs));
	    }
	}

	q.push(function() {

	    res.writeHead(200, {'Content-Type': 'text/json'});
	    
	    returnObjs.forEach(function(o) {
	    
	        console.log(JSON.stringify(o));
	    });
	    
	    res.write(JSON.stringify(returnObjs));
	    res.end();
	});

	q.execute();
    };
}
