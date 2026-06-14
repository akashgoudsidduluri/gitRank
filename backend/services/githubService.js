const axios=require("axios");
async function getUserProfile(username){
    const response=await axios.get(`https://api.github.com/users/${username}`);
    return response.data;
    
}
async function getUserRepos(username) {
    const response = await axios.get(`https://api.github.com/users/${username}/repos`);
    return response.data;
}
async function getRepoContributors(owner, repo) {
    const response = await axios.get(
        `https://api.github.com/repos/${owner}/${repo}/contributors`
    );

    return response.data.slice(0, 3);
}
async function getUserEvents(username) {
    try {
        const response = await axios.get(`https://api.github.com/users/${username}/events/public`);
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