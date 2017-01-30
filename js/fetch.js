var startOnlyQuery = {
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
      "propertyFilter":
      {
        "property":
        {
          "name": "published_at"
        },
        "value":
        {
          "timestampValue": "2017-01-29T16:50:29.698Z"
        },
        "op": "GREATER_THAN"
      }
    }
  }
};

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

// via http://stackoverflow.com/questions/901115/how-can-i-get-query-string-values-in-javascript
function getParameterByName(name, url) {
    if (!url) {
      url = window.location.href;
    }
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

function fetchSavedData(longPollStartTime) {
    let startDateStr = getParameterByName('start');
    let endDateStr = getParameterByName('stop');
    let i = getParameterByName('i');
    let oldestDataTime;

    let fetchData;
    if (endDateStr) {
        fetchData = startAndEndQuery;
        fetchData.query.filter.compositeFilter.filters[0].propertyFilter.value.timestampValue = endDateStr;
        fetchData.query.filter.compositeFilter.filters[1].propertyFilter.value.timestampValue = startDateStr;
    } else {
        fetchData = startOnlyQuery;
        if (longPollStartTime === undefined) {
            fetchData.query.filter.propertyFilter.value.timestampValue = startDateStr;
        } else {
            fetchData.query.filter.propertyFilter.value.timestampValue = longPollStartTime.toISOString();;
            oldestDataTime = longPollStartTime;
        }
    }

    var r = ajaxFetch(fetchData);
    r.done(function(data) {
        if (data.batch.entityResults) {
            const nTests = data.batch.entityResults.length;
            for (let x of data.batch.entityResults) {
                if (x.entity.properties.data.stringValue !== "START") {
                    var t = new Date(x.entity.properties.published_at.timestampValue);
                    if (oldestDataTime === undefined || t > oldestDataTime) {
                        oldestDataTime = t;
                    }
                    t = d3.isoFormat(t);
                    addNewDataPoint("A0", parseInt(x.entity.properties.data.integerValue), t);
                } else {
                    console.log("START value not supposed to be included");
                }
            }
        } else {
            console.log("no data");
        }

        // long polling
        if (!endDateStr) {
            console.log("starting log polling");
            setTimeout(function() {
                console.log("looking for new data");
                fetchSavedData(oldestDataTime);
            }, 1000);
        }

    }).fail(function(error) {
        console.error(error);
    });
}

function ajaxFetch(requestData) {
    return $.ajax({
        url: "https://datastore.googleapis.com/v1/projects/photon-data-collection:runQuery?fields=batch%2Cquery&key=AIzaSyD-a9IF8KKYgoC3cpgS-Al7hLQDbugrDcw&alt=json",
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer ya29.GlzjA6GAUB7g-pKzXzDulU3qJpiQiaUs6WQwIWj9WGjyGY7B5xMvdn4CizX2UUX9qkRjPPgfj3nGqwG-JAMW6l3QfND56Ycox4FhI7Sl04sHvAJQxJoa-5dFUIz4tw"
        },
        dataType: "json",
        data: JSON.stringify(requestData)
    });
}

fetchSavedData();
