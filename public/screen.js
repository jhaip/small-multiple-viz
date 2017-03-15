class Screen {
    constructor(dispatch, parent, description) {
        this.dispatch = dispatch;
        this.parent = parent;
        this.id = description["id"];
        this.brushSpaceGroups = [];
        this.defaultDomain = description["default_domain"].map(function(d) { return new Date(d); });

        var that = this;
        description["brush_space_groups"].forEach(function(bsgDescription) {
            that.add_brush_space_group(bsgDescription);
        });
    }
    toJSON() {
        return {
            id: this.id,
            default_domain: this.defaultDomain,
            brush_space_groups: this.brushSpaceGroups.map(function(bsg) { return bsg.toJSON(); })
        };
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
