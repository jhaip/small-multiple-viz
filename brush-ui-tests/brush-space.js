class BrushSpace {
    constructor(dispatch, parent, id, isContext = false) {
        this.dispatch = dispatch;
        this.id = id;
        this.isContext = isContext;
        var that = this;

        this.dispatch.on("brushchange."+this.id, function(e) {
            that.brush_change(e);
        });

        this.svg = parent.append("svg");
        this.svg.attr("width", 960).attr("height", 150);

        this.margin = {top: 20, right: 20, bottom: 20, left: 20};
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

        this.context.append("g")
            .attr("class", "brush")
            .call(this.brush)
            .call(this.brush.move, this.x.range());

        this.x.domain([new Date(2015, 0, 1), new Date(2016, 0, 1)]);
        this.y.domain([0, 1]);

        if (this.isContext === false) {
            this.brush.move(this.context.select(".brush"), null);  // clear any visible brush
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
        this.context.select(".axis--x").call(this.xAxis);
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
