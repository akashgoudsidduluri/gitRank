const axios = require("axios");

const githubHeaders = process.env.GITHUB_TOKEN
    ? {
        Authorization: `Bearer ${process.env.GITHUB_TOKEN}`
      }
    : {};

async function getUserProfile(username) {
    const response = await axios.get(
        `https://api.github.com/users/${username}`,
        { headers: githubHeaders }
    );

    return response.data;
}

async function getUserRepos(username) {
    const response = await axios.get(
        `https://api.github.com/users/${username}/repos`,
        { headers: githubHeaders }
    );

    return response.data;
}

async function getRepoContributors(owner, repo) {
    const response = await axios.get(
        `https://api.github.com/repos/${owner}/${repo}/contributors`,
        { headers: githubHeaders }
    );

    return response.data.slice(0, 3);
}

async function getUserEvents(username) {
    try {
        const response = await axios.get(
            `https://api.github.com/users/${username}/events/public`,
            { headers: githubHeaders }
        );

        return response.data;
    } catch (error) {
        console.error("Error fetching GitHub events:", error.message);
        return [];
    }
}

module.exports = {
    getUserProfile,
    getUserRepos,
    getRepoContributors,
    getUserEvents
};