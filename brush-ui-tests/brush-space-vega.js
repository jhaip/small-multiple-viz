class BrushSpaceVega {
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

        this.state = "";
        this.annotationData = [];

        this.originalSpec = {
          "$schema": "https://vega.github.io/schema/vega/v3.0.json",
          "width": this.container_width - this.margin.left - this.margin.right,
          "height": this.container_height - this.margin.top - this.margin.bottom,
          "padding": 20,
          "autosize": "none",
          "data": [
            {
              "name": "table",
              "values": [
                {"u": "Jan 1 2015",  "v": 28}, {"u": "Mar 1 2015",  "v": 55},
                {"u": "May 1 2015",  "v": 43}, {"u": "Jul 1 2015",  "v": 91},
                {"u": "Aug 1 2015",  "v": 81}, {"u": "Jan 1 2016",  "v": 53}
              ],
              "format": {"parse": {"v": "number", "u": "date"}}
            }
          ],

          "scales": [
            {
              "name": "xscale",
              "type": "time",
              "range": "width",
              "zero": false,
              "domain": ["1/1/2015", "1/1/2016"]
            },
            {
              "name": "yscale",
              "type": "linear",
              "range": "height",
              "nice": true,
              "zero": true,
              "domain": {"data": "table", "field": "v"}
            }
          ],

          "axes": [
            {"orient": "bottom", "scale": "xscale", "tickCount": 20},
            {"orient": "left", "scale": "yscale"}
          ],

          "marks": [
            {
              "type": "area",
              "from": {"data": "table"},
              "encode": {
                "enter": {
                  "x": {"scale": "xscale", "field": "u"},
                  "y": {"scale": "yscale", "field": "v"},
                  "y2": {"scale": "yscale", "value": 0},
                  "fill": {"value": "steelblue"}
                }
              }
            }
          ]
        };

        this.create_scene();
    }
    create_scene() {
        var that = this;

        this.el = this.parent.append("div")
            .attr("class", "bs-el bs-el--"+this.id)
            .style("width", this.container_width+"px")
            .style("height", this.container_height+"px");
        this.vis_el = this.el.append("div").attr("class", "bs-el-vis--"+this.id);

        this.svg = this.el.append("svg").attr("class", "cover");

        this.width = this.container_width - this.margin.left - this.margin.right,
        this.height = this.container_height - this.margin.top - this.margin.bottom;

        this.x = d3.scaleTime().range([0, this.width]),
        this.y = d3.scaleLinear().range([this.height, 0]);

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

        this.htmlOverlayContainer = this.el.append("div")
            .attr("class", "html-overlay-container cover-position");

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

        this.spec = $.extend(true, {}, this.originalSpec);
        this.spec["width"] = this.width;
        this.spec["height"] = this.height;
        this.spec["scales"][0]["domain"] = [this.x.domain()[0].getTime(), this.x.domain()[1].getTime()];
        var runtime = vega.parse(this.spec); // may throw an Error if parsing fails
        this.view = new vega.View(runtime)
          .logLevel(vega.Warn) // set view logging level
          .initialize(this.vis_el.node()) // set parent DOM element
          .renderer('svg') // set render type (defaults to 'canvas')
          .run(); // update and render the view
    }
    update_scene() {
        var that = this;

        this.el.style("width", this.container_width+"px")
            .style("height", this.container_height+"px");

        this.width = this.container_width - this.margin.left - this.margin.right,
        this.height = this.container_height - this.margin.top - this.margin.bottom;

        this.x.range([0, this.width]),
        this.y.range([this.height, 0]);

        this.brush.extent([[0, 0], [this.width, this.height]]);

        this.focus.attr("y2", this.height);

        this.context.select(".brush")
            .call(this.brush);

        this.overlay.select("rect")
            .attr("width", this.width)
            .attr("height", this.height);

        this.update_annotations();

        // update viz
        this.view.finalize(); // "Prepares the view to be removed from a web page." - Vega docs
        this.vis_el.html("");
        this.spec = $.extend(true, {}, this.originalSpec);
        this.spec["width"] = this.width;
        this.spec["height"] = this.height;
        this.spec["scales"][0]["domain"] = [this.x.domain()[0].getTime(), this.x.domain()[1].getTime()];
        var runtime = vega.parse(this.spec); // may throw an Error if parsing fails
        this.view = new vega.View(runtime)
          .logLevel(vega.Warn) // set view logging level
          .initialize(this.vis_el.node()) // set parent DOM element
          .renderer('svg') // set render type (defaults to 'canvas')
          .run(); // update and render the view
    }
    update_annotations() {
        var that = this;
        var annotations = this.overlay.selectAll(".annotation")
            .data(this.annotationData);

        annotations.enter().append("circle")
                .attr("class", "annotation")
                .attr("r", 3)
                .style("fill", "#0066ff")
            .merge(annotations)
                .attr("cx", function(d) { return that.x(d.x); })
                .attr("cy", function(d) { return that.y(d.y); });

        annotations.exit().remove();

        var annotationTexts = this.overlay.selectAll(".annotation-text")
            .data(this.annotationData);
        annotationTexts.enter().append("text")
                .attr("class", "annotation-text")
                .attr("dx", 5)
                .attr("dy", 5)
                .style("stroke", "none")
                .style("fill", "#0066ff")
                .on("dblclick", function(d) {
                    console.log("edit");
                    console.log(d);
                })
            .merge(annotationTexts)
                .text(function(d) { return d.text; })
                .attr("x", function(d) { return that.x(d.x); })
                .attr("y", function(d) { return that.y(d.y); });
        annotationTexts.exit().remove();
    }
    resize(width, height) {
        this.container_width = width;
        this.container_height = height;

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
        var annotationId = guid();
        var that = this;

        this.queuedAnnotation = {id: annotationId, x: x, y: y, text: ""};
        this.htmlOverlayContainer.append("textarea")
            .attr("class", "active-annotation--"+annotationId)
            .style("color", "#0066ff")
            .style("position", "absolute")
            .style("left", that.x(x)+"px")
            .style("top", that.y(y)+"px");
        $(".active-annotation--"+annotationId).focus();
        change_state("post-annotation");
    }
    state_change(e) {
        this.state = e.state;
        if (e.state === "annotation" || e.state === "post-annotation") {
            // "Turn off the brush" https://groups.google.com/forum/#!topic/d3-js/YnjYAV3wcpU
            this.context.select(".brush").style("display", "none").style("pointer-events", "none");
            this.overlay.style("pointer-events", "all");
        } else {
            this.context.select(".brush").style("display", "inline").style("pointer-events", "all");
            this.overlay.style("pointer-events", "none");

            if (this.queuedAnnotation !== undefined) {
                let $activeAnnotation = $(".active-annotation--"+this.queuedAnnotation.id);
                this.queuedAnnotation.text = $activeAnnotation.val();
                this.annotationData.push(this.queuedAnnotation);
                this.update_annotations();
                $activeAnnotation.remove();
                this.queuedAnnotation = undefined;
            }
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
