var dispatch = d3.dispatch("brushchange",
                           "brushchange-request",
                           "hoverchange",
                           "statechange",
                           "fetchdata",
                           "newdata");
// var parent = d3.select(".visual-block");  // some weird bug that messes up gapi
var updating = true;
var update_count = 0;
var brushSpaces = [];
var state = "";

function guid() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
    s4() + '-' + s4() + s4() + s4();
}

dispatch.on("brushchange-request", function(e) {
    if (updating === false) {
        updating = true;
        dispatch.call("brushchange", {}, e);
        dispatch.call("fetchdata", {}, e);
        updating = false;
    }
});

for (var i = 0; i < 2; i+=1) {
    let isContext = (i === 0);
    brushSpaces.push(new BrushSpace(dispatch, d3.select(".visual-block"), i, isContext));
}
brushSpaces.push(new BrushSpaceVega(dispatch, d3.select(".visual-block"), 3, false));
updating = false;

function change_state(newState) {
    state = newState;
    if (state === "") {
        d3.select(".state").text("");
        d3.select("body").style("cursor", "auto");
    } else if (state === "annotation") {
        d3.select(".state").text("Annotation");
        d3.select("body").style("cursor", "alias");
    } else if (state === "post-annotation") {
        d3.select(".state").text("Post Annotation");
        d3.select("body").style("cursor", "auto");
    }
    dispatch.call("statechange", {}, {state: state});
}

d3.select("body").on("keydown", function() {
    if (state === "") {
        if (d3.event.keyCode === 65) {
            change_state("annotation");
        }
    } else if (state === "post-annotation") {
        if (d3.event.keyCode === 27) {
            change_state("");
        }
    }
}).on("keyup", function() {
    if (state === "") {
        if (d3.event.keyCode === 65) {
            change_state("");
        }
    }
});

var globalTimeDomain = d3.scaleTime().domain([new Date(2017, 0, 25), new Date(2017, 1, 1)]);
var that = this;

function dispatch_global_domain() {
    this.dispatch.call("brushchange-request", {}, {
        range: [0,1],
        domain: globalTimeDomain.domain(),
        source: "",
        iscontext: false
    });
}

$("#addTime").click(function() {
    var newDomain = [globalTimeDomain.domain()[0], new Date(globalTimeDomain.domain()[1].getTime()+1000*60*60*24*30)];
    globalTimeDomain.domain(newDomain);
    dispatch_global_domain();
});

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
          var dmFake = new DataModule(dispatch, "fake");
          var dm = new DataModuleGoogleDatastore(dispatch, "ParticleEvent");
          dispatch_global_domain();
      });
    }
    gapi.load('client', start);
})(gapi);
