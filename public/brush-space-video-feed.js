class BrushSpaceVideoFeed extends BrushSpace {
    mid_constructor(description) {
        this.visualType = "VideoFeed";
    }
    create_or_update_data_items() {
        var that = this;
        var dataItems = this.vis_el_svg.selectAll(".video-thumbnail").data(that.data);
        dataItems.enter().append("image")
                .attr("class", "video-thumbnail")
            .merge(dataItems)
                .attr('x', function(d) { return that.x(d.u); })
                .attr('y', 30)
                .attr('width', "170px")
                .attr('height', "95px")
                .attr("xlink:href", function(d) { return d.thumbnail_url; });
        dataItems.exit().remove();

        var dataItems2 = this.vis_el_svg.selectAll(".video-thumbnail-tick").data(that.data);
        dataItems2.enter().append("circle")
                .attr("class", "video-thumbnail-tick")
                .attr("r", 5)
                .attr("cy", that.height)
                .style("fill", "red")
            .merge(dataItems2)
                .attr('cx', function(d) { return that.x(d.u); });
        dataItems2.exit().remove();
    }
    create_scene() {
        super.create_scene();
        this.vis_el_svg = this.vis_el.append("svg");
        this.create_or_update_data_items();
    }
    update_scene() {
        super.update_scene();
        this.create_or_update_data_items();
    }
}
