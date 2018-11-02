function close_active_project(event) {
	$("div.project.active").removeClass("active");
}

function open_project(event) {
	// Grab the index of the project we're going to open
	$("div.project").get(i).addClass("active");
}

function new_todo(event) {
	var active_project = $("div.project.active");
	add_todo(active_project);
}

function new_project(event) {
	create_new_project();
}

function mark_todo(event) {
	// Get the index of the todo we'll mark.
	var specific_todo = $("div.project.active div.single-todo div.checkbox").removeClass("unfinished").addClass("done");
}

$(document).on("keypress", handle_keypress);