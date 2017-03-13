class BrushSpaceGroup {
    constructor(dispatch, parent, description) {
        this.dispatch = dispatch;
        this.parent = parent;
        this.id = description["id"];
        this.x = d3.scaleTime().domain(description["x_domain"]);
        this.width = description["width"];
        this.brushSpaces = description["brush_spaces"];

        this.el = this.parent.append("div")
            .attr("class", "visual-block visual-block--" + this.id);
        this.el.append("h3")
            .text("Group " + this.id);
    }
    add_brush_space(newBrushSpaceJSONDescription) {
        newBrushSpaceJSONDescription["id"] = guid();
        newBrushSpaceJSONDescription["group_id"] = this.id;
        newBrushSpaceJSONDescription["width"] = this.width;
        newBrushSpaceJSONDescription["x_domain"] = this.x.domain();
        newBrushSpaceJSONDescription["parent"] = this.el;
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
