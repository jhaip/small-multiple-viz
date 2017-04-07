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

class DataModuleGoogleDatastore extends DataModule {
    fetch_data(e, defer) {
        var that = this;
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
                        var v = "COULDN'T PARSE";
                        if ("integerValue" in x.entity.properties.data) {
                            v = parseInt(x.entity.properties.data.integerValue);
                        } else if ("stringValue" in x.entity.properties.data) {
                            v = parseInt(x.entity.properties.data.stringValue);
                        }
                        that.data.push({"u": t, "v": v});
                    }
                }
                that.scale.domain(e.domain);
                that.get_data(e, defer);
            } else {
                console.log("no data");
            }
        });
    }
}
