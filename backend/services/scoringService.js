function calculateDevScore({
    followers,
    totalStars,
    publicRepos,
    accountAgeYears
}) {
    let score = 0;
    score += Math.min(Math.log10(followers + 1), 4) / 4 * 30;
    score += Math.min(Math.log10(totalStars + 1), 4) / 4 * 40;
    score += Math.min(publicRepos, 100) / 100 * 20;
    score += Math.min(accountAgeYears, 10) / 10 * 10;
    score= Math.round(score);
    return {
        score
    };
}

module.exports = {
    calculateDevScore
};