jQuery(document).ready(function($) {
  $('table.paper-list > tbody > tr').each(function () {
    var row = $(this);
    row.find('.popup-trigger').click(function () {
      row.find('.popup').slideToggle('fast');
    });
  });
});
