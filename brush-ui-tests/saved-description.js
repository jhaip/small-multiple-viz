var savedDescription = `{
    "id": "6ccdec24-722c-a8e6-11c9-cfbe5da8892c",
    "default_domain": [
        "2017-01-25T05:00:00.000Z",
        "2017-02-01T05:00:00.000Z"
    ],
    "brush_space_groups": [
        {
            "id": "c6382ae7-977b-7075-8ad3-dd3b1a99d4ae",
            "x_domain": [
                "2017-01-25T05:00:00.000Z",
                "2017-02-01T05:00:00.000Z"
            ],
            "width": 500,
            "brush_spaces": [
                {
                    "visual_type": "Vega",
                    "id": "c715f717-5601-253e-5323-fa79649917a1",
                    "group_id": "c6382ae7-977b-7075-8ad3-dd3b1a99d4ae",
                    "source": "fake",
                    "width": 500,
                    "height": 100,
                    "x_domain": [
                        "2017-01-25T05:00:00.000Z",
                        "2017-02-01T05:00:00.000Z"
                    ],
                    "y_domain": [
                        0,
                        1
                    ],
                    "is_context": true,
                    "vega_spec": {
                        "$schema": "https://vega.github.io/schema/vega/v3.0.json",
                        "width": 300,
                        "height": 1,
                        "padding": 20,
                        "autosize": "none",
                        "data": [
                            {
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
                                ],
                                "format": {
                                    "parse": {
                                        "v": "number",
                                        "u": "date"
                                    }
                                }
                            }
                        ],
                        "scales": [
                            {
                                "name": "xscale",
                                "type": "time",
                                "range": "width",
                                "zero": false,
                                "domain": [
                                    "1/1/2015",
                                    "1/1/2016"
                                ]
                            },
                            {
                                "name": "yscale",
                                "type": "linear",
                                "range": "height",
                                "nice": true,
                                "zero": true,
                                "domain": {
                                    "data": "table",
                                    "field": "v"
                                }
                            }
                        ],
                        "axes": [
                            {
                                "orient": "bottom",
                                "scale": "xscale"
                            }
                        ],
                        "marks": [
                            {
                                "type": "symbol",
                                "from": {
                                    "data": "table"
                                },
                                "encode": {
                                    "enter": {
                                        "x": {
                                            "scale": "xscale",
                                            "field": "u"
                                        },
                                        "y": {
                                            "scale": "yscale",
                                            "value": 0
                                        },
                                        "fill": {
                                            "value": "steelblue"
                                        }
                                    }
                                }
                            }
                        ]
                    }
                },
                {
                    "visual_type": "Vega",
                    "id": "c7a3e94d-c242-46f0-d1a8-aeed896e298f",
                    "group_id": "c6382ae7-977b-7075-8ad3-dd3b1a99d4ae",
                    "source": "Annotation",
                    "width": 500,
                    "height": 100,
                    "x_domain": [
                        "2017-01-25T05:00:00.000Z",
                        "2017-02-01T05:00:00.000Z"
                    ],
                    "y_domain": [
                        0,
                        1
                    ],
                    "is_context": false,
                    "vega_spec": {
                        "$schema": "https://vega.github.io/schema/vega/v3.0.json",
                        "width": 300,
                        "height": 1,
                        "padding": 20,
                        "autosize": "none",
                        "data": [
                            {
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
                                ],
                                "format": {
                                    "parse": {
                                        "v": "number",
                                        "u": "date"
                                    }
                                }
                            }
                        ],
                        "scales": [
                            {
                                "name": "xscale",
                                "type": "time",
                                "range": "width",
                                "zero": false,
                                "domain": [
                                    "1/1/2015",
                                    "1/1/2016"
                                ]
                            },
                            {
                                "name": "yscale",
                                "type": "linear",
                                "range": "height",
                                "nice": true,
                                "zero": true,
                                "domain": {
                                    "data": "table",
                                    "field": "v"
                                }
                            }
                        ],
                        "axes": [
                            {
                                "orient": "bottom",
                                "scale": "xscale"
                            }
                        ],
                        "marks": [
                            {
                                "type": "symbol",
                                "from": {
                                    "data": "table"
                                },
                                "encode": {
                                    "enter": {
                                        "x": {
                                            "scale": "xscale",
                                            "field": "u"
                                        },
                                        "y": {
                                            "scale": "yscale",
                                            "value": 0
                                        },
                                        "fill": {
                                            "value": "steelblue"
                                        }
                                    }
                                }
                            },
                            {
                                "type": "text",
                                "from": {
                                    "data": "table"
                                },
                                "encode": {
                                    "enter": {
                                        "x": {
                                            "scale": "xscale",
                                            "field": "u"
                                        },
                                        "y": {
                                            "scale": "yscale",
                                            "value": 0
                                        },
                                        "fill": {
                                            "value": "steelblue"
                                        },
                                        "text": {
                                            "field": "label"
                                        }
                                    }
                                }
                            }
                        ]
                    }
                }
            ]
        },
        {
            "id": "6c3071b7-8e88-946d-a3eb-07e4327f250e",
            "x_domain": [
                "2017-01-25T05:00:00.000Z",
                "2017-02-01T05:00:00.000Z"
            ],
            "width": 500,
            "brush_spaces": [
                {
                    "visual_type": "Vega",
                    "id": "b94c5503-c5da-f706-e14a-317d00c5317a",
                    "group_id": "6c3071b7-8e88-946d-a3eb-07e4327f250e",
                    "source": "fake",
                    "width": 500,
                    "height": 100,
                    "x_domain": [
                        "2017-01-25T05:00:00.000Z",
                        "2017-02-01T05:00:00.000Z"
                    ],
                    "y_domain": [
                        0,
                        1
                    ],
                    "is_context": true,
                    "vega_spec": {
                        "$schema": "https://vega.github.io/schema/vega/v3.0.json",
                        "width": 300,
                        "height": 1,
                        "padding": 20,
                        "autosize": "none",
                        "data": [
                            {
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
                                ],
                                "format": {
                                    "parse": {
                                        "v": "number",
                                        "u": "date"
                                    }
                                }
                            }
                        ],
                        "scales": [
                            {
                                "name": "xscale",
                                "type": "time",
                                "range": "width",
                                "zero": false,
                                "domain": [
                                    "1/1/2015",
                                    "1/1/2016"
                                ]
                            },
                            {
                                "name": "yscale",
                                "type": "linear",
                                "range": "height",
                                "nice": true,
                                "zero": true,
                                "domain": {
                                    "data": "table",
                                    "field": "v"
                                }
                            }
                        ],
                        "axes": [
                            {
                                "orient": "bottom",
                                "scale": "xscale"
                            }
                        ],
                        "marks": [
                            {
                                "type": "symbol",
                                "from": {
                                    "data": "table"
                                },
                                "encode": {
                                    "enter": {
                                        "x": {
                                            "scale": "xscale",
                                            "field": "u"
                                        },
                                        "y": {
                                            "scale": "yscale",
                                            "value": 0
                                        },
                                        "fill": {
                                            "value": "steelblue"
                                        }
                                    }
                                }
                            }
                        ]
                    }
                },
                {
                    "visual_type": "Vega",
                    "id": "4c20f79a-57cc-9243-a861-a3603d70537e",
                    "group_id": "6c3071b7-8e88-946d-a3eb-07e4327f250e",
                    "source": "Annotation",
                    "width": 500,
                    "height": 100,
                    "x_domain": [
                        "2017-01-29T17:55:05.330Z",
                        "2017-01-30T03:21:01.020Z"
                    ],
                    "y_domain": [
                        0,
                        1
                    ],
                    "is_context": false,
                    "vega_spec": {
                        "$schema": "https://vega.github.io/schema/vega/v3.0.json",
                        "width": 300,
                        "height": 1,
                        "padding": 20,
                        "autosize": "none",
                        "data": [
                            {
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
                                ],
                                "format": {
                                    "parse": {
                                        "v": "number",
                                        "u": "date"
                                    }
                                }
                            }
                        ],
                        "scales": [
                            {
                                "name": "xscale",
                                "type": "time",
                                "range": "width",
                                "zero": false,
                                "domain": [
                                    "1/1/2015",
                                    "1/1/2016"
                                ]
                            },
                            {
                                "name": "yscale",
                                "type": "linear",
                                "range": "height",
                                "nice": true,
                                "zero": true,
                                "domain": {
                                    "data": "table",
                                    "field": "v"
                                }
                            }
                        ],
                        "axes": [
                            {
                                "orient": "bottom",
                                "scale": "xscale"
                            }
                        ],
                        "marks": [
                            {
                                "type": "symbol",
                                "from": {
                                    "data": "table"
                                },
                                "encode": {
                                    "enter": {
                                        "x": {
                                            "scale": "xscale",
                                            "field": "u"
                                        },
                                        "y": {
                                            "scale": "yscale",
                                            "value": 0
                                        },
                                        "fill": {
                                            "value": "steelblue"
                                        }
                                    }
                                }
                            },
                            {
                                "type": "text",
                                "from": {
                                    "data": "table"
                                },
                                "encode": {
                                    "enter": {
                                        "x": {
                                            "scale": "xscale",
                                            "field": "u"
                                        },
                                        "y": {
                                            "scale": "yscale",
                                            "value": 0
                                        },
                                        "fill": {
                                            "value": "steelblue"
                                        },
                                        "text": {
                                            "field": "label"
                                        }
                                    }
                                }
                            }
                        ]
                    }
                },
                {
                    "visual_type": "Vega",
                    "id": "a5c672e7-eb51-7049-3a7a-4a45dbbda092",
                    "group_id": "6c3071b7-8e88-946d-a3eb-07e4327f250e",
                    "source": "ParticleEvent",
                    "width": 500,
                    "height": 150,
                    "x_domain": [
                        "2017-01-29T17:55:05.330Z",
                        "2017-01-30T03:21:01.020Z"
                    ],
                    "y_domain": [
                        0,
                        1
                    ],
                    "is_context": false,
                    "vega_spec": {
                        "$schema": "https://vega.github.io/schema/vega/v3.0.json",
                        "width": 300,
                        "height": 150,
                        "padding": {
                            "top": 10,
                            "left": 20,
                            "bottom": 20,
                            "right": 20
                        },
                        "autosize": "none",
                        "data": [
                            {
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
                                ],
                                "format": {
                                    "parse": {
                                        "v": "number",
                                        "u": "date"
                                    }
                                }
                            }
                        ],
                        "scales": [
                            {
                                "name": "xscale",
                                "type": "time",
                                "range": "width",
                                "zero": false,
                                "domain": [
                                    "1/1/2015",
                                    "1/1/2016"
                                ]
                            },
                            {
                                "name": "yscale",
                                "type": "linear",
                                "range": "height",
                                "nice": true,
                                "zero": true,
                                "domain": {
                                    "data": "table",
                                    "field": "v"
                                }
                            }
                        ],
                        "axes": [
                            {
                                "orient": "bottom",
                                "scale": "xscale"
                            },
                            {
                                "orient": "left",
                                "scale": "yscale"
                            }
                        ],
                        "marks": [
                            {
                                "type": "area",
                                "from": {
                                    "data": "table"
                                },
                                "encode": {
                                    "enter": {
                                        "x": {
                                            "scale": "xscale",
                                            "field": "u"
                                        },
                                        "y": {
                                            "scale": "yscale",
                                            "field": "v"
                                        },
                                        "y2": {
                                            "scale": "yscale",
                                            "value": 0
                                        },
                                        "fill": {
                                            "value": "steelblue"
                                        }
                                    }
                                }
                            }
                        ]
                    }
                }
            ]
        }
    ]
}`;
