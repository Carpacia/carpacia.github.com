$( document ).ready( function(){
	$(function() {
	  $('a[href*="#"]:not([href="#"])').not('.disableSmoothScroll').click(function() {
	    if (location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'') && location.hostname == this.hostname) {
	      var target = $(this.hash);
	      target = target.length ? target : $('[name=' + this.hash.slice(1) +']');
	      if (target.length) {
	        $('html, body').animate({
	          scrollTop: target.offset().top
	        }, 1000);
	        return false;
	      }
	    }
	  });
	});
	$("#personalSide").height($("#personal").height() + 20);
	$("#experienceSide").height($("#experience").height());
	$("#skillSide").height($("#skill").height());
	$("#groupSide").height($("#group").height());
});

$(".projectBlock").click(function(event){
	if(event.target.tagName != 'LI' && event.target.tagName != 'SPAN' && event.target.tagName != 'A'){
		if($(this).hasClass("col-md-4")){

			$(this).addClass("col-md-12");
			$(this).removeClass("col-md-4");
			$(this).children(".projectTitle").css("padding-bottom", "0px");
			$(this).children(".projectContent").show();
			$(this).children().children(".carousel").carousel('cycle');
		}
		else{
			$(this).removeClass("col-md-12");
			$(this).addClass("col-md-4");
			$(this).children(".projectTitle").css("padding-bottom", "5%");
			$(this).children(".projectContent").hide();
			$(this).children().children(".carousel").carousel('pause');
		}
	}
});
$(function() {
	$( '#dl-menu' ).dlmenu({
	});
});