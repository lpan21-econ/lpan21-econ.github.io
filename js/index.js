plusminus = {'[+]': '[–]', '[–]': '[+]'};

jQuery(document).ready(function($) {
  $("a.abstract-expander").on('click', function() {
    $(this).html(plusminus[$(this).html()]);
  })
});
