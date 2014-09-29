var nservice = window.webapis.nservice || {},
gnNserviceDeviceID = -1,    // Device id
gsDevName = "",
gsInputMsg = "no input yet";

var messagesystem = {};
//When device status change
messagesystem.onDeviceStatusChange = function (sParam) {
    alert("#### onDeviceStatusChange - Device status change recieved ####");
    alert("#### onDeviceStatusChange - event type is " + sParam.eventType + " ####");
    alert("#### onDeviceStatusChange - event device name is " + sParam.deviceName + " ####");
    alert("#### onDeviceStatusChange - event device type is " + sParam.deviceType + " ####");
    switch (Number(sParam.eventType)) {
        case nservice.MGR_EVENT_DEV_CONNECT:
            alert("#### onDeviceStatusChange - MGR_EVENT_DEV_CONNECT ####");
            if (sParam.deviceType == nservice.DEV_SMART_DEVICE) {
                //$("#welcome").html("Connected NService: " + sParam.deviceName);
            }
            break;
        case nservice.MGR_EVENT_DEV_DISCONNECT:
        	 alert("#### onDeviceStatusChange - MGR_EVENT_DEV_DISCONNECT ####");
            break;

        default:
            alert("#### onDeviceStatusChange - Unknown event ####");
            break;

    }
    nservice.getNServiceDevices(messagesystem.onNserviceObtained);
};
// messagesystem.onNserviceObtained Called by getNServiceDevices in Main.onDeviceStatusChange
//callback function when a device is connected or disconnected.
messagesystem.onNserviceObtained = function (nservices) {
 if (nservices.length > 0) {
     alert("#### onNserviceObtained - found " + nservices.length + " nservice device(s) ####");
     if (nservices[0]!= null && nservices[0].getType() == nservice.DEV_SMART_DEVICE) {
         alert("#### onNserviceObtained - get device instance ####");
         nservicedeviceInstance = nservices[0];
         nservicedeviceInstance.registerDeviceCallback(messagesystem.onDeviceEvent);
     }
 } else {
     alert("#### onNserviceObtained - no nservice device found ####");
 }
};


//messagesystem.onDeviceEvent is called when device instance event arrive.
//Example displays event type on console
//and on message arrival performs other functions provided by NService interface.

messagesystem.onDeviceEvent = function (sParam) {
 switch (Number(sParam.eventType)) {
     case nservice.DEV_EVENT_MESSAGE_RECEIVED:
         // alert("#### onDeviceEvent - DEV_EVENT_MESSAGE_RECEIVED ####");
         messagesystem.onMessageReceived(sParam.eventData.message, sParam.eventData.context);
         break;
     case nservice.DEV_EVENT_JOINED_GROUP:
         alert("#### onDeviceEvent - DEV_EVENT_JOINED_GROUP ####");
         break;
     case nservice.DEV_EVENT_LEFT_GROUP:
         alert("#### onDeviceEvent - DEV_EVENT_LEFT_GROUP ####");
         break;
     default:
         alert("#### onDeviceEvent - Unknown event ####");
         break;
 }
};

messagesystem.onMessageReceived = function (message, context) {
    // message -> message body
    // context -> message context (headers and etc)
    alert("#### onMessageReceived:" + message);
    // if(message.type == 'yt'){
    	//pass youtube id to youtube player
    	youtube.changeVideo(message);
    // }
}