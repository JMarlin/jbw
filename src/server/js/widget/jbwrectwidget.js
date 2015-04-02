function JBWRectWidget(height, width, top, left, bottom, right, session, done) {

    JBWWidget(session, function(base){
    
        base.type   = 'rectWidget';
	base.height = height;
	base.width  = width;
	base.top    = top;
	base.left   = left;
	base.bottom = bottom;
	base.right  = right;

	process.nextTick(function() {

	    done(base);
	}, 0);
    });
};
