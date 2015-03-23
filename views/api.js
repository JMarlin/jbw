//TOMORROW: Include the session manager -- this will create session objects which track object handles
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

var sessionLib = require('../jbw/session.js'),
		sessionManager = new sessionLib.Session();

var jbw_doAction = {
	"start_session" : { "routine" : jbw_startSession,
						          "secure"  : false }
};

var globCount = 0;

Function.prototype.partial = function() {

		var f = this;
		var partArgs = Array.prototype.slice.call(arguments);

		return function() {

				f.apply(null, partArgs.concat.apply(partArgs, arguments));
		};
};


function Queue() {

		that = this;

		this.commands = [];
		this.qid = ++globCount;

		this.push = function(val) {

		    that.commands.push(val);
		};

		this.execute = function() {

				console.log('queue #' + that.qid + ' testing item #' + that.commands.length);
		    if(that.commands.length) {

						console.log('executing');
				  	that.commands.shift()(that.execute);
				}
		};
}


function jbw_startSession(requestObj, retArray, callback) {

    var x = new Queue();

	  retArray.push({
	        mode: "builder",
	        content: new jbw_loginForm(),
			    parent: 0
	  });

		x.push((function(cb) {

				jbw_makeMainMenu(null, function(menu){

				    retArray.push({
						    mode: "builder",
								content: menu,
								parent: 0
						});

						console.log('complete adding menu');
						cb();
				});
		}).partial());

		x.push(function() {
				console.log('returning to message handling loop');
				console.log(callback);
		    callback();
				console.log('we should never get here');
				while(1);
		});

		x.execute();
}

function jbw_openHandle(widgetObj, session) {

}

//We need to be able to issue a session handle prior to session authentication
//To this end, a session object will contain an 'authenticated' field. This way,
//we can hand a login session a handle with which it can hand back the login
//credentials without allowing any other access

function jbw_widget(name, session) {
	this.type = "widget";
	this.name = name;
	this.children = [];

	//TO BE IMPLEMENTED! WE'RE GOING WAAAAY OFF THE RAILS, HERE
	//this.handle = jbw_sessionManager[session].openHandle(this); //Get a new handle and register the widget with the session manager
												 //Handles are unique within the whole system, and therefore the session

	this.destroy = function(){
		jbw_sessionManager[session].closeHandle(this.handle);
		//remove the entity entry from the session list
	}

}


function jbw_menuBar(name, session) {

	  var base = new jbw_widget(name, session);
	  base.type = "menuBar";
		return base;
}


function jbw_menuHeading(name, title, session) {

    var base = new jbw_widget(name, session);
		base.type = "menuHeading";
		base.title = title;
		return base;
}


function jbw_menuEntry(name, title, action, session) {

		var base = new jbw_widget(name, session);
		base.type = "menuHeading";
		base.title = title;
		base.action = action;
		return base;
}


function jbw_makeMainMenu(session, callback) {

	  var retMenu = new jbw_menuBar('mainMenu', session);
		//gotta do the async thing somehow
		callback(retMenu);
}


function jbw_rectWidget(name, height, width, top, left, bottom, right, session) {

	var base = new jbw_widget(name, session); // 'inheritance'
	base.type = "rectWidget";
	base.height = height;
	base.width = width;
	base.top = top;
	base.left = left;
	base.bottom = bottom;
	base.right = right;
	return base;
}

function jbw_panel(name, height, width, top, left, bottom, right, resizable, session) {
	var base = new jbw_rectWidget(name, height, width, top, left, bottom, right, session);
	base.type = "panel";
	base.resizable = resizable;
	return base;
}

function jbw_form(session) {
	var base = new jbw_widget("form");
	base.type = "form";
	return base;
}

//TOMORROW: It would be nice to add a 'tip' value to this
//class to allow the displayed widget to show a greyed
//out message to the user when it's empty
function jbw_textbox(name, height, width, top, left, bottom, right, content, session) {
	var base = new jbw_rectWidget();
	this.type = "textbox";
	this.children = [];
}

function jbw_button(title, action, top, left, bottom, right, session) {
	this.top = top;
	this.left = left;
	this.bottom = bottom;
	this.right = right;
	this.type = "button";
	this.title = title;
	this.action = action;
	this.children = [];
}


function jbw_loginForm(session) {

		var retFrm = new jbw_panel("Login", 0, 0, 300, 200),
				tempForm = new jbw_form(),
				tbUserName = new jbw_textbox(),
				tbPassword = new jbw_textbox();

		tempForm.children.push(tbUserName);
		tempForm.children.push(tbPassword);

		//TOMORROW: This doesn't work yet, but 'actions' should really be 'messages',
		//they should have a command message, an associated payload (handles to
		//the widgets from which the data should be extracted -- NOTE: This should be
		//an array of widget handles which the client will, when sending the message,
		//replace with that widget's current value; the server command should know which
		//values each place in the array represents) and perhaps a target (eg:
		//authServer for login authentication, generally allow for routing messages
		//to specific backend modules)
		tempForm.children.push(new jbw_button("Login", {command: "login", payload: [tbUserName.handle, tbPassword.handle]}, null, null, 0, 0));
		retFrm.children.push(tempForm);
		return retFrm;
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


function display(res, args, postData) {

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

  //returnObjs = returnObjs.concat(tempObj);

	q.push(function() {

		res.writeHead(200, {'Content-Type': 'text/json'});
		console.log(JSON.stringify(returnObjs));
		res.write(JSON.stringify(returnObjs));
		res.end();
	});

	q.execute();

}

exports.display = display;
