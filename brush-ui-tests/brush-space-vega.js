class BrushSpaceVega extends BrushSpace {
    constructor(dispatch, parent, id, source, isContext = false) {
        super(dispatch, parent, id, source, isContext);

        this.originalSpec = {
          "$schema": "https://vega.github.io/schema/vega/v3.0.json",
          "width": this.container_width - this.margin.left - this.margin.right,
          "height": this.container_height - this.margin.top - this.margin.bottom,
          "padding": 20,
          "autosize": "none",
          "data": [
            {
              "name": "table",
              "values": [
                {"u": "Jan 1 2015",  "v": 28}, {"u": "Mar 1 2015",  "v": 55},
                {"u": "May 1 2015",  "v": 43}, {"u": "Jul 1 2015",  "v": 91},
                {"u": "Aug 1 2015",  "v": 81}, {"u": "Jan 1 2016",  "v": 53}
              ],
              "format": {"parse": {"v": "number", "u": "date"}}
            }
          ],

          "scales": [
            {
              "name": "xscale",
              "type": "time",
              "range": "width",
              "zero": false,
              "domain": ["1/1/2015", "1/1/2016"]
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
