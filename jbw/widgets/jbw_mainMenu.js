var jbw_base = require('./jbw_base.js');


function jbw_menuBar(name, session) {

    var base = new jbw_base.jbw_widget(name, session);
    base.type = "menuBar";
    return base;
}


function jbw_menuHeading(name, title, session) {

    var base = new jbw_base.jbw_widget(name, session);
    base.type = "menuHeading";
    base.title = title;
    return base;
}


function jbw_menuEntry(name, title, action, session) {

    var base = new jbw_base.jbw_widget(name, session);
    base.type = "menuHeading";
    base.title = title;
    base.action = action;
    return base;
}


exports.spawn = function(session, handBack) {

    var retMenu = new jbw_menuBar('mainMenu', session);
    //gotta do the async thing somehow
    handBack(retMenu);
}
