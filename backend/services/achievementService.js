function generateAchievements({
  totalCommitContributions,
  totalPullRequestContributions,
  totalIssueContributions,
  totalReviewContributions,
  publicRepos,
  totalStars,
  accountAgeYears
}) {
  const configs = [
    { id: "commit-crusader", title: "Commit Crusader", label: "Commits", current: totalCommitContributions, target: 1000 },
    { id: "pr-pioneer", title: "PR Pioneer", label: "PRs", current: totalPullRequestContributions, target: 250 },
    { id: "issue-hunter", title: "Issue Hunter", label: "Issues", current: totalIssueContributions, target: 250 },
    { id: "code-reviewer", title: "Code Reviewer", label: "Reviews", current: totalReviewContributions, target: 200 },
    { id: "repo-builder", title: "Repo Builder", label: "Repos", current: publicRepos, target: 100 },
    { id: "star-magnet", title: "Star Magnet", label: "Stars", current: totalStars, target: 500 },
    { id: "veteran", title: "Open Source Veteran", label: "Years", current: accountAgeYears, target: 10 }
  ];

  return configs.map(ach => ({
    id: ach.id,
    title: ach.title,
    label: ach.label,
    current: ach.current,
    target: ach.target,
    unlocked: ach.current >= ach.target,
    progress: Math.min(100, Math.round((ach.current / ach.target) * 100))
  }));
}

module.exports = { generateAchievements };