function JBWButton(title, action, height, width, top, left, bottom, right, session, done) {

    JBWRectWidget(height, width, top, left, bottom, right, session, function(base) {
    
        base.type   = 'button';
        base.title  = title;
        base.action = action;
        
	process.nextTick(function() {

	    done(base);
	}, 0);
    });
};
