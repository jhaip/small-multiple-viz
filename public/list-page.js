var dispatch = d3.dispatch("brushchange",
                           "hoverchange",
                           "statechange",
                           "savedata--Annotation",
                           "delete-brush-space-group",
                           "delete-brush-space");
var dmMaster = undefined;

function fetchScreensList() {
    return firebase.database().ref('/screens-list').once('value').then(function(snapshot) {
        var screensList = snapshot.val();
        d3.select(".screen-list")
            .selectAll("screen-list--item")
            .data(d3.entries(screensList))
            .enter().append("div")
            .attr("class", "screen-list--item")
            .text(function(d) { return d.value; })
            .on("click", function(d) {
                window.location = "./?screen="+d.value;
            });
    });
}

function fetchBrushSpaceGroupList() {
    return firebase.database().ref('/brush_space_groups').once('value').then(function(snapshot) {
        var collection = snapshot.val();
        for (var i in collection) {
            var notes = collection[i].notes || "";
            console.log(collection[i]);
            var sourcesHTML = "";
            for (var j in collection[i].brush_spaces) {
                var bs = collection[i].brush_spaces[j];
                sourcesHTML += `<li><strong>${bs.source}</strong>: ${bs.visual_type}</li>`;
            }
            if (sourcesHTML === "") {
                sourcesHTML = "<li>No Visuals</li>";
            }
            dmMaster.fetch_data("TestNotes", [], false, {group_id: collection[i].id}).done(function(notes) {
                d3.select(".brush-space-group-list").append("div")
                    .attr("class", "brush-space-group-list--item")
                    .html(`<p>${collection[i].x_domain[0]} - ${collection[i].x_domain[1]}</p>
                           <h3>Test</h4>
                           <small>${collection[i].id}</small>
                           <h4>Visuals:</h4>
                           <ol>${sourcesHTML}</ol>
                           <h4>Notes:</h4>
                           <p>${notes}</p>`);
            }).fail(function(e) {
                console.log("Error fetching data from "+this.id+" for source "+this.source);
            });
        }
    });
}

function init() {
    dmMaster = new DataModuleMaster(dispatch);
    fetchScreensList();
    fetchBrushSpaceGroupList();
}

(function(gapi) {
    function start() {
      // 2. Initialize the JavaScript client library.
      gapi.client.init({
        'apiKey': 'AIzaSyD1qRhXFoSvC8Wj0oZ_Ww5WLJxptt-HTgE',
        'discoveryDocs': ['https://datastore.googleapis.com/$discovery/rest?version=v1'],
        // clientId and scope are optional if auth is not required.
        'clientId': '378739939891-k9hivlpuamla964gs2hpbu52ckpgocp0.apps.googleusercontent.com',
        'scope': 'https://www.googleapis.com/auth/datastore',
      }).then(function() {
          console.log("Google Ready!");
          init();
      });
    }
    gapi.load('client', start);
})(gapi);
