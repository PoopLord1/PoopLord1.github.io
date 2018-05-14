function populate_calendar() {
	// Find the current month
	var date_obj = new Date();
	var month_i = date_obj.getMonth().toString();
	var year_i = date_obj.getFullYear().toString();
	var day_in_month_i = date_obj.getDate();

	// Find the day of the week the current month starts on
	var first_date_obj = new Date(year_i, month_i, 1);
	var first_weekday_num = first_date_obj.getDay();

	// Populate with the appropriate number of "ghost" days
	for (var num_ghost_days=0; num_ghost_days < first_weekday_num; num_ghost_days++) {
		$("#calendar").append("<div class='day ghost'></div>");
	}

	// Then find the right number of days in the month
	var last_date_obj = new Date(year_i, month_i+1, 0);
	var num_days_in_month = last_date_obj.getDate();

	// Count up to that number, adding a new day each time
	for (var i=1; i <= num_days_in_month; i++) {
		// Add the "today" class when you find today's date
		if (i == day_in_month_i) {
			$("#calendar").append("<div class='day today'></div>");		
		} else {
			$("#calendar").append("<div class='day'></div>");
		}
	}
}

populate_calendar();