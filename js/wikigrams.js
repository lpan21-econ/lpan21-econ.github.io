// wikigrams plotter

var svg = d3.select("#wikigrams"),
    margin = {top: 20, right: 150, bottom: 30, left: 70},
    width = +svg.attr("width") - margin.left - margin.right,
    height = +svg.attr("height") - margin.top - margin.bottom;

var parseDate = d3.timeParse("%Y-%m-%d");

var x = d3.scaleTime().range([0, width]),
    y = d3.scaleLinear().range([height, 0]);

var xAxis = d3.axisBottom(x),
    yAxis = d3.axisLeft(y);

var g = svg.append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

function plot_series(tokens, data) {
    // clear old graph
    g.selectAll('*').remove();

    // frequency ranges by token
    var maxs = {}
    $.each(tokens, function(i, tok) {
        maxs[tok] = d3.max(data, function(d) { return d[tok]; });
    });

    // plot domain
    x.domain(d3.extent(data, function(d) { return d.date; }));
    y.domain([0, d3.max(d3.values(maxs))]);

    // draw lines
    // var cmap = ['#93c7ff', '#98f1ab', '#ffa09b', '#d1bcff', '#ffffa4', '#b1e1e7']; // pastel
    var cmap = ['#4c72b1', '#55a968', '#c54e52', '#8272b3', '#cdba74', '#64b6ce']; // deep
    // var cmap = ['#4878d0', '#6acd65', '#d75f5f', '#b57cc8', '#c5ae66', '#77bfdc']; // muted
    var stokens = tokens.sort(function(a, b) { return maxs[a] < maxs[b]; });
    $.each(stokens, function(i, tok) {
        var col = cmap[i];
        var line = d3.line()
            .x(function(d) { return x(d.date); })
            .y(function(d) { return y(d[tok]); });

        g.append("path")
            .datum(data)
            .attr("class", "line")
            .attr("fill", "none")
            .attr("stroke", col)
            .attr("stroke-width", 1.5)
            .attr("d", line);

        g.append("text")
            .attr("class", "legend")
	        .attr("x", width + 10)
            .attr("y", 10 + 25*i)
            .attr("stroke", col)
	        .text(tok);
    });

    // draw axes
    g.append("g")
        .attr("class", "axis axis--x")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

    g.append("g")
        .attr("class", "axis axis--y")
        .call(yAxis);
}

function type(d) {
    for (tok in d) {
        if (tok == "date") {
            d[tok] = parseDate(d[tok]);
        } else {
            d[tok] = +d[tok];
        }
    }
    return d;
}

function plot_tokens(tokens) {
    var url = 'http://dohan.dyndns.org:9454/freq?token=' + tokens.join(',');
    d3.csv(url, type, function(data) {
        plot_series(tokens, data);
    });
}

// hooks
var tokin = $("#tokens");
var itok = ['graphene','nanotube','crispr'];
tokin.val(itok);

tokin.keypress(function(e) {
    if (e.keyCode == 13) {
        var text = tokin.val();
        if (text.length > 0) {
            var tokens = $.map(tokin.val().split(','), function(tok) { return tok.trim(); });
            plot_tokens(tokens);
        }
    }
});

// initial
plot_tokens(itok);

