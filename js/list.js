// fetch test lists from google
fetchData = {
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
          "name": "data"
        },
        "value":
        {
          "stringValue": "START"
        },
        "op": "EQUAL"
      }
    }
  }
};
// fetchData = {
//   "query":
//   {
//     "kind":
//     [
//       {
//         "name": "ParticleEvent"
//       }
//     ]
//   }
// };
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
}).fail(function(error) {
    console.error(error);
});