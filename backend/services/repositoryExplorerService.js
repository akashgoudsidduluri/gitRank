function generateRepositoryExplorer(repos) {
    return repos
        .filter(repo => !repo.fork)
        .map(repo => ({
            name: repo.name,
            description: repo.description || "No description provided",
            language: repo.language || "Unknown",
            stars: repo.stargazers_count,
            forks: repo.forks_count,
            createdAt: repo.created_at,
            updatedAt: repo.updated_at,
            url: repo.html_url
        }));
}

module.exports = {
    generateRepositoryExplorer
};