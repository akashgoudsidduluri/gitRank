import ProfileHeader from "../components/ProfileHeader";
import StatsGrid from "../components/StatsGrid";
import SpotlightRepo from "../components/SpotlightRepo";
import SmartAnalysis from "../components/SmartAnalysis";

function OverviewTab({ profile }) {
  return (
    <>
      <ProfileHeader profile={profile} />

      <StatsGrid profile={profile} />

      <SpotlightRepo profile={profile} />

      <SmartAnalysis profile={profile} />
    </>
  );
}

export default OverviewTab;