const {
    getUserProfile,
    getUserRepos,
    getRepoContributors
} = require("../services/githubService.js");
const {calculateDevScore} =require("../services/scoringService.js");
const {analyzeDeveloper} =require("../services/AnalysisService");
const {generateRepoInsights} =require("../services/repoInsightsService.js");
const {
    generateRepositoryExplorer
} = require("../services/repositoryExplorerService");
async function analyzeProfile(req,res) {
    try{
        const username=req.params.username;
        const profile=await getUserProfile(username);
        const repos=await getUserRepos(username);

        //User Repos Analysis

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
        let {score:devScore}=calculateDevScore({followers:profile.followers,totalStars,publicRepos:profile.public_repos,accountAgeYears});
        
        //Profile Analysis

        const analysis = analyzeDeveloper({
            followers: profile.followers,
            publicRepos: profile.public_repos,
            totalStars,
            accountAgeYears
        });

        //Get Repo Insigts
        const repoInsights = generateRepoInsights(repos);
        const repositoryExplorer = generateRepositoryExplorer(repos);
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
            archetype: analysis.archetype,
            strengths: analysis.strengths,
            weaknesses: analysis.weaknesses,
            recommendations: analysis.recommendations,
            repoInsights,
            repositoryExplorer
        })
    }catch(error){
        res.status(404).json({
            status:false,
            message:"Github User Not Found"
        })
    }
}

async function getContributors(req, res) {
    try {
        const { owner, repo } = req.params;
        const contributors = await getRepoContributors(owner, repo);

        res.json(
            contributors.map(c => ({
                username: c.login,
                avatar: c.avatar_url,
                profileUrl: c.html_url,
                contributions: c.contributions
            }))
        );
    } catch (error) {
        res.status(500).json({
            message: "Unable to fetch contributors"
        });
    }
}

module.exports = {
    analyzeProfile,
    getContributors
};