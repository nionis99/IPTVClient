var Server = 
{
	data: {},
	token: '',
	server: '??????',
	openServer: '???????',
	url:{
		'login' : '/client/login',
		'channels' : '/client/channels',
		'epg' : '/epg/',
		'images' : '/images/',
	},
	cdn: '',
	epgCounter: 0,
	
	login: function(){	
	    $("#login").on('keypress', function(event) {
	        if (event.keyCode == 13) {
	            event.preventDefault();
	            $("#login").blur();
	            $("#password").focus();
	        }
	    });
	    $(document).on("keydown", function(event){
	        if(event.keyCode == 40 && $("#login").is(':focus')){
	        	$("#login").blur();
	        	$("#password").focus();
	        }
	        if(event.keyCode == 38 && $("#password").is(':focus')){
	        	$("#password").blur();
	        	$("#login").focus();
	        }
	    });
		$(document).on('submit', '#login_form', function() {
			var b = webapis.productinfo.getDuid();
			Server.data = {
					serial : b,
			};
            var login_form = $(this);
            var full_data = jQuery.extend(login_form.serializeObject(), Server.data);
            $.ajax({
                url: Server.server + Server.url.login,
                type: "POST",
                contentType: 'application/json',
                data: JSON.stringify(full_data),
                success: function(result) {
                	$("#login").off('keypress');
            	 	$(document).off("keydown");
                    utils.setCookie("address", result.address, 1);
                    utils.setCookie("token", result.token, 1); 
                    Server.getTVData();
                },
                error: function(xhr, status, error) {
                    login_form.find('input').val('');
                    $("#login").focus();
                    $("#password").blur();
                    var errObj, i, err = "";
                    errObj = xhr.responseJSON;
                    for (i in errObj) {
                        err += errObj[i] + "<br>";
                    }
                    alert(err);
                }
            });	
            return false;
        });
	},	
	getTVData: function(){
		Data.token = utils.getCookie('token');
		Data.cdn = utils.getCookie('address');
		 $.ajax({
	            url: Server.server + Server.url.channels,
	            type: "GET",
	            contentType: 'application/json',
	            headers: {
	                'Authorization': Data.token
	            },
	            success: function(result) {
	            	var start = +new Date();  // log start timestamp
	            	Queue.init(result);
	            	var end =  +new Date();  // log end timestamp
	            	var diff = end - start;
	            	console.log("!Server runtime: "+ diff/1000 + " s");
	            },
	            error: function(xhr, resp, text) {
	            	displayLogin.init();
					Server.login();	
	            }
	        });
	},
	getEpg: function(){
		$.ajax({
	        url: Server.openServer + Server.url.epg + utils.getDayByNr(0) + '.json',
	        success: function(data) {
	            for (var x in data) {
	            	data[x]["id"] = Server.epgCounter;
	                data[x]["group"] = data[x]["channel_id"];
	                data[x]["content"] = data[x]["title"];
	                data[x]["start"] = utils.unixToTime(data[x]["start"]);
	                data[x]["end"] = utils.unixToTime(data[x]["end"]);
	                data[x]["style"] = 'height:100px';
	                Server.epgCounter++;
	            }
	            Data.setEpgData(data);
	            Epg.addItems(data);
	            Epg.chList = Array.from(new Set(Data.epgData.map(x=> x.channel_id)));
	        },
	        error: function(err) {
	            console.log('Error', err);
	            if (err.status === 0) {
	                alert('Failed to load EPG.');
	            } else {
	                alert('Failed to load EPG.');
	            }
	        }
	    });
	},
	getEpgWeek: function(){
		var start = +new Date();  // log start timestamp
		for(var i=1; i<7; i++){
			$.ajax({
		        url: Server.openServer + Server.url.epg + utils.getDayByNr(i) + '.json',
		        success: function(data) {
		            for (var x in data) {
		            	data[x]["id"] = Server.epgCounter;
		                data[x]["group"] = data[x]["channel_id"];
		                data[x]["content"] = data[x]["title"];
		                data[x]["start"] = utils.unixToTime(data[x]["start"]);
		                data[x]["end"] = utils.unixToTime(data[x]["end"]);
		                data[x]["style"] = 'height:100px';
		                Server.epgCounter++;
		            }
		            Data.setFullEpg(data);
		        },
		        error: function(err) {
		            console.log('Error', err);
		            if (err.status === 0) {
		                alert('Failed to load EPG.');
		            } else {
		                alert('Failed to load EPG.');
		            }
		        }
		    });
		}
    	var end =  +new Date();  // log end timestamp
    	var diff = end - start;
    	console.log("!EPG Week runtime: "+ diff/1000 + " s");
	}
}
$.fn.serializeObject = function() {
    var o = {};
    var a = this.serializeArray();
    $.each(a, function() {
        if (o[this.name]) {
            if (!o[this.name].push) {
                o[this.name] = [o[this.name]];
            }
            o[this.name].push(this.value || '');
        } else {
            o[this.name] = this.value || '';
        }
    });
    return o;
};