var Queue = {
		init : function (data){
			var start = +new Date();  // log start timestamp 
			Data.setChannelsData(data);
        	displayMain.init();
        	Data.addChSideList(Data.channelsData);
        	Data.addChCenterList(Data.channelsData);
        	Player.init();
        	Epg.init();
        	Server.getEpg(); 
        	Main.registerKeys();
			Main.registerKeyHandler();	
			Server.getEpgWeek();
        	var end =  +new Date();  // log end timestamp
        	var diff = end - start;
        	console.log("!Queuee runtime: "+ diff/1000 + " s");	
        	Data.sortFullEpgData();
		},
}