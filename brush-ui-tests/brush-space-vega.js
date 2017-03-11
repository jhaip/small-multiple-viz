class BrushSpaceVega extends BrushSpace {
    constructor(dispatch, dmMaster, groupIndex, parent, width, height, id, source, isContext, vegaSpec) {
        super(dispatch, dmMaster, groupIndex, parent, width, height, id, source, isContext);
        this.visualType = "Vega";
        this.originalSpec = vegaSpec;
    }
    toJSON() {
        var baseJSON = super.toJSON();
        baseJSON["vega_spec"] = this.originalSpec;
        return baseJSON;
    }
    create_axes() {
        // Do nothing, Vega handles axes
    }
    update_axes() {
        // Do nothing, Vega handles axes
    }
    open_config() {
        $("#editVisualModal_sources-list").val(this.source);
        $("#editVisualModal_dropdownVisualTypes").val(this.visualType);
        $("#editVisualModal_vegaSpec").val(JSON.stringify(this.originalSpec, undefined, 4));
        $("#editVisualModal_advancedVisualTypeOptions").show(0);
        $('#editVisualModal').modal('show');
    }
    save_config_edits() {
        this.source = $("#editVisualModal_sources-list").val();
        $(".bs-el-container-label--"+this.id).text("Source: "+this.source);

        let newVisualType = $("#editVisualModal_dropdownVisualTypes").val();
        if (newVisualType !== this.visualType) {
            console.log("changing visualization type not handled yet!");
        }

        this.originalSpec = JSON.parse($("#editVisualModal_vegaSpec").val());

        $('#editVisualModal').modal('hide');

        this.data = [];
        this.update_scene();
        this.fetch_data();
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
