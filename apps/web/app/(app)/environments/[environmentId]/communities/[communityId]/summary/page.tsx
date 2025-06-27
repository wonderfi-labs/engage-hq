import CommunityHeaderCard from "@/modules/communities/components/community/community-header-card";
import { CommunityStatCard } from "@/modules/communities/components/community/community-stat-card";
import { getCommunity } from "@/modules/communities/lib/communities";
import AvailableEngagements from "@/modules/discover/components/Engagements/components/available-engagements";
import CompletedSurveys from "@/modules/discover/components/Engagements/components/completed-engagements";
import PastEngagements from "@/modules/discover/components/Engagements/components/past-engagements";
import { getEnvironmentAuth } from "@/modules/environments/lib/utils";
import { PageContentWrapper } from "@/modules/ui/components/page-content-wrapper";
import { getTranslate } from "@/tolgee/server";
import { notFound } from "next/navigation";

const CommunityPage = async (props: { params: Promise<{ environmentId: string; communityId: string }> }) => {
  const params = await props.params;
  const t = await getTranslate();

  const { session } = await getEnvironmentAuth(params.environmentId);
  const currentUserId = session?.user.id;

  const communityId = params.communityId;

  if (!communityId) {
    return notFound();
  }

  const community = await getCommunity({ communityId });

  if (!community) {
    throw new Error(t("common.community_not_found"));
  }

  return (
    <PageContentWrapper>
      <CommunityHeaderCard community={community} currentUserId={currentUserId} t={t} />

      <div className="grid grid-cols-2 gap-10 pt-20">
        <CommunityStatCard
          value={community.createdSurveys || 0}
          label={t("environments.community.total_engagements")}
          icon="note"
        />
        <CommunityStatCard
          value={community.surveysCompleted || 0}
          label={t("environments.community.completed_engagements")}
          icon="note"
        />
        <CommunityStatCard
          value={
            community.createdAt
              ? new Intl.DateTimeFormat("en-US", {
                  month: "short",
                  year: "numeric",
                }).format(new Date(community.createdAt))
              : "N/A"
          }
          label={t("environments.community.community_created")}
          icon="heart"
        />
        {/* TODO: Need to calculate this still */}
        {/* <CommunityStatCard
          value={community.surveyRewards || 0}
          label={t("environments.community.total_rewards_given")}
          icon="trophy"
        /> */}
        <CommunityStatCard value={community.members?.length || 0} label={t("common.members")} icon="member" />
      </div>

      <div className="space-y-10 pt-10">
        <div className="text-2xl font-bold">
          {t("common.available_surveys")}
          <div className="grid gap-10 md:grid-cols-3">
            <AvailableEngagements searchQuery="" creatorId={community.id} />
          </div>
        </div>
        <div className="space-y-10">
          <div className="text-2xl font-bold">
            {t("common.past_surveys")}
            <div className="grid gap-10 md:grid-cols-3">
              <PastEngagements searchQuery="" creatorId={community.id} />
            </div>
          </div>
        </div>
        <div className="space-y-10">
          <div className="text-2xl font-bold">
            {t("common.completed_surveys")}
            <div className="md:rid-cols-3 grid gap-10">
              <CompletedSurveys searchQuery="" creatorId={community.id} showEmptyBorder={false} />
            </div>
          </div>
        </div>
      </div>

      {/* <SettingsId title={t("common.survey_id")} id={surveyId}></SettingsId> */}
    </PageContentWrapper>
  );
};

export default CommunityPage;
