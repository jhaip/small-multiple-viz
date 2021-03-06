var dispatch = d3.dispatch("brushchange",
                           "hoverchange",
                           "statechange",
                           "savedata--Annotation");
var update_count = 0;
var myScreen;
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

$("#addTime").click(function() {
    myScreen.add_time();
});

$("#btn-add-group").click(function() {
    createBrushSpaces(dmMaster);
    newBrushSpaceGroupOption = myScreen.brushSpaceGroups.length-1;
    $("#dropdownAddNewVisualToGroup").append($('<option>', {
        value: newBrushSpaceGroupOption,
        text: newBrushSpaceGroupOption
    }));
});

$("#vegaSpec").text(JSON.stringify(vegaSpec__Area, undefined, 4));
$("#submitAddVisual").click(function() {
    var targetGroup = $("#dropdownAddNewVisualToGroup").val();
    var dataSource = $("#sources-list").val();
    var visualType = $("#dropdownVisualTypes").val();
    var newBrushSpaceJSONDescription = {
        "visual_type": visualType,
        "source": dataSource,
        "height": 150,
        "is_context": false
    };
    if (visualType === "Vega") {
        var newVegaSpec = JSON.parse($("#vegaSpec").val());
        newBrushSpaceJSONDescription["vega_spec"] = newVegaSpec;
    }

    myScreen.add_brush_space(targetGroup, newBrushSpaceJSONDescription);

    $('#newVisualModal').modal('hide');
});

function createBrushSpaces(dmMaster) {
    var newTargetGroup = myScreen.add_brush_space_group();
    myScreen.add_brush_space(newTargetGroup, {
        "visual_type": "Vega",
        "source": "fake",
        "height": 100,
        "is_context": true,
        "vega_spec": vegaSpec__NoYDots
    });
    myScreen.add_brush_space(newTargetGroup, {
        "visual_type": "Vega",
        "source": "Annotation",
        "height": 100,
        "is_context": false,
        "vega_spec": vegaSpec__NoYDotsText
    });
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
          myScreen = new Screen(dispatch,
                                d3.select(".visual-blocks"),
                                // {
                                //     "id": "6ccdec24-722c-a8e6-11c9-cfbe5da8892c",
                                //     "default_domain": [
                                //         "2017-01-25T05:00:00.000Z",
                                //         "2017-02-01T05:00:00.000Z"
                                //     ],
                                //     "brush_space_groups": []
                                // });
                                JSON.parse(savedDescription));
          // createBrushSpaces(dmMaster);
      });
    }
    gapi.load('client', start);
})(gapi);
