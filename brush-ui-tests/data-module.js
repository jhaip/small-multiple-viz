class DataModule {
    constructor(dispatch) {
        this.dispatch = dispatch;
        this.data = [
            {"u": "Jan 1 2015",  "v": 28},
            {"u": "Mar 1 2015",  "v": 55},
            {"u": "May 1 2015",  "v": 28},
            {"u": "Jul 1 2015",  "v": 91},
            {"u": "Aug 1 2015",  "v": 28},
            // {"u": "Jan 1 2016",  "v": 53}
        ];
        this.scale = d3.scaleTime().domain([new Date(2015, 0, 1), new Date(2016, 0, 1)]);

        var that = this;

        this.dispatch.on("fetchdata", function(e) {
            that.fetch_data(e);
        });
    }
    fetch_data(e) {
        var dataInDomain = [];
        var startIndex = 0;
        var endIndex = this.data.length-1;
        for (var i=0; i<this.data.length-1; i+=1) {
            var dDate = new Date(this.data[i].u);
            if (dDate <= e.domain[0]) {
                startIndex = i;
            }
        }
        for (var i=this.data.length-1; i>0; i-=1) {
            var dDate = new Date(this.data[i].u);
            if (dDate >= e.domain[1]) {
                endIndex = i;
            }
        }
        if (new Date(this.data[0].u) <= e.domain[1] && new Date(this.data[this.data.length-1].u) >= e.domain[0]) {
            dataInDomain = this.data.slice(startIndex, endIndex+1);
        }

        this.dispatch.call("newdata", {}, {
            data: dataInDomain
        });
    }
}
