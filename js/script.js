var data = [
    {"source": "A0", "date": "2017-01-01T14:13:11.471Z", "price": 2},
    {"source": "A0", "date": "2017-01-02T14:13:11.471Z", "price": 5},
    {"source": "A0", "date": "2017-01-03T14:13:11.471Z", "price": 0},
    {"source": "D1", "date": "2017-01-01T14:13:11.471Z", "price": 1},
    {"source": "D1", "date": "2017-01-01T14:14:11.471Z", "price": 0},
    {"source": "D1", "date": "2017-01-01T14:15:11.471Z", "price": 1},
    {"source": "D1", "date": "2017-01-01T14:16:11.471Z", "price": 0},
    {"source": "D1", "date": "2017-01-02T14:13:11.471Z", "price": 1},
    {"source": "D1", "date": "2017-01-02T14:14:11.471Z", "price": 0},
    {"source": "D1", "date": "2017-01-02T14:15:11.471Z", "price": 1},
    {"source": "D1", "date": "2017-01-02T14:16:11.471Z", "price": 0}
];

class BaseVisualizer {
    constructor(source, data, parent_el, svg_width, svg_height) {
        this.source = source;  // string of the source in the global data source
        this.data = data;  // pre filtered by a single source
        this.margin = {top: 20, right: 20, bottom: 20, left: 40};
        this.parent_el = parent_el;
        this.svg_width = svg_width;
        this.svg_height = svg_height;
        this.width = this.svg_width - this.margin.left - this.margin.right;
        this.height = this.svg_height - this.margin.top - this.margin.bottom;
        this.create_el();
        this.x = d3.scaleTime().range([0, this.width]);
    }
    create_el() {
        this.svg = this.parent_el.append("div").append("svg")
            .attr("width", this.svg_width)
            .attr("height", this.svg_height);

        this.el = this.svg.append("g")
            .attr("class", "focus")
            .attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")");
    }
    visualize() {
    }
    update_graph_after_brushing() {
    }
    update_brushing(s, x2) {
        this.x.domain(s.map(x2.invert, x2));
        this.update_graph_after_brushing();
    }
}

class LineGraphVisualizer extends BaseVisualizer {
    constructor(source, data, parent_el, svg_width, svg_height, curve_type) {
        super(source, data, parent_el, svg_width, svg_height);

        this.y = d3.scaleLinear().range([this.height, 0]).domain([0, d3.max(this.data, function(d) { return d.price; })]);
        this.xAxis = d3.axisBottom(this.x);
        this.yAxis = d3.axisLeft(this.y);

        if (curve_type === undefined) {
            curve_type = d3.curveLinear;
        }

        var that = this;
        this.area = d3.area()
            .curve(curve_type)
            .x(function(d) { return that.x(d.date); })
            .y0(that.height)
            .y1(function(d) { return that.y(d.price); });
    }
    visualize() {
        var that = this;

        // clip the bounds of the area mark to the graph width and height
        this.el.append("defs").append("clipPath")
            .attr("id", "clip--" + this.source)
          .append("rect")
            .attr("width", this.width)
            .attr("height", this.height);

        this.el.append("path")
            .datum(that.data)
            .attr("class", "area")
            .attr("d", that.area)
            .attr("clip-path", "url(#clip--" + this.source + ")");

        this.el.append("g")
            .attr("class", "axis axis--x")
            .attr("transform", "translate(0," + that.height + ")")
            .call(that.xAxis);

        this.el.append("g")
            .attr("class", "axis axis--y")
            .call(that.yAxis);
    }
    update_graph_after_brushing() {
        this.el.select(".area").attr("d", this.area);
        this.el.select(".axis--x").call(this.xAxis);
    }
}

class LogVisualizer extends BaseVisualizer {
    constructor(source, data, parent_el, svg_width, svg_height) {
        super(source, data, parent_el, svg_width, svg_height);
        this.data_in_brush = this.data;
    }
    create_el() {
        this.el = this.parent_el.append("div")
            .attr("class", "focus")
            .style("width", this.svg_width+"px")
            .style("height", this.svg_height+"px")
            .style("overflow-y", "scroll");
    }
    visualize() {
        var that = this;
        this.el.selectAll(".log-value")
            .data(that.data_in_brush)
          .enter().append("p")
            .attr("class", "log-value")
            .text(function(d) {
                return "(" + d3.utcFormat(d.date) + ") " + that.source + " = " + d.price;
            });
    }
    update_graph_after_brushing() {
        var that = this;
        this.data_in_brush = [];
        this.data.forEach(function(d) {
            if (d.date >= that.x.domain()[0] && d.date <= that.x.domain()[1]) {
                that.data_in_brush.push(d);
            }
        })

        // TODO: use D3 data update binding instead of replacing the entire visual
        this.el.html("");
        this.visualize();
    }
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

// var focus = svg.append("g")
//     .attr("class", "focus")
//     .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var context = svg.append("g")
    .attr("class", "context")
    .attr("transform", "translate(" + margin2.left + "," + margin2.top + ")");

// d3.csv("sp500.csv", type, function(error, data) {
//   if (error) throw error;
data.forEach(function(d) {
    d.date = parseDate(d.date);
    d.price = +d.price;
})

  x2.domain(d3.extent(data, function(d) { return d.date; }));
  // x2.domain(x.domain());
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

function create_brushView_visuals(brushView_el) {
    return [new LineGraphVisualizer("A0", get_filtered_data_by_source("A0"), brushView_el, 400, 200, d3.curveMonotoneX),
            new LineGraphVisualizer("D1", get_filtered_data_by_source("D1"), brushView_el, 400, 100, d3.curveStepAfter),
            new LogVisualizer("D1", get_filtered_data_by_source("D1"), brushView_el, 400, 100)];
}

var brushViews = [{
    start_time: x2.domain()[0],
    end_time: x2.domain()[1],
    el: d3.select(".visuals").append("div").attr("class", "visual active"),
    visuals: create_brushView_visuals(d3.select(".visual"))
}];
var activeBrushView = 0;
  // var visualizers = [new LineGraphVisualizer("A0", get_filtered_data_by_source("A0"), d3.select(".visuals"), 960, 200, d3.curveMonotoneX),
  //                    new LineGraphVisualizer("D1", get_filtered_data_by_source("D1"), d3.select(".visuals"), 960, 100, d3.curveStepAfter),
  //                    new LogVisualizer("D1", get_filtered_data_by_source("D1"), d3.select(".visuals"), 960, 100)];

  brushViews[activeBrushView].visuals.forEach(function(v) {
      v.visualize();
  });

  context.selectAll(".strip")
      .data(data)
    .enter().append("rect")
      .attr("class", "strip")
      .attr("x", function(d) { return x2(d.date)-1; })
      .attr("width", 3)
      .attr("opacity", 0.7)
      .attr("y", function(d) { return y2(d.source); })
      .attr("height", y2.bandwidth());
  // context.append("path")
  //     .datum(data)
  //     .attr("class", "area")
  //     .attr("d", area2);

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
// });

function brushed() {
  if (d3.event.sourceEvent && d3.event.sourceEvent.type === "zoom") return; // ignore brush-by-zoom
  var s = d3.event.selection || x2.range();
  // x.domain(s.map(x2.invert, x2));
  // focus.select(".area").attr("d", area);
  // focus.select(".axis--x").call(xAxis);
  brushViews[activeBrushView].visuals.forEach(function(v) {
      v.update_brushing(s, x2);
  });
  // console.log(x.domain());
  // console.log(s); // pixel range of brush
  // console.log(x.domain().map(x2, x2.invert)); // convert domain of brush in time to pixel range in x2
  var x = d3.scaleTime().range([0, width]).domain(s.map(x2.invert, x2));
  d3.select(".label_brush_start").property("value", d3.isoFormat(x.domain()[0]));
  d3.select(".label_brush_end").property("value", d3.isoFormat(x.domain()[1]));
  brushViews[activeBrushView].start_time = x.domain()[0];
  brushViews[activeBrushView].end_time = x.domain()[1];
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
    var new_el = d3.select(".visuals").append("div").attr("class", "visual");
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
});

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
