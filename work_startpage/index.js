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
}

// Removes and re-assigns all event handlers for p objects and input objects
function assign_handlers() {
	$(".project-content p").off();
	$(".project-content p").click(function() {
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

remove_active_project();
click_project();
click_checkbox();
assign_handlers();