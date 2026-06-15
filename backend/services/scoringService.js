function calculateDevScore({
    followers,
    totalStars,
    publicRepos,
    accountAgeYears,
    totalContributions
}) {
    const contributionScore =
        (Math.min(Math.log10(totalContributions + 1), 5) / 5) * 40;

    const starScore =
        (Math.min(Math.log10(totalStars + 1), 5) / 5) * 25;

    const followerScore =
        (Math.min(Math.log10(followers + 1), 5) / 5) * 15;

    const repoScore =
        (Math.min(Math.sqrt(publicRepos), 10) / 10) * 10;

    const ageScore =
        (Math.min(accountAgeYears, 10) / 10) * 10;

    const score = Math.round(
        contributionScore +
        starScore +
        followerScore +
        repoScore +
        ageScore
    );

    return {
        score,
        breakdown: {
            contributions: Math.round(contributionScore),
            stars: Math.round(starScore),
            followers: Math.round(followerScore),
            repositories: Math.round(repoScore),
            age: Math.round(ageScore)
        }
    };
}
module.exports = {
    calculateDevScore
};