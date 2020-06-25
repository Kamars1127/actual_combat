$(document).ready(function () {
    /*------------------------------------------------------------------------------------
    ** Handlebars Compile                           
    -------------------------------------------------------------------------------------*/
    var source = $('#cart-order-template').html();
    var template = Handlebars.compile(source);


    /*------------------------------------------------------------------------------------
    ** Scrolled                           
    -------------------------------------------------------------------------------------*/
    $(document).scroll(function (e) {
        var value = $(this).scrollTop();

        if (value) {
            $('.navbar').addClass("scrolled");
        } else {
            $('.navbar').removeClass("scrolled");
        }
    });


    /*------------------------------------------------------------------------------------
    ** Hamburger Menu                           
    -------------------------------------------------------------------------------------*/
    $('#menu-toggle').click(function (e) {
        $(this).toggleClass('open');
    });



    /*------------------------------------------------------------------------------------
    ** Shopping Cart                           
    -------------------------------------------------------------------------------------*/

    $('.cart')
        .on('click', '.cart-btn', function (e) {
            /*--- Add cart icon color ---*/
            $(this).children('.icon').toggleClass('active-branding-color');
            $(this).children('.item').toggleClass('active-bg-branding');

            /*--- Let web don't scroll ---*/
            $(this).closest('body').toggleClass('no-scroll');

            /*--- Show Buyer's orders ---*/
            var orderUI = "";
            var totalPrice = 0;
            var cartDetail = $(e.currentTarget).parent().children('#cart-detail'); 
            
            $.ajax({
                type: "get",
                url: "https://kamars1127.github.io/actual_combat/Schon/data/data.json",
                data: "",
                dataType: "json",
                success: function (data) {
                    
                    $.each(data.shoppingCart, function (index, product) { 
                        /* Connect order's info*/
                         orderUI += template(product);

                         /* calculate order price */
                         totalPrice += parseInt(data.shoppingCart[index].price);
                    });
                    
                    /* Add Buyer's order to cart */
                    cartDetail.children('.cart-order-area').append(orderUI);

                    /* Add order's total price to cart */
                    cartDetail.children('.cart-total-price').children('.price').append(totalPrice+',00');
                },
                error: function (xhr){
                    alert("Error!!");
                }
            });
        })
        .on('click', '.close-cart', function (e) {
            var parent = $(this).parent();
            var cartBtn = parent.siblings('.cart-btn');

            /*--- Close Shopping Cart ---*/
            parent.removeClass('show');

            /*--- Let web  scroll ---*/
            $(this).closest('body').removeClass('no-scroll');

            /*--- remove cart icon color ---*/
            cartBtn.children('.icon').removeClass('active-branding-color');
            cartBtn.children('.item').removeClass('active-bg-branding');
        })
        .on('click', '.delete-product .delete', function (e) {
            e.preventDefault();
            var doDelete = confirm("do you want to delete ?");
            if (doDelete) {

                $(e.currentTarget).closest('li').remove();
            }
        }); 



    /*------------------------------------------------------------------------------------
    ** Product Detail Page - main product picture carousel                          
    -------------------------------------------------------------------------------------*/

    if ($('.product-picture').length > 0) {
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
    }


    /*------------------------------------------------------------------------------------
    ** Product Detail Page - Purchase quantity                         
    -------------------------------------------------------------------------------------*/

    $('.quantity-select')
        .on('click', '.increase', function (e) {
            var value = parseInt($(this).siblings('input').val());

            if (value < 100) {
                var qty = value + 1;

                $(this).siblings('input').val(qty);
            }
        })
        .on('click', '.reduce', function (e) {
            var value = parseInt($(this).siblings('input').val());

            if (value > 1) {
                var qty = value - 1;

                $(this).siblings('input').val(qty);
            }
        });



    /*------------------------------------------------------------------------------------
    ** Product List Page - Filter & Category Button                       
    -------------------------------------------------------------------------------------*/
    $(".filter-btn, .category-btn").click(function (e) {
        $(this).toggleClass('click');
    });

    /*------------------------------------------------------------------------------------
    ** Product List Page - Price Range                      
    -------------------------------------------------------------------------------------*/

    $("#slider-range").slider({
        range: true,
        min: 1,
        max: 1000,
        values: [10, 599],
        slide: function (event, ui) {
            $("#amount").val("$" + ui.values[0] + " - $" + ui.values[1]);
        }
    });

    $("#amount").val("$" + $("#slider-range").slider("values", 0) +
        " - $" + $("#slider-range").slider("values", 1));


    /*------------------------------------------------------------------------------------
    ** Product List Page - Sort Select                     
    -------------------------------------------------------------------------------------*/

    $(".select-sort").selectmenu();

    /*------------------------------------------------------------------------------------
    ** Product List Page - Product Layout Change                    
    -------------------------------------------------------------------------------------*/

    /*--- layout Column ---*/
    $('.layout-column-btn').click(function (e) {
        e.preventDefault();

        var target = $(this).closest('.top').siblings('.show-product-area');

        /* Remove .layout-row and Add .layout-column  */
        target.removeClass('layout-row').addClass('layout-column');

        /* Reset col amount under .show-product-area */
        target.find('.col-amount').removeClass('col-12').addClass('col-6 col-sm-4');
    });

    /*--- layout Row ---*/
    $('.layout-row-btn').click(function (e) {
        e.preventDefault();

        var target = $(this).closest('.top').siblings('.show-product-area');

        /* Remove .layout-column and Add .layout-row  */
        target.removeClass('layout-column').addClass('layout-row');

        /* Reset col amount under .show-product-area */
        target.find('.col-amount').removeClass('col-6 col-sm-4').addClass('col-12');
    });
});