class BrushSpace {
    constructor(dispatch, dmMaster, description) {
        this.visualType = "Base";
        this.dispatch = dispatch;
        this.dataModuleMaster = dmMaster;
        this.groupIndex = description["group_id"];
        this.id = description["id"];
        this.source = description["source"];
        this.isContext = description["is_context"];
        this.parent = description["parent"];
        this.updatingBrushStack = new Array();
        this.push_to_updating_stack();
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
        this.container_width = description["width"];
        this.container_height = description["height"];

        this.width = this.container_width - this.margin.left - this.margin.right,
        this.height = this.container_height - this.margin.top - this.margin.bottom;

        description["x_domain"] = description["x_domain"].map(function(d) { return new Date(d); });
        this.x = d3.scaleTime().range([0, this.width]).domain(description["x_domain"]);
        this.y = d3.scaleLinear().range([this.height, 0]).domain([0, 1]);  // TODO y_domain

        if (typeof description["brush_domain"] !== 'undefined' && description["brush_domain"] !== null) {
            description["brush_domain"] = description["brush_domain"].map(function(d) { return new Date(d); });
        }
        this.originalBrushSelection = this.convert_brush_domain_to_range(description["brush_domain"]);

        this.state = "";
        this.annotationData = [];

        this.data = [];

        this.mid_constructor(description);

        this.create_scene();
        this.fetch_data();

        this.pop_off_updating_stack();
    }
    mid_constructor(description) {

    }
    push_to_updating_stack() {
        this.updatingBrushStack.push("true");
    }
    pop_off_updating_stack() {
        this.updatingBrushStack.pop();
    }
    toJSON() {
        var brush_domain = this.get_brush_selection().domain;
        if (typeof brush_domain === 'undefined') brush_domain = null;
        return {
            "visual_type": this.visualType,
            "id": this.id,
            "group_id": this.groupIndex,
            "source": this.source,
            "width": this.container_width,
            "height": this.container_height,
            "x_domain": this.x.domain(),
            "y_domain": this.y.domain(),
            "is_context": this.isContext,
            "brush_domain": brush_domain
        }
    }
    toJSONCopy() {
        var copyJSON = this.toJSON();
        copyJSON.id = guid();
        return copyJSON;
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
            .text("Source: "+this.source+" -- ID: "+this.id.substring(0,8));
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

        this.x.range([0, this.width]);
        this.y.range([this.height, 0]);

        this.push_to_updating_stack();
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
        this.pop_off_updating_stack();

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

        this.push_to_updating_stack();
        if (this.isContext === false) {
            this.brush.move(this.context.select(".brush"), null);  // clear any visible brush
        } else {
            this.brush.move(this.context.select(".brush"), this.originalBrushSelection);
        }
        this.pop_off_updating_stack();

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

        this.push_to_updating_stack();
        this.brush.extent([[0, 0], [this.width, this.height]]);
        this.pop_off_updating_stack();

        this.update_axes();

        this.focus.attr("y2", this.height);

        this.push_to_updating_stack();
        this.context.select(".brush")
            .call(this.brush);
        this.pop_off_updating_stack();

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
    get_brush_selection() {
        var brushSelectionRange = d3.brushSelection(this.context.select(".brush").node());
        var brushSelectionDomain = undefined;
        if (brushSelectionRange !== undefined && brushSelectionRange !== null) {
            brushSelectionDomain = brushSelectionRange.map(this.x.invert, this.x);
        }
        return {domain: brushSelectionDomain, range: brushSelectionRange};
    }
    resize(width, height) {
        this.container_width = width;
        this.container_height = height;

        // save the previous Brush selection
        var brushSelection = this.get_brush_selection();

        this.update_scene();

        // update scene doesn't ensure the brush rectangle gets updated
        // so move it using the saved brushSelectionDomain
        if (this.isContext && brushSelection.domain !== undefined) {
            var newBrushSelectionRange = brushSelection.domain.map(this.x, this.x.invert);
            this.push_to_updating_stack();
            this.brush.move(this.context.select(".brush"), newBrushSelectionRange);
            this.pop_off_updating_stack();
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
        if (this.updatingBrushStack.length === 0) {
            this.push_to_updating_stack();
            var s = d3.event.selection || this.x.range();
            var sDomain = s.map(this.x.invert, this.x);
            this.dispatch.call("brushchange", {}, {
                range: s,
                domain: sDomain,
                source: this.id,
                iscontext: this.isContext,
                groupIndex: this.groupIndex
            });
            if (this.isContext) {
                var r = this.convert_brush_domain_to_range(sDomain);
                this.brush.move(this.context.select(".brush"), r);
            } else {
                this.update_domain(sDomain);
            }
            this.pop_off_updating_stack();
        }
    }
    update_domain(newDomain) {
        this.push_to_updating_stack();
        this.x.domain(newDomain);
        this.update_scene();
        this.brush.move(this.context.select(".brush"), null);  // clear any visible brush
        this.fetch_data();
        this.pop_off_updating_stack();
    }
    fetch_data() {
        var that = this;
        if (this.source) {
            var ignorecache = (that.source === "ParticleEvent") ? true : false;  // HACK TODO remove
            this.dataModuleMaster.fetch_data(this.source, this.x.domain(), ignorecache).done(function(data) {
                that.data = data;
                that.update_scene();

                // HACK version of long polling for demo
                if (that.source === "ParticleEvent" && $(that.container_el.node()).is(":visible")) {
                    console.log("fetching new data");
                    setTimeout(function() {
                        that.fetch_data();
                    }, 5000);
                }
            }).fail(function(e) {
                console.log("Error fetching data from "+this.id+" for source "+this.source);
            })
        }
    }
    update_data(e) {
        this.data = JSON.parse(JSON.stringify(e.data));
        this.update_scene();
    }
    convert_brush_domain_to_range(domain) {
        if (typeof domain === 'undefined' || domain === null) {
            return undefined;
        } else {
            return domain.map(this.x, this.x.invert);
        }
    }
    brush_change(e) {
        if (e.groupIndex !== this.groupIndex) return;
        if (this.updatingBrushStack.length !== 0) return;
        this.push_to_updating_stack();
        if (e.override) {
            this.update_domain(e.domain);
        } else if (this.id !== e.source) {
            if (this.isContext && e.domain[0] >= this.x.domain()[0] && e.domain[1] <= this.x.domain()[1]) {
                var r = this.convert_brush_domain_to_range(e.domain);
                this.brush.move(this.context.select(".brush"), r);
            } else {
                this.update_domain(e.domain);
            }
        } else if (e.iscontext === false) {
            this.update_domain(e.domain);
        }
        this.pop_off_updating_stack();
    }
}
