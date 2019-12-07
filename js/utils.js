var utils = {
		timelineStart : function() {
			  var date = new Date();
		      date.setHours(0);
		      date.setMinutes(0);
		      date.setSeconds(0);
		      date.setDate(date.getDate());
		      var strDate = date.getFullYear() + "-" + this.checkTime(date.getMonth()+1) + "-" + this.checkTime(date.getDate());
		      return strDate;
		},
		timelineEnd: function(){
			  var date = new Date();
		      date.setHours(0);
		      date.setMinutes(0);
		      date.setSeconds(0);
		      date.setDate(date.getDate());
		      var strDate = date.getFullYear() + "-" + this.checkTime(date.getMonth()+1) + "-" + this.checkTime(date.getDate());
		      return strDate;
		},
		getDayByNr : function(nr){
		      var date = new Date();
		      date.setHours(0);
		      date.setMinutes(0);
		      date.setSeconds(0);
		      date.setDate(date.getDate()+nr);
		      var strDate = date.getFullYear() + "" + this.checkTime(date.getMonth()+1) + "" + this.checkTime(date.getDate());
		      return strDate;
		},
		setCookie: function(cname, cvalue, exdays){
	        var d = new Date();
	        d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
	        var expires = "expires=" + d.toUTCString();
	        document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
		},
		getCookie: function(cname){
			var name = cname + "=";
	        var decodedCookie = decodeURIComponent(document.cookie);
	        var ca = decodedCookie.split(';');
	        for (var i = 0; i < ca.length; i++) {
	            var c = ca[i];
	            while (c.charAt(0) == ' ') {
	                c = c.substring(1);
	            }

	            if (c.indexOf(name) == 0) {
	                return c.substring(name.length, c.length);
	            }
	        }
	        return "";
		},
		checkTime : function(i) {
	        if (i < 10) {
	            i = "0" + i
	        }; // add zero in front of numbers < 10
	        return i;
		},
		unixToTime : function(UNIX_timestamp) {
			var a = new Date(UNIX_timestamp * 1000);
			var year = a.getFullYear();
			var month = a.getMonth() + 1;
			month = this.checkTime(month);
			var day = a.getDate();
			day = this.checkTime(day);
			var hour = a.getHours();
			hour = this.checkTime(hour);
			var min = a.getMinutes();
			min = this.checkTime(min);
			var sec = a.getSeconds();
			var time = year + "-" + month + "-" + day + " " + hour + ':' + min;
			return time;
		},
		timeToUnix: function(date){
			return new Date(date).getTime() / 1000;
		},
		int: function(number) {
	        return Math.round(number);
	    },
	    playerTimeUpdateOn : function() {
	    	var timeUpdate = {
	    		    onbufferingprogress: function(percent)
	                {
	                    //console.log("Buffering progress data : " + percent);
	                },
	    		    oncurrentplaytime: function() {
	    		    	Data.footerFunctionality();
	    		    	Data.headerFunctionality();
	    		    }
	    	};
	    	webapis.avplay.setListener(timeUpdate);
	    },
	    playerTimeUpdateOff : function() {
	    	var offTimeUpdate = {
	    		    onbufferingprogress: function(percent)
	                {
	                    //console.log("Buffering progress data : " + percent);
	                },
	    			oncurrentplaytime:function(){
	    				Data.checkCurrentTitles();
	    			}
	    	};
	    	webapis.avplay.setListener(offTimeUpdate);
	    },
	    clock : function(){
	    	 var today = new Date();
	    	 var h = today.getHours();
	    	 h = this.checkTime(h);
	    	 var m = today.getMinutes();
	    	 var s = today.getSeconds();
	    	 m = this.checkTime(m);
	    	 document.getElementById("clock").innerHTML = h + ":" + m;
	    },
	    currentTimeSlider: function(){
	    	var today = new Date();
	    	var h = this.checkTime(today.getHours());
	    	var m = this.checkTime(today.getMinutes());
	    	var s = this.checkTime(today.getSeconds());
	    	var time =  h + ":" + m + ":" + s;
	    	return time;
	    }, 

}