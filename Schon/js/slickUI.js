$(document).ready(function () {
    /*------------------------------------------------------------------------------------
    ** Product Detail Page - main product picture carousel                          
    -------------------------------------------------------------------------------------*/

    $('.big-picture').slick({
        slidesToShow: 1,
        slidesToScroll: 1,
        arrows: false,
        fade: true,
        asNavFor: '.picture-bar'
    });

    $('.picture-bar').slick({
        infinite: false,
        slidesToShow: 4.3,
        slidesToScroll: 1,
        asNavFor: '.big-picture',
        focusOnSelect: true
    });
});