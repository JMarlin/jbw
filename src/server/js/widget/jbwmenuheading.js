function JBWMenuHeading(title, session, done) {

    JBWWidget(session, function(base) {
    
        base.type  = 'menuHeading';
        base.title = title;
        done(base);
    });
}
