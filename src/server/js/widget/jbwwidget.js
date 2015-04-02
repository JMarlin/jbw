function JBWWidget(session, done) {
  
    var that = {};
  
    that.type     = 'widget';
    that.children = [];

    //TO BE IMPLEMENTED! WE'RE GOING WAAAAY OFF THE RAILS, HERE
    //this.handle = jbw_sessionManager[session].openHandle(this); //Get a new handle and register the widget with the session manager
    //Handles are unique within the whole system, and therefore the session

    //that.destroy = function(){
        //jbw_sessionManager[session].closeHandle(this.handle);
        //remove the entity entry from the session list
    //};
    
    done(that);
}
