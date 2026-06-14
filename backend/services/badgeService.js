function generateBadges({
  score,
  totalContributions,
  totalStars,
  publicRepos
}) {
  const badges = [];

  if (score >= 90) {
    badges.push({
      title: "GitRank Legend",
      tier: "Platinum"
    });
  } else if (score >= 75) {
    badges.push({
      title: "GitRank Elite",
      tier: "Gold"
    });
  } else if (score >= 50) {
    badges.push({
      title: "GitRank Builder",
      tier: "Silver"
    });
  } else {
      badges.push({
        title: "GitRank Explorer",
        tier: "Bronze"
      });
  }

  if (totalContributions >= 500) {
    badges.push({
      title: "Open Source Explorer",
      tier: "Gold"
    });
  }

  if (totalStars >= 100) {
    badges.push({
      title: "Community Favorite",
      tier: "Gold"
    });
  }

  if (publicRepos >= 25) {
    badges.push({
      title: "Maintainer Material",
      tier: "Silver"
    });
  }

  return badges;
}

module.exports = { generateBadges };