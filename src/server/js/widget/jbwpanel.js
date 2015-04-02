function JBWPanel(height, width, top, left, bottom, right, resizable, session, done) {

    JBWRectWidget(height, width, top, left, bottom, right, session, function(base){
    
        base.type      = 'panel';
        base.resizable = resizable;
        done(base);
    });
}
