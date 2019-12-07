Epg = {
		items: new vis.DataSet(),
		groups : new vis.DataSet(),
		container : null,
		timeline: null,
		options: {
				groupOrder: 'id',
				locale: 'en_EN',
			    zoomMax: 1000 * 60 * 60 * 4,
			    zoomMin: 1000 * 60 * 60 * 4,
			    start: new Date(),
			    end: utils.timelineEnd(),
			    maxHeight: 580,
			    zoomable:false,
			    stack: false,
			    editable: false,
			    orientation: 'top',
			    moveable: true,
			    verticalScroll: true,
		},
		epgStart: null,
		epgIndex: null,
		epgCh: null,
		epgChIndex: null,
		chList: [],
		nextEpgSelectionId: null,
		
		init : function(){
			this.container = document.getElementById('visualization');
			this.timeline = new vis.Timeline(this.container);
			this.timeline.setOptions(this.options);
			this.timeline.setGroups(this.groups);
			this.timeline.setItems(this.items);
			this.addGroups(Data.channelsData);
		},
		addGroups: function(data){
			for (var i in data) {
			    this.groups.add({
			        id: data[i].id,
			        content: '<img src="' + Server.openServer + Server.url.images + data[i].logo+'">'
			    });
			}
		},
		addItems: function(data){
				this.items.add(data);
		},
		setSelection: function(){
			var unixCurrent = Math.floor(Date.now() / 1000);
			currents = Data.epgData.filter(x => utils.timeToUnix(x.start) <= unixCurrent && utils.timeToUnix(x.end) >= unixCurrent && x.channel_id === parseInt(Player.selectedChannel.dataset.id));
			console.log(currents);
			if (currents.length > 0) {
			    var index = currents[0].id;
			    Epg.timeline.setSelection(index, {
			        focus: true,
			        animation: false
			    });
			    Epg.epgIndex = Epg.timeline.getSelection()[0];
			    Epg.epgStart = utils.timeToUnix(Epg.items._data[Epg.epgIndex].start);
			}
		}
}