// Makes every expandable div inactive again, and hides the dropdown menus.
function clear_selections(obj) {
	if (!(obj.classList.contains("locked"))) {
		$(".innerpic").removeClass("locked");
		$(".outer").removeClass("locked");

		$("div.options").css("visibility", "hidden");
		$("div.options").css("top", "55%");
	}
}

// Reveals the dropdown menu for the given group of links.
function make_dropdown(obj) {

	// First, we'll clear out any previous selections. 
	clear_selections(obj);

	// First, we'll lock this selection in place.
	obj.parentElement.classList.add("locked");
	obj.children[0].classList.add("locked");

	//Then, let's make the objectbox appear. 
	var optionsbox = obj.nextSibling.nextSibling;
	optionsbox.style.visibility = "visible";
	optionsbox.style.left = obj.style.left; 
	optionsbox.style.top = "180%";

}



// ----



var icons = ["url('images/globe.png')", "url('images/reddit.png')", "url('images/glogo.png')", "url('images/facebook.png')", "url('images/youtube.png')"];
var prefixes = ["http://www.", "http://www.reddit.com/r/", "https://www.google.com/search?q=", "https://www.facebook.com/search/top/?q=", "https://www.youtube.com/results?search_query="];
var index = 0;

// Whenever the user presses the tab button,
$('html').on('keydown', '#maintext', function(e) {
    if (e.which == 9) {
        e.preventDefault();

        // We move to the next prefix and icon.
        index += 1;
        $("input#maintext").css("background-image", icons[index % icons.length]);
    }

    // Or with an enter key press...
    if (e.which == 13) {
    	e.preventDefault();

    	//Navigate to that website. 
    	var value = $("#maintext").val();
    	var url = prefixes[index % prefixes.length].concat(value.replace(" ", "%20"));
    	window.location.href = url; 
    }
});



// ---



// Fill the datetime with the current datetime.
function fillDateTime() {
	var d = new Date(),
	    minutes = d.getMinutes().toString().length == 1 ? '0'+d.getMinutes() : d.getMinutes(),
	    hours = d.getHours(),
	    ampm = d.getHours() >= 12 ? 'pm' : 'am',
	    months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],
	    days = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
		time = hours+":"+minutes+ampm+" on "+days[d.getDay()]+', '+months[d.getMonth()]+' '+d.getDate()+' '+d.getFullYear();
	$("#datetime").html("It is "+time);
}
fillDateTime();

// And do it again every 10 seconds.
setInterval(fillDateTime, 10000);

// Enable mouseover events for all div.outer elements
$("div.outer").mouseover(function() {
	var t = this;
	clear_selections(t);
});

// Enable the clicking event for the head divs.
$("div.headdiv").click(function() {
	var t = this;
	make_dropdown(t);
});