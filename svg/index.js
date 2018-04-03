// Generates all the lines for our svg background
var svg_height = 24.0;
var svg_width = 24.0;
function generate_lines() {
	for (var coord_x = 0; coord_x < 80; coord_x++) {
		for (var coord_y = 0; coord_y < 42; coord_y++) {

			var x = coord_x * svg_width;
			var y = coord_y * svg_height;
			var pol = ((coord_x + coord_y) % 2) * 2 - 1;

			var lobj = document.createElementNS("http://www.w3.org/2000/svg", "line");    // Create with DOM
			lobj.setAttribute("x1", x);
			lobj.setAttribute("y1", y - pol*0.5*(svg_height-6));
			lobj.setAttribute("x2", x + svg_width - 6.0);
			lobj.setAttribute("y2", y + pol*0.5*(svg_height-6));
			lobj.setAttribute("class", "invis");
			// lobj.setAttribute("class", "dormant");
		    $("#outer").append(lobj);
		} 
	}

	setTimeout(function () {
		$("line").removeClass("invis").addClass("dormant");
	}, 500);
}


var color_classes = ["pink", "blue", "green", "white"];
var i = 0;
// Chooses a random color, and makes the chosen SVG line glow that color.
function wake_and_color_line(jobj) {
	var len = color_classes.length;
	var rand_i = Math.floor(Math.random()*len);
	var color = color_classes[rand_i];
	color = color_classes[i];
	jobj.removeClass("dormant").addClass("awake").removeClass("white").addClass(color);
	i = (i + 1) % len;

	// and color the title just for funsies
	$("div#main_div").attr("class", "").addClass(color);
}
// Changes the line's opacity and stroke-width to be 'normal' again.
function sleep_line(jobj) {
	jobj.removeClass("awake").addClass("dormant");
}
// Changes the line's color to be white once more. 
// This must be separate from sleep_line, because we want the line to remain this color
	// as it fades away
function uncolor_line(jobj) {
	jobj.removeClass("pink").removeClass("green").removeClass("blue").removeClass("white").addClass("white");
}

function create_line_noise() {
	var avg_ms_for_line_wake = 1000; // 1500 was nice and relaxed
	var batch_size = 30;
	var noise_in_timing = 400;
	
	for (var i=0; i < batch_size; i++) {
		var rand = 2 * noise_in_timing * Math.random() - noise_in_timing;
		var timeout = i * avg_ms_for_line_wake + rand;
	
		setTimeout(function() {
			var lst = $("line").toArray();

			var elemlength = lst.length;
			var randomnum = Math.floor(Math.random()*elemlength);
			var randomitem = lst[randomnum];
			wake_and_color_line($(randomitem));
			setTimeout(sleep_line, 2000, $(randomitem));
			setTimeout(uncolor_line, 2800, $(randomitem));
		}, timeout);
	}

	setTimeout(create_line_noise, batch_size * avg_ms_for_line_wake);

}

generate_lines();
// create_line_noise();