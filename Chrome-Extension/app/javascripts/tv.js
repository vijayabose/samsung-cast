appId = 'zcast';
var tv = {
  deviceId : '',	
  ipaddress : '',
  message : '',	
  connectUri : '/ws/app/'+appId+'/connect',
  dataSendUri : '/ws/app/'+appId+'/queue',
  connect : function(ipaddress,deviceId) {
		url = "http://"+ipaddress+tv.connectUri;
		console.log(url);
	    $.ajax({
	        type: "POST",
	        dataType:'json',
	        crossDomain: 'true',
	        url: url,
	        async: true,    // if set to non-async, browser shows page as "Loading..."
	        cache: false,
	        timeout: 3000,  // timeout in ms
	        beforeSend: function (xhr) {
	            xhr.setRequestHeader("SLDeviceID", "55989");
	            // xhr.setRequestHeader("contentType", "text/xml");
	            xhr.setRequestHeader("VendorID", "VenderMe");
	            xhr.setRequestHeader("DeviceName", "Test");
	            xhr.setRequestHeader("GroupID", "feiGroup");
	            xhr.setRequestHeader("ProductID", "SMARTDev");
	            xhr.setRequestHeader("connect", "close");
	        },
	        success: function(data,status){
	        	//Trigger custom event regarding tv connection
	        	$("#device_"+deviceId).trigger("zcast_device_connected", [deviceId]);
	        },
	        statusCode: {
	            404: function () {
	                console.log("404 TV application not running. ");
	                $("#sendDataMessage_"+deviceId).html("404 TV application not running. ");
	            },
	            409: function () {
	                console.log("409 conflict on device ID. ");
	                $("#sendDataMessage_"+deviceId).html("409 conflict on device ID. ");
	            },
	            500: function () {
	                console.log("500 server internal error 500 ");
	                $("#sendDataMessage_"+deviceId).html("500 server internal error 500 ");
	            },
	            503: function () {
	                console.log("503 server may reach maximum connections ");
	                $("#sendDataMessage_"+deviceId).html("503 server may reach maximum connections ");
	            },
	            200: function () {
	                console.log("Sending Data .");
	                $("#sendDataMessage_"+deviceId).html("Sending Data .");
	                chrome.alarms.create("alarmSendData", {delayInMinutes: 0.1, periodInMinutes: 0.2});
	            }
	        }
	    });
	},
	/** 
	 * Send will connect to TV and send data
	 * @param  {string} ipaddress [TV ipaddress]
	 * @param  {string} deviceId  [device id]
	 * @param  {string} message   [message to send]
	 * @return {void}           [description]
	 */
 	send : function(ipaddress,deviceId,message){
 		//Connect to TV 
 		tv.ipaddress = ipaddress;
 		tv.deviceId = deviceId;
 		tv.message = message;
 		tv.connect(ipaddress,deviceId);

	},

	//This should be a private member
	sendData : function(){
		var url = "http://"+tv.ipaddress+tv.dataSendUri	;
	    $.ajax({
	        type: "POST",
	        url: url,
	        data: tv.message,
	        contentType: 'json',
	        async: true,   // if set to non-async, browser shows page as "Loading..."
	        cache: false,
	        timeout: 3000,  // timeout in ms
			beforeSend: function (xhr) {
	            xhr.setRequestHeader("SLDeviceID", "55989");
	        },
	        success:  function(){
	        	//Trigger message with success/failure send to tv
	            $("#device_"+tv.deviceId).trigger("zcast_device_queued", [tv.deviceId,'success']);
	            console.log("Success");
	            $("#sendDataMessage_"+tv.deviceId).html("Streaming started");
	        },
	        error:  function(){
	        	console.log("Error");
	        	$("#device_"+tv.deviceId).trigger("zcast_device_queued", [tv.deviceId,'failure']);
	        	$("#sendDataMessage_"+tv.deviceId).html("Error Sending Data");
	        }
	    });
	}
};

chrome.alarms.onAlarm.addListener(function(alarm) {
  if (alarm.name == 'alarmSendData') {
  	  tv.sendData();
  	  //Clear alarm after use
  	  chrome.alarms.clear('alarmSendData');
    }
});

