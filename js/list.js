function start() {
  // 2. Initialize the JavaScript client library.
  gapi.client.init({
    'apiKey': 'AIzaSyD1qRhXFoSvC8Wj0oZ_Ww5WLJxptt-HTgE',
    'discoveryDocs': ['https://datastore.googleapis.com/$discovery/rest?version=v1'],
    // clientId and scope are optional if auth is not required.
    'clientId': '378739939891-k9hivlpuamla964gs2hpbu52ckpgocp0.apps.googleusercontent.com',
    'scope': 'https://www.googleapis.com/auth/datastore',
  }).then(function() {
    return gapi.client.datastore.projects.runQuery({
      projectId: 'photon-data-collection',
      query: {
        "kind": [{"name": "ParticleEvent"}],
        "filter": {
            "propertyFilter": {
                "property": {
                    "name": "data"
                },
                "value": {
                    "stringValue": "START"
                },
                "op": "EQUAL"
            }
        }
      }
    });
  }).then(function(response) {
    console.log(response.result);
    const data = response.result;
    const nTests = data.batch.entityResults.length;
    const $parent = $(".test-run-list");

    let startTimesList = [];
    for (let x of data.batch.entityResults) {
        startTimesList.push(new Date(x.entity.properties.published_at.timestampValue));
    }
    startTimesList.sort();

    for (let i = 0; i<startTimesList.length; i++) {
        var startDateStr = startTimesList[i].toISOString();
        let url = "/index.html?start="+startDateStr+"&i="+i;
        if (i < startTimesList.length-1) {
            url += "&stop="+startTimesList[i+1].toISOString();;
        }
        let $newEl = $("<a></a>").attr("href", url).text("Test "+i+" at "+url);
        $newEl = $("<li></li>").append($newEl);
        $parent.append($newEl);
    }
  }, function(reason) {
    console.log('Error: ' + reason.result.error.message);
    alert('Error: ' + reason.result.error.message);
    alert('Redirecting to login page');
    window.location.href = '/auth.html';
  });
};

gapi.load('client', start);
