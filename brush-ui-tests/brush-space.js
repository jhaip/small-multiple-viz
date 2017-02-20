class BrushSpace {
    constructor(dispatch, parent, id, isContext = false) {
        this.dispatch = dispatch;
        this.id = id;
        this.isContext = isContext;
        this.parent = parent;
        var that = this;

        this.dispatch.on("brushchange."+this.id, function(e) {
            that.brush_change(e);
        });
        this.dispatch.on("hoverchange."+this.id, function(v) {
            that.mousemove(v);
        });
        this.dispatch.on("statechange."+this.id, function(e) {
            that.state_change(e);
        });

        this.margin = {top: 20, right: 20, bottom: 20, left: 20};
        this.container_width = 960;
        this.container_height = 150;

        this.svg = this.parent.append("svg");

        this.state = "";
        this.annotationData = [];

        this.create_scene();
    }
    create_scene() {
        var that = this;

        this.svg.attr("width", this.container_width)
            .attr("height", this.container_height);

        this.width = +this.svg.attr("width") - this.margin.left - this.margin.right,
        this.height = +this.svg.attr("height") - this.margin.top - this.margin.bottom;

        this.x = d3.scaleTime().range([0, this.width]),
        this.y = d3.scaleLinear().range([this.height, 0]);

        this.xAxis = d3.axisBottom(this.x),
        this.yAxis = d3.axisLeft(this.y);

        this.brush = d3.brushX()
            .extent([[0, 0], [this.width, this.height]]);
        if (this.isContext) {
            this.brush.on("brush end", function() {
                that.brushed();
            });
        } else {
            this.brush.on("end", function() {
                that.brushed();
            });
        }

        this.context = this.svg.append("g")
            .attr("class", "context")
            .attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")");

        this.context.append("g")
            .attr("class", "axis axis--x")
            .attr("transform", "translate(0," + this.height + ")")
            .call(this.xAxis);

        this.context.append("g")
            .attr("class", "axis axis--y")
            .call(this.yAxis);

        this.focus = this.context.append("line")
            .attr("x1", 0)
            .attr("y1", 0)
            .attr("x2", 0)
            .attr("y2", this.height)
            .attr("stroke", "red")
            .attr("stroke-width", 1);

        this.context.append("g")
            .attr("class", "brush")
            .call(this.brush)
            .call(this.brush.move, this.x.range());

        this.overlay = this.context.append("g")
            .attr("class", "top-overlay")
            .style("fill", "none");
        this.overlay.append("rect")
            .attr("x", 0)
            .attr("y", 0)
            .attr("width", this.width)
            .attr("height", this.height);

        this.overlay.selectAll(".annotation")
            .data(this.annotationData);

        this.x.domain([new Date(2015, 0, 1), new Date(2016, 0, 1)]);
        this.y.domain([0, 1]);

        if (this.isContext === false) {
            this.brush.move(this.context.select(".brush"), null);  // clear any visible brush
        }

        this.context.select(".brush .overlay")
            // .on("mouseover", function() { focus.style("display", null); })
            // .on("mouseout", function() { focus.style("display", "none"); })
            .on("mousemove", function() {
                var x0 = that.x.invert(d3.mouse(this)[0]);
                that.dispatch.call("hoverchange", {}, x0);
            })

        this.overlay.on("click", function() {
            that.clicked(d3.mouse(this));
        });
    }
    update_scene() {
        var that = this;

        this.svg.attr("width", this.container_width)
            .attr("height", this.container_height);

        this.width = +this.svg.attr("width") - this.margin.left - this.margin.right,
        this.height = +this.svg.attr("height") - this.margin.top - this.margin.bottom;

        this.x.range([0, this.width]),
        this.y.range([this.height, 0]);

        this.brush.extent([[0, 0], [this.width, this.height]]);

        this.context.select(".axis--x")
            .attr("transform", "translate(0," + this.height + ")")
            .call(this.xAxis);

        this.context.select(".axis--y")
            .call(this.yAxis);

        this.focus.attr("y2", this.height);

        this.context.select(".brush")
            .call(this.brush);

        this.overlay.select("rect")
            .attr("width", this.width)
            .attr("height", this.height);

        this.update_annotations();
    }
    update_annotations() {
        var that = this;
        var annotations = this.overlay.selectAll(".annotation")
            .data(this.annotationData);

        annotations.enter().append("circle")
                .attr("class", "annotation")
                .attr("r", 6)
                .style("fill", "#0066ff")
            .merge(annotations)
                .attr("cx", function(d) { return that.x(d.x); })
                .attr("cy", function(d) { return that.y(d.y); });

        annotations.exit().remove();
    }
    resize(width, height) {
        this.container_width = width;
        this.container_height = height;

        // this.svg.selectAll("*").remove();
        // this.create_scene();

        // save the previous Brush selection
        var brushSelectionRange = d3.brushSelection(this.context.select(".brush").node());
        var brushSelectionDomain = undefined;
        if (brushSelectionRange !== undefined && brushSelectionRange !== null) {
            brushSelectionDomain = brushSelectionRange.map(this.x.invert, this.x);
        }

        this.update_scene();

        // update scene doesn't ensure the brush rectangle gets updated
        // so move it using the saved brushSelectionDomain
        if (this.isContext && brushSelectionDomain !== undefined) {
            var newBrushSelectionRange = brushSelectionDomain.map(this.x, this.x.invert);
            this.brush.move(this.context.select(".brush"), newBrushSelectionRange);
        }
    }
    mousemove(x0) {
        this.focus.attr("x1", this.x(x0))
            .attr("x2", this.x(x0));
    }
    clicked(clickPosition) {
        var x = this.x.invert(clickPosition[0]);
        var y = this.y.invert(clickPosition[1]);
        this.annotationData.push({x: x, y: y});
        this.update_annotations();
    }
    state_change(e) {
        this.state = e.state;
        if (e.state === "annotation") {
            // "Turn off the brush" https://groups.google.com/forum/#!topic/d3-js/YnjYAV3wcpU
            this.context.select(".brush").style("display", "none").style("pointer-events", "none");
            this.overlay.style("pointer-events", "all");
        } else {
            this.context.select(".brush").style("display", "inline").style("pointer-events", "all");
            this.overlay.style("pointer-events", "none");
        }
    }
    brushed() {
        var s = d3.event.selection || this.x.range();
        var sDomain = s.map(this.x.invert, this.x);
        this.dispatch.call("brushchange-request", {}, {
            range: s,
            domain: sDomain,
            source: this.id,
            iscontext: this.isContext
        });
    }
    update_domain(newDomain) {
        this.x.domain(newDomain);
        this.update_scene();
        this.brush.move(this.context.select(".brush"), null);  // clear any visible brush
    }
    brush_change(e) {
        if (this.id !== e.source) {
            if (this.isContext) {
                var r = e.domain.map(this.x, this.x.invert);
                this.brush.move(this.context.select(".brush"), r);
            } else {
                this.update_domain(e.domain);
            }
        } else if (e.iscontext === false) {
            this.update_domain(e.domain);
        }
    }
}