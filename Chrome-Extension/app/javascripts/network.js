var network = {
  M_SEARCH_REQUEST : "M-SEARCH * HTTP/1.1\r\nHOST:239.255.255.250:1900\r\nMAN:\"ssdp:discover\"\r\nST:ssdp:all\r\nMX:1\r\n\r\n",
  udpAddress : "239.255.255.250",
  udpPort : 1900,
  socketId : "",
  socket : chrome.sockets,
  DEVICE_LIST : [],
  DEVICES : [],
  str2ab : function(str) {
	  var buf=new ArrayBuffer(str.length);
	  var bufView=new Uint8Array(buf);
	  for (var i=0; i<str.length; i++) {
	    bufView[i]=str.charCodeAt(i);
	  }
	  return buf;
   },
   ab2str : function(buf) {
	  return String.fromCharCode.apply(null, new Uint8Array(buf));
   },
   //Scan network for other share devices
   scan : function(){
	//scan network for upnp
	network.socket.udp.create({}, function(socketInfo) {
	  network.socketId = socketInfo.socketId;
	  network.socket.udp.onReceive.addListener(network.onReceive);
	  network.socket.udp.setPaused(network.socketId,false);
	  network.socket.udp.bind(socketInfo.socketId, '0.0.0.0', 0, function (info) {
	    network.socket.udp.getInfo(socketInfo.socketId, function(result){
			if(result < 0) {
		      console.log(chrome.runtime.lastError.message);
		    } else {
		       network.read();
		    }
	    });
	   });
	 });
	},
	read: function(){
		var ab = network.str2ab(network.M_SEARCH_REQUEST);
		network.socket.udp.send(network.socketId,ab,network.udpAddress,network.udpPort, function(sendInfo){
			//console.log("Send Info:",sendInfo);
		});
	},
	onReceive : function(info){
		if(info.data){
		  var result = network.ab2str(info.data);
		  result = result.split("\n");
		  var url = result[4];
		  url = url.substr(url.indexOf(": ") + 2);
		  var oldDeviceCount = '';
		  for(var i =0; i < result.length; i++){
		  	oldDeviceCount = network.DEVICE_LIST.length;
		  	network.DEVICE_LIST.push(url);
		  	network.DEVICE_LIST = $.unique(network.DEVICE_LIST);
		  	//Get device information and store
		  	if(network.DEVICE_LIST.length != oldDeviceCount){
		  		network.getDeviceInfo(url);
		  	}
		  }
		}
	},
	getDeviceInfo : function(url){
		error = null;
		if(url){
		  $.get(url,function(data,status){
			  	var device=  $(data.lastChild).find('device');
			  	var deviceType = device.find("deviceType").text();
			  	var host = (url.match(/:\/\/(.[^/]+)/)[1]).replace('www.','');
			  	if( deviceType == 'urn:schemas-upnp-org:device:MediaRenderer:1'){
			  		var deviceName = device.find("friendlyName").text();
				  	var imageUrl = null;
				  	device.find('iconList').find('icon').each(function(index){
				  		imageUrl = $(this).find('url').text();
			        });
			        imageUrl = 'http://'+ host + imageUrl;
					device.find('serviceList').find('service').each(function(index){
						var serviceType = $(this).find('serviceType').text();
						var baseUrl = 'http://'+ host;
						if( serviceType == "urn:schemas-upnp-org:service:AVTransport:1"){
							var device = {'url' : url,
							'serviceType' : serviceType,
							'serviceId' : $(this).find('serviceId').text(),
							'controlURL' : $(this).find('controlURL').text(),
							'eventSubURL' : $(this).find('eventSubURL').text(),
							'SCPDURL' : $(this).find('SCPDURL').text(),
							'baseUrl' : baseUrl,
							'host' : host,
							'imageUrl' : imageUrl,
							'maxRetry' : app.maxRetry,
							'retryCount' : 0,
							'deviceName' : deviceName
							};
							network.DEVICES.push(device);
						}
					});
					//Trigger custom event with list of devices
					$("body").trigger("zcast_device_list",[network.DEVICES,error]);
			  	 }else{
			  		error = "true";
			  	 }
		  	});
	  	}
	}
};
chrome.sockets.udp.onReceiveError.addListener(function(info){
  console.log("Error");
});






// var M_SEARCH_REQUEST = "M-SEARCH * HTTP/1.1\r\nHOST:239.255.255.250:1900\r\nMAN:\"ssdp:discover\"\r\nST:ssdp:all\r\nMX:1\r\n\r\n";
// var M_SET_REQUEST = "";
// var M_PLAY_REQUEST = "";
// var address = "239.255.255.250";
// var port = 1900;
// var data = null; 
// var socketId = "";
// var socket = chrome.sockets;
// var serverSocket;
// var clientSocket;
// var DEVICE_LIST = [];
// var DEVICES = [];
// var castInExtensionId = "cckfaigigoolfnpihgipainmneajghme";
// // From https://developer.chrome.com/trunk/apps/app_hardware.html
// var str2ab=function(str) {
//   var buf=new ArrayBuffer(str.length);
//   var bufView=new Uint8Array(buf);
//   for (var i=0; i<str.length; i++) {
//     bufView[i]=str.charCodeAt(i);
//   }
//   return buf;
// }


// From https://developer.chrome.com/trunk/apps/app_hardware.html
// var ab2str=function(buf) {
//   return String.fromCharCode.apply(null, new Uint8Array(buf));
// };

//Scan network for other share devices
// function scannetwork(){
// //scan network for upnp
// self.socket.udp.create({}, function(socketInfo) {
//   self.socketId = socketInfo.socketId;
//   self.socket.udp.onReceive.addListener(onReceive);
//   self.socket.udp.setPaused(self.socketId,false);
//   self.socket.udp.bind(socketInfo.socketId, '0.0.0.0', 0, function (info) {
//     self.socket.udp.getInfo(socketInfo.socketId, function(result){
// 		if(result < 0) {
// 	      console.log(chrome.runtime.lastError.message);
// 	    } else {
// 	       read();
// 	    }
//     });

//    });

//  });
// }
// function read(){
// 	var ab = str2ab(self.M_SEARCH_REQUEST);
// 	self.socket.udp.send(self.socketId,ab,'239.255.255.250',1900, function(sendInfo){
// 		//console.log("Send Info:",sendInfo);
// 	});
// }
// function onReceive(info){
// 	if(info.data){
// 	  var result = ab2str(info.data);
// 	  result = result.split("\n");
// 	  var url = result[4];
// 	  url = url.substr(url.indexOf(": ") + 2);
// 	  var oldDeviceCount = '';
// 	  for(var i =0; i < result.length; i++){
// 	  	oldDeviceCount = self.DEVICE_LIST.length;
// 	  	self.DEVICE_LIST.push(url);
// 	  	self.DEVICE_LIST = $.unique(self.DEVICE_LIST);
// 	  	//Get device information and store
// 	  	if(self.DEVICE_LIST.length != oldDeviceCount){
// 	  		getDeviceInfo(url);
// 	  	}
// 	  }
// 	}
// }
// function getDeviceInfo(url){
// 	if(url){
// 	  $.get(url,function(data,status){
// 	  	var device=  $(data.lastChild).find('device');
// 	  	var deviceType = device.find("deviceType").text();
// 	  	var host = (url.match(/:\/\/(.[^/]+)/)[1]).replace('www.','');
// 	  	if( deviceType == 'urn:schemas-upnp-org:device:MediaRenderer:1'){
// 	  		var deviceName = device.find("friendlyName").text();
// 		  	var imageUrl = null;
// 		  	device.find('iconList').find('icon').each(function(index){
// 		  		imageUrl = $(this).find('url').text();
// 	        });
// 	        imageUrl = 'http://'+ host + imageUrl;
// 			device.find('serviceList').find('service').each(function(index){
// 				var serviceType = $(this).find('serviceType').text();
// 				var baseUrl = 'http://'+ host;
// 				if( serviceType == "urn:schemas-upnp-org:service:AVTransport:1"){
// 					var device = {'url' : url,
// 					'serviceType' : serviceType,
// 					'serviceId' : $(this).find('serviceId').text(),
// 					'controlURL' : $(this).find('controlURL').text(),
// 					'eventSubURL' : $(this).find('eventSubURL').text(),
// 					'SCPDURL' : $(this).find('SCPDURL').text(),
// 					'baseUrl' : baseUrl,
// 					'host' : host,
// 					'imageUrl' : imageUrl
// 					};
// 					self.DEVICES.push(device);
// 				}
// 			});
// 	        if(imageUrl){
// 	        	var deviceId = self.DEVICES.length - 1;
// 	        	$("#devicelist").append("<li id=\"device_"+deviceId+"\"><a deviceId=\""+deviceId+"\" class=\"device\" href=\"#\"><img src=\"\" id=\"img_"+deviceId+"\" style=\"display:none;\"/>"+deviceName+"</a></li>");
// 				var xmlHTTP = new XMLHttpRequest();
// 			    xmlHTTP.open('GET',imageUrl,true);
// 			    // Must include this line - specifies the response type we want
// 			    xmlHTTP.responseType = 'arraybuffer';
// 			    xmlHTTP.onload = function(e)
// 			    {
// 			        var arr = new Uint8Array(this.response);
// 			        // Convert the int array to a binary string
// 			        // We have to use apply() as we are converting an *array*
// 			        // and String.fromCharCode() takes one or more single values, not
// 			        // an array.
// 			        var raw = String.fromCharCode.apply(null,arr);
// 			        var b64=btoa(raw);
// 			        var dataURL="data:image/png;base64,"+b64;
// 			        $("#img_"+deviceId).attr("src", dataURL);
// 			        $("#img_"+deviceId).fadeIn();
// 			    };
// 			    xmlHTTP.send();
// 	        }
// 	  	}else{
// 	  		$("#message").html("Could not find any TV in the network Or TV is switched off!!!");
// 	  	}
// 	  	//Remove search
//   	  });
// 	}
// }