var startAndEndQuery = {
  "query":
  {
    "kind":
    [
      {
        "name": "ParticleEvent"
      }
    ],
    "filter":
    {
      "compositeFilter":
      {
        "filters":
        [
          {
            "propertyFilter":
            {
              "property":
              {
                "name": "published_at"
              },
              "op": "LESS_THAN",
              "value":
              {
                "timestampValue": "2017-01-29T19:10:34.372999Z"
              }
            }
          },
          {
            "propertyFilter":
            {
              "property":
              {
                "name": "published_at"
              },
              "value":
              {
                "timestampValue": "2017-01-29T19:07:51.476999Z"
              },
              "op": "GREATER_THAN"
            }
          }
        ],
        "op": "AND"
      }
    }
  }
};

class DataModule {
    constructor(dispatch, source) {
        this.dispatch = dispatch;
        this.data = [];
        this.source = source;
        this.scale = d3.scaleTime();

        var that = this;

        this.dispatch.on("fetchdata", function(e) {
            that.get_data(e);
        });
    }
    fetch_data(e) {
        var that = this;
        if (this.source === "fake") {
            setTimeout(function() {
                that.data = [
                    {"u": "Jan 1 2015",  "v": 28},
                    {"u": "Mar 1 2015",  "v": 55},
                    {"u": "May 1 2015",  "v": 28},
                    {"u": "Jul 1 2015",  "v": 91},
                    {"u": "Aug 1 2015",  "v": 28},
                    {"u": "Jan 1 2016",  "v": 53}
                ];
                that.scale.domain(e.domain);
                that.get_data(e);
            }, 1000);
        } else if (this.source === "ParticleEvent") {
            let fetchData = startAndEndQuery;
            fetchData.query.filter.compositeFilter.filters[0].propertyFilter.value.timestampValue = e.domain[1].toISOString();
            fetchData.query.filter.compositeFilter.filters[1].propertyFilter.value.timestampValue = e.domain[0].toISOString();

            gapi.client.datastore.projects.runQuery({
                projectId: 'photon-data-collection',
                query: fetchData.query
            }).then(function(response) {
                const data = response.result;
                that.data = [];

                if (data.batch.entityResults) {
                    const nTests = data.batch.entityResults.length;
                    for (let x of data.batch.entityResults) {
                        if (x.entity.properties.data.stringValue !== "START") {
                            var t = new Date(x.entity.properties.published_at.timestampValue);
                            t = d3.isoFormat(t);
                            that.data.push({"u": t, "v": parseInt(x.entity.properties.data.integerValue)});
                        }
                    }
                    that.scale.domain(e.domain);
                    that.get_data(e);
                } else {
                    console.log("no data");
                }
            });
        }
    }
    get_data(e) {
        if (this.data.length === 0 || e.domain[0] < this.scale.domain()[0] || e.domain[1] > this.scale.domain()[1]) {
            console.log("outside range! should be fetching new data");
            this.fetch_data(e);
            return;
        }

        var dataInDomain = [];
        var startIndex = 0;
        var endIndex = this.data.length-1;
        for (var i=0; i<this.data.length-1; i+=1) {
            var dDate = new Date(this.data[i].u);
            if (dDate <= e.domain[0]) {
                startIndex = i;
            } else {
                break;
            }
        }
        for (var i=this.data.length-1; i>0; i-=1) {
            var dDate = new Date(this.data[i].u);
            if (dDate >= e.domain[1]) {
                endIndex = i;
            } else {
                break;
            }
        }
        if (this.data.length > 0 && this.scale.domain()[0] <= e.domain[1] && this.scale.domain()[1] >= e.domain[0]) {
            dataInDomain = this.data.slice(startIndex, endIndex+1);
        }

        this.dispatch.call("newdata", {}, {
            data: dataInDomain
        });
    }
}
