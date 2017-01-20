// Reference: https://github.com/janl/mustache.js
( function( $ ) {
	var counter = 0;
	// must use the same static offset in post-card file
	var static_offset = 18;
	var offset = static_offset;
	var tab = 'non_expired';
	var data, postData, leftSide, rightSide;
	var dataURL = '/wp-json/rare/v1/homepage/';
	if( typeof window.rare != 'undefined' && typeof window.rare.pageData['pagePostType2'] != 'undefined' ) {
		window.pageType = window.rare.pageData['pagePostType2'];
		switch(window.pageType) {
			case 'category-post':
				// Get category from pageData
				if( typeof window.rare.pageData['pageName'] != 'undefined' ) {
					window.slug = window.rare.pageData['pageName'];
				} else {
					window.slug = 'rare';
				}
				dataURL = '/wp-json/rare/v1/category/'+window.slug+'/';
			break;
			case 'tag-post':
				// Get category from pageData
				if( typeof window.rare.pageData['slug'] != 'undefined' ) {
					window.slug = window.rare.pageData['slug'];
				} else {
					window.slug = 'rare';
				}
				dataURL = '/wp-json/rare/v1/post_tag/'+window.slug+'/';
		}
	}
	var loadData = function( offset ) {
		$( '.more-btn' ).prop("disabled", true);
		$.getJSON( dataURL+tab+'/'+offset+'/'+static_offset, function( data ) {
			if( data.length > 0 ) {
				$( '.more-btn' ).prop("disabled", false);
			}
			// half the results go left, the remainder go right :)
			leftSide = data.splice(0, Math.round(data.length / 2));
			rightSide = data;
			postData = {
			  "posts": leftSide
			};
		});
	};

	var processTemplate = function() {
		try {
			var rendered = $.parseHTML( Mustache.render( homeTemplate, postData ) );
			$( '#template-output-'+tab ).append( rendered ).children(':last').hide().fadeIn();
			return true;
		} catch(e) {
			return false;
		}
	};

	// get initial template to reuse
	if ( $("body").hasClass('feed') && $("body").hasClass('thumb_rows') ) {
		$.get( '/widgets/post-card-template-image-feed-extended', function( data ) {
			homeTemplate = data;
			// load initial set of data
			loadData( offset );
		});
	} else if( $("body").hasClass('feed') && $("body").hasClass('default')) {
		$.get( '/widgets/post-card-template-image-feed', function( data ) {
			homeTemplate = data;
			// load initial set of data
			loadData( offset );
		});
	} else {
		$.get( '/widgets/post-card-template-alt', function( data ) {
			homeTemplate = data;
			// load initial set of data
			loadData( offset );
		});
	}


	// other tabs
	$( ".tab-btn" ).each(function(index) {
		$(this).on("click", function(e) {
			// tab determines which data set
			tab = $(this).attr('data-current');
			// count determined by data-count on button
			var btn = $('.more-btn[data-tab='+tab+']');
			count = btn.attr("data-count");
			offset = (count * static_offset) + static_offset;
			loadData( offset );
		});
	});

	// load more
	$( ".more-btn" ).each(function(index) {
		$(this).on("click", function(e) {
			// tab determines which data set
			e.preventDefault();
			tab = $(this).attr('data-tab');
			template = $(this).attr('data-template');
			counter = +$(this).attr('data-count');
			counter = counter + 1;
			// if even click, change postData to right side
			if(counter % 2 == 0) {
				postData = {
				  "posts": rightSide
				};
			}
			// process Template
			if ( processTemplate() ) {
				// keep count for each click
				$(this).attr('data-count', counter);
				// if even click, grab next data
				if(counter % 2 == 0) {
					offset = (counter * static_offset) + static_offset;
					loadData( offset );
				}
			}
		});
	});

})(jQuery);