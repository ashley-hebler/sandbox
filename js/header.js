(function($) {
	/*
	/* GA event helper (if needed in another section, move to own module)
	*/
	var gaEvent = function(category, label, value, interaction) {
		if ( typeof( ga_universal ) === "function" ) {
			if( interaction === undefined ) {
			        interaction = false;
			}
			return ga_universal( 'send', 'event', category, label, value, {nonInteraction: interaction} );
		}
	}
	/*
	/* Toggle function for menu and search
	*/
	$(function($){
		toggle(".search-toggle", ".search-container", ".search-wrap", "search");
		toggle(".menu-push", ".menu-container", ".menu-wrap", "menu");

		function toggle(target, container, wrap, body_class) {
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
					body.removeClass(body_class + '-close').addClass(body_class + '-open')
				} else {
					$(this).removeClass('open').addClass('close');
					container_el.removeClass('open').addClass('close');
					body.removeClass(body_class + '-open').addClass(body_class + '-close')
				}
			});
			//Toggle close/open outside of element
			$(document).add(close).on('click touchstart', function(e) {
				if (!$(e.target).closest(wrap).length && !$(e.target).is(wrap)) {
					target_el.removeClass('open');
					container_el.removeClass('open');
					body.removeClass(body_class + '-open');
					target_el.addClass('close');
					container_el.addClass('close');
					body.addClass(body_class + '-close');
				}

			});
			//Toggle close/open on click of toggle
			close.on('click', function(e) {
				e.preventDefault();
				target_el.removeClass('open');
				container_el.removeClass('open');
				body.removeClass(body_class + '-open');
				target_el.addClass('close');
				container_el.addClass('close');
				body.addClass(body_class + '-close');
			});
		}
	}(jQuery));
	/*
	/* Add dropdown toggle that display child menu items.
	*/
	$(function($){
		// Expand or collapse subcategories
		$('.main-nav .menu-item-has-children > a').after('<button class="dropdown-toggle" aria-expanded="false"/>');
		$('.main-nav .menu-item-has-children.topics .dropdown-toggle').addClass('toggle-on');
		$('.dropdown-toggle').click(function(event) {
			event.preventDefault();
			$(this).toggleClass('toggle-on');
		});
		// Only show one subcategory at a time
		$('.main-nav__list > .menu-item-has-children > .dropdown-toggle').addClass('dropdown-toggle--parent');
		$('.dropdown-toggle--parent').click(function(event) {
			$('.dropdown-toggle--parent').not($(this)).removeClass('toggle-on');
		});
		// Default open first item
		$('#site-navigation li:nth-of-type(1) a .dropdown-toggle').parent().next().addClass('toggle-on');
		$('#site-navigation li:nth-of-type(1) a .dropdown-toggle').parent().addClass('toggle-on');
	}(jQuery));
	/*
	/* Add multi-level menu functionality.
	*/
	$(function($){
		if( $('.main-nav-multi')[0] ) {
			// Add button to expand or collapse subcategories
			$('.main-nav-multi .menu-item-has-children.menu-item--first-level > .menu-item__wrap a').after('<button class="dropdown-toggle" aria-expanded="false"/>');
			$('.main-nav-multi .dropdown-toggle').click(function(event) {
				event.preventDefault();
				// Only goes 2 levels deep
				var level = $('.menu-item--first-level');
				if ($(this).parents('.sub-menu').length == 1) {
					level = $('.menu-item--second-level');
				}
				var parent = $(this).parent().parent();
				var parent_sibs = level.not(parent);
				if (parent.hasClass('toggle-on')) {
					// Remove class on main container
					$('.main-nav-multi').removeClass('toggled').addClass('not-toggled');
					// Show siblings and bring this back
					parent.removeClass('toggle-on');
					parent_sibs.removeClass('toggle-off');
				} else {
					// Add class to main container
					$('.main-nav-multi').removeClass('not-toggled').addClass('toggled');
					// Show this and hide siblings
					if (parent.hasClass('toggle-off')) {
						parent.removeClass('toggle-off');
					}
					parent_sibs.removeClass('toggle-on').addClass('toggle-off');
					parent.addClass('toggle-on');
				}
			});
			// Add trending box
			menuTrending();
		}
	}(jQuery));
})(jQuery);