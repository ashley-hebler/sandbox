(function($) {
	/*
	/* Toggle function for comments dropdown
	*/
	$(function($){
		$('#accordion').find('.accordion-toggle').click(function(){
		  //Expand or collapse this panel
		  $(this).next().slideToggle('fast');
		});
	}(jQuery));
})(jQuery);