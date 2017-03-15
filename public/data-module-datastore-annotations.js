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
    constructor(dispatch, source) {
        super(dispatch, source);

        var that = this;
        this.dispatch.on("savedata--"+this.source, function(e) {
            that.save_data(e);
        });
    }
    fetch_data(e, defer) {
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
                that.get_data(e, defer);
            } else {
                console.log("no data");
            }
        });
    }
    beginTransaction(success_callback) {
        gapi.client.datastore.projects.beginTransaction({
            projectId: 'photon-data-collection'
        }).then(function(response) {
            console.log(response.result);
            if (response.result.transaction) {
                success_callback(response.result.transaction);
            }
        }, function(reason) {
            console.log('Error: ' + reason.result.error.message);
        });
    }
    commitTransaction(transaction_id, mutations, success_callback) {
        gapi.client.datastore.projects.commit({
            projectId: 'photon-data-collection',
            transaction: transaction_id,
            mutations: mutations
        }).then(function(response) {
            success_callback(response.result);
        }, function(reason) {
            console.log('Error: ' + reason.result.error.message);
        });
    }
    save_data(e) {
        var mutations = [{
            "insert": {
                "key": {
                    "partitionId": {
                        "projectId": "photon-data-collection"
                    },
                    "path": [
                        {
                            "kind": "Annotation"
                        }
                    ]
                },
                "properties": {
                    "type": {
                        "stringValue": "markdown"
                    },
                    "value": {
                        "stringValue": "# Hello World"
                    },
                    "timestamp": {
                        "timestampValue": "2017-01-29T16:50:29.698Z"
                    }
                }
            }
        }];
        mutations[0].insert.properties.timestamp.timestampValue = e.timestamp.toISOString();
        mutations[0].insert.properties.value.stringValue = e.text;

        var that = this;
        that.beginTransaction(function(transaction_id) {
            that.commitTransaction(transaction_id, mutations, function(result) {
                console.log(result);
                console.log("not refetching data because it is cached locally");
            });
        });
    }
}
