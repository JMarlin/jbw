function JBWLoginForm(session, done) {

    //TODO: Refactor this with a execution queue
    JBWPanel(200, 300, 0, 0, 0, 0, false, session, function(retForm) {
    
        JBWForm(session, function(tempForm) {
	
	    JBWTextbox(null, null, null, null, null, null, null, session, function(tbUserName) {
	    
	        JBWTextbox(null, null, null, null, null, null, null, session, function(tbPassword) {
	    
                    //TODO: This doesn't work yet, but 'actions' should really be 'messages',
		    //they should have a command message, an associated payload (handles to
		    //the widgets from which the data should be extracted -- NOTE: This should be
		    //an array of widget handles which the client will, when sending the message,
		    //replace with that widget's current value; the server command should know which
		    //values each place in the array represents) and perhaps a target (eg:
		    //authServer for login authentication, generally allow for routing messages
		    //to specific backend modules)
		    JBWButton("Login", {command: "login", payload: [tbUserName.handle, tbPassword.handle]}, null, null, null, null, 0, 0, session, function(loginButton) {
		    
		        tempForm.children.push(tbUserName);
                        tempForm.children.push(tbPassword);
			tempForm.children.push(loginButton);
			retForm.children.push(tempForm);
			done(retForm);
		    });
	        });    
	    }); 
	});
    });
}
