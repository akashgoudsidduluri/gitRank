/**
 * Contribution Analytics Service
 * Compiles real and simulated GitHub contribution stats, heatmap, achievements, and badges.
 */

function seedRandom(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    return function() {
        const x = Math.sin(hash++) * 10000;
        return x - Math.floor(x);
    };
}

function compileContributionStats(profile, repos, events = []) {
    const username = profile.login;
    const rand = seedRandom(username);

    // 1. Process Real Event Data
    let realCommits = 0;
    let realPRs = 0;
    let realIssues = 0;
    let realPushes = 0;
    const hourlyDistribution = Array(24).fill(0);
    const dailyDistribution = Array(7).fill(0);

    events.forEach(event => {
        // Parse date for activity hours and weekday patterns
        if (event.created_at) {
            const date = new Date(event.created_at);
            const hour = date.getHours();
            const day = date.getDay(); // 0 is Sunday, 6 is Saturday
            hourlyDistribution[hour]++;
            dailyDistribution[day]++;
        }

        // Parse event types
        if (event.type === 'PushEvent') {
            realPushes++;
            if (event.payload && event.payload.commits) {
                realCommits += event.payload.commits.length;
            } else {
                realCommits += 1;
            }
        } else if (event.type === 'PullRequestEvent') {
            realPRs++;
        } else if (event.type === 'IssuesEvent') {
            realIssues++;
        }
    });

    // 2. Extrapolate and Simulate Deterministic Metrics (based on profile size)
    const publicRepos = profile.public_repos || 0;
    const totalStars = repos.reduce((acc, r) => acc + (r.stargazers_count || 0), 0);
    const followers = profile.followers || 0;
    const accountAgeYears = Number(
        (
            (new Date() - new Date(profile.created_at)) /
            (1000 * 60 * 60 * 24 * 365)
        ).toFixed(1)
    ) || 1;

    // Estimate total lifetime stats based on repos, stars, age
    const baseCommits = Math.round(publicRepos * 18 + totalStars * 2.5 + accountAgeYears * 45);
    const simulatedCommits = Math.round(baseCommits + rand() * 150) + realCommits;
    const totalCommits = Math.max(12, simulatedCommits);

    const basePRs = Math.round(publicRepos * 1.5 + totalStars * 0.4 + accountAgeYears * 3);
    const simulatedPRs = Math.round(basePRs + rand() * 15) + realPRs;
    const totalPRs = Math.max(0, simulatedPRs);

    const baseIssues = Math.round(publicRepos * 0.8 + totalStars * 0.2 + accountAgeYears * 2);
    const simulatedIssues = Math.round(baseIssues + rand() * 10) + realIssues;
    const totalIssues = Math.max(0, simulatedIssues);

    // PR Analytics details
    const prSuccessRate = Math.round(72 + (rand() * 18) + Math.min(totalStars / 50, 8)); // 72% to 98%
    const prsMerged = Math.round(totalPRs * (prSuccessRate / 100));
    const prsOpen = Math.round((totalPRs - prsMerged) * 0.3);
    const prsClosed = totalPRs - prsMerged - prsOpen;

    // Issue Analytics details
    const issueCloseRate = Math.round(55 + (rand() * 25) + Math.min(publicRepos / 20, 10)); // 55% to 90%
    const issuesClosed = Math.round(totalIssues * (issueCloseRate / 100));
    const issuesOpen = totalIssues - issuesClosed;

    // Commit Analytics details
    const averageCommitsPerPush = Number((1.8 + rand() * 1.6 + (realCommits > 0 && realPushes > 0 ? realCommits / realPushes : 0) / 2).toFixed(1));

    // 3. Peak Active Hours calculation
    let peakStartHour = 9;
    let maxActivity = 0;
    // Overlay real events hourly density with deterministic distribution
    for (let h = 0; h < 24; h++) {
        const detActivity = Math.sin((h - 8) * Math.PI / 12) + 1; // peaks in afternoon
        const currentActivity = hourlyDistribution[h] * 5 + detActivity * 10;
        if (currentActivity > maxActivity) {
            maxActivity = currentActivity;
            peakStartHour = h;
        }
    }
    const peakEndHour = (peakStartHour + 3) % 24;
    const formatHour = (h) => `${h.toString().padStart(2, '0')}:00`;
    const peakActiveHours = `${formatHour(peakStartHour)} - ${formatHour(peakEndHour)}`;

    // 4. Weekly Activity Pattern
    const weeklyCommitPattern = Array(7).fill(0).map((_, i) => {
        // weekends (0 and 6) are lower, weekdays are higher
        const weekendFactor = (i === 0 || i === 6) ? 0.3 : 1.0;
        const baseDayVal = Math.round((totalCommits / 52) * weekendFactor * (0.6 + rand() * 0.8));
        return baseDayVal + dailyDistribution[i];
    });

    // 5. Heatmap Generation (Last 365 Days)
    const heatmap = [];
    const today = new Date();
    // Generate exactly 371 days (53 weeks * 7 days) to fill the grid nicely starting on a aligned week
    const dayOfWeek = today.getDay();
    const daysToGenerate = 364 + dayOfWeek + 1; // aligns grid columns
    
    for (let i = daysToGenerate - 1; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(today.getDate() - i);
        const dateString = date.toISOString().split('T')[0];

        // Determine contribution count dynamically
        const wday = date.getDay();
        const month = date.getMonth();
        // Base probability of a contribution day (higher for active users)
        const activityDensity = Math.min(0.25 + (publicRepos / 40) + (totalStars / 150), 0.75);
        
        let count = 0;
        if (rand() < activityDensity) {
            // Weekend weight reducer
            const weekendFactor = (wday === 0 || wday === 6) ? 0.2 : 0.85;
            // Commits vary between 1 and 8
            if (rand() < weekendFactor) {
                count = Math.floor(rand() * 4) + 1;
                // Occasional high peaks (e.g. 5 to 8 contributions)
                if (rand() < 0.1) {
                    count += Math.floor(rand() * 4) + 3;
                }
            }
        }

        // Overlay real events for dates matching events
        events.forEach(event => {
            if (event.created_at) {
                const eventDate = event.created_at.split('T')[0];
                if (eventDate === dateString) {
                    if (event.type === 'PushEvent' && event.payload && event.payload.commits) {
                        count += event.payload.commits.length;
                    } else {
                        count += 1;
                    }
                }
            }
        });

        heatmap.push({
            date: dateString,
            count
        });
    }

    // 6. Achievements Panel
    const achievements = [
        {
            id: 'commit_crusader',
            title: 'Commit Crusader',
            description: 'Push 100+ lifetime commits.',
            icon: 'FaCodeBranch',
            unlocked: totalCommits >= 100,
            unlockProgress: Math.min(Math.round((totalCommits / 100) * 100), 100)
        },
        {
            id: 'pr_pioneer',
            title: 'PR Pioneer',
            description: 'Merge 5+ pull requests successfully.',
            icon: 'FaGitBranch',
            unlocked: prsMerged >= 5,
            unlockProgress: Math.min(Math.round((prsMerged / 5) * 100), 100)
        },
        {
            id: 'star_magnet',
            title: 'Star Magnet',
            description: 'Earn 30+ total community repository stars.',
            icon: 'FaStar',
            unlocked: totalStars >= 30,
            unlockProgress: Math.min(Math.round((totalStars / 30) * 100), 100)
        },
        {
            id: 'bug_squasher',
            title: 'Bug Squasher',
            description: 'Actively resolve and participate in 8+ issues.',
            icon: 'FaExclamationCircle',
            unlocked: totalIssues >= 8,
            unlockProgress: Math.min(Math.round((totalIssues / 8) * 100), 100)
        },
        {
            id: 'gitrank_veteran',
            title: 'GitHub Veteran',
            description: 'Maintain your GitHub account for over 3 years.',
            icon: 'FaCalendarAlt',
            unlocked: accountAgeYears >= 3.0,
            unlockProgress: Math.min(Math.round((accountAgeYears / 3.0) * 100), 100)
        }
    ];

    // 7. Custom GitRank Badges
    const badges = [];
    
    // Code Guardian Badge (based on repos & issue closure)
    let guardianLevel = 'Bronze';
    let guardianColor = '#cd7f32';
    if (publicRepos >= 25 && issueCloseRate >= 75) {
        guardianLevel = 'Gold';
        guardianColor = '#ffd700';
    } else if (publicRepos >= 10 && issueCloseRate >= 65) {
        guardianLevel = 'Silver';
        guardianColor = '#c0c0c0';
    }
    badges.push({
        id: 'code_guardian',
        label: 'Code Guardian',
        level: guardianLevel,
        color: guardianColor,
        icon: 'FaShieldAlt'
    });

    // PR Champion Badge (based on merged PRs & merge rate)
    let prLevel = 'None';
    let prColor = '#64748b';
    if (prsMerged >= 10 && prSuccessRate >= 80) {
        prLevel = 'Gold';
        prColor = '#ffd700';
    } else if (prsMerged >= 4 && prSuccessRate >= 70) {
        prLevel = 'Silver';
        prColor = '#c0c0c0';
    } else if (prsMerged > 0) {
        prLevel = 'Bronze';
        prColor = '#cd7f32';
    }
    if (prLevel !== 'None') {
        badges.push({
            id: 'pr_champion',
            label: 'PR Champion',
            level: prLevel,
            color: prColor,
            icon: 'FaAward'
        });
    }

    // Community Catalyst Badge (based on followers)
    let communityLevel = 'None';
    let communityColor = '#64748b';
    if (followers >= 100) {
        communityLevel = 'Platinum';
        communityColor = '#e5e4e2';
    } else if (followers >= 30) {
        communityLevel = 'Gold';
        communityColor = '#ffd700';
    } else if (followers >= 10) {
        communityLevel = 'Silver';
        communityColor = '#c0c0c0';
    } else if (followers >= 3) {
        communityLevel = 'Bronze';
        communityColor = '#cd7f32';
    }
    if (communityLevel !== 'None') {
        badges.push({
            id: 'community_catalyst',
            label: 'Community Catalyst',
            level: communityLevel,
            color: communityColor,
            icon: 'FaUsers'
        });
    }

    return {
        totalCommits,
        totalPRs,
        totalIssues,
        prSuccessRate,
        prsOpen,
        prsClosed,
        prsMerged,
        issueCloseRate,
        issuesOpen,
        issuesClosed,
        averageCommitsPerPush,
        peakActiveHours,
        weeklyCommitPattern,
        heatmap,
        achievements,
        badges
    };
}

module.exports = {
    compileContributionStats
};
