class BrushSpaceGroup {
    constructor(dispatch, parent, id, domain) {
        this.dispatch = dispatch;
        this.parent = parent;
        this.id = id;
        this.x = d3.scaleTime().domain(domain);
        this.width = 500;
        this.brushSpaces = [];

        this.el = this.parent.append("div")
            .attr("class", "visual-block visual-block--" + this.id);
        this.el.append("h3")
            .text("Group " + this.id);
    }
    add_brush_space(visualType, height, source, isContext, vegaSpec) {
        var newBrushSpace;
        if (visualType === "Vega") {
            newBrushSpace = new BrushSpaceVega(dispatch,
                                               dmMaster,
                                               this.id,
                                               this.el,
                                               this.width,
                                               height,
                                               guid(),
                                               source,
                                               isContext,
                                               vegaSpec);
        } else if (visualType === "Textual Log") {
            newBrushSpace = new BrushSpaceTextualLog(dispatch,
                                                     dmMaster,
                                                     this.id,
                                                     this.el,
                                                     this.width,
                                                     height,
                                                     guid(),
                                                     source,
                                                     isContext);
        } else if (visualType === "Base") {
            newBrushSpace = new BrushSpace(dispatch,
                                           dmMaster,
                                           this.id,
                                           this.el,
                                           this.width,
                                           height,
                                           guid(),
                                           source,
                                           isContext);
        }
        this.brushSpaces.push(newBrushSpace);
        // this.update_domain(this.x.domain());   // TODO pass in initial domain directly to brush space
    }
    update_domain(newDomain) {
        this.x.domain(newDomain);
        this.dispatch.call("brushchange-request", {}, {
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
