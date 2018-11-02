// Saves the TODOs information we have stored. 
function save_projects() {
	// Grab all the project elements 
	var projects = document.getElementsByClassName("project");
	var project_info = {}; // {"CAMEL": {"todos": [...], "deadlines": [...]}, ...}

	// For each project, grab the name, todos, and deadlines
	for (var i=0; i < projects.length; i++) {
		var name = $(projects[i]).find("div.heading p.title").html();

		// Find todo information for this project
		var todos = [];
		var todos_objs = $(projects[i]).find("div.single-todo").each(function() {
			var todo_dict = {};

			var todo_text = $(this).find("p").first().html();
			console.log("todo_text: " + todo_text);
			todo_dict["text"] = todo_text;

			var todo_status = $(this).find("div.checkbox").first().hasClass("done") ? true : false;
			todo_dict["status"] = todo_status;

			todos.push(todo_dict);
		});

		// Combine it all and add it to our project_info object
		project_info[name] = {};
		project_info[name]["todos"] = todos;
	}

	// And finally store in local storage
	console.log(JSON.stringify(project_info));
	localStorage.setItem("project_info", JSON.stringify(project_info));
}


// Load TODO and deadline information from local storage
function load_projects() {
	var read_string = localStorage.getItem("project_info");
	var projects_obj = JSON.parse(read_string);

	// For each project in the JSON object,
	for (var project in projects_obj) {

		var project_node = create_project_node(projects_obj, project);

		// And finally append the project to the actual page
		var project_node_jquery = $(project_node);
		project_node_jquery.insertBefore( $("div#new-project") );
	}
}


// Re-count the number of active action items for the given project (project expressed as a jquery object)
function refresh_action_items(jquery_obj) {
	var action_items_p = $(jquery_obj).find("div.heading").find("p.subtitle").first();

	var num_unfinished_todos = $(jquery_obj).find("div.project-content div.single-todo div.unfinished").size();
	console.log("num unfinished: " + num_unfinished_todos);

	if (num_unfinished_todos != 1) {
		action_items_p.html(num_unfinished_todos + " action items");
	} else {
		action_items_p.html(num_unfinished_todos + " action item");
	}
}


// Refreshes the action item text for all projects
function refresh_all_action_items() {
	console.log("now refreshing");
	$("div#projects div.project").each( function() {
		refresh_action_items(this);
	});
}


// When you click on a checkbox, the checkbox becomes filled
function click_checkbox() {
	$("div.checkbox").off();
	$("div.checkbox").click(function() {
		if ($(this).hasClass("done")) {
			$(this).removeClass("done");
			$(this).addClass("unfinished");	
		} else {
			$(this).removeClass("unfinished");
			$(this).addClass("done");	
		}
		refresh_action_items($(this).parent().parent().parent());
		save_projects();
	});
}


// When you click on a p object (like project name or todo content) 
// we pull up a text entry box (like an input) to edit the text.
function change_to_input(jquery_obj) {
	var text = jquery_obj.html();
	var parent = jquery_obj.parent();
	var p_node = jquery_obj.remove();
	parent.append("<input type='text' class='edit_p' value='" + text + "'/></input>");
	parent.children("input.edit_p").get(0).focus();
	assign_handlers();
}


// When that text entry box loses focus, we change it back to a p 
// node and overwrite the saved todos to localStorage.
function change_to_p(jquery_obj) {
	var text = jquery_obj.val();
	if (text.length > 0) {
		var parent = jquery_obj.parent();
		var p_node = jquery_obj.remove();
		if (parent.attr("class") == "heading") {
			parent.append("<p class=\"title\">" + text + "</p>");
		}
		else {
			parent.append("<p>" + text + "</p>");
		}	
		assign_handlers();
		save_projects();
	} else {
		jquery_obj.parent().remove()
	}
}

// When a project heading entry box loses focus, we change it back to a p 
// node and overwrite the saved todos to localStorage.
function change_project_input_to_p(jquery_obj) {
	var text = jquery_obj.val();
	if (text.length > 0) {
		var parent = jquery_obj.parent();
		var p_node = jquery_obj.remove();
		if (parent.attr("class") == "heading") {
			parent.append("<p class=\"title\">" + text + "</p>");
		}
		else {
			parent.append("<p>" + text + "</p>");
		}	
		assign_handlers();
		save_projects();
	} else {
		jquery_obj.parent().parent().remove()
	}
}


// Removes and re-assigns all event handlers for p objects and input objects
function assign_handlers() {
	$(".single-todo p").off();
	$(".single-todo p").click(function() {
		change_to_input($(this));
	});

	$("input.edit_p").off();
	$("input.edit_p").focusout(function() {
		change_to_p($(this));
	});
	$("input.edit_p").keydown(function(event) {
		if (event.which == 13) {
			change_to_p($(this));
		}
	});

	$("input.edit_project_input_p").off();
	$("input.edit_project_input_p").focusout(function() {
		change_project_input_to_p($(this));
	});
	$("input.edit_project_input_p").keydown(function(event) {
		if (event.which == 13) {
			change_project_input_to_p($(this));
		}
	});
}


// Adds a new TODO when you click on the "add" button
function add_todo(project_obj) {
	var single_todo_node = document.createElement("div");
	single_todo_node.className = "single-todo";

	var checkbox_node = document.createElement("div");
	checkbox_node.className = "checkbox unfinished";
	single_todo_node.appendChild(checkbox_node);

	var input_node = document.createElement("input");
	input_node.type = "text";
	input_node.className = "edit_p";
	input_node.value = "";
	single_todo_node.appendChild(input_node);

	project_obj.prepend(single_todo_node);
	
}

function click_add_todo() {
	$("div.add-todo").off();
	$("div.add-todo").click(function() {
		add_todo($(this).parent().parent());
		assign_handlers();
		click_checkbox();
		$(this).parent().parent().find("div.single-todo input").first().focus();
	});
}

// When you click on a project, set it as the active project.
function click_project() {
	$(".project").off();
	$(".project").click(function() {
		$(".project").removeClass("active");
		$(this).addClass("active");
	});
}


// When the user clicks on the negative space, the active project is removed.
function remove_active_project() {
	$("#bg").click(function() {
		$(".project").removeClass("active");
	});
}


// Deletes all finished todos in the given jquery object
function delete_finished_todos(jquery_obj) {
	jquery_obj.find("div.single-todo div.done").parent().remove();
	save_projects();
}



// Periodically update the time and date elements
var num_to_month = {0: "January", 1: "February", 2: "March", 3: "April", 4: "May", 5: "June", 6: "July", 7: "August", 8: "September", 9: "October", 10: "November", 11: "December"};
var num_to_weekday = {0: "Sunday", 1: "Monday", 2: "Tuesday", 3: "Wednesday", 4: "Thursday", 5: "Friday", 6: "Saturday"};
function update_date_and_time() {
	var date_obj = new Date();
	var hours_num = date_obj.getHours();
	
	var ampm = "AM";
	if (hours_num >= 12) {
		ampm = "PM";
	}
	hours_num = hours_num % 12;
	if (hours_num == 0) {
		hours_num = 12;
	}

	var minutes_num = date_obj.getMinutes();

	var hours_string = hours_num.toString();
	var minutes_string = minutes_num.toString();
	if (minutes_string.length == 1) {
		minutes_string = "0" + minutes_string;
	}

	time_string = hours_string + ":" + minutes_string + " " + ampm;
	// $("#time").html(time_string);

	var month_string = num_to_month[date_obj.getMonth()];
	var year_string = date_obj.getFullYear();
	var date_num = date_obj.getDate();
	var weekday_num = date_obj.getDay();
	var weekday = num_to_weekday[weekday_num];

	var date_ending = "";
	if (date_num == 1 || date_num == 21 || date_num == 31) {
		date_ending = "st";
	} else if (date_num == 2 || date_num == 22) {
		date_ending = "nd";
	} else if (date_num == 3 || date_num == 23) {
		date_ending = "rd";
	} else {
		date_ending = "th";
	}
	var date_string = date_num + date_ending;

	// $("#date").html(weekday + ", " + month_string + " " + date_string);
	$("p#datetime").html(time_string + " on " + weekday + ", " + month_string + " " + date_string);
}


// When we press enter on the Google Search bar, send us to the appropriate search page.
$("form#search-form").on("submit", function () {
    var search_string = $("input#search").val();
    var escaped_string = search_string.replace(" ", "%20");
    window.location = "http://www.google.com/search?q=" + escaped_string;
    return false;
});


function click_clean_todos() {
	$("div.clean-todo").off();
	$("div.clean-todo").click(function() {
		var project_obj = $(this).parent().parent();
		delete_finished_todos(project_obj);
	});
}


// When we click on "New Project", create a new project object and allow us to type in it.
function create_new_project() {
	var project_node = generate_empty_project();

	// And finally append the project to the actual page
	var project_node_jquery = $(project_node);
	project_node_jquery.insertBefore( $("div#new-project") );

	// Give focus to the Heading input
	project_node_jquery.find("div.heading > input.edit_project_input_p").get(0).focus();

	// Make sure that when we click away from it, it becomes a <p> element like it should.
	assign_handlers();

	click_add_todo();
	click_checkbox();
	click_clean_todos();

	// And bind the click function handler to the new project.
	click_project();
}


$("div#new-project").click(create_new_project);

load_projects();
remove_active_project();
click_clean_todos();
click_project();
click_checkbox();
click_add_todo();
assign_handlers();
update_date_and_time();
refresh_all_action_items();
setInterval(update_date_and_time, 30000);