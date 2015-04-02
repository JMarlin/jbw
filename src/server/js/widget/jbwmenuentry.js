function JBWMenuEntry(title, action, session, done) {

    JBWWidget(session, function(base) {
    
        base.type   = 'menuEntry';
        base.title  = title;
        base.action = action;
        done(base);
    });
}
