class BaseVisualizer {
    constructor(source, data, parent_el, svg_width, svg_height, options) {
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
        this.options = options;
    }
    create_el() {
        this.parent_el.append("h4").text("Source: "+this.source);

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
    update_data(newData) {
    }
    update_brushing(s, x2) {
        this.x.domain(s.map(x2.invert, x2));
        this.update_graph_after_brushing();
    }
    update_brushing_with_domain(domain) {
        this.x.domain(domain);
        this.update_graph_after_brushing();
    }
    static propertyDefinition() {
        return [];
    }
}


class LineGraphVisualizer extends BaseVisualizer {
    constructor(source, data, parent_el, svg_width, svg_height, options) {
        super(source, data, parent_el, svg_width, svg_height, options);

        this.visualType = "line_graph";
        this.y = d3.scaleLinear().range([this.height, 0]).domain([0, d3.max(this.data, function(d) { return d.price; })]);
        this.xAxis = d3.axisBottom(this.x);
        this.yAxis = d3.axisLeft(this.y);

        var curve_type = d3.curveLinear;
        if ("curveType" in options) {
            if (options.curveType === "monotoneX") {
                curve_type = d3.curveMonotoneX;
            } else if (options.curveType === "stopAfter") {
                curve_type = d3.curveStepAfter;
            }
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

        /// random id from http://stackoverflow.com/questions/1349404/generate-random-string-characters-in-javascript
        var clipId = (Math.random().toString(36)+'00000000000000000').slice(2, 5+2);
        while (!d3.select("#clip--"+clipId).empty()) {
            clipId = (Math.random().toString(36)+'00000000000000000').slice(2, 5+2);
        }

        // clip the bounds of the area mark to the graph width and height
        this.el.append("defs").append("clipPath")
            .attr("id", "clip--" + clipId)
          .append("rect")
            .attr("width", this.width)
            .attr("height", this.height);

        this.el.append("path")
            .datum(that.data)
            .attr("class", "area")
            .attr("d", that.area)
            .attr("clip-path", "url(#clip--" + clipId + ")");

        this.el.append("g")
            .attr("class", "axis axis--x")
            .attr("transform", "translate(0," + that.height + ")")
            .call(that.xAxis);

        this.el.append("g")
            .attr("class", "axis axis--y")
            .call(that.yAxis);
    }
    update_data(newData) {
        this.data = newData;
        this.y = d3.scaleLinear().range([this.height, 0]).domain([0, d3.max(this.data, function(d) { return d.price; })]);
        this.yAxis = d3.axisLeft(this.y);  // might not be needed

        var that = this;
        this.area.x(function(d) { return that.x(d.date); })
            .y0(that.height)
            .y1(function(d) { return that.y(d.price); });

        // // TODO: use D3 data update binding instead of replacing the entire visual
        this.el.html("");
        this.visualize();
    }
    update_graph_after_brushing() {
        this.el.select(".area").attr("d", this.area);
        this.el.select(".axis--x").call(this.xAxis);
    }
    static propertyDefinition() {
        return [
            {
                "name": "curveType",
                "type": "options",
                "options": ["monotoneX", "stopAfter"]
            }
        ];
    }
}


class LogVisualizer extends BaseVisualizer {
    constructor(source, data, parent_el, svg_width, svg_height, options) {
        super(source, data, parent_el, svg_width, svg_height, options);
        this.data_in_brush = this.data;
        this.visualType = "log";
    }
    create_el() {
        this.parent_el.append("h4").text("Source: "+this.source);
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
    update_data(newData) {
        this.data = newData;
        this.update_graph_after_brushing();
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

class VideoTimelineVisualizer extends BaseVisualizer {
    constructor(source, data, parent_el, svg_width, svg_height, options) {
        super(source, data, parent_el, svg_width, svg_height, options);
        this.data_in_brush = this.data;
        this.visualType = "video-timeline";
        this.frameWidth = 133;
        this.frameHeight = 100;
    }
    create_el() {
        this.parent_el.append("h4").text("Source: "+this.source);
        this.el = this.parent_el.append("div")
            .attr("class", "focus")
            .style("width", this.svg_width+"px")
            .style("height", this.svg_height+"px")
            .style("overflow-y", "scroll");
    }
    visualize() {
        this.fetchFrames(this.x.domain()[0], this.x.domain()[1]).done(function(data) {
            $.each(chooseFrames(data), function(i, r) {
                this.el.append('<img src="http://192.168.2.13:5000/clips/'+r+'" width="133" height="100">');
            });
        }).fail(function() {
            console.err("Error fetching video frames");
        });
    }
    chooseFrames(frames) {
        ideal_n_frames = Math.floor(this.width / this.frameWidth);
        if (frames.length > ideal_n_frames) {
            var offset = Math.floor(frames.length / ideal_n_frames);
            var r = [];
            for (var i=0; i<frames.length, i+=offset) {
                r.push(frames[i]);
            }
            return r;
        }
        return frames;
    }
    fetchFrames(start_time, stop_time) {
        var defer = $.Deferred()
        var formatTime = d3.timeFormat("%Y-%m-%dT%H-%M-%SZ");
        start_time = formatTime(start_time);
        stop_time = formatTime(stop_time);
        var url = "http://192.168.2.13:5000/data?start=" + start_time + "&stop=" + stop_time;

        $.get(url).done(function(data) {
            console.log(data.results);
            defer.resolve(data.results);
        }).fail(function() {
            defer.fail();
        });
        return defer;
    }
    update_data(newData) {
        this.data = newData;
        this.update_graph_after_brushing();
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
