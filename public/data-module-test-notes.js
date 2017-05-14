class DataModuleTestNotes {
    constructor(dispatch, source) {
        this.dispatch = dispatch;
        this.data = {};
        this.source = source;
    }
    fetch_data(e, defer) {
        var that = this;
        var storage = firebase.storage();

        firebase.database().ref('/notes/'+e.group_id).once('value').then(function(snapshot) {
            var testData = snapshot.val() || "";
            that.data[e.group_id] = testData;
            that.get_data(e, defer);
        });
    }
    get_data(e, defer) {
        if (typeof defer === 'undefined') {
            defer = $.Deferred();
        }
        if (typeof e.requestingBrushSpaceData !== 'undefined' && e.requestingBrushSpaceData.group_id) {
            e.group_id = e.requestingBrushSpaceData.group_id
        }
        if (!(e.group_id in this.data)) {
            e.ignorecache = false; // remove property to avoid a loop
            this.fetch_data(e, defer);
            return defer.promise();
        }

        var testData = this.data[e.group_id];
        return defer.resolve(testData);
    }
    save_data(e) {
        var defer = $.Deferred();
        var updates = {};
        updates['/notes/'+e.requestingBrushSpaceData.group_id] = e.data;
        this.data[e.requestingBrushSpaceData.group_id] = e.data;  // update cache
        firebase.database().ref().update(updates).then(function(e) {
            return defer.resolve();
        });

        return defer;
    }
}
