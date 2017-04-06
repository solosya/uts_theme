$('document').ready(function() {

    var isMenuBroken, isScrolledPass, stickHeader, isMobile;
    var sbCustomMenuBreakPoint = 1260;
    var mobileView = 620;

    isMenuBroken = function(){
        if ($(window).width() > sbCustomMenuBreakPoint) {
            return false;
        }
        return true;
    };

    isScrolledPass = function(){
        var scroll = $(window).scrollTop();
        if (scroll >= 80) {
            return true;
        }
        return false;
    };

    // stickHeader = function(){
    //     if ( !isScrolledPass() ){
    //         $("#masthead").addClass("snow");
    //         return false;
    //     }
    //     $("#masthead").removeClass("snow");
    // };

    isMobile = function(){
        if ($(window).width() < mobileView) {
            return true;
        }
        return false;
    };

    stickHeader = function(){
        if ( isScrolledPass() ){
            $("#masthead").addClass("stick");
            $("#main-logo").addClass("small");
        } else {
            $("#masthead").removeClass("stick");
            $("#main-logo").removeClass("small");
        }
        return false;
    };   

    //Onload and resize events
    $(window).on("resize", function () {
        stickHeader();
    }).resize();

    //On Scroll
    $(window).scroll(function() {
        stickHeader();
    });

    $(".sb-custom-menu > ul").before("<a href=\"#\" class=\"menu-mobile\"><span class=\"sr-only\">MENU</span></a>");

    $('.menu > ul > li:has( > ul)').addClass('menu-dropdown-icon');

    $(".menu-mobile").click(function (e) {
        var thisMenuElem = $(this).parent('.sb-custom-menu');
        $(this).toggleClass("active");
        var masthead = $('#masthead');
        if (masthead.css('background-color') === 'rgba(0, 0, 0, 0)' ||
            masthead.hasClass('menu-background')) {
            $('#masthead').toggleClass('menu-background');
        }

        $(thisMenuElem).children('ul').toggleClass('show-on-tablet');
        $(thisMenuElem).toggleClass('open');
        e.preventDefault();
    });


    $(".sb-custom-menu > ul > li").hover(function (e) {
        if ($(window).width() > sbCustomMenuBreakPoint) {
            $(this).children("ul").stop(true, false).slideToggle(275);
            $(this).toggleClass('now-active');
            e.preventDefault();
        }
    });

    $("li.menu-item-search").bind("mouseenter focus mouseleave",function () {
        if ($(window).width() > sbCustomMenuBreakPoint) {
            $("input#header-search").focus();
            return false;
        }
    });

    $('#profile').on('click', function(e) {
        $('#header__menu').toggleClass('Profile_Open');
        $('body').toggleClass('no_profile');
        e.preventDefault();
    });

    cardHolder = '';

    clearTimeout(cardHolder);
    cardHolder = setTimeout((function() {
        $('.card p, .card h2').dotdotdot({
            watch: true
        });
    }), 750);



    var screenswiper = new Swiper('#screen-swiper', {
        spaceBetween: 30,
        effect: 'fade',
        pagination: '.swiper-paginations',
        paginationClickable: true,
        autoplay: 20000,
        autoplayDisableOnInteraction: false
    });


    Tipped.create('.tool_tipped', {
        maxWidth: 150,
        offset: { x: 0, y: -35 },

    });


	// var swiper = new Swiper('#index-swiper', {
 //        spaceBetween: 30,
 //        effect: 'fade',
 //        pagination: '.swiper-pagination',
 //        paginationClickable: true,
 //    });

    // $(".pagination-item").click(function(){
    //     var elem = $(this);
    //     var slideToSlide = elem.data("slide");
    //     elem.siblings().each(function(i,e) {
    //         $(e).removeClass('active');
    //     });

    //     elem.addClass('active');
    //     swiper.slideTo(slideToSlide);
    // });

});
