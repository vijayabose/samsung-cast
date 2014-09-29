chrome.app.runtime.onLaunched.addListener(function(data){

 chrome.app.window.create('index.html', {}, function(){});

});