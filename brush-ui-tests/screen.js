class Screen {
    constructor(dispatch, parent, id, defaultDomain) {
        this.dispatch = dispatch;
        this.parent = parent;
        this.id = id;
        this.brushSpaceGroups = [];
        this.defaultDomain = defaultDomain;
    }
    add_brush_space_group() {
        var newBrushSpaceGroup = new BrushSpaceGroup(this.dispatch,
                                                     this.parent,
                                                     guid(),
                                                     this.defaultDomain);
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
