var displayLogin = {
		init:function(){
		    $("#loginDiv").show();
		    $(".screen").hide();
		}
}
var displayMain = {
		t: null,
		
		init:function(){
			$("#loginDiv").hide();
			$(".screen").show();	
			this.keyDispatcher();
		},
		keyDispatcher : function() {
		    $(document).ready(function() {
		        var dispatcher = $(window),
		            keyRate = 2000, //ms
		            lastKeyEvent = 1500,
		            cancelEvent = function(e) {
		                var evt = e ? e : window.event;
		                if (evt.stopPropagation)
		                    evt.stopPropagation();
		                if (evt.cancelBubble != null)
		                    evt.cancelBubble = true;
		                return false;
		            };

		        dispatcher
		            .bind('keydown', function(e) {
		                var now = new Date().getTime(),
		                    keyEventsTimeDiff = now - lastKeyEvent;
		                if (keyEventsTimeDiff <= keyRate) {
		                    // cancel the event
		                    return cancelEvent(e);
		                }
		                lastKeyEvent = now;
		                dispatcher.trigger('special-keydown', [e, keyEventsTimeDiff]);
		            })
		            .bind('keyup', function(e) {
		                if (e.keyCode > 47 && e.keyCode < 58 && !controls.isOpenChMenu && !controls.isOpenInfo && !controls.isOpenSideNav && !controls.isOpenEpg){
		                    cancelEvent(e.key);
		                    dispatcher.trigger('special-keyup', [e.key]);
		                }
		            })
		            // binding the custom events
		            .bind('special-keydown', function(e, originalEvent, keyEventsTimeDiff) {
		                displayMain.hideInputs();
		            })
		            .bind('special-keyup', function(e, originalEvent, keyEventsTimeDiff) {
		                displayMain.showInputs(originalEvent);
		            });
		    });
		},
		showInputs: function(oev){
			if (document.getElementById('nr').innerHTML.length < 3) {
		        document.getElementById('nr').innerHTML += oev;
		    }
		    this.t = setTimeout(function() {
		        displayMain.hideInputs();
		    }, 1500);
		},
		hideInputs: function(){
		    var nr = utils.int(document.getElementById('nr').innerHTML);
		    var str = document.getElementById('nr').innerHTML;
		    if (nr) {
		        if (nr <= Data.countCh) {
		            if (document.getElementById(str).getAttribute('data-url') != Player.playerUrl) {
		                webapis.avplay.stop();
		                if (Player.selectedChannel) {
		                    Player.selectedChannel.classList.remove('selected');
		                }
		                Player.selectedChannel = document.getElementById(str);
		                Player.play(Player.selectedChannel.getAttribute('data-url'));
		            } else {
		                document.getElementById('nr').innerHTML = "";
		                clearTimeout(this.t);
		                displayChFace.show();
		            }
		        } else{
		        	clearTimeout(this.t);
		        	alert("There is no such channel.");
		        	
		        }
		    }
		    document.getElementById('nr').innerHTML = "";
		    clearTimeout(this.t);
		},
}

var displayDataForm = {
		open : function(){
			
		},
		close : function(){
			
		}
}

var displaySideChList ={
		open : function(){
        	displayInfo.close();
        	clearTimeout(displayChFace.u);
			document.getElementById("Sidenav").classList.remove("hide");
			controls.scrollSideChannels();
			controls.isOpenSideNav = true;
			Data.sideFunctionality();
			if(Player.selectedChannel.lastChild.scrollWidth > $('.sidet').innerWidth()+20){
				Player.selectedChannel.lastChild.classList.add('marquee');
				$('.marquee').marquee(Data.mqOpt);
			}
		},
		close : function(){
			document.getElementById("Sidenav").classList.add("hide");
			controls.isOpenSideNav = false;
        	$('.marquee').marquee('destroy');
        	if(Player.selectedChannel.lastChild.classList.contains('marquee')){
        		Player.selectedChannel.lastChild.classList.remove('marquee');
        	}
		}
}

var displayCenterChList = {			
		open: function(){	
        	displayInfo.close();
        	clearTimeout(displayChFace.u);	
			document.getElementById("chlist").classList.remove("hide");		
			controls.compareMenuSelectedItems();
			controls.scrollCenterChannels();
			Data.menuDetails(Player.menuSelectedChannel);
			controls.isOpenChMenu = true;
		},
		close : function(){
			document.getElementById("chlist").classList.add("hide");
			controls.compareSideSelectedItems();
			controls.isOpenChMenu = false;
			Data.sideFunctionality();
		}
}
var displayChFace = {
		u : null,
		
		show : function(){
			clearTimeout(displayChFace.u);
            Data.headerFunctionality();
            Data.footerFunctionality(); 
			displayInfo.show();
            this.u = setTimeout(function() {
                displayInfo.close();
            }, 3000);
		},		
}


var displayInfo = {
		show : function(){
			
			document.getElementById("footer").style.height = "20px";	
			document.getElementById("header").classList.remove("hide");
			utils.playerTimeUpdateOn();
			//document.getElementById("footer").classList.remove("hide");	
		},
		
		open : function(){		
			document.getElementById("footer").style.height = "25%";	
			document.getElementById("header").classList.remove("hide");
			//document.getElementById("footer").classList.remove("hide");
			controls.isOpenInfo = true;
			
			utils.playerTimeUpdateOn();
			
		},
		close : function(){
			document.getElementById("footer").style.height = "0px";
            document.getElementById("header").classList.add("hide"); 
            //document.getElementById("footer").classList.add("hide");
            controls.isOpenInfo = false;
            utils.playerTimeUpdateOff();
		}
}

var displayEpg = {
		open:function(){
			document.getElementById("epg").style.zIndex = "5";
			Epg.setSelection();
			controls.isOpenEpg = true;
		},
		close : function(){
			document.getElementById("epg").style.zIndex = "0";
			controls.isOpenEpg = false;
		}
}