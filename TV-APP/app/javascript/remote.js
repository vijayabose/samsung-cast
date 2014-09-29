/** 
 * This is a remote control interface
 * which impletement remote control movement in the appliaction
 */
var remoteControl = {};
remoteControl.LEFT = 'left';
remoteControl.RIGHT = 'right';
remoteControl.DOWN = 'down';
remoteControl.UP = 'up';
remoteControl.ENTER = 'enter';
remoteControl.RETURN = 'return';
remoteControl.totalAppCount = 1;
remoteControl.totalChannelCount = 6;
remoteControl.ChannelColumnCount = 4;
remoteControl.ChannelRowCount = Math.round(remoteControl.totalChannelCount / remoteControl.ChannelColumnCount);
remoteControl.ChannelLastRowColumnCount = 2;
remoteControl.type = {'APP' : 'app','CHANNEL' : 'channel'}
/** 
 * Calculate next selection
 * @param {string} groupName     [Specify it as app or channels]
 * @param {string} currentColumn [current selected column]
 * @param {string} currentRow    [current selected row]
 * @param {string} clickedButton    [next button clicked by user]
 */
remoteControl.CaculateNextSelection = function(clickedButton){
	
	/**
	 * Get current select button information
	 *
	 * Data format: type-row-column
	 * Example : type can be 'app' or 'channel'
	 * 			 row start from 1
	 * 			 column start from 1 
	 */
	var selectData = $('.selected').attr('id').split('-');
	var type = selectData[0];
	var row = Number(selectData[1]);
	var column = Number(selectData[2]);
	var selectedId = "";
	//@todo : Now apps are considered only one need to improvize so only up and down arraw
	switch(clickedButton){
		/** 
		 * App:
		 * 	
		 *  
		 * Channel:
		 */
		case remoteControl.LEFT :
			if(type == remoteControl.type.APP){

			}else{
				/** 
				 * Channels
				 */
				if(row == 1 && column == 1){
					//Find last channel and make it selected
				   selectedId = 'channel-'+ remoteControl.ChannelRowCount +'-'+ remoteControl.ChannelLastRowColumnCount;
				}else if(column == 1){
					//Find last column channel in the before row
					row = row-1;
					selectedId = 'channel-'+ row +'-'+ remoteControl.ChannelColumnCount;
				}else{
					//Find previous channel in the row
					column = column-1;
					selectedId = 'channel-'+ row +'-'+ column;
				}
			}
		break;
		/** 
		 * 
		 */
		case remoteControl.RIGHT :
			if(type == remoteControl.type.APP){

			}else{
				/** 
				 * Channels
				 */
				if(row == remoteControl.ChannelRowCount && column == remoteControl.ChannelLastRowColumnCount){
					//Find first channel and make it selected
				   selectedId = 'channel-1-1';
				}else if(column == remoteControl.ChannelColumnCount){
					//Find first column in the next row
					row = row+1;
					selectedId = 'channel-'+ row +'-1';
				}else{
					//Find next channel in the row
					column = column+1;
					selectedId = 'channel-'+ row +'-'+ column;
				}
			}
		break;
		/** 
		 *  App:
		 *   Then go to first channel in the channel list
		 */
		case remoteControl.DOWN :
			if(type == remoteControl.type.APP){
				//Select first channel in the channel list
				selectedId = 'channel-1-1';
			}else{
				//Channels
				if(row == remoteControl.ChannelRowCount && column == remoteControl.ChannelLastRowColumnCount){
					//Find first channel and make it selected
				   selectedId = 'channel-1-1';
				}else if(row == remoteControl.ChannelRowCount){
					//Select first row and make currently select column channel
					selectedId = 'channel-1-'+column;
				}else if(row == remoteControl.ChannelRowCount - 1 && column > remoteControl.ChannelLastRowColumnCount){
				    //Next row last column and select the channel
					row = row+1;
					selectedId = 'channel-'+ row +'-'+ remoteControl.ChannelLastRowColumnCount;
				}else{
					//Next row same column and select the channel
					row = row+1;
					selectedId = 'channel-'+ row +'-'+column;
				}
			}
		break;
		/** 
		 * 
		 */
		case remoteControl.UP :
			if(type == remoteControl.type.APP){
				//Select first channel in the channel list
				selectedId = 'channel-1-1';
			}else{
				//Channels
				if(row == 1 && column == 1){
					//Select first one in the app list
				   selectedId = 'app-1-1';
				}else if(row == 1){
					//Select app but corresponding column app 
					//@todo
					selectedId = 'app-1-1';
				}else{
					//Previous row same column and select the channel
					row = row-1;
					selectedId = 'channel-'+ row +'-'+column;
				}
			}
		break;
		/** 
		 * 
		 */	
		case remoteControl.ENTER :
			if(type == remoteControl.type.APP){
				//Hide channel player
				minPlayer.player.stop();
				minPlayer.player.hide();
				//Default video for now. But will be pushing Youtube sample usage video
				youtube.enter();
			}else{
				//Make chanel player full screen
				minPlayer.player.setFullScreen(true);
			}
		break;
		case remoteControl.RETURN :
			//Is main page loaded
			  if(type == remoteControl.type.APP){
				youtube.close();
			  }else{
				//Make chanel player mini screen
				minPlayer.player.setFullScreen(false);
			  }	
		break;
		default :
			alert("Error: "+nextAction);
		break;
	}
	if(selectedId != ""){
		//Remove currently selected
		$(".selected").removeClass('selected');
		//Select new selection
		$("#"+selectedId).addClass('selected');
	}
	//Process current selection
	selectData = $('.selected').attr('id').split('-');
	type = selectData[0];
	row = Number(selectData[1]);
	column = Number(selectData[2]);
	if(type == remoteControl.type.APP){
		minPlayer.player.stop();
		minPlayer.player.hide();
	}else if(clickedButton != remoteControl.ENTER && clickedButton != remoteControl.RETURN){
		minPlayer.player.stop();
		minPlayer.play();
	}

 }