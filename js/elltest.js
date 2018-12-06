// inline elltest

var etarg = $('#elltwo');
var cell = $('#cell');
var input = $('#input');
var render = $('#render');

elltwo.init('#elltwo', {
    render: false
});

render.change(function() {
    var checked = $(this).prop('checked');
    if (checked) {
        var code = input.val();
        if (code.trim().length == 0) {
            code = '&nbsp;';
        }
        var html = marktwo.parse(code);
        cell.html(html);
        elltwo.apply_render(cell, true);
    }
    etarg.toggleClass('render');
    console.log(code);
});
