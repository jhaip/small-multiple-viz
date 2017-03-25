var dispatch = d3.dispatch("brushchange",
                           "hoverchange",
                           "statechange",
                           "savedata--Annotation");
var update_count = 0;
var myScreen;
var state = "";
var dmMaster = undefined;
var selectedScreenId = undefined;
var selectedScreenListKey = undefined;

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

// $("#addTime").click(function() {
//     myScreen.add_time();
//     saveScreenDescription();
// });

$("#saveScreenDescription").click(function() {
    saveScreenDescription();
});

$("#btn-add-group").click(function() {
    createBrushSpaces(dmMaster);
    // newBrushSpaceGroupOption = myScreen.brushSpaceGroups.length-1;
    // $("#dropdownAddNewVisualToGroup").append($('<option>', {
    //     value: newBrushSpaceGroupOption,
    //     text: newBrushSpaceGroupOption
    // }));
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

    saveScreenDescription();

    $('#newVisualModal').modal('hide');
});

function createBrushSpaces(dmMaster) {
    console.log("create brush spaces");
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

    saveScreenDescription();
}

function saveScreenDescription() {
    var screenDescription = myScreen.toJSON();
    var updates = {};
    updates['/screens/' + selectedScreenId] = screenDescription;
    return firebase.database().ref().update(updates);
}

function fetchScreensList() {
    return firebase.database().ref('/screens-list').once('value').then(function(snapshot) {
        var screensList = snapshot.val();
        var selectScreenYet = false;
        for (var i in screensList) {
            if (selectScreenYet === false) {
                fetchAndShowScreen(screensList[0], i);
                selectScreenYet = true;
            }
            $("#screenSelectionDropdown").append($('<option>', {
                value: screensList[i],
                text : `Screen ${i}`,
                'data-list-key': i
            }));
        }
        $("#screenSelectionDropdown").change(function(e) {
            fetchAndShowScreen($(this).val(), $(this).find(":selected").data("list-key"));
        });
        $("#addNewScreen").click(function() {
            var newScreenId = guid();
            var newPostRef = firebase.database().ref('/screens-list').push();
            var newScreenListKey = newPostRef.key;
            newPostRef.set(newScreenId);

            firebase.database().ref('/screens/' + newScreenId).set({
                id: newScreenId,
                default_domain: ["2017-01-25T05:00:00.000Z", "2017-03-03T05:00:00.000Z"],
                small_multiples: []
            }).then(function() {
                $("#screenSelectionDropdown").append($('<option>', {
                    value: newScreenId,
                    text : `Screen ${newScreenListKey}`,
                    "data-list-key": newScreenListKey
                }));
                $("#screenSelectionDropdown").val(newScreenId);

                fetchAndShowScreen(newScreenId, newScreenListKey);
            });
        });
        $("#removeCurrentScreen").click(function() {
            firebase.database().ref('/screens-list/'+selectedScreenListKey).remove().then(function() {
                firebase.database().ref('/screens/'+selectedScreenId).remove().then(function() {
                    location.reload();
                });
            });
        });
    });
}

function fetchAndShowScreen(screenId, screenListKey) {
    d3.select(".visual-blocks").html("");
    selectedScreenId = screenId;
    selectedScreenListKey = screenListKey;
    return firebase.database().ref('/screens/' + screenId).once('value').then(function(snapshot) {
        var savedDescription = snapshot.val();
        dmMaster = new DataModuleMaster(dispatch);
        myScreen = new Screen(dispatch,
                              d3.select(".visual-blocks"),
                              savedDescription);
    });
}

function init() {
    fetchScreensList();
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
