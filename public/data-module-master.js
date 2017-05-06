class DataModuleMaster {
    constructor(dispatch) {
        var dmFake = new DataModule(dispatch, "fake");
        var dm = new DataModuleGoogleDatastore(dispatch, "ParticleEvent");
        var dmGithub = new DataModuleGithubCommits(dispatch, "GithubCommits");
        var dmCommit = new DataModuleGithubCommit(dispatch, "GithubCommit");
        var dmAnnotations = new DataModuleGoogleDatastoreAnnotations(dispatch, "Annotation");
        var dmVideoFeed = new DataModuleVideoFeed(dispatch, "VideoFeed");
        var dmTestNotes = new DataModuleTestNotes(dispatch, "TestNotes");
        this.dmMap = {
            "fake": dmFake,
            "ParticleEvent": dm,
            "GithubCommits": dmGithub,
            "GithubCommit": dmCommit,
            "Annotation": dmAnnotations,
            "VideoFeed": dmVideoFeed,
            "TestNotes": dmTestNotes
        }
    }
    fetch_data(source, domain, ignorecache = false, requestingBrushSpaceData) {
        return this.dmMap[source].get_data({"domain": domain,
                                            "ignorecache": ignorecache,
                                            "requestingBrushSpaceData": requestingBrushSpaceData});
    }
    save_data(source, data, requestingBrushSpaceData) {
        return this.dmMap[source].save_data({"source": source,
                                             "data": data,
                                             "requestingBrushSpaceData": requestingBrushSpaceData});
    }
}
