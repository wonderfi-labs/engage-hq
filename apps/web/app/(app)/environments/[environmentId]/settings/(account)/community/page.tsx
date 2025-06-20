import { AccountSettingsNavbar } from "@/app/(app)/environments/[environmentId]/settings/(account)/components/AccountSettingsNavbar";
import { getEnvironmentAuth } from "@/modules/environments/lib/utils";
import { PageContentWrapper } from "@/modules/ui/components/page-content-wrapper";
import { PageHeader } from "@/modules/ui/components/page-header";
import { SettingsId } from "@/modules/ui/components/settings-id";
import { getTranslate } from "@/tolgee/server";
import { hasUserEnvironmentAccess } from "@formbricks/lib/environment/auth";
import { getUser } from "@formbricks/lib/user/service";
import { SettingsCard } from "../../components/SettingsCard";
import { EditCommunityForm } from "./components/EditCommunityForm";

const Page = async (props: { params: Promise<{ environmentId: string }> }) => {
  const params = await props.params;
  const t = await getTranslate();
  const { environmentId } = params;

  const { session } = await getEnvironmentAuth(params.environmentId);

  const user = session?.user ? await getUser(session.user.id) : null;

  if (!user) {
    throw new Error(t("common.user_not_found"));
  }

  const hasAccess = await hasUserEnvironmentAccess(session.user.id, params.environmentId);

  return (
    <PageContentWrapper>
      <PageHeader pageTitle={t("common.account_settings")}>
        <AccountSettingsNavbar environmentId={environmentId} activeId="community" hasAccess={hasAccess} />
      </PageHeader>
      {user && (
        <div>
          <SettingsCard
            title={t("common.community_profile")}
            description={t("environments.settings.profile.update_community_info")}>
            <EditCommunityForm user={user} environmentId={environmentId} session={session} />
          </SettingsCard>

          <SettingsId title={t("common.profile")} id={user.id}></SettingsId>
        </div>
      )}
    </PageContentWrapper>
  );
};

export default Page;
