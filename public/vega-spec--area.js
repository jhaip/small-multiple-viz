var vegaSpec__Area = {
    "autosize": "none",
    "axes": [
        {
            "encode": {
                "domain": {
                    "update": {
                        "stroke": {
                            "value": "#AAA"
                        }
                    }
                },
                "labels": {
                    "update": {
                        "fill": {
                            "value": "#AAA"
                        }
                    }
                },
                "ticks": {
                    "update": {
                        "stroke": {
                            "value": "#AAA"
                        }
                    }
                }
            },
            "orient": "bottom",
            "scale": "xscale"
        },
        {
            "orient": "left",
            "scale": "yscale"
        }
    ],
    "data": [
        {
            "format": {
                "parse": {
                    "u": "date",
                    "v": "number"
                }
            },
            "name": "table",
            "values": [
                {
                    "u": "Jan 1 2015",
                    "v": 28
                },
                {
                    "u": "Mar 1 2015",
                    "v": 55
                },
                {
                    "u": "May 1 2015",
                    "v": 43
                },
                {
                    "u": "Jul 1 2015",
                    "v": 91
                },
                {
                    "u": "Aug 1 2015",
                    "v": 81
                },
                {
                    "u": "Jan 1 2016",
                    "v": 53
                }
            ]
        }
    ],
    "height": 150,
    "marks": [
        {
            "encode": {
                "enter": {
                    "fill": {
                        "value": "red"
                    },
                    "x": {
                        "field": "u",
                        "scale": "xscale"
                    },
                    "y": {
                        "field": "v",
                        "scale": "yscale"
                    },
                    "y2": {
                        "scale": "yscale",
                        "value": 0
                    }
                }
            },
            "from": {
                "data": "table"
            },
            "type": "area"
        }
    ],
    "padding": {
        "bottom": 20,
        "left": 20,
        "right": 20,
        "top": 10
    },
    "scales": [
        {
            "domain": [
                "1/1/2015",
                "1/1/2016"
            ],
            "name": "xscale",
            "range": "width",
            "type": "time",
            "zero": false
        },
        {
            "domain": {
                "data": "table",
                "field": "v"
            },
            "name": "yscale",
            "nice": true,
            "range": "height",
            "type": "linear",
            "zero": true
        }
    ],
    "width": 300
};
