function generateRepositoryExplorer(repos) {
    const getHealth = (repo) => {
        const lastUpdate = new Date(repo.updated_at);
        const threeMonthsAgo = new Date();
        threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
        
        if (repo.stargazers_count > 50 || repo.forks_count > 10) return "Healthy";
        if (repo.stargazers_count > 5 || repo.forks_count > 2 || lastUpdate > threeMonthsAgo) return "Moderate";
        return "Inactive";
    };

    return repos
        .filter(repo => !repo.fork)
        .map(repo => ({
            name: repo.name,
            description: repo.description || "No description provided",
            language: repo.language || "Unknown",
            stars: repo.stargazers_count,
            forks: repo.forks_count,
            health: getHealth(repo),
            createdAt: repo.created_at,
            updatedAt: repo.updated_at,
            url: repo.html_url
        }));
}

module.exports = {
    generateRepositoryExplorer
};