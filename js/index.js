jQuery(document).ready(function($) {
  $('table.paper-list > tbody > tr').each(function () {
    var row = $(this);
    row.find('.popup-trigger').click(function () {
      row.find('.popup').slideToggle('fast');
    });
  });
});

(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
})(window,document,'script','//www.google-analytics.com/analytics.js','ga');
ga('create', 'UA-9065807-1', 'auto');
ga('send', 'pageview');
