( function( $ ) {
    var owl = $('.owl-carousel');
    owl.owlCarousel({
        items: 1,
        merge: false,
        loop: true,
        autoplay: true,
        lazyLoad: true,
        nav: false,
        dots: true,
        margin: 10,
        navRewind: true,
        callbacks: true,
    });
})(jQuery);