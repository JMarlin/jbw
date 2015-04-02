function JBWForm(session, done) {

    JBWWidget(session, function(base) {
    
        base.type = 'form';
	done(base);
    });
}
