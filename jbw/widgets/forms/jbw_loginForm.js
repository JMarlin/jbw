var jbw_base = require('../jbw_base.js');


exports.spawn = function(session, handBack) {

    var retFrm = new jbw_base.jbw_panel("Login", 0, 0, 300, 200),
        tempForm = new jbw_base.jbw_form(),
        tbUserName = new jbw_base.jbw_textbox(),
        tbPassword = new jbw_base.jbw_textbox();

    tempForm.children.push(tbUserName);
    tempForm.children.push(tbPassword);

    //TOMORROW: This doesn't work yet, but 'actions' should really be 'messages',
    //they should have a command message, an associated payload (handles to
    //the widgets from which the data should be extracted -- NOTE: This should be
    //an array of widget handles which the client will, when sending the message,
    //replace with that widget's current value; the server command should know which
    //values each place in the array represents) and perhaps a target (eg:
    //authServer for login authentication, generally allow for routing messages
    //to specific backend modules)
    tempForm.children.push(new jbw_base.jbw_button("Login", {command: "login", payload: [tbUserName.handle, tbPassword.handle]}, null, null, 0, 0));
    retFrm.children.push(tempForm);
    handBack(retFrm);
};
