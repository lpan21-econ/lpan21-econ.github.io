// wikigrams plotter

// display
var svg = d3.select("#wikiplot"),
    margin = {top: 20, right: 80, bottom: 30, left: 70},
    aspect = 0.55;

// tools
var parseDate = d3.timeParse("%Y-%m-%d");

// colormaps
var cmapPastel = ['#93c7ff', '#98f1ab', '#ffa09b', '#d1bcff', '#ffffa4', '#b1e1e7']; // pastel
var cmapDeep = ['#4c72b1', '#55a968', '#c54e52', '#8272b3', '#cdba74', '#64b6ce']; // deep
var cmapMuted = ['#4878d0', '#6acd65', '#d75f5f', '#b57cc8', '#c5ae66', '#77bfdc']; // muted

// placement
var g = svg.append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// plotting
function plot_series(tokens, data) {
    itok = tokens;
    idata = data;

    // reform data
    var freqs = data.columns.slice(1).map(function(tok) {
        return {
            tok: tok,
            values: data.map(function(d) {
                return {date: d.date, freq: d[tok]};
            })
        };
    });

    var outerWidth = $("svg").parent().width();
    var outerHeight = aspect*outerWidth;
    var width = outerWidth - margin.left - margin.right;
    var height = outerHeight - margin.top - margin.bottom;

    // scales
    var x = d3.scaleTime().range([0, width]),
        y = d3.scaleLinear().range([height, 0]),
        z = d3.scaleOrdinal(cmapDeep);

    var line = d3.line()
        .curve(d3.curveBasis)
        .x(function(d) { return x(d.date); })
        .y(function(d) { return y(d.freq); });

    var xAxis = d3.axisBottom(x),
        yAxis = d3.axisLeft(y);

    var zoom = d3.zoom()
        .scaleExtent([1, 32])
        .translateExtent([[0, 0], [width, height]])
        .extent([[0, 0], [width, height]])
        .on("zoom", function() {
            var t = d3.event.transform, xt = t.rescaleX(x);
            g.selectAll(".line").attr("d", function (d) {
                var linep = line.x(function(dp) { return xt(dp.date); });
                return linep(d.values);
            });
            g.select(".axis--x").call(xAxis.scale(xt));
        });

    svg.attr("width", outerWidth);
    svg.attr("height", outerHeight);

    // clear old graph
    g.selectAll('*').remove();

    // clip view
    svg.append("defs")
        .append("clipPath")
        .attr("id", "clip")
        .append("rect")
        .attr("width", width)
        .attr("height", height);

    // plot domain
    x.domain(d3.extent(data, function(d) { return d.date; }));
    y.domain([
        d3.min(freqs, function(c) { return d3.min(c.values, function(d) { return d.freq; }); }),
        d3.max(freqs, function(c) { return d3.max(c.values, function(d) { return d.freq; }); })
    ]);

    // draw lines
    var tokens = g.selectAll(".token")
        .data(freqs)
        .enter()
        .append("g")
        .attr("class", "token");

    tokens.append("path")
        .attr("class", "line")
        .attr("d", function(d) { return line(d.values); })
        .style("stroke", function(d) { return z(d.tok); });

    // draw text
    posv = [];
    tokens.append("text")
        .datum(function(d) { return {tok: d.tok, value: d.values[d.values.length - 1]}; })
        .attr("transform", function(d) { return "translate(" + x(d.value.date) + "," + y(d.value.freq) + ")"; })
        .attr("x", 3)
        .attr("dy", function(d, i) {
          var val = d.value.freq
          var mov = 0;
          for (x of posv) {
            var df = x - val;
            mov += 0.1*(2*(df>0)-1)*Math.exp(-0.5*(20*df)^2);
          }
          posv.push(val);
          return mov + "em";
        })
        .style("stroke", function(d) { return z(d.tok); })
        .text(function(d) { return d.tok; });

    g.append("g")
        .attr("class", "axis axis--x")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

    g.append("g")
        .attr("class", "axis axis--y")
        .call(yAxis);

    var d0 = new Date(2001, 0, 1),
        d1 = new Date(2016, 9, 1);
}

// type converter
function type(d) {
    for (tok in d) {
        if (tok == "date") {
            d[tok] = parseDate(d[tok]);
        } else {
            d[tok] = 1000000*d[tok];
        }
    }
    return d;
}

// data fetcher
function plot_tokens(tokens) {
    var url = 'http://dohan.dyndns.org:9454/freq?token=' + tokens.join(',');
    d3.csv(url, type, function(data) {
        plot_series(tokens, data);
    });
}

// input
var tokin = $("#tokens");
function get_tokens() {
    return $.map(tokin.val().split(','), function(tok) { return tok.trim(); });
}

// hooks
tokin.val(itok);
tokin.keypress(function(e) {
    if (e.keyCode == 13) {
        var text = tokin.val();
        if (text.length > 0) {
            plot_tokens(get_tokens());
        }
    }
});

// buttons
var doplot = $("#doplot");
doplot.click(function() {
    plot_tokens(get_tokens());
})

var getcsv = $("#getcsv");
getcsv.click(function() {
    window.location.href = 'http://dohan.dyndns.org:9454/freq?token=' + get_tokens().join(',');
});

// history
var idata;
var itok = ['graphene', 'nanotube', 'crispr'];
function resize() {
    if (idata == undefined) {
        plot_tokens(itok);
    } else {
        plot_series(itok, idata);
    }
}

// initial
$(window).resize(resize);
$(document).ready(function() { plot_tokens(itok); });
