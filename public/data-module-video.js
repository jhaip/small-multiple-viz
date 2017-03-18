class DataModuleVideoFeed extends DataModule {
    fetch_data(e, defer) {
        var that = this;
        var storage = firebase.storage();

        if (that.data.length) return;
        
        firebase.database().ref('/videos/0/thumbnails').once('value').then(function(snapshot) {
            var thumbnailList = snapshot.val();
            that.data = [];
            for (var dateKey in thumbnailList) {
                var storageRef = storage.ref(thumbnailList[dateKey]);
                storageRef.getDownloadURL().then(function(url) {
                    console.log(`${dateKey} : ${url}`);
                    that.data.push({"timestamp": new Date(dateKey),
                                    "thumbnail_url": url});

                }).catch(function(error) {
                    console.error(error);
                });

                that.scale.domain(e.domain);
                that.get_data(e, defer);
            }
        });

    }
}
