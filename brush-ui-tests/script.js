var dispatch = d3.dispatch("brushchange",
                           "brushchange-request",
                           "hoverchange",
                           "statechange",
                           "savedata--Annotation");
// var parent = d3.select(".visual-block");  // some weird bug that messes up gapi
var updating = true;
var update_count = 0;
var brushSpaceGroups = [];
var state = "";
var dmMaster = undefined;

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
        updating = false;
    }
});

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

$("#addTime").click(function() {
    var newDomain = [globalTimeDomain.domain()[0], new Date(globalTimeDomain.domain()[1].getTime()+1000*60*60*24*30)];
    globalTimeDomain.domain(newDomain);
    brushSpaceGroups[0].update_domain(newDomain);
});

$("#btn-add-group").click(function() {
    updating = true;
    createBrushSpaces(dmMaster);
    updating = false;
    brushSpaceGroups[brushSpaceGroups.length-1].update_domain(globalTimeDomain.domain());
    $("#dropdownAddNewVisualToGroup").append($('<option>', {
        value: brushSpaceGroups.length-1,
        text: brushSpaceGroups.length-1
    }));
});

$("#vegaSpec").text(JSON.stringify(vegaSpec__Area, undefined, 4));
$("#submitAddVisual").click(function() {
    var targetGroup = $("#dropdownAddNewVisualToGroup").val();
    var dataSource = $("#sources-list").val();
    var visualType = $("#dropdownVisualTypes").val();
    var newVegaSpec = JSON.parse($("#vegaSpec").val());
    console.log(targetGroup);
    console.log(dataSource);
    console.log(visualType);
    console.log(newVegaSpec);

    updating = true;
    groupsToAddVisualTo = [];
    if (targetGroup === "All Groups") {
        for (let i=0; i<brushSpaceGroups.length; i+=1) {
            brushSpaceGroups[i].add_brush_space("Vega", 150, dataSource, false, newVegaSpec);
        }
        updating = false;
        for (let i=0; i<brushSpaceGroups.length; i+=1) {
            brushSpaceGroups[i].update_domain(globalTimeDomain.domain());
        }
    } else {
        targetGroup = parseInt(targetGroup);
        brushSpaceGroups[targetGroup].add_brush_space("Vega", 150, dataSource, false, newVegaSpec);
        updating = false;
        brushSpaceGroups[targetGroup].update_domain(globalTimeDomain.domain());
    }

    $('#newVisualModal').modal('hide');
});

function createBrushSpaces(dmMaster) {
    var newBrushSpaceGroup = new BrushSpaceGroup(dispatch, d3.select(".visual-blocks"), guid(), globalTimeDomain.domain());
    newBrushSpaceGroup.add_brush_space("Vega", 100, "fake", true, vegaSpec__NoYDots);
    newBrushSpaceGroup.add_brush_space("Vega", 100, "Annotation", false, vegaSpec__NoYDotsText);
    newBrushSpaceGroup.add_brush_space("Textual Log", 400, "GithubCommits", false, undefined);
    brushSpaceGroups.push(newBrushSpaceGroup);
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
          dmMaster = new DataModuleMaster(dispatch);
          createBrushSpaces(dmMaster);
          updating = false;
          brushSpaceGroups[0].update_domain(globalTimeDomain.domain());
      });
    }
    gapi.load('client', start);
})(gapi);
