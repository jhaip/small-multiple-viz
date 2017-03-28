class SmallMultiple {
    constructor(dispatch, parent, description) {
        this.dispatch = dispatch;
        this.parent = parent;
        this.id = description["id"];
        this.brushSpaceGroups = [];
        this.defaultDomain = description["default_domain"].map(function(d) { return new Date(d); });
        this.width = description["width"];
        this.height = description["height"];
        this.sources = [];

        this.el = this.parent.append("div")
            .attr("class", "small-multiple small-multiple-"+this.id)
            .style("width", this.width+"px")
            .style("height", this.height+"px")
            .style("background-color", "#FAFAFF");
        this.visual_container = this.el.append("div")
            .attr("class", "clearfix");

        var that = this;
        description["brush_space_groups"].forEach(function(bsgDescription) {
            that.add_brush_space_group(bsgDescription);
        });
        this.add_labels();
        this.create_resize_control_y();
        this.create_resize_control_x();

        this.dispatch.on("delete-brush-space-group."+this.id, function(e) {
            console.log(e);
            that.remove_brush_space_group(e.id);
        });
    }
    toJSON() {
        return {
            id: this.id,
            default_domain: this.defaultDomain,
            brush_space_groups: this.brushSpaceGroups.map(function(bsg) { return bsg.toJSON(); }),
            width: this.width,
            height: this.height
        };
    }
    resize(width, height) {
        this.width = width;
        this.height = height;

        this.el.style("width", this.width+"px").style("height", this.height+"px");

        var that = this;
        this.brushSpaceGroups.forEach(function(bsg) {
            bsg.resize((that.width-125)/that.brushSpaceGroups.length, that.height);
        });
    }
    create_resize_control_x() {
        var that = this;
        var startX = 0;

        function dragstarted(d) {
            startX = d3.event.x;
            d3.select(this).raise().classed("active", true);
        }

        function dragged(d) {
            d3.select(".small-multiple-"+that.id).style("width", (that.width+d3.event.x-startX)+"px");
        }

        function dragended(d) {
            d3.select(this).classed("active", false);
            that.resize(that.width+d3.event.x-startX, that.height);
        }

        this.el.append("div")
            .attr("class", "small-multiple-resize-x small-multiple-resize-x--"+this.id)
            .call(d3.drag()
                .on("start", dragstarted)
                .on("drag", dragged)
                .on("end", dragended)
            );
    }
    create_resize_control_y() {
        var that = this;
        var startY = 0;

        function dragstarted(d) {
            startY = d3.event.y;
            d3.select(this).raise().classed("active", true);
        }

        function dragged(d) {
            console.log("dragged");
            d3.select(".small-multiple-"+that.id).style("height", (that.height+d3.event.y-startY)+"px");
        }

        function dragended(d) {
            d3.select(this).classed("active", false);
            that.resize(that.width, that.height+d3.event.y-startY);
        }

        this.el.append("div")
            .attr("class", "small-multiple-resize small-multiple-resize--"+this.id)
            .call(d3.drag()
                .on("start", dragstarted)
                .on("drag", dragged)
                .on("end", dragended)
            );
    }
    add_labels() {
        var that = this;
        var rowLabelEl = this.visual_container.insert("div",":first-child")
            .attr("class", "visual-block");

        rowLabelEl.selectAll("div").data(this.sources)
            .enter().append("div")
            .style("height", function(d, i){
                return $(that.brushSpaceGroups[0].brushSpaces[i].container_el.node()).height() + "px";
            })
            .style("margin-top", "10px")
            .html(function(d) {
                return `<h5 style="text-align: right">${d}</h5>
                    <button type="button" class="btn btn-default btn-xs" style="float: right;"><span class="glyphicon glyphicon-cog" aria-hidden="true" style=""></span> Edit</button>`;
            });
    }
    remove_brush_space_group(idToRemove) {
        console.log("I should remove "+idToRemove);
        console.log(this);
        this.brushSpaceGroups = this.brushSpaceGroups.filter(function(bsg) {
            return bsg.id !== idToRemove;
        });
        this.resize(this.width, this.height);
    }
    add_brush_space_group(description) {
        // Experimental: use existing description of the first brush spaces
        // as a template for the new brush space but with different IDs
        if (typeof description === 'undefined' && this.brushSpaceGroups.length > 0) {
            description = this.brushSpaceGroups[0].toJSONCopy();
        }
        description = $.extend({
            id: guid(),
            x_domain: this.defaultDomain,
            width: 500,
            brush_spaces: []
        }, description);
        var newBrushSpaceGroup = new BrushSpaceGroup(this.dispatch,
                                                     this.visual_container,
                                                     description);
        this.brushSpaceGroups.push(newBrushSpaceGroup);
        if (this.sources.length === 0) {
            this.sources = newBrushSpaceGroup.brushSpaces.map(function(bs) {
                return bs.source;
            });
        }
        this.resize(this.width, this.height);
        return this.brushSpaceGroups.length-1;
    }
    add_brush_space(brushSpaceTarget, newBrushSpaceJSONDescription) {
        var groupsToAddVisualTo = this.brushSpaceGroups;
        if (brushSpaceTarget !== "All Groups") {
            groupsToAddVisualTo = [this.brushSpaceGroups[parseInt(brushSpaceTarget)]];
        }
        for (let i=0; i<groupsToAddVisualTo.length; i+=1) {
            groupsToAddVisualTo[i].add_brush_space(newBrushSpaceJSONDescription);
        }
    }
    update_domain(newDomain) {
        for (var i=0; i<this.brushSpaceGroups.length; i+=1) {
            this.brushSpaceGroups[i].update_domain(newDomain);
        }
    }
    add_time() {
        this.defaultDomain[1] = new Date(this.defaultDomain[1].getTime()+1000*60*60*24*30);
        this.update_domain(this.defaultDomain);
    }
}
