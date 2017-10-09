/* --- Choose the cinemagraph randomly from our list. --- */

// Randomly choose the cinemagraph to load
var pics = ["daftpunk.gif", "tuning.gif", "bikers.gif", "city.gif", "waterfalls.gif", "hot air balloon2.gif", "fireplace2.gif", "boston.gif"];
var cs = ["rgb(182,181,193)", "rgb(166,187,178)", "rgb(195,194,165)", "rgb(204,153,93)", "rgb(51,256,51)", "rgb(255,255,255)", "rgb(255,255,255)", "rgb(255,255,255)"];

var index = Math.floor(Math.random()*pics.length);
var img = "images/" + pics[index];
var color = cs[index];
document.styleSheets[0].addRule("#cinemagraph:before, #cinemagraph:after", "border-color: "+"white"+";", 18);
$("#background").attr("src", img);
$("#cinemagraph > img").attr("src", img);


/* --- Menu creation and fancy background stuff --- */


// When you click the cinemagraph in the middle, 
// Make the background appear and turn this into a black box.
var in_menu = false;
$("#cinemagraph").click(function() {
	$("#background").css("opacity", "0.5");
	$("#cinemagraph img").css("opacity", "0");
	$("#inner").css("z-index", "4");
	$("#cinemagraph").addClass("clicked");
	in_menu = true;
});

// If you click the background, reverse that effect.
$("#background").click(function() {
	$("#background").css("opacity", "0");
	$("#cinemagraph img").css("opacity", "1");
	$("#inner").css("z-index", "0");
	$("#cinemagraph").removeClass("clicked");
	in_menu = false;
});


/* --- Show the user the current time in military time --- */


// Fill the datetime element with the current date and time in text form.
var int_to_month = {0: "January", 1: "February", 2: "March", 3: "April", 4: "May", 
					5: "June", 6: "July", 7: "August", 8: "September", 9: "October", 10: "November", 11: "December"};
function getTime() {
	var date_obj = new Date();
	var minute_str = date_obj.getMinutes();
	if (minute_str < 10) {minute_str = "0"+minute_str;}
	var datestr = int_to_month[date_obj.getMonth()] + " " + date_obj.getDate() + ", " + date_obj.getFullYear();
	var timestr = date_obj.getHours() + ":" + minute_str;
	var str = "It is " + timestr + " on " + datestr + ".";
	$("#datetime p").html(str);
}
getTime();
setInterval(getTime, 2000);


/* --- Grab the current weather - hardcoded for College Park. --- */


// Get the current weather for College Park.
function getWeather() {
	$.simpleWeather({
		location: "College Park, MD",
		woeid: "",
		unit: "f",
		success: function(weather) {
			var str = "Right now, it's " + weather.temp + "&deg; and " + weather.currently.toLowerCase() + " in " + weather.city + ".";
			$("#weather").html(str);
		},
		error: function(error) {
			$("#weather").html("There was an error retreiving weather data.");
		}
	});
}
getWeather();
setInterval(getWeather, 60000);


/* --- Handle enter button presses --- */


// Whenever the user presses the enter button,
$('html').on('keydown', function(e) {
    if (e.which == 13) {
    	e.preventDefault();
    	var entry = $("#search_bar input").first().val();
    	if (in_menu && entry.length > 0) {
			entry = entry.replace(" ", "%20");
			window.location.href = "http://www.google.com/search?q=" + entry;
		} else if (in_menu) {
			document.getElementById("background").click();
		} else {
			document.getElementById("cinemagraph").click();
		}
    }
});