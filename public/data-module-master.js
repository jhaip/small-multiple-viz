class DataModuleMaster {
    constructor(dispatch) {
        var dmFake = new DataModule(dispatch, "fake");
        var dm = new DataModuleGoogleDatastore(dispatch, "ParticleEvent");
        var dmGithub = new DataModuleGithubCommits(dispatch, "GithubCommits");
        var dmCommit = new DataModuleGithubCommit(dispatch, "GithubCommit");
        var dmAnnotations = new DataModuleGoogleDatastoreAnnotations(dispatch, "Annotation");
        this.dmMap = {
            "fake": dmFake,
            "ParticleEvent": dm,
            "GithubCommits": dmGithub,
            "GithubCommit": dmCommit,
            "Annotation": dmAnnotations
        }
    }
    fetch_data(source, domain) {
        return this.dmMap[source].get_data({"domain": domain});
    }
}
