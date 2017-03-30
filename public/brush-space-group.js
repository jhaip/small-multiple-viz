class BrushSpaceGroup {
    constructor(dispatch, parent, description) {
        this.dispatch = dispatch;
        this.parent = parent;
        this.id = description["id"];
        description["x_domain"] = description["x_domain"].map(function(d) { return new Date(d); });
        this.x = d3.scaleTime().domain(description["x_domain"]);
        this.width = description["width"];
        this.height = description["height"] || 900;
        this.brushSpaces = [];

        var that = this;
        this.el = this.parent.append("div")
            .attr("class", "visual-block visual-block--" + this.id)
            .style("width", this.width+"px")
            .style("height", this.height+"px");
        var form_group = this.el.append("div");
        form_group.attr("class", "bsg-times-group");
        form_group.append("input")
            .attr("type", "text")
            .attr("class", "bsg-times bsg-start-time--"+this.id)
            .property("value", moment(this.x.domain()[0]).format("M/D H:mm:ss.SSSS"))
            .on("keyup", function(e) {
                if (d3.event["key"] === "Enter") {
                    var newTime = moment(this.value);
                    if (newTime.isValid()) {
                        that.update_domain([newTime.toDate(), that.x.domain()[1]]);
                    }
                }
            });
        form_group.append("span").text(" to ");
        form_group.append("input")
            .attr("type", "text")
            .attr("class", "bsg-times bsg-end-time--"+this.id)
            .property("value", moment(this.x.domain()[1]).format("M/D H:mm:ss.SSSS"))
            .on("keyup", function(e) {
                if (d3.event["key"] === "Enter") {
                    var newTime = moment(this.value);
                    if (newTime.isValid()) {
                        that.update_domain([that.x.domain()[0], newTime.toDate()]);
                    }
                }
            });

        var that = this;
        this.el.append("button")
            .attr("class", "btn btn-default btn-xs")
            .style("display", "inline-block")
            .text("X")
            .on("click", function(e) {
                that.el.remove();
                that.dispatch.call("delete-brush-space-group", {}, {id: that.id});
            });

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
        } else if (newBrushSpaceJSONDescription["visual_type"] === "VideoFeed") {
            newBrushSpace = new BrushSpaceVideoFeed(dispatch,
                                                     dmMaster,
                                                     newBrushSpaceJSONDescription);
        } else if (newBrushSpaceJSONDescription["visual_type"] === "Base") {
            newBrushSpace = new BrushSpace(dispatch,
                                           dmMaster,
                                           newBrushSpaceJSONDescription);
        }
        this.brushSpaces.push(newBrushSpace);
    }
    update_domain(newDomain) {
        this.x.domain(newDomain);
        this.dispatch.call("brushchange", {}, {
            range: [0,1],
            domain: this.x.domain(),
            source: "",
            iscontext: false,
            groupIndex: this.id,
            override: true
        });
    }
    resize(width, height) {
        this.width = width;
        this.height = height;

        this.el.style("width", this.width+"px").style("height", this.height+"px");

        var that = this;
        this.brushSpaces.forEach(function(bs) {
            bs.resize(that.width, bs.container_height);
        });
    }
    toJSON() {
        return {
            id: this.id,
            x_domain: this.x.domain(),
            width: this.width,
            height: this.height,
            brush_spaces: this.brushSpaces.map(function(bs) {
                return bs.toJSON();
            })
        };
    }
    toJSONCopy() {
        var copyJSON = this.toJSON();
        copyJSON.id = guid();
        copyJSON.brush_spaces = copyJSON.brush_spaces.map(function(bs) {
            bs.group_id = copyJSON.id;
            return bs;
        });
        return copyJSON;
    }
}
