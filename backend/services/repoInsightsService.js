function generateRepoInsights(repos) {
    const originalRepos = repos.filter(repo => !repo.fork);

    const originalRepoCount = originalRepos.length;

    // Language Analysis
    const languageCount = {};

    originalRepos.forEach(repo => {
        if (!repo.language) return;

        languageCount[repo.language] =
            (languageCount[repo.language] || 0) + 1;
    });

    // Most Used Language
    let mostUsedLanguage = "N/A";
    let maxLanguageCount = 0;

    Object.entries(languageCount).forEach(([language, count]) => {
        if (count > maxLanguageCount) {
            maxLanguageCount = count;
            mostUsedLanguage = language;
        }
    });

    // Language Breakdown
    const totalLanguageRepos =
        Object.values(languageCount).reduce(
            (sum, count) => sum + count,
            0
        ) || 1;

    const languageBreakdown = Object.entries(languageCount)
        .map(([language, count]) => ({
            language,
            count,
            percentage: Number(
                ((count / totalLanguageRepos) * 100).toFixed(1)
            )
        }))
        .sort((a, b) => b.count - a.count);

    // Most Forked Repo
    const mostForkedRepo =
        repos.length > 0
            ? repos.reduce((max, repo) =>
                  repo.forks_count > max.forks_count
                      ? repo
                      : max
              )
            : null;

    // Newest Repo
    const newestRepo =
        repos.length > 0
            ? repos.reduce((newest, repo) =>
                  new Date(repo.created_at) >
                  new Date(newest.created_at)
                      ? repo
                      : newest
              )
            : null;

    // Oldest Repo
    const oldestRepo =
        repos.length > 0
            ? repos.reduce((oldest, repo) =>
                  new Date(repo.created_at) <
                  new Date(oldest.created_at)
                      ? repo
                      : oldest
              )
            : null;

    // Star Statistics
    const reposWithStars = repos.filter(
        repo => repo.stargazers_count > 0
    ).length;

    const reposWithoutStars = repos.filter(
        repo => repo.stargazers_count === 0
    ).length;

    const starredRepoPercentage =
        repos.length > 0
            ? Number(
                  (
                      (reposWithStars / repos.length) *
                      100
                  ).toFixed(1)
              )
            : 0;

    // Fork Statistics
    const totalForks = repos.reduce(
        (sum, repo) => sum + repo.forks_count,
        0
    );

    const averageForksPerRepo =
        repos.length > 0
            ? Number(
                  (totalForks / repos.length).toFixed(2)
              )
            : 0;

    
    return {
        mostUsedLanguage,

        languageBreakdown,

        originalRepoCount,

        reposWithStars,

        reposWithoutStars,

        starredRepoPercentage,

        averageForksPerRepo,

        mostForkedRepo: mostForkedRepo
            ? {
                  name: mostForkedRepo.name,
                  forks: mostForkedRepo.forks_count,
                  url: mostForkedRepo.html_url
              }
            : null,

        newestRepo: newestRepo
            ? {
                  name: newestRepo.name,
                  createdAt: newestRepo.created_at,
                  url: newestRepo.html_url
              }
            : null,

        oldestRepo: oldestRepo
            ? {
                  name: oldestRepo.name,
                  createdAt: oldestRepo.created_at,
                  url: oldestRepo.html_url
              }
            : null,
        originalRepoCount,
        starredRepoPercentage
    };
}

module.exports = {
    generateRepoInsights
};