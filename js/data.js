var Data = {
		cdn: '',
		token:'',
		channelsData:{},
		epgData:[],
		countCh: 0,
		currentEpg: [],
		fullEpg : [],
		mqOpt : null,
		epgCounter: 0,
       
		setChannelsData: function(ch){
			this.channelsData = ch;
		},
		setEpgData: function(e){
			this.epgData = e; 
			this.sortEpgData();
			this.setMqOpt();
		},
		sortEpgData: function(){
			Data.epgData = Data.epgData.sort((a, b) => (a.channel_id > b.channel_id) ? 1 : (a.channel_id === b.channel_id) ? ((a.start > b.start) ? 1 : -1) : -1 );	
		},
		setFullEpg : function(data) {
			this.fullEpg = this.fullEpg.concat(data);
		},
		sortFullEpgData : function(){
			Data.fullEpg = Data.fullEpg.sort((a,b) => (a.channel_id > b.channel_id) ? 1 : (a.channel_id === b.channel_id) ? ((a.start > b.start) ? 1 : -1) : -1);
		},
		setMqOpt : function(){
			this.mqOpt = {
		            allowCss3Support: true,
		            css3easing: 'linear',
		            easing: 'linear',
		            delayBeforeStart: 1500,
		            direction: 'left',
		            duplicated: true,
		            duration: 5000,
		            gap: 40,
		            pauseOnCycle: false,
		            pauseOnHover: false,
		            startVisible: true,
		         };
		},
		addChSideList: function(cl){
			document.getElementById('channel-list').innerHTML = '';
            for (var item in cl) {
                item = cl[item];
                var liSide = document.createElement('li');
                var logDiv = document.createElement('div');
                logDiv.id = "side-logo";
                logDiv.classList.add("sidel");
                var logo = document.createElement('img');
                logo.src = Server.openServer + Server.url.images + item.logo;
                logDiv.appendChild(logo);
                var chDiv = document.createElement('div');
                chDiv.id = "side-ch";
                chDiv.classList.add("sidech");
                chDiv.innerHTML = item.name;
                var titDiv = document.createElement('div');
                titDiv.id = "stitle[" + this.countCh + "]";
                titDiv.classList.add("sidet");  
                titDiv.innerHTML = item.title;
                liSide.append(logDiv,chDiv,titDiv);
                liSide.id = this.countCh;
                liSide.dataset.url = Data.cdn + '/' + item.url_name + '/' + item.url_file;
                liSide.dataset.id = item.id;
                liSide.dataset.logo = Server.openServer + Server.url.images + item.logo;
                liSide.dataset.name = item.name;       	
	            liSide.dataset.title = item.title;
                document.getElementById('channel-list').appendChild(liSide);
                this.countCh++;
            }
            controls.chListDown();
		},
		addChCenterList: function(cl){
			var c = 0;
			document.getElementById('ch-list').innerHTML = '';
	        for (var item in cl) {
	            item = cl[item];
	            var liMenu = document.createElement('li');
	            var name = document.createElement('h5');
	            name.innerHTML = item.name;
	            liMenu.appendChild(name);
	            liMenu.id = "cch[" + c + "]"
	            liMenu.dataset.url = Data.cdn + '/' + item.url_name + '/' + item.url_file;
	            liMenu.dataset.logo = Server.openServer + Server.url.images + item.logo;
	            liMenu.dataset.name = item.name;
	            liMenu.dataset.title = item.title;
	            document.getElementById('ch-list').appendChild(liMenu);
	            c++;
            }
		},
		menuDetails : function(elem){
			var unixCurrent = Math.floor(Date.now() / 1000);
			var ml = document.getElementById("menu-logo");
			ml.innerHTML = '';
			var mc = document.getElementById("menu-ch");
			var mt = document.getElementById("menu-title");
			var mdt = document.getElementById("menu-date");
			var md = document.getElementById("menu-description");
			var mn = document.getElementById("menu-next");
			var logo = document.createElement('img');
			logo.src = elem.dataset.logo;
			ml.appendChild(logo);
			mc.innerHTML = elem.dataset.name;
			var index = Player.menuSelectedChannel.id.replace(/[^0-9]/g,''); 
			var id = document.getElementById(index).dataset.id;
			var now = Data.epgData.filter(x => utils.timeToUnix(x.start) <= unixCurrent && utils.timeToUnix(x.end) >= unixCurrent && x.channel_id === utils.int(id));
			mt.innerHTML = now[0].title;
			mdt.innerHTML = now[0].start + " - " + now[0].end;
			md.innerHTML = now[0].description;
		},
		footerFunctionality: function(){
			var unixCurrent = Math.floor(Date.now() / 1000);
		    var progress = document.getElementById("progress");
		    if(Data.epgData.length !=0){ 
			    var now = Data.epgData.filter(x => utils.timeToUnix(x.start) <= unixCurrent && utils.timeToUnix(x.end) >= unixCurrent && x.channel_id === utils.int(Player.selectedChannel.dataset.id));
			    var date = new Date(now[0].end);
				document.getElementById("footer-start").innerHTML = utils.currentTimeSlider();
				document.getElementById("footer-end").innerHTML = utils.checkTime(date.getHours()) + ":" + utils.checkTime(date.getMinutes());
				var progressStart = utils.timeToUnix(now[0].start);
				var progressEnd = utils.timeToUnix(now[0].end);
				var progressValue = (unixCurrent - progressStart);
				var progressMax = (progressEnd - progressStart);
				document.getElementById("footer-range").innerHTML = now[0].start + " - " + now[0].end;
				document.getElementById("footer-title").innerHTML = now[0].title;
				document.getElementById("footer-description").innerHTML = now[0].description;
				progress.value = progressValue;
				progress.max = progressEnd - progressStart;	    	
		    } else {
		    	document.getElementById("footer-start").innerHTML = "--:--:--";
				document.getElementById("footer-end").innerHTML = "--:--";
		    }	
		},
		headerFunctionality: function(){
			var unixCurrent = Math.floor(Date.now() / 1000);
			var hl = document.getElementById("header-logo");
			var hc = document.getElementById("header-ch");
			var ht = document.getElementById("header-title");
			var logo = document.createElement('img');
			logo.src = Player.selectedChannel.dataset.logo;
			hl.innerHTML = '';
			hl.appendChild(logo);
			if(Data.epgData.length !=0){
				utils.clock();
				var hnow = Data.epgData.filter(x => utils.timeToUnix(x.start) <= unixCurrent && utils.timeToUnix(x.end) >= unixCurrent && x.channel_id === utils.int(Player.selectedChannel.dataset.id));
				ht.innerHTML = hnow[0].title;
			}
		},
		checkCurrentTitles: function(){
			//console.log("tikrina");
			var unixCurrent = Math.floor(Date.now() / 1000);
			Data.currentEpg = Data.epgData.filter(x => utils.timeToUnix(x.start) <= unixCurrent && utils.timeToUnix(x.end) >= unixCurrent);
		},
		sideFunctionality:function(){
			for(var i=0; i<Data.currentEpg.length; i++){	
				document.querySelectorAll('[data-id="'+Data.currentEpg[i].channel_id+'"]')[0].lastChild.innerHTML = Data.currentEpg[i].title;
			}
		},
}