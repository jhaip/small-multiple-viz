class BrushSpaceGroup {
    constructor(dispatch, parent, description) {
        this.dispatch = dispatch;
        this.parent = parent;
        this.id = description["id"];
        this.domain = description["x_domain"];
        this.width = description["width"];
        this.height = description["height"] || 900;
        this.brushSpaces = [];
        this.updatingBrushStack = new Array();

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
            .property("value", function() {
                var m = moment(that.domain[0]);
                if (m.isValid()) { return m.toDate(); }
                return that.domain[0];
            })
            .on("keyup", function(e) {
                if (d3.event["key"] === "Enter") {
                    that.update_domain([this.value, that.domain[1]]);
                    if (that.get_date_domain()[0] === null) {
                        console.log("TODO: show error for bad date");
                    }
                }
            });
        form_group.append("span").text(" to ");
        form_group.append("input")
            .attr("type", "text")
            .attr("class", "bsg-times bsg-end-time--"+this.id)
            .property("value", function() {
                var m = moment(that.domain[1]);
                if (m.isValid()) { return m.toDate(); }
                return that.domain[1];
            })
            .on("keyup", function(e) {
                if (d3.event["key"] === "Enter") {
                    that.update_domain([that.domain[0], this.value]);
                    if (that.get_date_domain()[1] === null) {
                        console.log("TODO: show error for bad date");
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

        this.dispatch.on("delete-brush-space."+this.id, function(e) {
            that.remove_brush_space(e.id);
        });
        this.dispatch.on("brushchange."+this.id, function(e) {
            that.brush_change(e);
        });
        this.update_domain(this.domain, true);
    }
    push_to_updating_stack() {
        this.updatingBrushStack.push("true");
    }
    pop_off_updating_stack() {
        this.updatingBrushStack.pop();
    }
    brush_change(e) {
        if (e.groupIndex !== this.id) return;
        this.update_domain(e.domain, true);
    }
    remove_brush_space(idToRemove) {
        console.log("REMOVING BRUSH SPACE "+idToRemove);
        this.brushSpaces = this.brushSpaces.filter(function(bs) {
            return bs.id !== idToRemove;
        });
        this.resize(this.width, this.height);
    }
    add_brush_space(newBrushSpaceJSONDescription) {
        newBrushSpaceJSONDescription = $.extend({
            id: guid(),
            group_id: this.id,
            width: this.width,
            height: 200,
            x_domain: this.get_date_domain(),
            parent: this.el, // TODO this seems wrong because the toJSON doesn't include it
            is_context: false
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
        } else if (newBrushSpaceJSONDescription["visual_type"] === "Livestream") {
            newBrushSpace = new BrushSpaceLivestream(dispatch,
                                                     dmMaster,
                                                     newBrushSpaceJSONDescription);
        } else if (newBrushSpaceJSONDescription["visual_type"] === "Notes") {
            newBrushSpace = new BrushSpaceNotes(dispatch,
                                                dmMaster,
                                                newBrushSpaceJSONDescription);
        } else if (newBrushSpaceJSONDescription["visual_type"] === "Base") {
            newBrushSpace = new BrushSpace(dispatch,
                                           dmMaster,
                                           newBrushSpaceJSONDescription);
        }
        this.brushSpaces.push(newBrushSpace);
        return newBrushSpace;
    }
    get_date_from_str(str) {
        var m = moment(str);
        if (m.isValid()) {
            return m.toDate();
        }
        if (str.toLowerCase() === "now") {
            return new Date();
        }
        var re = /-(\d+)d/;
        var dateOffset = str.match(re);
        if (dateOffset && dateOffset[1]) {
            return moment().subtract(parseInt(dateOffset[1]), 'days').toDate();
        }
        console.error("Could not parse date str");
        console.error(str);
        return null;
    }
    get_date_domain() {
        var start = this.get_date_from_str(this.domain[0]);
        var end = this.get_date_from_str(this.domain[1]);
        return [start, end];
    }
    update_domain(newDomain, ignore_dispatch) {
        if (this.updatingBrushStack.length > 0) return;

        this.push_to_updating_stack();
        console.log("update domain "+this.id);
        console.log(newDomain);
        var that = this;
        this.domain = newDomain;
        d3.select(".bsg-start-time--"+this.id).property("value", this.domain[0]);
        d3.select(".bsg-end-time--"+this.id).property("value", this.domain[1]);
        if (!ignore_dispatch) {
            this.dispatch.call("brushchange", {}, {
                range: [0,1],
                domain: this.get_date_domain(),
                source: "",
                iscontext: false,
                groupIndex: this.id,
                override: true
            });
        }

        if (this.domain[1] === "now") {
            console.log("long poll in "+this.id);
            setTimeout(function() {
                // check that domain end is still now
                if (that.domain[1] === "now") {
                    $(".bsg-end-time--"+that.id).addClass("flash");
                    setTimeout(function() {
                        $(".bsg-end-time--"+that.id).removeClass("flash");
                    }, 500);
                    that.update_domain(that.domain);
                }
            }, 5000);
        }

        this.pop_off_updating_stack();
    }
    end(testNotesStr) {
        var that = this;
        if (this.domain[1] === "now") {
            this.testNotes = testNotesStr;

            // save notes
            dmMaster.save_data("TestNotes", testNotesStr, {"group_id": this.id}).done(function() {
                // make sure notes are shown if they aren't already
                var noteBrushSpaces = that.brushSpaces.filter(function(bs) { return bs.source === "TestNotes"; });
                if (noteBrushSpaces.length === 0) {
                    that.add_brush_space({"source": "TestNotes", "visual_type": "Notes", "height": 200});
                } else {
                    noteBrushSpaces.forEach(function(nbs) {
                        nbs.fetch_data();
                    });
                }
            }).fail(function(e) {
                console.error(e);
            });

            this.domain[1] = this.get_date_domain()[1];
            this.update_domain(this.domain);
        }
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
            x_domain: this.domain,
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
            bs.id = guid();
            return bs;
        });
        return copyJSON;
    }
}
