var dispatch = d3.dispatch("brushchange",
                           "brushchange-request",
                           "hoverchange",
                           "statechange",
                           "fetchdata",
                           "newdata");
var parent = d3.select(".visual-block");
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

var dm = new DataModule(dispatch);

for (var i = 0; i < 2; i+=1) {
    let isContext = (i === 0);
    brushSpaces.push(new BrushSpace(dispatch, parent, i, isContext));
}
brushSpaces.push(new BrushSpaceVega(dispatch, parent, 3, false));
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

this.dispatch.call("brushchange-request", {}, {
    range: [0,1],
    domain: [new Date(2015, 0, 1), new Date(2016, 6, 1)],
    source: "",
    iscontext: false
});
