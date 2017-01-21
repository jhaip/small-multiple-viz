var data = [
    {"source": "A0", "date": "2017-01-18T14:13:11.471Z", "price": 2},
    {"source": "A0", "date": "2017-01-19T14:13:11.471Z", "price": 5},
    {"source": "A0", "date": "2017-01-20T14:13:11.471Z", "price": 0},
    {"source": "D1", "date": "2017-01-18T14:13:11.471Z", "price": 1},
    {"source": "D1", "date": "2017-01-18T14:14:11.471Z", "price": 0},
    {"source": "D1", "date": "2017-01-18T14:15:11.471Z", "price": 1},
    {"source": "D1", "date": "2017-01-18T14:16:11.471Z", "price": 0},
    {"source": "D1", "date": "2017-01-21T14:13:11.471Z", "price": 1},
    {"source": "D1", "date": "2017-01-21T14:14:11.471Z", "price": 0},
    {"source": "D1", "date": "2017-01-21T14:15:11.471Z", "price": 1},
    {"source": "D1", "date": "2017-01-21T14:16:11.471Z", "price": 0}
];
var last_day = 3;

var visualTypeMap = {
    "line_graph": LineGraphVisualizer,
    "log": LogVisualizer,
    "video-timeline": VideoTimelineVisualizer
}

var svg = d3.select("svg.svg--overall"),
    margin2 = {top: 20, right: 20, bottom: 30, left: 40},
    width = +svg.attr("width") - margin2.left - margin2.right,
    height2 = +svg.attr("height") - margin2.top - margin2.bottom;

var parseDate = d3.utcParse("%Y-%m-%dT%H:%M:%S.%LZ");//d3.timeParse("%b %Y");

var x2 = d3.scaleTime().range([0, width]),
    y2 = d3.scaleBand().range([height2, 0]).padding(0.1);

var xAxis2 = d3.axisBottom(x2),
    yAxis2 = d3.axisLeft(y2);

var brush = d3.brushX()
    .extent([[0, 0], [width, height2]])
    .on("brush end", brushed);

var context = svg.append("g")
    .attr("class", "context")
    .attr("transform", "translate(" + margin2.left + "," + margin2.top + ")");

data.forEach(function(d) {
    d = type(d);
})

x2.domain(d3.extent(data, function(d) { return d.date; }));
y2.domain(d3.extent(data, function(d) { return d.source; }));

function get_filtered_data_by_source(source) {
    var a = [];
    data.forEach(function(d) {
        if (d.source === source) {
            a.push(d);
        }
    });
    return a;
}

var brushViews = [];
var activeBrushView = 0;
addNewView();

function create_brushView_visuals(brushView_el) {
    if (brushViews.length > 0) {
        var s = [];
        brushViews[0].visuals.forEach(function(v) {
            s.push(new visualTypeMap[v.visualType](v.source, get_filtered_data_by_source(v.source), brushView_el, v.svg_width, v.svg_height, v.options))
        });
        return s;
    } else {
        return [new LineGraphVisualizer("A0", get_filtered_data_by_source("A0"), brushView_el, 400, 200, {"curve_type": d3.curveMonotoneX})];
    }
}

// context.selectAll(".strip")
//     .data(data)
//     .enter().append("rect")
//         .attr("class", "strip")
//         .attr("x", function(d) { return x2(d.date)-1; })
//         .attr("width", 3)
//         .attr("opacity", 0.7)
//         .attr("y", function(d) { return y2(d.source); })
//         .attr("height", y2.bandwidth());

var strip = context.selectAll(".strip")
    .data(data)

strip.enter().append("rect")
        .attr("class", "strip")
        .attr("width", 3)
        .attr("opacity", 0.7)
    .merge(strip)
        .attr("x", function(d) { return x2(d.date)-1; })
        .attr("y", function(d) { return y2(d.source); })
        .attr("height", y2.bandwidth());

context.append("g")
    .attr("class", "axis axis--x")
    .attr("transform", "translate(0," + height2 + ")")
    .call(xAxis2);

context.append("g")
    .attr("class", "axis axis--y")
    .call(yAxis2);

context.append("g")
    .attr("class", "brush")
    .call(brush)
    .call(brush.move, x2.range());

function brushed() {
    if (d3.event.sourceEvent && d3.event.sourceEvent.type === "zoom") return; // ignore brush-by-zoom

    var s = d3.event.selection || x2.range();
    // x.domain(s.map(x2.invert, x2));
    // console.log(x.domain());
    // console.log(s); // pixel range of brush
    // console.log(x.domain().map(x2, x2.invert)); // convert domain of brush in time to pixel range in x2
    var x = d3.scaleTime().range([0, width]).domain(s.map(x2.invert, x2));
    d3.select(".label_brush_start").property("value", d3.isoFormat(x.domain()[0]));
    d3.select(".label_brush_end").property("value", d3.isoFormat(x.domain()[1]));
    brushViews[activeBrushView].start_time = x.domain()[0];
    brushViews[activeBrushView].end_time = x.domain()[1];
    brushViews[activeBrushView].el.select(".visual-title").text(d3.isoFormat(x.domain()[0]) + " - " + d3.isoFormat(x.domain()[1]));
    brushViews[activeBrushView].visuals.forEach(function(v) {
        v.update_brushing(s, x2);
    });
}

function addNewView() {
    var new_el = d3.select(".visuals").append("div").attr("class", "visual");
    new_el.append("div").attr("class", "visual-title");
    brushViews.push({
        start_time: x2.domain()[0],
        end_time: x2.domain()[1],
        el: new_el,
        visuals: create_brushView_visuals(new_el)
    });
    activeBrushView = brushViews.length-1;
    brush.move(d3.select(".brush"), x2.range());
    brushViews[activeBrushView].visuals.forEach(function(v) {
        v.visualize();
    });
    d3.select("#selectBrushView").append("option").property("value", activeBrushView).text("View "+activeBrushView);
    d3.select("#selectBrushView").property("value", activeBrushView);
    $(".visual.active").removeClass("active");
    $($(".visual").get(activeBrushView)).addClass("active");
}

d3.select(".label_brush_start").on("change", function(d, i) {
    var parsedDate = parseDate(this.value);
    if (parsedDate !== null) {
        var r = d3.brushSelection(d3.select(".brush").node());
        if (parsedDate >= x2.domain()[0]) {
            r[0] = [parsedDate].map(x2, x2.invert)[0];
        } else {
            console.log("OUT OF BOUNDS, ignoring");
        }
        brush.move(d3.select(".brush"), r)
    } else {
        console.log("bad date: "+this.value);
    }
});

d3.select(".label_brush_end").on("change", function(d, i) {
    var parsedDate = parseDate(this.value);
    if (parsedDate !== null) {
        var r = d3.brushSelection(d3.select(".brush").node());
        if (parsedDate <= x2.domain()[1]) {
            r[1] = [parsedDate].map(x2, x2.invert)[0];
        } else {
            console.log("OUT OF BOUNDS, ignoring");
        }
        brush.move(d3.select(".brush"), r)
    } else {
        console.log("bad date: "+this.value);
    }
});

d3.select("#add-new-view").on("click", function() {
    addNewView();
});

d3.select("#add-new-data").on("click", function() {
    addNewDataPoint("B1", Math.random()*10);
});

function addNewDataPoint(source, newValue) {
    var beforeDomainEnd = new Date(x2.domain()[1]);
    var shouldExtendBrush = false;
    var beforeBrushDomain = d3.brushSelection(d3.select(".brush").node()).map(x2.invert, x2);

    last_day += 1;
    var date = d3.isoFormat(new Date(2017, 0, last_day)),
        price = newValue;
    data.push(type({"source": source, "date": date, "price": price}));


    brushViews.forEach(function(bv, i) {
        bv.visuals.forEach(function(v) {
            if (v.x.domain()[1] >= beforeDomainEnd) {
                if (i == activeBrushView) {
                    shouldExtendBrush = true;
                    console.log("setting shouldExtendBrush to True");
                }
                v.update_data(get_filtered_data_by_source(v.source));
            } else {
                console.log("Skipping visual before its brushing wasn't at the end");
            }
        });
    });

    x2.domain(d3.extent(data, function(d) { return d.date; }));
    y2.domain(d3.extent(data, function(d) { return d.source; }));

    xAxis2 = d3.axisBottom(x2);
    yAxis2 = d3.axisLeft(y2);

    strip = context.selectAll(".strip")
        .data(data);

    strip.enter().append("rect")
            .attr("class", "strip")
            .attr("width", 3)
            .attr("opacity", 0.7)
        .merge(strip)
            .attr("x", function(d) { return x2(d.date)-1; })
            .attr("y", function(d) { return y2(d.source); })
            .attr("height", y2.bandwidth());

    context.select("g.axis.axis--x").call(xAxis2);

    context.select("g.axis.axis--y").call(yAxis2);

    if (shouldExtendBrush) {
        console.log("extending brush");
        context.select("g.brush")
            .call(brush)
            .call(brush.move, x2.range());
    } else {
        console.log("keeping old brush");
        context.select("g.brush")
            .call(brush)
            .call(brush.move, beforeBrushDomain.map(x2, x2.invert));
    }
}

d3.select("#selectBrushView").on("change", function() {
    var newSelection = eval(d3.select(this).property('value'));
    activeBrushView = newSelection;
    var r = d3.brushSelection(d3.select(".brush").node());
    if (r === null) {
        // when the brushSelection is cleared
        r = x2.range();
    }
    r[0] = [brushViews[activeBrushView].start_time].map(x2, x2.invert)[0];
    r[1] = [brushViews[activeBrushView].end_time].map(x2, x2.invert)[0];
    brush.move(d3.select(".brush"), r);
    $(".visual.active").removeClass("active");
    $($(".visual").get(activeBrushView)).addClass("active");
});

function type(d) {
    d.date = parseDate(d.date);
    d.price = +d.price;
    return d;
}

function selectEditVisualType(visualType) {
    $(".visual-types__extra-options").empty();
    visualTypeMap[visualType].propertyDefinition().forEach(function(d) {
        var e = undefined;
        if (d.type === "options") {
            e = $("<select class=\"visual-types__extra-option\"></select>").data("name", d.name);
            d.options.forEach(function(o) {
                e.append(`<option value="${o}">${o}</option>`);
            });
        } else if (d.type === "number") {
            e = $("<input class=\"visual-types__extra-option\" type=\"text\" value=\"400\">").data("name", d.name);
        }
        $(".visual-types__extra-options").append($("<div></div>")).append(e);
    });
}
function addNewVisualType() {
    var visualType = $("#visual-types").val();
    var visualTypeClass = visualTypeMap[visualType];
    brushViews.forEach(function(bv, i) {
        var signal = $(".visual-types__source").val();
        var filtered_data_by_source = get_filtered_data_by_source(signal);
        var brushView_el = bv.visuals[0].parent_el;
        var width = eval($(".visual-types__width").val());
        var height = eval($(".visual-types__height").val());
        var options = {};
        $(".visual-types__extra-option").each(function() {
            var extraPropertyName = $(this).data("name");
            var extraPropertyVal = $(this).val();
            options[extraPropertyName] = extraPropertyVal;
        });
        bv.visuals.push(new visualTypeClass(signal, filtered_data_by_source, brushView_el, width, height, options))
        if (bv.visuals.length > 1) {
            bv.visuals[bv.visuals.length-1].update_brushing_with_domain(bv.visuals[0].x.domain());
        } else {
            // TODO: handle the case where addNewVisualType was used to add the 1st visual to a brush view
            console.log("TODO");
        }
        bv.visuals[bv.visuals.length-1].visualize();
    });
}

$("#visual-types").change(function() {
    var option_value = $(this).val();
    selectEditVisualType(option_value);
});
selectEditVisualType("line_graph");

$(".visual-types__add-visual").click(function() {
    addNewVisualType();
});
