var dispatch = d3.dispatch("brushchange",
                           "hoverchange",
                           "statechange",
                           "savedata--Annotation",
                           "delete-brush-space-group",
                           "delete-brush-space");
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

$("#saveScreenDescription").click(function() {
    saveScreenDescription();
});

$("#btn-new-group").click(function() {
    myScreen.add_brush_space_group();
    saveScreenDescription();
});

$("#btn-add-group").click(function() {
    d3.select(".brush-space-group-list").html("");
    fetchBrushSpaceGroupList();
});

function add_existing_brush_space_group_to_current_scene(description) {
    console.log(description);
    myScreen.add_brush_space_group(description);
    saveScreenDescription();
}

function add_brush_space_group_to_list(collection_item) {
    var sourcesHTML = "";
    for (var j in collection_item.brush_spaces) {
        var bs = collection_item.brush_spaces[j];
        sourcesHTML += `<li><strong>${bs.source}</strong>: ${bs.visual_type}</li>`;
    }
    if (sourcesHTML === "") {
        sourcesHTML = "<li>No Visuals</li>";
    }
    dmMaster.fetch_data("TestNotes", [], false, {group_id: collection_item.id}).done(function(notes) {
        d3.select(".brush-space-group-list").append("div")
            .attr("class", "brush-space-group-list--item brush-space-group-list--item--"+collection_item.id)
            .html(`<p>${collection_item.x_domain[0]} - ${collection_item.x_domain[1]}</p>
                   <h3>Test</h4>
                   <small>${collection_item.id}</small>
                   <h4>Visuals:</h4>
                   <ol>${sourcesHTML}</ol>
                   <h4>Notes:</h4>
                   <p>${notes}</p>`);
        $(".brush-space-group-list--item--"+collection_item.id).click({collection_item: collection_item}, function(e) {
            add_existing_brush_space_group_to_current_scene(e.data.collection_item);
            $('#findGroupModal').modal('hide');
        });
    }).fail(function(e) {
        console.log("Error fetching data from "+this.id+" for source "+this.source);
    });
}

function fetchBrushSpaceGroupList() {
    return firebase.database().ref('/brush_space_groups').once('value').then(function(snapshot) {
        var collection = snapshot.val();
        for (var i in collection) {
            add_brush_space_group_to_list(collection[i]);
        }
    });
}

$("#endTestModal_endTestButton").click(function() {
    var testNotes = $("#endTestModal_testNotes").val();
    myScreen.end_tests(testNotes);
    $('#endTestModal').modal('hide');
    saveScreenDescription();
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

function saveScreenDescription() {
    var screenDescription = myScreen.toJSON();
    var updates = {};
    updates['/screens/' + selectedScreenId] = screenDescription;
    myScreen.brushSpaceGroups.forEach(function(bsg) {
        updates['/brush_space_groups/'+bsg.id] = bsg.toJSON();
    });
    return firebase.database().ref().update(updates);
}

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

function fetchScreensList() {
    return firebase.database().ref('/screens-list').once('value').then(function(snapshot) {
        var screensList = snapshot.val();
        var selectScreenYet = false;
        for (var i in screensList) {
            $("#screenSelectionDropdown").append($('<option>', {
                value: screensList[i],
                text : `Screen ${i}`,
                'data-list-key': i
            }));
            if (screensList[i] == getParameterByName('screen')) {
                fetchAndShowScreen(screensList[i], i);
                selectScreenYet = true;
            }
        }
        if (selectScreenYet === false) {
            fetchAndShowScreen(screensList[0], 0);
        }
        $("#screenSelectionDropdown").change(function(e) {
            fetchAndShowScreen($(this).val(), $(this).find(":selected").data("list-key"));
            history.pushState("", "", "./?screen="+$(this).val());
        });
        $("#addNewScreen").click(function() {
            var newScreenId = guid();
            var newPostRef = firebase.database().ref('/screens-list').push();
            var newScreenListKey = newPostRef.key;
            newPostRef.set(newScreenId);

            firebase.database().ref('/screens/' + newScreenId).set({
                id: newScreenId,
                default_domain: ["2017-01-25T05:00:00.000Z", "2017-03-03T05:00:00.000Z"],
                brush_space_groups: []
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
        $("#clearCurrentScreen").click(function() {
            myScreen.clear();
            saveScreenDescription();
        });
    });
}

function fetchAndShowScreen(screenId, screenListKey) {
    d3.select(".visual-blocks").html("");
    d3.select("#screenSelectionDropdown").property("value", screenId);
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
