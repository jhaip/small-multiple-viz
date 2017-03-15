class DataModuleMaster {
    constructor(dispatch) {
        var dmFake = new DataModule(dispatch, "fake");
        var dm = new DataModuleGoogleDatastore(dispatch, "ParticleEvent");
        var dmGithub = new DataModuleGithubCommits(dispatch, "GithubCommits");
        var dmAnnotations = new DataModuleGoogleDatastoreAnnotations(dispatch, "Annotation");
        this.dmMap = {
            "fake": dmFake,
            "ParticleEvent": dm,
            "GithubCommits": dmGithub,
            "Annotation": dmAnnotations
        }
    }
    fetch_data(source, domain) {
        return this.dmMap[source].get_data({"domain": domain});
    }
}
