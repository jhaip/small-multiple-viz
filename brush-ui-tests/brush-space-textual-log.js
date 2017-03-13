class BrushSpaceTextualLog extends BrushSpace {
    mid_constructor(description) {
        this.visualType = "Textual Log";
    }
    create_or_update_data_items() {
        var dataItems = this.vis_el.selectAll(".item").data(this.data);
        dataItems.enter().append("div")
                .attr("class", "item clearfix item--"+this.source)
            .merge(dataItems)
                .html(function(d) {
                    let val = d.v;
                    if (d.label) {
                        val = d.label;
                    }
                    let template = `
                    <div class="item__timestamp">${d.u}</div>
                    <div class="item__label">${val}</div>
                    `;
                    return template;
                });
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
        this.vis_el = this.el.append("div").attr("class", "cover bs-el-vis bs-el-vis--textual-log bs-el-vis--"+this.id);

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
        if (e.groupIndex !== this.groupIndex) {
            return;
        }
        // TODO highlight
    }
    clicked(clickPosition) {
        // TODO
    }
    state_change(e) {
        this.state = e.state;
        // TODO
    }
    update_domain(newDomain) {
        this.x.domain(newDomain);
        this.update_scene();
        this.fetch_data();
    }
    brush_change(e) {
        if (e.groupIndex !== this.groupIndex) {
            return;
        }
        if (this.id !== e.source) {
            if (this.isContext && e.domain[0] >= this.x.domain()[0] && e.domain[1] <= this.x.domain()[1]) {
                // pass
            } else {
                this.update_domain(e.domain);
            }
        } else if (e.iscontext === false) {
            this.update_domain(e.domain);
        }
    }
}
