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

        var that = this;
        description["brush_space_groups"].forEach(function(bsgDescription) {
            that.add_brush_space_group(bsgDescription);
        });
        this.add_labels();
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
    add_labels() {
        var that = this;
        var rowLabelEl = this.parent.insert("div",":first-child")
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
    add_brush_space_group(description) {
        description = $.extend({
            id: guid(),
            x_domain: this.defaultDomain,
            width: 500,
            brush_spaces: []
        }, description);
        var newBrushSpaceGroup = new BrushSpaceGroup(this.dispatch,
                                                     this.parent,
                                                     description);
        this.brushSpaceGroups.push(newBrushSpaceGroup);
        if (this.sources.length === 0) {
            this.sources = newBrushSpaceGroup.brushSpaces.map(function(bs) {
                return bs.source;
            });
        }
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
