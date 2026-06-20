function calculateDevScore({
    followers = 0,
    totalStars = 0,
    topRepoStars = 0,
    totalContributions = 0,
    publicRepos = 0,
    accountAgeYears = 0
} = {}) {

    const logNorm = (value, max) =>
        Math.min(Math.log1p(value) / Math.log1p(max), 1);

    // ======================
    // IMPACT (50)
    // ======================

    const starsNorm = logNorm(totalStars, 250000);
    const topRepoNorm = logNorm(topRepoStars, 250000);
    const followerNorm = logNorm(followers, 20000);

    const starsPerRepo =
        totalStars / Math.max(publicRepos, 1);

    const efficiencyNorm =
        logNorm(starsPerRepo, 200);

    const impactScore =
        starsNorm * 22 +
        topRepoNorm * 15 +
        followerNorm * 8 +
        efficiencyNorm * 5;

    // ======================
    // ACTIVITY (25)
    // ======================

    const contributionsNorm =
        logNorm(totalContributions, 2500);

    const activityScore =
        contributionsNorm * 25;

    // ======================
    // EXPERIENCE (15)
    // ======================

    const ageNorm =
        logNorm(accountAgeYears, 12);

    const repoNorm =
        logNorm(publicRepos, 100);

    const experienceScore =
        ageNorm * 10 +
        repoNorm * 5;

    // ======================
    // QUALITY BONUS (10)
    // ======================

    const qualityBonus =
        Math.pow(
            starsNorm *
            contributionsNorm *
            ageNorm,
            1 / 3
        ) * 10;

    // ======================
    // RAW SCORE
    // ======================

    const rawScore = Math.min(
        impactScore +
        activityScore +
        experienceScore +
        qualityBonus,
        100
    );

    // ======================
    // DISPLAY SCORE
    // ======================

    const displayScore =
        40 + 60 * Math.pow(rawScore / 100, 0.70);

    const score =
        Number(displayScore.toFixed(2));

    // ======================
    // TIERS
    // ======================

    let tier;

    if (score >= 99)
        tier = "Legendary";
    else if (score >= 97)
        tier = "Elite";
    else if (score >= 93)
        tier = "Expert";
    else if (score >= 85)
        tier = "Advanced";
    else if (score >= 70)
        tier = "Skilled";
    else if (score >= 55)
        tier = "Growing";
    else
        tier = "Newcomer";
    return {
        score,
        tier,
        rawScore: Number(rawScore.toFixed(2)),
        breakdown: {
            impact: Number(impactScore.toFixed(2)),
            activity: Number(activityScore.toFixed(2)),
            experience: Number(experienceScore.toFixed(2)),
            quality: Number(qualityBonus.toFixed(2)),
            starsPerRepo: Number(starsPerRepo.toFixed(2))
        }
    };
}

module.exports = { calculateDevScore };