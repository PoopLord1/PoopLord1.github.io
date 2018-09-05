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

		// Generate the overarching project node
		var project_node = document.createElement("div");
		project_node.className = "project";

		// And then the title and sub-title
		var heading_node = document.createElement("div");
		heading_node.className = "heading";

		var title_node = document.createElement("p");
		title_node.className = "title";
		
		var title_text = document.createTextNode(project);
		title_node.appendChild(title_text);
		
		var subtitle_node = document.createElement("p");
		subtitle_node.className = "subtitle";

		heading_node.appendChild(title_node);
		heading_node.appendChild(subtitle_node);
		project_node.appendChild(heading_node);

		// Create the project content
		var project_content_node = document.createElement("div");
		project_content_node.className = "project-content";

		// Then grab every todo and its status
		var todo_list = projects_obj[project]["todos"];
		console.log(todo_list);
		for (var todo in todo_list) {
			console.log("Here's one todo:");
			console.log(todo);
			var single_todo_node = document.createElement("div");
			single_todo_node.className = "single-todo";

			var checkbox_node = document.createElement("div");
			checkbox_node.className = todo_list[todo]["status"] ? "checkbox done" : "checkbox unfinished";

			var text_node = document.createElement("p");
			var text_text = document.createTextNode(todo_list[todo]["text"]);
			text_node.appendChild(text_text);

			single_todo_node.appendChild(checkbox_node);
			single_todo_node.appendChild(text_node);

			project_content_node.appendChild(single_todo_node);
		}
		
		// Create the "new-todo" button
		var add_todo_node = document.createElement("div");
		add_todo_node.className = "add-todo";
		var add_todo_img_node = document.createElement("img");
		add_todo_img_node.src = "imgs/plus.png";
		add_todo_node.appendChild(add_todo_img_node);
		project_content_node.appendChild(add_todo_node);

		// Create the "Remove finished todos" text
		var remove_finished_node = document.createElement("p");
		remove_finished_node.className = "remove-done-todos";
		var remove_finished_text = document.createTextNode("Remove all finished action items");
		remove_finished_node.appendChild(remove_finished_text);
		project_content_node.appendChild(remove_finished_node);

		project_node.appendChild(project_content_node);


		// And finally append the project to the actual page
		document.getElementById("projects").appendChild(project_node);

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
	$("input.edit_p").keydown(function(event) {
		if (event.which == 13) {
			change_to_p($(this));
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

	project_obj.find("div.project-content").prepend(single_todo_node);
	assign_handlers();
	project_obj.find("div.project-content div.single-todo input").first().focus();
}
function click_add_todo() {
	$("div.add-todo").click(function() {
		add_todo($(this).parent().parent());
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
$("p.remove-done-todos").click(function() {
	var project_obj = $(this).parent().parent();
	delete_finished_todos(project_obj);
});
remove_active_project();
click_project();
click_checkbox();
click_add_todo();
assign_handlers();
update_date_and_time();
refresh_all_action_items();
setInterval(update_date_and_time, 30000);