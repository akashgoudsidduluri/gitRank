function calculateDevScore({
    followers,
    totalStars,
    publicRepos,
    accountAgeYears,
    totalContributions
}) {
    const contributionScore =
        (Math.min(Math.log10(totalContributions + 1), 4) / 4) * 35;

    const starScore =
        (Math.min(Math.log10(totalStars + 1), 4) / 4) * 25;

    const followerScore =
        (Math.min(Math.log10(followers + 1), 3) / 3) * 15;

    const repoScore =
        (Math.min(Math.sqrt(publicRepos), 10) / 10) * 15;

    const ageScore =
        (Math.min(accountAgeYears, 8) / 8) * 10;

    const rawScore =
        contributionScore +
        starScore +
        followerScore +
        repoScore +
        ageScore;

    // Soft boost for average developers
    const score = Math.min(
        100,
        Math.round(Math.pow(rawScore / 100, 0.75) * 100)
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