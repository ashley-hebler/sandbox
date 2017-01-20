( function( $ ) {
	function load_video(autoplay) {
		var youtube = document.querySelectorAll( ".post-featured__video-src" );
		for (var i = 0; i < youtube.length; i++) {
			var iframe = document.createElement( "iframe" );
				iframe.setAttribute( "frameborder", "0" );
				iframe.setAttribute( "allowfullscreen", "" );
				iframe.setAttribute( "src", "https://www.youtube.com/embed/"+ youtube[i].dataset.embed +"?rel=0&showinfo=0&autoplay="+autoplay );
				youtube[i].innerHTML = "";
				youtube[i].appendChild( iframe );
		}
	}
	function load_audio() {
		var sc = document.querySelectorAll( ".post-featured__audio" );
		for (var i = 0; i < sc.length; i++) {
			var iframe = document.createElement( "iframe" );
				iframe.setAttribute( "frameborder", "0" );
				iframe.setAttribute( "allowfullscreen", "" );
				iframe.setAttribute( "height", sc[i].dataset.height );
				iframe.setAttribute( "src", sc[i].dataset.src );
				sc[i].innerHTML = "";
				sc[i].appendChild( iframe );
		}
	}
	function display_video() {
		var image_wrap = document.querySelectorAll( ".post-featured__inner.overlay .post-featured__video-src, .post-featured__inner--custom .post-featured__video-src" );
		if(image_wrap.length > 0) {
			for (var i = 0; i < image_wrap.length; i++) {
				image_wrap[i].addEventListener( "click", function() {
					this.parentNode.parentNode.classList.add('playing');
					this.parentNode.classList.add('swap');
					var iframe = document.createElement( "iframe" );
						iframe.setAttribute( "frameborder", "0" );
						iframe.setAttribute( "allowfullscreen", "" );
						iframe.setAttribute( "src", "https://www.youtube.com/embed/"+ this.dataset.embed +"?rel=0&showinfo=0&autoplay=1" );
						this.innerHTML = "";
						this.appendChild( iframe );
				} );
			}
		} else {
			load_video(0);
		}
	}
	var owl = jQuery('.owl-carousel');
	owl.on('initialized.owl.carousel', function(event) {
		load_audio();
		window.onYouTubePlayerAPIReady = function() {
			YT_ready(true)
		}
	})
	owl.owlCarousel({
			items: 1,
			merge: false,
			loop: true,
			lazyLoad: true,
			nav: true,
			margin: 10,
			rewind: true,
			callbacks: true,
			responsive:{
				940:{
					stagePadding: 75,
				},
				1260:{
					stagePadding: 150,
				},
				1600:{
					stagePadding: 300,
				}
			},
			navText: ['<svg class="icon"><use xlink:href="#icon-angle-left"></use></svg>','<svg class="icon"><use xlink:href="#icon-angle-right"></use></svg>'],
	});
	// If single run on page load
	var single = document.querySelectorAll( ".single-post" );
	if( single.length > 0 ) {
		window.addEventListener('load',
		function() {
			load_audio();
			display_video();
		}, false);
	}
})(jQuery);


function getFrameID(id) {
	var elem = document.getElementById(id);
	if (elem) {
		if (/^iframe$/i.test(elem.tagName)) return id; //Frame, OK
		// else: Look for frame
		var elems = elem.getElementsByTagName("iframe");
		if (!elems.length) return null; //No iframe found, FAILURE
		for (var i = 0; i < elems.length; i++) {
			if (/^https?:\/\/(?:www\.)?youtube(?:-nocookie)?\.com(\/|$)/i.test(elems[i].src)) break;
		}
		elem = elems[i]; //The only, or the best iFrame
		if (elem.id) return elem.id; //Existing ID, return it
		// else: Create a new ID
		do { //Keep postfixing `-frame` until the ID is unique
			id += "-frame";
		} while (document.getElementById(id));
		elem.id = id;
		return id;
	}
	// If no element, return null.
	return null;
}
// Define YT_ready function.
var YT_ready = (function() {
	var onReady_funcs = [],
		api_isReady = false;
	return function(func, b_before) {
		if (func === true) {
			api_isReady = true;
			for (var i = 0; i < onReady_funcs.length; i++) {
				// Removes the first func from the array, and execute func
				onReady_funcs.shift()();
			}
		}
		else if (typeof func == "function") {
			if (api_isReady) func();
			else onReady_funcs[b_before ? "unshift" : "push"](func);
		}
	}
})();
var players = {};
YT_ready(function() {
	jQuery(".thumb").each(function(i) {
		this.setAttribute( "id", "thumb_video_frame_"+i );
	});
	jQuery(".thumb + iframe[id]").each(function(i) {
		this.setAttribute( "id", "video_frame_"+i );
		var identifier = this.id;
		var frameID = getFrameID(identifier);
		if (frameID) {
			players[frameID] = new YT.Player(frameID, {
				events: {
					"onReady": createYTEvent(frameID, identifier),
					"onStateChange": watchYTEvent(frameID, identifier)
				}
			});
		}
	});
});
// Returns a function to enable play events
function createYTEvent(frameID, identifier) {
	return function (event) {
		var player = players[frameID];
		var video_url = player.getVideoUrl();
		ga_universal('send', 'event', 'Video', 'Loaded', video_url);
		jQuery('#thumb_'+frameID).click(function() {
			var $this = jQuery(this);
			$this.parent().parent().addClass('playing');
			player.playVideo();
		});
	}
}
// Returns a function to track play, pause, and end events
function watchYTEvent(frameID, identifier) {
	return function (event) {
		var player = players[frameID];
		var video_url = player.getVideoUrl();
		var hasBeenPaused = false;
		if (event.data == 1) {
			ga_universal('send', 'event', 'Video', 'Play', video_url);
		}
		// track when user clicks to Pause
		if (event.data == 2) {
			ga_universal('send', 'event', 'Video', 'Pause', video_url);
			hasBeenPaused = true;
		}
		// track when video ends
		if (event.data == 0) {
			ga_universal('send', 'event', 'Video', 'Finished', video_url);
		}
		if (event.data == 1 && !hasBeenPaused) {
		    ga_universal('send', 'event', 'Video', 'Initial Play', video_url);
		}
	}
}
// Load YouTube Frame API
(function(){
  var s = document.createElement("script");
  s.src = "https://www.youtube.com/player_api";
  var before = document.getElementsByTagName("script")[0];
  before.parentNode.insertBefore(s, before);
})();