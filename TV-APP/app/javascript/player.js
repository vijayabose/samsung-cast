var minPlayer = {};
//sample url 
//rtmp://bomtv.5centscdn.com:1935/manoramastream/6bd3553cb978135e1c6033d9fadeac50.sdp|TCP
minPlayer.x = 10;
minPlayer.y = 250;
minPlayer.width = 180;
minPlayer.height = 200;
minPlayer.init = function(){
   minPlayer.player = sf.service.VideoPlayer;
   minPlayer.player.init({
	    onstatechange: function (state) {
	        //alert('Current State : ' + state);
	    },
	    onend: function(){
	        //alert('Video ended.');
	    },
	    onerror: function (error) {
	        //alert('Error : ' + error);
	    }
	});
	minPlayer.player.setPosition({
	    left: minPlayer.x,
	    top: minPlayer.y,
	    width: minPlayer.width,
	    height: minPlayer.height
	});
	minPlayer.player.hide();
};
minPlayer.play = function(){
	if($(".selected").attr("channelId")){
		$("#sf-service-videoplayer-mini-infobar").hide();
		minPlayer.player.show();
		var id = $(".selected").attr("channelId") - 1;
		var url = CHANNEL_LIST[id].url;
		//var url ="rtmp://bomtv.5centscdn.com:1935/manoramastream/6bd3553cb978135e1c6033d9fadeac50.sdp|TCP";
		var item = {
			url : url,
			fullScreen: false
		}
		// minPlayer.setScreenSaver(true, 100);
		minPlayer.player.play(item);
	}
};