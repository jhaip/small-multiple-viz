class BrushSpaceNotes extends BrushSpace {
    mid_constructor(description) {
        this.visualType = "Notes";
    }
    create_or_update_data_items() {
        var that = this;

        if (this.vis_el.select(".notes-textarea").empty()) {
            var div = this.vis_el.append("div").attr("class", "notes-container");
            div.append("textarea")
                .attr("class", "notes-textarea");
            div.append("div").attr("class", "notes-button-container")
                .append("button")
                .attr("type", "button")
                .attr("class", "btn btn-default").text("Save")
                .on("click", function(e) {
                    that.vis_el.select(".notes-textarea").property("disabled", true);
                    console.log("saving");
                    var newData = that.vis_el.select(".notes-textarea").property("value");
                    that.dataModuleMaster.save_data(that.source, newData, that.toJSON()).done(function() {
                        console.log("heard done");
                        that.data = newData;
                        that.vis_el.select(".notes-textarea").property("disabled", false);
                    }).fail(function(e) {
                        console.error(e);
                    });
                });
        }
        this.vis_el.select(".notes-textarea").property("value", this.data)
    }
    create_scene() {
        var that = this;

        this.container_el = this.parent.append("div")
            .attr("class", "bs-el-container bs-el-container--"+this.id);

        this.create_scene_label();

        this.el = this.container_el.append("div")
            .attr("class", "bs-el bs-el--"+this.id)
            .style("width", this.container_width+"px")
            .style("height", this.container_height+"px");
        this.vis_el = this.el.append("div").attr("class", "cover bs-el-vis bs-el-vis--notes bs-el-vis--"+this.id);

        this.create_or_update_data_items();

        this.width = this.container_width - this.margin.left - this.margin.right,
        this.height = this.container_height - this.margin.top - this.margin.bottom;

        this.htmlOverlayContainer = this.el.append("div")
            .attr("class", "html-overlay-container cover-position");

        that.create_resize_control();
    }
    update_scene() {
        var that = this;

        this.el.style("width", this.container_width+"px")
            .style("height", this.container_height+"px");

        this.width = this.container_width - this.margin.left - this.margin.right,
        this.height = this.container_height - this.margin.top - this.margin.bottom;

        this.create_or_update_data_items();

        this.update_annotations();
    }
    update_annotations() {
        // TODO
    }
    resize(width, height) {
        this.container_width = width;
        this.container_height = height;
        this.update_scene();
    }
    mousemove(e) {
        return;
    }
    clicked(clickPosition) {
        // TODO
    }
    state_change(e) {
        this.state = e.state;
        // TODO
    }
    update_domain(newDomain) {
        return;
    }
    get_brush_selection() {
        return {domain: undefined};
    }
    brush_change(e) {
        return;
    }
}
