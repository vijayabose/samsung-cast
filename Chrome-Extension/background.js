

chrome.runtime.onInstalled.addListener(function (object) {
   	//After the installation of this app install castIn Chrome App
    // chrome.tabs.create({url: "http://yoursite.com/"}, function (tab) {
    //     console.log("New tab launched with http://yoursite.com/");
    // });
});


chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    alert("hi");
  });