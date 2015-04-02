//TOMORROW: It would be nice to add a 'tip' value to this
//class to allow the displayed widget to show a greyed
//out message to the user when it's empty
function JBWTextbox(height, width, top, left, bottom, right, content, session, done) {

    JBWRectWidget(height, width, top, left, bottom, right, session, function(base) {
    
        base.type = 'textbox';
        
	process.nextTick(function() {

	    done(base);
	}, 0);
    });
};
