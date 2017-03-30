class Screen {
    constructor(dispatch, parent, description) {
        this.dispatch = dispatch;
        this.parent = parent;
        this.id = description["id"];
        this.smallMultiples = [];
        this.defaultDomain = description["default_domain"].map(function(d) { return new Date(d); });

        var that = this;
        if ("small_multiples" in description) {
            description["small_multiples"].forEach(function(smallMultipleDescription) {
                that.add_small_multiple(smallMultipleDescription);
            });
        }
    }
    toJSON() {
        return {
            id: this.id,
            default_domain: this.defaultDomain,
            small_multiples: this.smallMultiples.map(function(sm) { return sm.toJSON(); })
        };
    }
    add_small_multiple(description) {
        description = $.extend({
            id: guid(),
            default_domain: this.defaultDomain,
            width: 1000,
            height: 1000,
            brush_space_groups: []
        }, description);
        var newSmallMultiple = new SmallMultiple(this.dispatch,
                                                 this.parent,
                                                 description);
        this.smallMultiples.push(newSmallMultiple);
        return this.smallMultiples.length-1;
    }
    add_brush_space_group(description) {
        // TODO remove this because it doesn't make sense
        if (this.smallMultiples.length === 0) {
            this.add_small_multiple({});
        }
        return this.smallMultiples[0].add_brush_space_group(undefined);
    }
    add_brush_space(brushSpaceTarget, newBrushSpaceJSONDescription) {
        // TODO remove this because it doesn't make sense
        if (this.smallMultiples.length > 0) {
            this.smallMultiples[0].add_brush_space(brushSpaceTarget, newBrushSpaceJSONDescription);
        }
    }
}
