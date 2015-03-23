var $jbw_gVersion = "v1.00.34";

var jbw_widgetize = { //The objTable is an associative array of all object types to their constructors
	"panel" : jbw_panel,
	"form" : jbw_form,
	"menuBar" : jbw_menuBar,
	"menuHeading" : jbw_menuHeading,
	"menuEntry" : jbw_menuEntry,
	/*"tabpage" : jbw_tabpage,*/
	/*"label" : jbw_label,*/
	"textbox" : jbw_textbox,
	/*"numberbox" : jbw_numberbox,*/
	"button" : jbw_button
	/*"listbox" : jbw_listbox,*/
	/*"grid" : jbw_grid*/
};

var jbw_handleAction = {
	"endsession" : jbw_endSession
}

var widget_table = {};
var rootObject = {};
var objHandles = [];

function jbw_makeRequest(msgObj) {



	$.ajax({
		url:"api",
		type: 'POST',
		data: JSON.stringify(msgObj),
		contentType: 'application/json; charset=utf-8',
		dataType: 'json',
		success: function(result){
			jbw_processMsgs(result);
		}
	});

}

function jbw_start() {

	WebFont.load({
    google: {
      families: ['Roboto Condensed']
    }
  });

	rootObject.tail = $(".jbw_workpane");
	objHandles[0] = rootObject;
	jbw_resizeWorkpane();
	$(window).resize(jbw_resizeWorkpane);

	//Get the first objects to be loaded from the server
	jbw_makeRequest([{action:"start_session"}]);
}

function jbw_resizeWorkpane() {

	$(".jbw_workpane").height(window.innerHeight - $(".jbw_workpane").offset().top);

}

/* Below is the collection of functions which make up the class hierarchy
   of the JBW frontend. Each function builds the object passed to it based
   on type property and then passes each child object in the children
   collection through the same process to expand the entire JSON message
   into JBW frontend objects. */

function jbw_endSession() {
	window.close();
}

function getObject(handle) {

    //if(objHandles[handle])
		//    return objHandles[handle];
		//else
				return null;
}

function jbw_processMsgs(msgObject) {

	console.log(JSON.stringify(msgObject));

	try {
		for(var i = 0; i < msgObject.length; i++)
			if(msgObject[i].mode == "builder"){
				jbw_widget(msgObject[i].content, getObject(msgObject[i].parent));
			}
	} catch(e) {}

	//Make sure any new widgets are seran wrapped
	jbw_resizeWorkpane();
}

function jbw_widget(JSONObject, parentObj) {

	var theCallback = {};

	//Draw/extend the widget
	if(parentObj)
	    JSONObject.parent = parentObj;

	theCallback = jbw_widgetize[JSONObject.type](JSONObject);

	//Set up the parent/child relation
	if(parentObj)
	    $(parentObj.tail).append(JSONObject.head);

	//Install the handle so that we can reference
	//this widget from future messages
	widget_table[JSONObject.handle] = JSONObject;

	try {
		for(var i = 0; i < JSONObject.children.length; i++)
			jbw_widget(JSONObject.children[i], JSONObject);
	} catch(e) {}

	//With any children installed into the widget and the
	//widget installed into its parent element we can now
	//do any final display steps such as showing dialogs
	if(theCallback) theCallback();

}

function jbw_panel(baseObject) {

		baseObject.parent = rootObject;
		baseObject.head = $(document.createElement("div"));
		baseObject.head.attr("title", baseObject.title);
		baseObject.head.css("width", baseObject.width);
		baseObject.head.css("height", baseObject.height);
		baseObject.head.css("x", baseObject.x);
		baseObject.head.css("y", baseObject.y);
		baseObject.tail = baseObject.head;

		return function() {
				baseObject.head.dialog({
						minHeight : baseObject.height,
						minWidth : baseObject.width,
						resizable : !!baseObject.resizable
				}).parent().draggable({
						containment: baseObject.parent.tail
				});
		};
}

function jbw_form(baseObject) {

	  baseObject.head = $(document.createElement("form"));
	  baseObject.tail = baseObject.head;

	  return null;
}

function jbw_button(baseObject) {

		baseObject.head = $(document.createElement("input"));
		baseObject.head.attr("type", "button");
		baseObject.head.attr("value", baseObject.title);
		baseObject.head.css("position", "absolute");
		if(baseObject.top !== null) baseObject.head.css("top", baseObject.top);
		if(baseObject.left !== null) baseObject.head.css("left", baseObject.left);
		if(baseObject.bottom !== null) baseObject.head.css("bottom", baseObject.bottom);
		if(baseObject.right !== null) baseObject.head.css("right", baseObject.right);
		baseObject.head.on("click", function(){jbw_handleAction[baseObject.action]();});
		baseObject.tail = baseObject.head;

		return null;
}

function jbw_textbox(baseObject) {

		baseObject.head = $(document.createElement("input"));
		baseObject.head.attr("type", "textbox");
		baseObject.tail = baseObject.head;

		return null;
}


function jbw_menuBar(baseObject) {

    baseObject.head = document.createElement("div");
		$($('.banner')[0]).append(baseObject.head);
		$(baseObject.head).addClass('jbw_menubar');
		baseObject.tail = baseObject.head;

		return function() {

		    $(document).on('click', function(e) {
			      if ( ! $(e.target).closest('.jbw_menu').length && ! $(e.target).closest('.jbw_menuentry_active').length ) {
				        $('.jbw_menu').hide();
				        $(".jbw_menuentry_active").addClass("jbw_menuentry");
				        $(".jbw_menuentry").removeClass("jbw_menuentry_active");
			      }
		    });
		};
}


function jbw_menuHeading(baseObject) {

		var entryDiv;

		//First, we'll create a stub element to insert into
		//the menu bar in order to open the menu
    baseObject.head = document.createElement('a');
		$(baseObject.head).attr("href", "#");
		entryDiv = document.createElement("div");
		$(entryDiv).addClass("jbw_menuentry");
		$(entryDiv).text(baseObject.title);
		$(baseObject.head).append(entryDiv);

		//Now, we create the menu container which sits in the
		//document body and contains the menu items
		baseObject.tail = document.createElement("div");
		$(baseObject.tail).addClass("jbw_menu");

		//Once the children of this menu are finished installing
		//we can position the menu container and install events
		return function(){

				$(document.body).append(baseObject.tail);
		    $(baseObject.tail).position({
			      "my": "left top",
			      "at": "left bottom",
			      "of": entryDiv
		    });
		    $(baseObject.tail).hide();
		    $(baseObject.tail).addClass("jbw_menu_" + $(entryDiv).text().trim().replace(/ /g,"_"));

		    $(entryDiv).on("click", function(event) {

				    var $targetString = ".jbw_menu_" + $(event.target).text().trim().replace(/ /g,"_");
			      var $doShow = !$($targetString).is(":visible");
			      $(".jbw_menu").hide();
			      $(".jbw_menuentry_active").addClass("jbw_menuentry");
			      $(".jbw_menuentry").removeClass("jbw_menuentry_active");

				    if($doShow) {

						    $(event.target).closest('div').removeClass("jbw_menuentry");
				        $(event.target).addClass("jbw_menuentry_active");
				        $($targetString).show();
			      }
        });
		};
}


function jbw_menuEntry(baseObject) {

		baseObject.head = document.createElement("a");
		$(baseObject.head).attr("href", "#");
		baseObject.tail = document.createElement("div");
		$(baseObject.tail).addClass("jbw_menuitem");
		$(baseObject.head).append(baseObject.tail);
		$(baseObject.tail).text(baseObject.title);
}


//Replace with builder-based menu widget
function jbw_installMenu() {
	$("ul.jbw_menubar").each(function(){
		var menubarDiv = document.createElement("div");
		var menuVerDiv = document.createElement("div");
		$(menubarDiv).insertBefore(this);
		$(menubarDiv).addClass("jbw_menubar");
		$(menuVerDiv).addClass("jbw_menuver");
		$(this).hide();
		$(this).children("li").each(function(){
			var menuDiv = document.createElement("div");
			$(menuDiv).addClass("jbw_menu");
			var entryLink = document.createElement("a");
			$(entryLink).attr("href", "#");
		    var entryDiv = document.createElement("div");
			$(entryDiv).addClass("jbw_menuentry");
			$(entryDiv).text(this.childNodes[0].nodeValue);
			$(entryLink).append(entryDiv);
			$(menubarDiv).append(entryLink);
			$(this).children("ul").each(function(){
				$(this).children("li").each(function(){
				    var itemLink = document.createElement("a");
					$(itemLink).attr("href", "#");
					var itemDiv = document.createElement("div");
					$(itemDiv).addClass("jbw_menuitem");
					$(itemLink).append(itemDiv);
					$(menuDiv).append(itemLink);
					$(itemDiv).append(this.childNodes[0].nodeValue); /*this.childNodes[0].nodeValue*/
				});
			});
			$(document.body).append(menuDiv);
			$(menuDiv).position({
				"my": "left top",
				"at": "left bottom",
				"of": entryDiv
			});
			$(menuDiv).hide();
			$(menuDiv).addClass("jbw_menu_" + $(entryDiv).text().trim().replace(/ /g,"_"));
			$(entryDiv).on("click", function(event){
				var $targetString = ".jbw_menu_" + $(event.target).text().trim().replace(/ /g,"_");
				var $doShow = !$($targetString).is(":visible");
				$(".jbw_menu").hide();
				$(".jbw_menuentry_active").addClass("jbw_menuentry");
				$(".jbw_menuentry").removeClass("jbw_menuentry_active");
				if($doShow){
					$(event.target).closest('div').removeClass("jbw_menuentry");
					$(event.target).addClass("jbw_menuentry_active");
					$($targetString).show();
				}
			});
		});
		$(menubarDiv).append(menuVerDiv);
		$(menuVerDiv).css("width", "100%");
		$(menuVerDiv).css("text-align", "right");
		$(menuVerDiv).text($jbw_gVersion);
	});

}
