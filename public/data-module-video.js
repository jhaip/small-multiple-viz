class DataModuleVideoFeed extends DataModule {
    finish_fetch_data(e, defer) {
        this.scale.domain(e.domain);
        this.get_data(e, defer);
    }
    fetch_frame(e, defer, dateKey, thumbnailList, storage, desiredLength) {
        var that = this;
        var storageRef = storage.ref(thumbnailList[dateKey]);
        storageRef.getDownloadURL().then(function(url) {
            that.data.push({"u": new Date(parseInt(dateKey)),
                            "thumbnail_url": url});
            if (that.data.length === desiredLength) {
                that.finish_fetch_data(e, defer);
            }
        }).catch(function(error) {
            that.data.push({"u": new Date(dateKey),
                            "thumbnail_url": "MISSING"});
            console.error(error);
        });
    }
    fetch_data(e, defer) {
        var that = this;
        var storage = firebase.storage();

        firebase.database().ref('/videos/0/thumbnails').once('value').then(function(snapshot) {
            var thumbnailList = snapshot.val();
            that.data = [];
            var desiredLength = Object.keys(thumbnailList).length;
            for (var dateKey in thumbnailList) {
                that.fetch_frame(e, defer, dateKey, thumbnailList, storage, desiredLength);
            }

        });

    }
}
