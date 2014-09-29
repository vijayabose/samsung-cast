var youtube = {
	videoId : '',
	player : '',
	playerHeight : '540',
	playerWidth : '960',
	initPlayer : function(){
		youtube.player = new YT.Player('yplayer', {
	      height: youtube.playerHeight,
	      width: youtube.playerWidth,
	      videoId: "",
	      events: {
	        'onReady': youtube.onReady,
	        'onStateChange': youtube.onPlayerStateChange
	      }
	    });
	},
	onReady : function(event){
		event.target.setPlaybackQuality('highres');
		// if (typeof ytb_api === 'undefined' || ytb_api === false) {
  //   		var IFrameID = document.getElementById('yplayer');
  //   		var nocookieURL = IFrameID.src.replace("YouTube.com","YouTube-nocookie.com");
  //   		IFrameID.src = nocookieURL;
  //   	}
		// youtube.player.playVideo();
	},
	onPlayerStateChange : function(event){

	},
	changeVideo : function(videoId){
		youtube.showPlayer();
		youtube.videoId = videoId;
		youtube.player.loadVideoById(videoId);
	},
	//Close youtube app hide it
	close : function(){
		youtube.videoId = "";
		youtube.stop();
		youtube.hidePlayer();
	},
	play : function(){
		youtube.player.playVideo();
	},
	stop : function(){
		youtube.player.stopVideo();
	},
	pause : function(){
		youtube.player.pauseVideo();
	},
	rewind : function(){
		//Rewind
		if(youtube.player.getPlayerState() != 1){
			youtube.player.playVideo();	
		}
		if(youtube.player.getCurrentTime() > 0){
			var time = player.getCurrentTime() - 5;
			youtube.player.seekTo(time, false);	
		}
	},
	forward : function(){
		if(youtube.player.getPlayerState() != 1){
			youtube.player.playVideo();	
		}
		var time = youtube.player.getCurrentTime() + 5;
     	youtube.player.seekTo(time, false);
	},
	enter : function(){
		//if playing pause
		if(youtube.player.getPlayerState() == 1){
			youtube.player.pauseVideo();
		}else{
			if(youtube.videoId == ""){
			   youtube.changeVideo(app.default.youtubeId);
			}else{
				youtube.player.playVideo();
			}
		}
	},
	mute : function(){
		if(youtube.player.isMuted()){
		  youtube.player.mute();	
		}else{
		  youtube.player.unMute();
		}
	},
	showPlayer : function(){
		$("#yplayer").show();
		$("#mainPage").hide();
	},
	hidePlayer : function(){	
	   $("#yplayer").hide();
	   $("#mainPage").show();	
	}
};
//Event trigger after loading the YT player script
function onYouTubeIframeAPIReady(){
  youtube.initPlayer();
}