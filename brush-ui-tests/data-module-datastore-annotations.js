var startAndEndQuery_Annotations = {
  "query": {
      "kind": [
          {
              "name": "Annotation"
          }
      ],
      "filter": {
          "compositeFilter": {
              "filters": [
                  {
                      "propertyFilter": {
                          "property": {
                              "name": "timestamp"
                          },
                          "op": "LESS_THAN",
                          "value": {
                              "timestampValue": "2017-02-06T19:10:34.372999Z"
                          }
                      }
                  },
                  {
                      "propertyFilter": {
                          "property": {
                              "name": "timestamp"
                          },
                          "value": {
                              "timestampValue": "2017-01-01T19:07:51.476999Z"
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

class DataModuleGoogleDatastoreAnnotations extends DataModule {
    fetch_data(e) {
        var that = this;
        let fetchData = startAndEndQuery_Annotations;
        fetchData.query.filter.compositeFilter.filters[0].propertyFilter.value.timestampValue = e.domain[1].toISOString();
        fetchData.query.filter.compositeFilter.filters[1].propertyFilter.value.timestampValue = e.domain[0].toISOString();

        gapi.client.datastore.projects.runQuery({
            projectId: 'photon-data-collection',
            query: fetchData.query
        }).then(function(response) {
            const data = response.result;
            that.data = [];

            if (data.batch.entityResults) {
                for (let x of data.batch.entityResults) {
                    var t = new Date(x.entity.properties.timestamp.timestampValue);
                    // t = d3.isoFormat(t);
                    that.data.push({"u": t,
                                    "v": 0,
                                    "label": x.entity.properties.value.stringValue});
                }
                that.scale.domain(e.domain);
                that.get_data(e);
            } else {
                console.log("no data");
            }
        });
    }
}
