var widgetAPI = new Common.API.Widget();
var tvKey = new Common.API.TVKeyValue();
var app ={};
app.getCurrentSelection = function(){
	selectData = $('.selected').attr('id').split('-');
	return { "type" : selectData[0],
			 "row" : Number(selectData[1]),
			 "column" : Number(selectData[2])
	};
}
app.MAIN_PAGE = "mainpage";
app.CURRENT_PAGE = app.MAIN_PAGE;
app.default =  {'youtubeId' : '38peWm76l-U'};
Main = {};
Main.onLoad = function()
{
	// Enable key event processing
	this.enableKeys();
	// send ready message to Application Manager
	widgetAPI.sendReadyEvent();
	// register nservice manager callback to receive device connect and disconnect events
    nservice.registerManagerCallback(messagesystem.onDeviceStatusChange);
    // initialize nservice device profile and get available devices
    nservice.getNServiceDevices(messagesystem.onCustomObtained);
    //Intialize player   
    minPlayer.init();
};


Main.onUnload = function()
{};

Main.enableKeys = function()
{
	document.getElementById("anchor").focus();
};

Main.keyDown = function()
{
	var keyCode = event.keyCode;
	selection = app.getCurrentSelection();
	switch(keyCode)
	{
		case tvKey.KEY_RETURN:
		    // minPlayer.player.setFullScreen(false);
			remoteControl.CaculateNextSelection(remoteControl.RETURN);
			widgetAPI.blockNavigation(event);
		    break;
		case tvKey.KEY_PANEL_RETURN:
			
			break;
		case tvKey.KEY_LEFT:
			remoteControl.CaculateNextSelection(remoteControl.LEFT);
			break;
		case tvKey.KEY_RIGHT:
			remoteControl.CaculateNextSelection(remoteControl.RIGHT);
			break;
		case tvKey.KEY_UP:
			remoteControl.CaculateNextSelection(remoteControl.UP);
			break;
		case tvKey.KEY_DOWN:
			remoteControl.CaculateNextSelection(remoteControl.DOWN);
			break;
		case tvKey.KEY_ENTER:
			remoteControl.CaculateNextSelection(remoteControl.ENTER);
			break;
		case tvKey.KEY_PANEL_ENTER:
			
			break;
		case tvKey.KEY_PLAY:
			//Play
			youtube.play();
			break;
		case tvKey.KEY_STOP:
			youtube.stop();
			break;
		case tvKey.KEY_PAUSE:
			//Pause
			youtube.pause();
			break;
		case tvKey.KEY_REW:
			youtube.rewind();
			break;
		case tvKey.KEY_FF:
			//Forward
			youtube.forward();
			break;
		case tvKey.MUTE:
			youtube.mute();
			break;
		default:
			alert("Unhandled key"+ keyCode);
			break;
	}
	alert("key"+ keyCode);
};