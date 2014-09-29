//Load castIn app before page load
// (function(){

// })();

$(document).ready(function(){
	$("#btn_search_device").on('click',function(){
		searchDevices();
	});
});
$( window ).load(function() {
  //initial search afer page load
  // searchDevices();
});
function searchDevices(){
	chrome.management.launchApp('eohcfghkiaeanigmfimkghfhagphemod', function(response){
		console.log('launch App',response);
	});
}