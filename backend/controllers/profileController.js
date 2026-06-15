const {
    getUserProfile,
    getUserRepos,
    getRepoContributors,
    getUserEvents,
    getUserPRCount,
    getUserIssueCount
} = require("../services/githubService.js");
const {getContributionAnalytics} = require("../services/githubGraphqlService");
const {calculateDevScore} =require("../services/scoringService.js");
const {analyzeDeveloper} =require("../services/AnalysisService");
const {generateRepoInsights} =require("../services/repoInsightsService.js");
const {
    generateRepositoryExplorer
} = require("../services/repositoryExplorerService");
const { generateAchievements } = require("../services/achievementService");
const { generateBadges } = require("../services/badgeService");

async function analyzeProfile(req,res) {
    try{
        const username=req.params.username;
        const [
            profile,
            repos,
            events,
            totalPRs,
            totalIssues
        ] = await Promise.all([
            getUserProfile(username),
            getUserRepos(username),
            getUserEvents(username),
            getUserPRCount(username),
            getUserIssueCount(username)
        ]);

        // Graceful GraphQL Handling
        let contributionAnalytics = null;
        try {
            contributionAnalytics = await getContributionAnalytics(username);
        } catch (err) {
            console.error("GraphQL failed", err);
        }

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
        
        const contributionSummary = {
            totalContributions:
                contributionAnalytics?.contributionCalendar?.totalContributions || 0,
            totalCommitContributions:
                contributionAnalytics?.totalCommitContributions || 0,
            totalPullRequestContributions:
                contributionAnalytics?.totalPullRequestContributions || 0,
            totalIssueContributions:
                contributionAnalytics?.totalIssueContributions || 0,
            totalReviewContributions:
                contributionAnalytics?.totalPullRequestReviewContributions || 0,
            heatmap:
                contributionAnalytics?.contributionCalendar?.weeks || []
        };

        let { score: devScore, breakdown: devScoreBreakdown } = calculateDevScore({
            followers: profile.followers,
            totalStars,
            publicRepos: profile.public_repos,
            accountAgeYears,
            totalContributions:
                contributionSummary.totalContributions
        });

        const badges = generateBadges({
            score: devScore,
            totalContributions:
            contributionSummary.totalContributions,
            totalStars,
            publicRepos: profile.public_repos
        });

        const achievements = generateAchievements({
            totalCommitContributions:
            contributionSummary.totalCommitContributions,

            totalPullRequestContributions:
            contributionSummary.totalPullRequestContributions,

            totalIssueContributions:
            contributionSummary.totalIssueContributions,

            totalReviewContributions:
            contributionSummary.totalReviewContributions,

            publicRepos: profile.public_repos,
            totalStars,
            accountAgeYears
        });

        // Profile Completion Check
        const profileCompletion = Math.round(
            ([
                profile.bio,
                profile.avatar_url,
                profile.location,
                profile.blog,
                profile.email,
                profile.company,
                profile.twitter_username
            ].filter(Boolean).length / 7) * 100
        );

        let osRank = "Top 90%";
        if (devScore >= 80) osRank = "Top 1%";
        else if (devScore >= 60) osRank = "Top 15%";
        else if (devScore >= 40) osRank = "Top 40%";
        else if (devScore >= 20) osRank = "Top 70%";

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
            devScoreBreakdown,
            profileCompletion,
            osRank,
            archetype: analysis.archetype,
            strengths: analysis.strengths,
            weaknesses: analysis.weaknesses,
            recommendations: analysis.recommendations,
            repoInsights,
            repositoryExplorer,
            contributionSummary,
            achievements,
            badges
        });
    }catch(error){
        console.error("PROFILE ANALYSIS ERROR:", error);
        res.status(500).json({
            status:false,
            message:"Failed to analyze profile"
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