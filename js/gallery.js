$.ajaxSetup({traditional: true});
$( document ).ready( function(){
	var photoColumnList = [];
	var listViewList = [];
	var photosIdInView = [];
	var photosToAdd = [];
	var photoCloumnNumber = 3;
	if ($(window).width() >= 480){
		photoCloumnNumber = 3;
		$("#gallery_flow").addClass("gallery-col-3");
	}else{
		photoCloumnNumber = 2;
		$("#gallery_flow").addClass("gallery-col-2");
	}
	
	for (var i = 0; i < photoCloumnNumber; i++){
		var createdPhotoColumn = $("<li>");
		photoColumnList.push(createdPhotoColumn);
		var listView = new infinity.ListView(createdPhotoColumn, {
			lazy: function() {
				$(this).find('.lazyload').each(function() {
					var $ref = $(this);
					$ref.attr('src', $ref.attr('data-original'));
				});
			}
		});
		listViewList.push(listView);
		$("#gallery_flow").append(createdPhotoColumn);
		
		/*
		//Just for test
		for (var j = 0; j< 1000 ; j++){
			 var $newContent = $(`<div>
						<img src="images/gallery/small/sample_1.jpg" alt="">
						<ul class="state">
							<li><img src="images/thumb_icon.png" alt="">&nbsp;22,632</li><li>
							<img src="images/eye_icon.png" alt="">&nbsp;181,060</li>
						</ul>
						<div class="title">
							Robert LambRobert LambRobert LambRobert
						</div>							
					</div>`);
			 listViewList[i].append($newContent);
		}
		*/
	}
	
	var isAllDataLoadFinished = false;
	var isLoading = false;
	var waterFallLoading = window.setInterval(function(){
		if (!isAllDataLoadFinished){
			//console.log("Still has data can load");
			var shortestListView;
			var shortestColumn;
			for (var i=0; i<photoCloumnNumber; i++){
				var photoColumn = photoColumnList[i];///////////////////////////////
				
				var photoColumnBottomPosition = photoColumn.offset().top + photoColumn.height();
				//if (photoColumn.find("[data-infinity-pageid]").length > 0){
					//photoColumnBottomPosition = photoColumn.find("[data-infinity-pageid]").last().offset().top + photoColumn.find("[data-infinity-pageid]").last().height()
				//}
				
				if ($(document).scrollTop() + $(window).height() > photoColumnBottomPosition){
					if (!shortestColumn || shortestColumn.height() > photoColumn.height() ){ // find shourtest photo column
						shortestColumn = photoColumnList[i];
						shortestListView = listViewList[i];
					}
					//console.log("loading");
				}
				
			}
			if (shortestListView && !isLoading){ //found shortest photo column
				isLoading = true;
				//Add photo to column
				
				//getPhotos().then(addPhotos);
				getPhoto().then(function(photoToAdd){
					if (photoToAdd){
						var photoDOMToAdd = getPhotoDOMFormPhotoJSON(photoToAdd);
						shortestListView.append(photoDOMToAdd);
						photosIdInView.push(photoToAdd.fileId);
					}else{
						isAllDataLoadFinished = true;
					}
					
					isLoading = false;
				});				
				
			}else{
				//console.log("load pause");
			}
		}else{
			//console.log("All data loaded");
			window.clearInterval(waterFallLoading);
		}
	}, 100);
	
	var getPhoto = function(){
		var deferred = $.Deferred();
		
		if (photosToAdd.length > 0){
			deferred.resolve(photosToAdd.shift());
		}else{
			//Just for test -start
			/*
				var fakeData = [
					{
						title: '測試的假資料',
						image: 'http://directorzone.cyberlink.com/MemberCreation/2016/11/17/1789754649-1479413391674.JPG',
						votes: 0,
						views: 0,
						fileId: 0
					},{
						title: '測試的假資料',
						image: 'http://uploadfile.cyberlink.com/events/3935/2016-12-09/2_revise_External_20161209132002247.jpg',
						votes: 0,
						views: 0,
						fileId: 0
					},{
						title: '測試的假資料',
						image: 'http://uploadfile.cyberlink.com/events/3935/2016-12-07/2_revise_External_0_0_20161207235815.jpg',
						votes: 0,
						views: 0,
						fileId: 0
					}];
				for (var j = 0 ; j< 10 ; j++){				
					photosToAdd.push(fakeData[Math.round(Math.random()*2)]);
				}		
			*/
			//Just for test - end
			
			//Query for new photos				
			$.ajax({
				method: "POST",
				url: "ajax/queryMorePhotos.jsp",
				dataType: "json",
				data: {
					photosIdInView : photosIdInView,
					category: category,
					order: order
				}
			}).done(function(data) {
				for (var i = 0 ; i < data.length ; i++){
					photosToAdd.push(data[i]);
				}
				deferred.resolve(photosToAdd.shift());
			});
			
		}
		
		return deferred;
	};
	
	var getPhotoDOMFormPhotoJSON = function(photoToAdd){
		var $newContent = $('<div class="work" onclick="location.href=\'photo.jsp?fileId=' + photoToAdd.fileId + '&category=' + category + '&order=' + order + '\';" onmouseover="$(this).find(\'.state, .title\').show();" onmouseout="$(this).find(\'.state, .title\').hide();">	<img class="lazyload" data-original="' + photoToAdd.image + '" src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7" alt="">	<ul class="state">	<li><img src="images/thumb_icon.png" alt="">&nbsp;' + photoToAdd.votes + '</li><li>	<img src="images/eye_icon.png" alt="">&nbsp;' + photoToAdd.views + '</li></ul><div class="title">' + photoToAdd.title + '</div>	</div>');
		return $newContent;
	}
	
	
});
