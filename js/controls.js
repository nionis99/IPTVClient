var controls = {
		centerChannelList : null,
		sideChannelList : null,
		isOpenSideNav : false,
		isOpenChMenu : false,
		isOpenInfo : false,
		isOpenEpg : false,
		sideSelected : null,
		menuSelected : null,
		re : null,

		
		
	    playing: function(url) {
            var item;
            item = document.getElementById('channel-list').querySelector('li.playing');
            if (item) {
            	Player.previousChannelID = utils.int(item.id);
            	item.classList.remove('playing'); 	
            }
            if (!url) return;
            item = document.getElementById('channel-list').querySelector('li[data-url="' + url + '"]');
            if (item) item.classList.add('playing');
        },
        scrollSideChannels: function() {
            this.sideChannelList = document.getElementById("channel-list");
            // Get element parameters
            var nodeList = [].slice.call(this.sideChannelList.children);
            var itemIndex = nodeList.indexOf(Player.selectedChannel);
            var itemHeight = Player.selectedChannel.offsetHeight;
            var listHeight = document.querySelector('.sidenav').offsetHeight;
            var itemCount = utils.int(listHeight / itemHeight);
            
            var scroll = utils.int(itemIndex * itemHeight) - utils.int(itemHeight * (itemCount / 2));
            
            // scroll = scroll >= 0 ? scroll : 0;
            document.querySelector('.sidenav').scrollTop = scroll;       
        },
        scrollCenterChannels: function(){
        	this.centerChannelList = document.getElementById("ch-list");
        	// Get element parameters
            var nodeList = [].slice.call(this.centerChannelList.children);
            var itemIndex = nodeList.indexOf(Player.menuSelectedChannel);
            var itemHeight = Player.menuSelectedChannel.offsetHeight;
            var listHeight = document.querySelector('.chlist').offsetHeight;
            var itemCount = utils.int(listHeight / itemHeight);
            
            var scroll = utils.int(itemIndex * itemHeight) - utils.int(itemHeight * (itemCount / 2));
            
            // scroll = scroll >= 0 ? scroll : 0;
            document.querySelector('.chlist').scrollTop = scroll;       
        },
        compareMenuSelectedItems: function() {
            this.sideSelected = Player.selectedChannel.id;
            if (!Player.menuSelectedChannel) {
            	Player.menuSelectedChannel = document.getElementById("cch[" + this.sideSelected + "]");
            	Player.menuSelectedChannel.classList.add('selected');
            } else {
            	Player.menuSelectedChannel.classList.remove('selected');
            	Player.menuSelectedChannel = document.getElementById("cch[" + this.sideSelected + "]");
            	Player.menuSelectedChannel.classList.add('selected');
            }
        },
        compareSideSelectedItems: function() {
        	this.menuSelected = utils.int(Player.menuSelectedChannel.id.replace(/[^0-9]/g,''));
        	if (!Player.selectedChannel) {
            	Player.selectedChannel = document.getElementById(this.menuSelected);
            	Player.selectedChannel.classList.add('selected');
				if(Player.selectedChannel.lastChild.scrollWidth > $('.sidet').innerWidth()+20){
					Player.selectedChannel.lastChild.classList.add('marquee');
					$('.marquee').marquee(Data.mqOpt);
				}
            } else {
            	$('.marquee').marquee('destroy');
            	if(Player.selectedChannel.lastChild.classList.contains('marquee')){
            		Player.selectedChannel.lastChild.classList.remove('marquee');
            	}
            	Player.selectedChannel.classList.remove('selected');
            	Player.selectedChannel = document.getElementById(this.menuSelected);
            	Player.selectedChannel.classList.add('selected');
				if(Player.selectedChannel.lastChild.scrollWidth > $('.sidet').innerWidth()+20){
					Player.selectedChannel.lastChild.classList.add('marquee');
					$('.marquee').marquee(Data.mqOpt);
				}
            	
            }
        },
        enter: function() {
        	if (!this.isOpenInfo && !this.isOpenEpg && Player.state() == 'PLAYING') {
	        	if(!this.isOpenSideNav && !this.isOpenChMenu){
	        		displaySideChList.open();
	        	} else if (this.isOpenSideNav && !this.isOpenChMenu){
	        		if (Player.selectedChannel.dataset.url == Player.playerUrl && Player.state() == 'PLAYING') {
	        			displaySideChList.close();
	        			displayChFace.show();
	        		} else{
	        		    webapis.avplay.stop();
	        		    displaySideChList.close();
	                    Player.play(Player.selectedChannel.dataset.url);
	        		}
	        	} else if(this.isOpenChMenu && !this.isOpenSideNav){
	        		if (Player.menuSelectedChannel.dataset.url == Player.playerUrl && Player.state() == 'PLAYING') {
	        			displayCenterChList.close();
	        			displayChFace.show();
	        		} else{
	        		    webapis.avplay.stop();
	        		    displayCenterChList.close();
	                    Player.play(Player.menuSelectedChannel.dataset.url);
	        		}
	        	}
            }
        },
        chListDown: function() {
            this.sideChannelList = document.getElementById('channel-list');
            if (!Player.selectedChannel) {
                Player.selectedChannel = this.sideChannelList.firstChild;
            } else {
            	Player.selectedChannel.classList.remove('selected');
            	$('.marquee').marquee('destroy');
            	if(Player.selectedChannel.lastChild.classList.contains('marquee')){
            		Player.selectedChannel.lastChild.classList.remove('marquee');
            	}
                Player.selectedChannel = Player.selectedChannel.nextSibling;
            }
            if (!Player.selectedChannel) Player.selectedChannel = this.sideChannelList.firstChild;
            	Player.selectedChannel.classList.add('selected');
				if(Player.selectedChannel.lastChild.scrollWidth > $('.sidet').innerWidth()+20){
					Player.selectedChannel.lastChild.classList.add('marquee');
					$('.marquee').marquee(Data.mqOpt);
				}
            this.scrollSideChannels();
        },
        chListUp: function (){
        	this.sideChannelList = document.getElementById('channel-list');
            if (!Player.selectedChannel) {
                Player.selectedChannel = this.sideChannelList.firstChild;
                Player.selectedChannel.classList.add('selected');
				if(Player.selectedChannel.lastChild.scrollWidth > $('.sidet').innerWidth()+20){
					Player.selectedChannel.lastChild.classList.add('marquee');
					$('.marquee').marquee(Data.mqOpt);
				}
            } else {
            	Player.selectedChannel.classList.remove('selected');
            	$('.marquee').marquee('destroy');
            	if(Player.selectedChannel.lastChild.classList.contains('marquee')){
            		Player.selectedChannel.lastChild.classList.remove('marquee');
            	}
            	Player.selectedChannel = Player.selectedChannel.previousSibling;
                if (!Player.selectedChannel) Player.selectedChannel = this.sideChannelList.lastChild;
                Player.selectedChannel.classList.add('selected');
				if(Player.selectedChannel.lastChild.scrollWidth > $('.sidet').innerWidth()+20){
					Player.selectedChannel.lastChild.classList.add('marquee');
					$('.marquee').marquee(Data.mqOpt);
				}
            }
            this.scrollSideChannels();
        },
        menuUp: function (){
        	this.centerChannelList = document.getElementById('ch-list');
            if (!Player.menuSelectedChannel) {
                Player.menuSelectedChannel = this.centerChannelList.firstChild;
                Player.menuSelectedChannel.classList.add('selected');
            } else {
            	Player.menuSelectedChannel.classList.remove('selected');
            	Player.menuSelectedChannel = Player.menuSelectedChannel.previousSibling;
                if (!Player.menuSelectedChannel) Player.menuSelectedChannel = this.centerChannelList.lastChild;
                Player.menuSelectedChannel.classList.add('selected');
            }
            this.scrollCenterChannels();
            Data.menuDetails(Player.menuSelectedChannel);
        },
        menuDown: function(){
            this.centerChannelList = document.getElementById('ch-list');
            if (!Player.menuSelectedChannel) {
                Player.menuSelectedChannel = this.centerChannelList.firstChild;
            } else {
            	Player.menuSelectedChannel.classList.remove('selected');
                Player.menuSelectedChannel = Player.menuSelectedChannel.nextSibling;
            }
            if (!Player.menuSelectedChannel) Player.menuSelectedChannel = this.centerChannelList.firstChild;
            	Player.menuSelectedChannel.classList.add('selected');
            this.scrollCenterChannels();
            Data.menuDetails(Player.menuSelectedChannel);
        },
        chUp: function(){
			clearTimeout(this.re);
            this.chListUp();
            displayChFace.show();
            this.re = setTimeout(function() {
                if (Player.selectedChannel.getAttribute("data-url") != Player.playerUrl) {
                    webapis.avplay.stop();
                    Player.play(Player.selectedChannel.getAttribute("data-url"));
                } else {
                    displayChFace.show();
                }
            }, 1000);
        },
        chDown: function(){
			clearTimeout(this.re);
            this.chListDown();
            displayChFace.show()
            this.re = setTimeout(function() {
                if (Player.selectedChannel.getAttribute("data-url") != Player.playerUrl) {
                    webapis.avplay.stop();
                    Player.play(Player.selectedChannel.getAttribute("data-url"));
                } else {
                	displayChFace.show();
                }
            }, 1000);
        },
        previousCh:function(){
        	if(!Player.previousChannelID){
        		return;
        	} else {
        		if (document.getElementById(Player.previousChannelID).getAttribute('data-url') != Player.playerUrl) {
        			webapis.avplay.stop();       			
                    if (Player.selectedChannel) {
                    	$('.marquee').marquee('destroy');
                    	if(Player.selectedChannel.lastChild.classList.contains('marquee')){
                    		Player.selectedChannel.lastChild.classList.remove('marquee');
                    	}
                    	Player.selectedChannel.classList.remove('selected');   	
                    }
                    Player.selectedChannel = document.getElementById(Player.previousChannelID);
                    Player.selectedChannel.classList.add('selected');
    				if(Player.selectedChannel.lastChild.scrollWidth > $('.sidet').innerWidth()+20){
    					Player.selectedChannel.lastChild.classList.add('marquee');
    					$('.marquee').marquee(Data.mqOpt);
    				}
                    Player.play(document.getElementById(Player.previousChannelID).getAttribute('data-url'));
        		}
        	}     
        },
        epgUp: function() {
        	Epg.epgIndex = Epg.timeline.getSelection()[0];
        	Epg.epgCh = Epg.items._data[Epg.epgIndex].channel_id;
        	Epg.chList = Array.from(new Set(Data.epgData.map(x=> x.channel_id)));
        	Epg.epgChIndex = Epg.chList.findIndex(x => x == Epg.epgCh);
        	if(Epg.epgChIndex != 0){
        		Epg.nextEpgSelectionId = Data.epgData.filter(x => utils.timeToUnix(x.start) <= Epg.epgStart && utils.timeToUnix(x.end) >= Epg.epgStart && x.channel_id == Epg.chList[Epg.epgChIndex-1]);
        		if(Epg.nextEpgSelectionId.length > 0){
        			Epg.timeline.setSelection(Epg.nextEpgSelectionId[0].id, {focus : true});
            		Epg.epgStart = utils.timeToUnix(Epg.nextEpgSelectionId[0].start);
        		}
        	}
        },
        epgDown: function() {
        	Epg.epgIndex = Epg.timeline.getSelection()[0];
        	Epg.epgCh = Epg.items._data[Epg.epgIndex].channel_id;
        	Epg.chList = Array.from(new Set(Data.epgData.map(x=> x.channel_id)));
        	Epg.epgChIndex = Epg.chList.findIndex(x => x == Epg.epgCh);
        	if(Epg.chList.length > Epg.epgChIndex+1){
        		Epg.nextEpgSelectionId = Data.epgData.filter(x => utils.timeToUnix(x.start) <= Epg.epgStart && utils.timeToUnix(x.end) >= Epg.epgStart && x.channel_id == Epg.chList[Epg.epgChIndex+1]);
        		if(Epg.nextEpgSelectionId.length > 0){
        			Epg.timeline.setSelection(Epg.nextEpgSelectionId[0].id, {focus : true});
            		Epg.epgStart = utils.timeToUnix(Epg.nextEpgSelectionId[0].start);
        		}
        	}
        
        },
        epgRight: function() {
        	Epg.epgIndex = Epg.timeline.getSelection()[0];
        	if(Epg.items._data[Epg.epgIndex].channel_id ==  Epg.items._data[Epg.epgIndex+1].channel_id){
        		Epg.timeline.setSelection(Epg.epgIndex+1, {focus : true});
        		Epg.epgStart = utils.timeToUnix(Epg.items._data[Epg.epgIndex+1].start);
        	}
        },
        epgLeft: function() {
        	Epg.epgIndex = Epg.timeline.getSelection()[0];
        	if(Epg.items._data[Epg.epgIndex].channel_id ==  Epg.items._data[Epg.epgIndex-1].channel_id){
        		Epg.timeline.setSelection(Epg.epgIndex-1, {focus: true});
        		Epg.epgStart = utils.timeToUnix(Epg.items._data[Epg.epgIndex-1].start);
        	}
        },
        toggleSideNav: function() {
            if (this.isOpenSideNav) {
            	displaySideChList.close();
            } else {
                displaySideChList.open();
            }
        },
        toggleChMenu: function() {
            if (this.isOpenChMenu) {
            	displayCenterChList.close();
            	displaySideChList.open();
            } else {
            	if(this.isOpenSideNav && !this.isOpenEpg){
            		displaySideChList.close();
            	} 
            	if(this.isOpenInfo && !this.isOpenEpg){
            		displayInfo.close();
            	}
            	displayCenterChList.open();
            }
        },
        toggleInfo: function() {
            if (this.isOpenInfo) {
                displayInfo.close();
            } else {
                clearTimeout(displayChFace.u);
                if (!this.isOpenSideNav && !this.isOpenChMenu && !this.isOpenEpg) {
                    document.getElementById("footer").style.height = "25%";
	                displayInfo.open();
                }
            }
        },  
        toggleEpg: function() {
        	if(this.isOpenEpg){
        		displayEpg.close();
        	} else{
        		if(!this.isOpenChMenu && !this.isOpenInfo && !this.isOpenSideNav){
        			displayEpg.open();
        		}
        	}
        },
}