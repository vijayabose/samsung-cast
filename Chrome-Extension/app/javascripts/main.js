
//Contain all controller logic for the app
var app = {
    maxRetry : 4,
    loading : function() {
        // add the overlay with loading image to the page
        var over = '<div id="overlay">' +
            '<img id="loading" src="img/loading.gif">' +
            '</div>';
        $(over).appendTo('body');
    },
    removeLoading : function() {
        $('#overlay').remove();
    },
    displayDevices : function(list){
         if(list.length > 0){
            var deviceId = list.length - 1;
            var html = '';
            for(var i = 0; i < list.length ; i++){
                var obj = list[0];
                //add text box and send button for the connected device
                var textHtml = "<br /> <input type=\"text\" id=\"sendData_"+deviceId+"\" value=\"\" placeholder=\"Paste Youtube URL\" style=\"width:300px\"><input id=\"sendButton_"+deviceId+"\"  class=\"sendButton\" type=\"button\" value=\"Send to Tv\"/>";
                //Show message after sending data to TV
                var htmlSendMessage = "<br /> <div id=\"sendDataMessage_"+deviceId+"\"></div>"
                html += "<li id=\"device_"+deviceId+"\"><a deviceId=\""+deviceId+"\" class=\"device\" href=\"#\"><img src=\"\" id=\"img_"+deviceId+"\" style=\"display:none;\"/>"+obj.deviceName+"</a>"+textHtml+htmlSendMessage+"</li>";
                var xmlHTTP = new XMLHttpRequest();
                xmlHTTP.open('GET',obj.imageUrl,true);
                // Must include this line - specifies the response type we want
                xmlHTTP.responseType = 'arraybuffer';
                xmlHTTP.onload = function(e)
                {
                    var arr = new Uint8Array(this.response);
                    // Convert the int array to a binary string
                    // We have to use apply() as we are converting an *array*
                    // and String.fromCharCode() takes one or more single values, not
                    // an array.
                    var raw = String.fromCharCode.apply(null,arr);
                    var b64=btoa(raw);
                    var dataURL="data:image/png;base64,"+b64;
                    $("#img_"+deviceId).attr("src", dataURL);
                    $("#img_"+deviceId).fadeIn();
                };
                xmlHTTP.send();
            }
            $("#devicelist").html(html);
            $("#message").hide();
        }else{
           if($.trim($("#devicelist").html())=='') {
             //$("#message").html("Could not find any TV in the network Or TV is switched off!!!");  
           }else{
            $("#message").hide();
           }
        }
        app.removeLoading();
    },
    getYoutubeId : function(url){
        var videoid = url.match(/(?:https?:\/{2})?(?:w{3}\.)?youtu(?:be)?\.(?:com|be)(?:\/watch\?v=|\/)([^\s&]+)/);
        if(videoid != null) {
           videoid = videoid[1];
        } else { 
            videoid = "";
        }
        return videoid;
    }
};

$(document).ready(function(){
	$("#btn_search_device").on('click',function(){
        app.loading();
		network.scan();
	});

    $("body").on("zcast_device_list",function(event,list,error){
        if(list.length > 0){
            //List devices in the network
            app.displayDevices(list);
        }else{
            //Show error in the view
            app.displayDevices([]);
        }
    });
    //Send data to device. Connect and send
	$(".sendButton").live('click',function(){
	  /** 
	   * Create following type of URL and send to connect
	   * http://127.0.0.1:8080/ws/app/Canvas_NewOCI/connect
	   * console.log(network.DEVICES[0].host/ws/app/);
	   */     
      var deviceId = $(this).attr('id').split("_")[1];
      var device = network.DEVICES[deviceId];
	  var ipaddress = device.host; 
      var ipaddress = "192.168.1.31:8080";
      var message = $("#sendData_"+deviceId).val();
      message = app.getYoutubeId(message);
      tv.send(ipaddress,deviceId,message);
      //If data sending to TV fail, then try again
      $("#device_"+deviceId).on("zcast_device_queued",function( event, deviceId, status){
        var device = network.DEVICES[deviceId];
        var ipaddress = device.host; 
        var message = $("#sendData_"+deviceId).val();
        message = app.getYoutubeId(message);
        //If status is failure the connect to tv again and try for retry
        if(status == 'failure' && device.retryCount <= device.maxRetry){
            //try connecting to tv and and send message again
            tv.send(ipaddress,deviceId,message);
            device.retryCount = device.retryCount + 1;
            network.DEVICES[deviceId] = device;
        }else{
            device.retryCount = 0;
            network.DEVICES[deviceId] = device;
        }
      });
    });
});
// console.log("Sending Data");
    //         //Send some data
    //         var message = {"message": "Hello smart device, this is a broadcast message."};
    //         sendData();