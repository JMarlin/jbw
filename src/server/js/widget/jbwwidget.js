function JBWWidget(session, done) {
  
    var that = this;
  
    this.type     = 'widget';
    this.children = [];

    //TO BE IMPLEMENTED! WE'RE GOING WAAAAY OFF THE RAILS, HERE
    //this.handle = jbw_sessionManager[session].openHandle(this); //Get a new handle and register the widget with the session manager
    //Handles are unique within the whole system, and therefore the session

    this.destroy = function(){
        //jbw_sessionManager[session].closeHandle(this.handle);
        //remove the entity entry from the session list
    };
    
    process.nextTick(function() {
        
	done(that);
    }, 0);
};
