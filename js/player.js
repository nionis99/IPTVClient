var Player = {
		is4k:false,
		audioTrack: null,
		playerUrl: '',
		screen: [],
		selectedChannel: null,
		menuSelectedChannel: null,
		selectedChannelID : 0,
		previousChannelID: null,
		player: null,
		interval: null,
		
		
		
		init: function(){
			this.player = document.getElementById("av-player");
			this.updatePlayerScreen();
			Main.play();
		},
		updatePlayerScreen: function(){
			var playerBounds = this.player.getBoundingClientRect();
			var s = [
			         playerBounds.left, playerBounds.top,
			         playerBounds.width, playerBounds.height
			];
			this.screen = s;
		},
		play: function(url){
			if(!url){
				return webapis.avplay.play();
			}
			Player.playerUrl = url;
			Player.audioTrack = 1;	
			controls.playing(url);
			webapis.avplay.open(url);
			webapis.avplay.setListener({
				onbufferingstart: function() {
                    console.log('buffering start');
        			if(!controls.isOpenChMenu && !controls.isOpenSideNav ){
        				displayChFace.show();
        			}
                },
                onbufferingprogress: function(percent)
                {
                  //console.log("Buffering progress data : " + percent);
                },
    		    oncurrentplaytime: function() { 	
    		    	Data.footerFunctionality();
    		    	Data.headerFunctionality();
    		    },
                onstreamcompleted: function() {
                	webapis.avplay.stop();
                }.bind(this),
                onerror: function(error) {
                    console.log('event error:', error);
                }
            });
			webapis.avplay.setDisplayRect.apply(null, Player.screen);
            webapis.avplay.setDisplayMethod('PLAYER_DISPLAY_MODE_FULL_SCREEN');
            //if (is4k) this.set4k(true);
            webapis.avplay.prepareAsync(function() {
            	webapis.avplay.play();
                Player.selectedChannelID = utils.int(Player.selectedChannel.id);   
                utils.setCookie("currentChannel",  Player.selectedChannelID, 30);
            });
		},
		state : function(){
			return webapis.avplay.getState();
		}
}