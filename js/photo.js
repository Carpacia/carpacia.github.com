var shareFB = function(title, creator, description, picture){
	fbInitialDeferred.then(function(){
		FB.ui({
			  app_id: fb_id,
			  method: 'feed',
			  link: location.href,
			  caption: creator,
			  name: title,
			  description: description,
			  picture: picture
			}, function(response){});
	});
}

var shareFBVote = function(title, creator, description, picture, fileId){
	var FB_OauthUrl = "http://www.facebook.com/v2.8/dialog/oauth?" +
	  "client_id=" + fb_id + "&" +
	  "redirect_uri=" + location.protocol + "//" + document.domain + "/stat/events/I-Love-City/event_fb_login.jsp&" +
	  "scope=email";
	
	fb_win = window.open(FB_OauthUrl, '_blank', 'width=700,height=500,resizable=yes');
	var timer = setInterval(function() {
		if(fb_win.closed) {
			clearInterval(timer);
			if ($("#fb_uid").val()){
				checkVoteStatus($("#fb_uid").val(), fileId).done(function(data){
					//is voted
					if (data[fileId]){
						console.log("is voted");
					}else{  //is no voted
						if ($("#voteStatus").val() == "shareSuccess"){ // is shared to FB 
							console.log("Shared to FB");
							$.ajax({
								method: "POST",
								url: "/prog/event/common/event-video-vote-action.do",
								data: {
									 isFacebook: true,
									 uid: $("#fb_uid").val(),
								  	 voteName: $("#name").val(),
								  	 fb_email:$("#email").val(),
								  	 eventId: eventId,
								  	 nFileId: fileId,
								  	 isForward: 0,
								  	 votingType: 7
								}
							});
							//Update votes display
							$("votes").text(parseInt($("votes").text()) + 1);
						}else{
							console.log("Not shared to FB");
						}	
					}
				});
			}
		}
	}, 1000);
	
}

var checkVoteStatus = function(voterId, fileId){
	return $.ajax({
		method: "POST",
		dataType: "json",
		url: "ajax/voteStatusCheck.jsp",
		data: {fileId: fileId, uid: voterId}
	});
}
