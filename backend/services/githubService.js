const axios=require("axios");
async function getUserProfile(username){
    const response=await axios.get(`https://api.github.com/users/${username}`);
    return response.data;
    
}
async function getUserRepos(username) {
    const response = await axios.get(`https://api.github.com/users/${username}/repos`);
    return response.data;
}

module.exports = {
    getUserProfile,
    getUserRepos
};