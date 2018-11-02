// Generates a project based on the localstorage object
function create_project_node(projects_obj, project_name) {
	// Generate the overarching project node
		var project_node = document.createElement("div");
		project_node.className = "project";

		// And then the title and sub-title
		var heading_node = document.createElement("div");
		heading_node.className = "heading";

		var title_node = document.createElement("p");
		title_node.className = "title";
		
		var title_text = document.createTextNode(project_name);
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
		var todo_list = projects_obj[project_name]["todos"];
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
		
		// Create the icons-box div
		var icon_box_node = document.createElement("div");
		icon_box_node.className = "icon-box";

		// Create the "new-todo" button
		var add_todo_node = document.createElement("div");
		add_todo_node.className = "icon add-todo";
		var add_todo_img_node = document.createElement("img");
		add_todo_img_node.src = "imgs/plus.png";
		add_todo_node.appendChild(add_todo_img_node);
		icon_box_node.appendChild(add_todo_node);

		// Create the "Remove finished todos" text
		var add_todo_node = document.createElement("div");
		add_todo_node.className = "icon clean-todo";
		var add_todo_img_node = document.createElement("img");
		add_todo_img_node.src = "imgs/brush.png";
		add_todo_node.appendChild(add_todo_img_node);
		icon_box_node.appendChild(add_todo_node);

		project_content_node.appendChild(icon_box_node);
		project_node.appendChild(project_content_node);

		return project_node;
}

//Create an empty project
function generate_empty_project() {
	var project_node = document.createElement("div");
	project_node.className = "project";

	// And then the title and sub-title
	var heading_node = document.createElement("div");
	heading_node.className = "heading";

	var title_node = document.createElement("p");
	title_node.className = "title";

	var title_input = document.createElement("input");
	title_input.type = "text";
	title_input.className = "edit_project_input_p";
	title_node.appendChild(title_input);

	var subtitle_node = document.createElement("p");
	subtitle_node.className = "subtitle";

	heading_node.appendChild(title_input); // drop anything concerning title_node if this works.
	heading_node.appendChild(subtitle_node);
	project_node.appendChild(heading_node);

	// Create the project content
	var project_content_node = document.createElement("div");
	project_content_node.className = "project-content";

	// Create the icons-box div
	var icon_box_node = document.createElement("div");
	icon_box_node.className = "icon-box";

	// Create the "new-todo" button
	var add_todo_node = document.createElement("div");
	add_todo_node.className = "icon add-todo";
	var add_todo_img_node = document.createElement("img");
	add_todo_img_node.src = "imgs/plus.png";
	add_todo_node.appendChild(add_todo_img_node);
	icon_box_node.appendChild(add_todo_node);

	// Create the "Remove finished todos" text
	var add_todo_node = document.createElement("div");
	add_todo_node.className = "icon clean-todo";
	var add_todo_img_node = document.createElement("img");
	add_todo_img_node.src = "imgs/brush.png";
	add_todo_node.appendChild(add_todo_img_node);
	icon_box_node.appendChild(add_todo_node);

	project_content_node.appendChild(icon_box_node);
	project_node.appendChild(project_content_node);

	return project_node;
}
