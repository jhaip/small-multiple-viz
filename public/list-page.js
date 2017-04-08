function fetchScreensList() {
    return firebase.database().ref('/screens-list').once('value').then(function(snapshot) {
        var screensList = snapshot.val();
        for (var i in screensList) {
            d3.select(".screen-list").append("div")
                .attr("class", "screen-list--item")
                .text(screensList[i]);
        }
    });
}

function fetchBrushSpaceGroupList() {
    return firebase.database().ref('/brush_space_groups').once('value').then(function(snapshot) {
        var screensList = snapshot.val();
        for (var i in screensList) {
            d3.select(".brush-space-group-list").append("div")
                .attr("class", "brush-space-group-list--item")
                .text(screensList[i].id);
        }
    });
}

function init() {
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
