var dispatch = d3.dispatch("brushchange", "brushchange-request", "hoverchange", "statechange");
var parent = d3.select(".visual-block");
var updating = true;
var update_count = 0;
var brushSpaces = [];
var state = "";

dispatch.on("brushchange-request", function(e) {
    if (updating === false) {
        updating = true;
        dispatch.call("brushchange", {}, e);
        updating = false;
    }
});

for (var i = 0; i < 3; i+=1) {
    let isContext = (i === 0);
    brushSpaces.push(new BrushSpace(dispatch, parent, i, isContext));
}
updating = false;

d3.select("body").on("keydown", function() {
    if (d3.event.keyCode === 65) {
        state = "annotation";
        d3.select(".state").text("Annotation");
        d3.select("body").style("cursor", "alias");
        dispatch.call("statechange", {}, {state: state});
    }
}).on("keyup", function() {
    if (d3.event.keyCode === 65) {
        state = "";
        d3.select(".state").text("");
        d3.select("body").style("cursor", "auto");
        dispatch.call("statechange", {}, {state: state});
    }
});
