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
    // $("#hey").fadeIn("show");
    // $("#nice").fadeIn("show");
	/*$("#gallery_flow li >div").mouseover(function(){
	    $(this).find(".state, .title").css("display", "block");
	});
	$("#gallery_flow li >div").mouseout(function(){
	    $(this).find(".state, .title").css("display", "none");
	});*/
});
