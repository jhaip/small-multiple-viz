class BrushSpaceVega {
    constructor(dispatch, parent, id, isContext = false) {
        this.dispatch = dispatch;
        this.id = id;
        this.isContext = isContext;
        this.parent = parent;
        var that = this;

        this.dispatch.on("brushchange."+this.id, function(e) {
            that.brush_change(e);
        });
        this.dispatch.on("hoverchange."+this.id, function(v) {
            that.mousemove(v);
        });
        this.dispatch.on("statechange."+this.id, function(e) {
            that.state_change(e);
        });

        this.margin = {top: 20, right: 20, bottom: 20, left: 20};
        this.container_width = 960;
        this.container_height = 150;

        this.state = "";
        this.annotationData = [];

        this.create_scene();
    }
    create_scene() {
        var spec = {
          "$schema": "https://vega.github.io/schema/vega/v3.0.json",
          "width": 960-40,
          "height": 150-40,
          "padding": 20,
          "autosize": "none",
          "data": [
            {
              "name": "table",
              "values": [
                {"u": 1,  "v": 28}, {"u": 2,  "v": 55},
                {"u": 3,  "v": 43}, {"u": 4,  "v": 91},
                {"u": 5,  "v": 81}, {"u": 6,  "v": 53},
                {"u": 7,  "v": 19}, {"u": 8,  "v": 87},
                {"u": 9,  "v": 52}, {"u": 10, "v": 48},
                {"u": 11, "v": 24}, {"u": 12, "v": 49},
                {"u": 13, "v": 87}, {"u": 14, "v": 66},
                {"u": 15, "v": 17}, {"u": 16, "v": 27},
                {"u": 17, "v": 68}, {"u": 18, "v": 16},
                {"u": 19, "v": 49}, {"u": 20, "v": 15}
              ]
            }
          ],

          "scales": [
            {
              "name": "xscale",
              "type": "linear",
              "range": "width",
              "zero": false,
              "domain": {"data": "table", "field": "u"}
            },
            {
              "name": "yscale",
              "type": "linear",
              "range": "height",
              "nice": true,
              "zero": true,
              "domain": {"data": "table", "field": "v"}
            }
          ],

          "axes": [
            {"orient": "bottom", "scale": "xscale", "tickCount": 20},
            {"orient": "left", "scale": "yscale"}
          ],

          "marks": [
            {
              "type": "area",
              "from": {"data": "table"},
              "encode": {
                "enter": {
                  "x": {"scale": "xscale", "field": "u"},
                  "y": {"scale": "yscale", "field": "v"},
                  "y2": {"scale": "yscale", "value": 0},
                  "fill": {"value": "steelblue"}
                }
              }
            }
          ]
        };
        var runtime = vega.parse(spec); // may throw an Error if parsing fails
        console.log(runtime);
        var view = new vega.View(runtime)
          .logLevel(vega.Warn) // set view logging level
          .initialize(document.querySelector('#vis')) // set parent DOM element
          .renderer('svg') // set render type (defaults to 'canvas')
          .hover() // enable hover event processing
          .run(); // update and render the view
    }
    update_scene() {

    }
    update_annotations() {

    }
    resize(width, height) {

    }
    mousemove(x0) {

    }
    clicked(clickPosition) {

    }
    state_change(e) {

    }
    brushed() {

    }
    update_domain(newDomain) {

    }
    brush_change(e) {

    }
}
