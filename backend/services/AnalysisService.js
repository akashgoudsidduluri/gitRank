function analyzeDeveloper(profile){
    const strengths = [];
    const weaknesses = [];
    const recommendations = [];
    const {
        followers,
        publicRepos,
        totalStars,
        accountAgeYears
    } = profile;
    if(publicRepos>=20){
        strengths.push(
            "Healthy repository count"
        );
    }else{
        weaknesses.push(
            "Low repository count"
        );

        recommendations.push(
            "Build more public projects"
        );
    }
    if(accountAgeYears >= 2){
        strengths.push(
            "Consistent GitHub activity"
        );
    }

    if(totalStars >= 10){
        strengths.push(
            "Projects have community interest"
        );
    } else {
        weaknesses.push(
            "Low project adoption"
        );

        recommendations.push(
            "Focus on fewer high-quality projects"
        );
    }

    if(followers >= 20){
        strengths.push(
            "Growing developer visibility"
        );
    } else {
        weaknesses.push(
            "Limited community reach"
        );

        recommendations.push(
            "Contribute to open-source projects"
        );
    }

    let archetype = "Explorer";

    if(totalStars > 50){
        archetype = "Builder";
    }

    if(totalStars > 200){
        archetype = "Creator";
    }

    if(followers > 500){
        archetype = "Community Leader";
    }

    return {
        strengths,
        weaknesses,
        recommendations,
        archetype
    };
}

module.exports = {
    analyzeDeveloper
};
