(function($) {
	/*
	/* Tabs
	*/
	$(function($){
		// If archive run on page load
		var archive = document.querySelectorAll( ".archive" );
		if( archive.length > 0 ) {
			var hash = window.location.hash.substr(1);
			var pages = ['episodes', 'about', 'content'];
			if( hash.length > 0 && pages.indexOf(hash) != -1 ) {
				$('.'+hash+'.tab-content').addClass('current');
				$('[data-tab='+hash+']').addClass('current');
			} else {
				$('.tab-content.episodes').addClass('current');
				$('[data-tab="episodes"]').addClass('current');
			}
	    	$('#tabs-menu .banner-menu-nav__link').click(function(event) {
	    		event.preventDefault();
	    		$('.tabs-container').find('.current').removeClass('current');
				var tab_id = $(this).attr('data-tab');
				$(this).addClass('current');
				$('.tabs-container').find('.'+tab_id).addClass('current');
				history.pushState(null,null,'#'+tab_id);
			})
		}
  	}(jQuery));
	/*
	/* Toggle function for menu and search
	*/
	$(function($){
		toggle(".toggle-btn--search", ".search-container", "search");
		toggle(".toggle-btn--nav", ".main-nav", "navigation");
		toggle(".main-nav__menu-btn--nav1", ".main-nav__menu-container--nav1", "menu");
		toggle(".main-nav__menu-btn--nav2", ".main-nav__menu-container--nav2", "menu-topics");
		toggle(".main-nav__menu-btn--nav3", ".topics > div", "menu-topics");
		function toggle(target, container, body_class) {
			var target_el = $(target);
			var container_el = $(container);
			var body = $('body');
			var close = $( container+' .close');
			//Toggle close/open on click of toggle
			target_el.on('click', function(e) {
				e.preventDefault();
				if ($(this).hasClass('close')) {
					$(this).removeClass('close').addClass('open');
					container_el.removeClass('close').addClass('open');
					body.removeClass(body_class + '-close').addClass(body_class + '-open');

					if( container_el.siblings().hasClass('open') ) {
						container_el.siblings().removeClass('open').addClass('close');
						target_el.siblings().removeClass('open').addClass('close');
					}
				} else {
					$(this).removeClass('open').addClass('close');
					container_el.removeClass('open').addClass('close');
					body.removeClass(body_class + '-open').addClass(body_class + '-close')
				}
			});
		}
	}(jQuery));
	/*
	/* Auto open topics on mobile
	*/
	$(function($){
		var w = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
		if(w < 481) {
			$(".toggle-btn--nav").click(function(){
				if($(this).hasClass("open")) {
					$(".main-nav__menu-btn--nav2").removeClass("close").addClass("open")
					$("body").addClass("menu-topics-open")
				} else {
					$(".main-nav__menu-btn--nav2").addClass("close").removeClass("open")
					$("body").removeClass("menu-topics-open")
				}
			});
			$(".main-nav__menu-btn--nav1").click(function(){
				if($("body").hasClass("menu-topics-open")) {
					$("body").removeClass("menu-topics-open")
					$(".main-nav__menu-btn--nav2").addClass("close").removeClass("open")
				}
			});
		}

	}(jQuery));
	/*
	/* Add dropdown toggle that display child menu items.
	*/
	$(function($){
		// Expand or collapse subcategories
		$('.main-nav .menu-item-has-children > a').after('<button class="dropdown-toggle" aria-expanded="false"/>');
		$('.dropdown-toggle').click(function(event) {
			event.preventDefault();
			$(this).parent().toggleClass('toggle-on');
		});
	}(jQuery));
	/*
	/* Add See All Topics functionality
	*/
	$(function($){
		// Expand or collapse subcategories
		$('.topics .see-all').click(function(event) {
			event.preventDefault();
			$(this).toggleClass('toggle-on');
			var contents = $(this).find('.sub-menu').children().clone();
			document.createTextNode(contents);
			$(this).parent().append(contents);
		});
	}(jQuery));
	/*
	/* Custom search
	*/
	$(function($){
		//http://www.clark.com/search?q
		$('#customSearchForm').submit(function(ev) {
		    ev.preventDefault();
		    var search_term = $('#customSearchInput').val();
		    window.location = '//www.clark.com/search?q=' + encodeURIComponent(search_term);
		});
	}(jQuery));
})(jQuery);