// Randomly choose a picture from our collection.
var pics = ["koi.jpg", "hiking.jpg", "keyboards.jpg", "w0w gears.jpg", "city.jpg", "rocks.jpg"];
var rand = parseInt(pics.length * Math.random());
var img_url = "images/" + pics[rand];
$("#top_img").attr("src", img_url);
$("#top_background").attr("src", img_url);
console.log(img_url);


// Float the images up and bring the card into view.
setTimeout(function() {
	$("#top_img").css("opacity", "1.0").css("top", "calc(20% - 4px)");
	$("#top_background").css("top", "-50%");
}, 63);

// Explanation for the timeout function:
// The $(window).onload() method would work, but there are no actual images in the html 
// 		that need to be loaded.
// So, if the first half of the javascript code was too slow to load its images, then
// 		the new css attributes would be applied before the images were finished loading. 
// 		So we just got the page loaded statically.
// Now, we wait on applying the new css rules until the hard drive has definitely read the new image.
//		(63 milliseconds was taken by repeatedly halving 1000ms until satisfied - so it's arbitrary.)