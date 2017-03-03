class BrushSpaceVega extends BrushSpace {
    constructor(dispatch, dmMaster, parent, width, height, id, source, isContext, vegaSpec) {
        super(dispatch, dmMaster, parent, width, height, id, source, isContext);

        this.originalSpec = vegaSpec;
    }
    create_axes() {
        // Do nothing, Vega handles axes
    }
    update_axes() {
        // Do nothing, Vega handles axes
    }
    create_scene() {
        super.create_scene();

        if (this.data.length > 0) {
            this.spec = $.extend(true, {}, this.originalSpec);
            this.spec["width"] = this.width;
            this.spec["height"] = this.height;
            this.spec["scales"][0]["domain"] = [this.x.domain()[0].getTime(), this.x.domain()[1].getTime()];
            this.spec["data"][0]["values"] = JSON.parse(JSON.stringify(this.data));
            // console.log(this.spec);
            var runtime = vega.parse(this.spec); // may throw an Error if parsing fails
            this.view = new vega.View(runtime)
              .logLevel(vega.Warn) // set view logging level
              .initialize(this.vis_el.node()) // set parent DOM element
              .renderer('svg') // set render type (defaults to 'canvas')
              .run(); // update and render the view
        }
    }
    update_scene() {
        super.update_scene();

        if (this.view) {
            this.view.finalize(); // "Prepares the view to be removed from a web page." - Vega docs
        }
        this.vis_el.html("");
        if (this.data.length > 0) {
            this.spec = $.extend(true, {}, this.originalSpec);
            this.spec["width"] = this.width;
            this.spec["height"] = this.height;
            this.spec["scales"][0]["domain"] = [this.x.domain()[0].getTime(), this.x.domain()[1].getTime()];
            this.spec["data"][0]["values"] = JSON.parse(JSON.stringify(this.data));
            var runtime = vega.parse(this.spec); // may throw an Error if parsing fails
            this.view = new vega.View(runtime)
              .logLevel(vega.Warn) // set view logging level
              .initialize(this.vis_el.node()) // set parent DOM element
              .renderer('svg') // set render type (defaults to 'canvas')
              .run(); // update and render the view
        }
    }
}
