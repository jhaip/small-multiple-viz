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

    gapi.client.datastore.projects.runQuery({
      projectId: 'photon-data-collection',
      query: fetchData.query
    }).then(function(response) {
      console.log(response.result);
      const data = response.result;

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

    }, function(reason) {
      console.log('Error: ' + reason.result.error.message);
      alert('Error: ' + reason.result.error.message);
      alert('Redirecting to login page');
      window.location.href = '/auth.html';
    });
}

function start() {
  // 2. Initialize the JavaScript client library.
  gapi.client.init({
    'apiKey': 'AIzaSyD1qRhXFoSvC8Wj0oZ_Ww5WLJxptt-HTgE',
    'discoveryDocs': ['https://datastore.googleapis.com/$discovery/rest?version=v1'],
    // clientId and scope are optional if auth is not required.
    'clientId': '378739939891-k9hivlpuamla964gs2hpbu52ckpgocp0.apps.googleusercontent.com',
    'scope': 'https://www.googleapis.com/auth/datastore',
  }).then(function() {
    fetchSavedData();
  });
};

gapi.load('client', start);
