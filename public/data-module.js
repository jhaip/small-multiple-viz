class DataModule {
    constructor(dispatch, source) {
        this.dispatch = dispatch;
        this.data = [];
        this.source = source;
        this.scale = d3.scaleTime();

        var that = this;

        this.dispatch.on("brushchange.datamodule--"+this.source, function(e) {
            that.get_data(e);
        });
    }
    fetch_data(e, defer) {
        var that = this;
        that.data = [
            {"u": "Jan 26 2017",  "v": 91},
            {"u": "Jan 30 2017",  "v": 28},
            {"u": "Jan 31 2017",  "v": 55},
            {"u": "Feb 1 2017",  "v": 28},
            {"u": "Feb 2 2017",  "v": 91}
        ];
        that.scale.domain(e.domain);
        that.get_data(e, defer);
    }
    get_data(e, defer) {
        if (typeof defer === 'undefined') {
            defer = $.Deferred();
        }
        if (e.domain[0] < this.scale.domain()[0] || e.domain[1] > this.scale.domain()[1] || e.ignorecache) {
            e.ignorecache = false; // remove property to avoid a loop
            this.fetch_data(e, defer);
            return defer.promise();
        }

        var dataInDomain = [];
        var startIndex = 0;
        var endIndex = this.data.length-1;
        for (var i=0; i<this.data.length-1; i+=1) {
            var dDate = new Date(this.data[i].u);
            if (dDate <= e.domain[0]) {
                startIndex = i;
            } else {
                break;
            }
        }
        for (var i=this.data.length-1; i>0; i-=1) {
            var dDate = new Date(this.data[i].u);
            if (dDate >= e.domain[1]) {
                endIndex = i;
            } else {
                break;
            }
        }
        if (this.data.length > 0 && this.scale.domain()[0] <= e.domain[1] && this.scale.domain()[1] >= e.domain[0]) {
            dataInDomain = this.data.slice(startIndex, endIndex+1);
        }

        return defer.resolve(dataInDomain);
    }
    save_data(e) {
        return $.Deferred().resolve("");
    }
}
