class DataModuleGithubCommits extends DataModule {
    fetch_data(e, defer) {
        var that = this;
        var auth_token = Cookies.get('smv-github');
        $.ajax({
            type: "GET",
            url: "https://api.github.com/repos/jhaip/small-multiple-viz/commits",
            headers: {
                "Authorization": "Basic "+btoa("jhaip:"+auth_token)
            },
            data: {
                sha: "master",
                path: "photon/blink.ino"
            }
        }).done(function(commits) {
            that.data = [];
            var parseTime = d3.timeParse("%Y-%m-%dT%H:%M:%SZ");
            commits.forEach(function(c) {
                that.data.push({"u": parseTime(c.commit.author.date),
                                "v": 0,
                                "label": c.commit.message,
                                "commit": c.sha});
            });
            that.scale.domain(e.domain);
            that.get_data(e, defer);
        }).fail(function(err) {
            console.error(err);
        });
    }
}

class DataModuleGithubCommit extends DataModule {
    get_data(e, defer) {
        if (typeof defer === 'undefined') {
            defer = $.Deferred();
        }

        var that = this;
        var auth_token = Cookies.get('smv-github');
        $.ajax({
            type: "GET",
            url: "https://api.github.com/repos/jhaip/small-multiple-viz/contents/photon/blink.ino",
            headers: {
                "Authorization": "Basic "+btoa("jhaip:"+auth_token)
            },
            data: {
                ref: e.commit
            }
        }).done(function(result) {
            defer.resolve(atob(result.content));
        }).fail(function(err) {
            console.error(err);
            defer.reject();
        });

        return defer.promise();
    }
}
