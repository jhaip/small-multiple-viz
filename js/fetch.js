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

function fetchSavedData() {
    let startDateStr = getParameterByName('start');
    let endDateStr = getParameterByName('stop');
    let i = getParameterByName('i');

    let fetchData;
    if (endDateStr) {
        fetchData = startAndEndQuery;
        fetchData.query.filter.compositeFilter.filters[0].propertyFilter.value.timestampValue = endDateStr;
        fetchData.query.filter.compositeFilter.filters[1].propertyFilter.value.timestampValue = startDateStr;
    } else {
        fetchData = startOnlyQuery;
        fetchData.query.filter.propertyFilter.value.timestampValue = startDateStr;
    }

    $.ajax({
        url: "https://datastore.googleapis.com/v1/projects/photon-data-collection:runQuery?fields=batch%2Cquery&key=AIzaSyD-a9IF8KKYgoC3cpgS-Al7hLQDbugrDcw&alt=json",
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer ya29.GlziA_oevtgdq8xlg0TKVGlsDJSm-mQX_X2G9Vm0Fg_9PUrZesYVw4O40dD6bhXI8TGtN0Eq6gB40uhZIBXxO0AmJX2No-YNPX9P-dY7v75zUvRvFVS9Jvl1O-wRWA"
        },
        dataType: "json",
        data: JSON.stringify(fetchData)
    }).done(function(data) {
        const nTests = data.batch.entityResults.length;
        for (let x of data.batch.entityResults) {
            if (x.entity.properties.data.stringValue !== "START") {
                var t = new Date(x.entity.properties.published_at.timestampValue);
                t = d3.isoFormat(t);
                addNewDataPoint("A0", parseInt(x.entity.properties.data.integerValue), t);
            } else {
                console.log("START value not supposed to be included");
            }
        }
    }).fail(function(error) {
        console.error(error);
    });
}

fetchSavedData();
