class DataModule {
    constructor(dispatch) {
        this.dispatch = dispatch;
        this.data = [
            {"u": "Jan 1 2015",  "v": 28},
            {"u": "Mar 1 2015",  "v": 55},
            {"u": "May 1 2015",  "v": 28},
            {"u": "Jul 1 2015",  "v": 91},
            {"u": "Aug 1 2015",  "v": 28},
            {"u": "Jan 1 2016",  "v": 53}
        ];
        this.scale = d3.scaleTime().domain([new Date(2015, 0, 1), new Date(2016, 0, 1)]);

        var that = this;

        this.dispatch.on("fetchdata", function(e) {
            console.log("fetch data");
            console.log(e.domain);
            that.dispatch.call("newdata", {}, {
                data: that.data
            });
        });
    }
}
