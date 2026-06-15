const axios = require("axios");

const githubHeaders = {
    Authorization: `Bearer ${process.env.GITHUB_TOKEN}`
};

async function getContributionAnalytics(username) {
    const query = `
        query($username: String!) {
            user(login: $username) {
                contributionsCollection {
                    totalCommitContributions
                    totalIssueContributions
                    totalPullRequestContributions
                    totalPullRequestReviewContributions

                    contributionCalendar {
                        totalContributions

                        weeks {
                            contributionDays {
                                contributionCount
                                date
                            }
                        }
                    }
                }
            }
        }
    `;

    const response = await axios.post(
        "https://api.github.com/graphql",
        {
            query,
            variables: {
                username
            }
        },
        {
            headers: {
                ...githubHeaders,
                "Content-Type": "application/json"
            }
        }
    );

    return response.data.data.user.contributionsCollection;
}

module.exports = {
    getContributionAnalytics
};