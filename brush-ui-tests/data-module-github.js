class DataModuleGithubCommits extends DataModule {
    fetch_data(e) {
        var that = this;
        $.ajax({
            type: "GET",
            url: "https://api.github.com/repos/jhaip/small-multiple-viz/commits",
            headers: {
                "Authorization": "Basic "+btoa("jhaip:TODO")
            },
            data: {
                sha: "master",
                // path: "index.html"
            }
        }).done(function(commits) {
            // console.log(commits);
            that.data = [];
            var parseTime = d3.timeParse("%Y-%m-%dT%H:%M:%SZ");
            commits.forEach(function(c) {
                that.data.push({"u": parseTime(c.commit.author.date), "v": 0});
            });
            that.scale.domain(e.domain);
            that.get_data(e);
        }).fail(function(err) {
            console.error(err);
        });
    }
}
