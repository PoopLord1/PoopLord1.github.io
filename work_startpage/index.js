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
	console.log(read_string);
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
	var parent = jquery_obj.parent();
	var p_node = jquery_obj.remove();
	parent.append("<p>" + text + "</p>");
	assign_handlers();
	save_projects();
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
	jquery_obj.find("div.project-content div.single-todo div.done").parent().remove();
	save_projects();
}
$("p.remove-done-todos").click(function() {
	var project_obj = $(this).parent().parent();
	delete_finished_todos(project_obj);
});


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
	$("#time").html(time_string);

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

	$("#date").html(weekday + ", " + month_string + " " + date_string);
}

load_projects();
remove_active_project();
click_project();
click_checkbox();
assign_handlers();
update_date_and_time();
refresh_all_action_items();
setInterval(update_date_and_time, 30000);