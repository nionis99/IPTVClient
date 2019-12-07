var Main = {
		init: function(){
			Server.getTVData();
		},
		
		registerKeys: function(){
			var usedKeys = 
				[
			                'Info', 'Menu', 'Guide', 'ChannelUp', 'ChannelDown',
			                'MediaPause', 'MediaPlay', 'PreviousChannel', 'Caption',
			                'MediaPlayPause', 'MediaStop', 'Source', 'Search',
			                'MediaFastForward', 'MediaRewind', 'ChannelList',
			                '0', '1', '2', '3', '4', '5', '6', '7', '8', '9',
			                'ColorF0Red', 'ColorF1Green', 'ColorF2Yellow', 'ColorF3Blue'
			    ];
			
			// Register keys
		    usedKeys.forEach(function(key) {
		        tizen.tvinputdevice.registerKey(key);
		    });
		    
		},
		
		registerKeyHandler: function(){
			document.addEventListener('keydown', function(e) {
		        var key = e.keyCode;
		        switch (key) {
		            case 458: // Guide
		                controls.toggleEpg();
		                break;
		            case 10190: // Previous Channel
		            	 if (!controls.isOpenSideNav && !controls.isOpenEpg && !controls.isOpenChMenu && !controls.isOpenInfo){
		            		 controls.previousCh();
		            	 }	
		            	break;
		            case 101330: // Menu
		            	//controls.toggleChMenu();
		                break;
		            case 10252:
		                // MediaPlayPause
		                break;
		            case 10073: // ChannelList
		                controls.toggleChMenu();
		                break;
		            case 415: // MediaPlay
		                //Player.playPause();
		                break;
		            case 19: // MediaPause
		                //Player.pause();
		                break;
		            case 413: // MediaStop
		                //Player.stop();
		                break;
		            case 417: // MediaFastForward
		                //Player.foward();
		                break;
		            case 412: // MediaRewind
		                //Player.rewind();
		                break;
		            case 427: // Channel Up
		            	if(!controls.isOpenSideNav && !controls.isOpenEpg && !controls.isOpenChMenu && !controls.isOpenInfo){
		            		controls.chUp();
		            	}
		                break;
		            case 428: // Channel Down
		              	if(!controls.isOpenSideNav && !controls.isOpenEpg && !controls.isOpenChMenu && !controls.isOpenInfo){
		            		controls.chDown();
		            	}
		                break;
		            case 37: // Left
		                if(controls.isOpenEpg){
		                	controls.epgLeft();
		                };
		                break;
		            case 38: // Up		                
		                if (controls.isOpenSideNav && !controls.isOpenEpg && !controls.isOpenChMenu && !controls.isOpenInfo) {
		                	controls.chListUp();
		                }
		                if(!controls.isOpenSideNav && !controls.isOpenEpg && !controls.isOpenChMenu && !controls.isOpenInfo){
		                	controls.chUp();
		                }
		              	if(controls.isOpenChMenu && !controls.isOpenSideNav && !controls.isOpenEpg && !controls.isOpenInfo){
		              		controls.menuUp();
		              	}
		              	if(controls.isOpenEpg && !controls.isOpenChMenu && !controls.isOpenSideNav && !controls.isOpenInfo){
		              		controls.epgUp();
		              	}
		                break;
		            case 39: // Right
		                if(controls.isOpenEpg){
		                	controls.epgRight();
		                }
		                break;
		            case 40: // Down	
		                if (controls.isOpenSideNav && !controls.isOpenEpg && !controls.isOpenChMenu && !controls.isOpenInfo) {
		            		controls.chListDown();
		                }
		                if(!controls.isOpenSideNav && !controls.isOpenEpg && !controls.isOpenChMenu && !controls.isOpenInfo){
		                	controls.chDown();
		                }
		              	if(controls.isOpenChMenu && !controls.isOpenSideNav && !controls.isOpenEpg && !controls.isOpenInfo){
		              		controls.menuDown();
		              	}
		              	if(controls.isOpenEpg && !controls.isOpenChMenu && !controls.isOpenSideNav && !controls.isOpenInfo){
		              		controls.epgDown();
		              	}
		                break;
		            case 13: // Enter
		                controls.enter();
		                break;
		            case 457: // Info
		                controls.toggleInfo();
		                break;
		            case 403: // ColorF0Red
		                //Player.nextAudio();
		                break;
		            case 404: // ColorF1Green
		                //
		                break;
		            case 405: // ColorF2Yellow

		                break;
		            case 406: // ColorF3Blue
		                //document.getElementById("log").classList.toggle('hide');
		                break;
		            case 10072: // Source
		            	break;
		            case 10221: // CC - Captions
		            	break;
		            case 10225: // Search
		            	break;
		            case 10009: //Return
		            	break;
		            case 10182: // Exit
		            	webapis.avplay.stop();
		            	break;
		        }
		    });
		},
		
		play: function() {
			var currChanID = utils.getCookie('currentChannel');	
            if (!currChanID){
            	$('marquee').marquee('destroy');
            	if(document.querySelectorAll('.marquee').length>0){
            		document.querySelectorAll('.marquee').classList.remove('marquee');
            	}
            	document.querySelector(".selected").classList.remove("selected");
                Player.selectedChannel = document.getElementById("0");
                Player.play(Player.selectedChannel.getAttribute('data-url'));
                Player.selectedChannel.classList.add('selected');
                Player.selectedChannelID = 0;
            } else {
            	$('marquee').marquee('destroy');
            	if(document.querySelectorAll('.marquee').length>0){
            		document.querySelectorAll('.marquee').classList.remove('marquee');
            	}
            	document.querySelector(".selected").classList.remove("selected");
                Player.selectedChannel = document.getElementById(currChanID);
                Player.play(Player.selectedChannel.getAttribute('data-url'));   
                Player.selectedChannel.classList.add('selected');  
                Player.selectedChannelID = utils.int(currChanID);
            }
        },
		
		

};
window.onload = Main.init();
