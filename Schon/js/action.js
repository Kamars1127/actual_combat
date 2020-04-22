$(document).ready(function(){

    /*------------------------------------------------------------------------------------
    ** Scrolled                           
    -------------------------------------------------------------------------------------*/
    $(document).scroll(function(e){
        var value = $(this).scrollTop();

        if(value){
            $('.navbar').addClass("scrolled");
        }else{
            $('.navbar').removeClass("scrolled");
        }
    });

    /*------------------------------------------------------------------------------------
    ** Hamburger Menu                           
    -------------------------------------------------------------------------------------*/
    $('#menu-toggle').click(function(e){
        $(this).toggleClass('open');
    });
});