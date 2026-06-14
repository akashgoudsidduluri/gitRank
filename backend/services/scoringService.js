function calculateDevScore({
    followers,
    totalStars,
    publicRepos,
    accountAgeYears,
    totalContributions
}) {
    const contributionScore =
        (Math.min(Math.log10(totalContributions + 1), 4) / 4) * 30;

    const starScore =
        (Math.min(Math.log10(totalStars + 1), 5) / 5) * 30;

    const followerScore =
        (Math.min(Math.log10(followers + 1), 4) / 4) * 15;

    const repoScore =
        (Math.min(publicRepos, 100) / 100) * 15;

    const ageScore =
        (Math.min(accountAgeYears, 10) / 10) * 10;

    const score = Math.round(
        contributionScore +
        starScore +
        followerScore +
        repoScore +
        ageScore
    );

    return { score };
}
module.exports = {
    calculateDevScore
};