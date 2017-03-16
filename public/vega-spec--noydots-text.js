var vegaSpec__NoYDots = {
  "width": 300,
  "height": 1,
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
    {"orient": "bottom", "scale": "xscale"},
  ],

  "marks": [
    {
      "type": "symbol",
      "from": {"data": "table"},
      "encode": {
        "enter": {
          "x": {"scale": "xscale", "field": "u"},
          "y": {"scale": "yscale", "value": 0},
          "fill": {"value": "steelblue"}
        }
      }
    }
  ]
};
