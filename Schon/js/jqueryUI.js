$(document).ready(function () {
  /*------------------------------------------------------------------------------------
  ** jQuery UI select menu                     
  -------------------------------------------------------------------------------------*/

  /*--- Product List Page - Sort Select ---*/
  $(".select-sort").selectmenu();

  /*--- Shopping Cart Page - Language Select ---*/
  $('body.shopping-cart-page .select-country').selectmenu({
    open: function (event, ui) {
      $('.ui-menu .ui-state-disabled').hide();
    },
    select: function (event, ui) {
      $('body.shopping-cart-page .select-state-province').selectmenu({
        disabled: false
      });
    }
  });

  $('body.shopping-cart-page .select-state-province').selectmenu({
    open: function (event, ui) {
      $('.ui-menu .ui-state-disabled').hide();
    },
    disabled: true,
    select: function (event, ui) {
      $('body.shopping-cart-page .select-zip-postal_code').selectmenu({
        disabled: false
      });
    }
  });

  $('body.shopping-cart-page .select-zip-postal_code').selectmenu({
    open: function (event, ui) {
      $('.ui-menu .ui-state-disabled').hide();
    },
    disabled: true
  });


  /*--- Checkout Page - Country Select ---*/
  $('body.checkout-page .select-country').selectmenu();

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
});