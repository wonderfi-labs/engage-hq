"use client";

import { getCommunityActivityAction } from "@/modules/activity/actions";
import ActivityFeedRow from "@/modules/activity/components/feed/activity-feed-row";
import { Activity } from "@prisma/client";
import { useEffect, useState } from "react";

type ActivityFeed = {
  communityId: string;
};
export default function ActivityFeed({ communityId }: ActivityFeed) {
  const [activity, setActivity] = useState<Activity[]>([]);

  useEffect(() => {
    const fetchCommunityActivity = async () => {
      const communityActivity = await getCommunityActivityAction({ communityId: communityId });
      if (communityActivity?.data) {
        setActivity(communityActivity.data);
      }
    };
    fetchCommunityActivity();
  }, [communityId]);

  return (
    <div className="relative flex w-full flex-col rounded-xl bg-white shadow-md">
      <div className="flex flex-col gap-4 rounded-b-xl p-6">
        <div className="flex-1">
          <p className="mb-2 text-xl font-medium">Activity Feed</p>
        </div>
        {activity?.map((row) => {
          return <ActivityFeedRow key={row.id} activity={row} />;
        })}
      </div>
    </div>
  );
}
