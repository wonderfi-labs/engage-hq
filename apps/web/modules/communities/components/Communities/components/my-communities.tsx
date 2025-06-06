"use client";

import { getCurrentUserCommunitiesAction } from "@/modules/communities/actions";
import { MyCommunityCard } from "@/modules/communities/components/common/my-community-card";
import LoadingEngagementCard from "@/modules/discover/components/common/loading-card";
import { useTranslate } from "@tolgee/react";
import React, { useCallback, useEffect, useState } from "react";
import { TUserWhitelistInfo } from "@formbricks/types/user";

interface MyCommunitiesProps {
  searchQuery?: string;
  environmentId: string;
}

export function MyComunities({ searchQuery = "", environmentId }: MyCommunitiesProps): React.JSX.Element {
  const [isLoading, setIsLoading] = useState(true);
  const [communities, setCommunities] = useState<TUserWhitelistInfo[]>([]);
  const { t } = useTranslate();

  // Fetching available communities
  const fetchCommunities = useCallback(async () => {
    setIsLoading(true);
    const data = await getCurrentUserCommunitiesAction({
      query: searchQuery,
    });
    if (data && data.data) {
      setCommunities(data.data);
    } else {
      setCommunities([]);
    }
    setIsLoading(false);
  }, [searchQuery]);

  useEffect(() => {
    fetchCommunities();
  }, [fetchCommunities, searchQuery]);

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4">
        <h3 className="text-lg font-medium capitalize leading-6 text-slate-900">
          {t("common.communities_i_joined")}
        </h3>
        <div className="grid md:grid-cols-4 md:gap-4">
          <LoadingEngagementCard />
          <LoadingEngagementCard />
          <LoadingEngagementCard />
          <LoadingEngagementCard />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <h3 className="text-lg font-medium capitalize leading-6 text-slate-900">
        {t("common.communities_i_joined")}
      </h3>
      <div className="grid md:grid-cols-4 md:gap-4">
        {communities &&
          communities.length > 0 &&
          communities.map((community) => {
            return <MyCommunityCard environmentId={environmentId} key={community.id} creator={community} />;
          })}
      </div>
    </div>
  );
}

export default MyComunities;
