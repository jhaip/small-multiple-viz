var savedDescription = `{
    "id": "6ccdec24-722c-a8e6-11c9-cfbe5da8892c",
    "default_domain": [
        "2017-01-25T05:00:00.000Z",
        "2017-02-01T05:00:00.000Z"
    ],
    "brush_space_groups": [
        {
            "id": "f999deaa-4b87-84e0-6be7-d7166643450a",
            "x_domain": [
                "2017-01-25T05:00:00.000Z",
                "2017-02-01T05:00:00.000Z"
            ],
            "width": 500,
            "brush_spaces": [
                {
                    "visual_type": "Vega",
                    "id": "1885a7c0-9603-5bf1-1f82-3d37e6d29661",
                    "group_id": "f999deaa-4b87-84e0-6be7-d7166643450a",
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
                    "id": "a064584c-3c0c-5ab9-8eeb-d7e301de4f96",
                    "group_id": "f999deaa-4b87-84e0-6be7-d7166643450a",
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
            "id": "3ce234e8-8594-8d8a-d38c-b654c34b2cde",
            "x_domain": [
                "2017-01-25T05:00:00.000Z",
                "2017-02-01T05:00:00.000Z"
            ],
            "width": 500,
            "brush_spaces": [
                {
                    "visual_type": "Vega",
                    "id": "8485ef5d-9f6c-4dd5-36fe-2f1595b521bd",
                    "group_id": "3ce234e8-8594-8d8a-d38c-b654c34b2cde",
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
                    "brush_domain": [
                        "2017-01-29T16:44:20.869Z",
                        "2017-01-30T05:31:18.260Z"
                    ],
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
                    "id": "965a7f53-fa33-4011-e629-ffccb8314f9a",
                    "group_id": "3ce234e8-8594-8d8a-d38c-b654c34b2cde",
                    "source": "Annotation",
                    "width": 500,
                    "height": 100,
                    "x_domain": [
                        "2017-01-29T16:44:20.869Z",
                        "2017-01-30T05:31:18.260Z"
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
                    "id": "4cf92eb4-88e4-7abc-521c-0b47e3937c37",
                    "group_id": "3ce234e8-8594-8d8a-d38c-b654c34b2cde",
                    "source": "ParticleEvent",
                    "width": 500,
                    "height": 150,
                    "x_domain": [
                        "2017-01-29T16:44:20.869Z",
                        "2017-01-30T05:31:18.260Z"
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
