//We need to be able to issue a session handle prior to session authentication
//To this end, a session object will contain an 'authenticated' field. This way,
//we can hand a login session a handle with which it can hand back the login
//credentials without allowing any other access

exports.jbw_widget = function(name, session) {
  this.type = "widget";
  this.name = name;
  this.children = [];

  //TO BE IMPLEMENTED! WE'RE GOING WAAAAY OFF THE RAILS, HERE
  //this.handle = jbw_sessionManager[session].openHandle(this); //Get a new handle and register the widget with the session manager
                         //Handles are unique within the whole system, and therefore the session

  this.destroy = function(){
    jbw_sessionManager[session].closeHandle(this.handle);
    //remove the entity entry from the session list
  }

};


exports.jbw_rectWidget = function(name, height, width, top, left, bottom, right, session) {

  var base = new exports.jbw_widget(name, session); // 'inheritance'

  base.type = "rectWidget";
  base.height = height;
  base.width = width;
  base.top = top;
  base.left = left;
  base.bottom = bottom;
  base.right = right;
  return base;
};


exports.jbw_panel = function(name, height, width, top, left, bottom, right, resizable, session) {

  var base = new exports.jbw_rectWidget(name, height, width, top, left, bottom, right, session);

  base.type = "panel";
  base.resizable = resizable;
  return base;
};


exports.jbw_form = function(session) {

  var base = new exports.jbw_widget("form");

  base.type = "form";
  return base;
};


//TOMORROW: It would be nice to add a 'tip' value to this
//class to allow the displayed widget to show a greyed
//out message to the user when it's empty
exports.jbw_textbox = function(name, height, width, top, left, bottom, right, content, session) {

  var base = new exports.jbw_rectWidget();

  base.type = "textbox";
  base.children = [];
  return base;
};


exports.jbw_button = function(title, action, top, left, bottom, right, session) {

  var base = new exports.jbw_rectWidget();

  base.top = top;
  base.left = left;
  base.bottom = bottom;
  base.right = right;
  base.type = "button";
  base.title = title;
  base.action = action;
  base.children = [];
  return base;
};
