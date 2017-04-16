class Screen {
    constructor(dispatch, parent, description) {
        this.dispatch = dispatch;
        this.parent = parent;
        this.id = description["id"];
        this.brushSpaceGroups = [];
        this.defaultDomain = description["default_domain"].map(function(d) { return new Date(d); });

        this.el = this.parent.append("div")
            .attr("class", "small-multiple small-multiple-"+this.id)
            .style("width", "100%")
            .style("height", "90vh")
            .style("background-color", "#FAFAFF");
        this.visual_container = this.el.append("div")
            .attr("class", "clearfix");

        var that = this;

        if ("brush_space_groups" in description) {
            description["brush_space_groups"].forEach(function(bsgDescription) {
                firebase.database().ref('/brush_space_groups/' + bsgDescription).once('value').then(function(snapshot) {
                    var savedDescription = snapshot.val();
                    that.add_brush_space_group(savedDescription);
                });
            });
        }

        $(window).resize(function() {
            that.resize();
        });

        this.dispatch.on("delete-brush-space-group."+this.id, function(e) {
            console.log(e);
            that.remove_brush_space_group(e.id);
        });
    }
    toJSON() {
        return {
            id: this.id,
            default_domain: this.defaultDomain,
            brush_space_groups: this.brushSpaceGroups.map(function(bsg) { return bsg.id; })
        };
    }
    clear() {
        this.brushSpaceGroups = [];
        this.visual_container.html("");
    }
    resize() {
        var that = this;
        var w = $(this.el.node()).width();
        var h = $(this.el.node()).height();
        this.brushSpaceGroups.forEach(function(bsg) {
            bsg.resize((w)/that.brushSpaceGroups.length, h);
        });
    }
    remove_brush_space_group(idToRemove) {
        console.log("I should remove "+idToRemove);
        console.log(this);
        this.brushSpaceGroups = this.brushSpaceGroups.filter(function(bsg) {
            return bsg.id !== idToRemove;
        });
        this.resize();
    }
    add_brush_space_group(description) {
        if (typeof description === 'undefined') {
            description = {x_domain: [new Date(), "now"]};
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
        this.resize();
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
    end_tests(testNotes) {
        for (var i=0; i<this.brushSpaceGroups.length; i+=1) {
            this.brushSpaceGroups[i].end(testNotes);
        }
    }
    add_time() {
        this.defaultDomain[1] = new Date(this.defaultDomain[1].getTime()+1000*60*60*24*30);
        this.update_domain(this.defaultDomain);
    }
}
