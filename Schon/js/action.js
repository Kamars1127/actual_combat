function calTotalPrice(buyerOrder_id, totalPrice, data) {
    for (var i = 0; i < 4; i++) {
        var id = data.shoppingCart[i].id;
        var qty = data.shoppingCart[i].quanity;
        var unitPrice = parseInt(data.shoppingCart[i].price);
        var price = unitPrice * qty;

        if (id == buyerOrder_id) {
            totalPrice -= price;
            break;
        }
    }
    return totalPrice;
}

function setCartInfo(doDelete, is_existHomePage, cart, buyerOrder_amount, totalPrice) {
    if (doDelete) {
        buyerOrder_amount -= 1;
    }

    if (is_existHomePage) {
        cart.find('.cart-btn span.badge').text(buyerOrder_amount);
        cart.find('.cart-info span.item').text(buyerOrder_amount);
        cart.find('.cart-info span.price').text(totalPrice);
    } else {
        cart.children('.cart-btn').find('span.badge').text(buyerOrder_amount);
    }
    return buyerOrder_amount;
}

function deleteOrder(cart, buyerOrder_id, totalPrice, is_existCartPage) {

    /* Remove from cart */
    cart.find('.cart-order-area .buyer-orders[data-id="' + buyerOrder_id + '"]').remove();

    /*--- Modify total price from cart---*/
    cart.find('.cart-total-price span.num').text(totalPrice);

    if (is_existCartPage) {
        /* Remove from shopping cart page */
        $('.order-info-area[data-id="' + buyerOrder_id + '"]').remove();

        /*--- Modify total price ---*/
        $('.calculate-shopping .checkout-info .num').text(totalPrice);
    }
}

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
    var totalPrice = 0; //Buyer's order price toral
    var buyerOrder_amount = 0; // Buyer order amount
    /*--- Show Buyer's orders ---*/
    var orderUI = "";
    var cartPageOrderUI = "";
    var cart = $(document).find('#header .shopping-area .cart');
    var cartInfo = cart.find('.cart-info');
    var is_existHomePage = cartInfo.length;
    var is_existCartPage = $('body.shopping-cart-page').length;
    var is_existCheckOutPage = $('body.checkout-page').length;

    $.ajax({
        type: "get",
        url: "https://kamars1127.github.io/actual_combat/Schon/data/data.json",
        data: "",
        dataType: "json",
        success: function (data) {
            buyerOrder_amount = data.shoppingCart.length;

            var dataQty = 0,
                price = 0,
                unitPrice = 0;

            $.each(data.shoppingCart, function (index, product) {
                unitPrice = parseInt(data.shoppingCart[index].price);
                dataQty = data.shoppingCart[index].quanity;
                price = unitPrice * dataQty;

                /* Connect order's info*/
                orderUI += template(product);

                /* calculate order price */
                totalPrice += price;
            });

            /* Add Buyer's order to cart */
            cart.find('.cart-order-area').append(orderUI);

            /* Add order's total price to cart */
            cart.find('.cart-total-price').find('span.num').text(totalPrice + ",00");

            /* when is index page or other's pages*/
            buyerOrder_amount = setCartInfo(false, is_existHomePage, cart, buyerOrder_amount, totalPrice);

            /* when is shopping cart page*/
            if (is_existCartPage > 0) {
                var orderSrc = $('#order-info-template').html();
                var orderTemplate = Handlebars.compile(orderSrc);
                var dataId, orderId, orderQty;

                $.each(data.shoppingCart, function (index, product) {
                    dataId = data.shoppingCart[index].id;
                    dataQty = data.shoppingCart[index].quanity;
                    unitPrice = parseInt(data.shoppingCart[index].price);

                    /* show orders at front-rnd */
                    cartPageOrderUI = orderTemplate(product);
                    $('.shopping-cart-order .container').append(cartPageOrderUI);

                    /* set order product quantity at front-end*/
                    orderId = $('.shopping-cart-order .order-info-area[data-id="' + dataId + '"]');
                    orderQty = orderId.find('.quantity-select option[value="' + dataQty + '"]');
                    orderQty.prop('selected', true);

                    /* set order one of product total price*/
                    orderId.find('.total-price .price').text(unitPrice * dataQty);
                });

                $('.calculate-shopping .checkout-info .num').text(totalPrice + ",00");

                /*--- Shopping Cart Page - Language Select ---*/
                $('.order-info-area .quantity-select').selectmenu({
                    select: function (e, ui) {
                        var value = $(this).siblings('.ui-selectmenu-button').children('.ui-selectmenu-text').text();
                        var product_unitPrice = $(this).closest('.order-info-area').find('.product-price .price').text();
                        var product_price = value * product_unitPrice;
                        $(this).closest('.order-info-area').find('.total-price .price').text(product_price + ",00");
                    }
                });
            }


            /* when is checkout page*/
            if (is_existCheckOutPage > 0) {
                var orderSrc = $('#checkout-page-template').html();
                var orderTemplate = Handlebars.compile(orderSrc);
                var dataId, orderId;

                $.each(data.shoppingCart, function (index, product) {
                    dataId = data.shoppingCart[index].id;
                    dataQty = data.shoppingCart[index].quanity;
                    unitPrice = parseInt(data.shoppingCart[index].price);

                    /* show orders at front-rnd */
                    cartPageOrderUI = orderTemplate(product);
                    $('.billing-details .product-detail').append(cartPageOrderUI);

                    /* set order one of product total price*/
                    orderId = $('.billing-details .product-detail .product-detail-item[data-id="' + dataId + '"]');
                    orderId.find('.total .num').text(unitPrice * dataQty + ",00");
                });

                $('.billing-details .order-detail .orders-total-price .num').text(totalPrice + ",00");
            }
        },
        error: function (xhr) {
            alert("Error!!");
        }
    });

    $('.cart')
        .on('click', '.cart-btn', function (e) {
            /*--- Add cart icon color ---*/
            $(this).children('.icon').toggleClass('active-branding-color');
            $(this).children('.item').toggleClass('active-bg-branding');


            if (is_existHomePage) {
                $(this).find('.cart-info').find('li').toggleClass('active-branding-color');
                $(this).find('.cart-info').children('.title').toggleClass('active-branding-color');
            }

            /*--- Let web don't scroll ---*/
            $(this).closest('body').toggleClass('no-scroll');
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

            var buyerOrder = $(e.currentTarget).closest('li');
            var buyerOrder_id = buyerOrder.data('id');
            var doDelete = confirm("do you want to delete ?");


            if (doDelete) {
                $.ajax({
                    type: "get",
                    url: "https://kamars1127.github.io/actual_combat/Schon/data/data.json",
                    dataType: "json",
                    success: function (data) {

                        totalPrice = calTotalPrice(buyerOrder_id, totalPrice, data);

                        /*--- set Navigation's cart info---*/
                        buyerOrder_amount = setCartInfo(true, is_existHomePage, cart, buyerOrder_amount, totalPrice);

                        /*--- Delete from front-end ---*/
                        deleteOrder(cart, buyerOrder_id, totalPrice, is_existCartPage);
                    },
                    error: function (xhr) {
                        alert("Error!!");
                    }
                });
            }
        });


    /*--- When click other place to close cart detail ---*/
    $(document).mouseup(function (e) {
        var cartBtn = $('.cart-btn');

        if (!cartBtn.is(e.target) && cartBtn.has(e.target).length === 0) {
            cartBtn.siblings('#cart-detail').removeClass('show');

            /*--- remove cart icon color ---*/
            cartBtn.children('.icon').removeClass('active-branding-color');
            cartBtn.children('.item').removeClass('active-bg-branding');

            if (is_existHomePage) {
                cartBtn.find('.cart-info').find('li').removeClass('active-branding-color');
                cartBtn.find('.cart-info').children('.title').removeClass('active-branding-color');
            }

            /*--- Let web  scroll ---*/
            $('body').removeClass('no-scroll');
        }
    });


    /*------------------------------------------------------------------------------------
    ** Product Detail Page                         
    -------------------------------------------------------------------------------------*/

    /*--------------------
     ** Purchase quantity ---------*/
    if ($('body.pd-detail').length > 0) {
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
    }



    /*------------------------------------------------------------------------------------
    ** Product List Page                       
    -------------------------------------------------------------------------------------*/
    if ($('body.pd-list').length > 0) {

        /*--------------------
         ** Filter & Category Button ---------*/
        $(".filter-btn, .category-btn").click(function (e) {
            $(this).toggleClass('click');
        });


        /*--------------------
         ** Product Layout Change ---------*/

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
    }



    /*------------------------------------------------------------------------------------
    ** Shopping Cart Page                    
    -------------------------------------------------------------------------------------*/
    if ($('body.shopping-cart-page').length > 0) {

        /*--------------------
         ** Select Language ---------*/
        $('.language-area')
            .on('click', '.language-btn', function (e) {
                $(this).toggleClass('active');
                $(this).siblings('.language-menu').toggleClass('show');
            })
            .on('click', '.language-menu li', function (e) {

                var language = $(this).text();

                $(this).closest('.language-area').find('.language').text(language);

            });

        /*--- When click other place to close language menu ---*/
        $(document).mouseup(function (e) {
            var languageBtn = $('.language-btn');

            if (!languageBtn.is(e.target) && languageBtn.has(e.target).length === 0) {
                languageBtn.siblings('.language-menu').removeClass('show');
                languageBtn.removeClass('active');
            }
        });


        /*--------------------
         ** Order info ---------*/
        $('.shopping-cart-order').on('click', '.order-info-area .delete-order .delete', function (e) {
            e.preventDefault();

            var buyerOrder = $(e.currentTarget).closest('.order-info-area');
            var buyerOrder_id = buyerOrder.data('id');
            var doDelete = confirm("do you want to delete?");

            if (doDelete) {
                $.ajax({
                    type: "get",
                    url: "https://kamars1127.github.io/actual_combat/Schon/data/data.json",
                    dataType: "json",
                    success: function (data) {
                        totalPrice = calTotalPrice(buyerOrder_id, totalPrice, data);

                        /*--- set Navigation's cart info---*/
                        buyerOrder_amount = setCartInfo(true, is_existHomePage, cart, buyerOrder_amount, totalPrice);

                        /*--- Delete from front-end ---*/
                        deleteOrder(cart, buyerOrder_id, totalPrice, is_existCartPage);
                    },
                    error: function (xhr) {
                        alert("Error!!");
                    }
                });
            }

            /*--- Delete from front-end ---*/

        });
    }



    /*------------------------------------------------------------------------------------
    ** Blog Page                    
    -------------------------------------------------------------------------------------*/
    if($('body.blog-page').length > 0){
        /*--- When click other place to close category menu ---*/
        $(document).mouseup(function (e) {
            var categoryBtn = $('.banner-bar .category-btn');

            if (!categoryBtn.is(e.target) && categoryBtn.has(e.target).length === 0) {
                categoryBtn.siblings('.category-menu').removeClass('show');
            }
        });
    }

    /*------------------------------------------------------------------------------------
    ** Blog List Sidebar 2 Page                    
    -------------------------------------------------------------------------------------*/
    $('#post-carousel').on('slid.bs.carousel', function (e) {
        var fitstItem = $(this).find('.carousel-item:first-child');
        var lastItem = $(this).find('.carousel-item:last-child');
        var previous = $(this).siblings('.page-nav').find('li.left-item');
        var next = $(this).siblings('.page-nav').find('li.right-item')

        if (fitstItem.hasClass('active')) {
            previous.addClass('disabled');
        } else {
            previous.removeClass('disabled');
        }

        if (lastItem.hasClass('active')) {
            next.addClass('disabled');
        } else {
            next.removeClass('disabled');
        }
    });

    /*------------------------------------------------------------------------------------
    ** Blog Masonry
    -------------------------------------------------------------------------------------*/
    if ($('body.blog-masonry').length > 0) {
        /*------ Pagination ------*/
        var pageTotal = 0;

        $('nav.page-nav').on('click', '.page-item .page-link', function (e) {
            e.preventDefault();

            var pageItem = $(this).closest('.pagination').children('.page-item');
            var nowPage = pageItem.children('.page-link.active');
            pageTotal = $(pageItem).length - 1; // next button is one of pageItem
            var pageNum = parseInt(nowPage.text()) + 1; // when click on next button, what page number is now
            var isNextBtn = $(this).hasClass('next'); // judgment is not click on next button ?

            /** judgment is click on page number or on next button **/
            if (!isNextBtn) {
                /* click page number */
                var clickPageNum = parseInt($(this).text());
                /* next button has no disabled class*/
                $(this).parent().siblings('.page-item.disabled').removeClass('disabled');

                /* when is last page has to add disabled class on next button */
                if (clickPageNum === pageTotal) {
                    $(this).parent().next().addClass('disabled');
                }
            } else {
                 /* now page remove active class */
                 nowPage.removeClass('active');
                 /* next page add active class */
                 nowPage.parent().next().children().addClass('active');
                
                 /* when is last page has to add disabled class on next button */
                if (pageNum === (pageTotal)) {
                    $(this).parent().addClass('disabled');
                }
            }
        });

        /*------ Lord more ------*/
        $('.blog-post-waterfall .blog-post').slice(3).hide();
        
        if($('.blog-post-waterfall .blog-post:hidden').length > 0){
            $('.blog-post-waterfall .load-more').show();
        }else{
            $('.blog-post-waterfall .load-more').hide();
        }

        $('.blog-post-waterfall').on('click', '.load-more-btn', function(e){
            $(this).closest('.blog-post-waterfall').find('.blog-post:hidden').show();
            $(this).parent('.load-more').hide();
        });
    }

});