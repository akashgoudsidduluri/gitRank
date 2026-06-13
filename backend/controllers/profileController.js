const {getUserProfile,getUserRepos} =require("../services/githubService.js");
const {calculateDevScore} =require("../services/scoringService.js");
async function analyzeProfile(req,res) {
    try{
        const username=req.params.username;
        const profile=await getUserProfile(username);
        const repos=await getUserRepos(username);
        let topRepo=null;
        let maxStars=0;
        let totalStars=0;
        let topRepoUrl = null;
        let createdDate=new Date(profile.created_at);
        let currentDate=new Date();
        const accountAgeYears = Number(
            (
                (currentDate - createdDate) /
                (1000 * 60 * 60 * 24 * 365)
            ).toFixed(1)
        );
        repos.forEach(repo => {
            if(repo.stargazers_count>maxStars){
                maxStars=repo.stargazers_count;
                topRepo=repo.name;
                topRepoUrl = repo.html_url;
            }
            totalStars+=repo.stargazers_count;
        });
        let averageStarsPerRepo=(repos.length>0 ?totalStars/repos.length:0).toFixed(2);
        let {score:devScore,tier}=calculateDevScore({followers:profile.followers,totalStars,publicRepos:profile.public_repos,accountAgeYears});
        res.json({
            username: profile.login,
            followers: profile.followers,
            following: profile.following,
            avatar: profile.avatar_url,
            accountAgeYears,
            publicRepos: profile.public_repos,
            totalStars,
            averageStarsPerRepo,
            topRepo,
            topRepoUrl,
            topRepoStars: maxStars,
            devScore,
            tier
        })
    }catch(error){
        res.status(404).json({
            status:false,
            message:"Github User Not Found"
        })
    }

}
module.exports={
    analyzeProfile
}