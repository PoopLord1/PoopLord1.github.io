function close_active_project() {
	$("div.project.active").removeClass("active");
}

function open_project(index) {
	// We are given the index of the project we're going to open
	$("div.project").removeClass("active");
	$("div.project").get(index).className = "project active";
}

function new_todo() {
	var active_project = $("div.project.active");
	add_todo(active_project);
	assign_handlers();
	click_checkbox();
	active_project.find("div.single-todo input").first().focus();
}

function new_project() {
	create_new_project();
}

function clean_project() {
	delete_finished_todos($("div.project.active"));
}

function mark_todo(index) {
	// Get the index of the todo we'll mark.
	var specific_todo = $("div.project.active div.single-todo div.checkbox").get(index);
	if ($(specific_todo).hasClass("done")) {
		$(specific_todo).removeClass("done").addClass("unfinished");
	} else {
		$(specific_todo).removeClass("unfinished").addClass("done");
	}
}

function focus_search_bar() {
	$("input#search").focus();
}

// Handle a generic keypress, and branch based on the input.
function handle_keypress(event) {
	var key = event.key;

	// If an input has focus, do not do anything based on the event.
	var inputHasFocus = $("input:focus").length != 0;
	if (inputHasFocus) {
		return;
	}

	// A number on the keypad opens a project or changes the marking on a Todo
	if ((!isNaN(key)) && (parseInt(key) > 0) && (parseInt(key) < 10)) {
		var hasOpenProject = $("div.project.active").length != 0;
		if (hasOpenProject) {
			mark_todo(parseInt(key) - 1);
		} else {
			open_project(parseInt(key) - 1);
		}
	}

	// The escape key closes all projects
	if (key === "Escape") {
		close_active_project();
	}

	// The tab key automatically focuses on the search bar
	if (key === "Tab") {
		event.preventDefault()
		focus_search_bar();
	}

	// The N key creates a new Project or a new Todo Item in the current project
	if (key === "n") {
		var hasOpenProject = $("div.project.active").length != 0;
		if (hasOpenProject) {
			new_todo();
		} else {
			new_project();
		}
		event.preventDefault();
	}

	// The C key cleans up the current open project
	if (key === "c") {
		var hasOpenProject = $("div.project.active").length != 0;
		if (hasOpenProject) {
			clean_project();
		}
	}
}

$("body").keydown(handle_keypress);