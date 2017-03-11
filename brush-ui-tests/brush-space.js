class BrushSpace {
    constructor(dispatch, dmMaster, groupIndex, parent, width, height, id, source, isContext = false) {
        this.visualType = "Base";
        this.dispatch = dispatch;
        this.dataModuleMaster = dmMaster;
        this.groupIndex = groupIndex;
        this.id = id;
        this.source = source;
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
        this.container_width = width;
        this.container_height = height;

        this.state = "";
        this.annotationData = [];

        this.data = [];

        this.create_scene();
    }
    toJSON() {
        return {
            "visual_type": this.visualType,
            "id": this.id,
            "group_id": this.groupIndex,
            "source": this.source,
            "width": this.container_width,
            "height": this.container_height,
            "x_domain": this.x.domain(),
            "y_domain": this.y.domain(),
            "is_context": this.is_context
        }
    }
    create_axes() {
        this.xAxis = d3.axisBottom(this.x);
        this.yAxis = d3.axisLeft(this.y);

        this.context.append("g")
            .attr("class", "axis axis--x")
            .attr("transform", "translate(0," + this.height + ")")
            .call(this.xAxis);

        this.context.append("g")
            .attr("class", "axis axis--y")
            .call(this.yAxis);
    }
    update_axes() {
        this.context.select(".axis--x")
            .attr("transform", "translate(0," + this.height + ")")
            .call(this.xAxis);
        this.context.select(".axis--y")
            .call(this.yAxis);
    }
    create_scene_label() {
        var that = this;
        this.label_el = this.container_el.append("div")
            .attr("class", "clearfix")
            .style("width", "100%");
        this.label_el.append("span")
            .attr("class", "bs-el-container-label bs-el-container-label--"+this.id)
            .style("float", "left")
            .text("Source: "+this.source);
        this.label_el.append("span")
            .style("float", "right")
            .html('<button type="button" class="btn btn-default btn-xs"><span class="glyphicon glyphicon-cog" aria-hidden="true"></span> Edit</button>')
            .on("click", function(e) {
                $("#saveVisualEdits").off();
                $("#saveVisualEdits").on("click", function() {
                    that.save_config_edits();
                })
                that.open_config();
            });
    }
    open_config() {
        $("#editVisualModal_sources-list").val(this.source);
        $("#editVisualModal_dropdownVisualTypes").val(this.visualType);
        $("#editVisualModal_advancedVisualTypeOptions").hide(0);
        $('#editVisualModal').modal('show');
    }
    save_config_edits() {
        this.source = $("#editVisualModal_sources-list").val();
        $(".bs-el-container-label--"+this.id).text("Source: "+this.source);

        let newVisualType = $("#editVisualModal_dropdownVisualTypes").val();
        if (newVisualType !== this.visualType) {
            console.log("changing visualization type not handled yet!");
        }

        $('#editVisualModal').modal('hide');

        this.data = [];
        this.update_scene();
        this.fetch_data();
    }
    create_scene() {
        var that = this;

        this.container_el = this.parent.append("div")
            .attr("class", "bs-el-container bs-el-container--"+this.id);

        this.create_scene_label();

        this.el = this.container_el.append("div")
            .attr("class", "bs-el bs-el--"+this.id)
            .style("width", this.container_width+"px")
            .style("height", this.container_height+"px");
        this.vis_el = this.el.append("div").attr("class", "bs-el-vis--"+this.id);

        this.svg = this.el.append("svg").attr("class", "cover");

        this.width = this.container_width - this.margin.left - this.margin.right,
        this.height = this.container_height - this.margin.top - this.margin.bottom;

        this.x = d3.scaleTime().range([0, this.width]);
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

        this.create_axes();

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
            .on("mousemove", function() {
                var x0 = that.x.invert(d3.mouse(this)[0]);
                that.dispatch.call("hoverchange", {}, {
                    x0: x0,
                    groupIndex: that.groupIndex
                });
            })

        this.overlay.on("click", function() {
            that.clicked(d3.mouse(this));
        });

        that.create_resize_control();
    }
    create_resize_control() {
        var that = this;
        var startY = 0;

        function dragstarted(d) {
            startY = d3.event.y;
            d3.select(this).raise().classed("active", true);
        }

        function dragged(d) {
            d3.select(".bs-el--"+that.id).style("height", (that.container_height+d3.event.y-startY)+"px");
        }

        function dragended(d) {
            d3.select(this).classed("active", false);
            that.resize(that.container_width, that.container_height+d3.event.y-startY);
        }

        this.container_el.append("div")
            .attr("class", "bs-el-resize bs-el-resize--"+this.id)
            .call(d3.drag()
                .on("start", dragstarted)
                .on("drag", dragged)
                .on("end", dragended)
            );
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

        this.update_axes();

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
    mousemove(e) {
        if (e.groupIndex !== this.groupIndex) {
            return;
        }
        this.focus.attr("x1", this.x(e.x0))
            .attr("x2", this.x(e.x0));
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
                this.dispatch.call("savedata--Annotation", {}, {
                    guid: this.queuedAnnotation.id,
                    timestamp: this.queuedAnnotation.x,
                    text: this.queuedAnnotation.text,
                    y: this.queuedAnnotation.y,
                    source: this.source,
                    id: this.id
                });
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
            iscontext: this.isContext,
            groupIndex: this.groupIndex
        });
    }
    update_domain(newDomain) {
        this.x.domain(newDomain);
        this.update_scene();
        this.brush.move(this.context.select(".brush"), null);  // clear any visible brush
        this.fetch_data();
    }
    fetch_data() {
        var that = this;
        if (this.source) {
            this.dataModuleMaster.fetch_data(this.source, this.x.domain()).done(function(data) {
                that.data = data;
                that.update_scene();
            }).fail(function(e) {
                console.log("Error fetching data from "+this.id+" for source "+this.source);
            })
        }
    }
    update_data(e) {
        this.data = JSON.parse(JSON.stringify(e.data));
        this.update_scene();
    }
    brush_change(e) {
        if (e.groupIndex !== this.groupIndex) {
            return;
        }
        if (this.id !== e.source) {
            if (this.isContext && e.domain[0] >= this.x.domain()[0] && e.domain[1] <= this.x.domain()[1]) {
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
