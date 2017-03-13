class BrushSpaceGroup {
    constructor(dispatch, parent, description) {
        this.dispatch = dispatch;
        this.parent = parent;
        this.id = description["id"];
        description["x_domain"] = description["x_domain"].map(function(d) { return new Date(d); });
        this.x = d3.scaleTime().domain(description["x_domain"]);
        this.width = description["width"];
        this.brushSpaces = [];

        this.el = this.parent.append("div")
            .attr("class", "visual-block visual-block--" + this.id);
        this.el.append("h3")
            .text("Group " + this.id);

        var that = this;
        description["brush_spaces"].forEach(function(bsDescription) {
            that.add_brush_space(bsDescription);
        });
    }
    add_brush_space(newBrushSpaceJSONDescription) {
        newBrushSpaceJSONDescription = $.extend({
            id: guid(),
            group_id: this.id,
            width: this.width,
            x_domain: this.x.domain(),
            parent: this.el // TODO this seems wrong because the toJSON doesn't include it
        }, newBrushSpaceJSONDescription);
        var newBrushSpace;
        if (newBrushSpaceJSONDescription["visual_type"] === "Vega") {
            newBrushSpace = new BrushSpaceVega(dispatch,
                                               dmMaster,
                                               newBrushSpaceJSONDescription);
        } else if (newBrushSpaceJSONDescription["visual_type"] === "Textual Log") {
            newBrushSpace = new BrushSpaceTextualLog(dispatch,
                                                     dmMaster,
                                                     newBrushSpaceJSONDescription);
        } else if (newBrushSpaceJSONDescription["visual_type"] === "Base") {
            newBrushSpace = new BrushSpace(dispatch,
                                           dmMaster,
                                           newBrushSpaceJSONDescription);
        }
        this.brushSpaces.push(newBrushSpace);
        this.update_domain(this.x.domain());   // TODO pass in initial domain directly to brush space
    }
    update_domain(newDomain) {
        this.x.domain(newDomain);
        this.dispatch.call("brushchange", {}, {
            range: [0,1],
            domain: this.x.domain(),
            source: "",
            iscontext: false,
            groupIndex: this.id
        });
    }
    toJSON() {
        return {
            id: this.id,
            x_domain: this.x.domain(),
            width: this.width,
            brush_spaces: this.brushSpaces.map(function(bs) {
                return bs.toJSON();
            })
        };
    }
}
