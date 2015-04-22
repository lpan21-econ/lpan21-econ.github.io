jQuery(document).ready(function($) {
  $(".nav a").on('click', function() {
    $(this).parent().parent().find('.active').removeClass('active');
    $(this).parent().addClass('active');
  })
  $(".navbar a").on('click', function(e) {
    var target = $(this.hash);
    if (target.selector == '') {
      scroll_to = 0;
    } else {
      target = $('[id=' + this.hash.slice(1) +']');
      if (target.length) {
        scroll_to = target.offset().top-75;
      } else {
        return true;
      }
    }
    $('html, body').animate({
      scrollTop: scroll_to
    }, 500);
    return false;
  });
});
