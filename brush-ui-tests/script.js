var dispatch = d3.dispatch("brushchange", "brushchange-request");
var parent = d3.select("body");
var updating = true;
var update_count = 0;
var brushSpaces = [];

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
